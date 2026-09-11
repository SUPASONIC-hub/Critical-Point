import { CriticalPointEngine } from "./CriticalPointEngine.jsx";

export function DecisionRail({ pendingChoice }) {
  return (
    <>
      <CriticalPointEngine active />
      <div className="decision-rail" aria-label="Decision phases">
        <span className="done">Scene read</span>
        <i aria-hidden="true" />
        <span className="active">Choose</span>
        <i aria-hidden="true" />
        <span className={pendingChoice ? "active" : "muted"}>Commit</span>
      </div>
    </>
  );
}
