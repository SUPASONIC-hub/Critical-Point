import React from "react";
import { FileText } from "lucide-react";

export function MemoPanel({ memo = [], onOpen, simplify }) {
  return (
    <details className="memo-panel" onToggle={onOpen}>
      <summary>
        <h2>
          <FileText size={17} />
          케이스데스크 자료
        </h2>
        <span>{memo.length}개 근거</span>
      </summary>
      <ul>
        {memo.map((item) => (
          <li key={item}>{simplify(item)}</li>
        ))}
      </ul>
    </details>
  );
}
