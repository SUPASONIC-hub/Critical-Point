import { createRoot } from "react-dom/client";
import { App, AppErrorBoundary } from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
