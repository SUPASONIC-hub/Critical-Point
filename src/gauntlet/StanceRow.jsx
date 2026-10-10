import { FOCUS_MODES, getFocusModeProfile, STANCE_MASTERY_GOAL } from "./gauntletEngine.js";

// The stance profiles are written for the engine; the table speaks Korean.
const FOCUS_MODE_COPY = {
  strike: "판돈 배율 크게 · 차지가 빠르다",
  steady: "보상 작게 · 락마다 테이블 냉각",
  expose: "카드의 자원 효과 증폭",
};

/**
 * The three stances and the season's mastery of each. The stage draws it only
 * once the case lets the player choose a stance (`tableUnlocks`, "stance").
 */
export function StanceRow({ mode: current, mastery, blocked, onPick }) {
  return (
    <div
      className={`gx-focus-modes gx-stance-mastery mode-${current}`}
      role="group"
      aria-label={`자세 · ${getFocusModeProfile(current).label} 숙련 ${mastery[current] ?? 0}/${STANCE_MASTERY_GOAL}`}
      data-testid="gauntlet-stance-mastery"
    >
      {FOCUS_MODES.map((mode) => {
        const profile = getFocusModeProfile(mode);
        const active = current === mode;
        const count = mastery[mode] ?? 0;
        const mastered = mastery.mastered.includes(mode);
        return (
          <button
            key={mode}
            type="button"
            className={`mode-${mode}${active ? " active" : ""}${mastered ? " is-mastered" : ""}`}
            aria-pressed={active}
            aria-disabled={blocked || undefined}
            onClick={() => onPick(mode)}
          >
            <span>{profile.label}</span>
            <em title="시즌 숙련: 차지한 채로 확정한 판">
              <span className="sr-only">시즌 숙련 </span>
              {mastered ? "MASTER" : `${count}/${STANCE_MASTERY_GOAL}`}
            </em>
            <small>{FOCUS_MODE_COPY[mode] ?? profile.text}</small>
            <i aria-hidden="true"><b style={{ width: `${Math.min(100, (count / STANCE_MASTERY_GOAL) * 100)}%` }} /></i>
          </button>
        );
      })}
    </div>
  );
}
