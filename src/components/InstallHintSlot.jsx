import { useEffect, useState } from "react";
import { loadedChunk, quietImport } from "../state/chunkReload.js";
import { useInstallHintMode } from "../state/installPrompt.js";

/**
 * Where the 홈 화면에 추가 hint goes, in the intro's comfort drawer. Nothing is
 * drawn, and nothing fetched, until the browser has something to offer; then
 * the hint's chunk is fetched by hand (the way CloudSavePanel fetches its
 * body), so a chunk that does not arrive leaves the drawer as it was instead
 * of reloading the page or reaching the root boundary.
 */
export function InstallHintSlot() {
  const mode = useInstallHintMode();
  const [Hint, setHint] = useState(null);
  useEffect(() => {
    if (mode === "none" || Hint) return undefined;
    let live = true;
    quietImport(() => import("./InstallHint.jsx").then(loadedChunk))
      .then(({ InstallHint }) => {
        if (live) setHint(() => InstallHint);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [mode, Hint]);
  return mode !== "none" && Hint ? <Hint mode={mode} /> : null;
}
