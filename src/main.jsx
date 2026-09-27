import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { createRoot } from "react-dom/client";
import { App, AppErrorBoundary } from "./App.jsx";
import { installCloudSync, isCloudSaveEnabled } from "./cloudSave.js";

// Cloud sync is opt-in: a device that never turned it on sends nothing. Turning
// it on in CloudSavePanel installs it then (setCloudSaveEnabled).
if (isCloudSaveEnabled()) installCloudSync();

createRoot(document.getElementById("root")).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
