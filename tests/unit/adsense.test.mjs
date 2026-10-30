import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { AD_CSP, AD_PLACEMENTS, adsTxt, insertAdSlots, readAdsenseEnv, WEB_AD_CODE_MARKERS } from "../../scripts/adsense-config.mjs";

/**
 * Web ads (출시 로드맵 2단계, scripts/adsense-config.mjs): off by default,
 * the publisher ID alone is site verification with no code, and only
 * ADSENSE_ADS=on turns the screens' markers into slots.
 */
const CLIENT = "ca-pub-0000000000000001";

test("no variable is off, and a malformed one fails the build by name", () => {
  assert.deepEqual(readAdsenseEnv({}), { client: "", publisherId: "", ads: false, slots: {} });
  assert.deepEqual(readAdsenseEnv({ ADSENSE_SLOTS: "report:1234567890" }).client, "", "slots alone are off");
  assert.throws(() => readAdsenseEnv({ ADSENSE_ADS: "on" }), /ADSENSE_CLIENT/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: "pub-0000000000000001" }), /ca-pub-/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "true" }), /"on" or unset/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on" }), /at least one ad unit/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on", ADSENSE_SLOTS: "table:1234567890" }), /no screen marks/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on", ADSENSE_SLOTS: "report:abc" }), /placement:digits/);
});

test("the publisher ID alone is verification: ads.txt's line and no slot", () => {
  const verify = readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_SLOTS: "report:1234567890" });
  assert.deepEqual(verify, { client: CLIENT, publisherId: "pub-0000000000000001", ads: false, slots: {} });
  assert.equal(adsTxt(verify.publisherId), "google.com, pub-0000000000000001, DIRECT, f08c47fec0942fa0\n");
  const screen = readFileSync("src/screens/ResultScreen.jsx", "utf8");
  assert.equal(insertAdSlots(screen, verify), null, "no slot without ADSENSE_ADS=on");
});

test("with ads on, a placement with a unit becomes a slot and one without stays a comment", () => {
  const on = readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on", ADSENSE_SLOTS: "report:1234567890" });
  const result = insertAdSlots(readFileSync("src/screens/ResultScreen.jsx", "utf8"), on);
  assert.match(result, /^import \{ AdSlot as __CpAdSlot \} from "\/src\/ads\/AdSlot\.jsx";/);
  assert.match(result, /<__CpAdSlot placement="report" hidden=\{currentCase\.startsWith\("prologue"\) \|\| \(currentCase === "final" && endingStep < 3\)\} client="ca-pub-0000000000000001" slot="1234567890" \/>/);
  assert.equal(insertAdSlots(readFileSync("src/screens/RankingScreen.jsx", "utf8"), on), null, "the ranking has no unit here");
});

test("every placement is marked once, and never on the table, a decision or a briefing", () => {
  const marked = { report: "src/screens/ResultScreen.jsx", ranking: "src/screens/RankingScreen.jsx" };
  assert.deepEqual(Object.keys(marked).sort(), [...AD_PLACEMENTS].sort());
  for (const [placement, file] of Object.entries(marked)) {
    assert.equal(readFileSync(file, "utf8").split(`ad-slot: placement="${placement}"`).length, 2, file);
  }
  for (const file of ["src/screens/PlayScreen.jsx", "src/screens/IntroScreen.jsx", "src/screens/BoardScreen.jsx"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /ad-slot:/, `${file} has no ad`);
  }
});

test("the ad code's names are what the bundle check looks for, and the CSP keeps the rest of the live one", () => {
  assert.match(readFileSync("src/ads/AdSlot.jsx", "utf8"), WEB_AD_CODE_MARKERS);
  const live = /name: Content-Security-Policy\s+value: "([^"]+)"/.exec(readFileSync("render.yaml", "utf8"))[1];
  const directives = (policy) => Object.fromEntries(policy.split(";").map((part) => part.trim().split(/\s+/)).map(([name, ...values]) => [name, values.join(" ")]));
  const [before, after] = [directives(live), directives(AD_CSP)];
  for (const name of ["default-src", "base-uri", "object-src", "frame-ancestors", "form-action", "style-src", "font-src", "manifest-src", "worker-src", "media-src"]) {
    assert.equal(after[name], before[name], name);
  }
  assert.match(after["script-src"], /https:/);
  assert.match(after["frame-src"], /https:/);
});

test("the variables have no VITE_ prefix, so the bundle never sees them", () => {
  const config = readFileSync("vite.config.js", "utf8");
  assert.match(config, /loadEnv\(mode, process\.cwd\(\), "ADSENSE_"\)/);
  assert.doesNotMatch(config, /VITE_ADSENSE/);
  assert.doesNotMatch("google-adsense-account", WEB_AD_CODE_MARKERS, "verification is not ad code");
});
