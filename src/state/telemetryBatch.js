import { sendTelemetryItem } from "./telemetryQueuePolicy.js";

/**
 * What a failed send means, and one pass over the queue.
 *
 * Apart from telemetryQueuePolicy.js because that module is loaded by the intro
 * shell (error reports are sent from there), and none of this is needed until a
 * run is being played: it belongs in the runtime's chunk, not the entry's.
 */

// The database answers these 429 and 425 from 20260929010000 on. The one before
// it raised them as plain exceptions, which PostgREST answers 400 -- so until
// that migration is pushed they are told apart by what they say.
const PACE_REFUSAL = /rate limit exceeded|limit reached|daily ceiling|at least 30 seconds apart/;
const NOT_YET_REFUSAL = /requires every case of the run|implausibly short/;

/**
 * What a failed send means for the row and for the rest of the batch:
 *
 *   "permanent"    the server refuses the row itself; sending it again for
 *                  seven days changes nothing, so it is dropped.
 *   "later"        the row is fine and the moment is not (a ranking row ahead
 *                  of its run's last case). Keep it, go on with the others.
 *   "pace"         this device or its address is over its budget. Keep it and
 *                  stop: every further send only spends the same budget.
 *   "unreachable"  no answer, or the server is failing. Keep it and stop --
 *                  the loop used to walk all fifty items at ten seconds each.
 */
export function classifyTelemetryFailure(error) {
  if (error?.invalid) return "permanent";
  const status = Number(error?.status) || 0;
  const said = `${error?.serverMessage ?? ""} ${error instanceof Error ? error.message : ""}`;
  if (status === 0 || status >= 500) return "unreachable";
  if (status === 429 || (status === 400 && PACE_REFUSAL.test(said))) return "pace";
  if (status === 408 || status === 425 || (status === 400 && NOT_YET_REFUSAL.test(said))) return "later";
  return status >= 400 ? "permanent" : "unreachable";
}

export function isPermanentRefusal(error) {
  return classifyTelemetryFailure(error) === "permanent";
}

const isSeasonRow = (item) => item?.type === "case" && item?.payload?.case_id === "season-final";
const runOf = (item) => (item?.type === "case" ? item?.payload?.run_id ?? null : null);

/**
 * The order a batch is sent in, and which rows wait. A ranking row is accepted
 * only once every case row of its run has landed, so it goes after them, and
 * it is held -- not sent, not dropped -- while one of them is still queued.
 */
export function planTelemetryBatch(items) {
  const batch = Array.isArray(items) ? items : [];
  return [...batch.filter((item) => !isSeasonRow(item)), ...batch.filter(isSeasonRow)];
}

export function isHeldBehindCaseRow(item, waiting) {
  if (!isSeasonRow(item)) return false;
  const run = runOf(item);
  return waiting.some((other) => other !== item && !isSeasonRow(other) && runOf(other) !== null && runOf(other) === run);
}

/**
 * One pass over the queue. `kept` is what stays queued, in the order it was
 * queued; `aborted` means `canSend` said no part-way (consent unticked, the
 * connection gone), and the caller leaves the queue as it stands.
 *
 * Here rather than in the hook so it can be run without a renderer.
 */
export async function sendTelemetryBatch(items, { canSend = () => true, send = sendTelemetryItem } = {}) {
  const batch = Array.isArray(items) ? items : [];
  const ordered = planTelemetryBatch(batch);
  const waiting = [];
  let stopped = false;
  for (const [index, item] of ordered.entries()) {
    if (stopped) {
      waiting.push(item);
      continue;
    }
    // The player can untick consent while a send is in flight: stop there.
    if (!canSend()) return { kept: batch, aborted: true };
    // A ranking row waits for its run's case rows: the ones that failed just
    // now, and the ones still ahead of it in this batch.
    if (isHeldBehindCaseRow(item, [...waiting, ...ordered.slice(index + 1)])) {
      waiting.push(item);
      continue;
    }
    try {
      await send(item);
    } catch (error) {
      console.warn(error);
      const failure = classifyTelemetryFailure(error);
      // "permanent" is the server refusing the row itself (a payload over its
      // cap, a run that cannot rank). Sending it again changes nothing.
      if (failure !== "permanent") waiting.push(item);
      if (failure === "pace" || failure === "unreachable") stopped = true;
    }
  }
  return { kept: batch.filter((item) => waiting.includes(item)), aborted: false };
}
