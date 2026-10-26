import { useEffect, useRef } from "react";

/**
 * One AdSense unit, in a box of fixed height (출시 로드맵 2단계, draft).
 *
 * No screen imports this file. A build given ADSENSE_CLIENT and a unit
 * for a placement (ADSENSE_SLOTS) turns that placement's marker comment
 * into this component (scripts/adsense-config.mjs `insertAdSlots`); every
 * other build carries none of it.
 *
 * The box is 300x250 plus its label, and keeps that height whether the ad
 * fills, fails or is blocked, so nothing below it moves: 300 wide fits a
 * 360px phone inside the page's 16px gutters. The label is the one line a
 * screen reader hears before the ad's own frame. Nothing here animates.
 * `hidden` keeps the box out of a screen where ads may not stand yet (the
 * prologue, an ending not yet read), so the screen need not branch.
 */
const SCRIPT_ID = "cp-adsense";
const BOX = { display: "grid", justifyItems: "center", alignContent: "start", gap: 6, height: 276, margin: "32px auto 0", overflow: "hidden", contain: "layout paint" };
const LABEL = { fontSize: "0.75rem", lineHeight: "20px", color: "var(--c-gray-68)", letterSpacing: "0.04em", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const UNIT = { display: "inline-block", width: 300, height: 250 };

function loadScript(client) {
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  document.head.append(script);
}

export function AdSlot({ placement, client, slot, hidden = false }) {
  const unitRef = useRef(null);
  useEffect(() => {
    if (hidden || !unitRef.current || unitRef.current.dataset.adsbygoogleStatus) return;
    loadScript(client);
    try {
      const host = /** @type {any} */ (window);
      (host.adsbygoogle = host.adsbygoogle || []).push({});
    } catch {
      // A blocker or a failed load leaves the box empty at its height; the screen goes on.
    }
  }, [client, hidden]);
  if (hidden) return null;
  return (
    <aside className="ad-slot" aria-label="광고" data-placement={placement} style={BOX}>
      <span style={LABEL}>광고 · 점수와 순위에는 영향이 없습니다</span>
      <ins ref={unitRef} className="adsbygoogle" style={UNIT} data-ad-client={client} data-ad-slot={slot} />
    </aside>
  );
}
