import { Check, Info, LockKeyhole, MessageSquareText, Send, Sparkles } from "lucide-react";
import { DecisionRail } from "../components/DecisionRail.jsx";
import { DecisionDock } from "../components/DecisionDock.jsx";
import { MemoPanel } from "../components/MemoPanel.jsx";
import { StatusBoard } from "../components/StatusBoard.jsx";
import { GameMetricsDrawer } from "../components/GameMetricsDrawer.jsx";
import { GameHeader } from "../components/GameHeader.jsx";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { CASE_SEQUENCE } from "../gameData.js";
import { getAuthorityGate } from "../gameLogic.js";

export function PlayScreen({ view }) {
  const { suspenseState, AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, simplifyPlayerText, caseObjectives, currentCase, node, triggerLabels, openingLegacy, pressureCascade, riskPressure, playGuideItems, sceneTitleRef, saveCurrentGame, reset, renderSaveStatus, progress, easyRiskLabels, riskTier, activeBonus, freeTextCombo, currentAverageResponseTime, log, clueCount, clueHypotheses = [], discoveredClues, currentChallengeStreak, momentumTier, streakGoal, streakRemaining, momentumScore, decisionSeconds, protocolUsed, isAdvancing, activateCrisisProtocol, decisionFingerprint, decisionLedger, resourceMeta, sceneChallenge, triggerLabSignals, narrativeSpine, questSteps, sceneVisuals, speakerProfile, speakerPortrait, latestFreeTextSuccess, resolvedNodeId, sceneDirection, latestBeat, renderSceneLines, setMemoOpened, echo, probeUsed, echoProbeCost, requestEchoProbe, getEchoChecks, pendingChoice, showTacticalDetails, setShowTacticalDetails, decisionForecasts, pressureLeader, previewChoice, evidenceCount, pendingChoiceRead, pendingChoiceForecast, commitConsoleRef, formatRiskDelta, formatForecastRisk, setPendingChoice, commitConfirmRef, choose, fixedChoices, getEffectiveChoiceRead, getRiskPressure, getChallengeMatch, choiceButtonsRef, handleChoiceClick, beginChoiceHold, endChoiceHold, speechifyChoice, getChoiceSubtext, getDramaticChoiceLabel, explainResourceTradeoff, easyCognitionLabels, cognitionLabels, freeChoice, boardChangePrompts, updateFreeText, freeText, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals, anonymizeFreeText, activeFreeTextSignalCount, freeTextSignals, freeTextPreview, applyEffect, resources, playerName, activePlayStyle, turnBriefItems, completedCases, activeCaseMeta, debugToolsEnabled, fallbackCaseId, routeIndex, routeLength, silentFailureCount, copyReplayLink, copyDiagnosticTrace } = view;
  const formatEffectChip = ([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "상승" : "소모"}`;
  const operatorBrief = view.operatorBriefs?.[currentCase];
  const chapterRule = view.chapterRules?.[currentCase];
  const relationshipScores = view.relationshipScores ?? [];
  const authorityState = view.authorityState ?? { level: "OBSERVER", permissions: [], locked: "권한 정보 없음" };
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
  const describeChoiceDilemma = (choice) => {
    const entries = Object.entries(choice.effect ?? {}).filter(([, value]) => value !== 0);
    const gains = entries.filter(([, value]) => value > 0).map(([key]) => resourceMeta[key]?.label ?? key);
    const costs = entries.filter(([, value]) => value < 0).map(([key]) => resourceMeta[key]?.label ?? key);
    if (gains.length > 0 && costs.length > 0) return `${gains[0]}을 얻는 대신 ${costs[0]}을 닫습니다.`;
    if (gains.length > 0) return `${gains[0]}은 열리지만, 관찰자는 그 이유를 기록합니다.`;
    if (costs.length > 0) return `${costs[0]}을 먼저 소모해 다음 장면의 문을 엽니다.`;
    return "숫자는 조용하지만, 이 말은 판단 순서를 남깁니다.";
  };
  const getAuthorityImpact = (choice) => {
    const choiceText = `${choice.id} ${choice.label}`;
    if (/protect|people|witness|person|사람|보호|증언/.test(choiceText)) return "권한 영향: 보호 절차를 열고 현장의 발언권을 넓힙니다.";
    if (/expose|public|report|disclosure|공개|폭로|보고/.test(choiceText)) return "권한 영향: 기록의 공개 범위를 넓히지만 조직의 반발을 부릅니다.";
    if (/isolate|stop|seal|destroy|차단|중단|폐기|잠금/.test(choiceText)) return "권한 영향: 접근을 줄여 피해를 막지만, 확인되지 않은 목소리도 닫힙니다.";
    if (/system|redesign|reform|구조|개편|재설계/.test(choiceText)) return "권한 영향: 당장의 결론보다 다음 운영 기준에 개입합니다.";
    return "권한 영향: 이 선택의 흔적이 다음 챕터의 조사 기준으로 남습니다.";
  };
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
            <b>목표·압박·위험·자원·기록·장면 목표 한 번에 보기</b>
          </summary>
        {view.chapterUiModel && (
          <section className="chapter-dashboard" style={{ "--chapter-accent": view.chapterUiModel.accent }} aria-label="챕터 전용 운영판">
            <div><span>{view.chapterUiModel.label}</span><strong>{view.chapterUiModel.title}</strong></div>
            <div className="chapter-dashboard-metrics">
              {view.chapterUiModel.metrics.map((metric) => <b key={metric}>{metric}</b>)}
            </div>
            {view.relationshipQuest && (
              <p><strong>{view.relationshipQuest.title}</strong> · {view.relationshipQuest.goal} · {view.relationshipQuest.unlocked ? "QUEST CLEAR" : `PROGRESS ${view.relationshipQuest.progress}%`}</p>
            )}
          </section>
        )}
        {view.delayedConsequences?.length > 0 && (
          <section className="delayed-consequence-strip" aria-label="지연된 결과">
            <span>DELAYED CONSEQUENCE</span>
            <p>{view.delayedConsequences.at(-1).text}</p>
          </section>
        )}
        {view.interlude && openingLegacy && (
          <section className="interlude-panel" aria-label="챕터 전환 장면">
            <span>{view.interlude.label}</span>
            <strong>{view.interlude.title}</strong>
            <p>{view.interlude.text}</p>
          </section>
        )}
        {view.relationshipScene && (
          <section className="relationship-scene-panel" aria-label="관계 전용 장면">
            <span>{view.relationshipScene.title}</span>
            <p>{view.relationshipScene.text}</p>
            <strong>{view.relationshipScene.action}</strong>
          </section>
        )}
        {view.pastRunMemory && (
          <section className="past-run-memory" aria-label="이전 플레이 기록">
            <span>{view.pastRunMemory.label}</span>
            <p>{view.pastRunMemory.text}</p>
          </section>
        )}
        {view.chapterTransitionBridge && <section className="chapter-transition-bridge" aria-label="챕터 이동 기록"><span>{view.chapterTransitionBridge.label}</span><strong>{view.chapterTransitionBridge.title}</strong><p>{view.chapterTransitionBridge.text}</p></section>}
        {view.operatorReveal && <section className="operator-reveal-panel" aria-label="주인공 기록 공개"><span>{view.operatorReveal.title}</span><p>{view.operatorReveal.text}</p></section>}
        {view.relationshipGraph?.length > 0 && (
          <section className="relationship-graph-panel" aria-label="인물 관계 그래프">
            <span>RELATION MAP</span>
            <div>{view.relationshipGraph.filter((item) => item.value > 0).map((item) => <article key={item.name}><b>{item.name}</b><i><em style={{ width: `${item.value}%` }} /></i><small>{item.state}</small></article>)}</div>
          </section>
        )}
        {view.autonomousSignal && (
          <section className="autonomous-signal-panel" aria-label="인물 자율 행동">
            <span>WORLD MOVEMENT · {view.timelineStamp}</span>
            <p>{view.autonomousSignal.text}</p>
          </section>
        )}
        {view.evidenceMetadata?.length > 0 && (
          <section className="evidence-source-panel" aria-label="단서 출처와 신뢰도">
            <span>EVIDENCE SOURCES</span>
            <div>{view.evidenceMetadata.slice(-4).map((item) => <article key={item.id}><b>{item.title}</b><small>{item.sourceType} · {item.reliability}%</small></article>)}</div>
          </section>
        )}
        {view.hypothesisConflict && <p className="hypothesis-conflict" role="alert"><strong>{view.hypothesisConflict.title}</strong> {view.hypothesisConflict.text}</p>}
        {view.resourceChain && <p className={`resource-chain-signal ${view.resourceChain.tone}`} role="status"><strong>RESOURCE CHAIN</strong> {view.resourceChain.text}</p>}
        {view.characterMemory && <p className="character-memory" role="status"><strong>MEMORY TRACE</strong> {view.characterMemory.text}</p>}
        {view.characterState && <p className="character-state-signal" role="status"><strong>CHARACTER STATE</strong> {view.characterState.speaker}: {view.characterState.stance} / TRUST {view.characterState.trust} / PRESSURE {view.characterState.pressure}</p>}
        {view.rivalResponse && <p className="rival-response-signal" role="status">{view.rivalResponse.response}</p>}
        {view.midBoss && <section className="mid-boss-panel" aria-label="챕터 반박 장면"><span>{view.midBoss.title}</span><p>{view.midBoss.text}</p></section>}
        {view.investigationTargets?.length > 0 && (
          <section className="investigation-panel" aria-label="조사 대상 선택">
            <span>ACTIVE INVESTIGATION</span>
            <div>{view.investigationTargets.map((target) => <GuardedButton type="button" key={target.id} blocked={target.locked} className={view.selectedInvestigationOutcome?.id === target.id ? "selected" : ""} onClick={() => view.investigateTarget(target)}><b>{target.label}</b><small>{target.locked ? "권한 잠김" : "조사 시작"}</small></GuardedButton>)}</div>
            {view.selectedInvestigationOutcome && <p>{view.selectedInvestigationOutcome.outcome}{view.selectedInvestigationOutcome.contaminated ? " 단, 이 기록에는 오염 가능성이 있습니다." : ""}</p>}
          </section>
        )}
        {view.evidenceRepairPuzzle && <section className={`evidence-repair-panel ${view.evidenceRepairPuzzle.repaired ? "repaired" : ""}`} aria-label="증거 원본 복구"><span>{view.evidenceRepairPuzzle.title}</span><p>{view.evidenceRepairPuzzle.prompt}</p><small>{view.evidenceRepairPuzzle.source.join(" / ")}</small>{!view.evidenceRepairPuzzle.repaired && <button type="button" onClick={view.repairEvidence}>원본 복구</button>}</section>}
        {view.rivalIntervention?.active && <section className="rival-intervention-panel" aria-label="라이벌 개입"><span>{view.rivalIntervention.title}</span><p>{view.rivalIntervention.text}</p><div>{view.rivalIntervention.options.map((option) => <button type="button" key={option.id} onClick={() => view.counterRival(option)}>{option.label}</button>)}</div></section>}
        {view.evidenceContamination && <p className="evidence-contamination" role="alert"><strong>EVIDENCE CONTAMINATION</strong> {view.evidenceContamination.text}</p>}
        {view.evidenceCombinations?.length > 0 && (
          <section className="evidence-combination-panel" aria-label="조합된 증거">
            <span>CROSS-REFERENCE</span>
            {view.evidenceCombinations.map((item) => <article key={item.id}><strong>{item.title}</strong><p>{item.text}</p></article>)}
          </section>
        )}
        {view.hypothesisActions?.length > 0 && (
          <section className="hypothesis-actions-panel" aria-label="가설 처리">
            <span>HYPOTHESIS CONTROL</span>
            <div>{view.hypothesisActions.map((action) => <button type="button" key={action.id} onClick={() => view.resolveHypothesisAction(action)}><b>{action.label}</b><small>{action.text}</small></button>)}</div>
          </section>
        )}
        {view.hypothesisLockState && <p className="hypothesis-lock-signal" role="status"><strong>{view.hypothesisLockState.label}</strong> {view.hypothesisLockState.text}</p>}
        {view.balanceSignals?.length > 0 && (
          <p className="balance-signal" role="status">{view.balanceSignals[0].signal}: {view.balanceSignals[0].share}%의 기록이 같은 선택에 집중되어 있습니다. 다른 경로를 확인해 보세요.</p>
        )}
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
              <span>{openingLegacy.label}</span>
              <strong>{openingLegacy.title}</strong>
            </div>
            <p>{openingLegacy.text}</p>
            {openingLegacy.continuity && (
              <div className="continuity-bridge">
                <span>직전 사건의 결과</span>
                <strong>{openingLegacy.continuity.title}</strong>
                <p>{openingLegacy.continuity.text}</p>
              </div>
            )}
            <div className="legacy-effect">
              {Object.entries(openingLegacy.effect).map(([key, value]) => (
                <small key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                  {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}{value}
                </small>
              ))}
            </div>
            {clueHypotheses.length > 0 && (
              <div className="hypothesis-board" aria-label="가설 보드">
                <div><span>WORKING HYPOTHESES</span><b>{clueHypotheses.length}개 가설 조합</b></div>
                {clueHypotheses.map((hypothesis) => (
                  <article key={hypothesis.id}>
                    <strong>{hypothesis.title}</strong>
                    <p>{hypothesis.text}</p>
                    <small>CONFIDENCE {hypothesis.confidence}%</small>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
        {operatorBrief && (
          <section className="operator-bridge" aria-label="분석관의 위치와 권한">
            <div className="operator-bridge-heading">
              <span>OPERATOR BRIEF</span>
              <strong>당신은 트리거랩의 전환 분석관입니다</strong>
            </div>
            <div className="operator-bridge-grid">
              <div>
                <span>현재 역할</span>
                <b>사건을 해결하는 외부 영웅이 아니라, 판단 기준을 설계하는 내부 분석관</b>
              </div>
              <div>
                <span>현재 권한</span>
                <b>기록 열람 · 관계자 질문 · 임시 운영 기준 제안</b>
              </div>
              <div>
                <span>권한의 경계</span>
                <b>현장 집행과 최종 승인 권한은 각 조직의 책임자에게 남아 있습니다</b>
              </div>
              <div className="operator-bridge-movement">
                <span>이번 이동</span>
                <b>{operatorBrief.movement}</b>
                <p>{operatorBrief.reason}</p>
              </div>
            </div>
          </section>
        )}
        {view.operatorProfile && (
          <section className="operator-identity-strip" aria-label="주인공 정체성과 현재 권한">
            <div>
              <span>{view.operatorProfile.label}</span>
              <strong>{view.operatorProfile.title}</strong>
            </div>
            <p>{view.operatorProfile.authority}</p>
            <div className="authority-permission-list">
              <b>{authorityState.level}</b>
              {(authorityState.permissions ?? []).map((permission) => <span key={permission}>{permission}</span>)}
            </div>
            <small className="authority-origin-permission">출신 권한: {(authorityState.origin?.originPermissions ?? []).join(" · ")}</small>
          </section>
        )}
        {view.latestChoiceFeedback && (
          <p className={`choice-outcome-feedback ${view.latestChoiceFeedback.tone}`} role="status">
            <strong>{view.latestChoiceFeedback.label}</strong> {view.latestChoiceFeedback.text}
          </p>
        )}
        <section className={`pressure-cascade ${pressureCascade.tone}`}>
          <div className="pressure-cascade-mark">
            <span>{pressureCascade.label}</span>
            <strong>{riskPressure}</strong>
          </div>
          <div>
            <h2>{pressureCascade.title}</h2>
            <p>{pressureCascade.text}</p>
          </div>
          <small>{pressureCascade.cue}</small>
        </section>
        <section className={`suspense-console ${suspenseState.tier.toLowerCase()}`} aria-label="서스펜스 신호">
          <div className="suspense-console-mark">
            <span>{suspenseState.label}</span>
            <strong>{String(suspenseState.score).padStart(2, "0")}</strong>
          </div>
          <div className="suspense-console-copy">
            <h2>{suspenseState.title}</h2>
            <p>{suspenseState.text}</p>
          </div>
          <div className="suspense-meter" aria-label={`서스펜스 ${suspenseState.score}퍼센트`}>
            <div style={{ width: `${suspenseState.score}%` }} />
            <small>{suspenseState.cue} · 사건 {suspenseState.caseCode}</small>
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
        <MemoPanel
          memo={node.memo}
          onOpen={(event) => event.currentTarget.open && setMemoOpened(true)}
        />

        <details className="echo-panel insight-drawer">
          <summary>
            <span>에코의 검증 질문</span>
            <b>반론 열기</b>
          </summary>
          <p>{echo}</p>
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
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        </details>
        </details>
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
          decisionSeconds={decisionSeconds}
        />
        {renderSaveStatus()}

        {operatorBrief && (
          <section className="chapter-console" aria-label="현재 챕터 작전 브리프">
            <div className="chapter-console-topline">
              <span>OPERATOR BRIEF / LIVE AUTHORITY</span>
              <b>당신의 결정은 현장을 바꾸지만, 모든 권한을 갖지는 않습니다</b>
            </div>
            <div className="chapter-console-main">
              <div className="operator-identity">
                <span>WHO YOU ARE</span>
                <strong>트리거랩 전환 분석관</strong>
                <p>기업과 조직의 위기를 관찰하고, 다음 운영 기준을 설계하는 사람</p>
              </div>
              <div className="operator-authority">
                <span>YOUR AUTHORITY</span>
                <div><b>열람</b><b>질문</b><b>기준 제안</b></div>
                <p>기록을 열고, 관계자에게 묻고, 임시 기준을 제안할 수 있습니다.</p>
              </div>
              <div className="operator-limit">
                <span>THE LIMIT</span>
                <strong>집행권은 현장에 남아 있습니다</strong>
                <p>최종 승인과 실제 집행은 해당 조직의 책임자가 수행합니다. 그래서 당신의 선택은 명령이 아니라 압박과 기준으로 작동합니다.</p>
              </div>
              {chapterRule && (
                <div className="chapter-rule">
                  <span>CHAPTER RULE / {chapterRule.label}</span>
                  <strong>{chapterRule.rule}</strong>
                  <p>이번 챕터의 개입 권한: {chapterRule.authority}</p>
                </div>
              )}
            </div>
            <div className="chapter-transfer">
              <div className="chapter-transfer-route">
                <span>CHAPTER {String(CASE_SEQUENCE.indexOf(currentCase) + 1).padStart(2, "0")} / {CASE_SEQUENCE.length}</span>
                <strong>{operatorBrief.movement}</strong>
              </div>
              <div className="chapter-transfer-reason">
                <span>WHY THIS MOVE</span>
                <p>{operatorBrief.reason}</p>
              </div>
            </div>
            <div className="authority-level" aria-label="현재 권한 단계">
              <div><span>AUTHORITY LEVEL</span><strong>{authorityState.level}</strong><small>{authorityState.locked}</small></div>
              <div className="authority-permission-list">{authorityState.permissions.map((permission) => <b key={permission}>{permission}</b>)}</div>
            </div>
            <div className="chapter-rail" aria-label="챕터 진행 경로">
              {CASE_SEQUENCE.map((caseId, index) => (
                <span key={caseId} className={caseId === currentCase ? "active" : completedCases.includes(caseId) ? "complete" : ""}>
                  <i>{String(index + 1).padStart(2, "0")}</i>{caseId === currentCase ? "현재" : completedCases.includes(caseId) ? "완료" : "대기"}
                </span>
              ))}
            </div>
            <div className="authority-action">
              <div>
                <span>ONE-TIME AUTHORITY</span>
                <b>위기 프로토콜을 발동해 운영 기준에 직접 개입</b>
                <small>시간 -4 · 자본 -2 · 정당성 +3 · 위험 압력이 높을 때만 사용 가능</small>
              </div>
              <GuardedButton
                type="button"
                onClick={activateCrisisProtocol}
                blocked={protocolUsed || riskPressure < 60 || isAdvancing}
              >
                {protocolUsed ? "권한 사용 완료" : riskPressure >= 60 ? "권한 행사" : "위험 압력 60 필요"}
              </GuardedButton>
            </div>
            <div className="relationship-strip" aria-label="등장인물 관계 온도">
              <span>RELATIONSHIP HEAT</span>
              <div>
                {relationshipScores.map((relationship) => (
                  <article key={relationship.name} className={relationship.active ? "active" : ""}>
                    <b>{relationship.name}</b>
                    <i><em style={{ width: `${relationship.value}%` }} /></i>
                    <small>{relationship.active ? "현재 대화 상대" : relationship.value > 0 ? "관찰 중" : "아직 연결 전"}</small>
                  </article>
                ))}
              </div>
            </div>
            <div className="mystery-board" aria-label="반전 단서 보드">
              <div><span>MYSTERY BOARD</span><b>{discoveredClues.length}개 단서 확보</b></div>
              {discoveredClues.length > 0 ? (
                <div className="mystery-clues">
                  {discoveredClues.slice(-3).map((clue) => (
                    <article key={clue.id}>
                      <strong>{clue.title ?? clue.id}</strong>
                      <p>{clue.text ?? clue.description ?? "기록의 빈틈이 다음 질문으로 남았습니다."}</p>
                    </article>
                  ))}
                </div>
              ) : <p className="mystery-empty">첫 번째 모순은 아직 모습을 드러내지 않았습니다. 압박을 낮추거나 오래 관찰하면 단서가 열립니다.</p>}
            </div>
          </section>
        )}

        <div className="scene">
          <div className="scene-visual" aria-hidden="true">
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
          </div>
          <div className="speaker">
            <img
              src={speakerPortrait ?? "/speaker-profile.webp"}
              alt=""
              width="52"
              height="52"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                if (event.currentTarget.dataset.fallback === "true") return;
                event.currentTarget.dataset.fallback = "true";
                event.currentTarget.src = "/speaker-profile.webp";
              }}
            />
            <span>
              <b>{node.speaker}</b>
              <small>{speakerProfile.role} · {speakerProfile.stance}</small>
            </span>
          </div>
          <div className="scene-story">
            <p className="scene-narration"><span className="story-label">장면의 표정</span>{speakerProfile.appearance} {speakerProfile.gesture}</p>
            <p className="scene-body scene-critical"><span className="story-label">이번 장면의 핵심 상황</span>{node.text}</p>
            <p className="scene-direction"><span className="story-label">왜 지금 결정해야 하나</span>{sceneDirection}</p>
            {latestFreeTextSuccess && latestFreeTextSuccess.nodeId !== resolvedNodeId && (
              <p className="scene-continuity-quote">
                <span className="story-label">이어진 기록</span>
                이전 문장이 다음 장면의 기준으로 남아 있다: “{latestFreeTextSuccess.freeText}”
              </p>
            )}
            <p className="scene-dialogue"><span className="story-label">상대가 던진 질문</span>"{speakerProfile.line}" <span className="story-voice">({speakerProfile.voice})</span></p>
            <details className="scene-secondary">
              <summary>장면의 여운과 단서 보기</summary>
              <p className="scene-thought"><span className="story-label">속마음</span>'{speakerProfile.thought}'</p>
              <p className="observer-whisper"><span className="story-label">관찰자 메모</span>{observerWhisper}</p>
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
              <strong>{sceneChallenge.title}</strong>
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
              <p className="commit-console-choice">“{speechifyChoice(pendingChoice)}”</p>
              <div className="commit-console-readout">
                <span>예상 위험 <b>{formatForecastRisk(pendingChoiceForecast)}</b></span>
                <span>압력 <b>{pendingChoiceForecast.afterRisk}</b></span>
              </div>
              {getObserverPreviewForChoice(pendingChoice.id) && (
                <div className="commit-observer-preview">
                  <span>{getObserverPreviewForChoice(pendingChoice.id).tag.label}</span>
                  <p>{getObserverPreviewForChoice(pendingChoice.id).text}</p>
                </div>
              )}
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
              const authorityGate = getAuthorityGate(choice, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy });
              const choiceRead = getEffectiveChoiceRead(choice, choice.effect, choice.cognition);
              const observerPreview = getObserverPreviewForChoice(choice.id);
              const riskDelta = choiceRead.finalRiskDelta;
              const riskLabel =
                riskDelta > 0
                  ? `위험 +${riskDelta}`
                  : riskDelta < 0
                    ? `위험 ${riskDelta}`
                    : "위험 유지";
              const challengeMatch = getChallengeMatch(choice, choiceRead.baseRiskDelta);
              const pressureHint =
                riskDelta > 0
                  ? "압박이 커질 수 있습니다."
                  : riskDelta < 0
                    ? "압박을 낮출 수 있습니다."
                    : "압박은 크게 움직이지 않습니다.";
              return (
                <GuardedButton
                  type="button"
                  key={choice.id}
                  ref={(button) => {
                    if (button) choiceButtonsRef.current.set(choice.id, button);
                    else choiceButtonsRef.current.delete(choice.id);
                  }}
                  className={`${pendingChoice?.id === choice.id ? "choice selected" : "choice"} ${authorityGate.unlocked ? "" : "locked-choice"}`.trim()}
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
                  blocked={!authorityGate.unlocked}
                  aria-pressed={pendingChoice?.id === choice.id}
                  aria-keyshortcuts={`${choiceIndex + 1} Enter Space`}
                  title={`${choiceIndex + 1}번 키로 선택 미리보기`}
                  aria-label={`${speechifyChoice(choice)} ${riskLabel}. ${getChoiceSubtext(choice)}`}
                >
                  <span className="choice-main">
                    <Check size={16} />
                    <small>{pendingChoice?.id === choice.id ? "검토 중" : "선택"}</small>
                  </span>
                  {choice.branchId && <span className="choice-branch-tag">ROUTE SPLIT</span>}
                  <span className="choice-speech">"{speechifyChoice(choice)}"</span>
                  <span className="choice-dilemma">{describeChoiceDilemma(choice)}</span>
                  {observerPreview && (
                    <span className={`choice-observer-preview ${observerPreview.repeatsCurrentPattern ? "is-repeat" : "is-break"}`}>
                      <b>{observerPreview.tag.label}</b>
                      <small>{observerPreview.repeatsCurrentPattern ? "패턴 고정" : "패턴 교란"}</small>
                    </span>
                  )}
                  <span className="choice-stakes">
                    {Object.entries(choice.effect ?? {})
                      .filter(([, value]) => value !== 0)
                      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                      .slice(0, 3)
                      .map((entry) => (
                        <b key={entry[0]} className={entry[1] > 0 ? "positive" : "negative"}>
                          {formatEffectChip(entry)}
                        </b>
                      ))}
                  </span>
                  <span className="choice-action">{getDramaticChoiceLabel(choice)}</span>
                  <span className="choice-authority-impact">{getAuthorityImpact(choice)}</span>
                  {!authorityGate.unlocked && <span className="choice-lock">LOCKED: {authorityGate.reason}</span>}
                  {!showTacticalDetails && <span className="choice-effect choice-effect-compact">{getChoiceSubtext(choice)}</span>}
                  {challengeMatch && <span className="challenge-match">{simplifyPlayerText(challengeMatch)}</span>}
                  {showTacticalDetails && (
                    <>
                      <span className="choice-tactical">
                        <span>
                          <strong>방향 힌트</strong>
                          <small>{pressureHint}</small>
                        </span>
                      </span>
                      {choiceRead.flowSurge && (
                        <span className="choice-surge">
                          {simplifyPlayerText(choiceRead.flowSurge.label)} · 추가 보정이 붙습니다. 정확한 폭은 선택 후 기록에서 확인합니다.
                        </span>
                      )}
                      <span className="choice-subtext">{getChoiceSubtext(choice)}</span>
                    </>
                  )}
                  {!showTacticalDetails && (
                    <span className="choice-intuition-hint">
                      바로 선택 · 장면 목표를 맞히면 직감 보너스
                    </span>
                  )}
                </GuardedButton>
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
              <GuardedButton
                type="button"
                className="choice free-choice submit-reframe"
                onClick={() => choose(freeChoice)}
                blocked={!freeText.trim() || freeTextBlockedByPrivacy || isAdvancing}
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
              </GuardedButton>
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
            speechify={speechifyChoice}
            formatForecastRisk={formatForecastRisk}
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
          <button type="button" className="ghost" data-testid="copy-replay-link" onClick={copyReplayLink}>Copy replay link</button>
          <button type="button" className="ghost" onClick={copyDiagnosticTrace}>Copy trace</button>
        </aside>
      )}
    </main>
);
}
