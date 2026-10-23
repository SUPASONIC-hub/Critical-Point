import { useMemo, useState } from "react";

import { NEW_GAME_PLUS_KEY, NEW_GAME_PLUS_MEMORY_KEY, readNewGamePlusMemory, readStoredValue, writeStoredValue } from "../appConfig.js";
import { getSeasonCarry, getSeasonComparison, normalizeSeasonRecord, recordFinishedSeason, SEASON_RECORD_KEY, withEndingBook } from "./newGamePlusCarry.js";
import { pastPicks, readPastPicksRecord, storePastPicks } from "./pastPicks.js";
import { createSecondSeason } from "./secondSeason.js";
import { pastSeenScenes, readSeenRecord, storeSeenScenes } from "./seenScenes.js";

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
 * The record as this device has it, with its 결말 도감 lines (endingBook.js)
 * written back when they are missing or were written by older copy: a record
 * kept before the book, or before a line changed, shows the book on the next
 * start screen. A device with no counted season writes nothing.
 */
export function refreshSeasonRecord() {
  const stored = readStoredValue(SEASON_RECORD_KEY, null);
  const record = normalizeSeasonRecord(stored);
  if (record.seasons === 0) return record;
  const refreshed = withEndingBook(record);
  const written = JSON.stringify(refreshed);
  if (written !== stored) writeStoredValue(SEASON_RECORD_KEY, written);
  return refreshed;
}

/**
 * What the season about to start is handed (`getSeasonCarry`), read from
 * storage at the press: the record, or the NEW GAME+ memory of a device that
 * finished a season before the record was kept. Null before any season ended.
 */
export function readSeasonCarry() {
  return getSeasonCarry(readStoredValue(SEASON_RECORD_KEY, null), readNewGamePlusMemory());
}

/**
 * Counts a finished season's scenes as read (seenScenes.js, E-1): the season
 * as the finale closed it and the finale's `log`, the whole season's. Returns
 * the record as it now stands, or null when there is no closed finale or log.
 */
export function storeSeasonScenes(finishedSeason, { log = null } = {}) {
  const final = seasonToRemember(finishedSeason)?.final;
  return final && Array.isArray(log) ? storeSeenScenes({ runId: final.runId ?? null, log }) : null;
}

/**
 * Writes a finished season's picks over the last season's (pastPicks.js,
 * B-14(1) 「지난 시즌의 당신」): the card picked last in each scene of the
 * finale's `log`. Returns the record as it now stands, or null when there is
 * no closed finale or log. A NEW GAME+ run reads it back (`picksBefore`).
 */
export function storeSeasonPicks(finishedSeason, { log = null } = {}) {
  const final = seasonToRemember(finishedSeason)?.final;
  return final && Array.isArray(log) ? storePastPicks({ runId: final.runId ?? null, log }) : null;
}

/** What a run folds: for a NEW GAME+ run, the scenes the seasons before it read; otherwise null. */
export function seenBefore(seenRecord, runId, veteran) {
  return veteran === true ? pastSeenScenes(seenRecord, runId) : null;
}

/** What a run marks (B-14(1)): for a NEW GAME+ run, the cards the season before it picked; otherwise null. */
export function picksBefore(picksRecord, runId, veteran) {
  return veteran === true ? pastPicks(picksRecord, runId) : null;
}

export function useNewGamePlus(saved, runId = null, veteran = false) {
  const [unlocked, setUnlocked] = useState(
    () => readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true" || Boolean(saved?.caseResults?.final),
  );
  const [memory, setMemory] = useState(readNewGamePlusMemory);
  // The season record as this tab last wrote or read it: the intro's memory
  // panel and continue card, and the finale's comparison line, read it. Read
  // once per mount, writing the book's lines back when they are stale.
  const [seasonRecord, setSeasonRecord] = useState(refreshSeasonRecord);
  // What the second season shows of the one before it (secondSeason.js):
  // the season number, and for a NEW GAME+ run the last season's cases and ruling.
  // The scenes the seasons before read (seenScenes.js, E-1), which a NEW GAME+ run folds.
  const [seenRecord, setSeenRecord] = useState(readSeenRecord);
  // The cards the season before picked (pastPicks.js, B-14(1)), which a NEW GAME+ run marks.
  const [picksRecord, setPicksRecord] = useState(readPastPicksRecord);
  const secondSeason = useMemo(
    () =>
      createSecondSeason({
        record: seasonRecord,
        memory,
        runId,
        veteran,
        seen: seenBefore(seenRecord, runId, veteran),
        picks: picksBefore(picksRecord, runId, veteran),
      }),
    [seasonRecord, memory, runId, veteran, seenRecord, picksRecord],
  );

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
   * GAME+ calls this with nothing, which counts nothing. `finale.log` is the
   * season's log, whose scenes are counted as read (`storeSeenScenes`) and
   * whose picks are kept for the season after (`storeSeasonPicks`).
   */
  function unlock(finishedSeason = null, finale = {}) {
    setUnlocked(true);
    writeStoredValue(NEW_GAME_PLUS_KEY, "true");
    rememberSeason(finishedSeason);
    if (finishedSeason) setSeasonRecord(storeSeasonRecord(finishedSeason, finale));
    const seen = storeSeasonScenes(finishedSeason, finale);
    if (seen) setSeenRecord(seen);
    const picks = storeSeasonPicks(finishedSeason, finale);
    if (picks) setPicksRecord(picks);
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
