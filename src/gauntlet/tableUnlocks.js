/**
 * Which of the table's rules a case plays under.
 *
 * Every rule used to be on from 프롤로그 01: the streak, LOCK and its three
 * stances, the relic draft and nine ways of breaking the next board, all in
 * front of a player who had not yet pushed once. The five prologues now turn
 * them on in steps, and from 사건 01 the table is whole.
 *
 * This module is the list and the two questions asked of it -- which rules
 * does this case play under (`getTableRules`), and what does it say about the
 * ones it has just turned on (`getUnlockIntro`). It imports only two of the
 * engine's numbers that its copy quotes, and the engine does not import it, so
 * the engine, the stage and the balance scripts can all read it. The engine
 * only ever receives a set of rules; it does not know about cases.
 *
 * Pushing, cashing, the wall and the heartbeat are the table itself and are
 * not listed: no step is without them.
 */
import { LOCK_CAP, STANCE_CHARGE } from "./gauntletEngine.js";

/**
 * The switch, on since 2026-10-09. Off, every case plays under every rule and
 * no case has anything to introduce, which is the game as it was before this
 * module. The functions below take it as a last argument so a test (and the
 * balance scripts) can ask about either table whatever the shipped value is.
 */
export const STAGED = true;

/**
 * The rules a step can turn on. `logic` is the logic streak and what it pays
 * (a rule's id is derived from the case and never saved); `lock` is
 * the LOCK press, in the STRIKE stance until `stance` lets the player choose
 * one -- and with the choice come the boards a stance carries forward (STRIKE
 * WAKE, STEADY LINE, EXPOSED HAND) and the season's mastery of it. `relics`
 * is the draft a closed case offers. `scout` is SCOUT, the one look a window
 * that narrows the drawn band around the wall for table clock (B1, 11일차
 * 초안). The other seven are the next-table mutations, under the ids the
 * engine's `MUTATIONS` catalogue uses. `audit` is B3's audit (auditRisk.js)
 * and `cascade` B2's links (cascadeRisk.js), rules of the table since
 * RULES_MARK 3; before that they were 2026-W47's test week.
 */
export const TABLE_RULES = Object.freeze([
  "logic",
  "blackout",
  "aftershock",
  "silence",
  "coldFeet",
  "heatDebt",
  "fracture",
  "overclock",
  "lock",
  "stance",
  "relics",
  "scout",
  "audit",
  "cascade",
]);

/**
 * The rule each next-table mutation belongs to. REBOOT is not here: it is the
 * rules resetting when a case closes, and every step has it.
 */
export const MUTATION_RULES = Object.freeze({
  blackout: "blackout",
  aftershock: "aftershock",
  silence: "silence",
  heatDebt: "heatDebt",
  overclock: "overclock",
  coldFeet: "coldFeet",
  fracture: "fracture",
  cascade: "cascade",
  strikeWake: "stance",
  steadyLine: "stance",
  exposedHand: "stance",
  strikeMastery: "stance",
  steadyMastery: "stance",
  exposeMastery: "stance",
});

/**
 * A Set nothing can add to or take from. `Object.freeze` alone leaves a Set's
 * contents open, and these are handed to every caller as the same object.
 */
function freezeSet(values) {
  const set = new Set(values);
  const refuse = () => {
    throw new TypeError("The table's rule sets are read-only.");
  };
  set.add = refuse;
  set.delete = refuse;
  set.clear = refuse;
  return Object.freeze(set);
}

export const ALL_RULES = freezeSet(TABLE_RULES);

/**
 * The rules a story run plays without (스토리 모드, the comfort setting): the
 * seven ways a decision breaks the next board, and the audit and the links
 * (B3 and B2 decision 13), which hand a close on to the case's end and to a
 * board later. A table that is there to be read past does not hand a mistake
 * on to the scene after it. The streak, LOCK, the stances and the relics stay
 * -- they are the hand's own, and nothing they do is dealt to a player who did
 * not ask for it.
 */
