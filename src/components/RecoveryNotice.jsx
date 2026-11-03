import runLines from "../copy/runLines.js";


export function RecoveryNotice({ view }) {
  const { lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showErrorLog, setShowRecoveryCenter, setShowErrorLog, refreshLocalErrorLog, dismissRecoveryNotice } = view;
  if (!lastRecoveredError) return null;
  const words = runLines.recovery;
  return (
    <section className="recovery-notice" role="status" aria-live="polite">
      <div>
        <span>{words.badge}</span>
        <strong>{lastRecoveredError.currentCase} / {lastRecoveredError.nodeId}</strong>
        <p>{lastRecoveredError.message}</p>
        <p className="recovery-guidance">{words.guidance}</p>
      </div>
      <div className="recovery-actions">
        {started && (
          <button type="button" data-testid="pause-after-recovery" onClick={pauseAfterRecovery}>
            {words.pause}
          </button>
        )}
        <button type="button" className="ghost" data-testid="start-fresh-after-recovery" onClick={startFreshAfterRecovery}>
          {words.startFresh}
        </button>
        <button
          type="button"
          data-testid="open-error-log-from-notice"
          aria-expanded={showErrorLog}
          aria-controls={showErrorLog ? "error-log-panel" : undefined}
          onClick={() => {
            // The lists are read when the page loads; slots and errors written
            // since then would be missing from the panel this opens.
            refreshLocalErrorLog();
            setShowRecoveryCenter(true);
            setShowErrorLog(true);
          }}
        >
          {words.errorLog}
        </button>
        <button type="button" className="ghost" onClick={dismissRecoveryNotice}>
          {words.close}
        </button>
      </div>
    </section>
  );

}
