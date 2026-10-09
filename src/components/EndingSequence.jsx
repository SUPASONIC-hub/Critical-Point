import { useEffect, useRef, useState } from "react";

import { getArtSources, PHONE_ART_MEDIA } from "../responsiveArt.js";
import { quietImport } from "../state/chunkReload.js";
import { focusSceneTitle } from "../state/sceneFocus.js";

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
  reportTitleRef,
  card,
}) {
  const endingArt = getArtSources(endingImage);
  // Each step puts a new block on the page and takes the pressed 다음 away
  // with the old one, so focus fell to <body> four times on the way to the
  // report. Each step now hands focus to where its reading starts: the
  // heading, the one button, the message box, and at the end the report's own
  // title. `focusSceneTitle` waits for the verdict's reveal if it is still up.
  const stepStartRef = useRef(null);
  useEffect(() => {
    focusSceneTitle(endingStep < 3 ? stepStartRef : reportTitleRef);
  }, [endingStep, reportTitleRef]);
  // The result card's buttons and everything that draws the card are a chunk of
  // their own, asked for when the ending opens so that they are here by the
  // time the record does (step 3). `quietImport`: a chunk that does not arrive
  // leaves the ending without the two buttons, not with a reloaded page.
  const [cardChunk, setCardChunk] = useState();
  useEffect(() => {
    quietImport(() => import("./ResultCardShare.jsx")).then(setCardChunk, () => {});
  }, []);
  // The twists change under a button that stays where it is, so focus does not
  // move and nothing would be said: the region below says each one.
  const announcement =
    endingStep === 0
      ? endingTwistIndex === 0 ? "" : `${currentEndingTwist.label}. ${currentEndingTwist.title}. ${currentEndingTwist.copy}`
      : endingStep === 1
        ? endingQuietLine || ""
        : endingStep === 3
          ? `기록이 열렸습니다. ${unopenedRecordCount}개의 기록이 아직 열리지 않았습니다.`
          : "";

  return (
    <section
      className={`ending-sequence ending-step-${endingStep} ending-palette-${endingAtmosphere?.palette ?? "archive"} ${endingVisualClass ?? ""}`}
      aria-label="최종 엔딩 시퀀스"
    >
      <picture>
        {endingArt && <source media={PHONE_ART_MEDIA} srcSet={endingArt.phone} type="image/webp" />}
        {endingArt && <source srcSet={endingArt.wide} sizes={endingArt.wideSizes} type="image/webp" />}
        {/* The full-bleed hero of the season's last screen, so it is fetched
            first rather than lazily. Every ending plate is painted at
            1672x941; the dimensions let the box be laid out before it lands. */}
        <img
          className="ending-visual"
          src={endingImage}
          alt=""
          aria-hidden="true"
          width={1672}
          height={941}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="ending-visual-scrim" aria-hidden="true" />
      {/* The screen's heading while the report under it is still shut. Once the
          report opens (step 3) its own h1 is the page's, and a second one here
          gave the final screen two. */}
      {endingStep < 3 && <h1 ref={endingStep === 0 ? stepStartRef : undefined} className="sr-only" tabIndex={-1}>시즌 완료</h1>}
      {/* On the page from the first step, so what it comes to say is news. */}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      <div className="ending-sequence-header">
        <span lang="en">SEASON 01 / FINAL RECORD</span>
        <strong lang="en">SEASON COMPLETE</strong>
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
            <div className="ending-witness-log" role="group" aria-label="엔딩 증거 기록">
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
            <div className="ending-archive-blueprint" role="group" aria-label="다음 참가자에게 넘어갈 사건 설계도">
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
        <div className="ending-beat ending-quiet-beat">
          <p className="ending-quiet-line">{endingQuietLine || "..."}</p>
          {/* One button whose words change, not two that swap: the element
              that holds focus through the hold is the one that is pressed
              after it. */}
          <button
            type="button"
            ref={stepStartRef}
            className={endingQuietReady ? undefined : "ending-quiet-skip"}
            data-testid={endingQuietReady ? "ending-next" : undefined}
            onClick={endingQuietReady ? advanceEndingStep : skipEndingQuietHold}
          >
            {endingQuietReady ? "다음" : "이 화면 건너뛰기"}
          </button>
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
            ref={stepStartRef}
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
          <span lang="en">RECORD OPENED</span>
          <div className="ending-coda">
            <span>당신이 남긴 것</span>
            <strong>{endingAfterglow.title}</strong>
            <p>{endingAfterglow.text}</p>
          </div>
          <strong>{unopenedRecordCount}개의 기록이 아직 열리지 않았다.</strong>
          <small>단서 {unopenedClueCount}개 · 밟지 않은 갈래 {unopenedBranchCount}개</small>
          <small>다음 참가자는 이 빈칸을 이어받습니다.</small>
          <p>이제 기록 열람을 시작할 수 있습니다.</p>
          {cardChunk && <cardChunk.default card={card} />}
        </div>
      )}
    </section>
  );
}
