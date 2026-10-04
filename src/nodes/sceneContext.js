/**
 * Where each scene stands, when it happens, and what it actually asks.
 *
 * Three facts about this season made the graph read as disconnected rooms:
 *
 * 1. The one line of prose the table always shows was generated from a template
 *    (`"<title>: 지금 무엇을 먼저 지킬지 결정해야 합니다."`), so all 149 scenes
 *    asked the same question and the situation the cards answered stayed folded
 *    inside the briefing.
 * 2. The season walks two organisations -- 트리거랩 and whichever body each case
 *    is about -- and nothing on screen ever said which one the analyst was
 *    standing in, or how much of the deadline was left.
 * 3. The route split plays the authored middle out of written order: picking
 *    `layoff` in CASE 01 opens at `payday`, so a scene that leans on the scene
 *    before it is read with that scene missing.
 *
 * So every scene grounds itself. `place` and `clock` print above the speaker,
 * `question` replaces the template, and `lead` opens the briefing with the move
 * that got the analyst into this room. None of it may depend on which scene was
 * played before, because the route split means no scene can know.
 */
import { CASE_PACKS } from "./casePacks.js";

/** The two buildings a case moves between, and the deadline it runs against. */
const caseSetting = {
  final: { place: "트리거랩 기록 보관소 B2", clock: "마지막 밤" },
};

/**
 * Per-scene grounding. A scene may set any of `place`, `clock`, `question` and
 * `lead`; whatever it leaves out falls back to the case setting (place/clock),
 * the previous scene in the case order (place/clock), or the generated template
 * (question). `lead` has no fallback -- a scene without one simply opens on its
 * own body text.
 */
