import { useRef, useState } from "react";
import { readStoredValue, writeStoredValue } from "../appConfig.js";
import { settleAgainstCodex } from "../state/settleChoice.js";
import { buyExtraRelic, equipRelic, rerollRelicOffer } from "./gauntletEngine.js";
import { readDraftSpend } from "./draftSpend.js";
import { normalizeRelicIds } from "./relics.js";

const RELIC_CODEX_STORAGE_KEY = "critical-point-relic-codex-v1";

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
 * relic a closed case drafted -- with the slots full, in the same call that
 * puts one down (`equip(run, relicId, dropId)`, `RELIC_SLOTS`) -- and paying
 * for that draft's 다시 뽑기 or 하나 더 (`spend(run, kind)`, spendAtDraft below).
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
 * The settling itself is `settleAgainstCodex` (state/settleChoice.js, with
 * the rest of a decision's settlement, so a server check can run it without
 * React); exported here as well for the callers that read it here.
 */
export { settleAgainstCodex };

/** The codex with these feats added, or the same codex when it already holds them. */
export function addToRelicCodex(codex, unlockedRelics = []) {
  const held = normalizeRelicIds(codex?.unlocked);
  const fresh = normalizeRelicIds(unlockedRelics).filter((id) => !held.includes(id));
  return fresh.length ? { unlocked: [...held, ...fresh] } : codex;
}

/**
 * The run after a press on one of the draft's two buys (GameRuntime's
 * spendAtDraft): paid by the engine when the button is open (readDraftSpend,
 * which is what the button shows), or the run as it was -- a key on a button
 * that is off, or a press the engine refuses, comes back unchanged, so the
 * caller saves nothing. Nothing is asked. Here rather than in draftSpend.js so
 * that sheet of reasons stays pure of the engine, and in the runtime's chunk.
 */
export function spendAtDraft(run, kind) {
  if (!readDraftSpend(run)[kind]?.open) return run;
  const paid = kind === "reroll" ? rerollRelicOffer(run) : buyExtraRelic(run);
  return paid.vault === run.vault ? run : paid;
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

  return { codex, settle, keepUnlocks, equip: equipRelic, spend: spendAtDraft };
}