export const STORY_OFF_RULES = Object.freeze(["blackout", "aftershock", "silence", "coldFeet", "heatDebt", "fracture", "overclock", "audit", "cascade"]);

/** A set of rules as a story run plays it: the same set, less those nine. */
function withoutStoryOff(rules) {
  return freezeSet([...rules].filter((rule) => !STORY_OFF_RULES.includes(rule)));
}

/** Everything a story run can have: what it plays under from 사건 01, and under NEW GAME+. */
export const STORY_RULES = withoutStoryOff(ALL_RULES);

/**
 * The line over a case's introduction of its new rules. A step may carry its
 * own (`kicker`): 프롤로그 01 adds nothing to anything, so it does not say
 * that the rules have grown.
 */
export const UNLOCK_INTRO_KICKER = "NEW PROTOCOL · 이번 사건부터 규칙이 늘어납니다";

/**
 * The steps, in the order the season plays them: the case, the rules it adds
 * to the ones before it, and what the briefing says about them. A case that
 * is not here -- 사건 01 onward -- plays under everything. 프롤로그 01 adds
 * nothing and explains the table itself.
 *
 * The draft a case shows was offered when the case before it closed, so
 * `relics` in 프롤로그 05 means the offer made as 프롤로그 04 closes.
 *
 * `storyIntro` is which of the lines a story run is told, by position: a line
 * about a rule the run plays without would describe a board it never sees.
 * Left out, the step says all of them.
 */
