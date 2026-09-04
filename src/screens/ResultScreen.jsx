import { AlertTriangle, ChevronRight, Copy, Download, FileText, Link2, MessageSquareText, RefreshCcw, Sparkles, Trophy } from "lucide-react";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { EndingSequence } from "../components/EndingSequence.jsx";
import { isResourceGain } from "../gameConstants.js";

export function ResultScreen({ view }) {
  const {
    common: {
      AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel,
      screenReaderStatus, currentCase, GAME_TITLE, playerName, activeCaseMeta, sceneTitleRef, renderSceneLines,
    },
    ending: {
      endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, endingProfile, endingVariant,
      advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage,
      saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine,
      skipEndingQuietHold,
    },
    score: {
      decisionFingerprint, observationLedger, observerPattern, triggerLabels, triggers, result,
      caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp,
      easyCognitionLabels, cognitionLabels, formatRiskDelta, counterfactualReport, achievementBadges,
      routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount,
    },
    telemetry: {
      sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry,
      telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus,
    },
    feedback: {
      feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH,
      activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback,
      feedbackStatus,
    },
    actions: {
      startCase, setStarted, setShowRanking, showSeasonMap, exportPlaytestLog, copyReplayLink, reset,
      nextCaseSignal, resultBridge,
    },
    debug: {
      debugToolsEnabled, showErrorLog, setShowErrorLog,
    },
  } = view;
  const finalChoiceText = finalAftermathEntry?.choice || finalEndingEntry?.choice || "당신이 남긴 마지막 판단";
  const firstRouteEntry = routeTimeline[0];
  const longestRouteEntry = [...routeTimeline].sort((a, b) => (b.responseTimeSec ?? 0) - (a.responseTimeSec ?? 0))[0];
  const branchRouteEntry = [...routeTimeline].reverse().find((entry) => entry.freeTextSuccess || entry.freeTextBranchId);
  const dominantObservation = Object.entries(observationLedger).sort((a, b) => b[1] - a[1])[0] ?? ["compliance", 0];
  const observerEndingRecord = observerPattern?.endingRecord ?? {
    label: "패턴 표본",
    title: "다음 참가자의 첫 장면은 아직 확정되지 않았습니다.",
    text: "관찰 기록이 부족해 트리거랩은 가장 조용한 기준부터 복원합니다.",
  };
  const observationLabels = {
    compliance: "순응",
    defiance: "거부",
    opacity: "은폐",
    sacrifice: "희생",
  };
  const choiceVerdicts = {
    ending_seal: {
      title: "트리거랩의 개인 조건 데이터는 봉인됩니다.",
      ruling: "실험은 중단되고 외부 공개도 보류됩니다. 피해를 더 키우지는 않았지만, 기록을 열람할 권한은 소수의 감사자에게만 남습니다.",
      execution: "즉시 적용: 개인 프로필 접근 차단, 기존 실험 세션 격리, 다음 참가자 모집 정지.",
      cost: "남는 대가: 구조를 바꾸기보다 문을 닫았기 때문에, 같은 방식의 실험이 다른 이름으로 돌아올 여지가 남습니다.",
    },
    ending_reform: {
      title: "트리거랩은 폐쇄되지 않고 공적 감시 절차로 전환됩니다.",
      ruling: "당신의 조건은 약점 목록이 아니라 사용 규칙의 기준표가 됩니다. 실험은 계속되지만, 동의와 감사 없이는 누구도 사람의 반응을 설계에 쓸 수 없습니다.",
      execution: "즉시 적용: 동의 없는 프로필 사용 금지, 케이스 설계 변경 로그 공개, 피해자 보호 절차 우선 적용.",
      cost: "남는 대가: 시스템은 살아남습니다. 그래서 앞으로의 문제는 파괴가 아니라 감시를 얼마나 오래 유지하느냐가 됩니다.",
    },
    ending_expose: {
      title: "트리거랩의 구조는 외부로 넘어가고 실험은 공개 사건이 됩니다.",
      ruling: "숨겨진 기록은 더 이상 내부 자산이 아닙니다. 사회적 검증은 시작되지만, 공개된 자료는 보호받아야 할 사람들의 이름 가까이까지 번집니다.",
      execution: "즉시 적용: 실험 구조 외부 제출, 운영진 권한 회수, 관련 조직 전수 감사 개시.",
      cost: "남는 대가: 진실은 빠르게 움직입니다. 그 속도 때문에 누군가는 보호보다 먼저 노출될 수 있습니다.",
    },
  };
  const failureVerdict = {
    title: "트리거랩의 운영은 붕괴합니다.",
    ruling: "권한은 있었지만 감당할 시간과 신뢰가 남지 않았습니다. 기록은 보존되지만, 지금의 시스템은 더 이상 같은 방식으로 작동할 수 없습니다.",
    execution: "즉시 적용: 진행 중인 케이스 정지, 복구 키 분리, 다음 실행에서 압박 분산 조건 강제.",
    cost: "남는 대가: 실패는 결론이 아니라 복구 조건이 됩니다. 다음 플레이는 더 좁은 권한에서 시작합니다.",
  };
  const openVerdict = {
    title: endingVariant?.title ?? "트리거랩은 완전히 닫히지 않습니다.",
    ruling: endingVariant?.text ?? "당신은 답 하나를 확정하지 않고, 다음 사람이 판단해야 할 조건을 남겼습니다.",
    execution: view.endingSceneProfile?.choice
      ? `즉시 적용: ${view.endingSceneProfile.choice}.`
      : "즉시 적용: 미해결 기록을 다음 근무자에게 인계합니다.",
    cost: "남는 대가: 결론을 유예한 만큼 다음 참가자는 더 많은 권한과 더 무거운 질문을 동시에 받습니다.",
  };
  const finalVerdict = endingVariant?.failure
    ? failureVerdict
    : (choiceVerdicts[finalEndingEntry?.choiceId] ?? openVerdict);
  const endingTwists = [
    {
      label: "판정",
      title: finalVerdict.title,
      evidence: endingVariant?.label ?? endingProfile.tag,
      copy: finalVerdict.ruling,
    },
    {
      label: "집행",
      title: "당신의 마지막 선택은 바로 운영 규칙으로 적용됩니다.",
      evidence: finalChoiceText,
      copy: finalVerdict.execution,
    },
    {
      label: "대가",
      title: "끝난 것은 사건이고, 남은 것은 책임입니다.",
      evidence: view.endingSceneProfile?.location ?? `${observationLabels[dominantObservation[0]]} 관찰값이 가장 크게 남았다`,
      copy: finalVerdict.cost,
    },
  ];
  const currentEndingTwist = endingTwists[endingTwistIndex] ?? endingTwists[0];
  const endingTwistCount = endingTwists.length;
  const endingImage = view.endingSceneProfile?.image ?? "/ending-final-archive.webp";
  const isFinalEndingTwist = endingTwistIndex >= endingTwistCount - 1;
  const endingAxes = [
    { label: "PROTECT", value: Math.min(100, Math.round((result.pressureAdaptScore ?? 0) * 0.7 + (result.reducedRiskCount ?? 0) * 10)), text: "사람과 현장의 피해를 얼마나 줄였는가" },
    { label: "EXPOSE", value: Math.min(100, Math.round((result.reflectionScore ?? 0) * 0.8 + (result.freeCount ?? 0) * 8)), text: "구조와 숨은 비용을 얼마나 드러냈는가" },
    { label: "HANDOFF", value: Math.min(100, Math.round((result.cognitionScore ?? 0) * 0.7 + (observerPattern?.turningPoint ? 24 : 0))), text: "다음 참가자에게 선택지를 얼마나 남겼는가" },
  ];
  const witnessRecords = [
    firstRouteEntry && { id: "first", label: "처음 남긴 말", tag: firstRouteEntry.observerTag?.label, text: firstRouteEntry.spokenChoice || firstRouteEntry.choice },
    longestRouteEntry && { id: "longest", label: "가장 오래 붙잡은 말", tag: longestRouteEntry.observerTag?.label, text: longestRouteEntry.spokenChoice || longestRouteEntry.choice },
    branchRouteEntry && { id: "branch", label: "판을 흔든 말", tag: branchRouteEntry.observerTag?.label, text: branchRouteEntry.freeText || branchRouteEntry.spokenChoice || branchRouteEntry.choice },
  ].filter(Boolean);
  const observerRouteRecords = routeTimeline
    .filter((entry) => entry.observerTag)
    .slice(-4)
    .map((entry) => ({
      id: `${entry.nodeId}-${entry.index}`,
      label: entry.observerTag.label,
      title: entry.title,
      text: entry.observerTag.text,
    }));
  const observerTurningPoint = observerPattern?.turningPoint;
  const endingAfterglow = {
    compliance: {
      title: "당신은 질서를 지켰고, 그 질서가 누구를 조용히 밀어냈는지도 남겼습니다.",
      text: "기록은 당신을 순응한 사람으로만 저장하지 않습니다. 무너지지 않게 붙잡은 순간과, 너무 늦게 질문한 순간을 함께 보관합니다.",
    },
    defiance: {
      title: "당신은 문을 열었고, 이제 그 문으로 들어올 사람의 몫까지 떠안았습니다.",
      text: "거부는 끝내는 버튼이 아니었습니다. 다음 사람에게 더 큰 선택지를 남기는 대신, 더 큰 책임도 함께 넘긴 일이었습니다.",
    },
    opacity: {
      title: "당신이 숨긴 것은 사라지지 않고, 다음 참가자의 첫 질문이 되었습니다.",
      text: "침묵은 흔적을 지우지 못했습니다. 다만 누가 그 흔적을 먼저 발견할지, 그 순서만 바꾸었습니다.",
    },
    sacrifice: {
      title: "당신은 누군가를 살리기 위해 자신의 이름을 기록의 가장 앞에 남겼습니다.",
      text: "희생은 깨끗한 결말이 아닙니다. 남은 사람들은 당신의 선택 덕분에 계속 말할 수 있지만, 그 말의 무게도 함께 기억합니다.",
    },
  }[dominantObservation[0]] ?? {
    title: "당신의 선택은 결론보다 오래 남는 질문이 되었습니다.",
    text: "기록은 정답을 보관하지 않습니다. 다음 판단이 시작될 수 있도록, 당신이 멈춘 자리의 온도를 보관합니다.",
  };
  return (
      <main className={`shell ${currentCase === "final" ? "ending-shell" : ""}`}>
        <AdaptiveMusic modeKey={musicModeKey} />
        {renderDecisionReveal()}
        {renderRecoveryNotice()}
        {renderErrorLogPanel()}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {screenReaderStatus}
        </p>
        {currentCase === "final" && (
          <EndingSequence
            endingStep={endingStep}
            endingTwistIndex={endingTwistIndex}
            endingTwistCount={endingTwistCount}
            currentEndingTwist={currentEndingTwist}
            finalChoiceText={finalChoiceText}
            isFinalEndingTwist={isFinalEndingTwist}
            witnessRecords={witnessRecords}
            observerEndingRecord={observerEndingRecord}
            advanceEndingStep={advanceEndingStep}
            endingQuietLine={endingQuietLine}
            endingQuietReady={endingQuietReady}
            skipEndingQuietHold={skipEndingQuietHold}
            nextParticipantMessage={nextParticipantMessage}
            setNextParticipantMessage={setNextParticipantMessage}
            saveNextParticipantMessage={saveNextParticipantMessage}
            endingAfterglow={endingAfterglow}
            unopenedRecordCount={unopenedRecordCount}
            unopenedClueCount={unopenedClueCount}
            unopenedBranchCount={unopenedBranchCount}
            endingAtmosphere={view.endingAtmosphere}
            endingVisualClass={view.endingVisualClass}
            endingImage={endingImage}
          />
        )}
        <section className={`result-page ${currentCase === "final" && endingStep < 3 ? "final-report-locked" : ""}`}>
          <div className="topbar">
            <span className="brand-mark">{GAME_TITLE}</span>
            <div className="top-actions">
              <button type="button" className="ghost replay-case-button" onClick={() => startCase(currentCase)} aria-keyshortcuts="R">
                <RefreshCcw size={16} />
                이 사건 다시 도전
              </button>
              <button type="button" className="ghost" onClick={() => { setStarted(false); setShowRanking(true); }}>
                <Trophy size={16} />
                랭킹
              </button>
              <button type="button" className="ghost" onClick={showSeasonMap}>
                <FileText size={16} />
                시즌 로드맵
              </button>
              <button className="ghost" type="button" onClick={copyReplayLink}>
                <Link2 size={16} />
                리플레이 링크
              </button>
              {debugToolsEnabled && (
                <button
                  type="button"
                  className="ghost"
                  aria-expanded={showErrorLog}
                  aria-controls={showErrorLog ? "error-log-panel" : undefined}
                  onClick={() => setShowErrorLog(true)}
                >
                  <AlertTriangle size={16} />
                  에러 로그
                </button>
              )}
              <button className="ghost" type="button" data-testid="export-play-log" onClick={() => exportPlaytestLog()}>
                <Download size={16} />
                공유 요약
              </button>
              {debugToolsEnabled && (
                <button
                  className="ghost"
                  type="button"
                  data-testid="export-diagnostic-log"
                  onClick={() => {
                    if (
                      typeof globalThis.confirm === "function" &&
                      !globalThis.confirm("진단 로그에는 원문 선택 로그, 피드백 원문, 에러 stack, DOM 스냅샷, 복구 슬롯이 포함됩니다. 내보낼까요?")
                    ) {
                      return;
                    }
                    exportPlaytestLog({ includeDiagnostics: true });
                  }}
                >
                  <Download size={16} />
                  진단 로그
                </button>
              )}
              <button type="button" className="ghost" onClick={reset}>
                <RefreshCcw size={16} />
                다시 플레이
              </button>
            </div>
          </div>
          <div className="result-hero">
            <p>{playerName}의 {activeCaseMeta?.label} 사고 활성 프로필</p>
            <h1 ref={sceneTitleRef} tabIndex={-1}>
              {currentCase === "final"
                ? "이제 당신은 자신의 조건을 어떻게 쓸지 선택해야 합니다."
                : `${triggerLabels[result.primary[0]]} 조건에서 사고가 가장 오래 유지됐습니다.`}
            </h1>
          </div>
          <section className="outcome-panel" aria-label="내가 만든 결말">
            <div className="outcome-panel-mark">
              <span>YOUR CONSEQUENCE</span>
              <strong>{caseOutcome.tag}</strong>
            </div>
            <div>
              <h2>{caseOutcome.title}</h2>
              <p>{caseOutcome.text}</p>
            </div>
          </section>
          {currentCase === "final" && endingVariant && (
            <section className={`ending-variant-panel ${endingVariant.failure ? "failure" : ""}`} aria-label="결말 변형">
              <span>{endingVariant.label}</span>
              <h2>{endingVariant.title}</h2>
              <p>{endingVariant.text}</p>
              <small>{endingVariant.failure ? "자원 관리 실패가 기록되었습니다. 다음 플레이에서는 압박을 분산하십시오." : "이 결말은 단서, 관계, 자원 조합에 따라 달라집니다."}</small>
            </section>
          )}
          {currentCase === "final" && view.endingEpilogue && (
            <section className="ending-epilogue-panel" aria-label="엔딩 에필로그">
              <span>AFTER THE RECORD</span>
              <p>{view.endingEpilogue}</p>
            </section>
          )}
          {currentCase === "final" && view.failureRecovery && (
            <section className="failure-recovery-panel" aria-label="실패 복구 경로">
              <strong>{view.failureRecovery.title}</strong>
              <p>{view.failureRecovery.text}</p>
            </section>
          )}
          {currentCase === "final" && view.operatorReveal && (
            <section className="operator-reveal-panel" aria-label="주인공 정체 공개">
              <span>{view.operatorReveal.title}</span>
              <p>{view.operatorReveal.text}</p>
            </section>
          )}
          {currentCase === "final" && view.achievementProgress?.length > 0 && (
            <section className="achievement-panel ending-achievement-panel" aria-label="업적 진행">
              <span>ACHIEVEMENT TRACKER</span>
              <div>{view.achievementProgress.map((item) => <article key={item.id}><b>{item.label}</b><small>{item.unlocked ? "UNLOCKED" : `${item.value} / ${item.goal}`}</small></article>)}</div>
            </section>
          )}
          {currentCase === "final" && view.operationsSnapshot && (
            <section className="operations-snapshot" aria-label="운영 진단">
              <span>OPERATIONS</span>
              <strong>{view.operationsSnapshot.state}</strong>
              <small>errors {view.operationsSnapshot.errorCount} / pending {view.operationsSnapshot.pendingCount} / rankings {view.operationsSnapshot.rankingCount}</small>
            </section>
          )}
          {currentCase === "final" && (
            <section className="observation-panel" aria-label="관찰 장부">
              <div className="panel-title-row">
                <h2>관찰 장부</h2>
                <span>이번 시즌에 처음 공개되는 네 가지 반응</span>
              </div>
              <div className="observer-pattern-card">
                <span>{observerEndingRecord.label}</span>
                <strong>{observerEndingRecord.title}</strong>
                <p>{observerEndingRecord.text}</p>
              </div>
              <div className="observation-grid">
                {Object.entries(observationLedger).map(([key, value]) => (
                  <article key={key}>
                    <span>{key}</span>
                    <b>{value}</b>
                  </article>
                ))}
              </div>
            </section>
          )}
          {view.endingSceneProfile && (
            <section className="ending-scene-profile" aria-label="엔딩 장면 프로필">
              <span>{view.endingSceneProfile.location}</span>
              <strong>{view.endingSceneProfile.cue}</strong>
              <p>다음 장면의 핵심 행동: {view.endingSceneProfile.choice}</p>
            </section>
          )}
          {view.endingPreview && (
            <section className="ending-preview-panel" aria-label="현재 엔딩 방향">
              <span>ENDING DIRECTION</span>
              <strong>{view.endingPreview.label}</strong>
              <p>{view.endingPreview.text}</p>
            </section>
          )}
          {view.authorityReview && (
            <section className="authority-review-panel" aria-label="권한 심사">
              <span>{view.authorityReview.title}</span>
              <strong>{view.authorityReview.text}</strong>
              <p>{view.authorityReview.next}</p>
            </section>
          )}
          {view.originEndingVariant && <p className="origin-ending-note"><strong>{view.originEndingVariant.label}</strong> {view.originEndingVariant.text}</p>}
          {view.failureObjectives?.length > 0 && (
            <section className="failure-objectives" aria-label="실패 재도전 목표">
              <strong>RETRY OBJECTIVES</strong>
              {view.failureObjectives.map((objective) => <span key={objective}>□ {objective}</span>)}
              <button type="button" onClick={view.startRecoveryRoute}>복구 루트 시작</button>
              {view.endingCause && <p className="failure-cause"><b>PRIMARY CAUSE: {view.endingCause.id}</b> {view.endingCause.text} {view.endingCause.recovery}</p>}
            </section>
          )}
          {view.playReport && (
            <section className="play-report-panel" aria-label="플레이 리포트">
              <span>PLAYER REPORT</span>
              <div><article><b>{view.playReport.decisions}</b><small>결정</small></article><article><b>{view.playReport.clues}</b><small>검증 신호</small></article><article><b>{view.playReport.dominantStyle}</b><small>행동 성향</small></article></div>
              <p>최근 경로: {view.playReport.route.join(" → ") || "기록 없음"}</p>
            </section>
          )}
          {view.telemetryDashboard && (
            <section className="telemetry-dashboard-panel" aria-label="플레이테스트 상태">
              <span>PLAYTEST HEALTH</span>
              <div><b>{view.telemetryDashboard.completed}</b><small>완료 케이스</small><b>{view.telemetryDashboard.pending}</b><small>재전송 대기</small><b>{view.telemetryDashboard.errors}</b><small>로컬 오류</small><b>{view.telemetryDashboard.runs}</b><small>분리된 런</small></div>
            </section>
          )}
          {view.rankingIntegrity && <p className={`ranking-integrity ${view.rankingIntegrity.valid ? "valid" : "invalid"}`} role="status"><strong>{view.rankingIntegrity.label}</strong> {view.rankingIntegrity.text}</p>}
          {view.aftermath && <section className="aftermath-panel" aria-label="엔딩 이후 변화"><span>{view.aftermath.title}</span><p>{view.aftermath.text}</p></section>}
          {debugToolsEnabled && view.replayDiagnostics && <details className="replay-diagnostics"><summary>REPLAY DIAGNOSTICS</summary><p>{view.replayDiagnostics.text}</p></details>}
          {view.delayedConsequences?.length > 0 && (
            <section className="delayed-consequence-strip" aria-label="챕터 지연 결과">
              <span>CONSEQUENCE CHAIN</span>
              <p>{view.delayedConsequences.map((item) => item.text).join(" ")}</p>
            </section>
          )}
          {view.rankingComparison && (
            <section className="ranking-comparison" aria-label="기록 비교">
              <span>RUN COMPARISON</span>
              {view.rankingComparison.map((item) => <div key={item.label}><b>{item.label}</b><i><em style={{ width: `${item.value}%` }} /></i><small>{item.value}</small></div>)}
            </section>
          )}
          {view.seasonGoals && (
            <section className="season-goal-strip result-goals" aria-label="시즌 목표">
              <span>SEASON GOALS</span>
              {view.seasonGoals.map((goal) => <article key={goal.id}><b>{goal.label}</b><small>{goal.text}</small></article>)}
            </section>
          )}
          {view.balanceSignals?.length > 0 && (
            <section className="balance-report" aria-label="플레이 밸런스 리포트">
              <span>BALANCE SIGNAL</span>
              <p>{view.balanceSignals.map((signal) => `${signal.choiceId} ${signal.share}%`).join(" · ")} 선택 편중이 감지되었습니다. 다음 기록에서 다른 선택을 시험해 보세요.</p>
            </section>
          )}
          <section className="ending-axis-panel" aria-label="엔딩 결정 축">
            <div className="panel-title-row">
              <h2>ENDING AXIS</h2>
              <span>이번 선택이 남긴 세 가지 방향</span>
            </div>
            <div className="ending-axis-grid">
              {endingAxes.map((axis) => (
                <article key={axis.label}>
                  <div><span>{axis.label}</span><b>{axis.value}</b></div>
                  <i><em style={{ width: `${axis.value}%` }} /></i>
                  <p>{axis.text}</p>
                </article>
              ))}
            </div>
          </section>
          <section className={`rank-panel rank-${resultRank.toLowerCase()}`}>
            <div className="rank-mark">
              <span>CASE RANK</span>
              <strong>{resultRank}</strong>
            </div>
            <div className="rank-copy">
              <span>{momentumTier} · {momentumScore} POINTS</span>
              <h2>{rankLine}</h2>
              <p>
                다음 케이스는 이 랭크보다 트리거 분포를 더 중요하게 사용합니다. 랭크는
                정답 여부보다 사고가 정밀하게 솟은 조건을 비교하는 플레이 지표입니다.
              </p>
            </div>
            <div className="score-breakdown">
              {scoreBreakdown.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <b>{item.text}</b>
                  <small>{item.note}</small>
                  <div>
                    <i style={{ width: `${clamp(item.value, item.value > 0 ? 14 : 4, 100)}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="fingerprint-panel" aria-label="판단 DNA">
            <div className="fingerprint-heading">
              <div>
                <span>DECISION DNA</span>
                <h2>{decisionFingerprint.modeTitle}</h2>
                <p>{decisionFingerprint.modeText}</p>
              </div>
              <strong>{decisionFingerprint.mode}</strong>
            </div>
            <div className="fingerprint-grid">
              <article>
                <span>PRIMARY PRESSURE</span>
                <b>{triggerLabels[decisionFingerprint.primaryTrigger[0]]}</b>
                <small>{decisionFingerprint.pressureShare}% of recorded pressure</small>
              </article>
              <article>
                <span>THINKING ENGINE</span>
                <b>{easyCognitionLabels[decisionFingerprint.primaryCognition[0]] ?? cognitionLabels[decisionFingerprint.primaryCognition[0]]}</b>
                <small>{decisionFingerprint.signature.join(" / ")}</small>
              </article>
              <article>
                <span>RISK TRAJECTORY</span>
                <b>{decisionFingerprint.ledger.netRiskDelta > 0 ? "압박 누적" : "압박 회수"}</b>
                <small>
                  {decisionFingerprint.ledger.riskDrops}회 하락 · {decisionFingerprint.ledger.riskRises}회 상승
                </small>
              </article>
            </div>
          </section>
          <section className="counterfactual-panel" aria-label="Counterfactual Lab">
            <div className="panel-title-row">
              <h2>COUNTERFACTUAL LAB</h2>
              <span>실제 선택과 선택하지 않은 관점의 압박 차이</span>
            </div>
            {counterfactualReport.length > 0 ? (
              <div className="counterfactual-list">
                {counterfactualReport.map((report) => (
                  <article key={report.nodeId}>
                    <div className="counterfactual-scene">
                      <span>{report.title}</span>
                      <small>{report.actualWasSafest ? "압박을 낮춘 관점" : "다른 관점과 차이 발생"}</small>
                    </div>
                    <div className="counterfactual-path actual-path">
                      <b>ACTUAL</b>
                      <strong>{report.actual.label}</strong>
                      <small>
                        위험 {report.actualForecast ? formatRiskDelta(report.actualForecast.riskDelta) : "기록"}
                      </small>
                    </div>
                    <div className="counterfactual-path safest-path">
                      <b>LOW PRESSURE LENS</b>
                      <strong>{report.safest.label}</strong>
                      <small>위험 {formatRiskDelta(report.safestForecast.riskDelta)}</small>
                    </div>
                    <div className="counterfactual-path costliest-path">
                      <b>HIGH PRESSURE LENS</b>
                      <strong>{report.costliest.label}</strong>
                      <small>위험 {formatRiskDelta(report.costliestForecast.riskDelta)}</small>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="counterfactual-empty">선택 로그가 쌓이면 지나간 장면의 다른 경로가 열립니다.</p>
            )}
          </section>
          <section className="session-panel">
            <div>
              <span>PLAYTEST SESSION</span>
              <strong data-testid="session-code">{sessionCode}</strong>
              <p>테스터 인터뷰, JSON 로그, 원격 저장 기록을 맞출 때 쓰는 짧은 세션 코드입니다.</p>
              <small
                className={`remote-status ${telemetryStatus.tone}`}
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {telemetryStatus.text}
              </small>
              {!telemetryEnabled && (
                <p className="telemetry-explanation">원격 랭킹 설정이 없어 이 브라우저에만 저장됩니다.</p>
              )}
              {telemetryEnabled && !dataConsent && (
                <p className="telemetry-explanation">데이터 제공 동의가 없어 원격 랭킹에 기록하지 않았습니다.</p>
              )}
              {pendingTelemetry.length > 0 && (
                <div className="retry-telemetry">
                  <b>원격 저장 대기 {pendingTelemetry.length}건</b>
                  <p>
                    {pendingTelemetry.map((item) => item.label).join(" · ")}
                  </p>
                  <GuardedButton
                    type="button"
                    onClick={async () => {
                      const result = await retryPendingTelemetry();
                      if (result?.failedCount > 0) {
                        scheduleTelemetryRetry();
                      }
                    }}
                    disabled={!telemetryEnabled || !dataConsent || !isOnline || isRetryingTelemetry}
                  >
                    {isRetryingTelemetry ? "재전송 중" : isOnline ? "원격 저장 재시도" : "연결 대기 중"}
                  </GuardedButton>
                </div>
              )}
            </div>
            <button type="button" onClick={copySessionCode}>
              <Copy size={16} />
              <span aria-live="polite">{copyStatus || "코드 복사"}</span>
            </button>
          </section>
          {nextCaseSignal && (
            <section className="next-case-panel">
              <div>
                <span>{nextCaseSignal.eyebrow}</span>
                <h2>{nextCaseSignal.title}</h2>
                <p>{nextCaseSignal.premise}</p>
                <p className="next-case-hook">{nextCaseSignal.hook}</p>
                <small>{resultBridge}</small>
              </div>
              <button type="button" onClick={() => startCase(nextCaseSignal.caseId)} aria-keyshortcuts="N">
                <ChevronRight size={18} />
                {nextCaseSignal.button}
              </button>
            </section>
          )}
          <section className="achievement-panel">
            <div className="panel-title-row">
              <h2>
                <Sparkles size={17} />
                획득 배지
              </h2>
              <span>이번 케이스의 플레이 스타일입니다.</span>
            </div>
            <div>
              {achievementBadges.map((badge) => (
                <article key={badge.title}>
                  <b>{badge.title}</b>
                  <p>{badge.text}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="result-grid">
            <section className="report-section">
              <h2>Primary Trigger</h2>
              <strong>{triggerLabels[result.primary[0]]}</strong>
              <p>
                {result.longestDecision?.title ?? "이번 케이스"}에서 가장 오래 남은 압박입니다.
                이후 선택 로그는 이 조건을 중심으로 다음 사건에 반영됩니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Secondary Trigger</h2>
              <strong>{triggerLabels[result.secondary[0]]}</strong>
              <p>
                첫 번째 조건을 보조한 압박입니다. 같은 선택 안에서도 명분과 비용이 이
                방향으로 다시 흔들렸습니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Cognitive Acceleration</h2>
              <strong>{easyCognitionLabels[result.thinking[0]] ?? cognitionLabels[result.thinking[0]]}</strong>
              <p>
                로그상 가장 자주 사용된 사고 방식입니다. 선택을 빠르게 닫기보다 이 방식으로
                한 번 더 버티거나 뒤집었습니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Free Text</h2>
              <strong>{result.freeCount}회</strong>
              <p>
                준비된 선택지 밖에서 조건을 다시 짠 횟수입니다. 0회라면 다음 테스트에서는
                구조 재설계 유도가 충분했는지 확인해야 합니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Avg Time</h2>
              <strong>{result.averageResponseTime}s</strong>
              <p>
                각 국면에서 결정을 내리기까지 걸린 평균 시간입니다. 짧을수록 선택지가
                명확했거나 압박이 약했을 수 있습니다.
              </p>
            </section>
            <section className="report-section wide-report">
              <h2>Longest Decision</h2>
              <strong>{result.longestDecision?.title ?? "없음"}</strong>
              <p>
                가장 오래 머문 국면입니다. 이 장면의 메모, 에코 반론, 선택지 비용이 실제
                고민을 만들었는지 인터뷰에서 우선 확인합니다.
              </p>
            </section>
          </div>
          <section className="route-atlas">
            <div className="panel-title-row">
              <h2>
                <Sparkles size={17} />
                내가 지나온 경로
              </h2>
              <span>{routeTimeline.length}개 판단 · 마지막 선택이 이번 결말을 만들었습니다.</span>
            </div>
            <div className="route-atlas-track" aria-label="이번 플레이 선택 경로" tabIndex={0}>
              {routeTimeline.map((entry) => (
                <article className={`route-atlas-node ${entry.marker.tone}`} key={`${entry.nodeId}-${entry.index}`}>
                  <div className="route-atlas-dot" aria-hidden="true">{String(entry.index + 1).padStart(2, "0")}</div>
                  <div className="route-atlas-copy">
                    <div className="route-atlas-meta">
                      <span>{entry.marker.label}</span>
                      {entry.challenge && (
                        <b className={entry.challenge.matched ? "route-hit" : "route-miss"}>
                          {entry.challenge.matched ? "목표 달성" : "목표 미달"}
                        </b>
                      )}
                      {entry.streakBreak && <b className="route-break">연속 끊김</b>}
                      {entry.clue && <b className="route-clue">단서 발견</b>}
                      {entry.routeChangeKind === "memory" && <b className="route-memory">MEMORY</b>}
                      {entry.routeChangeKind === "evidence-turn" && <b className="route-turnaround">EVIDENCE TURN</b>}
                      {entry.routeChangeKind === "free-text" && <b className="route-system">FREE TEXT</b>}
                      {entry.observerTag && <b className="route-observer">{entry.observerTag.label}</b>}
                    </div>
                    <strong>{entry.title}</strong>
                    <p>{entry.freeText || entry.spokenChoice || entry.choice}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          {observerRouteRecords.length > 0 && (
            <section className="observer-postmortem" aria-label="관찰자 회고">
              <div className="panel-title-row">
                <h2>
                  <Sparkles size={17} />
                  OBSERVER POSTMORTEM
                </h2>
                <span>{observerEndingRecord.label}이 이번 보고서의 해석 기준입니다.</span>
              </div>
              <div className="observer-postmortem-grid">
                {observerTurningPoint && (
                  <article className="observer-turning-record">
                    <span>{observerTurningPoint.label}</span>
                    <strong>{observerTurningPoint.title}</strong>
                    <p>{observerTurningPoint.text}</p>
                  </article>
                )}
                {observerRouteRecords.map((record) => (
                  <article key={record.id}>
                    <span>{record.label}</span>
                    <strong>{record.title}</strong>
                    <p>{record.text}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
          <section className="feedback-panel">
            <div className="panel-title-row">
              <h2>
                <MessageSquareText size={17} />
                플레이테스트 피드백
              </h2>
              <span>이 케이스가 실제로 고민을 만들었는지 확인합니다.</span>
            </div>
            <div className="feedback-prompts">
              <span>이번 케이스에서 확인할 질문</span>
              <ul>
                {feedbackPrompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
            </div>
            <div className="feedback-controls">
              <label>
                <span>이해도</span>
                <select
                  value={currentFeedback.clarity}
                  onChange={(event) => updateCurrentFeedback({ clarity: event.target.value })}
                >
                  <option value="">선택</option>
                  <option value="1">1 · 거의 이해되지 않음</option>
                  <option value="2">2 · 일부만 이해됨</option>
                  <option value="3">3 · 보통</option>
                  <option value="4">4 · 대체로 명확함</option>
                  <option value="5">5 · 매우 명확함</option>
                </select>
              </label>
              <label>
                <span>고민 강도</span>
                <select
                  value={currentFeedback.difficulty}
                  onChange={(event) => updateCurrentFeedback({ difficulty: event.target.value })}
                >
                  <option value="">선택</option>
                  <option value="1">1 · 바로 결정함</option>
                  <option value="2">2 · 조금 고민함</option>
                  <option value="3">3 · 보통</option>
                  <option value="4">4 · 꽤 오래 고민함</option>
                  <option value="5">5 · 매우 결정하기 어려움</option>
                </select>
              </label>
            </div>
            <textarea
              value={currentFeedback.comment}
              onChange={(event) => updateCurrentFeedback({ comment: event.target.value })}
              maxLength={FEEDBACK_COMMENT_MAX_LENGTH}
              placeholder="막힌 장면, 이해되지 않은 용어, 다시 보고 싶은 선택지를 짧게 남겨주세요."
              aria-label="플레이테스트 피드백 자유 의견"
              aria-describedby={
                activeFeedbackPrivacySignals.length > 0
                  ? "feedback-input-note feedback-privacy-warning"
                  : "feedback-input-note"
              }
            />
            <p className="input-note" id="feedback-input-note">
              실명, 연락처, 회사명, 실제 사건 관계자 이름은 적지 마세요. {currentFeedback.comment.length}/
              {FEEDBACK_COMMENT_MAX_LENGTH}
            </p>
            {activeFeedbackPrivacySignals.length > 0 && (
              <div className="privacy-warning" id="feedback-privacy-warning" role="alert">
                <strong>피드백에 식별 정보로 보일 수 있는 표현이 있습니다.</strong>
                <p>
                  감지 항목: {activeFeedbackPrivacySignals.map((signal) => signal.label).join(" / ")}.
                  저장하려면 인터뷰 기록과 원격 저장 기록에 남기기 전에 익명 표현으로 바꿔주세요.
                </p>
                <button type="button" onClick={anonymizeFeedbackComment}>
                  피드백 익명화
                </button>
              </div>
            )}
            <div className="feedback-actions">
              <GuardedButton
                type="button"
                onClick={submitCurrentFeedback}
                disabled={activeFeedbackPrivacySignals.length > 0 || isSubmittingFeedback}
                aria-busy={isSubmittingFeedback}
                aria-label={
                  activeFeedbackPrivacySignals.length > 0
                    ? "식별 정보로 보일 수 있는 표현을 익명화해야 피드백을 저장할 수 있습니다."
                    : isSubmittingFeedback
                      ? "피드백 저장 중"
                      : "피드백 저장"
                }
              >
                {isSubmittingFeedback ? "저장 중..." : "피드백 저장"}
              </GuardedButton>
              {feedbackStatus && (
                <span role="status" aria-live="polite">
                  {feedbackStatus}
                </span>
              )}
            </div>
          </section>
          <section className="bars-panel">
            <h2>Trigger Map</h2>
            {Object.entries(triggerLabels).map(([key, label]) => (
              <div className="bar-row" key={key}>
                <span>{label}</span>
                <div className="bar-track">
                  <div style={{ width: `${clamp(triggers[key] * 5, 4, 100)}%` }} />
                </div>
                <b>{triggers[key]}</b>
              </div>
            ))}
          </section>
          <section className="history">
            <h2>Decision Log</h2>
            {log.map((entry, index) => (
              <article key={`${entry.nodeId}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <b>{entry.title}</b>
                  <p>{entry.freeText || entry.spokenChoice || entry.choice}</p>
                  {entry.challenge && (
                    <div className="history-challenge">
                      {entry.tactical && (
                        <small className={`challenge-grade grade-${entry.tactical.grade.toLowerCase()}`}>
                          등급 {entry.tactical.grade} · {entry.tactical.gradeText}
                        </small>
                      )}
                      <small className={entry.challenge.matched ? "challenge-success" : "challenge-miss"}>
                        {entry.challenge.matched ? "챌린지 달성" : "챌린지 미달"} · {entry.challenge.title}
                      </small>
                      <small>
                        위험 {entry.challenge.riskDelta > 0 ? "+" : ""}
                        {entry.challenge.riskDelta}
                      </small>
                      {entry.flowSurge && (
                        <small className="surge-success">
                          {entry.flowSurge.label} · {entry.flowSurge.text}
                        </small>
                      )}
                      {entry.suspenseEvent && (
                        <small className="suspense-event-log">
                          {entry.suspenseEvent.label} · {entry.suspenseEvent.text}
                        </small>
                      )}
                      {entry.streakBreak && (
                        <small className="streak-break-log">
                          {entry.streakBreak.label} · {entry.streakBreak.text}
                        </small>
                      )}
                    </div>
                  )}
                  {entry.observerTag && (
                    <div className="history-observer">
                      <span>{entry.observerTag.label}</span>
                      <p>{entry.observerTag.text}</p>
                    </div>
                  )}
                  {entry.sceneBeat && (
                    <details className="decision-scene">
                      <summary>장면 다시 보기</summary>
                      <div>{renderSceneLines(entry.sceneBeat)}</div>
                    </details>
                  )}
                  <small>{entry.responseTimeSec}s · {entry.echo}</small>
                </div>
              </article>
            ))}
          </section>
          <section className="resource-delta-panel">
            <h2>Resource Change</h2>
            <div className="delta-table">
              {log.map((entry, index) => (
                <article key={`${entry.nodeId}-delta-${index}`}>
                  <b>{String(index + 1).padStart(2, "0")} · {entry.title}</b>
                  <div>
                    {/* Green marks what the run gained, so 사람 피해 +11 is a
                        loss here even though the number went up. */}
                    {Object.entries(entry.effect ?? {}).map(([key, value]) => (
                      <span key={key} className={isResourceGain(key, value) ? "delta-up" : "delta-down"}>
                        {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}
                        {value}
                      </span>
                    ))}
                  </div>
                  <p>{explainResourceTradeoff(entry.effect)}</p>
                </article>
              ))}
            </div>
          </section>
          {currentCase === "final" ? (
            <section className="story-reveal ending-reveal">
              <span>SEASON 1 COMPLETE · {endingProfile.tag}</span>
              <h2>{endingProfile.title}</h2>
              <p>
                {endingProfile.text} {finalAftermathEntry ? `마지막 후폭풍에서 "${finalAftermathEntry.choice}"을 선택했습니다.` : ""}
              </p>
              <div className="ending-clue-summary">
                <strong>{clueCount}/6 숨은 단서 발견</strong>
                <span>
                  {clueCount >= 4
                    ? "실험의 바깥쪽까지 도달했습니다. 마지막 기록이 당신의 선택을 기다립니다."
                    : "다른 장면에서 위험한 성공을 만들면 더 많은 기록을 찾을 수 있습니다."}
                </span>
              </div>
            </section>
          ) : (
            <section className="story-reveal">
              <span>NEXT CASE SIGNAL</span>
              <h2>다음 사건은 당신이 가장 강하게 반응한 조건을 중심으로 재구성됩니다.</h2>
              <p>
                트리거랩은 사건 해결 능력만 보지 않습니다. 어떤 압박이 들어왔을 때 당신이
                더 오래 생각하고, 더 쉽게 원칙을 바꾸며, 더 많은 손실을 감수하는지 기록합니다.
              </p>
            </section>
          )}
        </section>
      </main>
);
}
