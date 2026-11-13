import { GAME_EVENTS, sendGameEvent } from "./gameEvents.js";

/**
 * N12: the start page's LCP and INP on real phones, from the one page load in
 * twenty gameEvents.startVitalsSample picks. The way the web-vitals library
 * reads them, without the library: PerformanceObserver, `buffered` so what
 * happened before this chunk arrived (it is fetched after `load`) is still
 * read. LCP is the last candidate before the first press or key; INP is the
 * longest interaction, past one outlier in fifty. Both go once, as whole
 * milliseconds, when the page is first hidden (switched away from or
 * closed), which is when the web-vitals library reports them too. A browser
 * without the entry types (Safari has no `event` timing before 18) sends
 * what it has.
 */

/** INP from each interaction's longest entry: the largest, or one in fifty below it on a long page. Null with none. */
export function readInteractionToNextPaint(durations) {
  const list = [...durations].filter((value) => Number.isFinite(value) && value >= 0).sort((a, b) => b - a);
  if (!list.length) return null;
  return list[Math.min(list.length - 1, Math.floor(list.length / 50))];
}

export function watchVitals({ scope = globalThis, send = sendGameEvent } = {}) {
  const Observer = scope?.PerformanceObserver;
  const doc = scope?.document;
  if (typeof Observer !== "function" || !doc) return false;
  let lcp = 0;
  let lcpFinal = false;
  const interactions = new Map();
  const observers = [];
  const observe = (type, read, options = {}) => {
    try {
      const observer = new Observer((list) => read(list.getEntries()));
      observer.observe({ type, buffered: true, ...options });
      observers.push(observer);
    } catch {
      // An entry type this browser does not know.
    }
  };
  observe("largest-contentful-paint", (entries) => {
    const last = entries[entries.length - 1];
    if (!lcpFinal && last) lcp = Math.max(lcp, Number(last.renderTime || last.startTime) || 0);
  });
  observe(
    "event",
    (entries) => {
      for (const entry of entries) {
        if (!entry.interactionId) continue;
        interactions.set(entry.interactionId, Math.max(interactions.get(entry.interactionId) ?? 0, Number(entry.duration) || 0));
      }
    },
    { durationThreshold: 40 },
  );
  const stopLcp = () => {
    lcpFinal = true;
  };
  for (const type of ["pointerdown", "keydown"]) scope.addEventListener?.(type, stopLcp, { once: true, capture: true });

  let sent = false;
  // `pagehide` too: Safari can close a page without saying it was hidden.
  const flush = (event) => {
    if (sent || (event?.type !== "pagehide" && doc.visibilityState !== "hidden")) return;
    sent = true;
    for (const observer of observers) observer.disconnect();
    if (lcp > 0) send(GAME_EVENTS.lcp, { value: Math.round(lcp) }, scope);
    const inp = readInteractionToNextPaint(interactions.values());
    if (inp !== null) send(GAME_EVENTS.inp, { value: Math.round(inp) }, scope);
  };
  doc.addEventListener("visibilitychange", flush);
  scope.addEventListener?.("pagehide", flush);
  return true;
}
