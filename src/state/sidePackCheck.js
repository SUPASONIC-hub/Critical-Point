/**
 * E-11 번외 사건: the shape a side pack has to have (E11-번외사건-설계안 3-1절).
 *
 * Read by the graph check (scripts/validate-game-graph.mjs), which walks every
 * `src/nodes/sideNN.js`, and by the unit tests -- never by the app, so the
 * runtime's chunk does not carry it. The side run itself is ./sideRun.js.
 */
import { caseAftermathNodeId, caseNodePrefix } from "../gameCases.js";
import { isSideCaseId } from "../sideCases.js";
import { RESOURCE_KEYS, sideResultNodeId } from "./sideRun.js";

const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/**
 * What is wrong with a side pack, as sentences; none when it is sound. The
 * graph check (scripts/validate-game-graph.mjs) reads every `src/nodes/sideNN.js`
 * through this, and so do the unit tests.
 *
 * `seasonNodeIds` are the season's scene ids: a side scene may not share one.
 */
export function checkSidePack(pack, { seasonNodeIds = [] } = {}) {
  const problems = [];
  if (!isRecord(pack)) return ["not a pack"];
  const { id, nodes = {}, outcomes = {} } = pack;
  if (!isSideCaseId(id)) return [`${id}: a side case's id is sideNN (never caseNN)`];
  const prefix = `${caseNodePrefix(id)}_`;
  const aftershock = caseAftermathNodeId(id);
  const result = sideResultNodeId(id);
  const season = new Set(seasonNodeIds);
  if (pack.label !== `번외 ${Number(id.slice(4))}`) problems.push(`${id}: label should be 「번외 ${Number(id.slice(4))}」`);
  if (typeof pack.title !== "string" || !pack.title) problems.push(`${id}: no title`);
  if (!nodes[pack.startNode]) problems.push(`${id}: startNode ${pack.startNode} is not a scene`);
  if (!nodes[aftershock]) problems.push(`${id}: no ${aftershock}, the scene the case closes on`);
  const resources = pack.startState?.resources;
  if (!isRecord(resources) || !RESOURCE_KEYS.every((key) => Number.isFinite(resources[key]))) {
    problems.push(`${id}: startState.resources names every resource (${RESOURCE_KEYS.join(", ")})`);
  }
  const sceneIds = Object.keys(nodes);
  // 설계안 질문 3 (1): 8 to 12 scenes. The framework's placeholder is smaller.
  if (!pack.fixture && (sceneIds.length < 8 || sceneIds.length > 12)) problems.push(`${id}: ${sceneIds.length} scenes, a side case has 8 to 12`);
  const choiceIds = new Set();
  for (const [nodeId, scene] of Object.entries(nodes)) {
    if (!nodeId.startsWith(prefix)) problems.push(`${nodeId}: a ${id} scene starts with ${prefix}`);
    if (season.has(nodeId)) problems.push(`${nodeId}: the season already has this scene`);
    for (const field of ["phase", "title", "speaker", "text", "question"]) {
      if (typeof scene?.[field] !== "string" || !scene[field]) problems.push(`${nodeId}: no ${field}`);
    }
    if (!Array.isArray(scene?.choices) || scene.choices.length < 2) {
      problems.push(`${nodeId}: fewer than two cards`);
      continue;
    }
    for (const choice of scene.choices) {
      if (!choice?.id?.startsWith(prefix)) problems.push(`${nodeId}: card ${choice?.id} starts with ${prefix}`);
      if (choiceIds.has(choice?.id)) problems.push(`${nodeId}: card ${choice?.id} is written twice`);
      choiceIds.add(choice?.id);
      if (choice?.type === "reframe") problems.push(`${choice.id}: a side case has no 판을 다시 짠다 card`);
      if (!isRecord(choice?.effect)) problems.push(`${choice?.id}: no effect`);
      if (nodeId === aftershock) {
        if (choice?.next !== result) problems.push(`${choice?.id}: an aftershock card leads to ${result}`);
        if (!outcomes[choice?.id]?.title || !outcomes[choice?.id]?.text) problems.push(`${choice?.id}: no ending in outcomes`);
      } else if (!nodes[choice?.next] || choice.next === pack.startNode) {
        problems.push(`${choice?.id}: next ${choice?.next} is not a scene ahead`);
      }
    }
  }
  // 설계안 질문 3 (1): three endings, each reached by a card of the aftershock.
  const endingIds = Object.keys(outcomes);
  if (endingIds.length !== 3) problems.push(`${id}: ${endingIds.length} endings, a side case has three`);
  for (const endingId of endingIds) {
    if (!nodes[aftershock]?.choices?.some((choice) => choice.id === endingId)) problems.push(`${endingId}: no aftershock card reaches this ending`);
  }
  // Every scene is reached from the start.
  const reached = new Set();
  const queue = [pack.startNode];
  while (queue.length) {
    const nodeId = queue.shift();
    if (reached.has(nodeId) || !nodes[nodeId]) continue;
    reached.add(nodeId);
    nodes[nodeId].choices?.forEach((choice) => queue.push(choice.next));
  }
  sceneIds.filter((nodeId) => !reached.has(nodeId)).forEach((nodeId) => problems.push(`${nodeId}: no card leads here`));
  return problems;
}
