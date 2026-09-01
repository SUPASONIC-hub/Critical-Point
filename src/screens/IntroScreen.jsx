import React from "react";
import { AlertTriangle, ChevronRight, Info, LockKeyhole, Sparkles, Trophy } from "lucide-react";

export function IntroScreen({ view }) {
  const { AdaptiveMusic, musicModeKey, renderRecoveryNotice, renderErrorLogPanel, renderSaveStatus, setShowRanking, GAME_TITLE, simplifyPlayerText, activeCaseMeta, nextParticipantMessage, GAME_SUBTITLE, playStyleOptions, playStyle, setPlayStyle, persist, seasonCasesBase, caseObjectives, triggerLabSignals, hasResumableSave, node, formatSaveTime, lastSavedAt, log, progress, playerName, PLAYER_NAME_MAX_LENGTH, setPlayerName, limitText, startGame, dataConsent, setDataConsent, pendingTelemetryRef, setTelemetryStatus, telemetryEnabled, isOnline, telemetrySummary, sessionCode, debugToolsEnabled, showErrorLog, setShowErrorLog, unlockAllCasesForTest, debugCaseSelectRef, debugCaseId, debugCaseIdRef, debugNodeOptions, debugNodeId, debugNodeIdRef, debugNodeSelectRef, caseSequence, nodes, setDebugCaseId, setDebugNodeId, startDebugNode, playGuideItems, completedCaseResultList, seasonJourney, resourceMeta, seasonCases, caseResults, completedCases, currentCase, startCase, getCaseStatusText, resumeSavedGame, activePlayStyle, setPendingTelemetry, setSaveStatus, nodeOrders, normalizeCaseSummary } = view;
  const Music = AdaptiveMusic;
  const onShowRanking = view.setShowRanking;
  const gameTitle = GAME_TITLE;
  return (
      <main className="shell intro-shell">
        <Music modeKey={musicModeKey} />
        {renderRecoveryNotice()}
        {renderErrorLogPanel()}
        {renderSaveStatus()}
        <section className="intro">
          <div className="brand-row">
            <span className="brand-mark">{gameTitle}</span>
            <div className="top-actions">
              <button className="ghost intro-ranking-button" type="button" onClick={() => onShowRanking(true)}>
                <Trophy size={16} />
                랭킹
              </button>
              {debugToolsEnabled && (
                <button
                  className="ghost intro-ranking-button"
                  type="button"
                  data-testid="open-error-log-from-header"
                  aria-expanded={showErrorLog}
                  aria-controls={showErrorLog ? "error-log-panel" : undefined}
                  onClick={() => setShowErrorLog(true)}
                >
                  <AlertTriangle size={16} />
                  에러 로그
                </button>
              )}
              <span className="case-chip">임계점 / {simplifyPlayerText(activeCaseMeta?.title ?? gameTitle)}</span>
            </div>
          </div>
          <h1>{gameTitle}</h1>
          {nextParticipantMessage && (
            <p className="previous-participant-message">이전 참가자가 남긴 말: “{nextParticipantMessage}”</p>
          )}
          <strong className="intro-kicker">{GAME_SUBTITLE}</strong>
          <div className="creator-badge">
            <img src="/profile.jpg" alt="" />
            <span>Created by SUPASONIC</span>
          </div>
          <figure className="intro-visual">
            <picture>
              <source srcSet="/triggerlab-key-visual.webp" type="image/webp" />
              <img
                src="/triggerlab-key-visual.png"
                alt="트리거랩 작전실에서 사건 지도를 분석하는 라이트노벨풍 일러스트"
                width="1792"
                height="1024"
                fetchPriority="high"
              />
            </picture>
            <figcaption>
              <span>TRIGGERLAB NIGHT SHIFT</span>
              <b>선택지는 사건을 끝내지 않는다. 다음 압박의 모양을 바꾼다.</b>
            </figcaption>
          </figure>
          <p>
            트리거랩의 신입 분석관이 되어 현재 한국의 기업·조직 위기를 검토합니다.
            사건은 훈련처럼 시작되지만, 당신이 오래 붙잡은 조건은 다음 사건의 압력이 됩니다.
          </p>
          <div className="season-panel">
            <div>
              <span>SEASON 1</span>
              <strong>사고를 깨우는 조건은 조종 가능한 조건이기도 하다.</strong>
            </div>
            <p>
              처음에는 내 판단이 깊어지는 순간을 찾습니다. 마지막에는 누군가 그 순간을
              설계할 수 있다면, 나는 여전히 자유로운지 묻게 됩니다.
            </p>
          </div>
          <section className="intro-brief" aria-label="첫 케이스 브리핑">
            <article>
              <span>첫 사건</span>
              <b>{seasonCasesBase[0].title}</b>
              <p>{caseObjectives.case01}</p>
            </article>
            <article>
              <span>관찰 항목</span>
              <b>손실 배분 순서</b>
              <p>{triggerLabSignals.case01}</p>
            </article>
            <article>
              <span>다음 압박</span>
              <b>기록은 다음 사건으로 이동한다</b>
              <p>오래 붙잡은 조건이 CASE 02의 신뢰와 증거 충돌로 이어집니다.</p>
            </article>
          </section>
          <section className="play-style-panel" aria-label="플레이 스타일 선택">
            <div className="panel-title-row">
              <div>
                <span>ANALYST PROTOCOL</span>
                <h2>어떤 방식으로 판단할까요?</h2>
              </div>
              <small>선택한 프로토콜은 이번 시즌에 적용됩니다.</small>
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
                  <p>{style.text}</p>
                  <small>{style.payoff}</small>
                </button>
              ))}
            </div>
            <p className="play-style-note">현재 선택: {activePlayStyle.label} · {activePlayStyle.title}</p>
          </section>
          {view.tutorialSteps && (
            <section className="tutorial-path" aria-label="첫 플레이 안내">
              <span>FIRST RUN PROTOCOL</span>
              <div>{view.tutorialSteps.map((step) => <article key={step.id}><b>{step.label}</b><small>{step.text}</small></article>)}</div>
            </section>
          )}
          {view.playStyleUnlocks && (
            <p className="play-style-unlock"><strong>{view.playStyleUnlocks.label}</strong> · {view.playStyleUnlocks.unlock} · {view.playStyleUnlocks.newGamePlus}</p>
          )}
          {view.seasonGoals && (
            <section className="season-goal-strip" aria-label="시즌 목표">
              <span>SEASON GOALS</span>
              {view.seasonGoals.map((goal) => <article key={goal.id}><b>{goal.label}</b><small>{goal.text}</small></article>)}
            </section>
          )}
          <div className="start-panel">
            {hasResumableSave && (
              <div className="resume-panel">
                <div>
                  <span>저장된 진행</span>
                  <strong>{activeCaseMeta?.label ?? "현재 사건"} · {node.title}</strong>
                  <small>
                    {formatSaveTime(lastSavedAt)} 저장 · {log.length}개 판단 기록 · 진행률 {progress}%
                  </small>
                </div>
                <button type="button" data-testid="resume-save" onClick={resumeSavedGame}>
                  <ChevronRight size={18} />
                  이어하기
                </button>
              </div>
            )}
            <label htmlFor="playerName">분석관 이름</label>
            <div className="start-input-row">
              <input
                id="playerName"
                value={playerName}
                maxLength={PLAYER_NAME_MAX_LENGTH}
                onChange={(event) => setPlayerName(limitText(event.target.value, PLAYER_NAME_MAX_LENGTH))}
                onKeyDown={(event) => event.key === "Enter" && startGame()}
                placeholder="이름을 입력하세요"
              />
              <button type="button" onClick={startGame}>
                <ChevronRight size={18} />
                첫 케이스 시작
              </button>
            </div>
            {view.newGamePlusUnlocked && (
              <button type="button" className="new-game-plus-button" onClick={view.startNewGamePlus}>
                <Sparkles size={16} />
                NEW GAME+ 시작
              </button>
            )}
            <label className="consent-box">
              <input
                type="checkbox"
                checked={dataConsent}
                onChange={(event) => {
                  const nextConsent = event.target.checked;
                  if (!nextConsent) {
                    const previousQueue = pendingTelemetryRef.current;
                    const cleared = persist({ dataConsent: false, pendingTelemetry: [] });
                    if (!cleared.storageSaved) {
                      event.target.checked = true;
                      setDataConsent(true);
                      pendingTelemetryRef.current = previousQueue;
                      setPendingTelemetry(previousQueue);
                      setSaveStatus("동의 해제 내용을 브라우저 저장본에 반영하지 못했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.");
                      setTelemetryStatus({
                        tone: "error",
                        text: "동의 해제 내용을 브라우저 저장본에 반영하지 못했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.",
                      });
                      return;
                    }
                    setDataConsent(false);
                    pendingTelemetryRef.current = [];
                    setPendingTelemetry([]);
                    setTelemetryStatus({
                      tone: "local",
                      text: "데이터 제공 동의를 해제했습니다. 미전송 원격 대기열도 삭제했습니다.",
                    });
                    return;
                  }
                  const savedConsent = persist({ dataConsent: true });
                  if (!savedConsent.storageSaved) {
                    event.target.checked = false;
                    setSaveStatus("데이터 제공 동의를 브라우저 저장본에 반영하지 못했습니다.");
                    setTelemetryStatus({
                      tone: "error",
                      text: "데이터 제공 동의를 브라우저 저장본에 반영하지 못했습니다.",
                    });
                    return;
                  }
                  setDataConsent(true);
                }}
              />
              <span>
                <b>플레이테스트 데이터 제공 동의</b>
                <small>
                  {telemetryEnabled
                    ? "케이스 결과, 선택 로그, 응답 시간, 자유입력 내용이 연구용으로 저장됩니다. 이름은 원격 저장하지 않습니다."
                    : "현재 배포 환경에는 원격 저장이 설정되어 있지 않습니다."}
                </small>
                <small className={telemetryEnabled ? "data-status ready" : "data-status local"}>
                  {!isOnline ? "오프라인" : telemetryEnabled ? "원격 저장 준비됨" : "로컬 저장"}
                </small>
              </span>
            </label>
            <div className={`db-status-panel ${telemetrySummary.tone}`}>
              <div>
                <span>저장 상태</span>
                <strong>{telemetrySummary.title}</strong>
              </div>
              <p>{telemetrySummary.text}</p>
              <small>세션 코드 {sessionCode}</small>
            </div>
            <div className="privacy-note">
              <b>데이터 안내</b>
              <p>
                이름은 원격 저장하지 않습니다. 자유입력과 피드백에는 실명, 연락처,
                회사명처럼 개인이나 조직을 식별할 수 있는 정보는 쓰지 마세요. 삭제 요청은
                결과 화면의 8자리 세션 코드로 처리합니다.
              </p>
            </div>
            {debugToolsEnabled && (
              <button type="button" data-testid="unlock-all-cases" className="test-unlock" onClick={unlockAllCasesForTest}>
                테스트용 전체 케이스 열기
              </button>
            )}
            {debugToolsEnabled && (
            <div className="debug-jump-panel" aria-label="개발용 장면 바로 시작">
              <div>
                <span>DEBUG JUMP</span>
                <strong>특정 장면 바로 시작</strong>
              </div>
              <div className="debug-jump-controls">
                <select
                  ref={debugCaseSelectRef}
                  data-testid="debug-case-select"
                  value={debugCaseId}
                  onChange={(event) => {
                    const nextCaseId = event.target.value;
                    const nextNodeOptions = nodeOrders[nextCaseId] ?? [];
                    debugCaseIdRef.current = nextCaseId;
                    debugNodeIdRef.current = nextNodeOptions[0] ?? "start";
                    setDebugCaseId(nextCaseId);
                    setDebugNodeId(nextNodeOptions[0] ?? "start");
                  }}
                  aria-label="디버그 케이스 선택"
                >
                  {caseSequence.map((caseId) => (
                    <option key={caseId} value={caseId}>
                      {seasonCasesBase.find((caseItem) => caseItem.id === caseId)?.label ?? caseId}
                    </option>
                  ))}
                </select>
                <select
                  key={debugCaseId}
                  ref={debugNodeSelectRef}
                  data-testid="debug-node-select"
                  defaultValue={debugNodeId}
                  onChange={(event) => {
                    debugNodeIdRef.current = event.target.value;
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
          <section className="quick-guide" aria-label="처음 플레이 가이드">
            <div className="guide-heading">
              <Info size={16} />
              <span>처음 플레이할 때 보는 기준</span>
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
          {completedCaseResultList.length > 0 && (
            <section className="season-summary">
              <div>
                <span>SEASON LOG</span>
                <strong>완료한 케이스에서 반복적으로 활성화된 조건</strong>
              </div>
              <div className="season-summary-list">
                {completedCaseResultList.map((caseItem) => (
                  <article key={caseItem.id}>
                    <b>{caseItem.label}</b>
                    <span>{triggerLabels[caseItem.result.primary[0]]}</span>
                    <small>
                      RANK {caseItem.result.rank} · {caseItem.result.averageResponseTime}s · 자유입력{" "}
                      {caseItem.result.freeCount}
                    </small>
                  </article>
                ))}
              </div>
              <div className="season-journey" aria-label="사건 간 결말 연결">
                {seasonJourney.map((caseItem, index) => (
                  <React.Fragment key={caseItem.id}>
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
                          다음 사건 전달: {Object.entries(caseItem.carryover)
                            .map(([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`)
                            .join(" · ")}
                        </small>
                      )}
                    </article>
                  </React.Fragment>
                ))}
              </div>
            </section>
          )}
          <div className="roadmap-heading">
            <span>SEASON ROADMAP</span>
            <b>케이스는 완료한 판단 로그를 다음 압박으로 넘기며 순서대로 열립니다.</b>
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
              function openCaseFromCard() {
                if (canOpenCase) startCase(caseItem.id);
              }
              return (
                <button
                  type="button"
                  key={caseItem.id}
                  disabled={!canOpenCase}
                  aria-label={`${caseItem.label} ${caseItem.title}. ${getCaseStatusText(caseItem.status)}`}
                  className={
                    caseItem.status === "PLAYING" || caseItem.status === "OPEN"
                      ? "case-card active-case"
                      : caseItem.status === "COMPLETE"
                        ? "case-card complete-case"
                        : "case-card"
                  }
                  onClick={openCaseFromCard}
                >
                  <div>
                    <span>{caseItem.label}</span>
                    <small className="case-status-chip">
                      {caseItem.status === "LOCKED" && <LockKeyhole size={13} />}
                      {getCaseStatusText(caseItem.status)}
                    </small>
                  </div>
                  <h2>{simplifyPlayerText(caseItem.title)}</h2>
                  <b>{simplifyPlayerText(caseItem.trigger)}</b>
                  <p>{simplifyPlayerText(caseItem.summary)}</p>
                  {caseItem.status === "LOCKED" && (
                    <small className="case-lock-note">앞선 케이스의 판단 로그가 필요합니다.</small>
                  )}
                  {savedResult && (
                    <small className="case-result-mini">
                      RANK {savedResult.rank} · {triggerLabels[savedResult.primary[0]]} · {savedResult.averageResponseTime}s · 자유입력{" "}
                      {savedResult.freeCount}
                    </small>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </main>
);
}
