import { useRef, useState } from "react";
import { readStoredValue, writeStoredValue } from "../appConfig.js";
import { equipRelic, resolveWindow } from "./gauntletEngine.js";
import { getRelicPool, getRelicUnlocks, normalizeRelicIds } from "./relics.js";

export const RELIC_CODEX_STORAGE_KEY = "critical-point-relic-codex-v1";

export function parseRelicCodex(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || "{}");
    return { unlocked: normalizeRelicIds(parsed?.unlocked) };
  } catch {
    return { unlocked: [] };
  }
}

export function readRelicCodex() {
  return parseRelicCodex(readStoredValue(RELIC_CODEX_STORAGE_KEY, "{}"));
}

export function writeRelicCodex(codex) {
  return writeStoredValue(RELIC_CODEX_STORAGE_KEY, JSON.stringify({ unlocked: normalizeRelicIds(codex?.unlocked) }));
}

/**
 * The table's season-level systems, in one place: settling a closed window
 * against the run, recording the feats that unlock relics, and equipping the
 * relic a closed case drafted.
 *
 * The codex is the one piece of table state that outlives a season, so it has
 * its own storage key rather than a field in the save: resetting a run keeps
 * what the player unlocked. A feat proved on a case's last window is in the
 * codex before that case's draft is dealt, so the relic it unlocks can be
 * offered at once.
 */
export function useRelicTable() {
  const [codex, setCodex] = useState(readRelicCodex);
  const codexRef = useRef(codex);

  function settle({ offerRelics = false, ...settlement }) {
    const settled = resolveWindow(settlement);
    const unlockedRelics = getRelicUnlocks(settled, codexRef.current.unlocked);
    if (unlockedRelics.length) {
      const next = { unlocked: [...codexRef.current.unlocked, ...unlockedRelics] };
      codexRef.current = next;
      writeRelicCodex(next);
      setCodex(next);
    }
    const drafted = settlement.caseClosed && offerRelics
      ? resolveWindow({ ...settlement, offerRelics: true, relicPool: getRelicPool(codexRef.current.unlocked) })
      : settled;
    return { ...drafted, unlockedRelics };
  }

  return { codex, settle, equip: equipRelic };
}
