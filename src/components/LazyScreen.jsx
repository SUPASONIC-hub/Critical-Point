import { Component, Suspense } from "react";

import { isChunkLoadError } from "../state/chunkReload.js";
import { retryFailedScreens } from "../state/retryableLazy.js";

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
 */
export class LazyScreen extends Component {
  state = { error: null, offline: false };

  static getDerivedStateFromError(error) {
    return { error, offline: globalThis.navigator?.onLine === false };
  }

  retry = () => {
    retryFailedScreens();
    this.setState({ error: null, offline: false });
  };

  render() {
    const { error, offline } = this.state;
    if (!error) {
      // `quiet` is for a screen swapped in mid-run, where a status line would
      // flash between two scenes.
      const fallback = this.props.quiet ? <main className="shell screen-loading" aria-busy="true" /> : <ScreenLoading />;
      return <Suspense fallback={fallback}>{this.props.children}</Suspense>;
    }
    if (!isChunkLoadError(error)) throw error;
    if (offline) {
      return (
        <main className="error-screen">
          <section className="error-panel" role="alert" data-testid="chunk-offline-panel">
            <span className="eyebrow">CRITICAL POINT / OFFLINE</span>
            <h1>연결이 끊겼습니다.</h1>
            <p>이 화면의 파일을 받지 못했습니다. 저장된 진행은 그대로입니다. 연결을 확인한 뒤 다시 시도해 주세요.</p>
            <div className="error-actions">
              <button type="button" data-testid="chunk-retry" onClick={this.retry}>
                다시 시도
              </button>
            </div>
          </section>
        </main>
      );
    }
    return (
      <main className="error-screen">
        <section className="error-panel" role="alert" data-testid="chunk-reload-panel">
          <span className="eyebrow">CRITICAL POINT / UPDATE</span>
          <h1>화면을 다시 받아야 합니다.</h1>
          <p>게임이 새 버전으로 바뀌어 이 화면의 파일을 찾지 못했습니다. 저장된 진행은 그대로입니다.</p>
          <div className="error-actions">
            <button type="button" data-testid="chunk-reload" onClick={() => globalThis.location.reload()}>
              새로고침
            </button>
          </div>
        </section>
      </main>
    );
  }
}

/** What a lazy screen shows while its chunk arrives: a status, not a blank page. */
export function ScreenLoading() {
  return (
    <main className="shell screen-loading" aria-busy="true">
      <p className="save-status" role="status">
        장면을 불러오는 중입니다.
      </p>
    </main>
  );
}
