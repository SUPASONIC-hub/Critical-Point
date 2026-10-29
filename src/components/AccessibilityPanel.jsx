import { fill } from "../locale.js";
import comfortCopy from "../copy/comfort.js";
import { setAccessibility, STORY_SCALES, TABLE_TIME_SCALES, useAccessibility } from "../state/accessibilitySettings.js";

// 스토리 모드 is first: it is the one that changes what the table asks. This
// is the only place it is chosen; the play-style drawer's note points here.
// Each switch's words are src/copy/comfort.js's, under its key.
const TOGGLES = ["storyMode", "holdReadingClock", "foldReadScenes", "calmEffects", "edgeNotices", "letterKeys", "stillIntro"];

/**
 * The comfort settings: in the intro's setup console, and in the dialog the
 * play header opens (ComfortDialog.jsx), which holds the table's clock while
 * it is up. Each one is stored the moment it changes and read where it
 * applies: src/state/accessibilitySettings.js says what each one does.
 */
export function AccessibilityPanel() {
  const settings = useAccessibility();
  return (
    <section className="accessibility-panel start-console-section" aria-label={comfortCopy.label}>
      <fieldset className="accessibility-time">
        <legend>{comfortCopy.tableTime.legend}</legend>
        <p>{comfortCopy.tableTime.text}</p>
        <div>
          {TABLE_TIME_SCALES.map((scale) => (
            <label key={scale}>
              <input
                type="radio"
                name="accessibility-table-time"
                value={scale}
                checked={settings.tableTime === scale}
                onChange={() => setAccessibility({ tableTime: scale })}
              />
              <span>{fill(comfortCopy.tableTime.scale, { scale })}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {TOGGLES.map((key) => (
        <label key={key} className="accessibility-toggle">
          <input type="checkbox" checked={settings[key]} onChange={(event) => setAccessibility({ [key]: event.target.checked })} />
          <span>
            <b>{comfortCopy.toggles[key].label}</b>
            <small>{comfortCopy.toggles[key].text}</small>
          </span>
        </label>
      ))}
      {/* Last, so the keyboard reaches the switches straight after the table's clock. */}
      <fieldset className="accessibility-time" data-testid="story-scale">
        <legend>{comfortCopy.storyScale.legend}</legend>
        <p>{comfortCopy.storyScale.text}</p>
        <div>
          {STORY_SCALES.map((scale, index) => (
            <label key={scale}>
              <input
                type="radio"
                name="accessibility-story-scale"
                value={scale}
                checked={settings.storyScale === scale}
                onChange={() => setAccessibility({ storyScale: scale })}
              />
              <span>{comfortCopy.storyScale.labels[index]}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
