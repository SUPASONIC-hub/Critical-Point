import { readStoredValue, removeStoredValue, writeStoredValue } from "../appConfig.js";

/**
 * 이번 주의 규칙 turned down on this device (결정 27 (1)): one key, read by
 * both places a season starts -- the shell's 시작, whose save the runtime
 * loads (`RUN_FIELDS.gauntletRun.load`), and the runtime's own
 * (`createRunLifecycle.startGame`). Set by the box on the start screen.
 *
 * A preference, like the comfort settings: it stays until the box is cleared,
 * across weeks, and starting over does not clear it. A season already started
 * keeps the rule it took (D3); the box only decides the next one.
 */
export const WEEK_RULE_OFF_STORAGE_KEY = "critical-point-weekly-rule-off-v1";

export function weekRuleTurnedDown() {
  return readStoredValue(WEEK_RULE_OFF_STORAGE_KEY) === "1";
}

/** Whether the device kept the choice (storage can be unavailable). */
export function setWeekRuleTurnedDown(off) {
  return off === true ? writeStoredValue(WEEK_RULE_OFF_STORAGE_KEY, "1") : removeStoredValue(WEEK_RULE_OFF_STORAGE_KEY);
}
