/**
 * 11-18: which side cases a season case has just opened, for the one line on
 * its report (components/SideOpenedPanel.jsx). Kept out of src/sideCases.js,
 * which the first paint carries, so it loads with the report's chunk.
 */
import { NEW_GAME_PLUS_KEY, readStoredValue } from "./appConfig.js";
import { isSideSlotOpen, readSideRecord, SIDE_CASES } from "./sideCases.js";

/**
 * The side cases that follow `caseId` in the story (`unlockAfter`,
 * src/nodes/sidePacks.js) and were not already open another way: a closed
 * finale, NEW GAME+, or played before (in the device's side record).
 */
export function sideCasesOpenedBy(caseId, { newGamePlusUnlocked = readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true", caseResults = null, cases = SIDE_CASES, record = null } = {}) {
  if (!caseId || isSideSlotOpen({ newGamePlusUnlocked, caseResults })) return [];
  const marks = record ?? readSideRecord();
  return cases.filter((sideCase) => sideCase.unlockAfter === caseId && !marks[sideCase.id]);
}
