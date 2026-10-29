import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronRight, Info, LockKeyhole, MessagesSquare, Sparkles, TriangleAlert, Trophy } from "lucide-react";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { playOpeningAccent } from "../components/AdaptiveMusic.jsx";
import { AccessibilityPanel } from "../components/AccessibilityPanel.jsx";
import { CloudSavePanel } from "../components/CloudSavePanel.jsx";
import { InstallHintSlot } from "../components/InstallHintSlot.jsx";
import { GameWordmark } from "../components/GameWordmark.jsx";
import { LanguagePicker } from "../components/LanguagePicker.jsx";
import { StudioCredit } from "../components/StudioCredit.jsx";
import { WeeklyRuleNotice } from "../components/WeeklyRuleNotice.jsx";
import { getArtSources, PHONE_ART_MEDIA } from "../responsiveArt.js";
import { getAnalystTitle } from "../analystTitle.js";
import { caseDisplayCode } from "../gameCases.js";
import { getSideSlot } from "../sideCases.js";
import { LazyScreen } from "../components/LazyScreen.jsx";
import { loadedChunk } from "../state/chunkReload.js";
import { retryableLazy } from "../state/retryableLazy.js";
import { confirmAction } from "../state/confirmAction.js";
import { useConsentToggle } from "../state/useConsentToggle.js";
import { getDeletionRequestText } from "../appConfig.js";
import { decideCaseCardPress } from "../viewModels/seasonViewModels.js";
import { PRIVACY_PAGE_PATH, TERMS_PAGE_PATH } from "../privacyText.js";
import { fill } from "../locale.js";
import introCopy, { newGamePlusLabel } from "../copy/intro.js";

// E-11: the side screen, fetched the first time a side case is opened (sideCases.js).
const SideCaseScreen = retryableLazy(() => import("./SideCaseScreen.jsx").then(loadedChunk).then(({ SideCaseScreen }) => ({ default: SideCaseScreen })));

const PROTOCOL_LINE = "NO CORRECT ANSWER / 45 SEC WINDOW / NEXT CASE CONTAMINATED";
// One loop of the marquee. Three copies is what makes the run wider than a
// desktop viewport, so the -50% translate never exposes the seam.
const tickerRun = (
  <>
    <small className="intro-protocol-line">{PROTOCOL_LINE}</small>
    <small className="intro-protocol-line">{PROTOCOL_LINE}</small>
    <small className="intro-protocol-line">{PROTOCOL_LINE}</small>
  </>
);

/**
 * The runtime chunk, loaded once. The pre-start shell renders this screen from
 * the entry chunk and the runtime behind it is the largest download in the
 * app, so it starts loading while the player reads (AppContent, on idle) or
 * reaches for the button, rather than after the click.
 */
let gameRuntimeModule = null;

export function loadGameRuntime() {
  gameRuntimeModule ??= import("../GameRuntime.jsx").then(loadedChunk).catch((error) => {
    gameRuntimeModule = null;
    throw error;
  });
  return gameRuntimeModule;
}

// A failure here still reloads the page when the browser is online: that is a
// tab left open across a deploy, and reloading it while the intro is being
// read is the cheapest moment there is (tests/production-build.spec.js holds
// the tab to it). Offline it does nothing, and the press loads it again.
export function prefetchGameRuntime() {
  loadGameRuntime().catch(() => {});
}

/**
 * A case card or NEW GAME+ pressed on the pre-start shell. Opening a case needs
 * the scene graph and NEW GAME+ has to record its memory first, and only the
 * runtime can do either, so the shell hands the press over: it mounts the
 * runtime, whose own copy of this screen performs it once, through the same
 * `startCase` / `startNewGamePlus` a press inside the runtime calls. The shell
 * used to answer both with a fresh season, which wiped the completed cases.
 */
const { confirm: CONFIRM } = introCopy;
// The consent box is ticked from the first visit and sits in a closed drawer,
// so the page says so where the eye already is: by the button that starts the
// sending. It names the drawer the way out is in, and the name opens it: a
// closed <details> is not scrolled to by its own anchor in every browser.
const DATA_DRAWER_ID = "data-info";
// "브리핑 먼저 보기" pointed at the name field until 2026-10-13: its target was
// the start panel, while the briefing it names sat in a closed drawer below.
const BRIEFING_DRAWER_ID = "prestart-briefing";
const openDrawer = (id) => () => {
  const drawer = document.getElementById(id);
  if (drawer) drawer.open = true;
};
const openDataDrawer = openDrawer(DATA_DRAWER_ID);
const openBriefingDrawer = openDrawer(BRIEFING_DRAWER_ID);
// Copy read at module level is read before another language's dictionary is
// laid over it: this screen is in the shell, imported before loadLocale()
// resolves. So no string of introCopy is copied out up here -- the NEW GAME+
// label was, and printed "NEW GAME+ 시작" on the English page until 10-26.
// Read it while rendering (newGamePlusLabel); an object (CONFIRM) is fine,
// the overlay writes into it.
const START_ACTION_TTL_MS = 60_000;
let pendingStartAction = null;