export const sceneContext = {












  // ----------------------------------------------------------------- FINAL
  f_start_owner: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤",
    question: "끝까지 곁에 남은 밤이 '관리자 적합'의 근거로 적혔습니다. 그 집념은 누구에게 이용될 수 있습니까?",
    lead: "달빛 아래 골목에서 모두와 끝까지 남았던 밤이 지나고, 약속한 밤 33층에 오르기 전 B2 문을 먼저 엽니다.",
  },
  f_start_system: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤",
    question: "마흔아홉 사건을 묶은 당신의 폴더가 관찰 자료 1번이 됐습니다. 이 자리를 받겠습니까?",
    lead: "마흔아홉 사건의 기록을 한 폴더로 묶은 새벽, 마지막 빈칸인 B2의 원본 폴더에 접속한 참입니다.",
  },
  f_start_name: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤",
    question: "33층으로 달려간 걸음이 후임 관리자 추천 사유가 됐습니다. 연필로 적힌 그 이름을 받겠습니까?",
    lead: "문자를 받자마자 오른 33층 복도에서 쪽지 한 장을 보고 B2로 내려온 참입니다. 당신의 빠른 걸음이 벌써 실험 자료로 올라가 있습니다.",
  },
  f_start: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤",
    question: "당신의 선택 로그가 다음 사건 설계에 쓰였습니다. 이 사실을 어떻게 다루겠습니까?",
    lead: "33층에 오르기로 한 마지막 밤, 한서윤이 반납하지 않은 열쇠로 옛 트리거랩 B2 기록 보관소부터 엽니다. 반납 목록에서 빠진 케이스데스크 한 대가 아직 켜져 있습니다.",
  },
  f_archive: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤 · 23:10",
    question: "같은 데이터가 사람을 깊게 생각하게도, 쉽게 몰아붙이게도 합니다. 이 자료를 폐기하겠습니까, 규칙을 붙이겠습니까?",
    lead: "옥상에서 절반만 말했던 한서윤이 나머지를 마저 말합니다. 트리거랩은 생각을 깨우는 조건을 연구했고, 그 연구는 그대로 압박 설명서이기도 했습니다. 그리고 당신 책상에 처음 올라온 사례의 번호는 그가 고른 것이 아니었습니다.",
  },
  f_confront: {
    place: "KD금융그룹 본사 33층 옛 그룹전략실",
    clock: "마지막 밤 · 00:40",
    question: "서명란을 비워 둔 사람이 당신 앞에 앉아 있습니다. 그 조건을 봉인하겠습니까, 직접 설계하겠습니까?",
    lead: "보관소에서 나와 33층으로 올라왔습니다. 짐이 빠진 방에서 윤상혁은 3년 전 서류를 이미 책상에 펼쳐 두고 기다리고 있었습니다.",
  },
  f_choice: {
    place: "트리거랩 기록 보관소 B2 · 단말 앞",
    clock: "마지막 밤 · 새벽",
    question: "마흔아홉 사건과 1년의 마지막 선택입니다. 당신의 조건을 약점으로 두겠습니까, 도구로 쓰겠습니까?",
    lead: "마흔아홉 사건과 1년, 그리고 이 밤이 지났습니다. 트리거랩은 없어졌고, 관리자 칸에는 여전히 점 하나가 찍혀 있습니다. 단말 앞에는 당신과, 반납하지 않은 열쇠를 쥔 한서윤이 있습니다.",
  },
  f_witness: {
    place: "트리거랩 기록 보관소 B2 · 이전 참가자 구역",
    clock: "마지막 밤 · 23:40",
    question: "당신보다 먼저 실험을 통과한 사람의 기록이 있습니다. 그에게 먼저 알리겠습니까?",
  },
  f_witness_reaction: {
    place: "트리거랩 기록 보관소 B2 · 이전 참가자 구역",
    clock: "마지막 밤 · 00:05",
    question: "첫 참가자가 자기 기록을 돌려달라고 합니다. 돌려주면 실험 전체가 흔들립니다.",
  },
  f_dilemma: {
    place: "트리거랩 기록 보관소 B2 · 종료 단말",
    clock: "마지막 밤 · 01:20",
    question: "문을 닫으면 기록도 사라지고, 열어두면 같은 압박이 반복됩니다. 종료 조건을 어떻게 설계하겠습니까?",
  },
  f_dilemma_reaction: {
    place: "트리거랩 기록 보관소 B2 · 종료 단말",
    clock: "마지막 밤 · 01:50",
    question: "종료 버튼에 당신의 이름이 떠 있습니다. 혼자 누르겠습니까?",
  },
  f_branch_witness: {
    place: "트리거랩 기록 보관소 B2 · 이전 참가자 구역",
    clock: "마지막 밤 · 00:20",
    question: "이전 기록에 빈칸이 있습니다. 그 빈칸을 누구의 동의로 채우겠습니까?",
  },
  f_branch_witness_follow: {
    place: "트리거랩 기록 보관소 B2 · 단말 앞",
    clock: "마지막 밤 · 01:00",
    question: "에코가 마지막으로 묻습니다. 당신의 기준을 다음 사람에게 넘기겠습니까?",
  },
  f_route_map: {
    place: "트리거랩 기록 보관소 B2 · 설계 로그",
    clock: "마지막 밤 · 23:30",
    question: "내 로그가 만든 사건들이 보입니다. 이 추적을 어디까지 밀겠습니까?",
    lead: "내 로그가 사건 설계에 어떻게 쓰였는지 추적하겠다고 말한 직후입니다.",
  },
  f_route_expose: {
    place: "트리거랩 기록 보관소 B2 · 외부 회선",
    clock: "마지막 밤 · 23:30",
    question: "실험이 밖으로 나갔습니다. 폭로의 피해자를 어떻게 줄이겠습니까?",
    lead: "즉시 외부 공개를 준비하겠다고 말한 직후입니다. 문장이 나가는 순간 되돌릴 수 없습니다.",
  },
  f_route_contain: {
    place: "트리거랩 3층 운영실",
    clock: "마지막 밤 · 23:30",
    question: "안에서 닫을 수 있는지가 관건입니다. 내부 개혁의 조건을 무엇으로 걸겠습니까?",
    lead: "한서윤에게 내부 설명을 요구한 직후입니다. 그는 닫을 방법이 있다고 말합니다.",
  },
  f_route_system: {
    place: "트리거랩 기록 보관소 B2 · 단말 앞",
    clock: "마지막 밤 · 23:30",
    question: "준비된 결말 밖에서 다시 짠 판이 다음 참가자의 선택지가 됐습니다. 그 판을 어떻게 하겠습니까?",
    lead: "세 결말을 모두 내려놓고 판을 다시 짜자, 화면에 다음 참가자의 선택지가 떴습니다. 그중 하나는 방금 당신이 다시 짠 판입니다.",
  },
  f_final_map: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤 · 새벽",
    question: "내 기준을 공개할 것인지 정해야 합니다. 어떻게 하겠습니까?",
  },
  f_final_expose: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤 · 새벽",
    question: "폭로에도 피해자가 생깁니다. 그 범위를 어떻게 줄이겠습니까?",
  },
  f_final_contain: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤 · 새벽",
    question: "도구를 남길 조건을 정해야 합니다. 무엇을 붙이겠습니까?",
  },
  f_final_system: {
    place: "트리거랩 기록 보관소 B2",
    clock: "마지막 밤 · 새벽",
    question: "당신이 다시 짠 판이 다음 사람의 선택지가 됩니다. 그대로 두겠습니까?",
  },
  f_evidence_turn: {
    place: "트리거랩 기록 보관소 B2 · 설계 로그",
    clock: "마지막 밤 · 01:10",
    question: "모든 단서가 당신의 문장을 가리킵니다. 이 연결을 인정하겠습니까?",
  },
  f_aftershock: {
    place: "트리거랩 기록 보관소 B2 · 종료 단말",
    clock: "마지막 밤 · 04:00",
    question: "당신의 선택이 다음 참가자에게 보여지고 있었습니다. 이 실험을 어떤 방식으로 끝내겠습니까?",
    lead: "마지막 폴더가 열립니다. 결말은 이제 사건이 아니라, 실험을 끝내는 방식에 달렸습니다.",
  },
};

/**
 * Stamp the context onto the composed graph.
 *
 * Runs after every generator, so a scene that was written into `nodes` at load
 * time is grounded the same way an authored one is. Anything without its own
 * entry inherits place and clock from the nearest earlier scene in the case
 * order that has them, and finally from the case setting -- a generated scene
 * belongs to the room the scene it grew out of was in.
 */
// A case pack carries its own setting and scene entries.
for (const pack of CASE_PACKS) {
  caseSetting[pack.id] = pack.setting;
  Object.assign(sceneContext, pack.sceneContext);
}

export function applySceneContext(nodes, nodeOrders) {
  for (const [caseId, order] of Object.entries(nodeOrders)) {
    const setting = caseSetting[caseId] ?? {};
    let place = setting.place;
    let clock = setting.clock;
    for (const nodeId of order) {
      const node = nodes[nodeId];
      if (!node) continue;
      const context = sceneContext[nodeId];
      if (context?.place) place = context.place;
      if (context?.clock) clock = context.clock;
      node.place = context?.place ?? place;
      node.clock = context?.clock ?? clock;
      if (context?.question) node.question = context.question;
      if (context?.lead) node.lead = context.lead;
      // Whether the room is closing in is a fact about the scene, like its
      // room and its clock, so a scene may state it here and overrule the
      // graph build's own reading (`pressureBeats` in gameData.js).
      if (typeof context?.pressure === "boolean") node.pressure = context.pressure;
    }
  }
  return nodes;
}
