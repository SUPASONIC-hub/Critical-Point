import { ChevronRight } from "lucide-react";
import resultCopy from "../copy/result.js";
import { fill } from "../locale.js";
import { requestSideCase, sideCasesOpenedBy } from "../sideCases.js";

/**
 * 11-18 「현재 준비된 번외 스토리 전부 공개해줘. 스토리 흐름 순서에 맞게
 * 곳곳에.」: on the report of the season case a side case follows in the
 * story, one line that it opened and a button into it. The button leaves for
 * the start screen, which opens the side case as it mounts
 * (sideCases.requestSideCase); the season stays where it was, as the
 * ranking button leaves it. Nothing is drawn when this case opened none, or
 * when every side case was open already (sideCases.sideCasesOpenedBy).
 */
export function SideOpenedPanel({ caseId, caseResults, setStarted }) {
  const opened = sideCasesOpenedBy(caseId, { caseResults });
  if (!opened.length) return null;
  const words = resultCopy.sideOpened;
  return (
    <section className="ending-epilogue-panel" aria-label={words.label} data-testid="side-opened">
      <p>{fill(words.text, { names: opened.map((side) => fill(words.name, side)).join(", ") })}</p>
      {opened.map((side) => (
        <button
          key={side.id}
          type="button"
          className="ghost"
          data-testid={`side-opened-${side.id}`}
          onClick={() => {
            requestSideCase(side.id);
            setStarted(false);
          }}
        >
          <ChevronRight size={16} />
          {fill(words.open, { name: side.label })}
        </button>
      ))}
    </section>
  );
}
