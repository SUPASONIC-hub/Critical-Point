import { useEffect, useState } from "react";

import { getSceneTraceLine } from "../sceneTraces.js";
import { callSupabaseRpc } from "../telemetry.js";

/**
 * The other players' wall rates for every scene of the season, asked of the
 * server once per page load -- the first time a scene page opens -- and kept
 * for every later page, whatever case it belongs to.
 *
 * The request carries nothing of the player's, as the ranking band's does
 * (docs rule 91): `scene_bust_rates()` takes no argument, so not even the open
 * case is sent, and the scene is looked up on this device
 * (`getSceneTraceLine`). So it is asked whatever the research consent says.
 *
 * Null until an answer has come, and for the rest of the page load when none
 * does: a build with no server asks nothing (`callSupabaseRpc` skips), and a
 * server without the function, a refusal, a lost network or the deadline
 * reject. The page then prints no line; nothing is said of the failure and
 * nothing asks again.
 *
 * This module and src/sceneTraces.js are a chunk of their own, sceneTraces
 * (SCENE_TRACES in vite.config.js), fetched with the table's chunk.
 */
let answer;
let request = null;

/**
 * One ask of the server: its answer, or null for a skipped call (no server in
 * this build), an empty answer or a rejection. `rpc` is `callSupabaseRpc`;
 * the unit tests pass their own.
 */
export function fetchSceneBustRates(rpc = callSupabaseRpc) {
  return Promise.resolve()
    .then(() => rpc("scene_bust_rates"))
    .then(
      (result) => result?.data ?? null,
      () => null,
    );
}

function ask() {
  request ??= fetchSceneBustRates().then((data) => (answer = data));
  return request;
}

export function useSceneBustRates() {
  const [data, setData] = useState(() => answer ?? null);
  useEffect(() => {
    if (answer !== undefined) return undefined;
    let current = true;
    ask().then((value) => current && setData(value));
    return () => {
      current = false;
    };
  }, []);
  return data;
}

/** The scene page's line (`getSceneTraceLine`), or null for none. */
export function useSceneTraceLine(caseId, nodeId) {
  return getSceneTraceLine(useSceneBustRates(), caseId, nodeId, globalThis.navigator?.onLine);
}
