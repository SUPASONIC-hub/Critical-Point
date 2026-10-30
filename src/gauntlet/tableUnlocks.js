/**
 * Which of the table's rules a case plays under.
 *
 * Every rule used to be on from 프롤로그 01: the streak, LOCK and its three
 * stances, the relic draft and nine ways of breaking the next board, all in
 * front of a player who had not yet pushed once. The five prologues and the
 * first three cases now turn them on in steps, and from 사건 03 the table is
 * whole. Until C-4 (the user's answer of 2026-10-25, (1)) the prologues did it
 * alone: fourteen rules in forty windows, five of them in 프롤로그 04.
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
import { LOCK_CAP, PEAK_CASES, PEAK_CHIPS, PEAK_MARK, PEAK_WALL, STANCE_CHARGE } from "./gauntletEngine.js";
import { fill } from "../locale.js";
import unlocksCopy from "../copy/unlocks.js";

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
export const UNLOCK_INTRO_KICKER = unlocksCopy.kicker;

/**
 * The steps, in the order the season plays them: the case, the rules it adds
 * to the ones before it, and what the briefing says about them. A case that
 * is not here -- 사건 04 onward -- plays under everything. 프롤로그 01 adds
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
    kicker: unlocksCopy.steps.prologue01.kicker,
    // The second line is what a bust costs, which the first table never said:
    // the first bust was the tutorial. A story run is not told it, because
    // there the next scene is not skipped.
    storyIntro: [0],
    intro: unlocksCopy.steps.prologue01.intro,
  },
  {
    caseId: "prologue02",
    adds: ["logic", "blackout", "aftershock", "silence"],
    storyIntro: [0],
    // The streak is held on a direction, 사람 or 자리 (C-3, logicStreak.js),
    // the axis the report's 일관성 reads; the last sentence of the first line
    // says the report's 관점 전환 (gameLogic's `getCognitionSpread`) pays for
    // spreading the thinking types, which a hand can do inside one direction.
    // Until 2026-10-25 the streak was held on the type and this line said the
    // two pulled against each other.
    intro: unlocksCopy.steps.prologue02.intro,
  },
  {
    caseId: "prologue03",
    adds: ["coldFeet", "heatDebt", "scout"],
    // SCOUT is the hand's own, so a story run is told it (B1 초안). The 3초 and
    // the 20 are SCOUT_SECONDS and 2 * SCOUT_REACH (tableRules.js): this module
    // imports only the two LOCK numbers, so they are written out and move with
    // the constants.
    storyIntro: [2],
    intro: unlocksCopy.steps.prologue03.intro,
  },
  {
    caseId: "prologue04",
    // Two rules, where there were five (C-4, the user's answer of 2026-10-25,
    // (1)): FRACTURE, and LOCK, which 프롤로그 05's stances need. OVERCLOCK,
    // the audit and the links open one a case in 사건 01 to 03, each with the
    // line it had here. A story run has no FRACTURE, so it is told only LOCK.
    // (Until C-4 the audit and the links opened here with FRACTURE, B3 and
    // B2, question 3 (1) of the rule switch, user 2026-10-20, in one short
    // line: with a line each the panel ran past the docked footer on a
    // phone's first screen, table-keys at 390x844 and 390x664, 2026-10-21.)
    adds: ["fracture", "lock"],
    storyIntro: [1],
    intro: unlocksCopy.steps.prologue04.intro,
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
    intro: unlocksCopy.steps.prologue05.intro,
  },
  // 사건 01 to 03 (C-4): one rule a case, each with its story's beat --
  // 72시간's clock and OVERCLOCK, 가짜 신호's audit office (감사, 49 times in
  // its scenes) and the audit, 경쟁자의 반격 and the links that bring a heavy
  // card back. All three are rules a story run plays without, so a story run
  // is told nothing in them (`storyIntro: []`).
  {
    caseId: "case01",
    adds: ["overclock"],
    storyIntro: [],
    intro: unlocksCopy.steps.case01.intro,
  },
  {
    // The audit had one short line with the links in 프롤로그 04, because five
    // lines ran past the docked footer on a phone's first screen (table-keys,
    // 2026-10-21). Alone here it has the room to say its numbers: AUDIT_HEAT,
    // AUDIT_LIMIT, AUDIT_SHARE, AUDIT_RELIEF_HEAT and AUDIT_RELIEF
    // (auditRisk.js), written out like SCOUT's and held to them by a unit test.
    // The 확정 button's preview (`describeAuditIfCash`) still says what each
    // cash does to it.
    caseId: "case02",
    adds: ["audit"],
    storyIntro: [],
    intro: unlocksCopy.steps.case02.intro,
  },
  {
    // LINK_BURN, LINK_SPAN_MIN..LINK_SPAN_MAX and LINK_WALL (cascadeRisk.js),
    // written out the same way. The reveal's line when a link is made
    // (`describeLinkMade`) and the signal line's tokens say the rest.
    caseId: "case03",
    adds: ["cascade"],
    storyIntro: [],
    intro: unlocksCopy.steps.case03.intro,
  },
];

/**
 * The ladder as it is read: each step with the rules it adds, every rule on
 * by then (`rules`, the ones before it and its own), its lines and the line
 * over them. `storyRules` and `storyIntro` are the same two for a story run.
 * Every set is made once, here: a caller is handed the same object each time
 * it asks, and may key a memo on it.
 *
 * Its lines are copied when this module is read, which on a page in another
 * language is after the dictionary has been laid over copy/unlocks.js: this
 * module is the runtime's, never the shell's, so the copies are in the page's
 * language (src/locale.js, 2026-10-26).
 */
