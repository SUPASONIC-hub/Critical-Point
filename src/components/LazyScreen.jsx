import { Component, Suspense, useEffect, useState, useSyncExternalStore } from "react";

import { chunkPanelFor, isChunkLoadError } from "../state/chunkReload.js";
import { getLoadProgress, subscribeLoadProgress } from "../state/loadProgress.js";
import { retryFailedScreens } from "../state/retryableLazy.js";
import { fill } from "../locale.js";
import loadingCopy from "../copy/loading.js";

/**
 * A lazy screen with its own way out when its chunk will not load.
 *
 * The boundary here answers that one failure and leaves the save alone;
 * anything else is thrown on to the root boundary, which is where a fault in
 * the run is recorded.
 *
 * There are two reasons a chunk does not arrive, and they are told apart by
 * whether the browser says it is online. A deploy replaced the file: the page
 * has to be loaded again, and the panel offers that. The connection is gone:
 * the file is still there, a reload would only reach the browser's offline
 * page, and the panel asks for the same screen again instead
 * (state/retryableLazy.js) -- it used to tell an offline player the game had
 * changed version.
 *
 * Two cases sit across that line, and `chunkPanelFor` (state/chunkReload.js)
 * names them: offline after a new release's worker took the page over, where
 * asking again cannot work and a reload does; and online after a retry the
 * browser would not make, where a reload is needed and no version changed.
 */
export class LazyScreen extends Component {
  state = { error: null, offline: false };

  // Whether this boundary has asked again: the next failure is told as one
  // that followed a retry.
  retried = false;

  static getDerivedStateFromError(error) {
    return { error, offline: globalThis.navigator?.onLine === false };
  }

  retry = () => {
    this.retried = true;
    retryFailedScreens();
    this.setState({ error: null, offline: false });
  };

  render() {
    const { error, offline } = this.state;
    if (!error) {
      // `quiet` is for a screen swapped in mid-run, where a status line would
      // flash between two scenes: it says nothing for QUIET_LOAD_MS.
      return <Suspense fallback={<ScreenLoading quiet={this.props.quiet} />}>{this.props.children}</Suspense>;
    }
    if (!isChunkLoadError(error)) throw error;
    const panel = chunkPanelFor({ offline, retried: this.retried });
    if (panel === "retry") {
      return (
        <main className="error-screen">
          <section className="error-panel" role="alert" data-testid="chunk-offline-panel">
            <span className="eyebrow" lang="en">CRITICAL POINT / OFFLINE</span>
            <h1>{loadingCopy.offline.title}</h1>
            <p>{loadingCopy.offline.text}</p>
            <div className="error-actions">
              <button type="button" data-testid="chunk-retry" onClick={this.retry}>
                {loadingCopy.offline.retry}
              </button>
            </div>
          </section>
        </main>
      );
    }
    return (
      <main className="error-screen">
        <section className="error-panel" role="alert" data-testid="chunk-reload-panel">
          <span className="eyebrow" lang="en">CRITICAL POINT / UPDATE</span>
          <h1>{loadingCopy.reload.title}</h1>
          <p>
            {/* Why the page has to be loaded again, for each case `chunkPanelFor` names. */}
            {loadingCopy.reload.reasons[panel]}
            {loadingCopy.reload.kept}
          </p>
          <div className="error-actions">
            <button type="button" data-testid="chunk-reload" onClick={() => globalThis.location.reload()}>
              {loadingCopy.reload.button}
            </button>
          </div>
        </section>
      </main>
    );
  }
}

// Long enough that a healthy connection never sees the hint.
const SLOW_LOAD_MS = 12_000;
// How long a quiet screen stays an empty page. A chunk the browser already
// holds is drawn within a frame or two; one that is still on its way after
// this long is a wait, and a wait is told. The page was empty until the chunk
// came, however long that took, with no status and no way out.
const QUIET_LOAD_MS = 600;

/**
 * What a lazy screen shows while its chunk arrives: a status, not a blank page.
 *
 * A device holding a run waits here for every case of the season. That wait
 * was one still line with no sign of moving and no way out: it now counts the
 * cases as they land (state/loadProgress.js), and after a while offers to load
 * the page again. The count is a progress bar to a screen reader, not a status
 * that speaks fifty-five times.
 */
function ScreenLoading({ quiet = false }) {
  const { done, total } = useSyncExternalStore(subscribeLoadProgress, getLoadProgress, getLoadProgress);
  const [told, setTold] = useState(!quiet);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const tell = globalThis.setTimeout(() => setTold(true), QUIET_LOAD_MS);
    const timer = globalThis.setTimeout(() => setSlow(true), SLOW_LOAD_MS);
    return () => {
      globalThis.clearTimeout(tell);
      globalThis.clearTimeout(timer);
    };
  }, []);
  if (!told) return <main className="shell screen-loading" aria-busy="true" />;
  // A first visit waits for one case, and a bar that reads 1/55 as it leaves
  // says the wrong thing: the bar is for the wait that takes them all.
  // Not on a quiet screen: there the cases landing are the rest of the season
  // arriving behind a run, not what this screen is waiting for.
  const counting = !quiet && total > 0 && done > 1 && done < total;
  return (
    <main className="shell screen-loading" aria-busy="true">
      <p className="save-status" role="status">
        {loadingCopy.status}
      </p>
      {counting && (
        <div
          className="screen-loading-progress"
          role="progressbar"
          aria-label={loadingCopy.progressLabel}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          data-testid="screen-loading-progress"
        >
          <i style={{ transform: `scaleX(${done / total})` }} />
          <span aria-hidden="true">
            {fill(loadingCopy.progress, { done, total })}
          </span>
        </div>
      )}
      {slow && (
        <p className="screen-loading-slow">
          {loadingCopy.slow}{" "}
          <button type="button" className="ghost" data-testid="screen-loading-retry" onClick={() => globalThis.location.reload()}>
            {loadingCopy.slowRetry}
          </button>
        </p>
      )}
    </main>
  );
}
