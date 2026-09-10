import { Info } from "lucide-react";
import { GameMetricsDrawer } from "./GameMetricsDrawer.jsx";
import { GuardedButton } from "./GuardedButton.jsx";
import { MemoPanel } from "./MemoPanel.jsx";
import { PressureLedger } from "./PressureLedger.jsx";
import { CASE_SEQUENCE } from "../gameData.js";

/**
 * Everything that is not the scene or the choice.
 *
 * The play screen used to stack these as twenty-odd standing panels, so a
 * single decision measured 3,953px on a 390x844 phone -- 4.7 screens for one
 * choice, forty-two times a run. They are all still here, and still keyed by
 * the same class names so the stylesheet did not have to move with them; they
 * are behind one door instead of in front of the decision.
 *
 * Three duplications were dropped rather than moved. The analyst's identity and
 * authority was written three times (`operator-bridge`, `operator-identity-strip`
 * and the chapter console); the scene's question was printed by both the story
 * turn panel and the choice heading; and the status board repeated the speaker,
 * the triggers and the progress the scene, the mission strip and the header
 * already carry.
 */
export function RecordRoom({ view }) {
  const {
    simplifyPlayerText,
    currentCase,
    node,
    caseObjectives,
    openingLegacy,
    operatorBriefs,
    chapterRules,
    operatorProfile,
    authorityState = { level: "OBSERVER", permissions: [], locked: "권한 정보 없음" },
    relationshipScores = [],
    relationshipQuest,
    relationshipGraph = [],
    relationshipScene,
    chapterUiModel,
    chapterTransitionBridge,
    interlude,
    midBoss,
    pastRunMemory,
    operatorReveal,
    autonomousSignal,
    timelineStamp,
    characterState,
    characterMemory,
    rivalResponse,
    rivalIntervention,
    counterRival,
    delayedConsequences = [],
    resourceChain,
    balanceSignals = [],
    evidenceMetadata = [],
    evidenceContamination,
    evidenceRepairPuzzle,
    repairEvidence,
    evidenceCombinations = [],
    hypothesisConflict,
    hypothesisLockState,
    hypothesisActions = [],
    resolveHypothesisAction,
    investigationTargets = [],
    investigateTarget,
    selectedInvestigationOutcome,
    clueHypotheses = [],
    discoveredClues = [],
    resources,
    resourceMeta,
    riskPressure,
    riskTier,
    easyRiskLabels,
    pressureCascade,
    suspenseState,
    narrativeSpine,
    playGuideItems,
    playerName,
    activePlayStyle,
    turnBriefItems,
    sceneChallenge,
    activeCaseMeta,
    completedCases = [],
    log,
    progress,
    triggerLabels,
    protocolUsed,
    isAdvancing,
    activateCrisisProtocol,
    echo,
    probeUsed,
    echoProbeCost,
    requestEchoProbe,
    getEchoChecks,
    setMemoOpened,
  } = view;
  const operatorBrief = operatorBriefs?.[currentCase];
  const chapterRule = chapterRules?.[currentCase];

  return (
    <details className="record-room">
      <summary>
        <span>기록실</span>
        <b>목표 · 자원 전체 · 인물 · 단서 · 규칙</b>
      </summary>
      <div className="record-room-body">
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

        <section className="record-resource-table" aria-label="자원 전체">
          <div>
            {Object.entries(resourceMeta).map(([key, meta]) => (
              <article key={key}>
                <span>{meta.label}</span>
                <b>{resources[key] ?? 0}</b>
              </article>
            ))}
          </div>
          <p className={`resource-rail-risk ${riskTier.toLowerCase()}`}>
            <span>위험 압력</span>
            <b>{riskPressure}</b>
            <small>{easyRiskLabels[riskTier] ?? riskTier}</small>
          </p>
        </section>

        <div className="analyst-card">
          <span>분석관</span>
          <strong>{playerName}</strong>
          <small>{activePlayStyle.label} · {activePlayStyle.title}</small>
        </div>

        <details className="insight-drawer status-drawer turn-brief">
          <summary>
            <span>이번 턴 브리프</span>
            <b>{sceneChallenge.title}</b>
          </summary>
          <div>
            {turnBriefItems.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <b>{item.value}</b>
              </article>
            ))}
          </div>
          <p>{sceneChallenge.text}</p>
        </details>

        <details className="insight-drawer status-drawer">
          <summary>
            <span>시즌 아크</span>
            <b>사건 배경</b>
          </summary>
          <p className="status-note">{activeCaseMeta?.label}은 {activeCaseMeta?.summary}</p>
          <p className="status-note">
            완료 {completedCases.length}개 케이스와 현재 로그 {log.length}개가 다음 사건의 압박 조건으로 누적됩니다.
          </p>
        </details>

        {chapterUiModel && (
          <section className="chapter-dashboard" style={{ "--chapter-accent": chapterUiModel.accent }} aria-label="챕터 전용 운영판">
            <div><span>{chapterUiModel.label}</span><strong>{chapterUiModel.title}</strong></div>
            <div className="chapter-dashboard-metrics">
              {chapterUiModel.metrics.map((metric) => <b key={metric}>{metric}</b>)}
            </div>
            {relationshipQuest && (
              <p><strong>{relationshipQuest.title}</strong> · {relationshipQuest.goal} · {relationshipQuest.unlocked ? "QUEST CLEAR" : `PROGRESS ${relationshipQuest.progress}%`}</p>
            )}
          </section>
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

        <section className="story-turn-panel" data-testid="story-turn-panel" aria-label="story turn">
          <div className="story-turn-mark"><span>이야기 전환점</span><strong>!</strong></div>
          <div>
            <small>TURN {String(narrativeSpine.turn).padStart(2, "0")}</small>
            <h2>{node.title}</h2>
            <p>{narrativeSpine.consequence}</p>
          </div>
        </section>

        <MemoPanel memo={node.memo} onOpen={(event) => event.currentTarget.open && setMemoOpened(true)} />

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
              {getEchoChecks(node).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </details>
        </details>

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

        {operatorProfile && (
          <section className="operator-identity-strip" aria-label="주인공 정체성과 현재 권한">
            <div>
              <span>{operatorProfile.label}</span>
              <strong>{operatorProfile.title}</strong>
            </div>
            <p>{operatorProfile.authority}</p>
            <div className="authority-permission-list">
              <b>{authorityState.level}</b>
              {(authorityState.permissions ?? []).map((permission) => <span key={permission}>{permission}</span>)}
            </div>
            <small className="authority-origin-permission">출신 권한: {(authorityState.origin?.originPermissions ?? []).join(" · ")}</small>
          </section>
        )}

        {operatorBrief && (
          <section className="chapter-console" aria-label="현재 챕터 작전 브리프">
            <div className="chapter-console-topline">
              <span>OPERATOR BRIEF / LIVE AUTHORITY</span>
              <b>당신의 결정은 현장을 바꾸지만, 모든 권한을 갖지는 않습니다</b>
            </div>
            <div className="chapter-console-main">
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
              <GuardedButton type="button" onClick={activateCrisisProtocol} blocked={protocolUsed || riskPressure < 60 || isAdvancing}>
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

        {delayedConsequences.length > 0 && (
          <section className="delayed-consequence-strip" aria-label="지연된 결과">
            <span>DELAYED CONSEQUENCE</span>
            <p>{delayedConsequences.at(-1).text}</p>
          </section>
        )}
        {interlude && openingLegacy && (
          <section className="interlude-panel" aria-label="챕터 전환 장면">
            <span>{interlude.label}</span>
            <strong>{interlude.title}</strong>
            <p>{interlude.text}</p>
          </section>
        )}
        {relationshipScene && (
          <section className="relationship-scene-panel" aria-label="관계 전용 장면">
            <span>{relationshipScene.title}</span>
            <p>{relationshipScene.text}</p>
            <strong>{relationshipScene.action}</strong>
          </section>
        )}
        {pastRunMemory && (
          <section className="past-run-memory" aria-label="이전 플레이 기록">
            <span>{pastRunMemory.label}</span>
            <p>{pastRunMemory.text}</p>
          </section>
        )}
        {chapterTransitionBridge && (
          <section className="chapter-transition-bridge" aria-label="챕터 이동 기록">
            <span>{chapterTransitionBridge.label}</span>
            <strong>{chapterTransitionBridge.title}</strong>
            <p>{chapterTransitionBridge.text}</p>
          </section>
        )}
        {operatorReveal && (
          <section className="operator-reveal-panel" aria-label="주인공 기록 공개">
            <span>{operatorReveal.title}</span>
            <p>{operatorReveal.text}</p>
          </section>
        )}
        {relationshipGraph.length > 0 && (
          <section className="relationship-graph-panel" aria-label="인물 관계 그래프">
            <span>RELATION MAP</span>
            <div>{relationshipGraph.filter((item) => item.value > 0).map((item) => <article key={item.name}><b>{item.name}</b><i><em style={{ width: `${item.value}%` }} /></i><small>{item.state}</small></article>)}</div>
          </section>
        )}
        {autonomousSignal && (
          <section className="autonomous-signal-panel" aria-label="인물 자율 행동">
            <span>WORLD MOVEMENT · {timelineStamp}</span>
            <p>{autonomousSignal.text}</p>
          </section>
        )}
        {evidenceMetadata.length > 0 && (
          <section className="evidence-source-panel" aria-label="단서 출처와 신뢰도">
            <span>EVIDENCE SOURCES</span>
            <div>{evidenceMetadata.slice(-4).map((item) => <article key={item.id}><b>{item.title}</b><small>{item.sourceType} · {item.reliability}%</small></article>)}</div>
          </section>
        )}
        {hypothesisConflict && <p className="hypothesis-conflict" role="alert"><strong>{hypothesisConflict.title}</strong> {hypothesisConflict.text}</p>}
        {resourceChain && <p className={`resource-chain-signal ${resourceChain.tone}`} role="status"><strong>RESOURCE CHAIN</strong> {resourceChain.text}</p>}
        {characterMemory && <p className="character-memory" role="status"><strong>MEMORY TRACE</strong> {characterMemory.text}</p>}
        {characterState && <p className="character-state-signal" role="status"><strong>CHARACTER STATE</strong> {characterState.speaker}: {characterState.stance} / TRUST {characterState.trust} / PRESSURE {characterState.pressure}</p>}
        {rivalResponse && <p className="rival-response-signal" role="status">{rivalResponse.response}</p>}
        {midBoss && <section className="mid-boss-panel" aria-label="챕터 반박 장면"><span>{midBoss.title}</span><p>{midBoss.text}</p></section>}
        {investigationTargets.length > 0 && (
          <section className="investigation-panel" aria-label="조사 대상 선택">
            <span>ACTIVE INVESTIGATION</span>
            <div>{investigationTargets.map((target) => <GuardedButton type="button" key={target.id} blocked={target.locked} className={selectedInvestigationOutcome?.id === target.id ? "selected" : ""} onClick={() => investigateTarget(target)}><b>{target.label}</b><small>{target.locked ? "권한 잠김" : "조사 시작"}</small></GuardedButton>)}</div>
            {selectedInvestigationOutcome && <p>{selectedInvestigationOutcome.outcome}{selectedInvestigationOutcome.contaminated ? " 단, 이 기록에는 오염 가능성이 있습니다." : ""}</p>}
          </section>
        )}
        {evidenceRepairPuzzle && (
          <section className={`evidence-repair-panel ${evidenceRepairPuzzle.repaired ? "repaired" : ""}`} aria-label="증거 원본 복구">
            <span>{evidenceRepairPuzzle.title}</span>
            <p>{evidenceRepairPuzzle.prompt}</p>
            <small>{evidenceRepairPuzzle.source.join(" / ")}</small>
            {!evidenceRepairPuzzle.repaired && <button type="button" onClick={repairEvidence}>원본 복구</button>}
          </section>
        )}
        {rivalIntervention?.active && (
          <section className="rival-intervention-panel" aria-label="라이벌 개입">
            <span>{rivalIntervention.title}</span>
            <p>{rivalIntervention.text}</p>
            <div>{rivalIntervention.options.map((option) => <button type="button" key={option.id} onClick={() => counterRival(option)}>{option.label}</button>)}</div>
          </section>
        )}
        {evidenceContamination && <p className="evidence-contamination" role="alert"><strong>EVIDENCE CONTAMINATION</strong> {evidenceContamination.text}</p>}
        {evidenceCombinations.length > 0 && (
          <section className="evidence-combination-panel" aria-label="조합된 증거">
            <span>CROSS-REFERENCE</span>
            {evidenceCombinations.map((item) => <article key={item.id}><strong>{item.title}</strong><p>{item.text}</p></article>)}
          </section>
        )}
        {hypothesisActions.length > 0 && (
          <section className="hypothesis-actions-panel" aria-label="가설 처리">
            <span>HYPOTHESIS CONTROL</span>
            <div>{hypothesisActions.map((action) => <button type="button" key={action.id} onClick={() => resolveHypothesisAction(action)}><b>{action.label}</b><small>{action.text}</small></button>)}</div>
          </section>
        )}
        {hypothesisLockState && <p className="hypothesis-lock-signal" role="status"><strong>{hypothesisLockState.label}</strong> {hypothesisLockState.text}</p>}
        {balanceSignals.length > 0 && (
          <p className="balance-signal" role="status">{balanceSignals[0].signal}: {balanceSignals[0].share}%의 기록이 같은 선택에 집중되어 있습니다. 다른 경로를 확인해 보세요.</p>
        )}

        <GameMetricsDrawer view={view} />

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
        <PressureLedger log={log} showLive />
        <p className="record-room-progress">진행률 {progress}% · 선택 {log.length}개 기록됨</p>
      </div>
    </details>
  );
}
