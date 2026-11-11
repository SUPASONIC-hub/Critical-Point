import { readStoredValue, SAVE_BACKUP_STORAGE_KEY } from "../appConfig.js";
import runLines from "../copy/runLines.js";
import { fill } from "../locale.js";

export function ErrorLogPanel({ view }) {
  const { showErrorLog, debugToolsEnabled, showRecoveryCenter, copyDiagnosticTrace, exportPlaytestLog, refreshLocalErrorLog, clearLocalErrorLog, closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries, startAtNode, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot, restoreSaveBackup } = view;
  if (!showErrorLog || (!debugToolsEnabled && !showRecoveryCenter)) return null;
  // The copy kept of a save this build could not read (useRuntimeSavedState).
  const words = runLines.recoveryCenter;
  const hasSaveBackup = Boolean(restoreSaveBackup) && readStoredValue(SAVE_BACKUP_STORAGE_KEY, null) !== null;
  return (
    <section id="error-log-panel" className="error-log-panel" aria-label={words.label} data-testid="error-log-panel">
      <div className="panel-title-row">
        <div>
          <span lang="en">ERROR LOG</span>
          <h2>{words.title}</h2>
        </div>
        <div className="error-log-actions">
          <button type="button" onClick={copyDiagnosticTrace}>
            {words.copyTrace}
          </button>
          <button type="button" onClick={() => exportPlaytestLog({ includeDiagnostics: true })}>
            {words.saveDiagnostics}
          </button>
          <button type="button" onClick={refreshLocalErrorLog}>
            {words.refresh}
          </button>
          <button type="button" className="ghost" onClick={clearLocalErrorLog}>
            {words.clear}
          </button>
          <button type="button" className="ghost" onClick={closeRecoveryCenter}>
            {words.close}
          </button>
        </div>
      </div>
      <div className={`telemetry-health ${telemetryHealth.status}`}>
        <strong>{words.health}</strong>
        <span>
          {Object.hasOwn(words.healthStatus, telemetryHealth.status) ? words.healthStatus[telemetryHealth.status] : words.healthStatus.other}
        </span>
        {telemetryHealth.tables.length > 0 && (
          <small>
            {telemetryHealth.tables
              .map((table) => `${table.table}:${table.ok ? "ok" : table.status ?? "fail"}`)
              .join(" / ")}
          </small>
        )}
        {telemetryRetryInfo.nextRetryAt && pendingTelemetry.length > 0 && (
          <small>
            retry {telemetryRetryInfo.attempt + 1} · {formatSaveTime(telemetryRetryInfo.nextRetryAt)}
          </small>
        )}
      </div>
      {localErrorEntries.length === 0 ? (
        <p className="error-log-empty">{words.emptyErrors}</p>
      ) : (
        <div className="error-log-list">
          {localErrorEntries.map((entry) => (
            <article key={entry.id}>
              <div>
                <span>{formatSaveTime(entry.occurredAt)} · {entry.context?.source ?? "runtime"}</span>
                <strong>{entry.context?.currentCase ?? "unknown"} / {entry.context?.nodeId ?? "unknown"}</strong>
                <p>{entry.error?.message ?? "Unknown error"}</p>
              </div>
              <small>
                {fill(words.entryCounts, { count: entry.context?.logLength ?? 0, choice: entry.context?.lastChoiceId || words.none })}
              </small>
              <button
                type="button"
                className="ghost error-replay-button"
                onClick={() =>
                  startAtNode(
                    entry.context?.currentCase,
                    entry.context?.nodeId,
                    {
                      echoText: words.replayEcho,
                      persistRun: false,
                    },
                  )
                }
              >
                {words.replay}
              </button>
              <details className="error-log-details">
                <summary>{words.details}</summary>
                <dl>
                  <dt>stack</dt>
                  <dd>{entry.error?.stack || words.none}</dd>
                  <dt>viewport</dt>
                  <dd>{entry.viewport ? `${entry.viewport.width ?? 0}x${entry.viewport.height ?? 0}` : words.none}</dd>
                  <dt>dom</dt>
                  <dd>{entry.domSnapshot || words.none}</dd>
                </dl>
              </details>
            </article>
          ))}
        </div>
      )}
      <section className="save-slot-panel" aria-label={words.slotsLabel} data-testid="save-slot-panel">
        <div className="panel-title-row">
          <div>
            <span lang="en">RECOVERY SLOTS</span>
            <h3>{words.slotsTitle}</h3>
          </div>
          <button type="button" className="ghost" onClick={refreshSaveSlots}>
            {words.refresh}
          </button>
        </div>
        {hasSaveBackup && (
          <div className="save-slot-list">
            <article data-testid="save-backup">
              <div>
                <strong>{words.backupTitle}</strong>
                <small>{words.backupText}</small>
              </div>
              <div className="save-slot-actions">
                <button type="button" data-testid="restore-save-backup" onClick={restoreSaveBackup}>
                  {words.backupRead}
                </button>
              </div>
            </article>
          </div>
        )}
        {saveSlots.length === 0 ? (
          <p className="error-log-empty">{words.emptySlots}</p>
        ) : (
          <div className="save-slot-list">
            {saveSlots.map((slot) => (
              <article key={slot.id}>
                <div>
                  <strong>{slot.currentCase} / {slot.nodeId}</strong>
                  <small>{formatSaveTime(slot.savedAt)} · {fill(words.slotDone, { count: slot.completedCases?.length ?? 0 })}</small>
                </div>
                <div className="save-slot-actions">
                  <button type="button" data-testid={`restore-save-slot-${slot.id}`} onClick={() => restoreSaveSlot(slot)}>
                    {words.restore}
                  </button>
                  <button type="button" className="ghost" onClick={() => deleteSaveSlot(slot.id)}>
                    {words.remove}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );

}
