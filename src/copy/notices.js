import { localizeTables } from "../locale.js";

/**
 * What a run in play asks and says about itself (GameRuntime.jsx,
 * state/runLifecycle.js, state/useAppPersistence.js): the questions
 * `confirmAction` puts, the save line and the remote-storage status, read by
 * key so another language can be laid over them (src/locale.js, 다국어 틀).
 * The Korean is the screens' own, moved here unchanged. The shell's question
 * and crash screen are src/copy/confirm.js.
 */
const noticesCopy = {
  confirm: {
    // GameRuntime's openCase: the case that just closed, opened again from its report.
    replayCase: "이 사건을 처음부터 다시 시작할까요? 방금 끝낸 판의 선택 기록은 지워지고, 다시 하는 판은 연습으로 세어 금고는 그대로입니다. 이 사건의 결과 요약은 새 판을 끝내면 그 판의 것으로 바뀝니다.",
    // runLifecycle's resetRun (초기화).
    reset: "저장된 진행, 순위 기록, 복구 지점, 오류 기록을 모두 지울까요? 화면과 소리 설정, 도구 도감, NEW GAME+ 기록과 회차, 게시판 이름, 이어하기 코드와 온라인에 올린 저장은 남습니다. 온라인 저장은 새 진행을 올리기 전에 시작 화면에서 어느 쪽을 남길지 묻습니다.",
    startFresh: "저장된 진행을 지우고 새 게임으로 시작할까요? 복구 슬롯과 오류 기록은 남습니다.",
    restoreSlot: "이 복구 지점으로 되돌릴까요? 그 뒤의 이야기 진행은 사라집니다.",
    deleteSlot: "이 복구 지점을 지울까요? 지운 뒤에는 되돌릴 수 없습니다.",
    clearErrorLog: "오류 기록을 모두 지울까요?",
    restoreBackup: "읽지 못했던 저장본을 다시 읽어 지금 진행 대신 불러올까요?",
  },
  telemetry: {
    offline: "오프라인. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
    remoteReady: "원격 저장 준비됨. 데이터 제공 동의 시 사건 완료 로그가 저장됩니다.",
    backOnline: "네트워크 연결됨. 데이터 제공 동의 시 사건 완료 로그가 저장됩니다.",
    local: "로컬 저장. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
  },
  save: {
    saved: "저장됨 {time}",
    held: "판을 그대로 보관했습니다 {time}",
    unavailable: "브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.",
    stale: "다른 탭에서 이 진행이 더 앞서 있어 이 탭의 진행은 기록하지 않았습니다. 새로고침하면 최신 진행을 불러옵니다.",
    replay: "재현 링크로 연 장면이라 진행을 기록하지 않습니다. 내 저장은 그대로 남아 있습니다.",
    restoreNeedsCases: "사건 자료를 다 받지 못해 되돌리지 않았습니다. 연결을 확인하고 다시 눌러 주세요. 저장은 그대로 있습니다.",
    clearFailed: "저장본을 초기화하지 못했습니다.",
    errorLogClearFailed: "오류 기록을 지우지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.",
    slotDeleteFailed: "복구 지점을 지우지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.",
    slotDamaged: "이 복구 슬롯은 손상되어 불러올 수 없습니다. 다른 슬롯을 고르세요.",
    slotRestoreFailed: "복구 지점을 불러오지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.",
    backupUnreadable: "보관한 저장본은 이 버전에서도 읽을 수 없습니다. 지우지 않고 그대로 둡니다.",
    backupRestoreFailed: "보관한 저장본을 불러오지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.",
    // useTelemetryQueue's commitPendingTelemetryQueue, when the queue's change cannot be written.
    queueUnavailable: "브라우저 저장소를 사용할 수 없어 원격 저장 대기열 변경을 반영하지 못했습니다.",
  },
  run: {
    settling: "판정이 끝나는 중입니다. 결과가 나온 뒤에 나갈 수 있습니다.",
    newGamePlus: "NEW GAME+로 시작합니다. 지난 시즌의 기록은 시작 화면에 남아 있습니다.",
    caseOffline: "연결이 끊겨 이 사건을 받지 못했습니다. 연결을 확인한 뒤 다시 눌러 주세요. 저장은 그대로 있습니다.",
    caseUnavailable: "이 사건을 받지 못했습니다. 다시 눌러 보고, 계속 안 되면 새로고침해 주세요. 저장은 그대로 있습니다.",
    paused: "현재 지점을 일시정지했습니다.",
    directEntry: "디버그 진입입니다. 이 장면부터 선택 흐름을 재현합니다.",
  },
  storage: {
    cleaned: "브라우저 저장소 정리를 완료했습니다.",
    retryFailed: "저장소 정리 재시도 실패: {keys}{logFailed}",
    resetFailed: "일부 브라우저 저장소를 지우지 못했습니다: {keys}{logFailed}",
    logFailed: " · 진단 로그 저장도 실패했습니다.",
    // The button under the lines STORAGE_RETRY_LINES names (SaveStatus.jsx).
    retry: "저장소 정리 재시도",
  },
  // The screen reader's line for the page (GameRuntime's screenReaderStatus).
  status: {
    currentCase: "현재 사건",
    result: "{caseLabel} 결과 화면입니다. 랭크 {rank}, 버스트 {score}점, 주요 트리거는 {trigger}입니다.",
    scene: "{caseLabel} {title} 장면입니다. 진행률 {progress}퍼센트, 챌린지는 {challenge}, 위험 압력은 {riskTier} {riskPressure}입니다.",
  },
};
export default noticesCopy;

/**
 * The save lines that offer 「저장소 정리 재시도」 under them (SaveStatus.jsx),
 * by key. Until 10-26 the button came when the line had "저장소" in it, and
 * the English lines have no such word, so the English page never showed it.
 * These are the keys whose Korean line has it, so the Korean page shows the
 * button where it did; a line with blanks is known by the text before its
 * first blank.
 */
const STORAGE_RETRY_LINES = [
  ["save", "unavailable"],
  ["save", "queueUnavailable"],
  ["save", "errorLogClearFailed"],
  ["save", "slotDeleteFailed"],
  ["save", "slotRestoreFailed"],
  ["save", "backupRestoreFailed"],
  ["storage", "cleaned"],
  ["storage", "retryFailed"],
  ["storage", "resetFailed"],
];

/** Whether the save line on screen is one of STORAGE_RETRY_LINES, read in the page's language. */
export function offersStorageRetry(status) {
  if (typeof status !== "string" || !status) return false;
  return STORAGE_RETRY_LINES.some(([group, key]) => {
    const line = noticesCopy[group][key];
    const blank = line.indexOf("{");
    return blank < 0 ? status === line : status.startsWith(line.slice(0, blank));
  });
}

localizeTables("screens", { notices: noticesCopy });
