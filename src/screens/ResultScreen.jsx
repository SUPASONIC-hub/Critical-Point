import React from "react";
import { AlertTriangle, ChevronRight, Copy, Download, FileText, MessageSquareText, RefreshCcw, Sparkles, Trophy } from "lucide-react";

export function ResultScreen({ view }) {
  const { AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, currentCase, endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, caseResults, decisionFingerprint, observationLedger, observerPattern, endingProfile, advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage, saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine, skipEndingQuietHold, GAME_TITLE, startCase, setStarted, setShowRanking, showSeasonMap, debugToolsEnabled, showErrorLog, setShowErrorLog, exportPlaytestLog, reset, playerName, activeCaseMeta, sceneTitleRef, triggerLabels, triggers, result, caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp, easyCognitionLabels, cognitionLabels, formatRiskDelta, counterfactualReport, sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry, telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus, nextCaseSignal, resultBridge, achievementBadges, feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH, activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback, feedbackStatus, routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, renderSceneLines } = view;
  const firstCaseChoice = caseResults.case01?.outcomeChoiceId ?? "기록 없음";
  const finalChoiceText = finalAftermathEntry?.choice || finalEndingEntry?.choice || "당신이 남긴 마지막 판단";
  const firstRouteEntry = routeTimeline[0];
  const longestRouteEntry = [...routeTimeline].sort((a, b) => (b.responseTimeSec ?? 0) - (a.responseTimeSec ?? 0))[0];
  const branchRouteEntry = [...routeTimeline].reverse().find((entry) => entry.freeTextSuccess || entry.freeTextBranchId);
  const taggedRouteEntry = [...routeTimeline].reverse().find((entry) => entry.observerTag);
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
  const endingTwists = [
    {
      label: "위화감",
      title: "보관소의 첫 번째 기록은 오늘 생성된 파일이 아니다.",
      evidence: firstRouteEntry?.observerTag?.label
        ? `${firstRouteEntry.observerTag.label}: ${firstRouteEntry.spokenChoice || firstRouteEntry.choice}`
        : firstRouteEntry?.spokenChoice || firstRouteEntry?.choice || `CASE 01 결말 키: ${firstCaseChoice}`,
      copy: "트리거랩은 당신을 처음 본 것이 아니었다. 첫 사건의 첫 문장은 시작점이 아니라 복원된 흔적이었다.",
    },
    {
      label: "증거",
      title: "에코의 문장은 조언이 아니라 같은 선택을 지나간 사람의 후회였다.",
      evidence: longestRouteEntry?.observerTag?.label
        ? `${longestRouteEntry.observerTag.label}: ${longestRouteEntry.spokenChoice || longestRouteEntry.choice}`
        : longestRouteEntry ? `"${longestRouteEntry.spokenChoice || longestRouteEntry.choice}"` : decisionFingerprint.modeTitle,
      copy: `가장 오래 남은 판단은 ${decisionFingerprint.modeTitle} 프로필과 겹친다. 계속 비용을 다시 계산하라고 말한 목소리는 관찰자가 아니라 이전 기록이었다.`,
    },
    {
      label: "확인",
      title: "보고서는 결말이 아니라 다음 참가자의 사건 설계도였다.",
      evidence: branchRouteEntry?.freeText || taggedRouteEntry?.observerTag?.text || `${observationLabels[dominantObservation[0]]} 관찰값이 가장 크게 남았다`,
      copy: `가장 크게 남은 관찰값은 ${observationLabels[dominantObservation[0]]}이다. 다음 참가자는 당신의 결말이 아니라, 당신이 망설인 방식으로 사건을 시작한다.`,
    },
  ];
  const currentEndingTwist = endingTwists[endingTwistIndex] ?? endingTwists[0];
  const witnessRecords = [
    firstRouteEntry && { id: "first", label: "처음 남긴 말", tag: firstRouteEntry.observerTag?.label, text: firstRouteEntry.spokenChoice || firstRouteEntry.choice },
    longestRouteEntry && { id: "longest", label: "가장 오래 붙잡은 말", tag: longestRouteEntry.observerTag?.label, text: longestRouteEntry.spokenChoice || longestRouteEntry.choice },
    branchRouteEntry && { id: "branch", label: "판을 흔든 말", tag: branchRouteEntry.observerTag?.label, text: branchRouteEntry.freeText || branchRouteEntry.spokenChoice || branchRouteEntry.choice },
  ].filter(Boolean);
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
          <section className={`ending-sequence ending-step-${endingStep}`} aria-label="최종 엔딩 시퀀스">
            <h1 className="sr-only">Season complete</h1>
            <div className="ending-sequence-header">
              <span>SEASON 01 / FINAL RECORD</span>
              <strong>SEASON COMPLETE</strong>
            </div>
            {endingStep === 0 && (
              <div className="ending-beat">
                <span>RECORD {endingTwistIndex + 1} / 3 · {currentEndingTwist.label}</span>
                <blockquote>{finalChoiceText}</blockquote>
                <div className="ending-twist-card">
                  <h2>{currentEndingTwist.title}</h2>
                  <p>{currentEndingTwist.copy}</p>
                  <small>{currentEndingTwist.evidence}</small>
                </div>
                {witnessRecords.length > 0 && (
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
                <div className="ending-archive-blueprint" aria-label="다음 참가자에게 넘어갈 사건 설계도">
                  <span>{observerEndingRecord.label}</span>
                  <strong>{observerEndingRecord.title}</strong>
                  <p>{observerEndingRecord.text}</p>
                </div>
                <button type="button" data-testid="ending-next" onClick={advanceEndingStep}>다음</button>
              </div>
            )}
            {endingStep === 1 && (
              <div className="ending-beat ending-quiet-beat" aria-live="polite">
                <p className="ending-quiet-line">{endingQuietLine || "..."}</p>
                {endingQuietReady ? (
                  <button type="button" data-testid="ending-next" onClick={advanceEndingStep}>다음</button>
                ) : (
                  <button type="button" className="ending-quiet-skip" onClick={skipEndingQuietHold}>
                    이 화면 건너뛰기
                  </button>
                )}
              </div>
            )}
            {endingStep === 2 && (
              <form className="ending-beat ending-message-beat" onSubmit={(event) => { event.preventDefault(); saveNextParticipantMessage(); }}>
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
                <strong>{unopenedRecordCount}개의 기록이 아직 열리지 않았다.</strong>
                <small>단서 {unopenedClueCount}개 · 밟지 않은 갈래 {unopenedBranchCount}개</small>
                <small>다음 참가자는 이 빈칸을 이어받습니다.</small>
                <p>이제 기록 열람을 시작할 수 있습니다.</p>
              </div>
            )}
          </section>
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
              <strong>{sessionCode}</strong>
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
                  <button
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
                  </button>
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
                    </div>
                    <strong>{entry.title}</strong>
                    <p>{entry.freeText || entry.spokenChoice || entry.choice}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
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
              <button
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
              </button>
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
                    {Object.entries(entry.effect ?? {}).map(([key, value]) => (
                      <span key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
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
