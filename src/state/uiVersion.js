import { useSyncExternalStore } from "react";
import { readStoredValue, UI_VERSION_KEY, writeStoredValue } from "../appConfig.js";

/**
 * The first-five-minutes redesign (owner decision 2026-11-16 「1」), behind a
 * switch until the owner has compared it on a phone.
 *
 * `?ui=v2` turns it on and `?ui=v1` off; either is remembered on the device
 * (UI_VERSION_KEY), so the next visit opens the same way without the address.
 * Off, nothing of it is downloaded: its components and stylesheet are one lazy
 * chunk (src/uiV2/index.js), fetched before the first paint only on a device
 * that asked for it, so the page does not paint the old look and swap.
 *
 * A leaf module of the entry chunk, like accessibilitySettings.js.
 */
const VERSIONS = new Set(["v1", "v2"]);
let loaded = null;
const listeners = new Set();

/** The version this page opens with: the address's, remembered, or the device's last. */
export function readUiVersion(search = globalThis.location?.search ?? "") {
  const asked = new URLSearchParams(search).get("ui");
  if (VERSIONS.has(asked)) {
    writeStoredValue(UI_VERSION_KEY, asked);
    return asked;
  }
  return readStoredValue(UI_VERSION_KEY, "v1") === "v2" ? "v2" : "v1";
}

/**
 * Marks <html data-ui="v2"> and fetches the redesign's chunk. The promise
 * settles either way: a chunk that cannot be fetched leaves the page as it was.
 * Null when the page is on v1, so the caller paints at once.
 */
export function installUiVersion(search) {
  if (readUiVersion(search) !== "v2") return null;
  const root = globalThis.document?.documentElement;
  if (root) root.dataset.ui = "v2";
  return import("../uiV2/index.js").then(
    (module) => {
      loaded = module;
      for (const listener of listeners) listener();
      return module;
    },
    () => {
      if (root) delete root.dataset.ui;
      return null;
    },
  );
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The redesign's module once it is in, else null: the screens draw v1. */
export function useUiV2() {
  return useSyncExternalStore(subscribe, () => loaded, () => null);
}
