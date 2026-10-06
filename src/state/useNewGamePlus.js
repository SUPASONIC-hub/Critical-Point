import { useState } from "react";

import { NEW_GAME_PLUS_KEY, NEW_GAME_PLUS_MEMORY_KEY, readNewGamePlusMemory, readStoredValue, writeStoredValue } from "../appConfig.js";

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

export function useNewGamePlus(saved) {
  const [unlocked, setUnlocked] = useState(
    () => readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true" || Boolean(saved?.caseResults?.final),
  );
  const [memory, setMemory] = useState(readNewGamePlusMemory);

  function unlock() {
    setUnlocked(true);
    writeStoredValue(NEW_GAME_PLUS_KEY, "true");
  }

  function rememberSeason(caseResults) {
    const season = seasonToRemember(caseResults);
    if (!season) return false;
    writeStoredValue(NEW_GAME_PLUS_MEMORY_KEY, JSON.stringify(season));
    setMemory(season);
    return true;
  }

  return { newGamePlusUnlocked: unlocked, newGamePlusMemory: memory, unlockNewGamePlus: unlock, rememberSeason };
}
