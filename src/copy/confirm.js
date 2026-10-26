import { localizeTables } from "../locale.js";

/**
 * The game's question and the crash screen, the two surfaces of the shell
 * (ConfirmDialog.jsx's 확인 / 취소, and App.jsx's error boundary with the one
 * question it asks): the words they print, read by key so another language can
 * be laid over them (src/locale.js, 다국어 틀). The Korean is the screen's own,
 * moved here unchanged. The questions and notices of a run in play are
 * src/copy/notices.js, in the runtime's chunk.
 */
const confirmCopy = {
  yes: "확인",
  no: "취소",
  error: {
    title: "장면을 불러오지 못했습니다.",
    text: "오류 지점은 자동 저장되었습니다. 수정 후 다시 열면 저장된 장면에서 이어서 진행할 수 있습니다.",
    startFresh: "저장본을 초기화하고 새 게임",
    retry: "저장된 지점에서 다시 시도",
    hint: "복구 슬롯과 오류 로그는 보존됩니다. 같은 지점에서 계속 실패하면 저장본을 초기화하고 새 게임으로 진입해 주세요.",
    // Printed twice: as the message the blocked reload sets, and as the standing note under the buttons.
    retryBlocked: "같은 저장 지점에서 오류가 반복되어 재시도를 중단했습니다.",
    deleteFailed: "현재 저장본을 삭제하지 못했습니다. 브라우저 저장소 권한을 확인한 뒤 다시 시도하세요.",
    confirmStartFresh: "저장된 진행을 지우고 새 게임으로 시작할까요? 복구 슬롯과 오류 기록은 남습니다.",
  },
};
export default confirmCopy;

localizeTables("screens", { confirm: confirmCopy });
