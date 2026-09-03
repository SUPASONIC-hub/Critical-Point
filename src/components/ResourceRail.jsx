import { costWhenRising } from "../gameData.js";

/**
 * The six resources, compact and pinned above the decision.
 *
 * The full status board sits below the choice list, so on a phone the player
 * had to choose first and scroll afterwards to see what the choice was spent
 * from. This rail keeps the stakes on screen while the choices are read.
 */
export function ResourceRail({ resourceMeta, resources, riskPressure, riskTier, easyRiskLabels }) {
  return (
    <section className="resource-rail" aria-label="현재 자원 상태">
      <ul>
        {Object.entries(resourceMeta).map(([key, meta]) => {
          const value = resources[key] ?? 0;
          const strained = costWhenRising.has(key) ? value >= 60 : value <= 30;
          return (
            <li key={key} className={strained ? "strained" : ""}>
              <span>{meta.label}</span>
              <b>{value}</b>
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
