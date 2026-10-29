import { localizeTables } from "../locale.js";

/**
 * What a prologue's first briefing says about the rules it turns on
 * (gauntlet/tableUnlocks.js, shown by SceneBriefing.jsx): the line over them
 * and the lines, case by case, read by key so another language can be laid
 * over them (src/locale.js, 다국어 틀). The Korean is the ladder's own, moved
 * here unchanged; `{cap}` and `{charge}` are the engine's LOCK_CAP and
 * STANCE_CHARGE, filled in when the ladder is built. Why each line says what it
 * says is written beside the step in tableUnlocks.js.
 */
const unlocksCopy = {
  kicker: "NEW PROTOCOL · 이번 사건부터 규칙이 늘어납니다",
  // 「고점 판」 (C-10, tableUnlocks.js PEAK_CASES): an act's last case, over its first briefing.
  // `{wall}` and `{chips}` are tableRules.js PEAK_WALL and PEAK_CHIPS.
  peak: {
    kicker: "PEAK TABLE · 고점 판",
    intro: ["막의 마지막 사건입니다. 이 사건의 판은 모두 벽이 {wall} 가까워지고 칩이 {chips}배입니다."],
  },
  steps: {
    prologue01: {
      kicker: "FIRST TABLE · 이 판은 이렇게 합니다",
      intro: [
        "밀면 열기와 배율이 오릅니다. 벽에 닿기 전에 확정하십시오. 심박이 빨라지면 벽이 가깝습니다.",
        "벽에 닿으면 이 사건에 걸린 판돈 전부와 다음 장면을 잃습니다. 금고에 넣은 것은 그대로입니다.",
      ],
    },
    prologue02: {
      intro: [
        "같은 생각 유형의 카드를 세 번 잇달아 고르면 논리 콤보가 쌓이고 배율이 커집니다. 지난 판을 더 뜨겁게 닫았다면 유형을 바꿔도 콤보가 이어집니다. 사건 결과의 '관점 전환' 점수는 반대로 네 유형을 고르게 쓸수록 오릅니다.",
        "벽에 닿으면 다음 판은 카드가 가려지고, 열기를 안은 채 시작합니다.",
      ],
    },
    prologue03: {
      intro: [
        "한 번도 밀지 않고 확정하면 다음 판에서 가장 비싼 카드가 봉인됩니다.",
        "열기 60 이상에서 확정하면 다음 판은 열기를 안고 시작하고 시간이 줄어듭니다.",
        "조회를 누르면 시간 3초를 쓰고 벽 구간이 20칸 폭으로 좁혀집니다. 판마다 한 번이고, 벽이 그 한가운데 있다는 뜻은 아닙니다.",
      ],
    },
    prologue04: {
      intro: [
        "가장 크게 태운 자원은 다음 판에서 1.5배로 청구됩니다.",
        "×4 이상으로 두 번 잇달아 확정하면 다음 판의 칩이 2배가 되고, 밀 때 오르는 열기도 커집니다.",
        "카드를 건 뒤 LOCK을 누르면 자원 배율이 오르고, 칩 배율은 1.5배까지 오릅니다. 누를 때마다 시간이 줄어듭니다.",
        "이번 사건부터 감사와 연결이 판에 붙습니다.",
      ],
    },
    prologue05: {
      intro: [
        "자세는 LOCK이 무엇을 키울지 정합니다. STRIKE는 배율(1.5배 상한에 가장 빨리), STEADY는 식힘(PUSH 뒤에만), EXPOSE는 자원입니다.",
        "사건이 닫힐 때마다 도구 3개 중 하나를 고릅니다. 도구는 5개까지 들고, 다 차면 하나를 내려놓고 바꿉니다.",
        "칩 배율이 {cap}배에 닿은 뒤의 LOCK은 이번 판 배율에 더하지 않고, {charge} 이상 충전해 확정하면 다음 판에서 치릅니다.",
      ],
    },
  },
};
export default unlocksCopy;

localizeTables("screens", { unlocks: unlocksCopy });
