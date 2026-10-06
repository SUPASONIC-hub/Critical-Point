import { useCallback, useMemo, useReducer } from "react";

import { createRunSetters, initialRunState, runReducer } from "./runState.js";

/**
 * The run as one piece of state (state/runState.js has its fields and what
 * resets them). `readContext` is called once, on the first render, for the
 * things a run starts from that are not in the save: a new id, this device's
 * origin and session, the clock, and whether the recovery centre was asked for.
 *
 * `patchRun` changes fields in memory only. A change the save should hold goes
 * through `applyRun` (useAppPersistence), which writes what it patches.
 */
export function useRunState(saved, readContext) {
  const [run, dispatch] = useReducer(runReducer, undefined, () => initialRunState(saved, readContext()));
  const setters = useMemo(() => createRunSetters(dispatch), []);
  const patchRun = useCallback((patch) => dispatch({ type: "patch", patch }), []);
  return { run, setters, patchRun };
}
