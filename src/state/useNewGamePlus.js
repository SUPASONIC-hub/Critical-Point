import { useMemo, useState } from "react";

import { NEW_GAME_PLUS_KEY, NEW_GAME_PLUS_MEMORY_KEY, readNewGamePlusMemory, readStoredValue, writeStoredValue } from "../appConfig.js";
import { getSeasonCarry, getSeasonComparison, normalizeSeasonRecord, recordFinishedSeason, SEASON_RECORD_KEY } from "./newGamePlusCarry.js";
import { readSeasonRecord } from "./seasonRecord.js";
import { createSecondSeason } from "./secondSeason.js";

/**
 * What a finished season leaves for the next one: whether NEW GAME+ is open,
 * and the finished season's case summaries, which the intro shows.
 *
 * The memory is a *finished* season's. `rememberSeason` is given the case
 * results at the moment NEW GAME+ is pressed, and that can be the middle of
 * the season after -- it used to write that half season over the whole one it
 * was keeping. It writes only results that reached the finale, and answers
 * whether it did.
 */
export function seasonToRemember(caseResults) {
  return caseResults && typeof caseResults === "object" && !Array.isArray(caseResults) && caseResults.final ? caseResults : null;
}

/** Writes a finished season to the key the intro reads. Returns what was kept, or null. */
export function storeSeasonMemory(caseResults) {
  const season = seasonToRemember(caseResults);
  if (season) writeStoredValue(NEW_GAME_PLUS_MEMORY_KEY, JSON.stringify(season));
  return season;
}

/**
 * Counts a closed finale into the season record (newGamePlusCarry.js): once
 * per run, with how it ended. `finalChoiceId` is the answer to the finale's
 * last question, which the case summary does not keep. Returns the record as
 * it now stands; nothing is written for anything but a closed finale.
 */
export function storeSeasonRecord(finishedSeason, { finalChoiceId = null } = {}) {
  const before = normalizeSeasonRecord(readStoredValue(SEASON_RECORD_KEY, null));
  const finalSummary = seasonToRemember(finishedSeason)?.final;
  const after = recordFinishedSeason(before, { runId: finalSummary?.runId, finalSummary, finalChoiceId });
  const written = JSON.stringify(after);
  if (written !== JSON.stringify(before)) writeStoredValue(SEASON_RECORD_KEY, written);
  return after;
}

/**
 * What the season about to start is handed (`getSeasonCarry`), read from
 * storage at the press: the record, or the NEW GAME+ memory of a device that
 * finished a season before the record was kept. Null before any season ended.
 */
export function readSeasonCarry() {
  return getSeasonCarry(readStoredValue(SEASON_RECORD_KEY, null), readNewGamePlusMemory());
}

export function useNewGamePlus(saved, runId = null, veteran = false) {
  const [unlocked, setUnlocked] = useState(
    () => readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true" || Boolean(saved?.caseResults?.final),
  );
  const [memory, setMemory] = useState(readNewGamePlusMemory);
  // The season record as this tab last wrote or read it: the intro's memory
  // panel and continue card, and the finale's comparison line, read it.
  const [seasonRecord, setSeasonRecord] = useState(readSeasonRecord);
  // What the second season shows of the one before it (secondSeason.js):
  // the season number, and for a NEW GAME+ run the last season's cases and ruling.
  const secondSeason = useMemo(() => createSecondSeason({ record: seasonRecord, memory, runId, veteran }), [seasonRecord, memory, runId, veteran]);

  function rememberSeason(caseResults) {
    const season = storeSeasonMemory(caseResults);
    if (season) setMemory(season);
    return Boolean(season);
  }

  /**
   * `finishedSeason` is the case results as the finale closed them
   * (useChoiceCommit). The season is remembered then, not only when NEW GAME+
   * is pressed: a player who finished and then reset, or started the first
   * case again, had no results left by the time the button was pressed, and
   * the intro kept nothing of the season both questions say is kept.
   *
   * The finale's close also counts the season into the record
   * (`storeSeasonRecord`); `finale` carries its verdict choice. Pressing NEW
   * GAME+ calls this with nothing, which counts nothing.
   */
  function unlock(finishedSeason = null, finale = {}) {
    setUnlocked(true);
    writeStoredValue(NEW_GAME_PLUS_KEY, "true");
    rememberSeason(finishedSeason);
    if (finishedSeason) setSeasonRecord(storeSeasonRecord(finishedSeason, finale));
  }

  // `readSeasonCarry` and the comparison line are handed out with the rest, so
  // the runtime reads what NEW GAME+ carries without imports of its own
  // (check:runtime-budget). The line is this run's (`runId`), or null.
  return {
    newGamePlusUnlocked: unlocked,
    newGamePlusMemory: memory,
    unlockNewGamePlus: unlock,
    rememberSeason,
    readSeasonCarry,
    seasonRecord,
    seasonComparison: getSeasonComparison(seasonRecord, runId),
    secondSeason,
  };
}
