/**
 * Google Search Console site verification, off unless the build is given the
 * token. docs/search-console.md is how it is set.
 *
 *   GOOGLE_SITE_VERIFICATION  the `content` of the meta tag Search Console
 *                             hands out under 「HTML 태그」 (the whole tag
 *                             pasted in is read too). It writes
 *                             `<meta name="google-site-verification">` into
 *                             index.html and nothing else. Set in the Render
 *                             dashboard only; like the AdSense ID it is public
 *                             by nature (every visitor's page carries it).
 *
 * No VITE_ prefix, on purpose, for the reason ADSENSE_CLIENT has none
 * (scripts/adsense-config.mjs): a VITE_ variable lands in import.meta.env,
 * and from there in the entry chunk.
 */

const TOKEN = /^[A-Za-z0-9_-]{20,100}$/;

/**
 * The variable read into what the build needs, or a thrown error when it is
 * malformed. `token: ""` means off.
 */
export function readSearchConsoleEnv(env = {}) {
  const raw = String(env.GOOGLE_SITE_VERIFICATION ?? "").trim();
  if (!raw) return { token: "" };
  const token = /content\s*=\s*["']([^"']*)["']/i.exec(raw)?.[1]?.trim() ?? raw;
  if (!TOKEN.test(token)) {
    throw new Error(`GOOGLE_SITE_VERIFICATION must be the content of Search Console's meta tag (letters, digits, - and _); got "${raw}".`);
  }
  return { token };
}

/** The meta tag Search Console reads, before `</head>`. */
export const withSiteVerificationMeta = (html, token) =>
  html.replace("</head>", `    <meta name="google-site-verification" content="${token}" />
  </head>`);
