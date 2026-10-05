export { byEffectWeight, cognitionLabels, costWhenRising, initialResources, isResourceGain, triggerLabels } from "./gameConstants.js";
export { characterProfiles, choiceVoiceLines } from "./gameDialogue.js";
export { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, SEASON_ENTRY_CASE, SEASON_ENTRY_NODE, caseAftermathNodeId, caseDisplayCode, caseNodePrefix, caseObjectives, seasonCasesBase } from "./gameCases.js";
import { finalCaseNodes } from "./nodes/finalCase.js";
import { coreCards } from "./nodes/coreCards.js";
import * as sceneBuild from "./nodes/sceneBuild.js";
import * as seasonRules from "./seasonRules.js";
import { authoredEchoReplies, choiceVoiceLines } from "./gameDialogue.js";
import { CASE_PACKS as AUTHORED_CASE_PACKS } from "./nodes/casePacks.js";
import { authoredNodeOrders, CASE_START_NODES } from "./gameCases.js";

/**
 * Everything below rewires the graph in place: aftermath, connective, reaction,
 * branch and route scenes overwrite `choice.next`, splice choices in and retire
 * nodes. It used to do that to the objects the case files export, so importing
 * `src/nodes/case20.js` after this module handed back a scene whose `next` was
 * not the one written in the file. It works on copies now; the authored modules
 * stay exactly as they read.
 */
const CASE_PACKS = structuredClone(AUTHORED_CASE_PACKS);

/**
 * Every scene of each case, in play order. A copy, like the packs: the
 * generators below grow it, and the authored table belongs to a module the
 * intro shell loads before this one.
 */
export const nodeOrders = structuredClone(authoredNodeOrders);

export { CASE_PACKS };

/** Authored replies plus one for every scene the generators below add. */
export const echoReplies = { ...authoredEchoReplies };

/**
 * What the generators supplied because nobody had written it: the closing
 * scene the hidden routes share, and the line and reply of a choice that had
 * neither. `check:graph` counts what is still standing on this net.
 */
export const fallbackCopy = { scenes: [], voice: [], echo: [] };

function fallBackOn(choiceId, voice, echo) {
  if (!choiceVoiceLines[choiceId]) {
    choiceVoiceLines[choiceId] = voice;
    fallbackCopy.voice.push(choiceId);
  }
  if (!echoReplies[choiceId]) {
    echoReplies[choiceId] = echo;
    fallbackCopy.echo.push(choiceId);
  }
}

/** A scene a table names has to be in the graph; a generator that skipped a mistyped id dropped the scene in silence. */
function sceneOf(nodeId, owner) {
  const scene = nodes[nodeId];
  if (!scene) throw new Error(`${owner} names the scene "${nodeId}", which the graph does not have`);
  return scene;
}

/**
 * The authored scene graph, one file per case. Everything below this literal
 * grows the graph at load time -- aftermath, connective, reaction and branch
 * scenes are written into `nodes` -- so the composed object stays mutable.
 */
export const nodes = structuredClone({
  ...Object.assign({}, ...CASE_PACKS.map((pack) => pack.nodes)),
  ...finalCaseNodes,
});

const aftermathNodes = {
  f_aftershock: {
    phase: "LAST EVIDENCE",
    title: "당신의 선택이 사용되는 밤",
    speaker: "에코",
    text: "마지막 폴더가 열리자, 트리거랩이 당신의 선택을 다음 참가자의 선택지로 복사해 쓰고 있었다는 사실이 드러납니다. 서식 하단에는 수신처가 인쇄돼 있습니다. 그룹전략실 인사기획. 이제 결말은 실험을 끝내는 방식에 달렸습니다.",
    memo: ["당신의 선택 문장이 다음 테스트의 선택지로 복제됨", "단서가 많을수록 실험 설계자 이름에 가까워짐", "외부 공개와 내부 개혁 모두 누군가의 피해를 요구함"],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      { id: "f_after_witness", label: "모든 기록을 증거로 보존하고 외부 증언을 준비한다", effect: { legitimacy: 13, trust: 5, humanCost: -4, fatigue: 8 }, next: "final_result", cognition: { inference: 2, persistence: 1 } },
      { id: "f_after_control", label: "실험을 멈추지 않고 참가자 동의 규칙부터 바꾼다", effect: { trust: 11, legitimacy: 9, fatigue: 10 }, next: "final_result", cognition: { reframing: 3 } },
      { id: "f_after_burn", label: "모든 데이터를 태워 누구도 다시 이용하지 못하게 한다", effect: { legitimacy: 7, trust: -6, humanCost: 4, fatigue: 5 }, next: "final_result", cognition: { risk: 2 } },
    ],
  },
};

CASE_PACKS.forEach((pack) => Object.assign(aftermathNodes, pack.aftermath));
for (const [nodeId, scene] of Object.entries(aftermathNodes)) nodes[nodeId] = { ...scene, kind: "aftermath" };

// [case, the scene that closes it, its aftermath]. 사건 01-05 close on their
// routes' own finals (`registerDramaticRoutePlan`), so their packs name no scene.
const aftermathRoutes = [
  ...CASE_PACKS.map(({ id, aftermathRoute: [finalId, aftershockId] }) => [id, finalId, aftershockId]),
  ["final", "f_choice", "f_aftershock"],
];
aftermathRoutes.forEach(([caseId, nodeId, nextNode]) => {
  if (nodeId) {
    const closing = Object.assign(sceneOf(nodeId, `${caseId} aftermath route`), { kind: "decision" });
    closing.choices.forEach((choice) => { choice.next = nextNode; });
  }
  nodeOrders[caseId].push(nextNode);
});

/**
 * The scenes that grow out of an authored one: a connective scene follows the
 * scene named in `after`, and a reaction scene follows a connective scene.
 * Each choice carries its own label, effect, line and reply. They were four
 * lists matched by position -- labels on the scene, effects, voice and echo in
 * tables keyed by the scene before -- and a list edited without the others
 * answered one button with another's line.
 *
 * A connective choice is a real trade: the people-first option pays in cash or
 * time, the procedure-first option makes someone wait (`humanCost`), and the
 * profit-first option is the only one that gives `fatigue` back. A reaction
 * scene asks who carries the decision forward, so that is where `fatigue`
 * comes back: handing the work on or closing the file recovers you and
 * charges someone else.
 *
 * The finale's are written here; every other case's are on its pack.
 */
const connectiveScenes = [
  {
    id: "f_witness",
    after: "f_archive",
    next: "f_confront",
    title: "첫 번째 참가자",
    speaker: "도윤하",
    text: "보관소 안에는 당신보다 먼저 실험을 통과한 사람의 기록이 있습니다. 그 사람은 자신의 반응이 다른 사람의 선택지를 만드는 데 쓰였다는 사실을 몰랐습니다.",
    memo: ["이전 참가자의 동의 기록이 없음", "선택 문장이 다음 사건의 대사로 복제됨", "실험 설계자는 책임을 분산시킴"],
    choices: [
      {
        label: "이전 참가자에게 먼저 알린다",
        effect: { trust: 9, legitimacy: 6, capital: -4, time: -6, fatigue: 6 },
        voice: "이전 참가자에게 그의 기록이 남아 있다는 사실부터 알리겠습니다.",
        echo: "먼저 알리면 실험은 흔들리고, 그는 처음으로 자기 기록을 가진 사람이 됩니다.",
      },
      {
        label: "복제된 문장을 모두 증거로 수집한다",
        effect: { legitimacy: 9, humanCost: 2, capital: -5, time: -8, fatigue: 6 },
        voice: "복제된 문장을 전부 증거로 모으겠습니다.",
        echo: "모은 문장은 실험을 증명하고, 모으는 동안 실험은 계속 돌아갑니다.",
      },
      {
        label: "실험을 멈추기 위해 서버를 닫는다",
        effect: { humanCost: -6, legitimacy: -6, trust: -4, capital: -7, time: 5, fatigue: -4 },
        voice: "지금 서버를 닫아 실험을 멈추겠습니다.",
        echo: "닫힌 서버는 실험을 끝내고, 그 안의 기록도 함께 잠급니다.",
      },
    ],
  },
  {
    id: "f_dilemma",
    after: "f_confront",
    next: "f_choice",
    title: "끝내는 방법",
    speaker: "에코",
    text: "문을 닫으면 기록도 사라집니다. 문을 열어두면 더 많은 사람이 같은 압박을 받습니다. 당신은 이제 답이 아니라 종료 조건을 설계해야 합니다.",
    memo: ["서버 종료 권한은 당신에게 있음", "외부 공개 전 백업이 생성됨", "참가자 동의 절차는 아직 바꿀 수 있음"],
    choices: [
      {
        label: "모든 참가자에게 사실을 알린다",
        effect: { trust: 9, legitimacy: 7, capital: -6, time: -5, fatigue: 6 },
        voice: "관찰된 사실을 숨기지 않고 모든 참가자에게 알리겠습니다.",
        echo: "관찰은 공개될 때 조작이 아니라 기록이 될 수 있습니다.",
      },
      {
        label: "동의와 감시 규칙을 먼저 만든다",
        effect: { legitimacy: 9, humanCost: 2, capital: -4, time: -8, fatigue: 5 },
        voice: "동의와 감시 규칙부터 먼저 만들겠습니다.",
        echo: "종료 권한 없는 실험은 참가자의 동의로 끝나지 않습니다.",
      },
      {
        label: "실험 데이터를 전부 폐기한다",
        effect: { humanCost: -7, legitimacy: -7, trust: -5, capital: -8, time: 5, fatigue: -4 },
        voice: "실험 데이터를 전부 폐기하겠습니다.",
        echo: "폐기된 데이터는 피해를 멈추고, 무엇이 있었는지 증명할 방법도 함께 지웁니다.",
      },
      {
        label: "실험을 이어가되 나를 다음 참가자로 등록한다",
        effect: { trust: 6, legitimacy: 5, humanCost: -4, capital: -5, fatigue: 9 },
        voice: "실험을 이어가되 다음 참가자 자리에 제 이름을 넣겠습니다.",
        echo: "자신을 넣는 선택은 실험을 멈추지 않고 관찰자만 한 명 줄입니다.",
      },
    ],
  },
  ...CASE_PACKS.flatMap((pack) => pack.connectiveScenes),
];

