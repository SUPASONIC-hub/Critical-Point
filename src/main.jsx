import { createRoot } from "react-dom/client";
import { App, AppErrorBoundary, logCaughtRenderError } from "./App.jsx";
import { claimTabToken } from "./appConfig.js";
import { installCloudSync, isCloudSaveEnabled } from "./cloudSave.js";
import { installChunkReload } from "./state/chunkReload.js";

// Cloud sync is opt-in: a device that never turned it on sends nothing. Turning
// it on in CloudSavePanel installs it then (setCloudSaveEnabled).
if (isCloudSaveEnabled()) installCloudSync();

installChunkReload();
// Started here so the answer is usually in before the runtime chunk is.
claimTabToken();

createRoot(document.getElementById("root"), { onCaughtError: logCaughtRenderError }).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
