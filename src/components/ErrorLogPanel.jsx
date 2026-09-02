
export function ErrorLogPanel({ view }) {
  const { showErrorLog, debugToolsEnabled, showRecoveryCenter, copyDiagnosticTrace, exportPlaytestLog, refreshLocalErrorLog, clearLocalErrorLog, closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries, startAtNode, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot } = view;
  if (!showErrorLog || (!debugToolsEnabled && !showRecoveryCenter)) return null;
  return (
    <section id="error-log-panel" className="error-log-panel" aria-label="로컬 에러 로그" data-testid="error-log-panel">
      <div className="panel-title-row">
        <div>
          <span>ERROR LOG</span>
          <h2>최근 오류 기록</h2>
        </div>
        <div className="error-log-actions">
          <button type="button" onClick={copyDiagnosticTrace}>
            Copy trace
          </button>
          <button type="button" onClick={() => exportPlaytestLog({ includeDiagnostics: true })}>
            Export diagnostics
          </button>
          <button type="button" onClick={refreshLocalErrorLog}>
            새로고침
          </button>
          <button type="button" className="ghost" onClick={clearLocalErrorLog}>
            로그 비우기
          </button>
          <button type="button" className="ghost" onClick={closeRecoveryCenter}>
            닫기
          </button>
        </div>
      </div>
      <div className={`telemetry-health ${telemetryHealth.status}`}>
        <strong>원격 로그 읽기 점검</strong>
        <span>
          {telemetryHealth.status === "ok"
            ? "정상"
            : telemetryHealth.status === "checking"
              ? "확인 중"
              : telemetryHealth.status === "disabled"
                ? "비활성"
                : telemetryHealth.status === "offline"
                  ? "오프라인"
                  : "확인 필요"}
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
        <p className="error-log-empty">저장된 오류 기록이 없습니다.</p>
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
                로그 {entry.context?.logLength ?? 0}개 · 마지막 선택 {entry.context?.lastChoiceId || "없음"}
              </small>
              <button
                type="button"
                className="ghost error-replay-button"
                onClick={() =>
                  startAtNode(
                    entry.context?.currentCase,
                    entry.context?.nodeId,
                    {
                      echoText: "에러 로그 재현 진입입니다. 저장된 지점의 장면 흐름을 다시 확인합니다.",
                      persistRun: false,
                    },
                  )
                }
              >
                재현
              </button>
              <details className="error-log-details">
                <summary>상세</summary>
                <dl>
                  <dt>stack</dt>
                  <dd>{entry.error?.stack || "없음"}</dd>
                  <dt>viewport</dt>
                  <dd>{entry.viewport ? `${entry.viewport.width ?? 0}x${entry.viewport.height ?? 0}` : "없음"}</dd>
                  <dt>dom</dt>
                  <dd>{entry.domSnapshot || "없음"}</dd>
                </dl>
              </details>
            </article>
          ))}
        </div>
      )}
      <section className="save-slot-panel" aria-label="복구 슬롯" data-testid="save-slot-panel">
        <div className="panel-title-row">
          <div>
            <span>RECOVERY SLOTS</span>
            <h3>최근 복구 지점</h3>
          </div>
          <button type="button" className="ghost" onClick={refreshSaveSlots}>
            새로고침
          </button>
        </div>
        {saveSlots.length === 0 ? (
          <p className="error-log-empty">저장된 복구 슬롯이 없습니다.</p>
        ) : (
          <div className="save-slot-list">
            {saveSlots.map((slot) => (
              <article key={slot.id}>
                <div>
                  <strong>{slot.currentCase} / {slot.nodeId}</strong>
                  <small>{formatSaveTime(slot.savedAt)} · 완료 {slot.completedCases?.length ?? 0}</small>
                </div>
                <div className="save-slot-actions">
                  <button type="button" data-testid={`restore-save-slot-${slot.id}`} onClick={() => restoreSaveSlot(slot)}>
                    복원
                  </button>
                  <button type="button" className="ghost" onClick={() => deleteSaveSlot(slot.id)}>
                    삭제
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
