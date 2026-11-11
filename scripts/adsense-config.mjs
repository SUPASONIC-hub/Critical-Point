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
 *   ADSENSE_ADS     `notice` or `on` (only with the client). `notice`: no
 *                        ad and no code yet, only the policy's and the
 *                        terms' notice of the change at their top (the
 *                        policy's section 12 promises it seven days ahead).
 *                        `on`: the ads themselves -- the slots, the AdSense
 *                        script they load, the policy's ad section and its
 *                        date. `on` needs ADSENSE_SLOTS; both need ADSENSE_DATE.
 *   ADSENSE_DATE    `2026-12-01`: the day the policy with ads takes effect.
 *                        The notice names it; the policy and the terms carry
 *                        it as their date once ADSENSE_ADS=on. Set it at least
 *                        seven days after the notice is deployed.
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
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `2026-12-01` when it is a real day, otherwise false. */
const isDay = (text) => {
  const match = DATE.exec(text);
  if (!match) return false;
  const day = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return day.toISOString().slice(0, 10) === text;
};

/**
 * The variables read into what the build needs, or a thrown error naming the
 * variable that is malformed. `client: ""` means off; `ads: false` with a
 * client means verification only. `stage` is what the plain pages say --
 * "off", "notice" (the notice of the change only) or "on" -- and `date` the
 * day of ADSENSE_DATE for the two that need it, "" otherwise.
 */
export function readAdsenseEnv(env = {}) {
  const client = String(env.ADSENSE_CLIENT ?? "").trim();
  const adsSetting = String(env.ADSENSE_ADS ?? "").trim();
  const slotList = String(env.ADSENSE_SLOTS ?? "").trim();
  const dateSetting = String(env.ADSENSE_DATE ?? "").trim();
  if (adsSetting && adsSetting !== "on" && adsSetting !== "notice") throw new Error(`ADSENSE_ADS is "notice", "on" or unset; got "${adsSetting}".`);
  const stage = adsSetting || "off";
  const ads = stage === "on";
  if (!client) {
    if (stage !== "off") throw new Error(`ADSENSE_ADS=${stage} needs ADSENSE_CLIENT (docs/web-ads.md).`);
    return { client: "", publisherId: "", ads: false, slots: {}, stage: "off", date: "" };
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
  if (stage !== "off" && !isDay(dateSetting)) {
    throw new Error(`ADSENSE_ADS=${stage} needs ADSENSE_DATE, the day the policy with ads takes effect (YYYY-MM-DD); got "${dateSetting}".`);
  }
  return { client, publisherId: client.slice("ca-".length), ads, slots, stage, date: stage === "off" ? "" : dateSetting };
}

/** The one line of /ads.txt (Google's own: the publisher ID without `ca-`, DIRECT, Google's certification authority ID). */
export const adsTxt = (publisherId) => `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

/** The meta tag the AdSense review reads, before `</head>`. */
export const withVerificationMeta = (html, client) =>
  html.replace("</head>", `    <meta name="google-adsense-account" content="${client}" />
  </head>`);

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
 * What the Content-Security-Policy gains once ads are drawn (ADSENSE_ADS=on;
 * verification alone needs none), directive by directive. Google supports
 * only a strict, nonce-based policy for the AdSense code, because the hosts
 * it loads from change (https://support.google.com/adsense/answer/16283098);
 * a static host cannot give each response a nonce, so script, frame, connect
 * and img are widened to https: instead of naming hosts that may change under
 * it, and script-src takes 'unsafe-eval' as Google's own policy for the code
 * does. Every other directive, and every host the live policy names (the
 * backend, Google Analytics'), stays as it is.
 */
export const AD_CSP_WIDENING = {
  "img-src": ["https:"],
  "connect-src": ["https:"],
  "script-src": ["'unsafe-eval'", "https:"],
  "frame-src": ["https:"],
  "fenced-frame-src": ["https:"],
};

/**
 * `base` (render.yaml's CSP, the live one) as the site needs it with ads:
 * AD_CSP_WIDENING added, new directives right after script-src. The value for
 * the Render dashboard on the day ads go on (docs/web-ads.md), and the one
 * policy wider than render.yaml's that `check:deploy` accepts
 * (deploy-policy.mjs `isAdCsp`).
 */
export function adCsp(base) {
  const parts = String(base ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.split(/\s+/));
  const names = parts.map(([name]) => name.toLowerCase());
  for (const part of parts) {
    for (const source of AD_CSP_WIDENING[part[0].toLowerCase()] ?? []) if (!part.includes(source)) part.push(source);
  }
  const missing = Object.keys(AD_CSP_WIDENING)
    .filter((name) => !names.includes(name))
    .map((name) => [name, ...AD_CSP_WIDENING[name]]);
  const after = names.indexOf("script-src");
  parts.splice(after < 0 ? parts.length : after + 1, 0, ...missing);
  return parts.map((part) => part.join(" ")).join("; ");
}
