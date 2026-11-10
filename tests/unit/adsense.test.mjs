import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { AD_CSP_WIDENING, AD_PLACEMENTS, adCsp, adsTxt, insertAdSlots, readAdsenseEnv, WEB_AD_CODE_MARKERS } from "../../scripts/adsense-config.mjs";
import { analyticsCspProblems, backendOriginProblems, cspProblems, isAdCsp, readRenderYamlCsp } from "../../scripts/deploy-policy.mjs";

/**
 * Web ads (출시 로드맵 2단계, scripts/adsense-config.mjs): off by default,
 * the publisher ID alone is site verification with no code, and only
 * ADSENSE_ADS=on turns the screens' markers into slots.
 */
const CLIENT = "ca-pub-0000000000000001";
const DATE = "2026-12-01";

test("no variable is off, and a malformed one fails the build by name", () => {
  assert.deepEqual(readAdsenseEnv({}), { client: "", publisherId: "", ads: false, slots: {}, stage: "off", date: "" });
  assert.deepEqual(readAdsenseEnv({ ADSENSE_SLOTS: "report:1234567890" }).client, "", "slots alone are off");
  assert.throws(() => readAdsenseEnv({ ADSENSE_ADS: "on" }), /ADSENSE_CLIENT/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: "pub-0000000000000001" }), /ca-pub-/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "true" }), /"notice", "on" or unset/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on" }), /at least one ad unit/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on", ADSENSE_SLOTS: "table:1234567890" }), /no screen marks/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on", ADSENSE_SLOTS: "report:abc" }), /placement:digits/);
  assert.throws(() => readAdsenseEnv({ ADSENSE_ADS: "notice", ADSENSE_DATE: DATE }), /ADSENSE_CLIENT/);
  for (const date of ["", "2026-13-01", "2026-02-30", "12/01/2026"]) {
    assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "notice", ADSENSE_DATE: date }), /ADSENSE_DATE/, date);
    assert.throws(() => readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on", ADSENSE_SLOTS: "report:1234567890", ADSENSE_DATE: date }), /ADSENSE_DATE/, date);
  }
});

test("the notice is the policy's words only: no slot, no ad script, and the day it names", () => {
  const notice = readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "notice", ADSENSE_SLOTS: "report:1234567890", ADSENSE_DATE: DATE });
  assert.deepEqual(notice, { client: CLIENT, publisherId: "pub-0000000000000001", ads: false, slots: {}, stage: "notice", date: DATE });
  assert.equal(insertAdSlots(readFileSync("src/screens/ResultScreen.jsx", "utf8"), notice), null, "no slot during the notice");
  assert.equal(readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_DATE: DATE }).date, "", "a day with the ads off is not read");
});

test("the publisher ID alone is verification: ads.txt's line and no slot", () => {
  const verify = readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_SLOTS: "report:1234567890" });
  assert.deepEqual(verify, { client: CLIENT, publisherId: "pub-0000000000000001", ads: false, slots: {}, stage: "off", date: "" });
  assert.equal(adsTxt(verify.publisherId), "google.com, pub-0000000000000001, DIRECT, f08c47fec0942fa0\n");
  const screen = readFileSync("src/screens/ResultScreen.jsx", "utf8");
  assert.equal(insertAdSlots(screen, verify), null, "no slot without ADSENSE_ADS=on");
});

test("with ads on, a placement with a unit becomes a slot and one without stays a comment", () => {
  const on = readAdsenseEnv({ ADSENSE_CLIENT: CLIENT, ADSENSE_ADS: "on", ADSENSE_SLOTS: "report:1234567890", ADSENSE_DATE: DATE });
  assert.equal(on.stage, "on");
  assert.equal(on.date, DATE);
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
  const live = readRenderYamlCsp(readFileSync("render.yaml", "utf8"));
  const directives = (policy) => Object.fromEntries(policy.split(";").map((part) => part.trim().split(/\s+/)).map(([name, ...values]) => [name, values.join(" ")]));
  const ads = adCsp(live);
  const [before, after] = [directives(live), directives(ads)];
  for (const name of ["default-src", "base-uri", "object-src", "frame-ancestors", "form-action", "style-src", "font-src", "manifest-src", "worker-src", "media-src"]) {
    assert.equal(after[name], before[name], name);
  }
  // Every host the live policy names stays (the backend, Google Analytics'), and only https: and 'unsafe-eval' are added.
  for (const [name, sources] of Object.entries(before)) {
    for (const source of sources.split(" ")) assert.ok(after[name].split(" ").includes(source), `${name} keeps ${source}`);
  }
  for (const [name, added] of Object.entries(AD_CSP_WIDENING)) {
    const extra = after[name].split(" ").filter((source) => !(before[name] ?? "").split(" ").includes(source));
    assert.deepEqual(extra.sort(), [...added].sort(), name);
  }
  assert.equal(adCsp(ads), ads, "widening twice changes nothing");
  // check:deploy accepts that policy and no other wider one; render.yaml's own still passes as it is.
  assert.ok(isAdCsp(ads, live));
  assert.ok(isAdCsp(ads.split("; ").reverse().join(";  "), live), "in any order and spacing");
  assert.ok(!isAdCsp(live, live));
  assert.ok(!isAdCsp(ads.replace("object-src 'none'", "object-src *"), live));
  assert.ok(!isAdCsp(`${ads}; script-src-elem *`, live));
  assert.ok(!isAdCsp(ads.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'"), live));
  assert.ok(cspProblems(ads).length > 0, "the ad policy is wider than cspProblems allows, so the exception is what lets it pass");
  assert.deepEqual(cspProblems(live), []);
  assert.deepEqual(analyticsCspProblems('<script async src="https://www.googletagmanager.com/gtag/js?id=G-X"></script>', ads), [], "Google Analytics still runs under it");
  assert.deepEqual(backendOriginProblems("https://kiazzdbpkazwqhhimdib.supabase.co", ads), [], "the backend is still named");
});

test("the variables have no VITE_ prefix, so the bundle never sees them", () => {
  const config = readFileSync("vite.config.js", "utf8");
  assert.match(config, /loadEnv\(mode, process\.cwd\(\), "ADSENSE_"\)/);
  assert.doesNotMatch(config, /VITE_ADSENSE/);
  assert.doesNotMatch("google-adsense-account", WEB_AD_CODE_MARKERS, "verification is not ad code");
});
