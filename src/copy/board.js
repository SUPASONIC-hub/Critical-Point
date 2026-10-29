import { localizeTables } from "../locale.js";
import { BOARD_REPORT_FAILURES, BOARD_REPORT_REASONS } from "../boardReport.js";

/**
 * 참가자 게시판 (BoardScreen.jsx and its report form, useBoardReport.js): the
 * words it prints, read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀). The Korean is the screen's own, moved here
 * unchanged. The report reasons and refusals stay in boardReport.js, a leaf
 * the grants check reads, and are named here so their words are laid over in
 * place. What the board's hook says (useBoard.js, in the entry chunk) is
 * src/copy/boardPost.js.
 */
const boardCopy = {
  back: "브리핑으로 돌아가기",
  title: "남겨두고 가는 말",
  intro: "이름 하나와 짧은 글이면 충분합니다. 여기 적은 이름과 글은 다른 참가자에게 그대로 보입니다. 점수도 순위도 붙지 않습니다. 사건을 지나온 사람이 다음 사람에게 남기는 자리입니다.",
  posts: "{count}개의 글",
  connecting: "게시판에 연결하는 중입니다",
  offline: "글을 주고받을 수 없습니다",
  publicNote: "이름과 글은 공개됩니다. 연락처나 소속처럼 본인을 특정할 수 있는 내용은 적지 말아 주세요.",
  retry: "다시 불러오기",
  composer: "글 남기기",
  name: "이름",
  namePlaceholder: "게시판에 보일 이름",
  nameCount: "{count}/{max}자 · 이 이름은 공개됩니다",
  body: "남길 말",
  bodyPlaceholder: "사건을 지나며 남은 생각을 적어 주세요. 링크는 올릴 수 없습니다.",
  bodyCount: "{count}/{max}자",
  honeypot: "홈페이지",
  privacy: "개인 정보로 보이는 표현이 있습니다: {signals}. 익명화한 뒤에 올릴 수 있습니다.",
  anonymize: "익명화",
  posting: "올리는 중",
  post: "글 남기기",
  notConnected: "게시판에 연결된 뒤에 글을 남길 수 있습니다.",
  listLabel: "참가자 글",
  listTitle: "먼저 지나간 사람들",
  // What the list says in place of posts, by what the board is doing.
  list: {
    idle: "글을 불러오는 중입니다.",
    loading: "글을 불러오는 중입니다.",
    error: "글을 불러오지 못했습니다.",
    local: "지금은 게시판에 연결되어 있지 않습니다.",
    ready: "아직 남겨진 글이 없습니다. 첫 글을 남겨보세요.",
  },
  noTime: "기록 시각 없음",
  reportedLabel: "{name}님의 글을 신고했습니다",
  reportLabel: "{name}님의 글 신고",
  reported: "신고함",
  report: "신고",
  reportLegend: "이 글을 신고하는 이유",
  reportNote: "신고한 사람은 글쓴이에게 알려지지 않습니다. 운영자가 읽고 판단합니다.",
  reportSending: "보내는 중",
  reportSend: "신고 보내기",
  cancel: "취소",
  footnote: "게시판의 이름은 이 게시판에만 쓰입니다. 랭킹과 기록은 지금까지처럼 익명으로 남고, 게시판은 플레이 기록과 다른 식별 번호를 씁니다. 글은 180일 동안 보관한 뒤 지우며, 접속 주소는 도배를 막는 데만 씁니다. 여기 적은 글은 언제든 운영자가 내릴 수 있습니다. 문제가 있는 글은 글마다 있는 신고 버튼으로 알려 주세요.",
  // useBoardReport.js
  reportSent: "신고를 받았습니다. 운영자가 확인하고 필요하면 글을 내립니다.",
  reportNeedsReason: "신고 사유를 하나 골라 주세요.",
  reportNoServer: "이 배포에는 게시판 서버가 없어 신고를 보내지 못했습니다.",
  reasons: BOARD_REPORT_REASONS,
  reportFailures: BOARD_REPORT_FAILURES,
};
export default boardCopy;

localizeTables("screens", { board: boardCopy });
