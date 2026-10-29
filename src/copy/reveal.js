import { localizeTables } from "../locale.js";

/**
 * The decision reveal, the sheet after every commit (DecisionReveal.jsx): the
 * words it prints, read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀). The Korean is the screen's own, moved here
 * unchanged.
 */
const revealCopy = {
  dialogLabel: "판정 결과",
  heat: {
    bust: "열기 {gauge} / 벽 {wall}. 판돈 {pot}{particle} 잃었다.",
    cashed: "열기 {gauge}에서 {multiplier} 확정. 벽 {wall}{particle} 넘기지 않았다.",
  },
  baseRules: "기본 규칙으로 복귀",
  ledger: {
    cause: "판정 원인",
    heat: "열기 기록",
    logic: "논리 콤보",
    link: "연결",
    relics: "도구 발동",
    next: "다음 판",
  },
  // The room a lost scene went on in, for a reveal saved before the skip carried one.
  room: "회의실",
  subline: {
    timeout: "시간이 먼저 끝났다. 망설임도 벽이다.",
    abandon: "걸어 둔 판을 두고 테이블을 떠났다. 떠난 판은 벽에 닿은 판으로 친다.",
    bust: "열기 {gauge} — 벽은 {wall}에 있었다.",
    cashed: "열기 {gauge}에서 확정. 벽은 {wall}에 있었다.",
  },
  details: "자세히",
  ledgerLabel: "판정 후폭풍",
  pot: {
    label: "판돈",
    // Before the pot it had: "판돈 1,200 → 400".
    lost: "판돈 ",
    combo: " × 콤보 ",
    auditCaught: " 감사 적발: 금고로 갈 ",
    auditOf: " 중",
    auditTaken: " 환수 · 금고 ",
    toVault: " 금고로 이동 ",
    vault: " · 금고",
    staked: "걸려 있는 판돈 ",
    vaultAfterStake: " · 금고 ",
  },
  unlock: {
    label: "새로 해금한 도구",
    title: "새 도구 해금",
    text: "도감에 들어갔습니다. 이제 사건이 닫힐 때마다 드래프트에 나올 수 있습니다.",
  },
  draft: "사건이 닫혔습니다. 다음 사건의 첫 테이블에서 도구 {count}개 중 하나를 고릅니다.",
  overdrive: {
    label: "오버클럭 발동",
    text: "다음 판은 칩 2배로 시작하지만, 밀기 폭도 커진다. 이 보상은 더 큰 벽을 데려온다.",
  },
  forced: "회의실이 대신 골랐다",
  yourCall: "당신의 판단",
  stakesLabel: "선택으로 열린 것과 닫힌 것",
  received: "받은 것",
  paid: "치른 것",
  none: "없음",
  noneBust: "없음 — 벽이 가져갔다",
  // After the English LOST SCENE.
  skipped: " {room}{roomParticle} 당신 없이 「{title}」{titleParticle} 넘겼습니다.",
  nextLabel: "다음 판의 규칙 변화",
  nextBroken: "다음 판이 이렇게 부서진다",
  nextRules: "다음 판의 규칙",
  clue: "숨은 단서 발견",
  next: "다음 · {title}",
  caseResult: "사건 결과",
  nextHand: "다음 판",
};
export default revealCopy;

localizeTables("screens", { reveal: revealCopy });
