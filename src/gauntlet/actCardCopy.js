import { CASE_SEQUENCE } from "../gameCases.js";

/**
 * B-11(1), the act title card (막 표지): one card in front of the page that
 * opens 사건 01·08·13·19·25·31·37·43 -- the act's number and cases, its name,
 * one sentence, and how many cases are left to the season's end. The names
 * are the README's acts; 2막 had none and is named for 사건 10, 「그 집념의 값」.
 *
 * It holds nothing: one press of any key, a tap anywhere, or `ACT_CARD_MS`
 * running out, and the briefing comes up behind it (ActCardFold.jsx says when
 * it is shown). The card is a dialog named by the act and described by its
 * sentence and count, so a screen reader reads it once, as focus lands on 계속.
 * The bar under 계속 is the time left; it does not move under reduced motion
 * or calm effects.
 */
export const ACT_CARD_MS = 7000;

export const ACT_CARDS = Object.freeze({
  case01: { act: 1, span: "사건 01~07", name: "사슬의 시작", line: "무너진 310억 대출의 손실이 다른 회사의 장부로, 돌봄 시간으로, 옆자리 동료로 옮겨 갑니다." },
  case08: { act: 2, span: "사건 08~12", name: "집념의 값", line: "같은 집념이 서로 다른 감정에서 깨어나고, 그 값을 적은 청구서가 누군가의 앞으로 옵니다." },
  case13: { act: 3, span: "사건 13~18", name: "사슬은 반복된다", line: "그룹은 '개혁'을 연출하면서, 같은 방식으로 새 사람들에게 손실을 옮기려 합니다." },
  case19: { act: 4, span: "사건 19~24", name: "설계자", line: "사슬을 따라 올라가면 트리거랩이라는 실험과, 그 실험을 거친 사람들에게 닿습니다." },
  case25: { act: 5, span: "사건 25~30", name: "흩어진 자리", line: "트리거랩 사람들이 그룹 곳곳으로 흩어지고, 흩어진 자리마다 같은 사슬의 새 고리가 보입니다." },
  case31: { act: 6, span: "사건 31~36", name: "조사", line: "금융감독원과 검찰이 들어오고, 증언한 사람이 대가를 치릅니다." },
  case37: { act: 7, span: "사건 37~42", name: "기록의 전쟁", line: "트리거랩의 기록이 세상에 풀리고, 그 기록의 주인이 누구인지 다툽니다." },
  case43: { act: 8, span: "사건 43~49 · 마지막 사건", name: "서명", line: "한 사람이 자리에서 내려와도 서명란은 비어 있고, 누가 그 칸에 이름을 쓸지가 남았습니다." },
});

/** The cases from this one to the season's last, this one counted. */
export const casesLeft = (caseId) => CASE_SEQUENCE.length - CASE_SEQUENCE.indexOf(caseId);
