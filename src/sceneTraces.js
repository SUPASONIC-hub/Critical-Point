import { fill } from "./locale.js";
import W from "./copy/sceneRates.js";

/**
 * The other players' trace on a scene: one line under the scene page's
 * 사건 파일 saying how many of their windows here hit the wall
 * (improvement notes D3, the asynchronous form).
 *
 * The numbers are the server's (`scene_bust_rates()`, a snapshot of the case
 * rows players sent with the research box ticked); this module only reads the
 * answer and words it. Asking is `useSceneBustRates`'s.
 */

/**
 * N44 (owner's answer Q9 (1), 2026-11-18): windows a scene needs before its
 * rate is printed. Below it the line says the record is still being gathered
 * and how many windows are in -- 「모으는 중 (판단 N번)」 -- since a percent
 * of a game or two reads as a fact it is not. The server
 * (`scene_bust_rates()`, 20261122000000) sends a percent only from this many
 * windows and runs and a null below; it is checked again here so that a
 * server that answered more than it should still prints no percent below it.
 */
export const SCENE_TRACE_FLOOR = 20;

const grouped = (windows) => Number(windows).toLocaleString("en-US");

export const SCENE_TRACE_COPY = {
  // The count the rate stands on goes with it (D3, 2026-11-18): 50 windows
  // and 5,000 read differently. Grouped by thousands.
  line: (percent, windows) => fill(W.trace, { percent, windows: grouped(windows) }),
  // N44: under the floor, or a percent the server held back (too few runs).
  collecting: (windows) => fill(W.collecting, { windows: grouped(windows) }),
};

/**
 * `{ windows, percent }` for one scene, or null: no answer, a case or scene the
 * answer does not hold, or a pair that is not a whole number of windows (1 or
 * more) and a percent from 0 to 100 or null. `percent` is null under the
 * floor, whatever the server sent, and when the server sent none.
 */
export function readSceneBustRate(data, caseId, nodeId) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const scenes = Object.hasOwn(data, caseId) ? data[caseId] : null;
  if (!scenes || typeof scenes !== "object" || Array.isArray(scenes) || !Object.hasOwn(scenes, nodeId)) return null;
  const pair = scenes[nodeId];
  if (!Array.isArray(pair) || pair.length !== 2) return null;
  const [windows, percent] = pair;
  if (!Number.isInteger(windows) || windows < 1) return null;
  if (percent !== null && (!Number.isInteger(percent) || percent < 0 || percent > 100)) return null;
  return { windows, percent: windows < SCENE_TRACE_FLOOR ? null : percent };
}

/**
 * The line the page prints, or null for none. `online` false hides it: the
 * page says nothing it could not have just heard from the server.
 */
export function getSceneTraceLine(data, caseId, nodeId, online = true) {
  if (online === false) return null;
  const rate = readSceneBustRate(data, caseId, nodeId);
  if (!rate) return null;
  return rate.percent === null ? SCENE_TRACE_COPY.collecting(rate.windows) : SCENE_TRACE_COPY.line(rate.percent, rate.windows);
}
