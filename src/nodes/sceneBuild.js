/**
 * The last passes of the graph build, and the one rule the generators share.
 *
 * `gameData.js` is the season's tables and the generators that read them. What
 * is here reads no table: it runs over the finished graph, once, after every
 * generator has added its scenes -- which is why it is one call
 * (`finishSceneGraph`) and not four that have to be kept in order by hand.
 */
import { CASE_START_NODES, RESULT_NODE_IDS } from "../gameCases.js";
import { isResourceGain } from "../gameConstants.js";
import { createPlateRandom, hashString } from "../scenePlate.js";
import { applySceneContext } from "./sceneContext.js";

/**
 * Which way of thinking a generated choice exercises, read from the choice.
 *
 * It was read from the column -- connective scenes ran persistence / inference
 * / risk / reframing, reaction scenes reframing / inference / risk -- so a
 * player who always took the second card was an "inference" player by
 * construction. Now the label's verb decides: each way of thinking has phrases
 * that do it (checking a record, redrawing the terms, staying with someone,
 * moving before it is safe), and the axis the card gains most on is worth half
 * a phrase. Ties go to the axis, then the order below. Reframing is worth 2, as
 * the fourth card always was; the rest 1. Choice ids are untouched.
 */
const COGNITION_CUES = {
  reframing: ["다시 짜", "판을", "바꾼다", "바꿔", "구조", "제안", "조건", "규칙", "새로", "설계", "합친다", "첫 문장", "기준을", "뒤집", "등록"],
  inference: ["확인", "대조", "맞춰 본", "따져", "묻는다", "물어", "출처", "기록", "문서", "적어", "원본", "보존", "증거", "자료", "조사", "추적", "찾", "검토", "공식", "지적", "이의", "설명"],
  persistence: ["끝까지", "곁", "옆에", "같이", "함께", "지킨다", "기다", "버틴", "남는다", "남아", "밤새", "듣는다", "만난다", "앉", "한 분씩", "한 명씩"],
  risk: ["바로", "즉시", "당장", "일단", "빠르게", "조용히", "넘긴다", "넘어간", "빼", "덮", "못 본", "몰래", "서둘", "먼저 치", "그대로 두"],
};
const COGNITION_ORDER = ["reframing", "inference", "persistence", "risk"];
const AXIS_COGNITION = { trust: "persistence", humanCost: "persistence", fatigue: "persistence", legitimacy: "inference", capital: "risk", time: "risk" };

export function inferChoiceCognition(label = "", effect = {}) {
  const [axis] = Object.entries(effect).filter(([key, value]) => isResourceGain(key, value)).sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))[0] ?? [];
  const axisType = AXIS_COGNITION[axis];
  const score = (type) =>
    COGNITION_CUES[type].reduce((sum, cue) => sum + (label.includes(cue) ? 2 : 0), 0) + (type === axisType ? 1 : 0);
  const type = COGNITION_ORDER.reduce((best, candidate) => (score(candidate) > score(best) ? candidate : best), axisType ?? COGNITION_ORDER[0]);
  return { [type]: type === "reframing" ? 2 : 1 };
}

/**
 * The scenes between a case's briefing and its decision where the room closes
 * in: someone pushes back, a clock runs out, a document turns on the analyst.
 * The plate draws these hot (scenePlate.js).
 *
 * This was a list of phase strings inside the plate, so a scene was under
 * pressure when its chip happened to read "TRAP" or "HEARING" -- player copy
 * doing a key's job. 사건 13-49 name their scenes after what is in them ("THE
 * SET", "FINE PRINT"), none of which was on the list, so from 사건 13 on only
 * the decision and the aftermath ever drew hot, whatever the story was doing.
 * A scene says it here, by id, and a pack can say it for its own scenes with
 * `pressure` in its scene context.
 */
export const pressureBeats = new Set([
  "p1_review", "p2_model", "p3_committee", "p4_quota",
  "board", "c2_pressure", "c3_trap", "c4_leak", "c4_vote", "c5_blame", "c5_collapse",
  "c6_logs", "c6_panel", "c8_trail", "c8_bait", "c9_ledger", "c9_timing", "c10_claim",
  "c11_script", "c12_mediation",
  "c13_studio", "c14_desk", "c15_form", "c15_gate", "c16_review", "c17_legal", "c18_lounge",
  "c19_labels", "c20_datacenter", "c23_backstage", "c24_rooftop", "c25_notice",
  "c26_crane", "c26_tower", "c27_queue", "c27_offer", "c28_headset", "c28_factory",
  "c29_marina", "c30_leaving", "c31_archive", "c32_boxes", "c32_room", "c33_room",
  "c34_seminar", "c35_sandbag", "c35_noah", "c36_table", "c36_father", "c37_takedown",
  "c37_source", "c38_gallery", "c38_witness", "c39_cut", "c40_demo", "c41_corridor",
  "c41_chamber", "c42_karaoke", "c43_corridor", "c44_court", "c45_wreath", "c46_cage",
  "c48_engine", "c49_crosswalk",
  "f_confront",
]);

/** A decision is always under pressure: the case's own, a route's, and what follows it. */
const PRESSURE_KINDS = new Set(["decision", "routeFinal", "aftermath"]);

