import { getSceneMinutes } from "../state/caseRoutes.js";
import { Prose } from "./Prose.jsx";
import { fill } from "../locale.js";
import runLines from "../copy/runLines.js";

/**
 * A scene a bust skipped, as minutes: when, where and who, what was said and
 * what was asked, and that the analyst played nothing. Closed until it is
 * asked for, in the reveal and in the report's decision log alike.
 *
 * The summary carries a tabindex because the reveal's focus trap lists what it
 * cycles through by selector, and a bare `summary` is not on that list: Tab
 * would have gone round the one button and never reached the fold.
 */
export function SceneMinutes({ nodeId }) {
  const minutes = getSceneMinutes(nodeId);
  if (!minutes) return null;
  return (
    <details className="decision-scene" data-testid="scene-minutes">
      <summary tabIndex={0}>{fill(runLines.minutes.summary, { title: minutes.title })}</summary>
      <div>
        <small>{minutes.heading}</small>
        {minutes.lead && <p><Prose text={minutes.lead} /></p>}
        <p><Prose text={minutes.text} /></p>
        {minutes.question && <p className="spoken-line">{fill(runLines.minutes.question, { question: minutes.question })}</p>}
        <small>{runLines.minutes.absent}</small>
      </div>
    </details>
  );
}
