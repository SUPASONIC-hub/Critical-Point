import { useEffect, useMemo, useState } from "react";

import { readStanding } from "../logicReport.js";
import { callSupabaseRpc } from "../telemetry.js";

/**
 * Where the season's logic score stands among the others: asked of the server
 * once, when the season has ended on a score the ranking takes (`value`, from
 * `getRankedLogicHold`; null before the ending and for a season on no ranking,
 * which asks nothing).
 *
 * The request carries nothing of the player's: `logic_hold_cutoffs()` takes no
 * argument and answers the ranking's cut points, and the place is read off
 * them on this device (`readStanding`). So it is asked like the ranking table
 * is, whatever the research consent says.
 *
 * No standing -- null -- until an answer has come, and for good when none
 * does: a build with no server answers nothing (`callSupabaseRpc` skips), and
 * a server without the function, a refusal, a lost network or the deadline
 * reject. The panel then prints the score with no rank beside it; nothing is
 * said of the failure and nothing asks again.
 */
export function useLogicStanding(value) {
  const [answer, setAnswer] = useState(null);
  const asked = value !== null;
  useEffect(() => {
    if (!asked) return undefined;
    let current = true;
    callSupabaseRpc("logic_hold_cutoffs").then(
      ({ data }) => current && setAnswer(data),
      () => {},
    );
    return () => {
      current = false;
    };
  }, [asked]);
  return useMemo(() => (asked ? readStanding(answer, value) : null), [answer, asked, value]);
}
