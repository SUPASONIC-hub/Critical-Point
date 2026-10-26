import { localizeTables } from "../locale.js";
import { PRIVACY_SIGNAL_LABELS } from "../privacyText.js";

/**
 * What the 참가자 게시판's hook says (state/useBoard.js, in the entry chunk):
 * why a post was stopped or refused, and how loading and posting went, read
 * by key so another language can be laid over them (src/locale.js, 다국어
 * 틀). The Korean is the hook's own, moved here unchanged. The privacy
 * signals' names stay in privacyText.js (a leaf) and are named here so their
 * words are laid over in place.
 */
const boardPostCopy = {
  refusals: {
    "nickname-characters": "이름은 2자 이상 24자 이하로 적어 주세요.",
    "body-characters": "글은 2자 이상 300자 이하로 적어 주세요.",
    "nickname-link": "이름에는 링크를 넣을 수 없습니다. 이름을 바꿔 다시 올려 주세요.",
    "body-link": "링크가 들어간 글은 올릴 수 없습니다. 링크를 빼고 다시 올려 주세요.",
    contact: "전화번호나 이메일이 들어간 글은 올릴 수 없습니다. 빼고 다시 올려 주세요.",
  },
  honeypot: "자동으로 채워진 칸이 있어 글을 올리지 않았습니다. 다시 눌러 주세요.",
  dwell: "게시판이 열린 지 얼마 되지 않았습니다. 잠깐 읽어 보고 다시 눌러 주세요.",
  privacy: "식별 정보로 보일 수 있는 표현을 익명화한 뒤 올려 주세요.",
  interval: "글은 30초에 한 번만 올릴 수 있습니다. {seconds}초 뒤에 다시 눌러 주세요.",
  failures: {
    repeat: "같은 글이 조금 전에 올라와 있습니다. 표현을 바꿔 다시 올려 주세요.",
    interval: "글은 30초에 한 번만 올릴 수 있습니다. 잠시 뒤에 다시 눌러 주세요.",
    limit: "한 시간에 10번까지만 올릴 수 있습니다. 시간을 두고 다시 찾아와 주세요.",
    offline: "오프라인이라 글을 올리지 못했습니다. 연결된 뒤에 다시 눌러 주세요.",
    failed: "글을 올리지 못했습니다. 잠시 뒤에 다시 눌러 주세요.",
  },
  noServer: "이 배포에는 게시판 서버가 없어 글을 주고받을 수 없습니다.",
  loadFailed: "게시판을 불러오지 못했습니다. 아래에서 다시 불러올 수 있습니다.",
  loadOffline: "오프라인이라 게시판을 불러오지 못했습니다. 연결되면 다시 열립니다.",
  alreadyPosted: "같은 글을 이미 올렸습니다. 같은 글은 게시판에 한 번만 실립니다.",
  noServerPost: "이 배포에는 게시판 서버가 없어 글을 올리지 못했습니다.",
  posted: "글을 올렸습니다.",
  signals: PRIVACY_SIGNAL_LABELS,
};
export default boardPostCopy;

localizeTables("screens", { boardPost: boardPostCopy });
