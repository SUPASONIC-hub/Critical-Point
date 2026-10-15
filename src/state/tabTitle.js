import { useEffect } from "react";

/**
 * The browser tab's title, as the situation names it (개선 포인트 A3).
 *
 * The tab is the one part of the game a player sees from another tab, so a
 * table near the wall, a bust and the season's ruling are written there too.
 * Each place that has something to say holds a slot; the highest rank shown
 * wins, and with no slot held the title is index.html's own again.
 *
 * Nothing here runs on a timer. The title changes when the game's state does
 * -- a push, a verdict, a screen -- and never alternates or blinks, so it
 * asks nothing of reduced motion and gives a screen reader no stream of
 * announcements.
 */

const SUFFIX = " · 임계점";
const claims = new Map();
let baseTitle = null;

function paint() {
  if (typeof document === "undefined") return;
  baseTitle ??= document.title;
  let top = null;
  for (const claim of claims.values()) if (!top || claim.rank >= top.rank) top = claim;
  const next = top ? `${top.text}${SUFFIX}` : baseTitle;
  if (document.title !== next) document.title = next;
}

export function dropTabTitle(slot) {
  if (claims.delete(slot)) paint();
}

/**
 * `text`: a string holds the slot, `null` lets it go, `undefined` leaves the
 * slot as it is. `keep` holds the title past this component's unmount -- a
 * bust stays on the tab through the next window's briefing, until that table
 * opens and says `null`.
 */
export function useTabTitle(slot, text, { rank = 0, keep = false } = {}) {
  useEffect(() => {
    if (text === undefined) return undefined;
    if (!text) {
      dropTabTitle(slot);
      return undefined;
    }
    claims.set(slot, { text, rank });
    paint();
    return keep ? undefined : () => dropTabTitle(slot);
  }, [slot, text, rank, keep]);
}

/** What a screen says: off the table, the table's slot (a kept bust) goes. */
export function useScreenTabTitle(screen, text) {
  useEffect(() => {
    if (screen !== "play") dropTabTitle("table");
  }, [screen]);
  useTabTitle("screen", text, { rank: 2 });
}
