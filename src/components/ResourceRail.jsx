import { costWhenRising } from "../gameData.js";

/**
 * The three numbers a decision is actually made against.
 *
 * The rail printed all six as bare integers, which is how a screen ends up
 * asking the player to optimise six axes with no read on which one matters.
 * These three are the run's own question -- how long is left, who still trusts
 * you, who is paying for it -- and they are meters rather than digits so a
 * glance is enough. The other three, and the exact values of these, are one tap
 * away in the record room.
 */
const PRIMARY = ["time", "trust", "humanCost"];

export function ResourceRail({ resourceMeta, resources, riskPressure, riskTier, easyRiskLabels }) {
  return (
    <section className="resource-rail" aria-label="현재 자원 상태">
      <ul>
        {PRIMARY.filter((key) => resourceMeta[key]).map((key) => {
          const meta = resourceMeta[key];
          const value = resources[key] ?? 0;
          const rising = costWhenRising.has(key);
          const strained = rising ? value >= 60 : value <= 30;
          const fill = Math.max(0, Math.min(100, value));
          return (
            <li key={key} className={strained ? "strained" : ""}>
              <span>{meta.label}</span>
              <b>{value}</b>
              <i
                className={rising ? "gauge cost" : "gauge"}
                role="meter"
                aria-label={`${meta.label} ${value}`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={value}
              >
                <em style={{ width: `${fill}%` }} />
              </i>
            </li>
          );
        })}
      </ul>
      <p className={`resource-rail-risk ${riskTier.toLowerCase()}`}>
        <span>위험 압력</span>
        <b>{riskPressure}</b>
        <small>{easyRiskLabels[riskTier] ?? riskTier}</small>
      </p>
    </section>
  );
}
