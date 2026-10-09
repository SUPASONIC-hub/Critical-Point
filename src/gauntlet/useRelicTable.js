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

function writeRelicCodex(codex) {
  return writeStoredValue(RELIC_CODEX_STORAGE_KEY, JSON.stringify({ unlocked: normalizeRelicIds(codex?.unlocked) }));
}

/**
 * The table's season-level systems, in one place: settling a closed window
 * against the run, recording the feats that unlock relics, and equipping the
 * relic a closed case drafted.
 *
 * The codex is the one piece of table state that outlives a season, so it has
 * its own storage key rather than a field in the save: resetting a run keeps
 * what the player unlocked. A feat proved on a case's last window counts
 * toward that case's draft, so the relic it unlocks can be offered at once.
 *
 * Settling writes nothing. The feats a window proved are returned
 * (`unlockedRelics`) and go into the codex with `keepUnlocks`, which the
 * commit calls once the save has said the decision is this player's
 * (useChoiceCommit). They used to be written as the window settled, before
 * that was known -- so a page opened from a replay link, or a tab another tab
 * had moved past, unlocked relics for good from a decision nobody kept.
 *
 * `settlement.rules` is what the case plays under (`tableUnlocks`; every rule
 * when it is left out). A feat is only counted in a case that has `relics`:
 * before that the table has not said there is such a thing, and the reveal
 * would announce a tool for a draft the player has never seen. The feat can
 * be proved again later.
 */
export function settleAgainstCodex({ offerRelics = false, ...settlement }, unlocked = []) {
  const settled = resolveWindow(settlement);
  const unlockedRelics = settlement.rules?.has("relics") === false ? [] : getRelicUnlocks(settled, unlocked);
  const drafted = settlement.caseClosed && offerRelics
    ? resolveWindow({ ...settlement, offerRelics: true, relicPool: getRelicPool([...unlocked, ...unlockedRelics]) })
    : settled;
  return { ...drafted, unlockedRelics };
}

/** The codex with these feats added, or the same codex when it already holds them. */
export function addToRelicCodex(codex, unlockedRelics = []) {
  const held = normalizeRelicIds(codex?.unlocked);
  const fresh = normalizeRelicIds(unlockedRelics).filter((id) => !held.includes(id));
  return fresh.length ? { unlocked: [...held, ...fresh] } : codex;
}

export function useRelicTable() {
  const [codex, setCodex] = useState(readRelicCodex);
  const codexRef = useRef(codex);

  function settle(settlement) {
    return settleAgainstCodex(settlement, codexRef.current.unlocked);
  }

  function keepUnlocks(unlockedRelics) {
    const next = addToRelicCodex(codexRef.current, unlockedRelics);
    if (next === codexRef.current) return;
    codexRef.current = next;
    writeRelicCodex(next);
    setCodex(next);
  }

  return { codex, settle, keepUnlocks, equip: equipRelic };
}
