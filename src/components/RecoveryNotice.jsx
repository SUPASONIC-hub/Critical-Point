
export function RecoveryNotice({ view }) {
  const { lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showErrorLog, setShowRecoveryCenter, setShowErrorLog, dismissRecoveryNotice } = view;
  if (!lastRecoveredError) return null;
  return (
    <section className="recovery-notice" role="status" aria-live="polite">
      <div>
        <span>복구됨</span>
        <strong>{lastRecoveredError.currentCase} / {lastRecoveredError.nodeId}</strong>
        <p>{lastRecoveredError.message}</p>
        <p className="recovery-guidance">
          같은 지점에서 오류가 반복되면 다시 시도하지 말고, 저장 지점을 일시정지한 뒤 새 게임 또는 복구 슬롯을 선택하세요.
        </p>
      </div>
      <div className="recovery-actions">
        {started && (
          <button type="button" data-testid="pause-after-recovery" onClick={pauseAfterRecovery}>
            저장 지점 일시정지
          </button>
        )}
        <button type="button" className="ghost" data-testid="start-fresh-after-recovery" onClick={startFreshAfterRecovery}>
          새 게임으로 시작
        </button>
        <button
          type="button"
          data-testid="open-error-log-from-notice"
          aria-expanded={showErrorLog}
          aria-controls={showErrorLog ? "error-log-panel" : undefined}
          onClick={() => {
          setShowRecoveryCenter(true);
          setShowErrorLog(true);
          }}
        >
            에러 로그
        </button>
        <button type="button" className="ghost" onClick={dismissRecoveryNotice}>
          닫기
        </button>
      </div>
    </section>
  );

}
