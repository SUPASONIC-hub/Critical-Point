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
 * Windows a scene needs before its rate is printed, the same floor the
 * ranking's band waits for (LOGIC_RANK_FLOOR). The server applies it too and
 * leaves a smaller scene out; it is checked again here so that a server that
 * answered more than it should still prints nothing below it.
 */
export const SCENE_TRACE_FLOOR = 50;

export const SCENE_TRACE_COPY = {
  line: (percent) => `이 장면에서 다른 분석관의 ${percent}%가 벽에 닿았습니다.`,
};

/**
 * `{ windows, percent }` for one scene, or null: no answer, a case or scene the
 * answer does not hold, a scene under the floor, or a pair that is not two
 * whole numbers with the percent from 0 to 100.
 */
export function readSceneBustRate(data, caseId, nodeId) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const scenes = Object.hasOwn(data, caseId) ? data[caseId] : null;
  if (!scenes || typeof scenes !== "object" || Array.isArray(scenes) || !Object.hasOwn(scenes, nodeId)) return null;
  const pair = scenes[nodeId];
  if (!Array.isArray(pair) || pair.length !== 2) return null;
  const [windows, percent] = pair;
  if (!Number.isInteger(windows) || windows < SCENE_TRACE_FLOOR) return null;
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) return null;
  return { windows, percent };
}

/**
 * The line the page prints, or null for none. `online` false hides it: the
 * page says nothing it could not have just heard from the server.
 */
export function getSceneTraceLine(data, caseId, nodeId, online = true) {
  if (online === false) return null;
  const rate = readSceneBustRate(data, caseId, nodeId);
  return rate ? SCENE_TRACE_COPY.line(rate.percent) : null;
}