export const UNLOCK_LADDER = Object.freeze(
  STEPS.reduce((ladder, step) => {
    // The copy's blanks are the engine's numbers (copy/unlocks.js).
    const intro = step.intro.map((line) => fill(line, { cap: LOCK_CAP, charge: STANCE_CHARGE }));
    const before = ladder.length ? [...ladder[ladder.length - 1].rules] : [];
    // The step that completes the table (사건 03 since C-4) hands out the
    // whole table's own sets, so it is the same object a case after it gets.
    const whole = before.length + step.adds.length === ALL_RULES.size;
    const rules = whole ? ALL_RULES : freezeSet([...before, ...step.adds]);
    ladder.push(Object.freeze({
      caseId: step.caseId,
      adds: Object.freeze([...step.adds]),
      rules,
      // A story run has none of 사건 01 to 03's rules, so from 사건 01 it is
      // handed the story table's own set too.
      storyRules: whole || [...STORY_RULES].every((rule) => rules.has(rule)) ? STORY_RULES : withoutStoryOff(rules),
      intro: Object.freeze(intro),
      storyIntro: Object.freeze(step.storyIntro ? step.storyIntro.map((line) => intro[line]) : [...intro]),
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
  const rules = options?.story === true ? step?.storyRules ?? STORY_RULES : step?.rules ?? ALL_RULES;
  return PEAK_CASES.includes(caseId) ? withPeak(rules) : rules;
}

/**
 * 「고점 판」 (C-10, user 2026-10-25, choice 1): the last case of each of
 * B-11's eight acts (actCardGate.js `ACT_START_CASES`: the case before each
 * act's first, and the finale) deals every board with the wall `PEAK_WALL`
 * closer and the chips `PEAK_CHIPS` thicker (`applyPeak`). Act 7 ends on 사건
 * 42, the night off at 경포 and one of B-13(3)'s quiet tables, so its peak is
 * 사건 41, the second hearing, the case before the rest. Not a rule a case
 * turns on in the ladder's sense: it is in no step, is not saved, and a
 * NEW GAME+ or story run has it too. The list is tableRules.js's, re-exported
 * here; a unit test holds it to the acts.
 *
 * The rest that answers it is each act's first case, a quiet table
 * (fxVariables.js, the quiet tables): staging only, like 42, 45 and 47.
 */
export { PEAK_CASES };
const peakSets = new Map();
function withPeak(rules) {
  if (!peakSets.has(rules)) peakSets.set(rules, freezeSet([...rules, PEAK_MARK]));
  return peakSets.get(rules);
}
const PEAK_INTRO = Object.freeze(unlocksCopy.peak.intro.map((line) => fill(line, { wall: PEAK_WALL, chips: PEAK_CHIPS })));
const PEAK_KICKER = unlocksCopy.peak.kicker;

/**
 * What the case says about the rules it turns on; nothing when it turns none
 * on. A story run is told only about the ones it plays under. A peak case
 * (`PEAK_CASES`) says it is one, under its own kicker.
 */
export function introFor(caseId, options) {
  const step = findStep(caseId, options);
  const intro = (options?.story === true ? step?.storyIntro : step?.intro) ?? NO_INTRO;
  // A peak case is never a step of the ladder (a unit test holds it), so its line is the whole of it.
  return PEAK_CASES.includes(caseId) ? PEAK_INTRO : intro;
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
  return STEP_BY_CASE.get(caseId)?.kicker ?? (PEAK_CASES.includes(caseId) ? PEAK_KICKER : UNLOCK_INTRO_KICKER);
}

/**
 * Whether the table is past teaching in this case: the case is not one of the
 * five prologues' steps for this run. True from 사건 01 on, for a run begun
 * with NEW GAME+ in every case, and everywhere with the switch off; false in
 * the five prologues of a plain run. Asked of the case alone, like
 * `rulesFor`: a prologue played again is still a step. A story run is told
 * less, but its prologues are steps all the same.
 *
 * 사건 01 to 03 are steps of the ladder since C-4 (2026-10-25) and are not
 * teaching: each opens one rule, said once on its first briefing, to a player
 * the prologues have already taught the table, so the reveal stays short
 * there as in every later case (`TEACHING_CASES`).
 *
 * The decision reveal reads this (`useChoiceCommit`): while a case is still
 * teaching the reveal is the full sheet.
 */
const TEACHING_CASES = new Set(["prologue01", "prologue02", "prologue03", "prologue04", "prologue05"]);
export function isTableTaught(caseId, run, staged = STAGED) {
  const step = findStep(caseId, { veteran: run?.veteran === true, staged });
  return step === null || !TEACHING_CASES.has(step.caseId);
}

/**
 * Whether a run begun with NEW GAME+ (`veteran`) plays this case under a
 * different table from a plain run's: the case's step turns on fewer rules
 * than the whole table. Asked of the step, not of a case number, so the answer
 * moves with the ladder -- today 프롤로그 01 to 사건 02 (C-4); 사건 03 plays
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
