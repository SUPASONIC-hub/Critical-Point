import { Component, Suspense } from "react";

import { isChunkLoadError } from "../state/chunkReload.js";

/**
 * A lazy screen with its own way out when its chunk will not load.
 *
 * `React.lazy` keeps a failed import failed, so the screen cannot be asked for
 * again without a reload. The boundary here answers that one failure with a
 * reload button and leaves the save alone; anything else is thrown on to the
 * root boundary, which is where a fault in the run is recorded.
 */
export class LazyScreen extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) {
      // `quiet` is for a screen swapped in mid-run, where a status line would
      // flash between two scenes.
      const fallback = this.props.quiet ? <main className="shell screen-loading" aria-busy="true" /> : <ScreenLoading />;
      return <Suspense fallback={fallback}>{this.props.children}</Suspense>;
    }
    if (!isChunkLoadError(error)) throw error;
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
