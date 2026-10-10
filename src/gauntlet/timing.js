/**
 * The clock the table's frame loops run on.
 *
 * Until 2026-10-10 this module also read when a press went down and graded it
 * against the heartbeat. No press is timed any more: the heartbeat is the
 * table's pressure and nothing is scored against it.
 */
export const monotonicNow = () => globalThis.performance?.now?.() ?? Date.now();
