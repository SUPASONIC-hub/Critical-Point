import { Component } from "react";
import "./styles/tokens.css";
import "./styles/app.css";
import {
  DEBUG_RENDER_CRASH_KEY,
  debugToolsEnabled,
  readStoredValue,
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
  STORAGE_KEY,
  writeStoredValue,
} from "./appConfig.js";
import { AppContent, resumeSaves, suppressSaves } from "./AppContent.jsx";
import { confirmAction } from "./state/confirmAction.js";
import confirmCopy from "./copy/confirm.js";
import { getSavedRecoveryState, recordAppError, RENDER_CRASH_SOURCE } from "./state/errorRecovery.js";

// Two failed reloads from the same save is where retrying stops being a retry.
// The sentence is written once because the panel prints it twice: as the message
// the blocked reload sets, and as the standing note under the buttons. It used to
// be plain Korean in one place and a row of unicode escapes in the other. It is
// read where it is used: the page's language is laid over the table after this
// module is read (src/copy/confirm.js).
const retryBlockedMessage = () => confirmCopy.error.retryBlocked;
const MAX_RETRIES_FROM_ONE_SAVE = 2;

const readRetryCount = () => Number(getSavedRecoveryState()?.lastError?.retryCount) || 0;

/**
 * What React is told to do with an error a boundary caught (`main.jsx`). Its
 * default is a bare `console.error(error)`, which the runtime's console hook
 * read as a second failure and recorded beside the boundary's own record. The
 * line is still printed, under the prefix that hook knows to leave alone.
 */
export function logCaughtRenderError(error) {
  console.error("Critical Point render error", error);
}

export function App() {
  return <AppContent onSuppressSaves={suppressSaves} />;
}

export class AppErrorBoundary extends Component {
  state = { hasError: false, recoveryMessage: "", retryCount: null };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    try {
      recordAppError(error, errorInfo, RENDER_CRASH_SOURCE);
    } catch (recoveryError) {
      console.warn("Critical Point recovery logging failed", recoveryError);
    }
    // The panel is first drawn before this runs, from the count as it stood
    // before this crash was recorded. Read it again now, so the button the
    // player sees is the one the count allows.
    this.setState({ retryCount: readRetryCount() });
  }

  async reload({ clearSave = false } = {}) {
    if (!clearSave && readRetryCount() >= MAX_RETRIES_FROM_ONE_SAVE) {
      this.setState({ recoveryMessage: retryBlockedMessage() });
      return;
    }
    if (clearSave && !(await confirmAction(confirmCopy.error.confirmStartFresh))) return;

    if (clearSave) suppressSaves();
    if (clearSave && !removeStoredValue(STORAGE_KEY)) {
      resumeSaves();
      this.setState({
        recoveryMessage: confirmCopy.error.deleteFailed,
      });
      return;
    }

    if (clearSave) writeStoredValue(RECOVERY_CENTER_STORAGE_KEY, "1");
    removeStoredValue(DEBUG_RENDER_CRASH_KEY);
    window.location.reload();
  }

  render() {
    const forcedDebugError = debugToolsEnabled && readStoredValue(DEBUG_RENDER_CRASH_KEY) === "1";
    if (!this.state.hasError && !forcedDebugError) return this.props.children;
    const retryCount = this.state.retryCount ?? readRetryCount();

    return (
      <main className="error-screen">
        <section className="error-panel" role="alert">
          <span className="eyebrow" lang="en">CRITICAL POINT / RECOVERY</span>
          <h1>{confirmCopy.error.title}</h1>
          <p>{confirmCopy.error.text}</p>
          {this.state.recoveryMessage && (
            <p className="error-recovery-message" role="status">
              {this.state.recoveryMessage}
            </p>
          )}
          {/* The blocked reload sets the same sentence as its message, so without
              this guard a blocked retry prints it twice in a row. */}
          {retryCount >= MAX_RETRIES_FROM_ONE_SAVE && this.state.recoveryMessage !== retryBlockedMessage() && (
            <p className="error-retry-blocked" role="status">
              {retryBlockedMessage()}
            </p>
          )}
          <div className="error-actions">
            <button
              type="button"
              className="ghost"
              data-testid="error-start-fresh"
              onClick={() => this.reload({ clearSave: true })}
            >
              {confirmCopy.error.startFresh}
            </button>
            <button type="button" data-testid="error-retry" disabled={retryCount >= MAX_RETRIES_FROM_ONE_SAVE} onClick={() => this.reload()}>
              {confirmCopy.error.retry}
            </button>
          </div>
          <p className="error-recovery-hint">
            {confirmCopy.error.hint}
          </p>
        </section>
      </main>
    );
  }
}
