/**
 * 첫 30분 자동 기록 (2026-11-27 결정 Q1 (1)): whether this device had any of
 * the game's saved data when the page first loaded. It is read before any
 * other module of the page runs -- main.jsx imports this file first, and it
 * imports nothing -- so nothing the page writes on its way up (the last
 * visit, the session id, the language) can make a first visit look like a
 * return. No address, no fingerprint: only the keys the game itself writes.
 *
 * The two keys a debug build reads its backend from (telemetry.js) are not the
 * game's data, so a test that sets only those is still a first visit.
 */
const GAME_KEY = /^(trigger-prototype|critical-point-)/;
const NOT_GAME_DATA = /^critical-point-telemetry-/;

/** True when some key of the game was in storage, or storage could not be read (then nothing counts as first). */
export function readHadSavedData(storage = globalThis.localStorage) {
  try {
    if (!storage) return true;
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key && GAME_KEY.test(key) && !NOT_GAME_DATA.test(key)) return true;
    }
    return false;
  } catch {
    return true;
  }
}

/** What the page saw as it loaded. */
export const hadSavedDataOnLoad = readHadSavedData();