const STEPS = [
  {
    caseId: "prologue01",
    adds: [],
    kicker: "FIRST TABLE · 이 판은 이렇게 합니다",
    // The second line is what a bust costs, which the first table never said:
    // the first bust was the tutorial. A story run is not told it, because
    // there the next scene is not skipped.
    storyIntro: [0],
    intro: [
      "밀면 열기와 배율이 오릅니다. 벽에 닿기 전에 확정하십시오. 심박이 빨라지면 벽이 가깝습니다.",
      "벽에 닿으면 이 사건에 걸린 판돈 전부와 다음 장면을 잃습니다. 금고에 넣은 것은 그대로입니다.",
    ],
  },
  {
    caseId: "prologue02",
    adds: ["logic", "blackout", "aftershock", "silence"],
    storyIntro: [0],
    // The last sentence of the first line: the streak pays for holding a type
    // and the report's 관점 전환 score (gameLogic's `getCognitionSpread`) for
    // spreading the picks over the four, and nothing else says so before the
    // season's closing report (logicReport.js, `caption`).
    intro: [
      "같은 생각 유형의 카드를 세 번 잇달아 고르면 논리 콤보가 쌓이고 배율이 커집니다. 지난 판을 더 뜨겁게 닫았다면 유형을 바꿔도 콤보가 이어집니다. 사건 결과의 '관점 전환' 점수는 반대로 네 유형을 고르게 쓸수록 오릅니다.",
      "벽에 닿으면 다음 판은 카드가 가려지고, 열기를 안은 채 시작합니다.",
    ],
  },
  {
    caseId: "prologue03",
    adds: ["coldFeet", "heatDebt", "scout"],
    // SCOUT is the hand's own, so a story run is told it (B1 초안). The 3초 and
    // the 20 are SCOUT_SECONDS and 2 * SCOUT_REACH (tableRules.js): this module
    // imports only the two LOCK numbers, so they are written out and move with
    // the constants.
    storyIntro: [2],
    intro: [
      "한 번도 밀지 않고 확정하면 다음 판에서 가장 비싼 카드가 봉인됩니다.",
      "열기 60 이상에서 확정하면 다음 판은 열기를 안고 시작하고 시간이 줄어듭니다.",
      "조회를 누르면 시간 3초를 쓰고 벽 구간이 20칸 폭으로 좁혀집니다. 판마다 한 번이고, 벽이 그 한가운데 있다는 뜻은 아닙니다.",
    ],
  },
  {
    caseId: "prologue04",
    // The audit and the links open with FRACTURE (B3 and B2, question 3 (1)
    // of the rule switch, user 2026-10-20): the links read the burn FRACTURE
    // reads, and a cash on a board they deal is not audited, so the two are
    // told together (초안). One short line and not one each: with a line each,
    // even cut to a row or two, the panel ran past the docked footer on a
    // phone's first screen (table-keys at 390x844 and 390x664, 2026-10-21).
    // Their numbers are told where they act: the signal line's tokens, the
    // 확정 button's audit preview (`describeAuditIfCash`, which also says a
    // CASCADE board's cash leaves it as it is) and the reveal's line when a
    // link is made (`describeLinkMade`).
    // A story run has neither, so it is told only LOCK.
    adds: ["fracture", "overclock", "lock", "audit", "cascade"],
    storyIntro: [2],
    intro: [
      "가장 크게 태운 자원은 다음 판에서 1.5배로 청구됩니다.",
      "×4 이상으로 두 번 잇달아 확정하면 다음 판의 칩이 2배가 되고, 밀 때 오르는 열기도 커집니다.",
      "카드를 건 뒤 LOCK을 누르면 자원 배율이 오르고, 칩 배율은 1.5배까지 오릅니다. 누를 때마다 시간이 줄어듭니다.",
      "이번 사건부터 감사와 연결이 판에 붙습니다.",
    ],
  },
  {
    caseId: "prologue05",
    adds: ["stance", "relics"],
    // The second line is the relic slots (RELIC_OFFER_SIZE and RELIC_SLOTS in
    // relics.js, written out like SCOUT's numbers). The third is what a charge
    // does once LOCK is at its own cap (`LOCK_CAP`): nothing to this hand's
    // multiplier, and the stance's carry if it reached `STANCE_CHARGE`
    // (`applyFocusCarry`). STEADY's relief is taken off the heat there is, so
    // on a cold board before the first push it cools nothing: said in the
    // first line's brackets, as the README says it, so the four things fit
    // the phone's first screen in three lines (table-keys, 390x664). A story
    // run is told no promise about the next board, so not the third.
    storyIntro: [0, 1],
    intro: [
      "자세는 LOCK이 무엇을 키울지 정합니다. STRIKE는 배율(1.5배 상한에 가장 빨리), STEADY는 식힘(PUSH 뒤에만), EXPOSE는 자원입니다.",
      "사건이 닫힐 때마다 도구 3개 중 하나를 고릅니다. 도구는 5개까지 들고, 다 차면 하나를 내려놓고 바꿉니다.",
      `칩 배율이 ${LOCK_CAP}배에 닿은 뒤의 LOCK은 이번 판 배율에 더하지 않고, ${STANCE_CHARGE} 이상 충전해 확정하면 다음 판에서 치릅니다.`,
    ],
  },
];

/**
 * The ladder as it is read: each step with the rules it adds, every rule on
 * by then (`rules`, the ones before it and its own), its lines and the line
 * over them. `storyRules` and `storyIntro` are the same two for a story run.
 * Every set is made once, here: a caller is handed the same object each time
 * it asks, and may key a memo on it.
 */
export const UNLOCK_LADDER = Object.freeze(
  STEPS.reduce((ladder, step) => {
    const before = ladder.length ? [...ladder[ladder.length - 1].rules] : [];
    const rules = freezeSet([...before, ...step.adds]);
    ladder.push(Object.freeze({
      caseId: step.caseId,
      adds: Object.freeze([...step.adds]),
      rules,
      storyRules: withoutStoryOff(rules),
      intro: Object.freeze([...step.intro]),
      storyIntro: Object.freeze(step.storyIntro ? step.storyIntro.map((line) => step.intro[line]) : [...step.intro]),
      kicker: step.kicker ?? UNLOCK_INTRO_KICKER,
    }));
    return ladder;
  }, []),
);

