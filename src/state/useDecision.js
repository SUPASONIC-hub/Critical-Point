import { useState } from "react";

export function useDecision() {
  const [pendingChoice, setPendingChoice] = useState(null);
  const [decisionReveal, setDecisionReveal] = useState(null);
  const [decisionSeconds, setDecisionSeconds] = useState(45);

  return {
    pendingChoice,
    setPendingChoice,
    decisionReveal,
    setDecisionReveal,
    decisionSeconds,
    setDecisionSeconds,
  };
}
