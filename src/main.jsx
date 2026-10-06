import { createRoot } from "react-dom/client";
import { App, AppErrorBoundary, logCaughtRenderError } from "./App.jsx";
import { claimTabToken, CLOUD_SAVE_ENABLED_KEY, readStoredValue } from "./appConfig.js";
import { applyAccessibilityToDocument } from "./state/accessibilitySettings.js";
import { installServiceWorker } from "./serviceWorker/register.js";
import { installChunkReload } from "./state/chunkReload.js";

// Cloud sync is opt-in: a device that never turned it on sends nothing, and
// does not download the code that would. Turning it on in CloudSavePanel
// installs it then (setCloudSaveEnabled).
if (readStoredValue(CLOUD_SAVE_ENABLED_KEY, "0") === "1") {
  import("./cloudSave.js").then(({ installCloudSync }) => installCloudSync()).catch(() => {});
}

installChunkReload();
// Before the first paint: a still intro must not start moving and then stop.
applyAccessibilityToDocument();
// Started here so the answer is usually in before the runtime chunk is.
claimTabToken();
// After `load`, and only in a release: what lets an installed copy open with
// no connection (serviceWorker/worker.js).
installServiceWorker();

createRoot(document.getElementById("root"), { onCaughtError: logCaughtRenderError }).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
