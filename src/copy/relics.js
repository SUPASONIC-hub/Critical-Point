import { localizeTables } from "../locale.js";

/**
 * The tools (relics.js) and their draft (RelicDraft.jsx): the words they
 * print, read by key so another language can be laid over them (src/locale.js,
 * 다국어 틀). The Korean is the screen's own, moved here unchanged. A tool's
 * numbers are the rule's own (tableRules.js), filled into its `{blank}`s;
 * `{particle}` is the Korean particle the number before it takes, which
 * another language leaves out. Each tool keeps its English `label` in
 * relics.js: it is already English.
 */
const relicsCopy = {
  draft: {
    full: "도구 칸 가득",
    closed: "사건 종료",
    swapTitle: "내려놓을 도구 하나",
    title: "다음 사건에 가져갈 도구 하나",
    swapLede: "{name}{particle} 들려면 가진 도구 하나를 내려놓는다. 내려놓은 도구는 이 테이블부터 규칙을 바꾸지 않는다.",
    lede: "고른 도구는 테이블의 규칙 하나를 바꾼다. 도구는 {slots}개까지 들고, {when}. 고를 때까지 시계는 멈춰 있다.",
    ledeFull: "칸이 다 찼으니 고르면 하나를 내려놓는다",
    ledeRoom: "다 차면 하나를 내려놓고 바꾼다",
    drop: "내려놓기",
    rare: "해금",
    codexLabel: "도구 도감, {total}개 중 {count}개 해금",
    lockedTitle: "잠김 · {feat}",
    lockedSpoken: "잠김, {feat}",
    owned: ", 장착",
    codexCount: "도감 {count}/{total}",
    nextFeats: "{codex} · 다음 해금: {feat} · 나머지 {more}개 보기",
    nextFeat: " · 다음 해금: {feat}",
    allOpen: " · 모두 해금",
    back: "다른 도구 보기",
    // C-7's pass (relics.js `BREATHER`): what it gives, in the button.
    skip: "고르지 않고 {name} · {short}",
  },
  // By the tool's id: its name, what it does, what it says when it fires, the
  // line on the rule it softens, and the feat that unlocks it.
  relics: {
    metronome: {
      name: "메트로놈",
      text: "열기가 오른 다음 장면까지, 방향을 바꿔도 전환으로 인정된다.",
      proc: "전환을 붙잡았다",
    },
    coldBlood: {
      name: "냉혈",
      text: "벽에 닿은 뒤의 AFTERSHOCK가 열기 {start}{particle} 아니라 {cold}에서 시작한다.",
      proc: "여진을 절반으로 식혔다",
      softens: "냉혈: 열기 {cold}에서 시작",
    },
    heatSink: {
      name: "방열판",
      text: "HEAT DEBT가 열기의 {share}분의 1만 남기고, 시간은 {seconds}초만 가져간다.",
      proc: "열 빚을 절반으로 줄였다",
      softens: "방열판: 열기 {share}분의 1, {seconds}초",
    },
    auditContact: {
      name: "감사실 연줄",
      text: "감사팀 반재욱이 한 칸은 눈감아 준다. 감사는 {limit}칸이 차야 적발된다.",
      proc: "반재욱이 한 칸을 눈감았다",
    },
    carbonCopy: {
      name: "임경수의 사본",
      text: "임경수가 태우지 않은 사본이 있다. BLACKOUT이 벽을 {shift}{particle} 아니라 {pull}만 당긴다.",
      proc: "사본이 벽을 붙잡았다",
      softens: "사본: 벽 {pull}만 당김",
    },
    testimony: {
      name: "오진우의 진술",
      text: "결정 제한시간은 설정값이었다. 시간이 다 돼 BUST해도 판돈의 {share}분의 1은 남는다.",
      proc: "시간이 다 돼도 판돈 {share}분의 1을 지켰다",
    },
    frontPage: {
      name: "차지원의 1면",
      text: "특종이 이어져도 손이 떨리지 않는다. OVERCLOCK 판에서 밀 때 늘어나는 열기가 절반이다.",
      proc: "1면 마감 앞에서도 손이 고요했다",
      softens: "1면: 밀기 폭 절반만 커짐",
    },
    fieldNote: {
      name: "도윤하의 현장 메모",
      text: "현장에선 두 번이면 흐름이 선다. 같은 유형 {hold}번째부터 논리 콤보가 오른다.",
      proc: "현장 메모로 콤보를 일찍 세웠다",
    },
    encore: {
      name: "앙코르",
      text: "벽에 닿아 판돈을 잃어도 논리 콤보는 남는다.",
      proc: "벽에 닿고도 콤보가 살아남았다",
      unlock: "논리 콤보 {combo} 달성",
    },
    insurance: {
      name: "보험",
      text: "사건마다 한 번, 벽에 닿아도 판돈의 {share}분의 1은 남는다.",
      proc: "판돈 {share}분의 1을 지켰다",
      unlock: "판돈 {loss} 이상을 벽에 잃기",
    },
    stethoscope: {
      name: "청진기",
      text: "SILENCE가 와도 심박이 계속 벽을 가리킨다. 시간은 여전히 {seconds}초다.",
      proc: "침묵 속에서 심장을 들었다",
      softens: "청진기: 심박 유지",
      unlock: "SILENCE를 한 번 겪기",
    },
    kineticGrip: {
      name: "악력",
      text: "STRIKE MASTERY가 밀 때마다 얹던 열기 1을 걷어 내고, STRIKE WAKE로 깨어난 판의 칩이 {chips}배 더 두꺼워진다.",
      proc: "STRIKE 숙련이 손에 붙었다",
      softens: "악력: 밀 때 오르는 열기 그대로",
      unlock: "STRIKE 숙련 {count}회",
    },
  },
  // 「숨 고르기」 (C-7): what passing on a draft gives (relics.js `BREATHER`).
  breather: {
    name: "숨 고르기",
    short: "+{seconds}초",
    text: "고르지 않으면 이 사건 첫 판의 시간이 {seconds}초 늘고, 벽이 {wall} 멀어진다.",
  },
};
export default relicsCopy;

localizeTables("screens", { relics: relicsCopy });
