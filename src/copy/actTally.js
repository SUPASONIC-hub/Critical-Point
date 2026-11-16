import { localizeTables } from "../locale.js";

/**
 * N1 막 끝 중간 결산 (2026-11-12, Q2 (1)): what the mid-season card says on the
 * act card that follows 프롤로그, 사건 18 and 사건 36 (ActTally.jsx), and what
 * its picture and copied line say (actTally.js). Read by key so another
 * language can be laid over them (src/locale.js, 다국어 틀). Display only: the
 * card reads the season's stored summaries and changes nothing.
 */
const actTallyCopy = {
  heading: "중간 결산 · {end}",
  // What closed before the act card, by the case the card opens.
  ends: {
    case01: "프롤로그 끝",
    case19: "3막 끝 · 사건 18",
    case37: "6막 끝 · 사건 36",
  },
  // The corner of the picture, where the finale's says SEASON 01 · FINAL RECORD.
  corners: {
    case01: "PROLOGUE · MIDSEASON",
    case19: "ACT 3 · MIDSEASON",
    case37: "ACT 6 · MIDSEASON",
  },
  habit: "지금까지의 판단 유형",
  habitPending: "아직 이름 붙지 않은 판단",
  stake: "가장 큰 판돈",
  stakeKept: "{pot} · {where}에서 금고로",
  stakeLost: "{pot} · {where}에서 벽에 잃음",
  stakeNone: "아직 금고에 넣은 판돈이 없습니다",
  // The picture's one line beside the 논리 유지력.
  stakeShort: "가장 큰 판돈 {pot}",
  caseNo: "사건 {code}",
  prologueNo: "프롤로그 {n}",
  ending: "가까운 결말",
  // The next nearest ending, with what it lacks (src/nearestEnding.js; the gaps are the report's words).
  nearLine: "한 걸음 옆: {ending}까지 {gaps}",
  // The makers' line under the three rows.
  note: "막이 바뀌는 자리에서 우리가 지금까지를 한 장에 묶었습니다. 점수와 결말은 아직 정해지지 않았습니다.",
  shareLine: "트리거랩 시즌을 {end}까지 왔습니다. 판단 유형은 '{habit}', 가까운 결말은 '{ending}'.",
  // The two buttons and what a press says (ResultCardShare.jsx, with these words).
  buttons: {
    shareLabel: "중간 결산 카드 공유",
    saveLabel: "중간 결산 카드 저장",
    making: "카드를 만드는 중입니다.",
    saved: "중간 결산 카드를 저장하고 소개 문구를 복사했습니다.",
    savedUncopied: "중간 결산 카드를 저장했습니다. 문구는 복사하지 못했습니다.",
    shared: "중간 결산 카드를 공유했습니다.",
    failed: "카드를 만들지 못했습니다. 다시 눌러 주세요.",
    note: "카드에는 이름이 들어가지 않습니다.",
  },
};
export default actTallyCopy;

localizeTables("screens", { actTally: actTallyCopy });
