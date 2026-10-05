export { byEffectWeight, cognitionLabels, costWhenRising, initialResources, isResourceGain, triggerLabels } from "./gameConstants.js";
export { characterProfiles, choiceVoiceLines } from "./gameDialogue.js";
export { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, SEASON_ENTRY_CASE, SEASON_ENTRY_NODE, caseAftermathNodeId, caseDisplayCode, caseNodePrefix, caseObjectives, seasonCasesBase } from "./gameCases.js";
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

/**
 * A card is written with its line and its reply beside its label, so the three
 * are read and changed together. The scene the table is dealt does not carry
 * them: they are filed here under the card's id, in the two tables the app has
 * always read (and is shipped, a case at a time).
 */
function fileLines({ voice, echo, ...card }, id = card.id) {
  if (voice) choiceVoiceLines[id] = voice;
  if (echo) echoReplies[id] = echo;
  return card;
}
const withLinesFiled = (scene) => ({ ...scene, choices: scene.choices.map((choice) => fileLines(choice)) });

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
export const nodes = Object.fromEntries(
  CASE_PACKS.flatMap((pack) => Object.entries(pack.nodes)).map(([nodeId, scene]) => [nodeId, withLinesFiled(scene)]),
);

const aftermathNodes = {};

CASE_PACKS.forEach((pack) => Object.assign(aftermathNodes, pack.aftermath));
for (const [nodeId, scene] of Object.entries(aftermathNodes)) nodes[nodeId] = { ...withLinesFiled(scene), kind: "aftermath" };

// [case, the scene that closes it, its aftermath]. 사건 01-05 close on their
// routes' own finals (`registerDramaticRoutePlan`), so their packs name no scene.
const aftermathRoutes = CASE_PACKS.map(({ id, aftermathRoute: [finalId, aftershockId] }) => [id, finalId, aftershockId]);
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
 * Every case's are on its pack.
 */
const connectiveScenes = CASE_PACKS.flatMap((pack) => pack.connectiveScenes);

const reactionScenes = CASE_PACKS.flatMap((pack) => pack.reactionScenes);

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
const authoredBranchScenes = {};

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
const authoredBranchPlans = [];

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
  nodes[firstId] = { ...withLinesFiled(authoredBranchScenes[firstId]), kind: "branch" };
  nodes[secondId] = { ...withLinesFiled(authoredBranchScenes[secondId]), kind: "branch" };
  const order = nodeOrders[caseId];
  const sourceOrderIndex = order.indexOf(sourceId);
  if (sourceOrderIndex < 0) throw new Error(`${caseId} branch plan leaves from ${sourceId}, which is not in the case`);
  order.splice(sourceOrderIndex + 1, 0, firstId, secondId);
});


/**
 * Routes written out scene by scene instead of drawn from a plan: 사건 02's.
 * `open` says which start card opens which route, `rewire` where the authored
 * scenes hand over to each route's own final.
 */
function registerWrittenRoutes({ id, writtenRoutes: plan }) {
  for (const [nodeId, scene] of Object.entries(plan.routes)) nodes[nodeId] = { ...withLinesFiled(scene), kind: "route" };
  for (const [nodeId, scene] of Object.entries(plan.finals)) nodes[nodeId] = { ...withLinesFiled(scene), kind: "routeFinal" };
  sceneOf(plan.start, `${id} written routes`).choices.forEach((choice) => {
    if (plan.open[choice.id]) choice.next = plan.open[choice.id];
  });
  Object.entries(plan.rewire).forEach(([nodeId, next]) => {
    sceneOf(nodeId, `${id} written routes`).choices.forEach((choice) => { choice.next = next; });
  });
  const order = nodeOrders[id];
  order.splice(order.indexOf(plan.start) + 1, 0, ...Object.keys(plan.routes));
  order.splice(order.indexOf(plan.result), 0, ...Object.keys(plan.finals));
}

CASE_PACKS.filter((pack) => pack.writtenRoutes).forEach(registerWrittenRoutes);

const dramaticRoutePlans = {};

/**
 * Every route final used to close on the same three lines, so four routes with
 * four different scenes still ended by asking one question. `finalChoices` on a
 * route replaces them with the dilemma that route actually walked into; the
 * case-level list stays as the hidden route's own close.
 */
function makeFinalChoices(plan, finalId, choices = plan.finalChoices) {
  return choices.map((card) => {
    const id = `${finalId}_${card.id}`;
    return { ...fileLines(card, id), id, next: plan.result };
  });
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
      choices: route.routeChoices.map((card) => ({ ...fileLines(card), next: route.final })),
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
    choices: plan.system.routeChoices.map((card) => ({ ...fileLines(card), next: plan.system.final })),
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
// (`writtenRoutes` on its pack).
CASE_PACKS.forEach((pack) => {
  if (pack.routePlan) dramaticRoutePlans[pack.id] = pack.routePlan;
});
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
const routeBodyPlans = {};

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
  ...Object.fromEntries(CASE_PACKS.filter((pack) => pack.writtenRoutes).map((pack) => [pack.id, pack.writtenRoutes.reframe])),
  ...Object.fromEntries(Object.entries(dramaticRoutePlans).map(([caseId, plan]) => [caseId, plan.defaultFree])),
};

const evidenceTurnaroundPlans = {};

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
    choices: plan.choices.map((card) => ({ ...fileLines(card), next: plan.result })),
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
Object.entries(evidenceTurnaroundPlans).forEach(([caseId, plan]) => registerEvidenceTurnaround(caseId, plan));

export const continuityMemoryChoicePlans = {};
// 사건 01 deals no memory card, so its pack writes no plan.
CASE_PACKS.forEach((pack) => {
  if (pack.memoryPlan) continuityMemoryChoicePlans[pack.id] = pack.memoryPlan;
});
seasonRules.fileMemoryEchoes(continuityMemoryChoicePlans, echoReplies);

/** Reads the previous case's recorded route memory; see seasonRules.js. */
export function getContinuityMemoryChoice(args) {
  return seasonRules.readContinuityMemoryChoice({ plans: continuityMemoryChoicePlans, openingRoutes: caseOpeningRoutes }, args);
}

export const caseOpeningRoutes = {};

CASE_PACKS.forEach((pack) => {
  caseOpeningRoutes[pack.id] = pack.openingRoutes;
});

const branchOpeningCopy = {};

/**
 * The one move each opening allows that the other two do not.
 *
 * The three openings used to be the base scene's choices with a different
 * paragraph on top -- same ids, same labels, same effects -- so the branch the
 * previous case earned changed the framing and nothing else. Each now carries a
 * fourth option that only exists because of what the last case ended on.
 */
const openingSignatureChoices = {};

for (const pack of CASE_PACKS) {
  Object.assign(branchOpeningCopy, pack.openingCopy);
  Object.assign(openingSignatureChoices, pack.openingSignatures);
  // What a start card says in one opening alone; the loop below falls back
  // on the briefing's line for a card with no entry.
  Object.entries(pack.openingLines ?? {}).forEach(([choiceId, lines]) => fileLines(lines, choiceId));
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
