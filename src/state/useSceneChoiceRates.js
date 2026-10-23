import { useEffect, useState } from "react";

import { getSceneChoiceLine } from "../sceneChoices.js";
import { callSupabaseRpc } from "../telemetry.js";

/**
 * The other players' card shares for every scene of the season (E-6), asked
 * of the server once per page load -- the first time a reveal opens with a
 * card the player chose -- and kept for every later reveal. The frame of
 * useSceneBustRates.js (D3): `scene_choice_rates()` takes no argument, so the
 * request carries nothing of the player, not even the open case, and the
 * scene and card are looked up on this device. Null until an answer has
 * come, and for the rest of the page load when none does; the reveal then
 * prints no line.
 *
 * This module and src/sceneChoices.js are a chunk of their own,
 * sceneChoices (SCENE_CHOICES in vite.config.js), so the PlayScreen chunk
 * keeps its budget for a line that waits on the network anyway.
 */
let answer;
let request = null;

/** One ask of the server: its answer, or null. `rpc` is `callSupabaseRpc`; the unit tests pass their own. */
export function fetchSceneChoiceRates(rpc = callSupabaseRpc) {
  return Promise.resolve()
    .then(() => rpc("scene_choice_rates"))
    .then(
      (result) => result?.data ?? null,
      () => null,
    );
}

function ask() {
  request ??= fetchSceneChoiceRates().then((data) => (answer = data));
  return request;
}

/** The reveal's line for `scene` ({ caseId, nodeId, choiceId }, null for a card the room played), or null. */
export function useSceneChoiceLine(scene) {
  const [data, setData] = useState(() => answer ?? null);
  const wanted = Boolean(scene);
  useEffect(() => {
    if (!wanted || answer !== undefined) return undefined;
    let current = true;
    ask().then((value) => current && setData(value));
    return () => {
      current = false;
    };
  }, [wanted]);
  return getSceneChoiceLine(data ?? answer ?? null, scene, globalThis.navigator?.onLine);
}
