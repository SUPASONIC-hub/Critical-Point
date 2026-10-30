import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { readSearchConsoleEnv, withSiteVerificationMeta } from "../../scripts/search-console.mjs";

/**
 * Search Console site verification (scripts/search-console.mjs): off by
 * default, and the token writes only the meta tag.
 */
const TOKEN = "AbCdEfGhIjKlMnOpQrStUvWxYz0123456789_-abcde";

test("no variable is off, and a malformed token fails the build", () => {
  assert.deepEqual(readSearchConsoleEnv({}), { token: "" });
  assert.deepEqual(readSearchConsoleEnv({ GOOGLE_SITE_VERIFICATION: "  " }), { token: "" });
  assert.throws(() => readSearchConsoleEnv({ GOOGLE_SITE_VERIFICATION: "short" }), /content of Search Console's meta tag/);
  assert.throws(() => readSearchConsoleEnv({ GOOGLE_SITE_VERIFICATION: `${TOKEN}" onload="x` }), /content of Search Console's meta tag/);
});

test("the token, or the whole tag pasted in, gives the meta tag and nothing else", () => {
  assert.deepEqual(readSearchConsoleEnv({ GOOGLE_SITE_VERIFICATION: ` ${TOKEN} ` }), { token: TOKEN });
  assert.deepEqual(readSearchConsoleEnv({ GOOGLE_SITE_VERIFICATION: `<meta name="google-site-verification" content="${TOKEN}" />` }), { token: TOKEN });
  const html = withSiteVerificationMeta("<html><head>\n  </head><body></body></html>", TOKEN);
  assert.match(html, new RegExp(`<meta name="google-site-verification" content="${TOKEN}" />\\s*</head>`));
  assert.doesNotMatch(html, /<script/);
});

test("the build reads it without a VITE_ prefix, and render.yaml keeps the key without a value", () => {
  const config = readFileSync("vite.config.js", "utf8");
  assert.match(config, /searchConsoleVerification\(readSearchConsoleEnv\(loadEnv\(mode, process\.cwd\(\), "GOOGLE_"\)\)\)/);
  assert.doesNotMatch(config, /VITE_GOOGLE/);
  assert.match(readFileSync("render.yaml", "utf8"), /- key: GOOGLE_SITE_VERIFICATION\n\s+sync: false/);
  // Off, the page is the one without it.
  assert.doesNotMatch(readFileSync("index.html", "utf8"), /google-site-verification/);
});
