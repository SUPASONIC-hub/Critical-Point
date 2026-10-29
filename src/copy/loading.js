import { localizeTables } from "../locale.js";

/**
 * What a lazy screen shows while its file arrives, and the two panels when it
 * cannot (LazyScreen.jsx): the words they print, read by key so another
 * language can be laid over them (src/locale.js, 다국어 틀). The Korean is the
 * screen's own, moved here unchanged.
 */
const loadingCopy = {
  offline: {
    title: "연결이 끊겼습니다.",
    text: "이 화면의 파일을 받지 못했습니다. 저장된 진행은 그대로입니다. 연결을 확인한 뒤 다시 시도해 주세요.",
    retry: "다시 시도",
  },
  reload: {
    title: "화면을 다시 받아야 합니다.",
    // After the reason, which `chunkPanelFor` picks.
    kept: " 저장된 진행은 그대로입니다.",
    button: "새로고침",
    reasons: {
      reload: "게임이 새 버전으로 바뀌어 이 화면의 파일을 찾지 못했습니다.",
      "reload-offline": "게임이 새 버전으로 바뀌어 이 화면의 파일을 찾지 못했습니다. 연결이 없어도 새로고침하면 기기에 받아 둔 새 버전으로 열립니다.",
      "reload-retried": "이 화면의 파일을 다시 받지 못했습니다. 페이지를 새로 열어야 받을 수 있습니다.",
    },
  },
  status: "장면을 불러오는 중입니다.",
  progressLabel: "사건 불러오기",
  progress: "사건 {done}/{total}",
  slow: "연결이 느려 오래 걸리고 있습니다. 저장된 진행은 그대로입니다.",
  slowRetry: "다시 불러오기",
};
export default loadingCopy;

localizeTables("screens", { loading: loadingCopy });
