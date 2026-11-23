import { localizeTables } from "../locale.js";

/**
 * The words of 이번 주의 규칙's catalogue (gauntlet/weeklyRules.js): each
 * rule's title, its text and its line in the story, and the audit's and the
 * links' lines 2026-W47's test week has, read by key so another language can be
 * laid over them (src/locale.js, 다국어 틀). The Korean is the catalogue's,
 * moved here unchanged; its numbers are the catalogue's constants, filled in
 * as `{blanks}` (`ruleWords` there), so a tuned number is still one edit.
 */
const weekRulesCopy = {
  auditLine: "한 번 이상 밀고 열기 {heat} 미만에서 확정하면 감사 +1. {limit}칸이 찬 채 사건이 닫히면 금고로 갈 몫의 {share}분의 1을 잃는다.",
  cascadeLine: "한 자원을 8 이상 태운 카드를 확정하면 2~4판 안에 한 판의 벽이 6 가까워진다. 사건이 닫힐 때 남은 연결은 다음 사건으로 넘어간다.",
  rules: {
    "near-wall": {
      title: "벽이 가깝다",
      text: "이번 주는 벽 띠가 열기 {shift}만큼 앞당겨 선다. 같은 열기로 더 빨리 벽에 닿는다.",
      world: "이번 주 그룹은 감사를 앞당겼다.",
    },
    "heavy-fracture": {
      title: "균열이 깊다",
      text: "이번 주는 FRACTURE가 금 간 자원을 {rate}배로 청구한다.",
      world: "이번 주 회계팀은 금 간 장부를 한 번 더 넘겨 본다.",
    },
    "short-clock": {
      title: "시간이 짧다",
      text: "이번 주는 판마다 시간이 {seconds}초 짧고, 모든 카드의 칩이 {chips}배다. LOCK 충전은 시간을 {lockDrag}배 쓴다.",
      world: "이번 주 이사회는 보고 시간을 줄이고 보고서 값을 올렸다.",
    },
    "crisis-week": {
      title: "위기 주간",
      text: "이번 주는 벽 띠가 열기 {crisisShift}만큼 앞당겨 서고, 모든 카드의 칩이 {crisisChips}배다.",
      world: "이번 주 시장이 흔들리자 본사는 숫자부터 맞추라고 했다.",
    },
    "idle-erosion": {
      title: "묵힌 돈은 준다",
      text: "이번 주는 사건이 닫힐 때마다 금고에 남아 있던 돈의 {erosion}%가 사라진다. 도구를 고를 때 쓴 돈은 줄지 않는다.",
      world: "이번 주 물가가 올라 묵혀 둔 돈의 값이 준다.",
    },
    "market-shock": {
      title: "시장 충격",
      text: "이번 주는 사건마다 한 번, {shockBoard}번째 판에 시장이 흔들린다. 그 판은 벽 띠가 열기 {shockWall}만큼 앞당겨 서고, 그때까지 쌓은 판돈이 최대 {shockSwing}% 오르거나 내린다.",
      world: "이번 주 시장이 출렁이자 장부의 숫자도 같이 흔들렸다.",
    },
    "audit-cascade": {
      title: "감사와 연쇄",
      text: "이번 주는 감사와 연쇄가 함께 선다. {audit} {cascade} CASCADE 판의 확정은 감사에 세지 않는다.",
    },
  },
  // 「이번 사건만」 (N26, gauntlet/caseRules.js): the four cases in 사건 08-17
  // that play under one of the rules above for themselves, by case. The same
  // numbers as the week's (`{blanks}` filled the same way); the line in the
  // story is the case's own.
  // G5 (gauntlet/actTwists.js): the twist of acts 3, 5 and 7 under the next rules, by id.
  actTwists: {
    merger: {
      title: "합병",
      text: "이번 사건은 모든 카드의 칩이 {mergerChips}배지만, 벽 띠의 먼 끝이 열기 {mergerTop}만큼 앞당겨 선다.",
      world: "그룹이 「개혁」이라며 계열사를 합친다. 판은 커지고 벽은 가까워진다.",
    },
    scattered: {
      title: "흩어진 자리",
      text: "이번 사건은 벽 띠가 양쪽으로 열기 {spread}씩 넓어진다. 벽이 어디 설지 더 넓게 봐야 한다.",
      world: "트리거랩 사람들이 곳곳으로 흩어져, 자리마다 벽이 선 곳이 다르다.",
    },
    hearing: {
      title: "청문회",
      text: "이번 사건은 판마다 시간이 {hearingCut}% 짧고, 모든 카드의 칩이 {hearingChips}배다. LOCK 충전은 시간을 {lockDrag}배 쓴다.",
      world: "기록의 주인을 다투는 청문회. 답할 시간은 짧고, 한마디의 값은 크다.",
    },
    // G5's acts 1, 2, 4, 6 and 8 (actTwists.js `ACT_DEVICE_TWIST_RULES`): dealt once the table does what they say.
    passedDown: {
      title: "떠넘겨진 손실",
      text: "이번 사건은 처음 BUST가 나도 판돈의 {downShare}분의 1이 남는다. 대신 그 판의 사람 피해가 {downHarm} 오른다.",
      world: "은행이 앞당긴 상환은 돌봄 시간으로, 배차표로 내려간다.",
    },
    lateBill: {
      title: "뒤늦은 청구서",
      text: "이번 사건은 열기 {billHeat} 이상에서 확정하면 그 열기의 4분의 3을 안고 다음 판을 시작한다. 그 아래에서 확정하면 모든 카드의 칩이 {billChips}배다.",
      world: "열흘을 혼자 버틴 값은 이긴 다음 날 청구된다.",
    },
    trainedWall: {
      title: "학습된 벽",
      text: "이번 사건은 노아가 당신이 확정한 열기를 배운다. 확정한 다음 판의 벽 띠는 그 열기 쪽으로 옮겨 서되, 원래 띠의 가운데 아래로는 내려가지 않는다.",
      world: "노아는 당신이 고른 것과 망설인 초를 배웠다.",
    },
    onRecord: {
      title: "진술 고정",
      text: "이번 사건은 첫 판에 확정한 자세를 사건 끝까지 바꿀 수 없다. 대신 확정할 때마다 충전이 모자라도 그 자세가 다음 판에 남는다.",
      world: "한 번 한 진술은 조서에 남고, 다음 질문은 그 줄에서 시작한다.",
    },
    signedByName: {
      title: "실명 서명",
      text: "이번 사건은 첫 판 전에 서명 방식을 고른다. 이름만 쓰면 모든 카드의 칩이 {nameChips}배, 벽 띠가 사건마다 {nameWallLow}~{nameWallHigh} 앞당겨 선다(서명란에 이번 값). 조건을 달면 벽 띠가 {termsWall} 물러서고 칩이 {termsChips}배다.",
      world: "이제 서명란에 빈칸은 없다. 이름 옆에 조건을 달 수 있을 뿐이다.",
    },
  },
  caseRules: {
    case09: {
      text: "이번 사건은 판마다 시간이 {seconds}초 짧고, 모든 카드의 칩이 {chips}배다. LOCK 충전은 시간을 {lockDrag}배 쓴다.",
      world: "청산 안건이 72시간 안에 표결에 오른다. 보고는 짧게, 값은 비싸게.",
    },
    case11: {
      text: "이번 사건은 벽 띠가 열기 {shift}만큼 앞당겨 선다. 같은 열기로 더 빨리 벽에 닿는다.",
      world: "국정감사 일정이 하루 앞당겨졌다.",
    },
    case14: {
      text: "이번 사건은 FRACTURE가 금 간 자원을 {rate}배로 청구한다.",
      world: "부실 채권을 92원에 사 준 장부라, 금 간 곳은 한 번 더 들여다본다.",
    },
    case16: {
      text: "이번 사건은 벽 띠가 열기 {crisisShift}만큼 앞당겨 서고, 모든 카드의 칩이 {crisisChips}배다.",
      world: "로봇 리스 공시에 시장이 흔들리자 본사는 숫자부터 맞추라고 했다.",
    },
  },
};
export default weekRulesCopy;

localizeTables("screens", { weekRules: weekRulesCopy });
