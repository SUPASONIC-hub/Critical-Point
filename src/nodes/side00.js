/**
 * 번외 0: the side-case framework's placeholder (E-11), not a case.
 *
 * It is here so the slot, the side screen, the graph check and the tests have
 * a side case to open before the first real one (side01) is written. It says
 * nothing about the season: no date, no new fact, one speaker the season
 * already has. It is listed only in a debug build visited with
 * `?side-fixture=1` (nodes/sidePacks.js); a release never ships it.
 *
 * The shape every side case has (state/sidePackCheck.js `checkSidePack`):
 *   - `id` `sideNN`, scenes prefixed `sN_`, `label` 「번외 N」;
 *   - `startState.resources`, the resources the case opens with -- it never
 *     reads the season's;
 *   - `nodes`, scenes written the way a case's built scenes read (phase, title,
 *     speaker, text, memo, place, clock, question, lead, triggers, choices),
 *     each card with an `effect` and a `next`;
 *   - `sN_aftershock`, the scene the case closes on, whose cards lead to
 *     `sN_result`;
 *   - `outcomes`, the three endings, by the id of the aftershock card that
 *     reaches each.
 */
export const side00 = {
  id: "side00",
  label: "번외 0",
  title: "틀 확인용 번외 사건",
  fixture: true,
  startNode: "s0_start",
  startState: {
    resources: { time: 60, capital: 80, trust: 50, legitimacy: 50, humanCost: 10, fatigue: 20 },
  },
  nodes: {
    s0_start: {
      phase: "SIDE 00 BRIEFING",
      title: "TEST DESK",
      speaker: "반재욱",
      kind: "briefing",
      place: "트리거랩 회의실",
      clock: "확인까지 10분",
      question: "번외 사건 칸이 제대로 열리는지 확인합니다. 어느 카드로 시작하겠습니까?",
      lead: "번외 사건 칸을 시험하는 장면입니다. 시즌 저장에는 아무것도 남지 않습니다.",
      text: "반재욱이 빈 서류철 하나를 책상에 올려 둡니다. '오늘은 연습입니다. 고른 카드가 다음 장면으로 이어지는지만 봅니다.'",
      memo: ["시즌 저장과 따로 진행", "랭킹에 오르지 않음"],
      triggers: ["trust"],
      choices: [
        { id: "s0_start_listen", label: "서류철을 열기 전에 반재욱의 설명을 듣는다", effect: { time: -4, trust: 4, fatigue: 2 }, cognition: { persistence: 1 }, next: "s0_desk" },
        { id: "s0_start_check", label: "서류철의 쪽수부터 하나씩 맞춰 본다", effect: { time: -6, legitimacy: 4, fatigue: 2 }, cognition: { inference: 1 }, next: "s0_desk" },
        { id: "s0_start_rush", label: "설명 없이 바로 다음 장면으로 넘긴다", effect: { time: 2, trust: -3, fatigue: 1 }, cognition: { risk: 1 }, next: "s0_desk" },
      ],
    },
    s0_desk: {
      phase: "SIDE 00 DESK",
      title: "SECOND PAGE",
      speaker: "반재욱",
      kind: "scene",
      place: "트리거랩 회의실",
      clock: "확인까지 5분",
      question: "두 번째 장면입니다. 이 장면의 카드는 마지막 장면으로 이어집니다.",
      text: "반재욱이 서류철의 둘째 장을 넘깁니다. '여기까지 왔으면 칸은 열린 겁니다. 마지막 장면에서 결말을 하나 고르면 됩니다.'",
      memo: ["다음 장면에서 결말 셋 가운데 하나"],
      triggers: ["responsibility"],
      choices: [
        { id: "s0_desk_note", label: "확인한 내용을 메모에 적어 둔다", effect: { time: -3, legitimacy: 3, fatigue: 1 }, cognition: { inference: 1 }, next: "s0_aftershock" },
        { id: "s0_desk_ask", label: "반재욱에게 빠진 것이 없는지 묻는다", effect: { time: -3, trust: 3, fatigue: 1 }, cognition: { persistence: 1 }, next: "s0_aftershock" },
        { id: "s0_desk_skip", label: "메모 없이 마지막 장면으로 간다", effect: { time: 2, legitimacy: -2, fatigue: 1 }, cognition: { risk: 1 }, next: "s0_aftershock" },
      ],
    },
    s0_aftershock: {
      phase: "SIDE 00 AFTERMATH",
      title: "THREE ENDINGS",
      speaker: "반재욱",
      kind: "aftermath",
      place: "트리거랩 회의실",
      clock: "마지막 장면",
      question: "결말 셋 가운데 하나를 고릅니다.",
      text: "반재욱이 서류철을 닫습니다. '어느 쪽을 골라도 시즌은 그대로입니다. 고른 결말만 이 기기에 남습니다.'",
      memo: ["고른 결말은 이 기기에만 남음"],
      triggers: ["trust"],
      choices: [
        { id: "s0_after_warm", label: "서류철을 반재욱에게 돌려준다", effect: { trust: 3 }, cognition: { persistence: 1 }, next: "s0_result" },
        { id: "s0_after_record", label: "서류철을 기록함에 넣는다", effect: { legitimacy: 3 }, cognition: { inference: 1 }, next: "s0_result" },
        { id: "s0_after_leave", label: "서류철을 책상에 둔 채 나온다", effect: { time: 2 }, cognition: { risk: 1 }, next: "s0_result" },
      ],
    },
  },
  outcomes: {
    s0_after_warm: { title: "돌려준 서류철", text: "반재욱이 서류철을 받아 듭니다. 연습은 여기까지입니다." },
    s0_after_record: { title: "기록함의 서류철", text: "서류철이 기록함에 들어갑니다. 연습은 여기까지입니다." },
    s0_after_leave: { title: "책상 위의 서류철", text: "서류철은 책상에 남습니다. 연습은 여기까지입니다." },
  },
};
