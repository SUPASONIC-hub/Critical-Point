import { MessageSquareText, Info } from "lucide-react";
import { DecisionRail } from "../components/DecisionRail.jsx";
import { DecisionClock } from "../components/DecisionClock.jsx";
import { RecordRoom } from "../components/RecordRoom.jsx";
import { GameHeader } from "../components/GameHeader.jsx";
import { ResourceRail } from "../components/ResourceRail.jsx";
import { CommitConsole } from "../components/CommitConsole.jsx";
import { ChoiceList } from "../components/ChoiceList.jsx";
import { FreeTextReframeBox } from "../components/FreeTextReframeBox.jsx";
import { CASE_SEQUENCE } from "../gameData.js";
import { getArtSources, PHONE_ART_MEDIA } from "../responsiveArt.js";
import { getFreeTextSignals } from "../gameLogic.js";

/**
 * One decision, one screen.
 *
 * This screen carried twenty-eight standing sections and seven drawers, which
 * measured 3,953px on a 390x844 phone: 4.7 screens of scrolling for one of the
 * forty-two choices in a run. Everything that is not the scene, the clock, the
 * three standing resources or the choices now lives behind `RecordRoom`, and
 * the scene reads as prose rather than as seven labelled fields.
 */
export function PlayScreen({ view }) {
  const {
    common: {
      suspenseState, AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice,
      renderErrorLogPanel, screenReaderStatus, simplifyPlayerText, currentCase, sceneTitleRef,
      renderSaveStatus, renderSceneLines,
    },
    scene: {
      node, sceneChallenge, narrativeSpine, sceneVisuals, speakerProfile, speakerPortrait,
      resolvedNodeId, sceneDirection, latestBeat, openingLegacy,
    },
    decision: {
      isAdvancing, pendingChoice, showTacticalDetails, setShowTacticalDetails, decisionForecasts,
      pressureLeader, previewChoice, pendingChoiceRead, pendingChoiceForecast, commitConsoleRef,
      formatRiskDelta, formatForecastRisk, setPendingChoice, commitConfirmRef, choose,
    },
    choices: {
      fixedChoices, getEffectiveChoiceRead, getRiskPressure, getChallengeMatch, choiceButtonsRef,
      handleChoiceClick, beginChoiceHold, endChoiceHold, speechifyChoice, getChoiceSubtext,
      getDramaticChoiceLabel, explainResourceTradeoff, easyCognitionLabels, cognitionLabels,
    },
    freeInput: {
      latestFreeTextSuccess, freeChoice, boardChangePrompts, updateFreeText, freeText,
      FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals, anonymizeFreeText,
      activeFreeTextSignalCount, freeTextPreview,
    },
    status: {
      riskPressure, saveCurrentGame, reset, progress, easyRiskLabels, riskTier, log, clueCount,
      currentChallengeStreak, resourceMeta, applyEffect, resources, routeIndex, routeLength,
    },
    investigation: { evidenceCount },
    debug: {
      debugToolsEnabled, fallbackCaseId, silentFailureCount, copyReplayLink, copyDiagnosticTrace,
    },
  } = view;
  // The four criteria used to be listed while typing, which read as an answer
  // key: one keyword each cleared all of them. They are feedback on what the
  // last submitted sentence actually carried instead.
  const lastFreeTextSignals = latestFreeTextSuccess?.freeText
    ? getFreeTextSignals(latestFreeTextSuccess.freeText)
    : null;
  const sceneArt = getArtSources(sceneVisuals[currentCase]);
  const latestObserverTag = log.at(-1)?.observerTag;
  const getObserverPreviewForChoice = (choiceId) =>
    decisionForecasts.find(({ choice }) => choice.id === choiceId)?.observerPreview;
  const observerWhisper =
    latestObserverTag
      ? `${latestObserverTag.label}: ${latestObserverTag.text}`
      : suspenseState.tier === "REDLINE"
      ? "관찰 기록이 사건 보고보다 먼저 갱신되고 있습니다."
      : suspenseState.tier === "UNSTABLE"
        ? "에코의 질문이 조언보다 검증 절차에 가깝게 변했습니다."
        : currentChallengeStreak > 0
          ? "방금 맞힌 목표가 다음 장면의 기준선으로 남았습니다."
          : "아직 관찰자는 침묵하지만, 선택의 순서는 저장되고 있습니다.";
  // Six paintings carry forty-two scenes, so the same room has to read as a
  // different hour of the same day. The tone index walks the route rather than
  // the case, and the stylesheet turns it into a crop and a colour temperature.
  const sceneTone = Math.max(0, routeIndex) % 4;
  return (
    <main className={`shell game-shell suspense-${suspenseState.tier.toLowerCase()}`}>
      <AdaptiveMusic modeKey={musicModeKey} />
      {renderDecisionReveal()}
      {renderRecoveryNotice()}
      {renderErrorLogPanel()}
      <a className="skip-link" href="#choice-panel">
        선택지로 건너뛰기
      </a>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {screenReaderStatus}
      </p>
      <aside className="play-rail" aria-label="상시 상태">
        <ResourceRail
          resourceMeta={resourceMeta}
          resources={resources}
          riskPressure={riskPressure}
          riskTier={riskTier}
          easyRiskLabels={easyRiskLabels}
        />
        <DecisionClock />
      </aside>
      <section className={pendingChoice ? "game-board has-commit-console" : "game-board"}>
        <GameHeader
          node={node}
          simplify={simplifyPlayerText}
          sceneTitleRef={sceneTitleRef}
          onSave={() => saveCurrentGame()}
          onSaveAndExit={() => saveCurrentGame({ exit: true })}
          onReset={reset}
          caseNumber={Math.max(1, CASE_SEQUENCE.indexOf(currentCase) + 1)}
          caseTotal={CASE_SEQUENCE.length}
          progress={progress}
        />
        {renderSaveStatus()}
        <RecordRoom view={view} />

        <div className="scene">
          <div className={`scene-visual tone-${sceneTone}`} aria-hidden="true">
            <picture>
              {sceneArt && <source media={PHONE_ART_MEDIA} srcSet={sceneArt.phone} type="image/webp" />}
              {sceneArt && <source srcSet={sceneArt.wide} type="image/webp" />}
              <img
                src={sceneVisuals[currentCase] ?? "/triggerlab-key-visual.jpg"}
                alt=""
                width="1792"
                height="1024"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  if (event.currentTarget.dataset.fallback === "true") return;
                  event.currentTarget.dataset.fallback = "true";
                  event.currentTarget.src = "/triggerlab-key-visual.jpg";
                }}
              />
            </picture>
          </div>
          <div className="speaker">
            <img
              src={speakerPortrait ?? "/speaker-profile-160.webp"}
              alt=""
              width="52"
              height="52"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                if (event.currentTarget.dataset.fallback === "true") return;
                event.currentTarget.dataset.fallback = "true";
                event.currentTarget.src = "/speaker-profile-160.webp";
              }}
            />
            <span>
              <b>{node.speaker}</b>
              <small>{speakerProfile.role} · {speakerProfile.stance}</small>
            </span>
          </div>
          {/* Prose, not fields. The same three beats were seven labelled rows
              here, which taught the player to read the labels instead of the
              scene; the reference reads that used to sit between them are in
              the fold below. */}
          <div className="scene-story">
            <p className="scene-narration">{speakerProfile.appearance} {speakerProfile.gesture}</p>
            {openingLegacy && (
              <p className="observer-whisper"><span className="story-label">PREVIOUS STANDARD DETECTED</span>{openingLegacy.title}</p>
            )}
            <p className="scene-body scene-critical">{node.text}</p>
            <p className="scene-dialogue">"{speakerProfile.line}" <span className="story-voice">({speakerProfile.voice})</span></p>
            <p className="observer-whisper"><span className="story-label">관찰자 메모</span>{observerWhisper}</p>
            <details className="scene-secondary">
              <summary>장면의 여운과 단서 보기</summary>
              <p className="scene-direction"><span className="story-label">왜 지금 결정해야 하나</span>{sceneDirection}</p>
              {latestFreeTextSuccess && latestFreeTextSuccess.nodeId !== resolvedNodeId && (
                <p className="scene-continuity-quote">
                  <span className="story-label">이어진 기록</span>
                  이전 문장이 다음 장면의 기준으로 남아 있다: “{latestFreeTextSuccess.freeText}”
                </p>
              )}
              <p className="scene-thought"><span className="story-label">속마음</span>'{speakerProfile.thought}'</p>
              <p className="scene-secondary-note"><span className="story-label">다음 장면의 질문</span>{narrativeSpine.nextQuestion}</p>
            </details>
          </div>
        </div>

        {latestBeat && (
          <section className="scene-beat">
            <div className="panel-title-row">
              <h2>
                <MessageSquareText size={17} />
                직전 선택의 여운
              </h2>
              <span>선택이 회의실의 대화와 침묵을 어떻게 바꿨는지 기록합니다.</span>
            </div>
            <div className="scene-beat-preview">
              {renderSceneLines(latestBeat.split("\n").slice(0, 2).join("\n"))}
            </div>
            <details className="scene-beat-more">
              <summary>전체 장면 보기</summary>
              <div>{renderSceneLines(latestBeat)}</div>
            </details>
          </section>
        )}

        <section className="choice-panel" id="choice-panel" aria-labelledby="choice-heading" tabIndex={-1}>
          <DecisionRail pendingChoice={pendingChoice} />
          <div className="choice-heading">
            <h2 id="choice-heading">어떻게 말할까</h2>
            <p className="choice-question">{narrativeSpine.question}</p>
            <div className="turn-tactic">
              <span>이번 턴 공략</span>
              <strong>{sceneChallenge.title}</strong>
            </div>
          </div>
          <button
            type="button"
            className="tactical-toggle"
            onClick={() => setShowTacticalDetails((value) => !value)}
            aria-expanded={showTacticalDetails}
          >
            <Info size={15} />
            {showTacticalDetails ? "전술 정보 닫기" : "전술 정보 열기"}
          </button>
          {showTacticalDetails && (
            <section className="tactical-brief" aria-label="판단 힌트">
              <div className="forecast-header">
                <div className="forecast-options" aria-label="Choice pressure comparison">
                  {decisionForecasts.map(({ choice, forecast }) => (
                    <button
                      type="button"
                      key={choice.id}
                      className={`forecast-option ${forecast.forecastPrecision}`}
                      onClick={() => previewChoice(choice)}
                      aria-pressed={pendingChoice?.id === choice.id}
                    >
                      <strong>{choice.label}</strong>
                      <span>
                        {forecast.forecastPrecision === "precise"
                          ? `Risk ${formatRiskDelta(forecast.riskDelta)}`
                          : `Risk ${formatRiskDelta(forecast.riskDeltaMin)} ~ ${formatRiskDelta(forecast.riskDeltaMax)}`}
                      </span>
                      <small>{forecast.forecastPrecision === "precise" ? "Precise forecast" : "Gather evidence to narrow this range"}</small>
                    </button>
                  ))}
                </div>
                <span>판단 힌트</span>
                <strong>{pressureLeader ? pressureLeader.label : "현재 압박"}을 먼저 확인하세요</strong>
                <p>
                  이 보기는 정답을 계산하지 않고, 각 선택이 어느 방향의 부담을 만들 수 있는지만 보여줍니다.
                  정확한 수치와 등급은 선택 후 결과 로그에서 확인합니다.
                </p>
              </div>
            </section>
          )}
          <CommitConsole
            suspenseTier={suspenseState.tier}
            commitConsoleRef={commitConsoleRef}
            commitConfirmRef={commitConfirmRef}
            pendingChoice={pendingChoice}
            pendingChoiceRead={pendingChoiceRead}
            pendingChoiceForecast={pendingChoiceForecast}
            speechifyChoice={speechifyChoice}
            formatForecastRisk={formatForecastRisk}
            getObserverPreviewForChoice={getObserverPreviewForChoice}
            evidenceCount={evidenceCount}
            resourceMeta={resourceMeta}
            setPendingChoice={setPendingChoice}
            choose={choose}
          />
          <ChoiceList
            fixedChoices={fixedChoices}
            clueCount={clueCount}
            resources={resources}
            getEffectiveChoiceRead={getEffectiveChoiceRead}
            getObserverPreviewForChoice={getObserverPreviewForChoice}
            getChallengeMatch={getChallengeMatch}
            pendingChoice={pendingChoice}
            choiceButtonsRef={choiceButtonsRef}
            handleChoiceClick={handleChoiceClick}
            beginChoiceHold={beginChoiceHold}
            endChoiceHold={endChoiceHold}
            isAdvancing={isAdvancing}
            choose={choose}
            speechifyChoice={speechifyChoice}
            getChoiceSubtext={getChoiceSubtext}
            showTacticalDetails={showTacticalDetails}
            getDramaticChoiceLabel={getDramaticChoiceLabel}
            simplifyPlayerText={simplifyPlayerText}
            resourceMeta={resourceMeta}
          />
          <FreeTextReframeBox
            activeFreeTextSignalCount={activeFreeTextSignalCount}
            activePrivacySignals={activePrivacySignals}
            anonymizeFreeText={anonymizeFreeText}
            applyEffect={applyEffect}
            boardChangePrompts={boardChangePrompts}
            choose={choose}
            cognitionLabels={cognitionLabels}
            easyCognitionLabels={easyCognitionLabels}
            explainResourceTradeoff={explainResourceTradeoff}
            freeChoice={freeChoice}
            freeText={freeText}
            FREE_TEXT_MAX_LENGTH={FREE_TEXT_MAX_LENGTH}
            freeTextBlockedByPrivacy={freeTextBlockedByPrivacy}
            freeTextPreview={freeTextPreview}
            getRiskPressure={getRiskPressure}
            isAdvancing={isAdvancing}
            lastFreeTextSignals={lastFreeTextSignals}
            resourceMeta={resourceMeta}
            resources={resources}
            riskPressure={riskPressure}
            sceneChallenge={sceneChallenge}
            updateFreeText={updateFreeText}
          />
        </section>
      </section>
      {debugToolsEnabled && (
        <aside className="debug-overlay" data-testid="debug-overlay" aria-label="개발자 진행 추적">
          <div className="debug-overlay-heading">
            <span>DEBUG</span>
            <b>{fallbackCaseId} / {resolvedNodeId}</b>
          </div>
          <dl>
            <div><dt>path</dt><dd>{Math.max(0, routeIndex) + 1}/{routeLength}</dd></div>
            <div><dt>risk</dt><dd>{riskPressure} · {riskTier}</dd></div>
            <div><dt>resources</dt><dd>{Object.entries(resources).map(([key, value]) => `${key}:${value}`).join(" ")}</dd></div>
            <div><dt>silent</dt><dd>{silentFailureCount}</dd></div>
          </dl>
          <button type="button" className="ghost" data-testid="copy-replay-link" onClick={copyReplayLink}>Copy replay link</button>
          <button type="button" className="ghost" onClick={copyDiagnosticTrace}>Copy trace</button>
        </aside>
      )}
    </main>
  );
}
