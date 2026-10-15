import { useEffect, useState } from "react";

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
 */
let answer;
let request = null;

function ask() {
  request ??= callSupabaseRpc("scene_bust_rates").then(
    ({ data }) => (answer = data ?? null),
    () => (answer = null),
  );
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
