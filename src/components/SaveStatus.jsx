
export function SaveStatus({ view }) {
  const { saveStatus, retryStorageCleanup } = view;
  // The region is on the page whether or not there is anything in it. A
  // status region that arrives with its text already inside is, to most
  // screen readers, not a change -- so "저장했습니다" was drawn and not said.
  return (
    <div className="save-status-region" role="status" aria-live="polite" aria-atomic="true">
      {saveStatus && (
        <section className="save-status">
          <p>{saveStatus}</p>
          {saveStatus.includes("저장소") && (
            <button type="button" className="ghost" data-testid="retry-storage-cleanup" onClick={retryStorageCleanup}>
              저장소 정리 재시도
            </button>
          )}
        </section>
      )}
    </div>
  );

}
