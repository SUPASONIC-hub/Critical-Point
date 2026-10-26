/**
 * Web ads (출시 로드맵 2단계: Google AdSense), off unless the build is given a
 * publisher ID. Nothing here reaches the site while it is off: no code in any
 * chunk, no line in the policy, no ads.txt, no meta tag. The build reads two
 * variables (vite.config.js `adsense()`); docs/web-ads.md is the order in
 * which they are set.
 *
 *   ADSENSE_CLIENT  ca-pub- and sixteen digits: site verification only.
 *                        It writes /ads.txt and the `google-adsense-account`
 *                        meta tag -- what AdSense reads to approve the site --
 *                        and nothing else: no ad script, no slot, no line in
 *                        the policy, since no ad is shown and nothing reaches
 *                        Google from a player. Set in the Render dashboard
 *                        only, never in the repository (the ID is public by
 *                        nature -- every page with ads and ads.txt print it --
 *                        but the repository need not carry it).
 *   ADSENSE_ADS     `on` (only with the client): the ads themselves --
 *                        the slots, the AdSense script they load, the policy's
 *                        ad section. Needs ADSENSE_SLOTS.
 *   ADSENSE_SLOTS   `report:1234567890,ranking:2345678901`: the ad units
 *                        made in the AdSense console, by placement. Only the
 *                        placements named here are drawn; read only with
 *                        ADSENSE_ADS=on.
 *
 * A placement is a marker comment in a screen, `{/* ad-slot: placement="report" *\/}`
 * with whatever other props the slot takes. A JSX comment compiles to nothing,
 * so a build without the placement's unit carries no byte of it; a build with
 * it gets `<AdSlot ... />` in its place and the import (src/ads/AdSlot.jsx).
 *
 * Where ads may stand (the app memo 앱출시-B's rules, for the web): never on
 * the table, in a decision, in a briefing or while a clock runs; not before
 * the first season's prologue is behind the player; never in the ending
 * before it has been read; a box of fixed height, so nothing moves.
 */

/** Every placement a screen marks. A slot named in the env for anything else fails the build. */
export const AD_PLACEMENTS = ["report", "ranking"];

const CLIENT = /^ca-pub-\d{16}$/;
const SLOT = /^\d{6,16}$/;

/**
 * The variables read into what the build needs, or a thrown error naming the
 * variable that is malformed. `client: ""` means off; `ads: false` with a
 * client means verification only.
 */
export function readAdsenseEnv(env = {}) {
  const client = String(env.ADSENSE_CLIENT ?? "").trim();
  const adsSetting = String(env.ADSENSE_ADS ?? "").trim();
  const slotList = String(env.ADSENSE_SLOTS ?? "").trim();
  if (adsSetting && adsSetting !== "on") throw new Error(`ADSENSE_ADS is "on" or unset; got "${adsSetting}".`);
  const ads = adsSetting === "on";
  if (!client) {
    if (ads) throw new Error("ADSENSE_ADS=on needs ADSENSE_CLIENT (docs/web-ads.md).");
    return { client: "", publisherId: "", ads: false, slots: {} };
  }
  if (!CLIENT.test(client)) throw new Error(`ADSENSE_CLIENT must be ca-pub- and sixteen digits, as the AdSense console gives it; got "${client}".`);
  const slots = {};
  for (const pair of ads && slotList ? slotList.split(",") : []) {
    const [placement, slot, extra] = pair.split(":").map((part) => part.trim());
    if (!AD_PLACEMENTS.includes(placement)) throw new Error(`ADSENSE_SLOTS names "${placement}", which no screen marks (${AD_PLACEMENTS.join(", ")}).`);
    if (!SLOT.test(slot ?? "") || extra !== undefined) throw new Error(`ADSENSE_SLOTS: "${pair}" is not placement:digits.`);
    slots[placement] = slot;
  }
  if (ads && !Object.keys(slots).length) throw new Error("ADSENSE_ADS=on needs at least one ad unit in ADSENSE_SLOTS (report:<digits>).");
  return { client, publisherId: client.slice("ca-".length), ads, slots };
}

/** The one line of /ads.txt (Google's own: the publisher ID without `ca-`, DIRECT, Google's certification authority ID). */
export const adsTxt = (publisherId) => `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

const MARKER = /\{\s*\/\*\s*ad-slot:\s*([\s\S]*?)\s*\*\/\s*\}/g;
const PLACEMENT = /placement="([a-z]+)"/;
const IMPORT_NAME = "__CpAdSlot";

/**
 * A screen's source with each marker turned into a slot when its placement
 * has a unit, and left as the comment it is (nothing, once compiled)
 * otherwise. Returns null when the file has no marker to change.
 */
export function insertAdSlots(code, { client, ads, slots }) {
  if (!client || !ads || !code.includes("ad-slot:")) return null;
  let used = false;
  const out = code.replace(MARKER, (marker, props) => {
    const placement = PLACEMENT.exec(props)?.[1];
    if (!placement || !AD_PLACEMENTS.includes(placement)) throw new Error(`ad-slot marker without a known placement: ${marker}`);
    if (!slots[placement]) return marker;
    used = true;
    return `<${IMPORT_NAME} ${props} client="${client}" slot="${slots[placement]}" />`;
  });
  return used ? `import { AdSlot as ${IMPORT_NAME} } from "/src/ads/AdSlot.jsx";\n${out}` : null;
}

/**
 * Names only the ad code has. check-bundle-size.mjs fails a build whose
 * JavaScript carries one unless it was built with ADSENSE_ADS=on: off and
 * verification-only builds have no ad code.
 */
export const WEB_AD_CODE_MARKERS = /adsbygoogle|googlesyndication|data-ad-slot|ca-pub-\d/;

/**
 * The Content-Security-Policy the site needs once ads are drawn
 * (ADSENSE_ADS=on; verification alone needs none), for the
 * Render dashboard (README 배포, render.yaml). Google supports only a strict,
 * nonce-based policy for the AdSense code, because the hosts it loads from
 * change (https://support.google.com/adsense/answer/16283098); a static host
 * cannot give each response a nonce, so this widens script/frame/connect/img
 * to https: instead of naming hosts that may change under it. Everything else
 * is the live value in render.yaml, unchanged.
 */
export const AD_CSP =
  "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; " +
  "img-src 'self' data: blob: https:; media-src 'self' blob:; connect-src 'self' https:; " +
  "script-src 'self' 'unsafe-eval' https:; frame-src https:; fenced-frame-src https:; " +
  "style-src 'self' 'unsafe-inline'; font-src 'self' data:; manifest-src 'self'; worker-src 'self'";