export function queueRuntimeStartAction(action) {
  pendingStartAction = { ...action, queuedAt: Date.now() };
}

function takeRuntimeStartAction() {
  const action = pendingStartAction;
  pendingStartAction = null;
  return action && Date.now() - action.queuedAt < START_ACTION_TTL_MS ? action : null;
}

/** The deletion-request sentence, the address a mailto link when there is one. */
function DeletionRequest() {
  const { address, before, after } = getDeletionRequestText();
  return (
    <span data-testid="deletion-request">
      {before}
      {address && (
        <a href={`mailto:${address}`} style={{ color: "inherit" }}>
          {address}
        </a>
      )}
      {after}
    </span>
  );
}

export function IntroScreen({ view, renderers = {} }) {
  // The case the burst is opening, or null when there is none.
  const [openingBurst, setOpeningBurst] = useState(null);
  // E-11: the side case open in this screen's place, or null.
  const [sideCaseId, setSideCaseId] = useState(null);
  const openingBurstRef = useRef(false);
  const openingTimerRef = useRef(null);
  const heroArt = getArtSources("/triggerlab-key-visual.webp");  const {
    common: {
      AdaptiveMusic, musicModeKey, triggerLabels,
      renderRecoveryNotice: viewRenderRecoveryNotice,
      renderErrorLogPanel: viewRenderErrorLogPanel,
      renderSaveStatus: viewRenderSaveStatus,
      GAME_TITLE, GAME_TITLE_READING, simplifyPlayerText, activeCaseMeta, nextParticipantMessage,
    },
    start: {
      playStyleOptions, playStyle, setPlayStyle, persist, hasResumableSave, node, formatSaveTime,
      lastSavedAt, savedStory, progress, playerName, PLAYER_NAME_MAX_LENGTH, setPlayerName, limitText,
      startGame, resumeSavedGame, activePlayStyle, newGamePlusUnlocked, startNewGamePlus,
    },
    telemetry: {
      dataConsent, setDataConsent, pendingTelemetry, setTelemetryStatus, telemetryEnabled, isOnline,
      telemetrySummary, sessionCode, setPendingTelemetry,
    },
    debug: {
      debugToolsEnabled, showErrorLog, setShowErrorLog, unlockAllCasesForTest,
      debugCaseId, debugNodeOptions, debugNodeId, caseSequence, nodes, setDebugCaseId, setDebugNodeId,
      startDebugNode, nodeOrders,
    },
    season: {
      seasonCasesBase, caseObjectives, triggerLabSignals, completedCaseResultList, seasonJourney,
      resourceMeta, seasonCases, caseResults, currentCase, atReport, startCase, getCaseStatusText,
      normalizeCaseSummary, caseMinutes,
    },
    content: {
      playGuideItems, operatorProfiles, operatorOrigin, setOperatorOrigin, operatorProfile, originPrologue,
      tutorialSteps, playStyleUnlocks, seasonGoals, pastRunMemory,
    },
  } = view;
  const Music = AdaptiveMusic;
  const renderRecoveryNotice = renderers.renderRecoveryNotice ?? viewRenderRecoveryNotice;
  const renderErrorLogPanel = renderers.renderErrorLogPanel ?? viewRenderErrorLogPanel;
  const renderSaveStatus = renderers.renderSaveStatus ?? viewRenderSaveStatus;
  const onShowRanking = view.common.setShowRanking;
  const onShowBoard = view.common.setShowBoard;
  const gameTitle = GAME_TITLE;
  const consent = useConsentToggle({ pendingTelemetry, persist, setDataConsent, setPendingTelemetry, setTelemetryStatus });
  useEffect(() => () => window.clearTimeout(openingTimerRef.current), []);
  // Before paint, so the handed-over press never flashes this screen first.
  useLayoutEffect(() => {
    const action = takeRuntimeStartAction();
    if (action?.type === "case") startCase(action.caseId);
    else if (action?.type === "new-game-plus") startNewGamePlus();
  }, [startCase, startNewGamePlus]);

  // `caseId` is the case being opened. The burst used to name the season's
  // first case whatever was pressed: 사건 30 from the roadmap opened under
  // "첫 판단 조건 동기화 중".
  function beginOpeningBurst(callback, caseId = seasonCasesBase[0].id) {
    if (openingBurstRef.current) return;
    openingBurstRef.current = true;
    setOpeningBurst(caseId);
    playOpeningAccent();
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    openingTimerRef.current = window.setTimeout(() => {
      openingBurstRef.current = false;
      setOpeningBurst(null);
      callback();
    }, reducedMotion ? 140 : 860);
  }

  // Both start the season over, and a run that can be resumed is progress
  // thrown away: they ask first, the way every such control does (priority 36).
  // With no run to lose nothing is awaited: the first press on the page still
  // opens the burst, and starts its sound, inside the press itself.
  const startNewRun = async () => {
    if (!hasResumableSave || (await confirmAction(CONFIRM.startOver))) beginOpeningBurst(startGame);
  };
  const startNewGamePlusRun = async () => {
    if (!hasResumableSave || (await confirmAction(CONFIRM.newGamePlus))) beginOpeningBurst(startNewGamePlus);
  };
  // A roadmap card. Opening a case starts it at its first scene, so the card of
  // the case in progress resumes it instead, and a press that would throw a
  // record away asks first (decideCaseCardPress has the cases).
  const pressCaseCard = async (caseItem) => {
    const press = decideCaseCardPress({
      caseId: caseItem.id, status: caseItem.status, currentCase, atReport, hasResumableSave, logLength: savedStory.decisions,
    });
    if (press === "locked") return;
    if (press === "resume") return resumeSavedGame();
    if (press === "replace" && !(await confirmAction(CONFIRM.replaceCase))) return;
    if (press === "restart" && !(await confirmAction(CONFIRM.restartCase))) return;
    beginOpeningBurst(() => startCase(caseItem.id), caseItem.id);
  };
  const openingCase = seasonCasesBase.find((caseItem) => caseItem.id === openingBurst) ?? null;
  const openingIsFirst = openingCase?.id === seasonCasesBase[0].id;
  // One node with two homes. With no save it is the hero's primary action, so
  // the first click on the page opens the first scene; with a save it sits back
  // beside the name input, below the fold, so overwriting a run stays a
  // deliberate act. Rendering it in both places at once would make every
  // strict-mode locator in the suite ambiguous.
  const startFirstCaseButton = (
    <button
      type="button"
      data-testid="start-first-case"
      onClick={startNewRun}
      onPointerEnter={prefetchGameRuntime}
      onFocus={prefetchGameRuntime}
      disabled={Boolean(openingBurst)}
    >
      <ChevronRight size={18} />
      {introCopy.startButton}
    </button>
  );
  // Only while it is true: unticked, or built with no backend, nothing is sent.
  const consentLine = dataConsent && telemetryEnabled && (
    <small className="consent-note" data-testid="consent-line">
      {introCopy.consentLine.before}
      <a href={`#${DATA_DRAWER_ID}`} onClick={openDataDrawer}>{introCopy.consentLine.link}</a>{introCopy.consentLine.after}
    </small>
  );
  const analystTitle = getAnalystTitle({ currentCase, caseResults });
  const resumePanel = (
    <div className="resume-panel">
      <div>
        {/* The record title rises with the season; it is read from the
            case in play and the cases closed (src/analystTitle.js). */}
        {/* The season number from the second on (NEW GAME+ record, getPastRunMemory). */}
        <span>{introCopy.resume.saved}{analystTitle ? fill(introCopy.resume.title, { title: analystTitle }) : ""}{pastRunMemory?.round > 1 ? fill(introCopy.round, { round: pastRunMemory.round }) : ""}</span>
        {/* The scene title and the route position are read from the
            graph, which the pre-start shell has not loaded. It prints
            the case and the save time instead of guessing them. */}
        <strong>
          {activeCaseMeta?.label ?? introCopy.resume.currentCase}
          {node?.title ? ` · ${node.title}` : ""}
        </strong>
        <small>
          {fill(introCopy.resume.savedAt, { time: formatSaveTime(lastSavedAt), count: savedStory.decisions })}
          {progress === null ? "" : fill(introCopy.resume.progress, { progress })}
        </small>
        {/* 지난 이야기: the last case's ending and what this one is about, or
            the line the last decision left (introViewModel's getStoryRecap).
            A div, so the card's own grid rule lays it out and no style is added. */}
        {savedStory.recap.length > 0 && (
          <div data-testid="resume-recap">
            <span>{introCopy.resume.recap}</span>
            {savedStory.recap.map((line) => <small key={line}>{line}</small>)}
          </div>
        )}
      </div>
      <button
        type="button"
        data-testid="resume-save"
        onClick={resumeSavedGame}
        onPointerEnter={prefetchGameRuntime}
        onFocus={prefetchGameRuntime}
      >
        <ChevronRight size={18} />
        {introCopy.resume.continue}
      </button>
    </div>
  );
  // E-11 번외 사건: hidden until a finale is closed on this device and a side
  // case is written (sideCases.getSideSlot). Read on each draw, so a case
  // closed in the side screen is counted when the start screen comes back.
  const sideSlot = getSideSlot({ newGamePlusUnlocked, caseResults });
  if (sideCaseId) {
    return (
      <LazyScreen>
        <SideCaseScreen caseId={sideCaseId} Music={Music} onClose={() => setSideCaseId(null)} />
      </LazyScreen>
    );
  }
  return (
      <main className="shell intro-shell" aria-busy={Boolean(openingBurst)}>
        <Music modeKey={musicModeKey} />
        {renderRecoveryNotice()}
        {renderErrorLogPanel()}
        {renderSaveStatus()}
        <section className="intro">
          {/* The cold open is one full-bleed stage: the key visual is the
              backdrop of the whole first viewport, graded into the ground on
              the reading side, and the copy column sits on top of it with the
              wordmark, the premise and the only primary button on the page. */}
          <div className="intro-hero">
            <div className="intro-hero-art">
              <figure className="intro-visual">
                <picture>
                  <source media={PHONE_ART_MEDIA} srcSet={heroArt.phone} type="image/webp" />
                  <source srcSet={heroArt.wide} sizes={heroArt.wideSizes} type="image/webp" />
                  <img
                    src="/triggerlab-key-visual.jpg"
                    alt={introCopy.heroAlt}
                    width="1672"
                    height="941"
                    fetchPriority="high"
                  />
                </picture>
                <figcaption>
                  <span lang="en">TRIGGERLAB NIGHT SHIFT</span>
                  <b>{introCopy.heroCaption}</b>
                </figcaption>
              </figure>
            </div>
            <div className="intro-hero-copy">
              <div className="brand-row">
                <span className="brand-mark">
                  <i className="brand-mark-dot" aria-hidden="true" />
                  {gameTitle}
                </span>
                <div className="top-actions">
                  <button className="ghost intro-ranking-button" type="button" onClick={() => onShowRanking(true)}>
                    <Trophy size={15} />
                    {introCopy.ranking}
                  </button>
                  <button className="ghost intro-ranking-button intro-board-button" type="button" onClick={() => onShowBoard(true)}>
                    <MessagesSquare size={15} />
                    {introCopy.board}
                  </button>
                  {__CP_DEBUG_BUILD__ && debugToolsEnabled && (
                    <button
                      className="ghost intro-ranking-button"
                      type="button"
                      data-testid="open-error-log-from-header"
                      aria-expanded={showErrorLog}
                      aria-controls={showErrorLog ? "error-log-panel" : undefined}
                      onClick={() => setShowErrorLog(true)}
                    >
                      <TriangleAlert size={15} />
                      에러 로그
                    </button>
                  )}
                  <span className="case-chip">{GAME_TITLE_READING} / {simplifyPlayerText(activeCaseMeta?.title ?? gameTitle)}</span>
                  <LanguagePicker />
                </div>
              </div>
              <GameWordmark label={gameTitle} reading={GAME_TITLE_READING} />
              <strong className="intro-kicker">{introCopy.subtitle}</strong>
              {/* The premise reads directly under the wordmark. It also keeps
                  `.intro p` -- one of build-critical-css.mjs's probes --
                  pointing at a rendered element. */}
              <p>{introCopy.premise}</p>
              {hasResumableSave ? (
                resumePanel
              ) : (
                <div className="start-input-row intro-launch">
                  {startFirstCaseButton}
                  <a className="intro-briefing-link" href={`#${BRIEFING_DRAWER_ID}`} onClick={openBriefingDrawer}>
                    {introCopy.briefingLink}
                  </a>
                  {consentLine}
                </div>
              )}
              <CloudSavePanel />
              {/* The resume card has no row for it, so with a save it reads
                  under the fold that follows the card. */}
              {hasResumableSave && consentLine}
              <dl className="intro-stats">
                <div>
                  <dt>{introCopy.stats.cases}</dt>
                  <dd>{String(seasonCases.length).padStart(2, "0")}</dd>
                </div>
                {/* How long one of them takes (gameCases.TYPICAL_CASE_MINUTES):
                    nothing on the page said whether this is an evening or a
                    month. The 45-second window this cell used to print is
                    still in the protocol line under the stage. */}
                <div>
                  <dt>{introCopy.stats.oneCase}</dt>
                  <dd>{caseMinutes}<small>{introCopy.stats.minutes}</small></dd>
                </div>
                <div>
                  <dt>{introCopy.stats.answers}</dt>
                  <dd>0</dd>
                </div>
              </dl>
              <StudioCredit />
            </div>
          </div>
          {/* The protocol line runs as a hairline marquee under the stage. The
              painted copies are duplicated for a seamless loop and hidden from
              assistive tech; the single readable copy sits beside them. */}
          <div className="intro-ticker">
            <div className="intro-ticker-track" aria-hidden="true">
              {tickerRun}
              {tickerRun}
            </div>
            <span className="sr-only">{PROTOCOL_LINE}</span>
          </div>
          {nextParticipantMessage && (
            <p className="previous-participant-message">{fill(introCopy.previousMessage, { message: nextParticipantMessage })}</p>
          )}
          <WeeklyRuleNotice />
          <section id="case-access-setup" className="start-priority" aria-label={introCopy.setup.label} tabIndex={-1}>
          <div className="start-console-heading">
            <div>
              <span lang="en">CASE ACCESS SETUP</span>
              <h2>{introCopy.setup.title}</h2>
            </div>
            <small>{introCopy.setup.note}</small>
          </div>
          <div className="start-panel start-console-section">
            <div className="start-section-heading">
              <span lang="en">01 IDENTITY</span>
              <strong>{introCopy.setup.identity}</strong>
            </div>
            <label htmlFor="playerName">{introCopy.setup.nameLabel}</label>
            <div className="start-input-row">
              <input
                id="playerName"
                value={playerName}
                maxLength={PLAYER_NAME_MAX_LENGTH}
                onChange={(event) => setPlayerName(limitText(event.target.value, PLAYER_NAME_MAX_LENGTH))}
                onKeyDown={(event) => {
                  // Enter also confirms a Hangul syllable in the IME; that press
                  // is the name being typed, not a request to start. And with a
                  // save on the device Enter starts nothing: overwriting a run
                  // takes the button, not a key pressed while typing a name.
                  if (event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229) return;
                  if (!hasResumableSave) startNewRun();
                }}
                placeholder={introCopy.setup.namePlaceholder}
              />
              {hasResumableSave && startFirstCaseButton}
            </div>
            {newGamePlusUnlocked && (
              <button type="button" className="new-game-plus-button" onClick={startNewGamePlusRun} disabled={Boolean(openingBurst)}>
                <Sparkles size={16} />
                <span>{newGamePlusLabel()[0]}<span lang="en">NEW GAME+</span>{newGamePlusLabel()[1]}</span>
              </button>
            )}
            {sideSlot && (
              <div className="resume-panel" data-testid="side-case-slot" role="group" aria-label={introCopy.sideSlot.label}>
                <div>
                  <span>{fill(introCopy.sideSlot.heading, { book: sideSlot.book })}</span>
                  <small>{introCopy.sideSlot.text}</small>
                </div>
                {sideSlot.cases.map((sideCase) => (
                  <button
                    key={sideCase.id}
                    type="button"
                    data-testid={`side-case-open-${sideCase.id}`}
                    onClick={() => setSideCaseId(sideCase.id)}
                    disabled={Boolean(openingBurst)}
                  >
                    <ChevronRight size={18} />
                    {sideCase.label} {sideCase.title}
                    {sideCase.resumable ? introCopy.sideSlot.resumable : sideCase.closed ? introCopy.sideSlot.closed : ""}
                  </button>
                ))}
              </div>
            )}
            {__CP_DEBUG_BUILD__ && debugToolsEnabled && (
              <button type="button" data-testid="unlock-all-cases" className="test-unlock" onClick={unlockAllCasesForTest}>
                테스트용 전체 사건 열기
              </button>
            )}
            {__CP_DEBUG_BUILD__ && debugToolsEnabled && (
            <div className="debug-jump-panel" role="group" aria-label="개발용 장면 바로 시작">
              <div>
                <span lang="en">DEBUG JUMP</span>
                <strong>특정 장면 바로 시작</strong>
              </div>
              <div className="debug-jump-controls">
                <select
                  data-testid="debug-case-select"
                  value={debugCaseId}
                  onChange={(event) => {
                    const nextCaseId = event.target.value;
                    const nextNodeOptions = nodeOrders[nextCaseId] ?? [];
                    setDebugCaseId(nextCaseId);
                    setDebugNodeId(nextNodeOptions[0] ?? "start");
                  }}
                  aria-label="디버그 사건 선택"
                >
                  {caseSequence.map((caseId) => (
                    <option key={caseId} value={caseId}>
                      {seasonCasesBase.find((caseItem) => caseItem.id === caseId)?.label ?? caseId}
                    </option>
                  ))}
                </select>
                <select
                  key={debugCaseId}
                  data-testid="debug-node-select"
                  value={debugNodeId}
                  onChange={(event) => {
                    setDebugNodeId(event.target.value);
                  }}
                  aria-label="디버그 장면 선택"
                >
                  {debugNodeOptions.map((debugNode) => (
                    <option key={debugNode} value={debugNode}>
                      {debugNode} · {nodes[debugNode]?.title ?? debugNode}
                    </option>
                  ))}
                </select>
                <button type="button" data-testid="debug-start-node" onClick={startDebugNode}>
                  장면 시작
                </button>
              </div>
            </div>
            )}
          </div>
          </section>
          {pastRunMemory && (
            <section className="past-run-memory intro-memory" aria-label={introCopy.pastRunLabel}>
              {/* The English name is read as English, the season number as Korean (문구 질문 9). */}
              <span>
                <span lang="en">PAST RUN MEMORY</span>
                {pastRunMemory.round > 1 ? fill(introCopy.round, { round: pastRunMemory.round }) : ""}
              </span>
              <p>{pastRunMemory.text}</p>
              {/* 결말 도감 (E-3): lines the runtime wrote into the season record. */}
              {pastRunMemory.book && (
                <details>
                  <summary>{pastRunMemory.book.head}</summary>
                  {pastRunMemory.book.hints.map((hint) => <p key={hint}>{hint}</p>)}
                </details>
              )}
            </section>
          )}
          {/* Pre-start prose folds behind closed native <details>. The element
              supplies the disclosure state, the button role and Enter/Space to
              assistive tech, so nothing here hand-rolls aria-expanded. The
              drawers tile two-up on a wide screen and an open one takes the
              whole row, so its contents never read at half width. */}
          <div className="intro-drawer-grid">
          <details className="intro-drawer" id={BRIEFING_DRAWER_ID}>
            <summary>
              <span lang="en">PRE-START BRIEFING</span>
              <h2>{introCopy.briefing.title}</h2>
            </summary>
          <section className="prestart-briefing" aria-label={introCopy.briefing.label}>
            <div className="prestart-heading">
              <small>{introCopy.briefing.note}</small>
            </div>
            <div className="prestart-grid">
              <article>
                <span>{introCopy.briefing.firstCase}</span>
                <b>{seasonCasesBase[0].title}</b>
                <p>{caseObjectives[seasonCasesBase[0].id]}</p>
              </article>
              <article>
                <span>{introCopy.briefing.watch}</span>
                <b>{introCopy.briefing.watchTitle}</b>
                <p>{triggerLabSignals[seasonCasesBase[0].id]}</p>
              </article>
              <article>
                <span>{introCopy.briefing.next}</span>
                <b>{introCopy.briefing.nextTitle}</b>
                <p>{introCopy.briefing.nextText}</p>
              </article>
            </div>
            <div className="prestart-tutorial">
              <span lang="en">FIRST RUN PROTOCOL</span>
              <div>{tutorialSteps.map((step) => <article key={step.id}><b>{step.label}</b><small>{step.text}</small></article>)}</div>
            </div>
          </section>
          </details>
          <details className="intro-drawer">
            <summary>
              <span lang="en">02 ANALYST PROTOCOL</span>
              <h2>{introCopy.playStyle.title}</h2>
            </summary>
          <section className="play-style-panel" aria-label={introCopy.playStyle.label}>
            <div className="panel-title-row">
              {/* The three cards are a pick-one pledge and change no rule. The
                  one setting that does is on or off, so it is a switch in the
                  comfort panel and not a fourth card here, where it read as
                  two of four picked. */}
              <small>{introCopy.playStyle.note}</small>
            </div>
            <div className="play-style-grid">
              {playStyleOptions.map((style) => (
                <button
                  type="button"
                  key={style.id}
                  className={playStyle === style.id ? "play-style selected" : "play-style"}
                  onClick={() => {
                    setPlayStyle(style.id);
                    persist({ playStyle: style.id });
                  }}
                  aria-pressed={playStyle === style.id}
                >
                  <span>{style.label}</span>
                  <strong>{style.title}</strong>
                  {/* Not a <p>: a button holds phrasing content only (see the
                      case cards below). */}
                  <em>{style.text}</em>
                  <small>{style.payoff}</small>
                </button>
              ))}
            </div>
            <p className="play-style-note">{fill(introCopy.playStyle.current, { label: activePlayStyle.label, title: activePlayStyle.title })}</p>
          </section>
          </details>
          <details className="intro-drawer">
            <summary>
              <span lang="en">03 OPERATOR ORIGIN</span>
              <h2>{introCopy.origin.title}</h2>
            </summary>
            <section className="operator-origin-panel start-console-section" aria-label={introCopy.origin.label}>
              <div className="panel-title-row">
                <small>{introCopy.origin.note}</small>
              </div>
              <div className="operator-origin-grid">
                {operatorProfiles.map((profile) => (
                  <button
                    type="button"
                    key={profile.id}
                    className={operatorOrigin === profile.id ? "operator-origin selected" : "operator-origin"}
                    onClick={() => setOperatorOrigin(profile.id)}
                    aria-pressed={operatorOrigin === profile.id}
                  >
                    <span>{profile.label}</span>
                    <strong>{profile.title}</strong>
                    <em>{profile.premise}</em>
                    <small>{profile.start}</small>
                  </button>
                ))}
              </div>
              <p className="operator-origin-selected">{fill(introCopy.origin.current, { title: operatorProfile.title, start: operatorProfile.start })}</p>
              <div className="origin-prologue"><span lang="en">ORIGIN PROLOGUE</span><strong>{originPrologue.title}</strong><p>{originPrologue.text}</p></div>
            </section>
          </details>
          <details className="intro-drawer">
            <summary>
              <span lang="en">ACCESSIBILITY</span>
              <h2>{introCopy.comfortTitle}</h2>
            </summary>
            <AccessibilityPanel />
            <InstallHintSlot />
          </details>
          <details className="intro-drawer">
            <summary>
              <span lang="en">SEASON 1</span>
              <h2>{introCopy.season.title}</h2>
            </summary>
            <div className="season-panel">
              <p>{introCopy.season.text}</p>
            </div>
            <p className="play-style-unlock"><strong>{playStyleUnlocks.label}</strong> · {playStyleUnlocks.unlock} · {playStyleUnlocks.newGamePlus}</p>
          </details>
          <details className="intro-drawer">
            <summary>
              <span lang="en">SEASON GOALS</span>
              <h2>{introCopy.goalsTitle}</h2>
            </summary>
            <section className="season-goal-strip" aria-label={introCopy.goalsTitle}>
              {seasonGoals.map((goal) => <article key={goal.id}><b>{goal.label}</b><small>{goal.text}</small></article>)}
            </section>
          </details>
          <details className="intro-drawer">
            <summary>
              <h2>{introCopy.guide.title}</h2>
            </summary>
          <section className="quick-guide" aria-label={introCopy.guide.title}>
            <div className="guide-heading">
              <Info size={16} />
              <span>{introCopy.guide.heading}</span>
            </div>
            <div className="guide-grid">
              {playGuideItems.map((item) => (
                <article key={item.title}>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
          </details>
          {/* The summary text stays visible: the box starts ticked, and this
              drawer is never nested inside another closed one, so the notice
              and the way out are always one deliberate click away. */}
          <details className="intro-drawer" id={DATA_DRAWER_ID}>
            <summary>
              <h2>{introCopy.data.title}</h2>
            </summary>
          <section className="data-info-panel" aria-label={introCopy.data.title}>
            <label className="consent-box">
              <input
                type="checkbox"
                checked={dataConsent}
                onChange={consent.onChange}
              />
              <span>
                <b>{introCopy.data.consent}</b>
                <small>
                  {telemetryEnabled
                    ? introCopy.data.playtestNotice
                    : introCopy.data.noRemote}
                </small>
                <small className={telemetryEnabled ? "data-status ready" : "data-status local"}>
                  {!isOnline ? introCopy.data.offline : telemetryEnabled ? introCopy.data.ready : introCopy.data.local}
                </small>
              </span>
            </label>
            {/* Beside the box it is about, and mounted before it has anything
                to say, so the sentence is announced when it arrives. */}
            <p className={`consent-note ${consent.note?.tone ?? ""}`} role="status" aria-live="polite" aria-atomic="true" data-testid="consent-note">
              {consent.note?.text}
            </p>
            <div className={`db-status-panel ${telemetrySummary.tone}`}>
              <div>
                <span>{introCopy.data.status}</span>
                <strong>{telemetrySummary.title}</strong>
              </div>
              <p>{telemetrySummary.text}</p>
              <small>
                {introCopy.data.sessionCode}<span data-testid="session-code">{sessionCode}</span>
              </small>
            </div>
            <div className="privacy-note">
              <b>{introCopy.data.notice}</b>
              <p>
                {introCopy.data.privacy}
                {/* Where a deletion request goes (SUPPORT_CONTACT in appConfig.js),
                    beside the session code it needs, which this panel shows above. */}
                <DeletionRequest />
              </p>
              <p>
                {introCopy.data.more}<a href={PRIVACY_PAGE_PATH}>{introCopy.legal.privacy}</a>{introCopy.data.and}
                <a href={TERMS_PAGE_PATH}>{introCopy.legal.terms}</a>{introCopy.data.end}
              </p>
            </div>
          </section>
          </details>
          </div>
          {completedCaseResultList.length > 0 && (
            <section className="season-summary">
              <div>
                <span lang="en">SEASON LOG</span>
                <strong>{introCopy.seasonLog.title}</strong>
              </div>
              <div className="season-summary-list">
                {completedCaseResultList.map((caseItem) => (
                  <article key={caseItem.id}>
                    <b>{caseItem.label}</b>
                    <span>{triggerLabels[caseItem.result.primary[0]]}</span>
                    <small>
                      {fill(introCopy.seasonLog.result, {
                        rank: caseItem.result.rank,
                        seconds: caseItem.result.averageResponseTime,
                        count: caseItem.result.reframeCount,
                      })}
                    </small>
                  </article>
                ))}
              </div>
              <div className="season-journey" role="group" aria-label={introCopy.seasonLog.journeyLabel}>
                {seasonJourney.map((caseItem, index) => (
                  <Fragment key={caseItem.id}>
                    {index > 0 && <ChevronRight className="season-journey-arrow" size={18} aria-hidden="true" />}
                    <article className="season-journey-card">
                      <div className="season-journey-card-head">
                        <b>{caseItem.label}</b>
                        <span>{caseItem.outcome.tag}</span>
                      </div>
                      <strong>{caseItem.outcome.title}</strong>
                      <p>{caseItem.outcome.text}</p>
                      {Object.keys(caseItem.carryover).length > 0 && (
                        <small>
                          {fill(introCopy.seasonLog.carryover, {
                            list: Object.entries(caseItem.carryover)
                              .map(([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`)
                              .join(" · "),
                          })}
                        </small>
                      )}
                    </article>
                  </Fragment>
                ))}
              </div>
            </section>
          )}
          <div id="season-roadmap" className="roadmap-heading" tabIndex={-1}>
            <span lang="en">SEASON ROADMAP</span>
            <b>{introCopy.roadmap.title}</b>
          </div>
          <div className="case-roadmap">
            {seasonCases.map((caseItem) => {
              const savedResult = caseResults[caseItem.id]
                ? normalizeCaseSummary(caseResults[caseItem.id])
                : null;
              const canOpenCase =
                caseItem.status === "OPEN" ||
                caseItem.status === "PLAYING" ||
                caseItem.status === "COMPLETE";
              const isActiveCase = caseItem.status === "PLAYING" || caseItem.status === "OPEN";
              return (
                /* A card is an article with a heading, and the heading holds
                   the one control: a <button> may only hold phrasing content,
                   and a card built as one button put a heading, a paragraph
                   and a block inside it. The button's ::after covers the card,
                   so the whole card is still what a pointer presses. */
                <article
                  key={caseItem.id}
                  /* The file number the row is stamped with. It is decoration
                     drawn from a ::before, so the label the button announces is
                     still the aria-label below and not a second reading of the
                     index. It is the case's own code rather than its place in
                     the list: the 프롤로그 sits in front of 사건 01, so a
                     position counter stamped 사건 01 with "06". */
                  data-index={caseDisplayCode(caseItem.id)}
                  className={[
                    "case-card",
                    isActiveCase ? "active-case" : caseItem.status === "COMPLETE" ? "complete-case" : "",
                    canOpenCase ? "" : "locked-case",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div>
                    <span>{caseItem.label}</span>
                    <small className="case-status-chip">
                      {caseItem.status === "LOCKED" && <LockKeyhole size={13} />}
                      {getCaseStatusText(caseItem.status)}
                    </small>
                  </div>
                  <h2>
                    <GuardedButton
                      type="button"
                      className="case-card-open"
                      blocked={!canOpenCase}
                      aria-label={`${caseItem.label} ${caseItem.title}. ${getCaseStatusText(caseItem.status)}`}
                      /* The summary is cut at three lines on every card but the
                         one the season is at (.active-case p). The button
                         covers the card, so its title is the card's tooltip
                         and carries the whole of a summary that was cut. */
                      title={isActiveCase ? undefined : simplifyPlayerText(caseItem.summary)}
                      onClick={() => pressCaseCard(caseItem)}
                    >
                      {simplifyPlayerText(caseItem.title)}
                    </GuardedButton>
                  </h2>
                  <b>{simplifyPlayerText(caseItem.trigger)}</b>
                  <p>{simplifyPlayerText(caseItem.summary)}</p>
                  {caseItem.status === "LOCKED" && (
                    <small className="case-lock-note">{introCopy.roadmap.locked}</small>
                  )}
                  {savedResult && (
                    <small className="case-result-mini">
                      <span lang="en">RANK {savedResult.rank}</span>
                      {fill(introCopy.roadmap.result, {
                        thinking: triggerLabels[savedResult.primary[0]] ?? "",
                        seconds: savedResult.averageResponseTime,
                        count: savedResult.reframeCount,
                      })}
                    </small>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        {/* Plain links to the two files beside the build (privacyText.js):
            the address a store listing names, and one a player can reach
            from the bottom of the page without opening the data drawer. */}
        <footer className="intro-legal">
          <a href={PRIVACY_PAGE_PATH}>{introCopy.legal.privacy}</a>
          <a href={TERMS_PAGE_PATH}>{introCopy.legal.terms}</a>
        </footer>
        {/* What the burst says to a screen reader. The region is on the page
            before the burst is, so the sentence is news when it lands; the
            burst itself is a picture of the same thing. */}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {openingCase ? fill(introCopy.opening.entering, { case: openingIsFirst ? introCopy.opening.firstCase : openingCase.label }) : ""}
        </p>
        {openingCase && (
          <div className="opening-burst" data-testid="opening-burst" aria-hidden="true">
            <div className="opening-burst-grid" />
            <div className="opening-burst-panel">
              <span lang="en">CREATIVITY BURST / {`CASE ${caseDisplayCode(openingCase.id)}`} ACCESS</span>
              <strong>{openingIsFirst ? introCopy.opening.first : fill(introCopy.opening.syncing, { case: openingCase.label })}</strong>
              <i />
            </div>
          </div>
        )}
      </main>
);
}