const STEP_BY_CASE = new Map(UNLOCK_LADDER.map((step) => [step.caseId, step]));
const NO_INTRO = Object.freeze([]);

function findStep(caseId, { veteran = false, staged = STAGED } = {}) {
  return staged && !veteran ? STEP_BY_CASE.get(caseId) ?? null : null;
}

/**
 * The rules a case plays under, from the case alone: a replayed prologue
 * plays under its own step, however far the season has gone since. Everything
 * when the switch is off, when the run began with NEW GAME+ (`veteran`), and
 * for a case the ladder does not name.
 *
 * `story` takes the seven next-table rules out of whichever of those it is
 * (`STORY_OFF_RULES`): a prologue's step less the seven, or everything less
 * the seven.
 */
export function rulesFor(caseId, options) {
  const step = findStep(caseId, options);
  if (options?.story === true) return step?.storyRules ?? STORY_RULES;
  return step?.rules ?? ALL_RULES;
}

/**
 * What the case says about the rules it turns on; nothing when it turns none
 * on. A story run is told only about the ones it plays under.
 */
export function introFor(caseId, options) {
  const step = findStep(caseId, options);
  return (options?.story === true ? step?.storyIntro : step?.intro) ?? NO_INTRO;
}

/**
 * The same two questions asked with the run in hand. `run` is the gauntlet's
 * run (the save's `dynamics`), which carries the NEW GAME+ mark and the story
 * mark its case was opened with.
 */
export function getTableRules(caseId, run, staged = STAGED) {
  return rulesFor(caseId, { veteran: run?.veteran === true, story: run?.story === true, staged });
}

export function getUnlockIntro(caseId, run, staged = STAGED) {
  return introFor(caseId, { veteran: run?.veteran === true, story: run?.story === true, staged });
}

/** The line over a case's introduction: the step's own, or the shared one. */
export function getUnlockKicker(caseId) {
  return STEP_BY_CASE.get(caseId)?.kicker ?? UNLOCK_INTRO_KICKER;
}

/**
 * Whether the table has nothing left to introduce in this case: the case is
 * not a step of the ladder for this run. True from 사건 01 on, for a run begun
 * with NEW GAME+ in every case, and everywhere with the switch off; false in
 * the five prologues of a plain run, 프롤로그 05 included -- it plays under
 * every rule, and two of them are new there. Asked of the case alone, like
 * `rulesFor`: a prologue played again is still a step. A story run is told
 * less, but its prologues are steps all the same.
 *
 * The decision reveal reads this (`useChoiceCommit`): while a case is still
 * introducing rules the reveal is the full sheet, because it is teaching.
 */
export function isTableTaught(caseId, run, staged = STAGED) {
  return findStep(caseId, { veteran: run?.veteran === true, staged }) === null;
}

/**
 * Whether a run begun with NEW GAME+ (`veteran`) plays this case under a
 * different table from a plain run's: the case's step turns on fewer rules
 * than the whole table. Asked of the step, not of a case number, so the answer
 * moves with the ladder -- today 프롤로그 01 to 04; 프롤로그 05 already plays
 * under everything, and so does every case after it.
 *
 * The server reads the same cases off a case row's `newGamePlus` mark and its
 * `case_id` (NEWGAMEPLUS 10-21 답 1), to keep these windows out of a scene's
 * bust rate; `VETERAN_TABLE_CASES` is that list, and a unit test holds the two
 * together. With the switch off nothing differs.
 */
export function differsForVeteran(caseId, staged = STAGED) {
  return rulesFor(caseId, { staged }).size < rulesFor(caseId, { veteran: true, staged }).size;
}

export const VETERAN_TABLE_CASES = Object.freeze(UNLOCK_LADDER.map((step) => step.caseId).filter((caseId) => differsForVeteran(caseId)));
