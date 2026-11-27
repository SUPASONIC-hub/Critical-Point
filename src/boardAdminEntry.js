import { supabaseTarget } from "./telemetry.js";

/**
 * Whether this page load has anything to do with the board's admin tools
 * (boardAdmin.js), asked without loading them. A player's page answers no on
 * two string tests and one storage read, and nothing else of the admin code is
 * fetched: the sheet and the board's admin bar are chunks of their own.
 *
 * The entry is hidden: no link names it. `?admin` or `#admin` on the address
 * opens the sign-in sheet (and Google sends the page back to `?admin` with the
 * session in the hash). A session already in storage, under the key
 * supabase-js uses, brings the admin bar to the board on a later visit.
 */

/** The storage key supabase-js keeps a session under: `sb-<project ref>-auth-token`. */
export function authStorageKey(url) {
  try {
    return `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
  } catch {
    return "";
  }
}

/** `?admin`, `?admin=1`, `&admin` or `#admin`: the sheet is asked for. */
export function adminSheetAsked(location = globalThis.location) {
  const search = String(location?.search ?? "");
  const hash = String(location?.hash ?? "");
  return /[?&]admin(=|&|$)/.test(search) || hash === "#admin";
}

function hasStoredSession(url, storage) {
  const key = authStorageKey(url);
  try {
    return Boolean(key && storage?.getItem(key));
  } catch {
    return false;
  }
}

/** Whether to open the sign-in sheet: asked for, on a page with a backend. */
export function adminSheetWanted({ location = globalThis.location, target = supabaseTarget() } = {}) {
  return Boolean(target) && adminSheetAsked(location);
}

/** Whether the admin code should load at all on this page: asked for, or signed in before. */
export function adminWanted({ location = globalThis.location, storage = globalThis.localStorage, target = supabaseTarget() } = {}) {
  if (!target) return false;
  return adminSheetAsked(location) || hasStoredSession(target.url, storage);
}
