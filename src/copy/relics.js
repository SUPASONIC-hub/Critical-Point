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
    skip: "고르지 않고 진행",
  },
  // By the tool's id: its name, what it does, what it says when it fires, the
  // line on the rule it softens, and the feat that unlocks it.
  relics: {
    metronome: {
      name: "메트로놈",
      text: "열기가 오른 다음 장면까지, 유형을 바꿔도 전환으로 인정된다.",
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
    lockpick: {
      name: "락픽",
      text: "COLD FEET로 봉인된 카드가 열기 {seal}{particle} 아니라 {pick}에서 열린다.",
      proc: "봉인을 일찍 땄다",
      softens: "락픽: 열기 {pick}에서 열림",
    },
    splint: {
      name: "부목",
      text: "FRACTURE로 금 간 자원의 청구가 {rate}배가 아니라 {splint}배다.",
      proc: "균열을 받쳤다",
      softens: "부목: {splint}배 청구",
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
    highRoller: {
      name: "하이롤러",
      text: "모든 카드의 칩이 {chips}배. 대신 벽 구간 전체가 {wall} 가까워진다.",
      proc: "더 큰 칩을 걸었다",
      unlock: "×{multiplier} 이상으로 확정하기",
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
    steadyAnchor: {
      name: "닻",
      text: "STEADY MASTERY가 켜진 판은 열기 {cool}{particle} 더 식힌 채 시작하고, 시간이 {seconds}초 더 주어진다.",
      proc: "STEADY 숙련에 닻을 내렸다",
      softens: "닻: 열기 {cool} 더 식음, {seconds}초 추가",
      unlock: "STEADY 숙련 {count}회",
    },
    glassLens: {
      name: "돋보기",
      text: "EXPOSE MASTERY가 켜진 판은 카드가 뒤집히지 않고 가장 비싼 카드도 봉인되지 않으며, 봉인은 열기 {seal}에서 열린다.",
      proc: "EXPOSE 숙련으로 판을 꿰뚫었다",
      softens: "돋보기: 가림과 봉인 해제",
      unlock: "EXPOSE 숙련 {count}회",
    },
  },
};
export default relicsCopy;

localizeTables("screens", { relics: relicsCopy });
