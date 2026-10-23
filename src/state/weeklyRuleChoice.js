import { NEW_GAME_PLUS_KEY, readNewGamePlusMemory, readStoredValue, removeStoredValue, writeStoredValue } from "../appConfig.js";

/**
 * 이번 주의 규칙 as this device chose it, read by both places a season starts
 * -- the shell's 시작, whose save the runtime loads
 * (`RUN_FIELDS.gauntletRun.load`), and the runtime's own
 * (`createRunLifecycle.startGame`). Set by the box on the start screen.
 *
 * Two keys, because the default is not the same for everyone (E-8, 결정 Q6 b
 * (1), 2026-10-22): a device that has not finished a season yet starts its
 * first one without the week's rule, and ticks "이번 주의 규칙으로 시작" to
 * take it (`WEEK_RULE_ON_STORAGE_KEY`); a device that has finished one
 * starts with it, as before, and ticks "이번 주의 규칙 없이 시작" to turn it
 * down (`WEEK_RULE_OFF_STORAGE_KEY`, 결정 27 (1)). An event week is a new
 * thing for the analyst who came back, not a harder first season for one who
 * arrived that week.
 *
 * Preferences, like the comfort settings: they stay until the box is cleared,
 * across weeks, and starting over does not clear them. A season already
 * started keeps the rule it took (D3); the boxes only decide the next one.
 * The server is not asked: a season without the stamp is an ordinary season
 * there, in an event week as in any other.
 */
export const WEEK_RULE_OFF_STORAGE_KEY = "critical-point-weekly-rule-off-v1";
export const WEEK_RULE_ON_STORAGE_KEY = "critical-point-weekly-rule-on-v1";

/**
 * The season record NEW GAME+ keeps (draft #220, `SEASON_RECORD_KEY` in
 * appConfig.js there): `{ seasons }` is how many seasons this device finished.
 * Read by name here so the first season is told apart before and after that
 * record exists; before it, a finished season is NEW GAME+ unlocked or its
 * memory of a finale.
 */
export const SEASON_RECORD_STORAGE_KEY = "critical-point-season-record-v1";

/** How many seasons this device has finished: the record's count, or 1 for NEW GAME+ without one, or 0. */
export function finishedSeasons() {
  let record;
  try {
    record = JSON.parse(readStoredValue(SEASON_RECORD_STORAGE_KEY, "null"));
  } catch {
    record = null;
  }
  if (Number.isInteger(record?.seasons) && record.seasons > 0) return record.seasons;
  return readStoredValue(NEW_GAME_PLUS_KEY) === "true" || readNewGamePlusMemory().final ? 1 : 0;
}

/** Whether the season about to start is this device's first (회차 기록 seasons === 0). */
export function isFirstSeason() {
  return finishedSeasons() === 0;
}

export function weekRuleTurnedDown() {
  return readStoredValue(WEEK_RULE_OFF_STORAGE_KEY) === "1";
}

/** Whether the device kept the choice (storage can be unavailable). */
export function setWeekRuleTurnedDown(off) {
  return off === true ? writeStoredValue(WEEK_RULE_OFF_STORAGE_KEY, "1") : removeStoredValue(WEEK_RULE_OFF_STORAGE_KEY);
}

/** A first season's box: ticked, the season takes the week's rule. */
export function weekRuleTakenUp() {
  return readStoredValue(WEEK_RULE_ON_STORAGE_KEY) === "1";
}

export function setWeekRuleTakenUp(on) {
  return on === true ? writeStoredValue(WEEK_RULE_ON_STORAGE_KEY, "1") : removeStoredValue(WEEK_RULE_ON_STORAGE_KEY);
}

/** What `pickSeasonWeekRule` needs to know of this device: the season's place and both boxes. */
export function weekRuleChoice() {
  return { declined: weekRuleTurnedDown(), firstSeason: isFirstSeason(), takenUp: weekRuleTakenUp() };
}
