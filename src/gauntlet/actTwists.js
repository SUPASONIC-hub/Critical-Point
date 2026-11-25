/**
 * G5 (2026-11-19, 「전부 1」): one table twist for each of acts 3, 5 and 7
 * (B-11's acts, actCardCopy.js), under the next rules (nextTableRules.js `isNextOn`).
 *
 * After the prologue and 사건 01-03 bring in the rules, 사건 01-49 played with
 * the same numbers (the bot banked the same in every case), and N26
 * (caseRules.js) gave four cases a rule of their own. A twist is the same kind
 * of thing for a whole act, told by the act's story:
 *
 * - 3막 「사슬은 반복된다」 (사건 13-18): 합병. The group stages its reform by
 *   merging: every card's chips `MERGER_CHIPS` times, the wall's band
 *   `MERGER_SHIFT` closer. A bigger table and a nearer wall.
 * - 5막 「흩어진 자리」 (사건 25-30): 흩어진 자리. The lab's people are scattered
 *   and every desk's wall stands somewhere else: the band `SCATTER_SPREAD`
 *   wider on both sides, the chips `SCATTER_CHIPS` times.
 * - 7막 「기록의 전쟁」 (사건 37-42): 청문회. The hearing over whose records they
 *   are: the clock `HEARING_CLOCK` of itself (30% shorter), the chips `HEARING_CHIPS` times.
 *
 * Laid over the board the way N26's case rules are (gauntletEngine.js
 * `getTableSchema` via `caseRuleFor`), with the same rule: a case's own rule
 * (사건 14, 16) stands in front of the act's, and a season with a week's rule
 * plays only the week's. Acts 1, 2, 4, 6 and 8 have theirs below (RULES_MARK 6).
 *
 * A leaf module, like caseRules.js: the entries are numbers only; their words
 * are src/copy/weekRules.js `actTwists` (weeklyRules.js `getActTwist`).
 */

// G10·G11a (11-20, 게임성 개선점): 합병 벽 −4 -> −3, 칩 ×1.5 -> ×1.35; 흩어진 자리 칩 ×1.15 -> ×1; 청문회 칩 ×1.25 -> ×1.2
// (막별 심박 손 금고를 막 평균 ±15% 안으로).
export const MERGER_CHIPS = 1.35;
export const MERGER_SHIFT = 3;
export const SCATTER_SPREAD = 4;
export const SCATTER_CHIPS = 1;
export const HEARING_CLOCK = 0.7;
export const HEARING_CHIPS = 1.2;

/** The twist's numbers, in the catalogue's schema terms (weeklyRules.js `weekRuleOverlay`). */
export const ACT_TWIST_RULES = Object.freeze({
  merger: Object.freeze({ label: "MERGER", act: 3, schema: Object.freeze({ wallShift: -MERGER_SHIFT, chipsFactor: MERGER_CHIPS }) }),
  scattered: Object.freeze({ label: "SCATTERED", act: 5, schema: Object.freeze({ wallSpread: SCATTER_SPREAD, chipsFactor: SCATTER_CHIPS }) }),
  hearing: Object.freeze({ label: "HEARING", act: 7, schema: Object.freeze({ secondsFactor: HEARING_CLOCK, chipsFactor: HEARING_CHIPS }) }),
});

const span = (from, to, id) => Object.fromEntries(Array.from({ length: to - from + 1 }, (_, at) => [`case${from + at}`, id]));

/** The cases each twist is dealt in: the act's six. */
export const ACT_TWIST_CASES = Object.freeze({ ...span(13, 18, "merger"), ...span(25, 30, "scattered"), ...span(37, 42, "hearing") });

/* ---------------------------------------------- acts 1, 2, 4, 6 and 8 */

/**
 * G5's other acts (2026-11-25, RULES_MARK 6; the user's 「전부 1」 of 11-19,
 * cp-archive/메모-20261119/gameplay/G5-나머지-막-설계.md). Unlike 3, 5 and 7,
 * each of these reads something when a board closes, so a board's numbers
 * alone cannot carry it: each names a device (`devices`), and the engine asks
 * `twistHasDevice` for the one it means, the way it asks a week's rule
 * (weeklyRules.js `weekRuleHasDevice`). A twist may move the board's numbers
 * as well (`schema`, laid over the board as the others are).
 *
 * - 1막 「사슬의 시작」 (사건 04-06): 떠넘겨진 손실. The case's first BUST
 *   still leaves 1/`INSURANCE_SHARE` of its stake, and that hand's 사람 피해
 *   rises `PASSED_DOWN_HARM`. A held insurance tool goes first.
 * - 2막 「집념의 값」 (사건 10): 뒤늦은 청구서. HEAT DEBT carries
 *   `LATE_BILL_KEEP` of the heat, not 1/3; a cash under it pays every card's
 *   chips `LATE_BILL_CHIPS` times (11-20, gauntletEngine.js `getPaidChips`).
 * - 4막 「설계자」 (사건 20, 22, 23): 학습된 벽. After a cash at heat X the
 *   next board's band is [X - `TRAINED_BELOW`, X + `TRAINED_ABOVE`] within its
 *   own, at least `TRAINED_MIN_WIDTH` wide and never centred under its own
 *   (11-20 「세 막 다시 맞춤」: 6 / 14 / 12 sent a careful hand down 60%).
 * - 6막 「조사」 (사건 32-35): 진술 고정. The stance the case's first cash
 *   was made in stays to the case's end, and every cash carries it.
 * - 8막 「서명」 (사건 44, 46, 48, 49): 실명 서명. Before the first board the
 *   player signs by name only (chips `SIGN_NAME_CHIPS` times, the band
 *   `SIGN_NAME_WALL` closer) or with conditions (the band `SIGN_TERMS_WALL`
 *   further, chips `SIGN_TERMS_CHIPS` times); not choosing is conditions.
 *
 * Built one at a time: a twist is dealt only once its engine part is in
 * (`ACT_DEVICE_TWISTS_DEALT`), so no briefing promises what the table does not do.
 */

