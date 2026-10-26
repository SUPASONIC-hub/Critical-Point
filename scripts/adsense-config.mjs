/**
 * Google AdSense site verification (출시 로드맵 2단계의 첫걸음), off unless
 * the build is given a publisher ID. docs/web-ads.md is how it is set.
 *
 *   ADSENSE_CLIENT  ca-pub- and sixteen digits. It writes /ads.txt and the
 *                   `google-adsense-account` meta tag -- what AdSense reads
 *                   to approve the site -- and nothing else: no ad script, no
 *                   ad slot, no line in the policy, since no ad is shown and
 *                   nothing reaches Google from a player. Set in the Render
 *                   dashboard only, never in the repository (the ID is public
 *                   by nature -- ads.txt and every page with ads print it --
 *                   but the repository need not carry it).
 *
 * No VITE_ prefix, on purpose: Vite puts every VITE_ variable into
 * import.meta.env, and the code that reads that object whole would carry the
 * ID into the entry and runtime chunks (measured on 2026-10-26).
 */

const CLIENT = /^ca-pub-\d{16}$/;

/**
 * The variable read into what the build needs, or a thrown error when it is
 * malformed. `client: ""` means off.
 */
export function readAdsenseEnv(env = {}) {
  const client = String(env.ADSENSE_CLIENT ?? "").trim();
  if (!client) return { client: "", publisherId: "" };
  if (!CLIENT.test(client)) throw new Error(`ADSENSE_CLIENT must be ca-pub- and sixteen digits, as the AdSense console gives it; got "${client}".`);
  return { client, publisherId: client.slice("ca-".length) };
}

/** The one line of /ads.txt (Google's own: the publisher ID without `ca-`, DIRECT, Google's certification authority ID). */
export const adsTxt = (publisherId) => `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

/** The meta tag the AdSense review reads, before `</head>`. */
export const withVerificationMeta = (html, client) =>
  html.replace("</head>", `    <meta name="google-adsense-account" content="${client}" />
  </head>`);

/**
 * Names only ad code has. check-bundle-size.mjs fails a build whose
 * JavaScript carries one unless it was built with ADSENSE_ADS=on (the ads
 * themselves, not in this build yet): off and verification-only builds have
 * no ad code.
 */
export const WEB_AD_CODE_MARKERS = /adsbygoogle|googlesyndication|data-ad-slot|ca-pub-\d/;
