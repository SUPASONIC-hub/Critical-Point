import React from "react";
import { Check, Info, LockKeyhole, MessageSquareText, Send, Sparkles } from "lucide-react";
import { DecisionRail } from "../components/DecisionRail.jsx";
import { DecisionDock } from "../components/DecisionDock.jsx";
import { MemoPanel } from "../components/MemoPanel.jsx";
import { StatusBoard } from "../components/StatusBoard.jsx";
import { GameMetricsDrawer } from "../components/GameMetricsDrawer.jsx";
import { GameHeader } from "../components/GameHeader.jsx";

export function PlayScreen({ view }) {
  const { suspenseState, AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, simplifyPlayerText, caseObjectives, currentCase, node, triggerLabels, openingLegacy, pressureCascade, riskPressure, playGuideItems, sceneTitleRef, saveCurrentGame, reset, renderSaveStatus, progress, easyRiskLabels, riskTier, activeBonus, freeTextCombo, currentAverageResponseTime, log, clueCount, discoveredClues, currentChallengeStreak, momentumTier, streakGoal, streakRemaining, momentumScore, decisionSeconds, protocolUsed, isAdvancing, activateCrisisProtocol, decisionFingerprint, decisionLedger, resourceMeta, sceneChallenge, triggerLabSignals, narrativeSpine, questSteps, sceneVisuals, speakerProfile, latestFreeTextSuccess, resolvedNodeId, sceneDirection, latestBeat, renderSceneLines, setMemoOpened, echo, probeUsed, echoProbeCost, requestEchoProbe, getEchoChecks, pendingChoice, showTacticalDetails, setShowTacticalDetails, decisionForecasts, pressureLeader, pressureLensForecast, tradeoffLensForecast, previewChoice, describeForecast, evidenceCount, pendingChoiceRead, pendingChoiceForecast, commitConsoleRef, formatRiskDelta, setPendingChoice, commitConfirmRef, choose, fixedChoices, getEffectiveChoiceRead, getRiskPressure, getChallengeMatch, choiceButtonsRef, handleChoiceClick, beginChoiceHold, endChoiceHold, speechifyChoice, getChoiceSubtext, getDramaticChoiceLabel, explainResourceTradeoff, easyCognitionLabels, cognitionLabels, freeChoice, boardChangePrompts, updateFreeText, freeText, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals, anonymizeFreeText, activeFreeTextSignalCount, freeTextSignals, freeTextPreview, applyEffect, resources, playerName, activePlayStyle, turnBriefItems, completedCases, activeCaseMeta, debugToolsEnabled, fallbackCaseId, routeIndex, routeLength, silentFailureCount, copyReplayLink, copyDiagnosticTrace } = view;
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
      <section className="game-board">
        <details className="game-context-drawer insight-drawer">
          <summary>
            <span>현재 상황판</span>
            <b>목표·압박·자원·기록 보기</b>
          </summary>
        <section className="mission-strip">
          <div>
            <span>현재 목표</span>
            <strong>{simplifyPlayerText(caseObjectives[currentCase] ?? caseObjectives.case01)}</strong>
          </div>
          <div>
            <span>이번 장면</span>
            <strong>{simplifyPlayerText(node.phase)}</strong>
          </div>
          <div>
            <span>핵심 압박</span>
            <strong>{simplifyPlayerText(node.triggers.map((trigger) => triggerLabels[trigger]).join(" / "))}</strong>
          </div>
        </section>
        {openingLegacy && (
          <section className="legacy-panel">
            <div>
              <span>{simplifyPlayerText(openingLegacy.label)}</span>
              <strong>{simplifyPlayerText(openingLegacy.title)}</strong>
            </div>
            <p>{simplifyPlayerText(openingLegacy.text)}</p>
            {openingLegacy.continuity && (
              <div className="continuity-bridge">
                <span>직전 사건의 결과</span>
                <strong>{simplifyPlayerText(openingLegacy.continuity.title)}</strong>
                <p>{simplifyPlayerText(openingLegacy.continuity.text)}</p>
              </div>
            )}
            <div className="legacy-effect">
              {Object.entries(openingLegacy.effect).map(([key, value]) => (
                <small key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                  {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}{value}
                </small>
              ))}
            </div>
          </section>
        )}
        <section className={`pressure-cascade ${pressureCascade.tone}`}>
          <div className="pressure-cascade-mark">
            <span>{simplifyPlayerText(pressureCascade.label)}</span>
            <strong>{riskPressure}</strong>
          </div>
          <div>
            <h2>{simplifyPlayerText(pressureCascade.title)}</h2>
            <p>{simplifyPlayerText(pressureCascade.text)}</p>
          </div>
          <small>{simplifyPlayerText(pressureCascade.cue)}</small>
        </section>
        <section className={`suspense-console ${suspenseState.tier.toLowerCase()}`} aria-label="서스펜스 신호">
          <div className="suspense-console-mark">
            <span>{simplifyPlayerText(suspenseState.label)}</span>
            <strong>{String(suspenseState.score).padStart(2, "0")}</strong>
          </div>
          <div className="suspense-console-copy">
            <h2>{simplifyPlayerText(suspenseState.title)}</h2>
            <p>{simplifyPlayerText(suspenseState.text)}</p>
          </div>
          <div className="suspense-meter" aria-label={`서스펜스 ${suspenseState.score}퍼센트`}>
            <div style={{ width: `${suspenseState.score}%` }} />
            <small>{simplifyPlayerText(suspenseState.cue)} · 사건 {suspenseState.caseCode}</small>
          </div>
        </section>
        <details className="play-help">
          <summary>
            <span>
              <Info size={16} />
              플레이 규칙
            </span>
            <b>에코, 구조 재설계, 자원 변화를 다시 확인합니다.</b>
          </summary>
          <div className="guide-grid compact-guide">
            {playGuideItems.map((item) => (
              <article key={item.title}>
                <b>{item.title}</b>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </details>
        </details>
        <GameHeader
          node={node}
          simplify={simplifyPlayerText}
          sceneTitleRef={sceneTitleRef}
          onSave={() => saveCurrentGame()}
          onSaveAndExit={() => saveCurrentGame({ exit: true })}
          onReset={reset}
        />
        {renderSaveStatus()}
        <div
          className="progress-wrap"
          role="progressbar"
          aria-label="현재 케이스 진행률"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <div style={{ width: `${progress}%` }} />
        </div>

        <GameMetricsDrawer
          riskTier={riskTier}
          easyRiskLabels={easyRiskLabels}
          riskPressure={riskPressure}
          activeBonus={activeBonus}
          freeTextCombo={freeTextCombo}
          currentAverageResponseTime={currentAverageResponseTime}
          progress={progress}
          log={log}
          clueCount={clueCount}
          discoveredClues={discoveredClues}
          currentChallengeStreak={currentChallengeStreak}
          momentumTier={momentumTier}
          streakGoal={streakGoal}
          streakRemaining={streakRemaining}
          momentumScore={momentumScore}
          decisionSeconds={decisionSeconds}
          protocolUsed={protocolUsed}
          isAdvancing={isAdvancing}
          activateCrisisProtocol={activateCrisisProtocol}
          decisionFingerprint={decisionFingerprint}
          decisionLedger={decisionLedger}
          resourceMeta={resourceMeta}
          sceneChallenge={sceneChallenge}
          triggerLabSignals={triggerLabSignals}
          currentCase={currentCase}
          node={node}
          triggerLabels={triggerLabels}
          narrativeSpine={narrativeSpine}
          suspenseState={suspenseState}
          questSteps={questSteps}
          simplifyPlayerText={simplifyPlayerText}
        />

        <div className="scene">
          <div className="scene-visual" aria-hidden="true">
            <img
              src={sceneVisuals[currentCase] ?? "/triggerlab-key-visual.png"}
              alt=""
              width="1792"
              height="1024"
              loading="lazy"
            />
          </div>
          <div className="speaker">
            <div>{node.speaker.slice(0, 1)}</div>
            <span>
              <b>{node.speaker}</b>
              <small>{simplifyPlayerText(speakerProfile.role)} · {simplifyPlayerText(speakerProfile.stance)}</small>
            </span>
          </div>
          <div className="scene-story">
            <p className="scene-narration"><span className="story-label">상황</span>{simplifyPlayerText(speakerProfile.appearance)} {simplifyPlayerText(speakerProfile.gesture)}</p>
            <p className="scene-thought"><span className="story-label">속마음</span>'{simplifyPlayerText(speakerProfile.thought)}'</p>
            <p className="scene-narration scene-direction"><span className="story-label">지금의 압박</span>{simplifyPlayerText(sceneDirection)}</p>
            <p className="scene-body"><span className="story-label">사건 보고</span>{node.text}</p>
            {latestFreeTextSuccess && latestFreeTextSuccess.nodeId !== resolvedNodeId && (
              <p className="scene-continuity-quote">
                <span className="story-label">이어진 기록</span>
                이전 문장이 다음 장면의 기준으로 남아 있다: “{latestFreeTextSuccess.freeText}”
              </p>
            )}
            <p className="scene-dialogue"><span className="story-label">중요한 말</span>"{simplifyPlayerText(speakerProfile.line)}" <span className="story-voice">({simplifyPlayerText(speakerProfile.voice)})</span></p>
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

        <MemoPanel
          memo={node.memo}
          onOpen={(event) => event.currentTarget.open && setMemoOpened(true)}
          simplify={simplifyPlayerText}
        />

        <details className="echo-panel insight-drawer">
          <summary>
            <span>에코의 검증 질문</span>
            <b>반론 열기</b>
          </summary>
          <p>{simplifyPlayerText(echo)}</p>
          <div className="echo-probe">
            <div>
              <strong>{probeUsed ? "힌트 사용 완료" : "막혔다면 에코에게 한 번 더 묻기"}</strong>
              <span>{probeUsed ? "이번 장면의 방향성 힌트가 대화에 남았습니다." : `${echoProbeCost}을 지불하고 방향성만 확인합니다.`}</span>
            </div>
            <button type="button" onClick={requestEchoProbe} disabled={probeUsed || isAdvancing}>
              {probeUsed ? "확인됨" : "힌트 요청"}
            </button>
          </div>
          <details className="echo-checks">
            <summary>다시 확인할 것</summary>
            <ul>
              {getEchoChecks(node).map((item) => (
                <li key={item}>{simplifyPlayerText(item)}</li>
              ))}
            </ul>
          </details>
        </details>

        <section className="choice-panel" id="choice-panel" tabIndex={-1}>
          <DecisionRail pendingChoice={pendingChoice} />
          <div className="choice-heading">
            <h2>어떻게 말할까</h2>
            <p>
              어떤 선택도 무료가 아닙니다. 지금 고르는 말은 한 자원을 올리는 대신 다른
              부담을 다음 장면으로 넘깁니다.
            </p>
            <div className="turn-tactic">
              <span>이번 턴 공략</span>
              <strong>{simplifyPlayerText(sceneChallenge.title)}</strong>
              <p>
                {showTacticalDetails
                  ? "챌린지 달성 가능성, 위험 압력 변화, 사고 가속 보상을 계산한 전술 정보입니다."
                  : "먼저 장면과 대화만 보고 판단해 보세요. 필요한 경우 전술 정보를 열 수 있습니다."}
              </p>
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
          {showTacticalDetails && decisionForecasts.length > 0 && (
            <section className="decision-forecast" aria-label="결정 예보">
              <div className="forecast-header">
                <span>판단 렌즈</span>
                <strong>현재 압박 {riskPressure}</strong>
                <p>
                  {pressureLeader
                    ? `${pressureLeader.label}이 지금 판단을 가장 세게 흔듭니다. 렌즈는 정답이 아니라 관점입니다.`
                    : "현재 압박 요인은 낮습니다. 렌즈는 선택의 대가를 비교하기 위한 관점입니다."}
                </p>
              </div>
              <div className="forecast-grid">
                <button
                  type="button"
                  className="forecast-highlight"
                  onClick={() => previewChoice(pressureLensForecast.choice)}
                  aria-pressed={pendingChoice?.id === pressureLensForecast.choice.id}
                  aria-label="압박을 낮추는 관점 미리보기"
                >
                  <span>압박을 낮추는 관점</span>
                  <b>{pressureLensForecast.choice.label}</b>
                    <small>{describeForecast(pressureLensForecast.forecast)}</small>
                </button>
                <button
                  type="button"
                  className="forecast-highlight"
                  onClick={() => previewChoice(tradeoffLensForecast.choice)}
                  aria-pressed={pendingChoice?.id === tradeoffLensForecast.choice.id}
                  aria-label="대가를 크게 쓰는 관점 미리보기"
                >
                  <span>대가를 크게 쓰는 관점</span>
                  <b>{tradeoffLensForecast.choice.label}</b>
                  <small>{describeForecast(tradeoffLensForecast.forecast)}</small>
                </button>
                <article>
                  <span>압박 원인</span>
                  <b>{riskPressureDrivers.slice(0, 2).map((driver) => driver.label).join(" / ")}</b>
                  <small>
                    {riskPressureDrivers
                      .slice(0, 2)
                      .map((driver) => `${driver.value}`)
                      .join(" · ")}
                  </small>
                </article>
              </div>
              <ol className="forecast-list">
                {decisionForecasts.map(({ choice, forecast, tacticalRead }) => (
                  <li key={choice.id}>
                    <button
                      type="button"
                      className="forecast-choice"
                      onClick={() => previewChoice(choice)}
                      aria-pressed={pendingChoice?.id === choice.id}
                      aria-label={`${choice.label} 미리보기`}
                    >
                      <b className="forecast-uncertainty">{evidenceCount >= 3 ? "확인" : "미확인"}</b>
                      <span>
                        <strong>{choice.label}</strong>
                        <small>{describeForecast(forecast)}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {pendingChoice && pendingChoiceRead && pendingChoiceForecast && (
            <section
              ref={commitConsoleRef}
              className={`commit-console ${suspenseState.tier.toLowerCase()}`}
              aria-label="선택 확정 콘솔"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="commit-console-heading">
                <span>선택 확인</span>
                <strong>이 말을 실제로 남기겠습니까?</strong>
              </div>
              <p className="commit-console-choice">“{simplifyPlayerText(speechifyChoice(pendingChoice))}”</p>
              <div className="commit-console-readout">
                <span>예상 위험 <b>{formatRiskDelta(pendingChoiceForecast.riskDelta)}</b></span>
                <span>압력 <b>{pendingChoiceForecast.afterRisk}</b></span>
              </div>
              <div className={`commit-console-effects${evidenceCount < 3 ? " is-hidden" : ""}`} aria-label="예상 자원 변화">
                <span>예상 자원</span>
                {evidenceCount >= 3 && Object.entries(pendingChoiceRead.finalEffect)
                  .filter(([, value]) => value !== 0)
                  .map(([key, value]) => (
                    <b key={key} className={value > 0 ? "positive" : "negative"}>
                      {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}{value}
                    </b>
                  ))}
              </div>
              <div className="commit-console-actions">
                <button type="button" className="commit-cancel" onClick={() => setPendingChoice(null)}>
                  다시 고르기
                </button>
                <button ref={commitConfirmRef} type="button" data-testid="commit-confirm" className="commit-confirm" onClick={() => choose(pendingChoice)}>
                  <LockKeyhole size={16} />
                  이 선택을 기록한다
                </button>
              </div>
            </section>
          )}
          <div className="choices">
            {fixedChoices.map((choice, choiceIndex) => {
              const choiceRead = getEffectiveChoiceRead(choice, choice.effect, choice.cognition);
              const projectedRisk = getRiskPressure(choiceRead.finalResources);
              const riskDelta = choiceRead.finalRiskDelta;
              const riskClass =
                riskDelta > 0 ? "risk-up" : riskDelta < 0 ? "risk-down" : "risk-flat";
              const riskLabel =
                riskDelta > 0
                  ? `위험 +${riskDelta}`
                  : riskDelta < 0
                    ? `위험 ${riskDelta}`
                    : "위험 유지";
              const challengeMatch = getChallengeMatch(choice, choiceRead.baseRiskDelta);
              const tacticalRead = choiceRead.tacticalRead;
              return (
                <button
                  type="button"
                  key={choice.id}
                  ref={(button) => {
                    if (button) choiceButtonsRef.current.set(choice.id, button);
                    else choiceButtonsRef.current.delete(choice.id);
                  }}
                  className={pendingChoice?.id === choice.id ? "choice selected" : "choice"}
                  data-adaptive={choice.adaptive ? "true" : undefined}
                  onClick={() => handleChoiceClick(choice)}
                  onPointerDown={() => beginChoiceHold(choice)}
                  onPointerUp={endChoiceHold}
                  onPointerCancel={endChoiceHold}
                  onPointerLeave={endChoiceHold}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && pendingChoice?.id === choice.id) {
                      event.preventDefault();
                      choose(choice);
                    }
                  }}
                  disabled={isAdvancing}
                  aria-pressed={pendingChoice?.id === choice.id}
                  aria-keyshortcuts={`${choiceIndex + 1} Enter Space`}
                  title={`${choiceIndex + 1}번 키로 선택 미리보기`}
                  aria-label={`${simplifyPlayerText(speechifyChoice(choice))} ${riskLabel}. ${simplifyPlayerText(getChoiceSubtext(choice))}`}
                >
                  <span className="choice-main">
                    <Check size={16} />
                    <small><b className="choice-index">{String(choiceIndex + 1).padStart(2, "0")}</b> {pendingChoice?.id === choice.id ? "검토 중" : "선택"}</small>
                  </span>
                  <span className="choice-speech">"{speechifyChoice(choice)}"</span>
                  <span className="choice-action">{getDramaticChoiceLabel(choice)}</span>
                  {!showTacticalDetails && <span className="choice-effect choice-effect-compact">{getChoiceSubtext(choice)}</span>}
                  {challengeMatch && <span className="challenge-match">{simplifyPlayerText(challengeMatch)}</span>}
                  {showTacticalDetails && (
                    <>
                      <span className="choice-tactical">
                        <span>
                          <strong>{simplifyPlayerText(tacticalRead.gradeText)}</strong>
                          <small>{simplifyPlayerText(tacticalRead.reward)} · 얻는 것 {simplifyPlayerText(tacticalRead.gain)} · 드는 것 {simplifyPlayerText(tacticalRead.cost)}</small>
                        </span>
                      </span>
                      {choiceRead.flowSurge && (
                        <span className="choice-surge">
                          {simplifyPlayerText(choiceRead.flowSurge.label)} · {simplifyPlayerText(explainResourceTradeoff(choiceRead.flowSurge.effect))}
                        </span>
                      )}
                      <span className="choice-subtext">{simplifyPlayerText(getChoiceSubtext(choice))}</span>
                      {choice.effect && (
                        <span className="choice-tradeoff">
                          {simplifyPlayerText(explainResourceTradeoff(choice.effect))}
                        </span>
                      )}
                      {choice.effect && (
                        <span className={`choice-risk ${riskClass}`}>
                          {riskLabel} · 예상 압력 {projectedRisk}
                        </span>
                      )}
                      {choice.effect && (
                        <span
                          className={`choice-impact ${riskClass}`}
                          role="meter"
                          aria-label="예상 압력"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow={projectedRisk}
                          aria-valuetext={`${projectedRisk}`}
                        >
                          <span className="choice-impact-track" aria-hidden="true">
                            <span style={{ width: `${Math.min(100, Math.max(4, projectedRisk))}%` }} />
                          </span>
                          <b>압력 {projectedRisk}/100</b>
                        </span>
                      )}
                      {choice.effect && (
                        <span className="choice-effect">
                          {Object.entries(choiceRead.finalEffect)
                            .map(([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`)
                            .join(" · ")}
                        </span>
                      )}
                      {choice.cognition && (
                        <span className="choice-cognition">
                          {Object.entries(choice.cognition)
                            .map(([key, value]) => `${easyCognitionLabels[key] ?? cognitionLabels[key] ?? key} +${value}`)
                            .join(" · ")}
                        </span>
                      )}
                    </>
                  )}
                  {!showTacticalDetails && (
                    <span className="choice-intuition-hint">
                      바로 선택 · 장면 목표를 맞히면 직감 보너스
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {freeChoice && (
            <div className="reframe-box">
              <div className="panel-title-row">
                <h2>
                  <Sparkles size={17} />
                  구조 재설계
                </h2>
                <span>기존 선택지 대신 이해관계자, 조건, 순서를 새로 짠다</span>
              </div>
              <div className="prompt-chips">
                {boardChangePrompts.map((prompt) => (
                  <button type="button" key={prompt} onClick={() => updateFreeText(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
              <textarea
                value={freeText}
                onChange={(event) => updateFreeText(event.target.value)}
                maxLength={FREE_TEXT_MAX_LENGTH}
                placeholder="예: 누구를 새로 협상장에 부를지, 어떤 조건을 교환할지, 어떤 정보를 먼저 확인할지 적는다."
                aria-label="구조 재설계 자유입력"
                aria-describedby={
                  freeTextBlockedByPrivacy
                    ? "reframe-input-note reframe-privacy-warning"
                    : "reframe-input-note"
                }
              />
              <p className="input-note" id="reframe-input-note">
                자유입력은 로그에 남을 수 있습니다. 실제 개인정보나 식별 가능한 회사명은 쓰지 마세요.{" "}
                {freeText.length}/{FREE_TEXT_MAX_LENGTH}
              </p>
              {activePrivacySignals.length > 0 && (
                <div className="privacy-warning" id="reframe-privacy-warning" role="alert">
                  <strong>식별 정보로 보일 수 있는 표현이 있습니다.</strong>
                  <p>
                    감지 항목: {activePrivacySignals.map((signal) => signal.label).join(" / ")}.
                    제출하려면 실제 이름, 연락처, 회사명을 가상의 역할명이나 익명 표현으로 바꿔주세요.
                  </p>
                  <button type="button" onClick={anonymizeFreeText}>
                    감지 표현 익명화
                  </button>
                </div>
              )}
              {freeText.trim() && (
                <div className="reframe-speech">
                  <span>발화 예고</span>
                  <p>"{freeText.trim()}"</p>
                  <small>
                    준비된 선택지 밖으로 나가면, 이 문장이 그대로 장면 로그와 에코의 반론에 남습니다.
                  </small>
                </div>
              )}
              <div className="reframe-signals">
                <div>
                  <span>반영 기준</span>
                  <b>{activeFreeTextSignalCount}/4</b>
                </div>
                {sceneChallenge.id === "use-reframe" && activeFreeTextSignalCount >= 2 && (
                  <strong className="reframe-challenge-hit">챌린지 달성 가능</strong>
                )}
                <ul>
                  {freeTextSignals.map((signal) => (
                    <li className={signal.active ? "active" : ""} key={signal.id}>
                      <Check size={14} />
                      <span>
                        <b>{signal.label}</b>
                        <small>{signal.hint}</small>
                      </span>
                    </li>
                  ))}
                </ul>
                <p>
                  두 개 이상 채워지면 선택지 밖의 제안이 단순 의견이 아니라 판을 바꾸는
                  계획으로 기록됩니다.
                </p>
              </div>
              {freeTextPreview && (
                <div className="reframe-preview">
                  <span>예상 반영</span>
                  <p>{explainResourceTradeoff(freeTextPreview.effect)}</p>
                  {(() => {
                    const projectedRisk = getRiskPressure(applyEffect(resources, freeTextPreview.effect));
                    const riskDelta = projectedRisk - riskPressure;
                    const riskClass =
                      riskDelta > 0 ? "risk-up" : riskDelta < 0 ? "risk-down" : "risk-flat";
                    const riskLabel =
                      riskDelta > 0
                        ? `위험 +${riskDelta}`
                        : riskDelta < 0
                          ? `위험 ${riskDelta}`
                          : "위험 유지";
                    return (
                      <div>
                        <small className={`preview-risk ${riskClass}`}>
                          {riskLabel} · 예상 압력 {projectedRisk}
                        </small>
                      </div>
                    );
                  })()}
                  <div>
                    {Object.entries(freeTextPreview.effect).map(([key, value]) => (
                      <small key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                        {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}
                        {value}
                      </small>
                    ))}
                  </div>
                  <div>
                    {Object.entries(freeTextPreview.cognition)
                      .filter(([, value]) => value > 0)
                      .map(([key, value]) => (
                        <small key={key} className="cognition-preview">
                          {easyCognitionLabels[key] ?? cognitionLabels[key] ?? key} +{value}
                        </small>
                      ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                className="choice free-choice submit-reframe"
                onClick={() => choose(freeChoice)}
                disabled={!freeText.trim() || freeTextBlockedByPrivacy || isAdvancing}
                aria-label={
                  freeTextBlockedByPrivacy
                    ? "식별 정보로 보일 수 있는 표현을 익명화해야 구조 재설계를 제출할 수 있습니다."
                    : freeText.trim()
                      ? `구조 재설계 제출. ${freeText.trim()}`
                      : "구조 재설계 내용을 입력해야 제출할 수 있습니다."
                }
              >
                <span className="choice-main">
                  <Send size={16} />
                  {freeChoice.label}
                </span>
              </button>
            </div>
          )}
        </section>
        {pendingChoiceRead && (
          <DecisionDock
            pendingChoice={pendingChoice}
            pendingChoiceForecast={pendingChoiceForecast}
            suspenseTier={suspenseState.tier}
            onCancel={() => setPendingChoice(null)}
            onConfirm={() => choose(pendingChoice)}
            isAdvancing={isAdvancing}
            simplify={simplifyPlayerText}
            speechify={speechifyChoice}
            formatRiskDelta={formatRiskDelta}
          />
        )}
      </section>
      <StatusBoard
        playerName={playerName}
        activePlayStyle={activePlayStyle}
        turnBriefItems={turnBriefItems}
        sceneChallenge={sceneChallenge}
        resourceMeta={resourceMeta}
        resources={resources}
        node={node}
        speakerProfile={speakerProfile}
        triggerLabels={triggerLabels}
        progress={progress}
        log={log}
        completedCases={completedCases}
        activeCaseMeta={activeCaseMeta}
      />
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
          <button type="button" className="ghost" onClick={copyReplayLink}>Copy replay link</button>
          <button type="button" className="ghost" onClick={copyDiagnosticTrace}>Copy trace</button>
        </aside>
      )}
    </main>
);
}
