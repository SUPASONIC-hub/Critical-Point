import React from "react";
import "./styles/tokens.css";
import "./styles/app.css";
import { readStoredValue, RECOVERY_CENTER_STORAGE_KEY, removeStoredValue, STORAGE_KEY, writeStoredValue } from "./appConfig.js";
import { AppContent } from "./AppContent.jsx";
import { getSavedRecoveryState, recordAppError } from "./state/savedState.js";

export const caseSequence = ["case01", "case02", "case03", "case04", "case05", "final"];

const debugToolsEnabled =
  import.meta.env.VITE_ENABLE_DEBUG_TOOLS === "true" ||
  (import.meta.env.DEV && new URLSearchParams(globalThis.location?.search ?? "").get("debug") === "1");
const DEBUG_RENDER_CRASH_KEY = "critical-point-force-render-error";

let saveSuppressed = false;

export function suppressSaves() {
  saveSuppressed = true;
}

export function App() {
  return <AppContent onSuppressSaves={suppressSaves} />;
}

export class AppErrorBoundary extends React.Component {
  state = { hasError: false, recoveryMessage: "" };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Point render error", error);
    try {
      recordAppError(error, errorInfo, "react-render");
    } catch (recoveryError) {
      console.warn("Critical Point recovery logging failed", recoveryError);
    }
  }

  reload({ clearSave = false } = {}) {
    const retryCount = Number(getSavedRecoveryState()?.lastError?.retryCount) || 0;
    if (!clearSave && retryCount >= 2) {
      this.setState({
        recoveryMessage:
          "같은 저장 지점에서 오류가 반복되어 재시도를 중단했습니다.",
      });
      return;
    }

    if (clearSave) suppressSaves();
    if (clearSave && !removeStoredValue(STORAGE_KEY)) {
      saveSuppressed = false;
      this.setState({
        recoveryMessage: "현재 저장본을 삭제하지 못했습니다. 브라우저 저장소 권한을 확인한 뒤 다시 시도하세요.",
      });
      return;
    }

    if (clearSave) writeStoredValue(RECOVERY_CENTER_STORAGE_KEY, "1");
    removeStoredValue(DEBUG_RENDER_CRASH_KEY);
    window.location.reload();
  }

  render() {
    const forcedDebugError = debugToolsEnabled && readStoredValue(DEBUG_RENDER_CRASH_KEY) === "1";
    const retryCount = Number(getSavedRecoveryState()?.lastError?.retryCount) || 0;
    if (!this.state.hasError && !forcedDebugError) return this.props.children;

    return (
      <main className="error-screen">
        <section className="error-panel" role="alert">
          <span className="eyebrow">CRITICAL POINT / RECOVERY</span>
          <h1>장면을 불러오지 못했습니다.</h1>
          <p>오류 지점은 자동 저장되었습니다. 수정 후 다시 열면 저장된 장면에서 이어서 진행할 수 있습니다.</p>
          {this.state.recoveryMessage && (
            <p className="error-recovery-message" role="status">
              {this.state.recoveryMessage}
            </p>
          )}
          {retryCount >= 2 && (
            <p className="error-retry-blocked" role="status">
              {"\uAC19\uC740 \uC800\uC7A5 \uC9C0\uC810\uC5D0\uC11C \uC624\uB958\uAC00 \uBC18\uBCF5\uB418\uC5B4 \uC7AC\uC2DC\uB3C4\uB97C \uC911\uB2E8\uD588\uC2B5\uB2C8\uB2E4."}
            </p>
          )}
          <div className="error-actions">
            <button
              type="button"
              className="ghost"
              data-testid="error-start-fresh"
              aria-label="현재 저장본만 초기화"
              onClick={() => this.reload({ clearSave: true })}
            >
              저장본을 초기화하고 새 게임
            </button>
            <button type="button" data-testid="error-retry" disabled={retryCount >= 2} onClick={() => this.reload()}>
              저장된 지점에서 다시 시도
            </button>
          </div>
          <p className="error-recovery-hint">
            복구 슬롯과 오류 로그는 보존됩니다. 같은 지점에서 계속 실패하면 저장본을 초기화하고 새 게임으로 진입해 주세요.
          </p>
        </section>
      </main>
    );
  }
}