/**
 * What every scene knows about itself that is not copy: the case it belongs
 * to, what kind of scene it is, and whether it is a pressure beat. `phase` is
 * printed on the scene chip and nothing reads it as a key any more.
 *
 * `kind` is one of briefing, opening, scene, connective, reaction, branch,
 * route, routeFinal, evidence, decision, aftermath. The generators set theirs
 * as they build; what is left is what the case files wrote.
 */
function stampSceneFacts(nodes, nodeOrders) {
  for (const [caseId, order] of Object.entries(nodeOrders)) {
    for (const nodeId of new Set(order)) {
      const scene = nodes[nodeId];
      if (!scene) throw new Error(`${caseId} lists the scene "${nodeId}", which the graph does not have`);
      if (scene.caseId && scene.caseId !== caseId) throw new Error(`${nodeId} is listed in both ${scene.caseId} and ${caseId}`);
      scene.caseId = caseId;
      scene.kind ??= nodeId === CASE_START_NODES[caseId] ? "briefing" : "scene";
      scene.pressure = PRESSURE_KINDS.has(scene.kind) || pressureBeats.has(nodeId);
    }
  }
}

/**
 * The play screen badges a choice that changes the question -- memory, evidence
 * turn, authority, adaptive, branch detour -- but the main split had no mark on
 * it. The four buttons on a case briefing send the player down four different
 * routes with four different endings, and they looked like ordinary choices.
 * Tagged from the graph, after every route is wired, so it cannot fall out of
 * step with where the choices actually go.
 */
function tagRouteSplits(nodes) {
  for (const node of Object.values(nodes)) {
    for (const choice of node.choices) {
      if (nodes[choice.next]?.kind === "route") choice.routeSplit = true;
    }
  }
}

/**
 * Scenes that keep the order they were written in, because the order is the
 * point: copy that says "첫 번째 카드", a scene that teaches the table. None
 * does today -- a search of the season's copy for a card named by its place
 * found nothing -- so the list is empty, and it is here so the next such scene
 * is one line rather than a second shuffle.
 */
const AUTHORED_DEALS = new Set([]);

/**
 * The order a scene deals its cards in.
 *
 * Every scene was written people first, procedure second, speed third, and
 * dealt in the order it was written: the first card's largest gain was 믿음 in
 * 212 of the 215 scenes the packs author, the second's 공정함 in 213, and the
 * third card of 323 of the 330 generated scenes gave 지침 back. By the third
 * case a player could play a column without reading a card.
 *
 * So the deal is shuffled, last, after every rule that names a card by its
 * position has run (the branch plan's column, the signature card's slot). The
 * shuffle is seeded on the scene id alone: a scene never deals differently
 * from itself, on a reload or in another run, and nothing in a save names a
 * card by where it sat -- a choice is looked up by its id.
 *
 * 판을 다시 짠다 and the evidence turn keep the slots they were given; the
 * table and its tests find them there.
 */
function dealScenes(nodes) {
  for (const [nodeId, scene] of Object.entries(nodes)) {
    if (AUTHORED_DEALS.has(nodeId)) continue;
    const dealt = scene.choices.map((choice, index) => (choice.type === "reframe" || choice.id.endsWith("_evidence_turn") ? -1 : index)).filter((index) => index >= 0);
    if (dealt.length < 2) continue;
    const random = createPlateRandom(hashString(`deal:${nodeId}`));
    const order = [...dealt];
    for (let index = order.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [order[index], order[swap]] = [order[swap], order[index]];
    }
    const cards = order.map((index) => scene.choices[index]);
    dealt.forEach((slot, index) => {
      scene.choices[slot] = cards[index];
    });
  }
}

/** Facts first, so a scene's own context can overrule them; the deal last. */
export function finishSceneGraph(nodes, nodeOrders) {
  stampSceneFacts(nodes, nodeOrders);
  tagRouteSplits(nodes);
  applySceneContext(nodes, nodeOrders);
  dealScenes(nodes);
  return nodes;
}

/**
 * How far into its case a scene sits, walked from the graph rather than read
 * off the order: a case opens on any of its openings and forks from there, so
 * a scene's depth is the shortest way to it.
 */
export function createRouteReaders(nodes, caseOpeningRoutes) {
  function getPlayableRoute(caseId) {
    const route = new Map();
    const queue = [
      CASE_START_NODES[caseId],
      ...Object.values(caseOpeningRoutes[caseId] ?? {}),
    ].filter(Boolean).map((nodeId) => ({ nodeId, depth: 0 }));
    const seen = new Set();
    while (queue.length > 0) {
      const { nodeId, depth } = queue.shift();
      if (!nodeId || seen.has(nodeId) || RESULT_NODE_IDS.has(nodeId)) continue;
      seen.add(nodeId);
      route.set(nodeId, depth);
      for (const choice of nodes[nodeId]?.choices ?? []) {
        if (choice.next && !seen.has(choice.next) && !RESULT_NODE_IDS.has(choice.next)) {
          queue.push({ nodeId: choice.next, depth: depth + 1 });
        }
      }
    }
    return route;
  }

  return {
    getCaseRouteLength(caseId) {
      return Math.max(1, ...getPlayableRoute(caseId).values()) + 1;
    },
    getNodeRouteIndex(caseId, nodeId) {
      const branchStartIds = new Set(Object.values(caseOpeningRoutes[caseId] ?? {}));
      if (branchStartIds.has(nodeId)) return 0;
      return getPlayableRoute(caseId).get(nodeId) ?? -1;
    },
  };
}
