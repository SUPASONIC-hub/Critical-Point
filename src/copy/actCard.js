import { localizeTables } from "../locale.js";

/**
 * The act title card (막 표지; ActCard.jsx, with the acts of actCardCopy.js):
 * the words it prints, read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀). The Korean is the screen's own, moved here
 * unchanged. `cards` is by the case that opens the act: its cases, its name
 * and its one sentence.
 */
const actCardCopy = {
  kicker: "{act}막 · {span}",
  title: "「{name}」",
  left: " 이 사건부터 마지막 사건까지 {count}개.",
  go: "계속",
  cards: {
    case01: { span: "사건 01~07", name: "사슬의 시작", line: "무너진 310억 대출의 손실이 다른 회사의 장부로, 돌봄 시간으로, 옆자리 동료로 옮겨 갑니다." },
    case08: { span: "사건 08~12", name: "집념의 값", line: "같은 집념이 서로 다른 감정에서 깨어나고, 그 값을 적은 청구서가 누군가의 앞으로 옵니다." },
    case13: { span: "사건 13~18", name: "사슬은 반복된다", line: "그룹은 '개혁'을 연출하면서, 같은 방식으로 새 사람들에게 손실을 옮기려 합니다." },
    case19: { span: "사건 19~24", name: "설계자", line: "사슬을 따라 올라가면 트리거랩이라는 실험과, 그 실험을 거친 사람들에게 닿습니다." },
    case25: { span: "사건 25~30", name: "흩어진 자리", line: "트리거랩 사람들이 그룹 곳곳으로 흩어지고, 흩어진 자리마다 같은 사슬의 새 고리가 보입니다." },
    case31: { span: "사건 31~36", name: "조사", line: "금융감독원과 검찰이 들어오고, 증언한 사람이 대가를 치릅니다." },
    case37: { span: "사건 37~42", name: "기록의 전쟁", line: "트리거랩의 기록이 세상에 풀리고, 그 기록의 주인이 누구인지 다툽니다." },
    case43: { span: "사건 43~49 · 마지막 사건", name: "서명", line: "한 사람이 자리에서 내려와도 서명란은 비어 있고, 누가 그 칸에 이름을 쓸지가 남았습니다." },
  },
};
export default actCardCopy;

localizeTables("screens", { actCard: actCardCopy });
