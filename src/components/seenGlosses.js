import { readStoredValue, SEEN_GLOSSES_KEY, writeStoredValue } from "../appConfig.js";

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
