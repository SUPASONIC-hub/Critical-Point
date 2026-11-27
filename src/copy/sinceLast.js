import { localizeTables } from "../locale.js";

/**
 * 「지난번 이후」 (N24): the card a device back after three days or more reads
 * on the start screen (SinceLastCard.jsx), read by key so another language
 * can be laid over it (src/locale.js, 다국어 틀). In the card's own chunk.
 */
const sinceLastCopy = {
  label: "지난번 이후",
  heading: "지난번 이후 · {days}일 만입니다",
  resume: "이어할 곳: {case}",
  rule: "이번 주 규칙: {title}",
  sides: "새 번외 사건: {names}",
  posts: "게시판 새 글 {count}개",
  postsMany: "게시판 새 글 {count}개 이상",
  board: "게시판 보기",
  close: "닫기",
};
export default sinceLastCopy;

localizeTables("screens", { sinceLast: sinceLastCopy });
