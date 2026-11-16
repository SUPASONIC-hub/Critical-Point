/**
 * The first-five-minutes redesign (?ui=v2): one lazy chunk, fetched before the
 * first paint only on a device that asked for it (state/uiVersion.js). Its
 * stylesheet is scoped to `:root[data-ui="v2"]`, so even loaded it changes
 * nothing on a page that is not marked.
 */
import "./uiV2.css";

export { BriefingThread } from "./BriefingThread.jsx";
export { HandGestures } from "./HandGestures.jsx";
export { RollingNumber } from "./RollingNumber.jsx";
