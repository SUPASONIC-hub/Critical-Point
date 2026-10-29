import { useSyncExternalStore } from "react";
import { INSTALL_HINT_DISMISSED_KEY, readStoredValue, writeStoredValue } from "../appConfig.js";

/**
 * 홈 화면에 추가: whether the intro offers it, and how.
 *
 * The page is already an installable web app (public/manifest.webmanifest,
 * display standalone, and the service worker). What was missing was a word
 * on the screen saying so. Three answers:
 *
 *   "prompt"  Chrome and its kin sent `beforeinstallprompt`: the hint has a
 *             button that opens the browser's own install dialog.
 *   "ios"     an iPhone or iPad, which sends no such event: the hint says
 *             where the share menu puts it.
 *   "none"    nothing to say -- already opened from the home screen, just
 *             installed, closed by the player, or a browser that offers no
 *             install at all (a desktop Firefox, the e2e suite's Chromium).
 *
 * The event can arrive before the intro has rendered, so the listener is set
 * in main.jsx, from the entry chunk, and the hint itself is a chunk of its own
 * (components/InstallHint.jsx) that is fetched only once there is something to
 * show. The browser's own install banner is left as it is: the event is kept,
 * not cancelled.
 */
export function installHintMode({ standalone, installed, dismissed, deferred, ios }) {
  if (standalone || installed || dismissed) return "none";
  if (deferred) return "prompt";
  return ios ? "ios" : "none";
}

/** An iPhone, an iPod, or an iPad -- which since iPadOS 13 calls itself a Mac with a touch screen. */
export function isAppleTouch(navigator) {
  if (!navigator) return false;
  if (/iPhone|iPad|iPod/.test(navigator.userAgent ?? "")) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

/** Opened from the home screen: the standalone display mode, or iOS's own flag for it. */
export function isStandalone(scope) {
  try {
    if (scope.matchMedia?.("(display-mode: standalone)").matches) return true;
  } catch {
    // An old engine that does not know the media feature: not standalone.
  }
  return scope.navigator?.standalone === true;
}

const facts = { standalone: false, installed: false, dismissed: false, deferred: null, ios: false };
let mode = "none";
const listeners = new Set();

function update(change) {
  Object.assign(facts, change);
  const next = installHintMode(facts);
  if (next === mode) return;
  mode = next;
  for (const listener of listeners) listener();
}

export const getInstallHintMode = () => mode;
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useInstallHintMode() {
  return useSyncExternalStore(subscribe, getInstallHintMode, getInstallHintMode);
}

export function installInstallPrompt(scope = globalThis) {
  scope.addEventListener?.("beforeinstallprompt", (event) => update({ deferred: event }));
  scope.addEventListener?.("appinstalled", () => update({ installed: true, deferred: null }));
  update({
    standalone: isStandalone(scope),
    ios: isAppleTouch(scope.navigator),
    dismissed: readStoredValue(INSTALL_HINT_DISMISSED_KEY, "0") === "1",
  });
}

/**
 * Opens the browser's install dialog. An event can be prompted once, so the
 * button goes either way; a browser that wants to ask again later sends a new
 * event, and the button comes back with it.
 */
export function promptInstall() {
  const event = facts.deferred;
  if (!event) return;
  update({ deferred: null });
  try {
    Promise.resolve(event.prompt()).catch(() => {});
  } catch {
    // Prompted already, or the browser refused: the button is gone either way.
  }
}

/** Closed by the player: stored, so it does not come back on this device. */
export function dismissInstallHint() {
  writeStoredValue(INSTALL_HINT_DISMISSED_KEY, "1");
  update({ dismissed: true });
}
