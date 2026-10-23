import { withFarCallback } from "../farCallbacks.js";
import { createPlayView as createScreenPlayView } from "./appViewModels.js";

/**
 * The play screen reads the scene with its far callback, if it has one: the
 * line about a choice made many cases earlier (farCallbacks.js). The run's
 * case results come in a third argument, only for that, and are not part of
 * the view. A module of its own so the callback table rides in the runtime's
 * chunk, not the first paint's (appViewModels.js is read by the intro).
 */
export function createPlayView(baseView, extras = {}, caseResults = {}) {
  const node = withFarCallback(baseView.resolvedNodeId, baseView.node, caseResults);
  return createScreenPlayView(node === baseView.node ? baseView : { ...baseView, node }, extras);
}
