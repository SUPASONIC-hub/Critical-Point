import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { createRoot } from "react-dom/client";
import { App, AppErrorBoundary } from "./App.jsx";
import { installCloudSync } from "./cloudSave.js";

installCloudSync();

createRoot(document.getElementById("root")).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
