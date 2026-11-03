import assert from "node:assert/strict";
import test from "node:test";

import { analyticsFor } from "../../scripts/analytics-config.mjs";
import { AD_EDITS, ANALYTICS_AD_EDITS, ANALYTICS_NOTICE } from "../../scripts/legal-pages.mjs";
import { ANALYTICS_SITE_AD_EDITS, renderStaticPages, SITE_AD_EDITS } from "../../scripts/site-pages.mjs";

/**
 * The build's two switches on the fifteen plain pages: Google Analytics
 * (GA_MEASUREMENT_ID, on from 11-12) and web ads (ADSENSE_ADS=on, draft
 * #350). Both rewrite the policy's summary, its cookies and section 6, and
 * the FAQ's cookie sentence; the ads go on top of Google Analytics' words
 * (ANALYTICS_AD_EDITS, ANALYTICS_SITE_AD_EDITS). Every combination has to
 * build, the two without ads have to be the pages main writes, and none with
 * ads may still say there are no ads or no analytics.
 */
const ga = analyticsFor({ id: "G-ABC1234XYZ", command: "build", mode: "production", debug: false });
const COMBOS = [
  ["GA off, ads off", null, false],
  ["GA on, ads off", ga, false],
  ["GA off, ads on", null, true],
  ["GA on, ads on", ga, true],
];
const pages = Object.fromEntries(COMBOS.map(([name, analytics, ads]) => [name, renderStaticPages("", { analytics, ads })]));
const POLICIES = ["privacy.html", "en/privacy.html", "ja/privacy.html"];
const FAQS = ["faq.html", "en/faq.html", "ja/faq.html"];

// What a page with ads, or with Google Analytics, must no longer say.
const NO_ADS = /광고가 없|광고를 싣지 않|광고와 유료 결제가 없|광고용 쿠키를 쓰지 않|no ads|uses no advertising cookies|広告はなく|広告や有料の決済はありません|広告用のCookieも使用していません/;
const NO_TRACKERS = /(?<!그 밖의 )광고·분석용|(?<!no other )advertising or analytics|(?<!それ以外の)広告・分析用|<p>게임은 쿠키를|<p>The game uses no cookies|<p>本ゲームはCookieを/;
const ONLY_GA_COOKIES = /애널리틱스 쿠키만|its only cookies are|Cookieだけを使用します/;

test("all four combinations of Google Analytics and web ads write the fifteen pages", () => {
  for (const [name] of COMBOS) assert.equal(Object.keys(pages[name]).length, 15, name);
  // Without ads the pages are the ones the build without the ad switch writes, byte for byte (main's).
  assert.deepEqual(pages["GA off, ads off"], renderStaticPages(""));
  assert.deepEqual(pages["GA on, ads off"], renderStaticPages("", { analytics: ga }));
  for (const origin of ["", "https://example.org"]) {
    assert.deepEqual(renderStaticPages(origin, { ads: false }), renderStaticPages(origin));
    assert.deepEqual(renderStaticPages(origin, { analytics: ga, ads: false }), renderStaticPages(origin, { analytics: ga }));
  }
});

test("with ads, no page still says there are no ads, and with both no page says there is no analytics", () => {
  for (const name of ["GA off, ads on", "GA on, ads on"]) {
    for (const [file, html] of Object.entries(pages[name])) assert.doesNotMatch(html, NO_ADS, `${name}: ${file}`);
  }
  for (const [file, html] of Object.entries(pages["GA on, ads on"])) {
    assert.doesNotMatch(html, NO_TRACKERS, file);
    assert.doesNotMatch(html, ONLY_GA_COOKIES, file);
    assert.doesNotMatch(html, /변경 예고|Upcoming change|変更の予告/, file);
  }
});

test("with both on, the policy names Google's two services once each where they meet, and section 6 has one Google paragraph", () => {
  const both = pages["GA on, ads on"];
  for (const file of POLICIES) {
    const html = both[file];
    assert.equal(html.match(/<p>Google LLC/g)?.length, 1, `${file}: one Google LLC paragraph in section 6`);
    assert.match(html, /AdSense/, file);
    assert.match(html, /\(5\)|\(e\)/, file);
    // Section 2 (5) is Google Analytics' and section 10 the ads'.
    assert.match(html, /(<h3>\(5\)|<h3>\(e\))[^]*<h2>3\./, file);
    assert.match(html, /policies\.google\.com\/technologies\/ads/, file);
  }
  assert.match(both["privacy.html"], /<li>웹판에는 Google AdSense 광고가 나오고, 방문 통계에는 Google 애널리틱스를 씁니다\./);
  assert.match(both["privacy.html"], /방문 통계용 Google 애널리틱스 쿠키는 2번 \(5\)에, 광고를 보여 주는 Google이 쓸 수 있는 쿠키와 그와 비슷한 식별자는 10번에/);
  assert.match(both["en/privacy.html"], /<li>The web version shows Google AdSense ads and uses Google Analytics for visit statistics;/);
  assert.match(both["ja/privacy.html"], /<li>ウェブ版にはGoogle AdSenseの広告が表示され、訪問統計にはGoogleアナリティクスを使用します。/);
  // The terms take the same ad line whichever way Google Analytics is.
  for (const file of ["terms.html", "en/terms.html", "ja/terms.html"]) assert.equal(both[file].replace(/<script[^>]*><\/script>\n/g, ""), pages["GA off, ads on"][file], file);
  for (const file of FAQS) {
    assert.match(both[file], /Google/, file);
    assert.match(both[file], /2번 \(5\)|section 2 \(e\)|2の\(5\)/, file);
    assert.match(both[file], /10번|section 10|同10/, file);
  }
});

test("with ads and Google Analytics still off, the notice of 11-12 stays and reads with the ad wording", () => {
  const adsOnly = pages["GA off, ads on"];
  for (const [file, language] of [["privacy.html", "ko"], ["en/privacy.html", "en"], ["ja/privacy.html", "ja"]]) {
    assert.ok(adsOnly[file].includes(ANALYTICS_NOTICE[language]), file);
    // The summary then says "no other analytics" today, which the notice says changes on 11-12.
    assert.match(adsOnly[file], /그 밖의 광고·분석용|no other advertising or analytics|それ以外の広告・分析用/, file);
  }
});

test("the two ad tables cover the same pages in the same languages", () => {
  assert.deepEqual(Object.keys(ANALYTICS_AD_EDITS), Object.keys(AD_EDITS));
  assert.deepEqual(Object.keys(ANALYTICS_SITE_AD_EDITS.faq), Object.keys(SITE_AD_EDITS.faq));
  for (const name of ["termsKo", "termsEn", "termsJa"]) assert.equal(ANALYTICS_AD_EDITS[name], AD_EDITS[name]);
  const lengths = ["privacyKo", "privacyEn", "privacyJa"].map((name) => ANALYTICS_AD_EDITS[name].length);
  assert.ok(lengths.every((length) => length === lengths[0]), "the three languages take as many edits");
});
