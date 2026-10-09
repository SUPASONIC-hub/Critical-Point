/**
 * Which of the table's rules a case plays under.
 *
 * Every rule used to be on from 프롤로그 01: the beat, LOCK and its three
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
 * The rules a step can turn on. `beat` is the groove and the combo; `lock` is
 * the LOCK press, in the STRIKE stance until `stance` lets the player choose
 * one -- and with the choice come the boards a stance carries forward (STRIKE
 * WAKE, STEADY LINE, EXPOSED HAND) and the season's mastery of it. `relics`
 * is the draft a closed case offers. The other seven are the next-table
 * mutations, under the ids the engine's `MUTATIONS` catalogue uses.
 */
export const TABLE_RULES = Object.freeze([
  "beat",
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
    adds: ["beat", "blackout", "aftershock", "silence"],
    intro: [
      "심박에 맞춰 밀면 콤보가 쌓이고 판돈이 커집니다.",
      "벽에 닿으면 다음 판은 카드가 가려지고, 열기를 안은 채 시작합니다.",
    ],
  },
  {
    caseId: "prologue03",
    adds: ["coldFeet", "heatDebt"],
    intro: [
      "한 번도 밀지 않고 확정하면 다음 판에서 가장 비싼 카드가 잠깁니다.",
      "열기 60 이상에서 확정하면 다음 판은 열기를 안고 시작하고 시간이 줄어듭니다.",
    ],
  },
  {
    caseId: "prologue04",
    adds: ["fracture", "overclock", "lock"],
    intro: [
      "가장 크게 태운 자원은 다음 판에서 1.5배로 청구됩니다.",
      "×4 이상으로 두 번 잇달아 확정하면 다음 판의 칩이 2배가 되고, 밀 때 오르는 열기도 커집니다.",
      "카드를 건 뒤 심박에 맞춰 LOCK을 누르면 판돈과 자원 배율이 오릅니다. 박자를 놓치면 열기가 오릅니다.",
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
 * over them.
 */
export const UNLOCK_LADDER = Object.freeze(
  STEPS.reduce((ladder, step) => {
    const before = ladder.length ? [...ladder[ladder.length - 1].rules] : [];
    ladder.push(Object.freeze({
      caseId: step.caseId,
      adds: Object.freeze([...step.adds]),
      rules: freezeSet([...before, ...step.adds]),
      intro: Object.freeze([...step.intro]),
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
 */
export function rulesFor(caseId, options) {
  return findStep(caseId, options)?.rules ?? ALL_RULES;
}

/** What the case says about the rules it turns on; nothing when it turns none on. */
export function introFor(caseId, options) {
  return findStep(caseId, options)?.intro ?? NO_INTRO;
}

/**
 * The same two questions asked with the run in hand. `run` is the gauntlet's
 * run (the save's `dynamics`), which carries the NEW GAME+ mark.
 */
export function getTableRules(caseId, run, staged = STAGED) {
  return rulesFor(caseId, { veteran: run?.veteran === true, staged });
}

export function getUnlockIntro(caseId, run, staged = STAGED) {
  return introFor(caseId, { veteran: run?.veteran === true, staged });
}

/** The line over a case's introduction: the step's own, or the shared one. */
export function getUnlockKicker(caseId) {
  return STEP_BY_CASE.get(caseId)?.kicker ?? UNLOCK_INTRO_KICKER;
}
