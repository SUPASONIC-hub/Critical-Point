import { GuardedButton } from "../components/GuardedButton.jsx";
import { FOCUS_MODES, getFocusModeProfile, STANCE_MASTERY_GOAL } from "./gauntletEngine.js";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";

// The stance profiles are written for the engine; the table speaks the page's
// language (src/copy/table.js, `stance`).
// STRIKE's line names LOCK's own cap (`LOCK_CAP`, x1.5), which is under the
// logic combo's (`HAND_CAP`, x1.6): a combo of 8 is already there, and LOCK
// then adds nothing to the pot.
// STEADY's line says "민 뒤" (after a push): its relief is taken off the heat
// there is, so before the first push it cools nothing. The line keeps the
// length of the line before it (21 characters) so the 360px stance row does
// not wrap anew.
const say = tableCopy.stance;
const FOCUS_MODE_COPY = say.modes;

/**
 * The three stances and the season's mastery of each. The stage draws it only
 * once the case lets the player choose a stance (`tableUnlocks`, "stance").
 *
 * On a closed or stopped table the buttons were `aria-disabled` with nothing
 * said and a click still wired, and what the mastery count counts was a
 * `title` on the count, which a phone never shows and a screen reader reads
 * late or not at all. Both are the buttons' description now; the folded
 * briefing (`TableGlossary`) is where the count is explained on screen.
 */
export function StanceRow({ mode: current, mastery, blocked, onPick }) {
  return (
    <div
      className={`gx-focus-modes gx-stance-mastery mode-${current}`}
      role="group"
      aria-label={fill(say.label, { stance: getFocusModeProfile(current).label, count: mastery[current] ?? 0, goal: STANCE_MASTERY_GOAL })}
      data-testid="gauntlet-stance-mastery"
    >
      {FOCUS_MODES.map((mode) => {
        const profile = getFocusModeProfile(mode);
        const active = current === mode;
        const count = mastery[mode] ?? 0;
        const mastered = mastery.mastered.includes(mode);
        return (
          <GuardedButton
            key={mode}
            type="button"
            className={`mode-${mode}${active ? " active" : ""}${mastered ? " is-mastered" : ""}`}
            aria-pressed={active}
            blocked={blocked}
            aria-describedby={blocked ? "gx-stance-blocked gx-stance-detail" : "gx-stance-detail"}
            onClick={() => onPick(mode)}
          >
            <span lang="en">{profile.label}</span>
            <em>
              <span className="sr-only">{say.mastery}</span>
              {mastered ? say.mastered : `${count}/${STANCE_MASTERY_GOAL}`}
            </em>
            <small>{FOCUS_MODE_COPY[mode] ?? profile.text}</small>
            <i aria-hidden="true"><b style={{ width: `${Math.min(100, (count / STANCE_MASTERY_GOAL) * 100)}%` }} /></i>
          </GuardedButton>
        );
      })}
      {blocked && <span id="gx-stance-blocked" className="sr-only">{say.blocked}</span>}
      <span id="gx-stance-detail" className="sr-only">{say.detail}</span>
    </div>
  );
}
