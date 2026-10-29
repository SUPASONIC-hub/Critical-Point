import { localizeTables } from "./locale.js";

/**
 * The one save line the shell (AppContent.jsx) says itself, when this device
 * cannot keep what the start screen writes: the runtime's
 * `notices.save.unavailable` (src/copy/notices.js), word for word. It is kept
 * apart so the start screen reads it in the page's language without the
 * runtime's whole notices table in the first-screen chunk (6.8KB, +1.5KB gzip
 * when the shell imported it, 10-29), and outside src/copy/, which
 * check:locale reads as tables a dictionary covers one by one. The
 * dictionaries say the line once, under `screens.notices.save.unavailable`,
 * and it is laid over both tables, so the runtime's `offersStorageRetry`
 * knows the shell's line in every language.
 */
const shellNotices = {
  save: {
    unavailable: "브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.",
  },
};

export default shellNotices;

localizeTables("screens", { notices: shellNotices });
