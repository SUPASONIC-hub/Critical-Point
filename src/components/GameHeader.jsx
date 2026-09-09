import { FileText, RefreshCcw, Save } from "lucide-react";

/**
 * Scene identity and the run's two standing numbers.
 *
 * The three session buttons used to be full-width rows above the story -- 250px
 * of save/exit/reset before a phone reader reached the scene. They are icons in
 * one row now, with the label carried by `aria-label` and `title` rather than
 * by a line of type. The decision clock moved out of this bar entirely: it
 * belongs above the choices, where the decision is, and one clock is enough
 * (`src/components/DecisionClock.jsx`).
 */
export function GameHeader({
  node,
  simplify,
  sceneTitleRef,
  onSave,
  onSaveAndExit,
  onReset,
  caseNumber,
  caseTotal,
  progress,
}) {
  return (
    <header className="game-header">
      <div>
        <span className="case-chip">{simplify(node.phase)}</span>
        <h1 ref={sceneTitleRef} tabIndex={-1}>{node.title}</h1>
      </div>
      <div className="top-actions compact-actions">
        <button type="button" className="ghost" onClick={onSave} aria-keyshortcuts="P" aria-label="저장" title="저장">
          <Save size={16} />
        </button>
        <button
          type="button"
          className="ghost"
          onClick={onSaveAndExit}
          aria-keyshortcuts="Shift+P"
          aria-label="저장 후 나가기"
          title="저장 후 나가기"
        >
          <FileText size={16} />
        </button>
        <button type="button" className="ghost" onClick={onReset} aria-label="초기화" title="초기화">
          <RefreshCcw size={16} />
        </button>
      </div>
      {/* Layer 1 keeps exactly two standing numbers: which case, and how far in. */}
      <div className="status-bar" aria-label="현재 진행 상태">
        <span>
          사건 <b>{caseNumber}</b>/{caseTotal}
        </span>
        <div
          className="status-bar-progress"
          role="progressbar"
          aria-label="현재 사건 진행률"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>
  );
}
