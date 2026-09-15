import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { createRoot } from "react-dom/client";
import { App, AppErrorBoundary } from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
