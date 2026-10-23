/**
 * The other players' choice on a scene (E-6): one line under the decision
 * reveal saying how many of their windows here staked the same card --
 * "같은 카드를 고른 분석관 47%" -- and "드문 선택" when it is the minority's.
 *
 * The numbers are the server's (`scene_choice_rates()`, a once-a-day snapshot
 * of the case rows players sent with the research box ticked, D3's frame);
 * this module only reads the answer and words it. Asking is
 * `useSceneChoiceRates`'s.
 */

/** Windows and runs a scene needs before anything is printed: D3's floor (SCENE_TRACE_FLOOR). */
export const SCENE_CHOICE_FLOOR = 50;

/** A share under this is the minority's: 「드문 선택」 (사용자 확인 후보). */
export const RARE_CHOICE_PERCENT = 20;

export const SCENE_CHOICE_COPY = {
  line: (percent, rare) => `같은 카드를 고른 분석관 ${percent}%${rare ? " · 드문 선택" : ""}`,
};

/**
 * `{ windows, percent, rare }` for one card, or null: no answer, a case,
 * scene or card the answer does not hold, a scene under the floor, or numbers
 * that are not whole, or a percent outside 0 to 100.
 */
export function readSceneChoiceRate(data, scene) {
  const { caseId, nodeId, choiceId } = scene ?? {};
  if (!data || typeof data !== "object" || Array.isArray(data) || typeof caseId !== "string") return null;
  const scenes = Object.hasOwn(data, caseId) ? data[caseId] : null;
  if (!scenes || typeof scenes !== "object" || Array.isArray(scenes) || !Object.hasOwn(scenes, nodeId)) return null;
  const pair = scenes[nodeId];
  if (!Array.isArray(pair) || pair.length !== 2) return null;
  const [windows, cards] = pair;
  if (!Number.isInteger(windows) || windows < SCENE_CHOICE_FLOOR) return null;
  if (!cards || typeof cards !== "object" || Array.isArray(cards) || !Object.hasOwn(cards, choiceId)) return null;
  const percent = cards[choiceId];
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) return null;
  return { windows, percent, rare: percent < RARE_CHOICE_PERCENT };
}

/** The line the reveal prints, or null for none (offline, or a sample too small). */
export function getSceneChoiceLine(data, scene, online = true) {
  if (online === false) return null;
  const rate = readSceneChoiceRate(data, scene);
  return rate ? SCENE_CHOICE_COPY.line(rate.percent, rate.rare) : null;
}
