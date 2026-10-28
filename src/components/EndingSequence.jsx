import { useEffect, useRef, useState } from "react";

import { getArtSources, PHONE_ART_MEDIA } from "../responsiveArt.js";
import { quietImport } from "../state/chunkReload.js";
import { focusSceneTitle } from "../state/sceneFocus.js";
import { getThreeScenes, threeScenesHeading } from "../threeScenes.js";
import endingCopy from "../copy/ending.js";
import { fill } from "../locale.js";

const words = endingCopy.sequence;

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
  // The season's case summaries and the finale's log, for 「당신의 세 장면」 alone: the card is handed on untouched.
  seasonRecord,
}) {
  const endingArt = getArtSources(endingImage);
  // B-12(2) 「당신의 세 장면」: three cards of the season, read off the record and only shown (threeScenes.js).
  const threeScenes = endingStep === 3 ? getThreeScenes(seasonRecord) : [];
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
        ? endingQuietLine
        : endingStep === 3
          ? fill(words.announceOpened, { count: unopenedRecordCount })
          : "";

  // Every ending has a palette and a class of its own, the unnamed ones
  // "archive" (getEndingAtmosphere, getEndingVisualClass in runtimeSystems.js);
  // the quiet line is a string, empty when nothing was said (useRunReadout.js).
  return (
    <section
      className={`ending-sequence ending-step-${endingStep} ending-palette-${endingAtmosphere.palette} ${endingVisualClass}`}
      aria-label={words.label}
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
      {endingStep < 3 && <h1 ref={endingStep === 0 ? stepStartRef : undefined} className="sr-only" tabIndex={-1}>{words.seasonComplete}</h1>}
      {/* On the page from the first step, so what it comes to say is news. */}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      <div className="ending-sequence-header">
        <span lang="en">{card.season}</span>
        <strong>{words.seasonComplete}</strong>
      </div>
      {endingStep === 0 && (
        <div className="ending-beat">
          <span>
            RECORD {endingTwistIndex + 1} / {endingTwistCount} · {currentEndingTwist.label}
          </span>
          <blockquote>{currentEndingTwist.evidence}</blockquote>
          <div className="ending-twist-card">
            <h2>{currentEndingTwist.title}</h2>
            <p>{currentEndingTwist.copy}</p>
            <small>{finalChoiceText}</small>
          </div>
          {isFinalEndingTwist && witnessRecords.length > 0 && (
            <div className="ending-witness-log" role="group" aria-label={words.witnessLabel}>
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
            <div className="ending-archive-blueprint" role="group" aria-label={words.blueprintLabel}>
              <span>{observerEndingRecord.label}</span>
              <strong>{observerEndingRecord.title}</strong>
              <p>{observerEndingRecord.text}</p>
            </div>
          )}
          <button type="button" data-testid="ending-next" onClick={advanceEndingStep}>
            {words.next}
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
            {endingQuietReady ? words.next : words.skip}
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
          <label htmlFor="next-participant-message">{words.messageLabel}</label>
          <textarea
            id="next-participant-message"
            ref={stepStartRef}
            value={nextParticipantMessage}
            onChange={(event) => setNextParticipantMessage(event.target.value)}
            maxLength={180}
            rows={3}
          />
          <button type="submit">{words.messageSave}</button>
        </form>
      )}
      {endingStep === 3 && (
        <div className="ending-beat">
          <span>{words.opened}</span>
          <div className="ending-coda">
            <span>{words.leftBehind}</span>
            <strong>{endingAfterglow.title}</strong>
            <p>{endingAfterglow.text}</p>
          </div>
          {threeScenes.length > 0 && (
            <section className="three-scenes" aria-labelledby="three-scenes-title" data-testid="three-scenes">
              <h2 id="three-scenes-title">{threeScenesHeading(threeScenes.length)}</h2>
              <ol>
                {threeScenes.map((scene) => (
                  <li key={scene.id}>
                    <span>{scene.place}</span>
                    <p>{scene.label}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <strong>{fill(words.unopened, { count: unopenedRecordCount })}</strong>
          <small>{fill(words.unopenedParts, { clues: unopenedClueCount, branches: unopenedBranchCount })}</small>
          <small>{words.inherit}</small>
          <p>{words.readNow}</p>
          {cardChunk && <cardChunk.default card={card} />}
        </div>
      )}
    </section>
  );
}
