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
const MISSING_CASE_REFUSAL = /requires every case of the run/;

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
 * The queue after a batch: what it holds now, less the rows the batch sent and
 * did not keep. It starts from the queue as it stands, not from the batch as
 * it was read. A send takes seconds, and the player can clear the queue in
 * them -- unticking consent, resetting the run -- and writing the batch's
 * `kept` back put the rows they had just deleted into the save again, to go
 * out the next time consent was given.
 */
export function reconcileTelemetryQueue(current, batch, kept) {
  const sent = new Set((Array.isArray(batch) ? batch : []).map((item) => item.id));
  const keptIds = new Set((Array.isArray(kept) ? kept : []).map((item) => item.id));
  return (Array.isArray(current) ? current : []).filter((item) => !sent.has(item.id) || keptIds.has(item.id));
}

/**
 * Whether a refused ranking row is one this device can never make good.
 *
 * "requires every case of the run" is the answer to a ranking row sent a
 * moment early, and it is also the answer to a run the server will never hold
 * whole: consent ticked part way through the season, so the cases before it
 * were never sent, or a case row the server refused for good. The two used to
 * be read alike, as "later", and the second kind was sent again every five
 * minutes for the seven days the queue keeps a row, with 실패 on the result
 * page the whole time.
 *
 * They are told apart by what this device still has to send. A ranking row is
 * only sent once no case row of its run is waiting (isHeldBehindCaseRow), so
 * when the server says a case is missing there is nothing left here that could
 * supply it, and the row is let go. One thing this gives up: a run carried to
 * a second device while the first still held unsent case rows of it would have
 * ranked once those landed. That run does not rank.
 */
export function isUnrankableRefusal(item, error) {
  if (!isSeasonRow(item)) return false;
  const said = `${error?.serverMessage ?? ""} ${error instanceof Error ? error.message : ""}`;
  return MISSING_CASE_REFUSAL.test(said);
}

/**
 * One pass over the queue. `kept` is what stays queued, in the order it was
 * queued; `refused` counts the rows the server would not take and the queue
 * let go; `unranked` counts the ranking rows let go because their run is
 * missing a case row on the server and always will be; `aborted` means
 * `canSend` said no before the pass was over (consent unticked, the connection
 * gone), and the caller leaves the queue as it stands.
 *
 * `isQueued` is asked of each row before it is sent. A send takes seconds, and
 * the player can empty the queue in them and be told the rows were deleted;
 * `canSend` alone let those rows go out all the same when the box was ticked
 * again before the pass reached them.
 *
 * Here rather than in the hook so it can be run without a renderer.
 */
export async function sendTelemetryBatch(items, { canSend = () => true, isQueued = () => true, send = sendTelemetryItem } = {}) {
  const batch = Array.isArray(items) ? items : [];
  const ordered = planTelemetryBatch(batch);
  const waiting = [];
  // Runs that lost a case row in this pass: their ranking row is not sent.
  const brokenRuns = new Set();
  let stopped = false;
  let refused = 0;
  let unranked = 0;
  for (const [index, item] of ordered.entries()) {
    if (stopped) {
      waiting.push(item);
      continue;
    }
    // The player can untick consent while a send is in flight: stop there.
    if (!canSend()) return { kept: batch, aborted: true };
    // Deleted from the queue since the pass began: not sent, and not kept.
    if (!isQueued(item)) continue;
    // A ranking row waits for its run's case rows: the ones that failed just
    // now, and the ones still ahead of it in this batch.
    if (isHeldBehindCaseRow(item, [...waiting, ...ordered.slice(index + 1)])) {
      waiting.push(item);
      continue;
    }
    if (isSeasonRow(item) && brokenRuns.has(runOf(item))) {
      unranked += 1;
      continue;
    }
    try {
      await send(item);
    } catch (error) {
      console.warn(error);
      const failure = classifyTelemetryFailure(error);
      // "permanent" is the server refusing the row itself (a payload over its
      // cap, a run that cannot rank). Sending it again changes nothing.
      if (failure === "permanent") {
        refused += 1;
        if (!isSeasonRow(item) && runOf(item) !== null) brokenRuns.add(runOf(item));
      } else if (failure === "later" && isUnrankableRefusal(item, error)) unranked += 1;
      else waiting.push(item);
      if (failure === "pace" || failure === "unreachable") stopped = true;
    }
  }
  // Asked once more at the end. A pass that stopped at a failed send no longer
  // asked on the rows after it, so consent unticked during that send came back
  // as an ordinary result with every row kept.
  if (!canSend()) return { kept: batch, aborted: true, refused, unranked };
  return { kept: batch.filter((item) => waiting.includes(item)), aborted: false, refused, unranked };
}
