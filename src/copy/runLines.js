import { localizeTables } from "../locale.js";

/**
 * Lines the runtime writes as a run is played, read by key so another
 * language can be laid over them (src/locale.js, 다국어 틀): the two cards the
 * runtime deals itself (GameRuntime.jsx), the line the table records for a
 * bust a restore rolled back (gauntlet/gauntletEngine.js), the line above the
 * briefing (viewModels/sceneBridge.js) and under a case's first scene
 * (state/caseRoutes.js), the minutes of a scene a bust skipped
 * (components/SceneMinutes.jsx), the report's route markers and the save's
 * own lines (state/savedState.js), and what a committed card says
 * (state/useChoiceCommit.js). The Korean is those modules' own, moved here
 * unchanged. A line written into the save or the run's log is written in the
 * page's language then and stays as it was written.
 */
const runLines = {
  // The runtime's own cards. The Korean label is what the observer reads of
  // the card on every page (`sourceLabel`, as src/locales/overlay.js keeps it).
  cards: {
    adaptive: "앞서 다시 짠 판을 공개 기준으로 삼는다",
    relationship: "관계의 증언을 먼저 확보한다",
  },
  tableRecordCarry: "복구 전에 벽에 닿은 판",
  bridge: {
    scene: "지난 장면에서 — {echo}",
    case: "지난 사건에서 — {title}",
  },
  caseEcho: "{echo} 지난 사건: '{title}'",
  minutes: {
    summary: "회의록 · 「{title}」",
    question: "질문 · {question}",
    absent: "당신은 이 자리에 없었다. 낸 카드 없음.",
  },
  routeMarkers: {
    memory: "이전 선택 귀환",
    turnaround: "단서 역전",
    system: "판 다시 짜기",
    branch: "분기 시작",
    aftermath: "후폭풍",
    reaction: "즉시 반응",
    evidence: "증거 추적",
    decision: "핵심 판단",
  },
  repaired: "이전 버전에서 저장한 판 기록을 지금 형식으로 고쳐서 불러왔습니다.",
  replayEcho: "재현 링크로 복원된 장면입니다.",
  commit: {
    cloudConflict: "온라인 저장이 멈췄습니다. 이 기기에는 저장됩니다. 시작 화면의 '다른 기기에서 이어하기'에서 확인해 주세요.",
    focus: "LOCK {charge} · 배율 ×{pot} · 자원 ×{resource}",
    evidenceBonus: "숨은 단서를 확보했다.",
    reframeEcho: "{echo} 다음 장면은 당신이 다시 짠 판을 기준으로 이어집니다.",
    resultTitle: "결과 화면",
  },
  // The remote-storage line after a case closes (useChoiceCommit) and after a
  // pass over the queue (useTelemetryQueue), and the feedback form's (useFeedback).
  remote: {
    unset: "원격 저장 미설정. 이 사건 로그는 로컬과 JSON 내보내기에만 남습니다.",
    noConsent: "데이터 제공 동의가 없어 원격 저장을 건너뛰었습니다.",
    unsendable: "이 사건 로그는 보낼 수 없는 형식이라 원격 저장하지 않습니다. 기록은 이 기기와 JSON 내보내기에 남아 있습니다.",
    queued: "사건 로그를 보관했습니다. 연결되는 대로 원격 저장합니다.",
    unranked:
      "이 회차는 온라인 시즌 랭킹에 오르지 않습니다. 서버에 이 회차의 사건 기록이 모두 있지는 않습니다(데이터 제공 동의 전에 마친 사건이 있거나, 서버가 받지 않은 기록이 있습니다). 이 기기의 순위 기록과 JSON 내보내기에는 남아 있습니다.",
    beatTable:
      "지금 판 규칙이 생기기 전에 마친 사건이 있어, 이 회차는 온라인 시즌 랭킹에 오르지 않습니다. 이 기기의 순위 기록과 JSON 내보내기에는 남아 있습니다.",
    queueCommitFailed: "원격 저장 응답을 받았지만 브라우저 저장본 갱신에 실패했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.",
    refused: "서버가 받지 않은 기록 {count}건은 대기열에서 뺐습니다. 기록은 이 기기와 JSON 내보내기에 남아 있습니다.",
    left: "원격 저장 {count}건이 아직 실패 상태입니다. 잠시 후 다시 시도하세요.",
    done: "원격 저장을 모두 완료했습니다.",
    queueSaveFailed: "원격 저장 대기열을 저장하지 못했습니다. 브라우저 저장본을 확인해 주세요.",
    sending: "원격 저장 {count}건을 전송하는 중입니다.",
  },
  feedback: {
    privacy: "식별 정보로 보일 수 있는 표현을 익명화한 뒤 저장해 주세요.",
    localNoConsent: "로컬에 저장했습니다. 데이터 제공 동의가 없어 원격 저장은 건너뛰었습니다.",
    localUnset: "로컬에 저장했습니다. 원격 저장 미설정 상태라 원격 저장은 건너뛰었습니다.",
    saved: "피드백을 저장했습니다.",
    queued: "로컬에는 저장했습니다. 원격 저장 실패분은 대기열에 보관했습니다.",
  },
  // The notice after a crash was recovered (components/RecoveryNotice.jsx).
  recovery: {
    badge: "복구됨",
    guidance: "같은 지점에서 오류가 반복되면 다시 시도하지 말고, 저장 지점을 일시정지한 뒤 새 게임 또는 복구 슬롯을 선택하세요.",
    pause: "저장 지점 일시정지",
    startFresh: "새 게임으로 시작",
    errorLog: "에러 로그",
    close: "닫기",
  },
  // The recovery center the notice opens (components/ErrorLogPanel.jsx): a
  // player reaches it after a crash, so it is in the page's language too.
  recoveryCenter: {
    label: "로컬 에러 로그",
    title: "최근 오류 기록",
    copyTrace: "기록 복사",
    saveDiagnostics: "진단 파일 저장",
    refresh: "새로고침",
    clear: "로그 비우기",
    close: "닫기",
    health: "원격 로그 읽기 점검",
    healthStatus: { ok: "정상", checking: "확인 중", disabled: "비활성", offline: "오프라인", other: "확인 필요" },
    emptyErrors: "저장된 오류 기록이 없습니다.",
    entryCounts: "로그 {count}개 · 마지막 선택 {choice}",
    none: "없음",
    replayEcho: "에러 로그 재현 진입입니다. 저장된 지점의 장면 흐름을 다시 확인합니다.",
    replay: "재현",
    details: "상세",
    slotsLabel: "복구 슬롯",
    slotsTitle: "최근 복구 지점",
    backupTitle: "읽지 못한 저장본",
    backupText: "이 버전이 읽지 못해 따로 보관한 저장본입니다.",
    backupRead: "다시 읽기",
    emptySlots: "저장된 복구 슬롯이 없습니다.",
    slotDone: "완료 {count}",
    restore: "복원",
    remove: "삭제",
  },
  // The flash on the session code's copy button (state/useClipboardStatus.js).
  copyStatus: {
    copied: "복사됨",
    failed: "복사 실패",
  },
  // A row of the remote-save queue, as the report lists it while it waits
  // (useChoiceCommit, useFeedback): written into the save in the page's language.
  queue: {
    case: "{case} 사건 로그",
    feedback: "{case} 피드백",
  },
};
export default runLines;

/** The Korean card labels, kept before any language is laid over: what the observer reads of a runtime card on every page. */
export const SOURCE_CARD_LABELS = { ...runLines.cards };

localizeTables("screens", { runLines });