const reactionScenes = [
  {
    id: "f_witness_reaction",
    after: "f_witness",
    next: "f_confront",
    title: "첫 참가자의 선택",
    speaker: "반재욱",
    text: "첫 참가자는 자신의 기록을 돌려달라고 요청합니다. 하지만 기록을 돌려주면 지금까지의 실험 전체가 흔들립니다.",
    memo: ["이전 참가자가 돌려받을 기록", "동의 없이 복제된 문장"],
    choices: [
      {
        label: "기록을 돌려주고 실험을 다시 설명한다",
        effect: { trust: 9, legitimacy: 7, time: -7, fatigue: 6 },
        voice: "기록을 돌려주고 실험을 처음부터 다시 설명하겠습니다.",
        echo: "돌려준 기록은 실험을 흔들고 참가자를 사람으로 되돌립니다.",
      },
      {
        label: "기록을 증거로 보관하고 동의를 요청한다",
        effect: { legitimacy: 8, trust: -3, humanCost: 2, time: -5, fatigue: 4 },
        voice: "기록은 증거로 두고 동의를 요청하겠습니다.",
        echo: "동의를 요청하는 순간 실험의 전제가 처음으로 공개됩니다.",
      },
      {
        label: "기록을 삭제해 피해를 끝낸다",
        effect: { humanCost: -5, legitimacy: -8, trust: -4, time: 5, fatigue: -4 },
        voice: "기록을 지워 피해를 끝내겠습니다.",
        echo: "지운 기록은 피해를 멈추고 책임도 함께 지웁니다.",
      },
    ],
  },
  {
    id: "f_dilemma_reaction",
    after: "f_dilemma",
    next: "f_choice",
    title: "종료 버튼 앞에서",
    speaker: "에코",
    text: "종료 버튼 위에는 당신의 이름이 표시되어 있습니다. 누르는 순간 실험은 끝나지만, 책임도 당신에게 남습니다.",
    memo: ["종료 버튼을 누를 권한", "참가자들과 합의할 종료 조건"],
    choices: [
      {
        label: "참가자들과 함께 종료 조건을 정한다",
        effect: { trust: 8, legitimacy: 8, time: -8, fatigue: 6 },
        voice: "종료 조건을 참가자들과 함께 정하겠습니다.",
        echo: "함께 정한 종료 조건은 느리지만 다음 실험에도 남습니다.",
      },
      {
        label: "내가 혼자 버튼을 누른다",
        effect: { legitimacy: 6, humanCost: -5, trust: -4, capital: -5, fatigue: 8 },
        voice: "제가 혼자 버튼을 누르겠습니다.",
        echo: "혼자 누르면 끝나고, 그 결정의 근거는 아무도 검토하지 않습니다.",
      },
      {
        label: "버튼을 숨기고 시스템을 지켜본다",
        effect: { time: 6, trust: -7, legitimacy: -6, humanCost: 6, fatigue: -5 },
        voice: "버튼을 숨기고 시스템을 지켜보겠습니다.",
        echo: "숨긴 버튼은 통제가 아니라 다음 관찰자의 권한이 됩니다.",
      },
    ],
  },
  ...CASE_PACKS.flatMap((pack) => pack.reactionScenes),
];

// A phase is printed on the scene chip and in the mission strip, so it is
// player-facing copy, not a pipeline label. These scenes were shipping as
// "CONNECTIVE SCENE" -- the name of the function that builds them -- for the
// same reason the reaction, branch and route-final families read as build
// steps. They are all the same story beat: the part that happens outside the
// meeting that was scheduled.
const GENERATED_SCENE_PHASES = { connective: "OFF THE RECORD", reaction: "THE ROOM AFTER" };
const REACTION_MEMO_FALLBACK = ["다음 선택에 남은 비용", "다음 장면에서 다시 확인할 말"];

function addGeneratedScene(kind, { id, after, next, title, speaker, text, memo, choices }) {
  const source = sceneOf(after, `${kind} scene ${id}`);
  source.choices.forEach((choice) => { choice.next = id; });
  nodes[id] = {
    phase: GENERATED_SCENE_PHASES[kind],
    kind,
    title,
    speaker,
    text,
    memo: memo ?? REACTION_MEMO_FALLBACK,
    triggers: source.triggers,
    choices: choices.map(({ label, effect, voice, echo }, index) => {
      const choice = {
        id: `${id}_choice_${index + 1}`,
        label,
        effect,
        next,
        cognition: sceneBuild.inferChoiceCognition(label, effect),
      };
      choiceVoiceLines[choice.id] = voice;
      echoReplies[choice.id] = echo;
      return choice;
    }),
  };
}

connectiveScenes.forEach((scene) => addGeneratedScene("connective", scene));

// A connective scene is played right after the scene it follows.
connectiveScenes.forEach(({ id, after }) => {
  const order = Object.values(nodeOrders).find((candidate) => candidate.includes(after));
  if (!order) throw new Error(`connective scene ${id} follows ${after}, which is in no case`);
  order.splice(order.indexOf(after) + 1, 0, id);
});

reactionScenes.forEach((scene) => addGeneratedScene("reaction", scene));

reactionScenes.forEach(({ id, after }) => {
  const order = Object.values(nodeOrders).find((candidate) => candidate.includes(after));
  if (!order) throw new Error(`reaction scene ${id} follows ${after}, which is in no case`);
  order.splice(order.indexOf(after) + 1, 0, id);
});

// Each case has one authored detour. The second scene always rejoins the existing route.
const authoredBranchScenes = {
  f_branch_witness: {
    phase: "SIDE DOOR",
    title: "이전 기록의 빈칸",
    speaker: "한서윤",
    text: "이전 참가자의 기록은 당신의 선택과 닮았지만, 마지막 한 줄만 비어 있습니다. 그 빈칸이 실험의 목적일 수 있습니다.",
    memo: ["이전 참가자의 선택", "삭제된 마지막 문장", "기록을 읽는 권한"],
    triggers: ["selfAwareness", "curiosity"],
    choices: [
      { id: "f_branch_witness_a", label: "빈칸을 참가자들에게 공개한다", effect: { legitimacy: 9, trust: 6, time: -7, capital: -5 }, next: "f_branch_witness_follow", cognition: { inference: 2 } },
      { id: "f_branch_witness_b", label: "삭제 흔적부터 복원한다", effect: { time: -8, capital: -3, legitimacy: 7 }, next: "f_branch_witness_follow", cognition: { persistence: 1 } },
      { id: "f_branch_witness_c", label: "기록의 결론만 믿고 넘어간다", effect: { time: 6, trust: -7, humanCost: 4, fatigue: -3 }, next: "f_branch_witness_follow", cognition: { risk: 2 } },
    ],
  },
  f_branch_witness_follow: {
    phase: "SIDE DOOR",
    title: "에코의 마지막 질문",
    speaker: "에코",
    text: "기록을 읽는 사람도 기록의 일부가 됩니다. 당신의 조건을 누가 다시 읽게 될지 정해야 합니다.",
    memo: ["열람자의 범위", "재현 가능한 선택", "종료 조건"],
    triggers: ["selfAwareness", "choice"],
    choices: [
      { id: "f_branch_witness_follow_a", label: "모든 참가자에게 열람 권한을 준다", effect: { legitimacy: 8, trust: 7, time: -6, capital: -5, fatigue: 3 }, next: "f_choice", cognition: { reframing: 1 } },
      { id: "f_branch_witness_follow_b", label: "독립 검토자에게 먼저 맡긴다", effect: { trust: 5, capital: -5, legitimacy: 9 }, next: "f_choice", cognition: { inference: 2 } },
      { id: "f_branch_witness_follow_c", label: "내 기록만 보관하고 문을 닫는다", effect: { time: 5, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -4 }, next: "f_choice", cognition: { risk: 1 } },
    ],
  },
};

