import { createRoot } from "react-dom/client";
import { App, AppErrorBoundary, logCaughtRenderError } from "./App.jsx";
import { claimTabToken, CLOUD_SAVE_ENABLED_KEY, readStoredValue } from "./appConfig.js";
import { installChunkReload } from "./state/chunkReload.js";

// Cloud sync is opt-in: a device that never turned it on sends nothing, and
// does not download the code that would. Turning it on in CloudSavePanel
// installs it then (setCloudSaveEnabled).
if (readStoredValue(CLOUD_SAVE_ENABLED_KEY, "0") === "1") {
  import("./cloudSave.js").then(({ installCloudSync }) => installCloudSync()).catch(() => {});
}

installChunkReload();
// Started here so the answer is usually in before the runtime chunk is.
claimTabToken();

createRoot(document.getElementById("root"), { onCaughtError: logCaughtRenderError }).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
