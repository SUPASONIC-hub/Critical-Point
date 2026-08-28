import React from "react";
import { FileText, RefreshCcw, Save } from "lucide-react";

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
  decisionSeconds,
}) {
  return (
    <header className="game-header">
      <div>
        <span className="case-chip">{simplify(node.phase)}</span>
        <h1 ref={sceneTitleRef} tabIndex={-1}>{node.title}</h1>
      </div>
      <div className="top-actions">
        <button type="button" className="ghost" onClick={onSave} aria-keyshortcuts="P">
          <Save size={16} />
          저장
        </button>
        <button type="button" className="ghost" onClick={onSaveAndExit} aria-keyshortcuts="Shift+P">
          <FileText size={16} />
          저장 후 나가기
        </button>
        <button type="button" className="ghost" onClick={onReset}>
          <RefreshCcw size={16} />
          초기화
        </button>
      </div>
      {/* Layer 1 keeps exactly three standing numbers: which case, how far in, how long left. */}
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
        <span className={decisionSeconds <= 10 ? "status-bar-timer urgent" : "status-bar-timer"}>
          남은 시간 <b>{decisionSeconds}초</b>
        </span>
      </div>
    </header>
  );
}