/**
 * Conditions that decide whether a detour opens on this run.
 *
 * Two of the six forks are gated so the detour is not simply a column the
 * player learns to pick. Both default to open when the context is missing, so
 * a debug jump or a fresh crawl still reaches the scenes.
 */
// caseId, source scene, which column carries the detour, the two detour scenes,
// and the optional condition that has to hold for the detour to open. The
// column differs per case on purpose: one fixed column would teach the player
// that the hidden scenes always sit behind the same button.
const authoredBranchPlans = [
  ["final", "f_confront", 0, "f_branch_witness", "f_branch_witness_follow"],
];

for (const pack of CASE_PACKS) {
  Object.assign(authoredBranchScenes, pack.branchScenes);
  authoredBranchPlans.push([pack.id, ...pack.branchPlan]);
}

authoredBranchPlans.forEach(([caseId, sourceId, choiceIndex, firstId, secondId, conditionId]) => {
  const source = sceneOf(sourceId, `${caseId} branch plan`);
  const unwritten = [firstId, secondId].find((branchId) => !authoredBranchScenes[branchId]);
  if (unwritten) throw new Error(`${caseId} branch plan names the scene "${unwritten}", which no branch table writes`);
  if (!source.choices[choiceIndex] || source.choices[choiceIndex].type === "reframe") {
    throw new Error(`${caseId} branch plan puts its detour on card ${choiceIndex + 1} of ${sourceId}, which is not a card that scene deals`);
  }
  const bypassNodeId = source.choices[choiceIndex].next;
  source.choices[choiceIndex] = {
    ...source.choices[choiceIndex],
    next: firstId,
    branchId: firstId,
    ...(conditionId ? { branchCondition: conditionId, branchBypass: bypassNodeId } : {}),
  };
  nodes[firstId] = { ...authoredBranchScenes[firstId], kind: "branch" };
  nodes[secondId] = { ...authoredBranchScenes[secondId], kind: "branch" };
  const order = nodeOrders[caseId];
  const sourceOrderIndex = order.indexOf(sourceId);
  if (sourceOrderIndex < 0) throw new Error(`${caseId} branch plan leaves from ${sourceId}, which is not in the case`);
  order.splice(sourceOrderIndex + 1, 0, firstId, secondId);
});

