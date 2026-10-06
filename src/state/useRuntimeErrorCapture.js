import { useEffect } from "react";

import { limitText } from "../appConfig.js";
import { isChunkLoadError } from "./chunkReload.js";
import { safeStringify } from "./diagnosticUtils.js";
import { recordAppError } from "./errorRecovery.js";

let consoleErrorHookBusy = false;
let lastConsoleEntryId = "";

// The error boundary and reportSilentFailure already write their own entries,
// so skip their console output instead of logging the same failure twice.
function isAlreadyRecordedConsoleError(text) {
  return text.startsWith("Critical Point render error") || text.includes("[silent:");
}

const toRecoveredError = (entry) => ({
  id: entry.id,
  occurredAt: entry.occurredAt,
  source: entry.context.source,
  message: entry.error.message,
  currentCase: entry.context.currentCase,
  nodeId: entry.context.nodeId,
});

/**
 * Everything that fails outside a render while the runtime is up: an uncaught
 * error, a rejected promise nobody handled, and whatever is written to
 * `console.error`. Each is recorded once (`recordAppError`), and the first two
 * raise the recovery notice.
 *
 * An Error passed to the console is recorded as it is. It used to be renamed
 * "ConsoleError" in place, which changed the name on the object its thrower
 * still held -- and on the one the error boundary recorded a moment later.
 */
export function useRuntimeErrorCapture({ onRecovered, onLogged }) {
  useEffect(() => {
    // A screen's chunk that would not load is the deploy's doing, not the
    // run's: it is answered with a reload (chunkReload.js), never recorded
    // against the save.
    const handleWindowError = (event) => {
      if (isChunkLoadError(event.error)) return;
      onRecovered(toRecoveredError(recordAppError(event.error ?? event.message, {}, "window-error")));
      onLogged();
    };
    const handleUnhandledRejection = (event) => {
      if (isChunkLoadError(event.reason)) return;
      onRecovered(toRecoveredError(recordAppError(event.reason, {}, "unhandled-rejection")));
      onLogged();
    };
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      if (consoleErrorHookBusy) return;
      const text = args
        .map((arg) => (arg instanceof Error ? arg.message : typeof arg === "string" ? arg : safeStringify(arg)))
        .join(" ")
        .trim();
      if (!text || isAlreadyRecordedConsoleError(text)) return;
      consoleErrorHookBusy = true;
      try {
        const logged = args.find((arg) => arg instanceof Error);
        const consoleError = logged ?? Object.assign(new Error(limitText(text, 400)), { name: "ConsoleError" });
        // A line said again is the record it already has (errorRecovery.js),
        // and the error log is read back only when there is a new one in it.
        const entry = recordAppError(consoleError, {}, "console-error");
        if (entry.id !== lastConsoleEntryId) onLogged();
        lastConsoleEntryId = entry.id;
      } catch {
        // Never let diagnostics break the console itself.
      } finally {
        consoleErrorHookBusy = false;
      }
    };
    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [onLogged, onRecovered]);
}
