/**
 * Its own module, so the play view (viewModels/playViewModel.js) reads it
 * without taking caseCopy.js's whole copy table along. The table is
 * src/copy/farCallbacks.js, laid over in the page's language.
 */
import farCallbacks from "./copy/farCallbacks.js";

export { farCallbacks };

/** The line a far callback prints for this run: the card's, or the fallback. */
export function resolveFarCallbackLine(callback, caseResults = {}) {
  if (!callback) return "";
  const choiceId = caseResults?.[callback.fromCase]?.[callback.field ?? "outcomeChoiceId"];
  return (typeof choiceId === "string" && callback.lines[choiceId]) || callback.fallback;
}

const calledBackScenes = new Map();

/**
 * The scene as this run reads it: the graph's own object for a scene with no
 * far callback, and for one with a callback a copy whose text carries the
 * line. Kept per text, so the runtime's memos see one object per render.
 */
export function withFarCallback(nodeId, node, caseResults) {
  const callback = farCallbacks[nodeId];
  if (!callback || typeof node?.text !== "string" || !node.text.includes(callback.after)) return node;
  const line = resolveFarCallbackLine(callback, caseResults);
  const key = `${nodeId}\n${line}`;
  if (!calledBackScenes.has(key)) {
    const text = node.text.replace(callback.after, `${callback.after} ${line}`);
    calledBackScenes.set(key, { ...node, text });
  }
  return calledBackScenes.get(key);
}
