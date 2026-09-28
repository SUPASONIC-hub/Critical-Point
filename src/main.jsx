import { createRoot } from "react-dom/client";
import { App, AppErrorBoundary } from "./App.jsx";
import { CLOUD_SAVE_ENABLED_KEY, readStoredValue } from "./appConfig.js";

// Cloud sync is opt-in: a device that never turned it on sends nothing, and
// does not download the code that would. Turning it on in CloudSavePanel
// installs it then (setCloudSaveEnabled).
if (readStoredValue(CLOUD_SAVE_ENABLED_KEY, "0") === "1") {
  import("./cloudSave.js").then(({ installCloudSync }) => installCloudSync()).catch(() => {});
}

createRoot(document.getElementById("root")).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