export const PASSED_DOWN_HARM = 3;
// G8 (11-20, 게임성 개선점 Q2 (1)): the debt carries 3/4 of the heat (was 1/2), and the chips under the line ×1.25 (was ×1.2).
export const LATE_BILL_KEEP = 0.75;
export const LATE_BILL_CHIPS = 1.25;
export const TRAINED_BELOW = 10;
export const TRAINED_ABOVE = 18;
export const TRAINED_MIN_WIDTH = 34;
export const SIGN_NAME_CHIPS = 1.25;
export const SIGN_NAME_WALL = 2;
export const SIGN_TERMS_WALL = 3;
export const SIGN_TERMS_CHIPS = 0.9;
/**
 * G16 (RULES_MARK 7, 2026-11-26): 「이름만」's wall is drawn for each case,
 * SIGN_NAME_WALL_LOW to SIGN_NAME_WALL_HIGH closer, and shown before the
 * choice; the season's last signature (`SIGN_LAST_CASE`) is always the
 * highest. One hand gave every one of the four cases the same answer (게임성
 * 개선점 G16), so the choice made once was the choice for the act.
 */
export const SIGN_NAME_WALL_LOW = 1;
export const SIGN_NAME_WALL_HIGH = 3;
export const SIGN_LAST_CASE = "case49";

/** 8막 실명 서명: the two ways to sign, as the board's numbers move (weeklyRules.js `weekRuleOverlay`). Not choosing is `terms`. */
export const SIGN_WAYS = Object.freeze({
  name: Object.freeze({ wallShift: -SIGN_NAME_WALL, chipsFactor: SIGN_NAME_CHIPS }),
  terms: Object.freeze({ wallShift: SIGN_TERMS_WALL, chipsFactor: SIGN_TERMS_CHIPS }),
});

/** The way a case was signed (its open snapshot's `signed`): `name` when chosen, `terms` otherwise. */
export const readSignWay = (signed) => (signed === "name" ? "name" : "terms");
/** The devices an act's twist may switch on; one a twist names outside it is not on. */
export const ACT_DEVICES = Object.freeze(["passedDown", "lateBill", "trainedWall", "onRecord", "signedByName"]);

/** The device twists' entries, in the same terms as `ACT_TWIST_RULES`. */
export const ACT_DEVICE_TWIST_RULES = Object.freeze({
  passedDown: Object.freeze({ label: "PASSED DOWN", act: 1, devices: Object.freeze(["passedDown"]) }),
  lateBill: Object.freeze({ label: "LATE BILL", act: 2, devices: Object.freeze(["lateBill"]), schema: Object.freeze({ chipsFactor: LATE_BILL_CHIPS }) }),
  trainedWall: Object.freeze({ label: "TRAINED WALL", act: 4, devices: Object.freeze(["trainedWall"]) }),
  onRecord: Object.freeze({ label: "ON RECORD", act: 6, devices: Object.freeze(["onRecord"]) }),
  signedByName: Object.freeze({ label: "SIGNED BY NAME", act: 8, devices: Object.freeze(["signedByName"]) }),
});

const cases = (ids, id) => Object.fromEntries(ids.map((n) => [`case${String(n).padStart(2, "0")}`, id]));

/**
 * The cases each device twist is dealt in. Not an act's first case (a quiet
 * table) or its last (a peak), not 사건 01-03 (the ladder), not the rest cases
 * (42, 45, 47), and not 사건 21, written as the season's quietest.
 */
export const ACT_DEVICE_CASES = Object.freeze({
  ...cases([4, 5, 6], "passedDown"),
  ...cases([10], "lateBill"),
  ...cases([20, 22, 23], "trainedWall"),
  ...cases([32, 33, 34, 35], "onRecord"),
  ...cases([44, 46, 48, 49], "signedByName"),
});

/** The device twists whose engine part is in: only these are dealt. */
export const ACT_DEVICE_TWISTS_DEALT = Object.freeze(["passedDown", "lateBill", "trainedWall", "onRecord", "signedByName"]);

/** Every twist, 3, 5 and 7 and the device ones, by id. */
export const ALL_ACT_TWIST_RULES = Object.freeze({ ...ACT_TWIST_RULES, ...ACT_DEVICE_TWIST_RULES });

/** The act's twist a case is dealt under the next rules, or null. */
export function actTwistFor(caseId, dealt = ACT_DEVICE_TWISTS_DEALT) {
  if (typeof caseId !== "string") return null;
  if (Object.hasOwn(ACT_TWIST_CASES, caseId)) return ACT_TWIST_CASES[caseId];
  const id = Object.hasOwn(ACT_DEVICE_CASES, caseId) ? ACT_DEVICE_CASES[caseId] : null;
  return id && dealt.includes(id) ? id : null;
}

/** Whether the twist `id` switches on `device`, which has to be one `ACT_DEVICES` allows. */
export function twistHasDevice(id, device) {
  if (!ACT_DEVICES.includes(device) || typeof id !== "string" || !Object.hasOwn(ACT_DEVICE_TWIST_RULES, id)) return false;
  return ACT_DEVICE_TWIST_RULES[id].devices.includes(device);
}