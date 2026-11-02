import { createHash } from "node:crypto";

/**
 * Google Analytics 4 (방문 통계), off unless the build is given a measurement
 * ID. docs/analytics.md is how it is set.
 *
 *   GA_MEASUREMENT_ID  G- and 6 to 12 capitals or digits, as the GA4 property
 *                      gives it. It writes Google's tag (`gtag.js`) and a
 *                      small file that configures it into index.html and the
 *                      fifteen plain pages, and the Google Analytics section
 *                      into the privacy policy and the FAQ (scripts/legal-
 *                      pages.mjs, scripts/site-pages.mjs). Set in the Render
 *                      dashboard only; the ID is public by nature (every page
 *                      carries it), but the repository need not.
 *
 * No VITE_ prefix, for the reason ADSENSE_CLIENT has none
 * (scripts/adsense-config.mjs): a VITE_ variable lands in import.meta.env,
 * and from there in the entry chunk. The game's code never learns the ID:
 * the tag is in the page, not in the bundle.
 *
 * Never in the e2e build or a debug build, whatever the environment says:
 * those are played by the tests and by the developer, whose visits are not
 * the players' (`analyticsFor`).
 *
 * The configuration is a file of its own and not the inline <script> Google's
 * snippet is: the site's CSP is `script-src 'self'` with no 'unsafe-inline'
 * (render.yaml), and check:deploy fails a page with an inline script
 * (`inlineScriptProblems`, scripts/deploy-policy.mjs). Its name carries a hash
 * of its bytes, so it is served under the year-long /assets/* rule.
 */

const MEASUREMENT_ID = /^G-[A-Z0-9]{6,12}$/;

/** Where Google's tag is loaded from and where it sends: what the CSP has to name (render.yaml). */
export const ANALYTICS_ORIGINS = {
  script: ["https://www.googletagmanager.com"],
  connect: ["https://www.google-analytics.com", "https://region1.google-analytics.com", "https://analytics.google.com", "https://region1.analytics.google.com"],
  img: ["https://www.google-analytics.com", "https://www.googletagmanager.com"],
};

/**
 * The variable read into what the build needs, or a thrown error when it is
 * malformed. `id: ""` means off.
 */
export function readAnalyticsEnv(env = {}) {
  const id = String(env.GA_MEASUREMENT_ID ?? "").trim();
  if (!id) return { id: "" };
  if (!MEASUREMENT_ID.test(id)) {
    throw new Error(`GA_MEASUREMENT_ID must be G- and 6 to 12 capitals or digits, as the GA4 property's web stream gives it; got "${id}".`);
  }
  return { id };
}

/**
 * What a build writes: off (`null`) for the dev server, the e2e build and a
 * debug build, or with no ID; else the ID, the configuration file's source
 * and its path from the root.
 */
export function analyticsFor({ id, command, mode, debug }) {
  if (!id || command !== "build" || mode === "e2e" || debug) return null;
  const source = analyticsConfigSource(id);
  const hash = createHash("sha256").update(source).digest("hex").slice(0, 8);
  return { id, source, path: `/assets/analytics-${hash}.js` };
}

/**
 * Google's snippet, as a file. Google signals and ad personalisation are off:
 * the counts are for the developer, and nothing is shared for ads (the policy
 * says so).
 */
export const analyticsConfigSource = (id) =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}",{allow_google_signals:false,allow_ad_personalization_signals:false});\n`;

/** Google's tag and the file that configures it: the two lines a page puts at the end of its <head>. */
export const analyticsTagLines = (analytics) => [
  `<script async src="https://www.googletagmanager.com/gtag/js?id=${analytics.id}"></script>`,
  `<script src="${analytics.path}" defer></script>`,
];

/** index.html with the two tags before `</head>`; unchanged when `analytics` is null. */
export function withAnalyticsTags(html, analytics) {
  if (!analytics) return html;
  return String(html).replace("</head>", () => `${analyticsTagLines(analytics).map((line) => `    ${line}\n`).join("")}  </head>`);
}

/**
 * Each [off, on] pair once in `text`, the off words replaced by the on ones:
 * how the policy and the FAQ say Google Analytics when it is on, while the
 * build without it keeps every byte of theirs. A pair that is not there
 * exactly once throws, so an edit to the policy cannot leave a sentence
 * saying "no analytics" beside a build that has it.
 */
export function withSwaps(text, pairs) {
  let out = String(text);
  for (const [off, on] of pairs) {
    const at = out.indexOf(off);
    if (at < 0 || out.indexOf(off, at + 1) >= 0) throw new Error(`The Google Analytics wording expects "${off.slice(0, 60)}..." exactly once.`);
    out = out.slice(0, at) + on + out.slice(at + off.length);
  }
  return out;
}
