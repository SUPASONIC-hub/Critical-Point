import { getArtSources, PHONE_ART_MEDIA } from "../responsiveArt.js";

export function EndingSequence({
  endingStep,
  endingTwistIndex,
  endingTwistCount,
  currentEndingTwist,
  finalChoiceText,
  isFinalEndingTwist,
  witnessRecords,
  observerEndingRecord,
  advanceEndingStep,
  endingQuietLine,
  endingQuietReady,
  skipEndingQuietHold,
  nextParticipantMessage,
  setNextParticipantMessage,
  saveNextParticipantMessage,
  endingAfterglow,
  unopenedRecordCount,
  unopenedClueCount,
  unopenedBranchCount,
  endingAtmosphere,
  endingVisualClass,
  endingImage,
}) {
  const endingArt = getArtSources(endingImage);

  return (
    <section
      className={`ending-sequence ending-step-${endingStep} ending-palette-${endingAtmosphere?.palette ?? "archive"} ${endingVisualClass ?? ""}`}
      aria-label="최종 엔딩 시퀀스"
    >
      <picture>
        {endingArt && <source media={PHONE_ART_MEDIA} srcSet={endingArt.phone} type="image/webp" />}
        {endingArt && <source srcSet={endingArt.wide} type="image/webp" />}
        <img className="ending-visual" src={endingImage} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </picture>
      <div className="ending-visual-scrim" aria-hidden="true" />
      <h1 className="sr-only">Season complete</h1>
      <div className="ending-sequence-header">
        <span>SEASON 01 / FINAL RECORD</span>
        <strong>SEASON COMPLETE</strong>
      </div>
      {endingStep === 0 && (
        <div className="ending-beat">
          <span>
            RECORD {Math.min(endingTwistIndex + 1, endingTwistCount)} / {endingTwistCount} · {currentEndingTwist.label}
          </span>
          <blockquote>{currentEndingTwist.evidence}</blockquote>
          <div className="ending-twist-card">
            <h2>{currentEndingTwist.title}</h2>
            <p>{currentEndingTwist.copy}</p>
            <small>{finalChoiceText}</small>
          </div>
          {isFinalEndingTwist && witnessRecords.length > 0 && (
            <div className="ending-witness-log" aria-label="엔딩 증거 기록">
              {witnessRecords.map((record) => (
                <article key={record.id}>
                  <span>{record.label}</span>
                  {record.tag && <small>{record.tag}</small>}
                  <b>{record.text}</b>
                </article>
              ))}
            </div>
          )}
          {isFinalEndingTwist && (
            <div className="ending-archive-blueprint" aria-label="다음 참가자에게 넘어갈 사건 설계도">
              <span>{observerEndingRecord.label}</span>
              <strong>{observerEndingRecord.title}</strong>
              <p>{observerEndingRecord.text}</p>
            </div>
          )}
          <button type="button" data-testid="ending-next" onClick={advanceEndingStep}>
            다음
          </button>
        </div>
      )}
      {endingStep === 1 && (
        <div className="ending-beat ending-quiet-beat" aria-live="polite">
          <p className="ending-quiet-line">{endingQuietLine || "..."}</p>
          {endingQuietReady ? (
            <button type="button" data-testid="ending-next" onClick={advanceEndingStep}>
              다음
            </button>
          ) : (
            <button type="button" className="ending-quiet-skip" onClick={skipEndingQuietHold}>
              이 화면 건너뛰기
            </button>
          )}
        </div>
      )}
      {endingStep === 2 && (
        <form
          className="ending-beat ending-message-beat"
          onSubmit={(event) => {
            event.preventDefault();
            saveNextParticipantMessage();
          }}
        >
          <label htmlFor="next-participant-message">다음 참가자에게 남길 한 문장</label>
          <textarea
            id="next-participant-message"
            value={nextParticipantMessage}
            onChange={(event) => setNextParticipantMessage(event.target.value)}
            maxLength={180}
            rows={3}
          />
          <button type="submit">기록 남기기</button>
        </form>
      )}
      {endingStep === 3 && (
        <div className="ending-beat">
          <span>RECORD OPENED</span>
          <div className="ending-coda">
            <span>당신이 남긴 것</span>
            <strong>{endingAfterglow.title}</strong>
            <p>{endingAfterglow.text}</p>
          </div>
          <strong>{unopenedRecordCount}개의 기록이 아직 열리지 않았다.</strong>
          <small>단서 {unopenedClueCount}개 · 밟지 않은 갈래 {unopenedBranchCount}개</small>
          <small>다음 참가자는 이 빈칸을 이어받습니다.</small>
          <p>이제 기록 열람을 시작할 수 있습니다.</p>
        </div>
      )}
    </section>
  );
}
