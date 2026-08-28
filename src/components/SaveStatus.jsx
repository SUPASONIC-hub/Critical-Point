import React from "react";

export function SaveStatus({ view }) {
  const { saveStatus, retryStorageCleanup } = view;
  if (!saveStatus) return null;
  return (
    <section className="save-status" role="status" aria-live="polite" aria-atomic="true">
      <p>{saveStatus}</p>
      {saveStatus.includes("저장소") && (
        <button type="button" className="ghost" data-testid="retry-storage-cleanup" onClick={retryStorageCleanup}>
          저장소 정리 재시도
        </button>
      )}
    </section>
  );

}
