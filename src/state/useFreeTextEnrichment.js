import { useCallback, useEffect, useRef } from "react";

import { requestFreeTextAnalysis } from "../freeTextAnalysis.js";
import { saveAnalysisTelemetry, telemetryEnabled } from "../telemetry.js";

/**
 * Attaches the LLM reading of a free-input card to the log entry the card
 * already wrote.
 *
 * The regex scorer resolves the card synchronously and the resource bars have
 * moved before this is called, so nothing here is allowed to block, and nothing
 * here can fail in a way the player has to see. The request either comes back
 * in time to enrich an entry that is still the entry it was, or it is dropped.
 */
export function useFreeTextEnrichment(setLog, telemetry = {}) {
  // One controller for every request in flight, so restarting or reloading a
  // run stops answers about a card the player has already left behind.
  const abortRef = useRef(null);
  // The identity and the queue change on their own schedule and none of it
  // should rebuild the callback the submit handler holds.
  const telemetryRef = useRef(telemetry);
  useEffect(() => {
    telemetryRef.current = telemetry;
  });

  useEffect(() => () => abortRef.current?.abort(), []);

  const abortEnrichment = useCallback(() => abortRef.current?.abort(), []);

  const enrichEntry = useCallback(
    (index, identity, input) => {
      abortRef.current?.abort();
      const controller = typeof AbortController === "function" ? new AbortController() : null;
      abortRef.current = controller;
      requestFreeTextAnalysis(input, { signal: controller?.signal }).then((analysis) => {
        if (!analysis) return;
        setLog((currentLog) => {
          const target = currentLog[index];
          // The run can be restarted or loaded from a save while the answer is
          // in the air. Position alone would then point at a different card, so
          // the card has to identify itself before it is written to.
          if (!target || target.nodeId !== identity.nodeId || target.choiceId !== identity.choiceId) {
            return currentLog;
          }
          const next = [...currentLog];
          next[index] = { ...target, llmEnriched: true, analysis };
          return next;
        });

        // The case row carries this inside its decision log for every card but
        // the last one of a case, which is still in flight when that row is
        // written. Sending it here is what closes that gap.
        const { sessionId, sessionCode, runId, queueTelemetry } = telemetryRef.current;
        if (!telemetryEnabled || !sessionId) return;
        const eventId = `analysis-${runId ?? "run"}-${identity.nodeId}-${identity.choiceId ?? "free"}`;
        const payload = {
          session_id: sessionId,
          session_code: sessionCode ?? null,
          run_id: runId ?? null,
          case_id: identity.caseId,
          node_id: identity.nodeId,
          choice_id: identity.choiceId ?? null,
          analysis,
        };
        saveAnalysisTelemetry(payload, eventId).catch(() => {
          queueTelemetry?.({ id: eventId, type: "analysis", label: `${identity.caseId} 자유입력 분석`, payload });
        });
      });
    },
    [setLog],
  );

  return { enrichEntry, abortEnrichment };
}
