import { readStoredValue, writeStoredValue } from "../appConfig.js";

/**
 * The glossed words this save has already shown with their explanation
 * (improvement notes B-7, 2026-10-22). A term is explained afresh in every
 * case and on every route (writing-a-case.md), so 계열사(…) was explained 23
 * times and 부채비율(…) 16, and a sentence right before a decision could carry
 * four brackets. The words are not changed -- the copy and check:plain-language
 * stay as they are -- but once a save has seen a term explained, the page folds
 * its bracket (Prose.jsx). Kept on the device beside the save and cleared by
 * 초기화 (runStorageReset.js).
 */
const LIMIT = 400;

// Its storage key lives here and not in appConfig.js beside the others: the
// shell's chunk carries appConfig, and only the runtime reads this one
// (scripts/check-bundle-size.mjs, 2026-10-23). 초기화 clears it (runStorageReset.js).
export const SEEN_GLOSSES_KEY = "critical-point-seen-glosses-v1";

export function readSeenGlosses() {
  try {
    const list = JSON.parse(readStoredValue(SEEN_GLOSSES_KEY, "[]"));
    return new Set(Array.isArray(list) ? list.filter((term) => typeof term === "string") : []);
  } catch {
    return new Set();
  }
}

/** Adds `terms` to what the save has seen; writes only when something is new. */
export function markGlossesSeen(terms) {
  const seen = readSeenGlosses();
  const before = seen.size;
  for (const term of terms) seen.add(term);
  if (seen.size !== before) writeStoredValue(SEEN_GLOSSES_KEY, JSON.stringify([...seen].slice(-LIMIT)));
}
