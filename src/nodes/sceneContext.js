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
const caseSetting = {};

/**
 * Per-scene grounding. A scene may set any of `place`, `clock`, `question` and
 * `lead`; whatever it leaves out falls back to the case setting (place/clock),
 * the previous scene in the case order (place/clock), or the generated template
 * (question). `lead` has no fallback -- a scene without one simply opens on its
 * own body text.
 */
export const sceneContext = {};

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
