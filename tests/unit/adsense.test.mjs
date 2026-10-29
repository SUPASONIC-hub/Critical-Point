import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { adsTxt, readAdsenseEnv, WEB_AD_CODE_MARKERS, withVerificationMeta } from "../../scripts/adsense-config.mjs";

/**
 * AdSense site verification (scripts/adsense-config.mjs): off by default,
 * and the publisher ID writes only the meta tag and ads.txt.
 */
const CLIENT = "ca-pub-0000000000000001";

test("no variable is off, and a malformed ID fails the build", () => {
  assert.deepEqual(readAdsenseEnv({}), { client: "", publisherId: "" });
  assert.deepEqual(readAdsenseEnv({ ADSENSE_CLIENT: "  " }), { client: "", publisherId: "" });
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: "pub-0000000000000001" }), /ca-pub-/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: "ca-pub-123" }), /sixteen digits/);
});

test("the publisher ID gives ads.txt's line and the meta tag, and nothing that is ad code", () => {
  const verify = readAdsenseEnv({ ADSENSE_CLIENT: ` ${CLIENT} ` });
  assert.deepEqual(verify, { client: CLIENT, publisherId: "pub-0000000000000001" });
  assert.equal(adsTxt(verify.publisherId), "google.com, pub-0000000000000001, DIRECT, f08c47fec0942fa0\n");
  const html = withVerificationMeta("<html><head>\n  </head><body></body></html>", verify.client);
  assert.match(html, /<meta name="google-adsense-account" content="ca-pub-0000000000000001" \/>\s*<\/head>/);
  assert.doesNotMatch(html, /adsbygoogle|googlesyndication|<script/);
});

test("the variable has no VITE_ prefix, so the bundle never sees it", () => {
  const config = readFileSync("vite.config.js", "utf8");
  assert.match(config, /loadEnv\(mode, process\.cwd\(\), "ADSENSE_"\)/);
  assert.doesNotMatch(config, /VITE_ADSENSE/);
  assert.match("adsbygoogle.js", WEB_AD_CODE_MARKERS, "the bundle check knows the ad script's name");
  assert.doesNotMatch("google-adsense-account", WEB_AD_CODE_MARKERS, "verification is not ad code");
});
