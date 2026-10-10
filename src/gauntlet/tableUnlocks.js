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
 * ones it has just turned on (`getUnlockIntro`). It imports nothing, so the
 * engine, the stage and the balance scripts can all read it. The engine only
 * ever receives a set of rules; it does not know about cases.
 *
 * Pushing, cashing, the wall and the heartbeat are the table itself and are
 * not listed: no step is without them.
 */

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
 * is the draft a closed case offers. The other seven are the next-table
 * mutations, under the ids the engine's `MUTATIONS` catalogue uses.
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
 * seven ways a decision breaks the next board. A table that is there to be read
 * past does not hand a mistake on to the scene after it. The streak, LOCK, the
 * stances and the relics stay -- they are the hand's own, and nothing they do
 * is dealt to a player who did not ask for it.
 */
export const STORY_OFF_RULES = Object.freeze(["blackout", "aftershock", "silence", "coldFeet", "heatDebt", "fracture", "overclock"]);

/** A set of rules as a story run plays it: the same set, less the seven. */
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
    intro: ["밀면 열기와 배율이 오릅니다. 벽에 닿기 전에 확정하십시오. 심박이 빨라지면 벽이 가깝습니다."],
  },
  {
    caseId: "prologue02",
    adds: ["logic", "blackout", "aftershock", "silence"],
    storyIntro: [0],
    intro: [
      "같은 생각 유형의 카드를 세 번 잇달아 고르면 논리 콤보가 쌓이고 판돈이 커집니다. 지난 판을 더 뜨겁게 닫았다면 유형을 바꿔도 콤보가 이어집니다.",
      "벽에 닿으면 다음 판은 카드가 가려지고, 열기를 안은 채 시작합니다.",
    ],
  },
  {
    caseId: "prologue03",
    adds: ["coldFeet", "heatDebt"],
    storyIntro: [],
    intro: [
      "한 번도 밀지 않고 확정하면 다음 판에서 가장 비싼 카드가 잠깁니다.",
      "열기 60 이상에서 확정하면 다음 판은 열기를 안고 시작하고 시간이 줄어듭니다.",
    ],
  },
  {
    caseId: "prologue04",
    adds: ["fracture", "overclock", "lock"],
    storyIntro: [2],
    intro: [
      "가장 크게 태운 자원은 다음 판에서 1.5배로 청구됩니다.",
      "×4 이상으로 두 번 잇달아 확정하면 다음 판의 칩이 2배가 되고, 밀 때 오르는 열기도 커집니다.",
      "카드를 건 뒤 LOCK을 누르면 판돈과 자원 배율이 오릅니다. 누를 때마다 시간이 줄어듭니다.",
    ],
  },
  {
    caseId: "prologue05",
    adds: ["stance", "relics"],
    intro: ["자세는 LOCK이 무엇을 키울지 정합니다. STRIKE는 판돈, STEADY는 식힘, EXPOSE는 자원입니다."],
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
