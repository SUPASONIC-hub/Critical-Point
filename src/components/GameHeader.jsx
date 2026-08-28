import React from "react";
import { FileText, RefreshCcw, Save } from "lucide-react";

export function GameHeader({
  node,
  simplify,
  sceneTitleRef,
  onSave,
  onSaveAndExit,
  onReset,
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
    </header>
  );
}
