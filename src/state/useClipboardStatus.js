import { useEffect, useRef, useState } from "react";

import { copyText } from "../appConfig.js";
import { encodeReplaySeed, getTraceEvents, REPLAY_QUERY_KEY } from "./trace.js";

const STATUS_HOLD_MS = 1600;

/**
 * The transient "복사됨 / Copy failed" flash under the copy buttons.
 *
 * The timer lives on a ref so a second copy replaces the pending clear instead
 * of racing it, and so unmounting cancels it.
 */
export function useClipboardStatus() {
  const [copyStatus, setCopyStatus] = useState("");
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  function flashCopyStatus(text) {
    setCopyStatus(text);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setCopyStatus("");
      timerRef.current = null;
    }, STATUS_HOLD_MS);
  }

  return { copyStatus, flashCopyStatus };
}

/**
 * The three copy actions on the result and play screens. Kept as a factory so
 * they read the current render's values without a dependency array.
 */
export function createClipboardActions({ flashCopyStatus, sessionCode, buildReplaySeed }) {
  async function copySessionCode() {
    flashCopyStatus((await copyText(sessionCode)) ? "복사됨" : "복사 실패");
  }

  async function copyDiagnosticTrace() {
    const copied = await copyText(JSON.stringify(getTraceEvents(), null, 2));
    flashCopyStatus(copied ? "Trace copied" : "Copy failed");
  }

  async function copyReplayLink() {
    const encoded = encodeReplaySeed(buildReplaySeed());
    const replayUrl = encoded
      ? `${window.location.origin}${window.location.pathname}?${REPLAY_QUERY_KEY}=${encoded}`
      : "";
    const copied = replayUrl ? await copyText(replayUrl) : false;
    flashCopyStatus(copied ? "Replay link copied" : "Copy failed");
  }

  return { copySessionCode, copyDiagnosticTrace, copyReplayLink };
}