const case02RouteNodes = {
  c2_route_report: {
    phase: "PROCEDURE ROUTE",
    title: "보고서가 먼저 움직인다",
    speaker: "한서윤",
    text:
      "당신의 1차 보고가 올라가자 보안팀은 이민서의 계정을 잠그고 징계 절차를 예고합니다. 이제 질문은 '그가 했는가'가 아니라 '잘못된 절차를 어디서 멈출 수 있는가'로 바뀝니다.",
    memo: [
      "징계 예고 문서가 먼저 생성됨",
      "오진우 보고서가 공식 초안에 붙음",
      "반박 자료는 절차 밖 문서로 분류됨",
    ],
    triggers: ["order", "responsibility", "injustice"],
    choices: [
      {
        id: "c2_route_report_hold",
        label: "징계 문서에 임시 보류 조건을 삽입한다",
        effect: { legitimacy: 8, trust: 3, time: -7, capital: -3, humanCost: -3, fatigue: 5 },
        next: "c2_pressure",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c2_route_report_sign",
        label: "절차대로 서명하되 반박 가능성을 각주로 남긴다",
        effect: { time: 5, legitimacy: 5, trust: -6, humanCost: 5, fatigue: -3 },
        next: "c2_pressure",
        cognition: { risk: 2 },
      },
      {
        id: "c2_route_report_reopen",
        label: "보고서 자체를 증거로 삼아 누가 서둘렀는지 추적한다",
        effect: { legitimacy: 10, trust: -2, time: -8, capital: -4, fatigue: 6 },
        next: "c2_pressure",
        cognition: { reframing: 2, inference: 1 },
      },
    ],
  },
  c2_route_person: {
    phase: "WITNESS ROUTE",
    title: "기록보다 먼저 도착한 사람",
    speaker: "도윤하",
    text:
      "이민서는 당신이 오기 전부터 병원 접수 메시지를 들고 기다리고 있었습니다. 보호는 이제 감정적 선택이 아니라, 말할 수 있는 조건을 설계하는 문제가 됩니다.",
    memo: [
      "응급실 접수 문자는 원본 확인 전",
      "비공식 접촉 자체가 절차 위반으로 기록될 수 있음",
      "이민서는 유출 파일의 일부 문장을 알아봄",
    ],
    triggers: ["trust", "protection", "responsibility"],
    choices: [
      {
        id: "c2_route_person_record",
        label: "이민서가 직접 말할 수 있는 공식 기록 자리를 만든다",
        effect: { trust: 9, legitimacy: 3, time: -7, capital: -4, humanCost: -4, fatigue: 6 },
        next: "c2_meeting",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c2_route_person_shield",
        label: "당신이 대신 진술해 당장의 노출을 줄인다",
        effect: { trust: 6, legitimacy: -5, humanCost: -5, time: -5, fatigue: 7 },
        next: "c2_meeting",
        cognition: { persistence: 2 },
      },
      {
        id: "c2_route_person_trade",
        label: "보호를 조건으로 파일 출처를 먼저 묻는다",
        effect: { capital: 5, trust: -5, legitimacy: -2, humanCost: 3, fatigue: -3 },
        next: "c2_meeting",
        cognition: { risk: 2, inference: 1 },
      },
    ],
  },
  c2_route_origin: {
    phase: "ORIGIN ROUTE",
    title: "원본이 답을 거부한다",
    speaker: "반재욱",
    text:
      "원본 로그를 열자 복사본에는 없는 11초의 공백이 보입니다. 이민서의 이름보다 먼저, 누가 그 공백을 보고서에서 지웠는지가 새로운 질문이 됩니다.",
    memo: [
      "원본과 백업의 해시가 서로 다름",
      "공백 직후 관리자 토큰이 한 번 사용됨",
      "플로우온 심사 보고서 스캔이 증거물로 재분류됨",
    ],
    triggers: ["curiosity", "injustice", "order"],
    choices: [
      {
        id: "c2_route_origin_freeze",
        label: "원본과 백업을 모두 동결하고 차이를 공개한다",
        effect: { legitimacy: 9, trust: 3, capital: -5, time: -8, fatigue: 6 },
        next: "c2_logs",
        cognition: { inference: 3 },
      },
      {
        id: "c2_route_origin_token",
        label: "관리자 토큰 사용자를 추적한다",
        effect: { legitimacy: 6, trust: -2, time: -9, capital: -3, humanCost: 2, fatigue: 5 },
        next: "c2_logs",
        cognition: { persistence: 1, inference: 2 },
      },
      {
        id: "c2_route_origin_patch",
        label: "공백을 오류로 패치하고 보고 마감을 맞춘다",
        effect: { time: 6, capital: 4, legitimacy: -8, trust: -4, humanCost: 5, fatigue: -4 },
        next: "c2_logs",
        cognition: { risk: 2 },
      },
    ],
  },
  c2_route_system: {
    phase: "HIDDEN ROUTE",
    title: "당신의 질문이 로그를 깨운다",
    speaker: "에코",
    text:
      "준비된 선택지 밖으로 판을 다시 짜자, 보안 로그 한 줄이 새로 열립니다. 이 사건은 이민서의 혐의가 아니라 분석관의 판단을 복제하는 실험일 수 있습니다.",
    memo: [
      "다시 짠 판이 테스트 데이터와 대조됨",
      "사건 01의 선택 문장 일부가 유출 파일과 일치",
      "에코는 이 경로를 공식 절차에 남기지 않음",
    ],
    triggers: ["curiosity", "selfAwareness", "responsibility"],
    choices: [
      {
        id: "c2_route_system_copy",
        label: "복제된 선택 문장을 증거로 보존한다",
        effect: { legitimacy: 9, trust: 4, capital: -5, time: -7, fatigue: 6 },
        next: "c2_branch_records",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c2_route_system_warn",
        label: "다음 참가자에게 이 실험 가능성을 먼저 경고한다",
        effect: { trust: 8, legitimacy: -3, humanCost: -5, capital: -4, fatigue: 7 },
        next: "c2_branch_records",
        cognition: { reframing: 2 },
      },
      {
        id: "c2_route_system_hide",
        label: "실험 흔적을 숨기고 이민서 사건만 해결한다",
        effect: { time: 6, capital: 5, legitimacy: -7, trust: -5, humanCost: 4, fatigue: -4 },
        next: "c2_branch_records",
        cognition: { risk: 2 },
      },
    ],
  },
  c2_final_evidence: {
    phase: "FINAL DECISION",
    title: "절차가 만든 범인",
    speaker: "한서윤",
    text:
      "징계 절차는 이미 움직이고 있습니다. 마지막 질문은 이민서가 유출자인지보다, 잘못 시작된 절차를 어디서 공개적으로 멈출 것인지입니다.",
    memo: [
      "보안팀 초안은 이민서 단독 책임으로 닫힘",
      "보류 조건을 넣으면 보고 마감이 깨짐",
      "절차를 그대로 두면 반박권이 사후 처리됨",
    ],
    triggers: ["order", "injustice", "responsibility"],
    choices: [
      {
        id: "c2_final_evidence_stop",
        label: "징계보다 먼저 반박권과 원본 검증을 공개 조건으로 건다",
        effect: { legitimacy: 9, trust: 6, time: -8, capital: -4, humanCost: -5, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c2_final_evidence_file",
        label: "1차 보고를 올리되 절차 결함을 별도 사건으로 등록한다",
        effect: { legitimacy: 7, trust: -3, humanCost: 3, time: -3, fatigue: 4 },
        next: "c2_aftershock",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c2_final_evidence_close",
        label: "오진우 초안대로 닫고, 책임은 사후 감사에 맡긴다",
        effect: { time: 7, capital: 5, trust: -10, legitimacy: -4, humanCost: 8, fatigue: -4 },
        next: "c2_aftershock",
        cognition: { risk: 2 },
      },
    ],
  },
  c2_final_person: {
    phase: "FINAL DECISION",
    title: "보호는 누구의 목소리인가",
    speaker: "도윤하",
    text:
      "이민서를 보호한 덕분에 새로운 말이 생겼지만, 그 말을 당신이 대신 정리하면 다시 그의 목소리가 사라집니다. 마지막 질문은 보호할 것인지, 말할 권한을 돌려줄 것인지입니다.",
    memo: [
      "이민서는 자기 진술을 직접 확인하고 싶어 함",
      "실명 공개는 즉시 위험을 키움",
      "대리 진술은 안전하지만 당사자성을 지움",
    ],
    triggers: ["trust", "protection", "responsibility"],
    choices: [
      {
        id: "c2_final_person_voice",
        label: "이민서가 직접 진술하고 공개 범위를 고르게 한다",
        effect: { trust: 10, legitimacy: 5, capital: -5, time: -7, humanCost: -5, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c2_final_person_proxy",
        label: "당신이 대신 진술해 이름을 잠시 가린다",
        effect: { trust: 6, legitimacy: -4, humanCost: -6, time: -4, fatigue: 6 },
        next: "c2_aftershock",
        cognition: { persistence: 2 },
      },
      {
        id: "c2_final_person_release",
        label: "보호를 풀고 공식 조사에서 스스로 증명하게 한다",
        effect: { time: 6, legitimacy: 6, trust: -9, humanCost: 7, fatigue: -4 },
        next: "c2_aftershock",
        cognition: { risk: 2 },
      },
    ],
  },
  c2_final_system: {
    phase: "FINAL DECISION",
    title: "범인이 아니라 설계자",
    speaker: "에코",
    text:
      "로그의 공백, 복제된 선택 문장, 사후에 정리된 보고서가 한 방향을 가리킵니다. 마지막 질문은 한 사람의 혐의를 닫을지, 사건을 만든 구조를 공개할지입니다.",
    memo: [
      "사건 01 선택 문장이 테스트 데이터로 재사용됨",
      "관리자 토큰은 아직 실명 확인 전",
      "공개하면 이민서의 혐의는 약해지지만 실험 전체가 흔들림",
    ],
    triggers: ["curiosity", "selfAwareness", "injustice"],
    choices: [
      {
        id: "c2_final_system_expose",
        label: "개인 혐의보다 실험 설계 가능성을 공식화한다",
        effect: { legitimacy: 10, trust: 5, capital: -6, time: -8, fatigue: 8 },
        next: "c2_aftershock",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "c2_final_system_trace",
        label: "관리자 토큰 실명을 확인할 때까지 모든 결론을 보류한다",
        effect: { legitimacy: 7, trust: 4, time: -10, capital: -4, humanCost: -3, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { inference: 3 },
      },
      {
        id: "c2_final_system_contain",
        label: "실험 흔적은 봉인하고 이민서 혐의만 낮춰 보고한다",
        effect: { time: 5, capital: 5, trust: -5, legitimacy: -6, humanCost: 3, fatigue: -4 },
        next: "c2_aftershock",
        cognition: { risk: 2 },
      },
    ],
  },
};

function registerCase02DramaticRoutes() {
  for (const [nodeId, scene] of Object.entries(case02RouteNodes)) {
    nodes[nodeId] = { ...scene, kind: nodeId.startsWith("c2_route_") ? "route" : "routeFinal" };
  }
  Object.assign(choiceVoiceLines, {
    c2_route_report_hold: "징계 문서에 멈춤 조건을 끼워 넣어, 절차가 사람을 앞질러 가지 못하게 한다.",
    c2_route_report_sign: "보고는 올리되, 반박 가능성을 작은 각주로 남긴다.",
    c2_route_report_reopen: "보고서가 왜 이렇게 빨리 완성됐는지부터 다시 추적한다.",
    c2_route_person_record: "비공식 접촉은 그 자체로 절차 위반이 될 수 있어서, 이민서가 직접 말할 수 있는 공식 기록 자리를 만든다.",
    c2_route_person_shield: "위험을 줄이기 위해, 이민서의 말을 내 이름으로 대신 제출한다.",
    c2_route_person_trade: "이민서가 유출 파일의 문장 일부를 알아봤으니, 보호를 조건으로 파일 출처를 먼저 묻는다.",
    c2_route_origin_freeze: "해시가 서로 달라 어느 쪽도 손대면 안 되니, 원본과 백업을 모두 동결하고 차이를 공개한다.",
    c2_route_origin_token: "공백 직후 깨어난 관리자 토큰의 주인을 쫓는다.",
    c2_route_origin_patch: "11초짜리 공백 하나로 보고를 늦출 수는 없다며, 공백을 오류로 패치하고 보고 마감을 맞춘다.",
    c2_route_system_copy: "복제된 선택 문장을 증거로 남겨, 사건의 주어를 바꾼다.",
    c2_route_system_warn: "사건 01의 선택 문장이 유출 파일과 일치했으니, 다음 참가자에게 이 실험 가능성을 먼저 경고한다.",
    c2_route_system_hide: "실험일 수 있다는 건 아직 가능성뿐이라, 실험 흔적을 숨기고 이민서 사건만 해결한다.",
    c2_final_evidence_stop: "잘못 시작된 절차가 사람부터 벌하지 않게, 징계보다 먼저 반박권과 원본 검증을 공개 조건으로 건다.",
    c2_final_evidence_file: "보류 조건을 넣으면 보고 마감이 깨지니, 1차 보고를 올리되 절차 결함을 별도 사건으로 등록한다.",
    c2_final_evidence_close: "징계 절차가 이미 움직이고 있어 멈추기엔 늦었다며, 오진우 초안대로 닫고 책임은 사후 감사에 맡긴다.",
    c2_final_person_voice: "이민서에게 자기 진술의 공개 범위를 직접 고르게 한다.",
    c2_final_person_proxy: "그의 이름을 가리기 위해 내가 대신 진술한다.",
    c2_final_person_release: "가려 둔 동안에는 그의 말이 힘을 얻지 못한다며, 보호를 풀고 공식 조사에서 스스로 증명하게 한다.",
    c2_final_system_expose: "한 사람의 혐의 대신, 실험 설계 가능성을 공식 문장으로 세운다.",
    c2_final_system_trace: "관리자 토큰이 아직 누구 것인지 모르는 채로는 닫을 수 없어서, 실명을 확인할 때까지 모든 결론을 보류한다.",
    c2_final_system_contain: "공개하면 실험 전체가 흔들린다는 걸 알기에, 실험 흔적은 봉인하고 이민서 혐의만 낮춰 보고한다.",
  });
  Object.assign(echoReplies, {
    c2_route_report_hold: "보류 조건은 절차를 늦추지만, 잘못 움직인 절차도 기록으로 붙잡습니다.",
    c2_route_report_sign: "각주는 사람을 구하기에는 작고, 나중에 책임을 증명하기에는 충분할 수 있습니다.",
    c2_route_report_reopen: "보고서의 속도를 조사하면 범인보다 설계자가 먼저 보일 수 있습니다.",
    c2_route_person_record: "말할 자리를 만든 보호는 의심받을 권리까지 남깁니다.",
    c2_route_person_shield: "대신 말하면 안전해지지만, 그 사람의 목소리는 다시 당신의 문장이 됩니다.",
    c2_route_person_trade: "보호를 거래로 쓰는 순간 관계는 빨리 움직이고 오래 상합니다.",
    c2_route_origin_freeze: "원본을 얼리면 누구도 쉽게 결론을 고치지 못합니다.",
    c2_route_origin_token: "토큰을 쫓는 선택은 사람의 이름보다 권한의 이동을 보게 합니다.",
    c2_route_origin_patch: "패치는 마감을 구하지만 공백의 의미도 함께 지웁니다.",
    c2_route_system_copy: "선택 문장이 증거가 되면 플레이어도 사건 안으로 들어옵니다.",
    c2_route_system_warn: "경고는 다음 사람을 지키지만 실험자에게도 당신의 위치를 알립니다.",
    c2_route_system_hide: "흔적을 숨기면 사건은 작아지고, 같은 실험은 계속될 수 있습니다.",
    c2_final_evidence_stop: "절차를 멈추는 문장은 늦지만, 다음 징계의 기준이 됩니다.",
    c2_final_evidence_file: "별도 사건은 오늘의 마감을 살리고 내일의 책임을 만듭니다.",
    c2_final_evidence_close: "빠른 종결은 운영을 지키지만 반박권을 사후 처리로 밀어냅니다.",
    c2_final_person_voice: "목소리를 돌려주면 보호는 통제가 아니라 권한이 됩니다.",
    c2_final_person_proxy: "대리 진술은 안전을 사지만 당사자의 선택을 다시 빼앗습니다.",
    c2_final_person_release: "보호를 푸는 순간 공식성은 올라가고 사람의 비용도 올라갑니다.",
    c2_final_system_expose: "구조를 공개하면 이민서의 이름은 흐려지고 실험 전체가 흔들립니다.",
    c2_final_system_trace: "결론을 미루는 동안 위험은 남지만 증거의 방향은 선명해집니다.",
    c2_final_system_contain: "봉인은 피해를 줄일 수 있지만, 실험의 권한은 그대로 남습니다.",
  });

  const routeByStartChoice = {
    c2_start_report: "c2_route_report",
    c2_start_meet: "c2_route_person",
    c2_start_verify: "c2_route_origin",
    free: "c2_logs",
  };
  nodes.c2_start.choices.forEach((choice) => {
    if (routeByStartChoice[choice.id]) choice.next = routeByStartChoice[choice.id];
  });
  nodes.c2_pressure.choices.forEach((choice) => { choice.next = "c2_judgment"; });
  nodes.c2_judgment_reaction.choices.forEach((choice) => { choice.next = "c2_final_evidence"; });
  nodes.c2_witness_reaction.choices.forEach((choice) => { choice.next = "c2_final_person"; });
  nodes.c2_trace_reaction.choices.forEach((choice) => { choice.next = "c2_final_system"; });
  nodes.c2_branch_records_follow.choices.forEach((choice) => { choice.next = "c2_final_system"; });

  const order = nodeOrders.case02;
  const startIndex = order.indexOf("c2_start");
  if (startIndex >= 0) {
    order.splice(startIndex + 1, 0, "c2_route_report", "c2_route_person", "c2_route_origin", "c2_route_system");
  }
  const aftershockIndex = order.indexOf("c2_aftershock");
  const finalInsertIndex = aftershockIndex >= 0 ? aftershockIndex : order.length;
  order.splice(finalInsertIndex, 0, "c2_final_evidence", "c2_final_person", "c2_final_system");
}

registerCase02DramaticRoutes();

const dramaticRoutePlans = {
  final: {
    start: "f_start",
    result: "f_aftershock",
    defaultFree: "f_route_system",
    choices: {
      f_start_map: {
        route: "f_route_map",
        final: "f_final_map",
        phase: "TRACE ROUTE",
        title: "내 로그가 만든 사건들",
        speaker: "에코",
        text: "당신의 선택 로그를 따라가자 각 케이스의 질문이 조금씩 조정된 기록이 보입니다. 이 마지막 폴더는 해결해야 할 문제가 아니라, 당신의 기준이 남긴 흔적입니다.",
        memo: ["선택 로그와 사건 설계 변경 기록 일치", "응답 시간이 압박 조건으로 재사용됨", "일부 선택 문장은 다음 참가자 선택지로 복제됨"],
        triggers: ["curiosity", "selfAwareness", "responsibility"],
        routeChoices: [
          // Cheaper in money than the routes that stage a confrontation: the
          // records already exist, so this route pays in time and trust instead.
          // It is also what keeps the trace column from being dominated once the
          // route walks its authored scenes.
          ["f_route_map_open", "내 로그가 바꾼 질문을 모두 공개한다", { legitimacy: 10, trust: 5, capital: -3, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["f_route_map_delete", "내 로그만 삭제하고 다른 참가자 기록은 남긴다", { trust: -5, legitimacy: -4, humanCost: 5, time: 5, fatigue: -4 }, { risk: 2 }],
          ["f_route_map_return", "복제된 선택지를 원래 참가자에게 돌려준다", { trust: 9, legitimacy: 6, capital: -7, humanCost: -5, fatigue: 8 }, { reframing: 2 }],
        ],
        finalTitle: "내 기준을 공개할 것인가",
        finalText: "당신이 만든 질문은 이미 다른 사람에게 쓰였습니다. 이제 그 사실을 증거로 열지, 조용히 지울지 정해야 합니다.",
        finalMemo: ["공개하면 모든 케이스의 전제가 흔들림", "삭제는 악용을 줄이지만 책임도 지움", "돌려주기는 동의 절차를 다시 요구함"],
        finalChoices: [
          ["a", "내 로그가 바꾼 질문을 전부 목록으로 공개한다", { legitimacy: 9, trust: 5, capital: -4, time: -6, humanCost: -4, fatigue: 7 }, { persistence: 2 }],
          ["b", "복제된 선택지를 원래 참가자에게 돌려주고 삭제 권한까지 넘긴다", { trust: 10, legitimacy: 7, capital: -6, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
          ["c", "내 로그를 포함한 모든 원본을 다음 참가자에게 넘긴다", { legitimacy: 20, trust: 7, humanCost: 3, time: -6, fatigue: 8 }, { risk: 1, inference: 1 }],
        ],
      },
      f_start_expose: {
        route: "f_route_expose",
        final: "f_final_expose",
        phase: "EXPOSE ROUTE",
        title: "밖으로 나간 실험",
        speaker: "반재욱",
        text: "외부 공개 준비가 시작되자 트리거랩은 일부 서버를 닫습니다. 질문은 폭로할 것인가가 아니라, 무엇을 증거로 남겨야 폭로가 또 다른 피해가 되지 않는가입니다.",
        memo: ["서버 일부가 봉인됨", "참가자 실명 보호가 불완전함", "언론은 즉시 공개를 원함"],
        triggers: ["injustice", "responsibility", "order"],
        routeChoices: [
          ["f_route_expose_redact", "참가자 식별자를 지우고 구조 증거만 공개한다", { legitimacy: 9, trust: 6, capital: -6, time: -7, humanCost: -5, fatigue: 8 }, { persistence: 2 }],
          ["f_route_expose_raw", "원본을 그대로 넘겨 삭제 시간을 막는다", { legitimacy: 10, trust: -7, humanCost: 6, time: 6, fatigue: -4 }, { risk: 2 }],
          ["f_route_expose_hold", "외부 감사단이 올 때까지 공개를 멈춘다", { trust: 5, legitimacy: 7, time: -9, capital: -5, fatigue: 7 }, { inference: 2 }],
        ],
        finalTitle: "폭로의 피해자를 줄일 것인가",
        finalText: "구조를 드러내는 일도 누군가의 기록을 노출합니다. 마지막 질문은 진실의 속도와 보호의 순서입니다.",
        finalMemo: ["원본 공개는 가장 빠름", "익명화는 시간이 듦", "감사 대기는 증거 삭제 위험을 키움"],
        finalChoices: [
          ["a", "참가자 식별자를 지운 구조 증거만 외부에 넘긴다", { legitimacy: 10, trust: 5, capital: -5, time: -7, humanCost: -6, fatigue: 7 }, { persistence: 2 }],
          ["b", "공개 전에 참가자 동의 절차부터 다시 돌린다", { trust: 11, legitimacy: 4, capital: -7, time: -5, fatigue: 8 }, { reframing: 3 }],
          ["c", "원본을 그대로 넘겨 삭제될 시간을 없앤다", { legitimacy: 21, trust: -4, humanCost: 6, time: 6, fatigue: -4 }, { risk: 2, inference: 1 }],
        ],
      },
      f_start_contain: {
        route: "f_route_contain",
        final: "f_final_contain",
        phase: "INSIDE ROUTE",
        title: "안에서 닫을 수 있는가",
        speaker: "한서윤",
        text: "내부 설명을 요구하자 한서윤은 실험의 일부가 실제로 판단 품질을 높였다고 말합니다. 질문은 악용을 막는 일이 아니라, 쓸 수 있는 도구를 누가 통제하는가입니다.",
        memo: ["일부 참가자는 실제로 더 나은 결정을 냄", "동의는 사후에 정리됨", "운영팀은 폐기보다 개혁을 원함"],
        triggers: ["order", "curiosity", "responsibility"],
        routeChoices: [
          ["f_route_contain_board", "참가자 대표가 통제하는 운영위를 만든다", { trust: 9, legitimacy: 7, capital: -7, time: -6, fatigue: 8 }, { reframing: 3 }],
          ["f_route_contain_lab", "트리거랩 내부 개혁안으로 봉합한다", { capital: 6, trust: -5, legitimacy: -4, humanCost: 4, fatigue: -3 }, { risk: 2 }],
          ["f_route_contain_pause", "도구를 잠시 멈추고 동의 절차를 다시 받는다", { legitimacy: 8, trust: 5, capital: -8, time: -8, fatigue: 7 }, { persistence: 2 }],
        ],
        finalTitle: "도구를 남길 조건",
        finalText: "트리거랩은 완전히 거짓도, 완전히 선의도 아니었습니다. 이제 도구를 남길 조건을 누가 정할지 선택해야 합니다.",
        finalMemo: ["폐기는 연구를 끝냄", "내부 개혁은 빠르지만 불신을 남김", "참가자 통제는 느리지만 권한을 돌려줌"],
        finalChoices: [
          ["a", "참가자 대표가 통제하는 운영위에 도구를 넘긴다", { legitimacy: 9, trust: 7, capital: -6, time: -6, humanCost: -4, fatigue: 7 }, { persistence: 2 }],
          ["b", "도구를 멈추고 동의 절차를 처음부터 다시 받는다", { trust: 12, legitimacy: 3, capital: -8, time: -7, fatigue: 8 }, { reframing: 3 }],
          ["c", "실험 구조와 사용 기록을 전부 공개 기록으로 넘긴다", { legitimacy: 19, trust: 6, humanCost: 4, time: -5, fatigue: 8 }, { risk: 1, inference: 1 }],
        ],
      },
    },
    system: {
      route: "f_route_system",
      final: "f_final_system",
      title: "마지막 선택지가 당신을 부른다",
      speaker: "에코",
      text: "봉인도 개혁도 폭로도 걸지 않고 판을 다시 짜자 화면에 다음 참가자의 선택지가 나타납니다. 그 선택지 중 하나는 방금 당신이 다시 짠 판입니다.",
      memo: ["다시 짠 판이 다음 참가자 선택지로 변환됨", "삭제 전송과 공개 전송이 동시에 대기 중", "종료 권한은 아직 당신에게 있음"],
      routeChoices: [
        ["f_route_system_read", "내가 다시 짠 판이 어떤 선택지로 바뀌었는지 끝까지 읽는다", { legitimacy: 9, trust: 4, capital: -4, time: -7, fatigue: 7 }, { inference: 2, persistence: 1 }],
        ["f_route_system_send", "확인하지 않고 전송 대기열을 그대로 둔다", { capital: 7, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
        ["f_route_system_warn", "다음 참가자에게 이 화면을 먼저 보여준다", { trust: 9, legitimacy: 6, capital: -5, humanCost: -5, fatigue: 7 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "내가 다시 짠 판이 다음 선택지가 되지 못하게 막는다", { legitimacy: 8, trust: 4, capital: -5, time: -6, humanCost: -5, fatigue: 7 }, { persistence: 2 }],
      ["b", "다시 짠 판은 남기되 바꿀 수 있는 빈칸을 붙인다", { trust: 9, legitimacy: 7, capital: -6, fatigue: 8 }, { reframing: 3 }],
      ["c", "다음 참가자에게 모든 원본을 넘기고 끝낸다", { legitimacy: 22, trust: 6, capital: 0, humanCost: 4, time: -6, fatigue: 8 }, { risk: 1, inference: 1 }],
    ],
  },
};

/**
 * Every route final used to close on the same three lines, so four routes with
 * four different scenes still ended by asking one question. `finalChoices` on a
 * route replaces them with the dilemma that route actually walked into; the
 * case-level list stays as the hidden route's own close.
 */
function makeFinalChoices(plan, finalId, choices = plan.finalChoices) {
  return choices.map(([suffix, label, effect, cognition]) => ({
    id: `${finalId}_${suffix}`,
    label,
    effect,
    cognition,
    next: plan.result,
  }));
}

const SHARED_ROUTE_CLOSING = {
  finalTitle: "준비된 결말 밖에서",
  finalText: "준비된 선택지 밖에서 다시 짠 판은 사건의 규칙을 직접 건드립니다. 이제 그 판이 다음 사람에게 어떻게 쓰일지 결정해야 합니다.",
  finalMemo: ["다시 짠 판은 새 질문으로 기록됨", "실험자는 그 판을 다음 압박 조건으로 쓸 수 있음", "막지 않으면 같은 구조가 반복됨"],
};

function registerDramaticRoutePlan(caseId, plan) {
  const order = nodeOrders[caseId];
  Object.entries(plan.choices).forEach(([choiceId, route]) => {
    nodes[route.route] = {
      phase: route.phase,
      kind: "route",
      title: route.title,
      speaker: route.speaker,
      text: route.text,
      memo: route.memo,
      triggers: route.triggers,
      choices: route.routeChoices.map(([id, label, effect, cognition]) => ({
        id,
        label,
        effect,
        cognition,
        next: route.final,
      })),
    };
    nodes[route.final] = {
      phase: "LAST CALL",
      kind: "routeFinal",
      title: route.finalTitle,
      speaker: route.speaker,
      text: route.finalText,
      memo: route.finalMemo,
      triggers: route.triggers,
      choices: makeFinalChoices(plan, route.final, route.finalChoices ?? plan.finalChoices),
    };
    const opener = sceneOf(plan.start, `${caseId} route plan`).choices.find((choice) => choice.id === choiceId);
    if (!opener) throw new Error(`${caseId} route plan opens ${route.route} from the choice "${choiceId}", which ${plan.start} does not offer`);
    opener.next = route.route;
    for (const node of [route.route, route.final]) {
      if (!order.includes(node)) order.splice(Math.max(0, order.indexOf(plan.start) + 1), 0, node);
    }
  });

  nodes[plan.system.route] = {
    phase: "HIDDEN ROUTE",
    kind: "route",
    title: plan.system.title,
    speaker: plan.system.speaker,
    text: plan.system.text,
    memo: plan.system.memo,
    triggers: ["curiosity", "selfAwareness", "responsibility"],
    // The hidden route asked its final's three questions and then asked them
    // again one scene later. It gets its own opening moves instead.
    choices: (plan.system.routeChoices ?? plan.finalChoices).map(([suffix, label, effect, cognition]) => ({
      id: suffix.startsWith(plan.system.route) ? suffix : `${plan.system.route}_${suffix}`,
      label,
      effect,
      cognition,
      next: plan.system.final,
    })),
  };
  // The hidden route closes on the scene its case wrote (`finalTitle`,
  // `finalText`, `finalMemo` on `system`), or on the shared one below.
  const written = Boolean(plan.system.finalTitle && plan.system.finalText && plan.system.finalMemo?.length);
  const closing = written ? plan.system : SHARED_ROUTE_CLOSING;
  if (!written) fallbackCopy.scenes.push(plan.system.final);
  nodes[plan.system.final] = {
    phase: "LAST CALL",
    kind: "routeFinal",
    title: closing.finalTitle,
    speaker: plan.system.speaker,
    text: closing.finalText,
    memo: closing.finalMemo,
    triggers: ["curiosity", "selfAwareness", "responsibility"],
    choices: makeFinalChoices(plan, plan.system.final),
  };
  if (!order.includes(plan.system.route)) order.splice(Math.max(0, order.indexOf(plan.start) + 1), 0, plan.system.route);
  if (!order.includes(plan.system.final)) order.splice(Math.max(0, order.indexOf(plan.start) + 1), 0, plan.system.final);

  // Authored copy wins. These stay as the net under a choice that has not been
  // written yet, so a new route is playable the moment it is wired.
  [...Object.values(plan.choices).flatMap((route) => [route.route, route.final]), plan.system.route, plan.system.final].forEach((nodeId) => {
    nodes[nodeId].choices.forEach((choice) => {
      fallBackOn(choice.id, choice.label, `${nodes[nodeId].title}: 이 선택은 다음 질문의 기준을 바꿉니다.`);
    });
  });
}

// 사건 02 has no plan: its routes are written out scene by scene
// (`registerCase02DramaticRoutes`).
CASE_PACKS.forEach((pack) => {
  if (pack.routePlan) dramaticRoutePlans[pack.id] = pack.routePlan;
});
coreCards.lay(coreCards.closings, (caseId) => dramaticRoutePlans[caseId].system);
Object.entries(dramaticRoutePlans).forEach(([caseId, plan]) => registerDramaticRoutePlan(caseId, plan));

/**
 * The route split gave every case a new question, but in cases 01, 03, 04, 05
 * and the finale it also cut the authored middle out of the main line: the
 * fixed choices ran start -> route -> route final -> aftermath in four scenes,
 * and everything between (the witness scenes, the reactions, the branch
 * detours) was reachable only through free input. CASE 02 was wired the other
 * way -- each route walks its own authored scenes and closes on its own final
 * -- so this puts the rest of the season on that same shape.
 *
 * `entry` is the authored scene the route now opens into, `tail` is the last
 * scene of that stretch, whose choices close on the route's own `final`. Every
 * route gets a stretch nobody else walks, so two routes never ask the same
 * middle questions.
 */
const routeBodyPlans = {
  final: {
    routes: {
      f_route_map: { entry: "f_archive", tail: "f_witness_reaction", final: "f_final_map" },
      f_route_expose: { entry: "f_confront", tail: "f_dilemma_reaction", final: "f_final_expose" },
      f_route_contain: { entry: "f_branch_witness", tail: "f_branch_witness_follow", final: "f_final_contain" },
    },
    // f_choice is where the season picks its 봉인/개혁/폭로 framing, so the last
    // case is the one place the route finals still converge: they hand the run
    // to that scene instead of jumping past it into the aftermath.
    rewire: { f_final_map: "f_choice", f_final_expose: "f_choice", f_final_contain: "f_choice", f_final_system: "f_choice" },
  },
};

CASE_PACKS.forEach((pack) => {
  if (pack.routeBody) routeBodyPlans[pack.id] = pack.routeBody;
});

function registerRouteBodies(caseId, plan) {
  Object.entries(plan.routes ?? {}).forEach(([routeId, body]) => {
    sceneOf(body.entry, `${caseId} route body`);
    sceneOf(body.final, `${caseId} route body`);
    sceneOf(routeId, `${caseId} route body`).choices.forEach((choice) => { choice.next = body.entry; });
    sceneOf(body.tail, `${caseId} route body`).choices.forEach((choice) => { choice.next = body.final; });
  });
  Object.entries(plan.rewire ?? {}).forEach(([nodeId, next]) => {
    sceneOf(next, `${caseId} route rewire`);
    sceneOf(nodeId, `${caseId} route rewire`).choices.forEach((choice) => { choice.next = next; });
  });
}

Object.entries(routeBodyPlans).forEach(([caseId, plan]) => registerRouteBodies(caseId, plan));

/**
 * Where the first 판을 다시 짠다 of a case lands. It lives next to the route
 * plans so the runtime and the graph check read one map instead of two copies
 * that can drift apart. The route used to be reachable only by typing a
 * sentence that scored three of four keyword buckets; the card reaches it now.
 */
export const reframeRouteNodes = {
  case02: "c2_route_system",
  ...Object.fromEntries(Object.entries(dramaticRoutePlans).map(([caseId, plan]) => [caseId, plan.defaultFree])),
};

const evidenceTurnaroundPlans = {
  final: {
    node: "f_evidence_turn",
    // Same reason the last case's route finals stop at f_choice: the clue
    // turnaround must not skip the scene that names the ending.
    result: "f_choice",
    sourceRoutes: ["f_route_map", "f_route_expose", "f_route_contain", "f_route_system"],
    requiredAuthority: "OVERSIGHT",
    entryVoice: "마지막 선택지들을 단서의 원본과 맞추어, 이 문장들이 어디서 왔는지 밝힌다.",
    entryEcho: "원본과 맞추면 마지막 질문을 누가 냈는지가 드러납니다.",
    title: "모든 단서가 당신의 문장을 가리킨다",
    speaker: "에코",
    text: "감독 권한으로 원본을 열자 사건의 공통점이 사람이 아니라 질문 문장이라는 사실이 드러납니다. 최종 선택은 데이터를 공개할지가 아니라, 당신의 판단 양식을 다음 참가자에게 물려줄지입니다.",
    memo: ["모든 케이스의 숨은 단서가 선택 문장과 연결됨", "다음 참가자의 첫 선택지 일부가 이미 생성됨", "종료 권한은 공개와 폐기 중 하나만 완전하게 보장함"],
    triggers: ["selfAwareness", "choice", "system"],
    entryEffect: { legitimacy: 6, trust: 3, time: -5, fatigue: 5 },
    choices: [
      ["f_evidence_turn_burn", "내 선택 문장까지 포함해 실험 원본을 폐기한다", { legitimacy: 11, trust: 5, capital: -8, time: -8, humanCost: -4, fatigue: 9 }, { persistence: 2 }],
      ["f_evidence_turn_seed", "내 문장을 경고문으로 남기고 다음 참가자에게 넘긴다", { trust: 10, legitimacy: 7, capital: -6, humanCost: 3, fatigue: 8 }, { reframing: 3 }],
      ["f_evidence_turn_publish", "모든 원본과 선택 복제 규칙을 공개한다", { legitimacy: 13, trust: -4, capital: -7, humanCost: 5, time: -4, fatigue: 7 }, { risk: 1, inference: 2 }],
    ],
  },
};

function registerEvidenceTurnaround(caseId, plan) {
  const order = nodeOrders[caseId];
  nodes[plan.node] = {
    phase: "EVIDENCE TURN",
    kind: "evidence",
    title: plan.title,
    speaker: plan.speaker,
    text: plan.text,
    memo: plan.memo,
    triggers: plan.triggers,
    choices: plan.choices.map(([id, label, effect, cognition]) => ({
      id,
      label,
      effect,
      cognition,
      next: plan.result,
    })),
  };
  plan.sourceRoutes.forEach((routeId) => {
    const route = sceneOf(routeId, `${caseId} evidence plan`);
    if (route.choices.some((choice) => choice.id === `${routeId}_evidence_turn`)) return;
    route.choices.push({
      id: `${routeId}_evidence_turn`,
      label: plan.entryLabel ?? "확보한 단서를 대조해 이 질문의 전제를 뒤집는다",
      effect: plan.entryEffect,
      cognition: { inference: 2, reframing: 1 },
      next: plan.node,
      requiredAuthority: plan.requiredAuthority,
    });
  });
  const resultIndex = order.indexOf(plan.result);
  const insertIndex = resultIndex >= 0 ? resultIndex : order.length;
  if (!order.includes(plan.node)) order.splice(insertIndex, 0, plan.node);
  nodes[plan.node].choices.forEach((choice) => {
    fallBackOn(choice.id, choice.label, `${plan.title}: 단서가 선택지의 전제를 바꿉니다.`);
  });
  // Every route offers the turnaround under one label, but what the clue
  // overturns differs per case, so the copy is written per case, not per route.
  plan.sourceRoutes.forEach((routeId) => {
    const choiceId = `${routeId}_evidence_turn`;
    choiceVoiceLines[choiceId] = plan.entryVoice;
    echoReplies[choiceId] = plan.entryEcho;
  });
}

CASE_PACKS.forEach((pack) => {
  evidenceTurnaroundPlans[pack.id] = pack.evidencePlan;
});
coreCards.lay(coreCards.entryLabels, (caseId) => evidenceTurnaroundPlans[caseId]);
Object.entries(evidenceTurnaroundPlans).forEach(([caseId, plan]) => registerEvidenceTurnaround(caseId, plan));

export const continuityMemoryChoicePlans = {
  final: {
    systemNext: "f_route_system",
    evidenceNext: "f_evidence_turn",
    systemLabel: "달빛 아래에서 다시 짠 판이 다음 참가자의 선택지로 넘어갔는지 비춰 본다",
    evidenceLabel: "지정서의 작성자를 따라 모든 선택 문장의 원본까지 간다",
  },
};
// 사건 01 deals no memory card, so its pack writes no plan.
CASE_PACKS.forEach((pack) => {
  if (pack.memoryPlan) continuityMemoryChoicePlans[pack.id] = pack.memoryPlan;
});
coreCards.lay(coreCards.memoryEchoes, (caseId) => continuityMemoryChoicePlans[caseId]);
coreCards.fileMemoryEchoes(continuityMemoryChoicePlans, echoReplies);

/** Reads the previous case's recorded route memory; see seasonRules.js. */
export function getContinuityMemoryChoice(args) {
  return seasonRules.readContinuityMemoryChoice({ plans: continuityMemoryChoicePlans, openingRoutes: caseOpeningRoutes }, args);
}

export const caseOpeningRoutes = {
  // Keyed on the aftermath of the case the finale follows. It has moved every
  // time a case was inserted in front of it: c5_after_*, c6_after_*, c7_after_*,
  // c9_after_*, c10_after_*, c11_after_*, c12_after_*, c24_after_*, and now c49_after_*. A case pack keys its own
  // openings on the case before it (`openingRoutes`), merged below.
  final: {
    c49_after_warm: "f_start_owner",
    c49_after_record: "f_start_system",
    c49_after_rush: "f_start_name",
  },
};

CASE_PACKS.forEach((pack) => {
  caseOpeningRoutes[pack.id] = pack.openingRoutes;
});

const branchOpeningCopy = {
  f_start_owner: ["끝까지 남은 사람의 마지막 밤", "도윤하", "윤상혁은 지금 올라오라고 했지만, 당신은 달이 질 때까지 헌책방 골목에서 모두와 끝까지 있었습니다. 컵라면 하나는 비었고 하나는 가방에 남았습니다. 약속한 밤이 되자 스물세 명이 여의도까지 따라왔고, 도윤하가 로비 앞에서 '내려오면 제일 먼저 전화해요' 하고 손을 놓습니다. 올라가기 전에 당신은 한서윤이 준 열쇠로 옛 트리거랩 B2 기록 보관소부터 엽니다. 케이스데스크 화면이 혼자 켜져 있습니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자) 폴더의 맨 위 파일에 어젯밤이 벌써 적혀 있습니다. '면담 전야, 동료 23명 결집. 결속 유지 능력 상. 관리자 적합.' 사람을 끝까지 떠나지 않는 힘은, 누구에게 가장 쓸모 있습니까.", ["달빛 아래 골목의 밤이 '결속 유지 능력'으로 분류됨", "같은 항목이 골목에 남은 스물세 명 모두에게 매겨짐", "후임 관리자 추천 사유에 그 밤이 인용됨"]],
  f_start_system: ["모든 기록을 묶은 사람의 마지막 밤", "에코", "당신은 그 밤을 마흔아홉 사건의 기록을 한 폴더로 묶는 데 썼습니다. 도윤하의 수첩, 반재욱의 47명, 이민서의 23쪽, 임경수의 뒷장, 에코의 마지막 계산까지 공개 버튼 하나 앞에 모였습니다. 비어 있는 칸은 하나, 옛 트리거랩 B2 단말에만 있는 원본 폴더입니다. 새벽 네 시, B2 케이스데스크에 접속하자 그 폴더가 열립니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)의 맨 앞 파일이 방금 당신이 묶은 폴더의 목차입니다. 분류 항목은 '제도 신뢰형 반응: 기록을 주면 기록 안에서 멈춤'. 당신이 모은 기록이, 이번에는 당신을 재는 잣대가 됐습니다.", ["공개 준비 폴더의 목차가 관찰 자료 1번으로 등록됨", "관리자 칸에는 여전히 점 하나", "참가자 동의 절차의 빈틈은 그대로 남음"]],
  f_start_name: ["곧장 올라간 사람의 마지막 밤", "반재욱", "문자를 받은 그 자리에서 당신은 곧장 33층으로 올라갔습니다. 옛 그룹전략실 앞 복도는 불이 꺼져 있고, 문에는 쪽지 한 장이 붙어 있습니다. '먼저 B2에 들르게. 보여 줄 게 있네. 한 시간이면 되지.' 기다리는 대신 B2로 내려오자 반재욱이 먼저 와서 케이스데스크 앞에 서 있습니다. 골목에서 당신이 뛰어나가는 걸 보고 택시로 따라왔다고 합니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자) 폴더가 열렸고, 방금 전 기록이 벌써 올라가 있습니다. '호출 7분 만에 단독 도착. 압박 시 즉시 상향 대응. 관리자 적합.' 당신의 빠른 걸음이 그 칸의 추천 사유가 됐습니다. 그리고 후임 관리자 칸의 점 옆에, 당신 이름이 연필로 적혀 있습니다.", ["33층 면담 한 시간 연기 -- 쪽지 한 장", "즉각 대응 기록이 관리자 추천 사유로 인용됨", "후임 관리자 칸: 점 옆에 연필로 적힌 당신 이름"]],
};

/**
 * The one move each opening allows that the other two do not.
 *
 * The three openings used to be the base scene's choices with a different
 * paragraph on top -- same ids, same labels, same effects -- so the branch the
 * previous case earned changed the framing and nothing else. Each now carries a
 * fourth option that only exists because of what the last case ended on.
 */
const openingSignatureChoices = {
  f_start_owner: {
    label: "골목의 밤이 적힌 이 파일부터 동료들에게 먼저 공개한다",
    effect: { legitimacy: 8, trust: 7, time: -6, fatigue: 5 },
    cognition: { persistence: 2 },
    next: "f_route_map",
    voice: "그 밤을 함께한 사람들이 먼저 알아야 한다며, 골목의 밤이 적힌 이 파일부터 동료들에게 공개한다.",
    echo: "공개하면 로비의 스물세 명이 자기 칸의 '결속 유지 능력 상'을 봅니다. 그 칸은 다음 실험의 교재로도 쓰입니다.",
  },
  f_start_system: {
    label: "내가 묶은 공개 원칙을 이 폴더 자신에게 먼저 적용하라고 요구한다",
    effect: { legitimacy: 9, trust: 5, capital: -4, time: -7, fatigue: 5 },
    cognition: { reframing: 2 },
    next: "f_route_contain",
    voice: "남에게 요구한 원칙이면 여기서도 지켜져야 한다며, 내가 묶은 공개 원칙을 이 폴더 자신에게 먼저 적용하라고 요구한다.",
    echo: "같은 원칙을 설계자에게 들이대면 실험의 전제가 드러납니다. 관리자 칸의 점이 끝내 답하지 않으면, 그 침묵이 증거가 됩니다.",
  },
  f_start_name: {
    label: "연필로 적힌 내 이름과 이 파일을 동료들에게 먼저 알린다",
    effect: { trust: 9, humanCost: -6, legitimacy: -3, capital: -5, fatigue: 5 },
    cognition: { reframing: 2 },
    next: "f_route_expose",
    voice: "혼자 올라온 걸음을 혼자 끝내지 않으려고, 연필로 적힌 내 이름과 이 파일을 동료들에게 먼저 알린다.",
    echo: "먼저 알리면 골목의 사람들이 한 시간을 법니다. 그 시간에 로비로 올지 말지는 그들이 정합니다. 절차상으로는 유출입니다.",
  },
};

for (const pack of CASE_PACKS) {
  Object.assign(branchOpeningCopy, pack.openingCopy);
  Object.assign(openingSignatureChoices, pack.openingSignatures);
}

Object.entries(caseOpeningRoutes).forEach(([caseId, routes]) => {
  const baseNodeId = CASE_START_NODES[caseId];
  Object.values(routes).forEach((nodeId) => {
    const [title, speaker, text, memo] = branchOpeningCopy[nodeId];
    // The cloned choices are the same decisions, so they keep the base scene's
    // lines -- but under their own ids, so the log can say which opening it was.
    const clonedChoices = nodes[baseNodeId].choices.map((choice) => {
      const openingChoiceId = choice.id.startsWith(baseNodeId)
        ? `${nodeId}${choice.id.slice(baseNodeId.length)}`
        : `${nodeId}_${choice.id}`;
      // Fall back to the base scene's line only where the opening has not been
      // written its own: the three branches reach the same decision from
      // different places, and most of them now say so.
      if (!choiceVoiceLines[openingChoiceId] && choiceVoiceLines[choice.id]) {
        choiceVoiceLines[openingChoiceId] = choiceVoiceLines[choice.id];
      }
      if (!echoReplies[openingChoiceId] && echoReplies[choice.id]) {
        echoReplies[openingChoiceId] = echoReplies[choice.id];
      }
      return { ...choice, id: openingChoiceId };
    });
    const signature = openingSignatureChoices[nodeId];
    if (signature) {
      const signatureId = `${nodeId}_signature`;
      choiceVoiceLines[signatureId] = signature.voice;
      echoReplies[signatureId] = signature.echo;
      const routed = clonedChoices.find((choice) => choice.type !== "reframe") ?? clonedChoices[0];
      // Before the 판을 다시 짠다 card, which stays last on every scene.
      clonedChoices.splice(clonedChoices.length - 1, 0, {
        id: signatureId,
        label: signature.label,
        effect: signature.effect,
        cognition: signature.cognition,
        next: signature.next ?? routed.next,
      });
    }
    nodes[nodeId] = {
      ...nodes[baseNodeId],
      phase: "BRANCH BRIEFING",
      kind: "opening",
      title,
      speaker,
      text,
      memo,
      choices: clonedChoices,
    };
  });
  nodeOrders[caseId].unshift(...Object.values(routes));
});

// Last: what each scene is, where it happens, and the order it deals its
// cards in. See nodes/sceneBuild.js.
sceneBuild.finishSceneGraph(nodes, nodeOrders);

// How far into a case a scene sits; see seasonRules.js.
export const { getCaseRouteLength, getNodeRouteIndex } = seasonRules.createRouteReaders(nodes, caseOpeningRoutes);

/** The one authored mid-case fork per case; see seasonRules.js. */
export function getCaseBranchNodes() {
  return seasonRules.readCaseBranchNodes(nodes, nodeOrders);
}

export const { getBranchDetourBypass } = seasonRules;

/**
 * Every case is here already. The app build reads src/runtime/gameData.app.js
 * instead, where cases arrive one at a time; these keep the two the same shape
 * so the code that opens a case can await its arrival in either.
 */
export const ensureCase = () => Promise.resolve();
export const ensureAllCases = () => Promise.resolve();
export const isCaseLoaded = () => true;
