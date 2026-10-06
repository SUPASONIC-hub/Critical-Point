/**
 * How much of the season has arrived, for the screen that is waiting on it.
 *
 * A device holding a run waits for every case before the runtime mounts
 * (state/caseArrival.js), and what it showed for that wait was one still line.
 * The store says here how many cases it has (seasonRuntime.js); the loading
 * screen reads it (components/LazyScreen.jsx). A leaf module: the loading
 * screen is in the entry chunk and the store is not.
 */
let progress = Object.freeze({ done: 0, total: 0 });
const listeners = new Set();

export function noteCasesArrived(done, total) {
  if (done === progress.done && total === progress.total) return;
  progress = Object.freeze({ done, total });
  for (const listener of listeners) listener();
}

export function getLoadProgress() {
  return progress;
}

export function subscribeLoadProgress(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
