import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { analyticsConfigSource, analyticsFor, readAnalyticsEnv, withAnalyticsTags, withSwaps } from "../../scripts/analytics-config.mjs";
import { analyticsCspProblems, backendOriginProblems, cspProblems, inlineScriptProblems, readRenderYamlCsp, wildcardHostProblems } from "../../scripts/deploy-policy.mjs";
import { ANALYTICS_NOTICE } from "../../scripts/legal-pages.mjs";
import { renderStaticPages } from "../../scripts/site-pages.mjs";

/**
 * Google Analytics 4 (scripts/analytics-config.mjs): off by default, and the
 * build without it but for the policy's notice of the change; on, Google's tag on every page and the
 * policy's section in three languages; never in the e2e or a debug build.
 */
const ID = "G-CN8M5TQ77N";
const on = analyticsFor({ id: ID, command: "build", mode: "production", debug: false });
const GOOGLE = /googletagmanager|google-analytics|gtag|애널리틱스|Analytics|アナリティクス/;
const POLICIES = { "privacy.html": "ko", "en/privacy.html": "en", "ja/privacy.html": "ja" };

test("no variable is off, and a malformed ID fails the build", () => {
  assert.deepEqual(readAnalyticsEnv({}), { id: "" });
  assert.deepEqual(readAnalyticsEnv({ GA_MEASUREMENT_ID: "  " }), { id: "" });
  assert.deepEqual(readAnalyticsEnv({ GA_MEASUREMENT_ID: ` ${ID} ` }), { id: ID });
  for (const bad of ["UA-12345678-1", "G-abcdefgh", "G-12345", "G-1234567890123", `${ID}" onload="x`, "GTM-ABC1234"]) {
    assert.throws(() => readAnalyticsEnv({ GA_MEASUREMENT_ID: bad }), /GA_MEASUREMENT_ID must be G-/, bad);
  }
});

test("only a release build has it: not the dev server, the e2e build or a debug build", () => {
  assert.equal(analyticsFor({ id: "", command: "build", mode: "production", debug: false }), null);
  assert.equal(analyticsFor({ id: ID, command: "serve", mode: "development", debug: true }), null);
  assert.equal(analyticsFor({ id: ID, command: "build", mode: "e2e", debug: false }), null);
  assert.equal(analyticsFor({ id: ID, command: "build", mode: "production", debug: true }), null);
  assert.equal(analyticsFor({ id: ID, command: "build", mode: "app", debug: false }), null);
  assert.equal(on.id, ID);
  assert.match(on.path, /^\/assets\/analytics-[0-9a-f]{8}\.js$/);
  assert.equal(on.source, analyticsConfigSource(ID));
  assert.match(on.source, /gtag\("config","G-CN8M5TQ77N",\{allow_google_signals:false,allow_ad_personalization_signals:false\}\)/);
});

test("off, index.html and the pages are the ones without it, but for the policy's one notice of the change", () => {
  const index = readFileSync("index.html", "utf8");
  assert.equal(withAnalyticsTags(index, null), index);
  assert.doesNotMatch(index, /googletagmanager|gtag/);
  for (const origin of ["", "https://critical-point-wn6p.onrender.com"]) {
    const off = renderStaticPages(origin, { analytics: null });
    assert.deepEqual(off, renderStaticPages(origin));
    assert.equal(Object.keys(off).length, 15);
    for (const [file, html] of Object.entries(off)) {
      const language = POLICIES[file];
      if (!language) {
        assert.doesNotMatch(html, GOOGLE, file);
        continue;
      }
      // The policy says, seven days ahead (its section 12), that Google Analytics comes on 11-12, and nothing more.
      assert.equal(html.split(ANALYTICS_NOTICE[language]).length, 2, file);
      assert.doesNotMatch(html.replace(ANALYTICS_NOTICE[language], ""), GOOGLE, file);
      assert.match(html, /<p class="effective">[^<]*(2026년 10월 25일|October 25, 2026|2026年10月25日)<\/p>\n<p><strong>/, file);
    }
  }
  assert.match(ANALYTICS_NOTICE.ko, /2026년 11월 12일부터 방문 통계를 위해 Google 애널리틱스\(Google LLC, 미국\)를 사용합니다/);
  assert.match(ANALYTICS_NOTICE.en, /From November 12, 2026, we will use Google Analytics \(Google LLC, USA\)/);
  assert.match(ANALYTICS_NOTICE.ja, /2026年11月12日から、訪問統計のためにGoogleアナリティクス\(Google LLC、米国\)を使用します/);
  // The FAQ has no notice.
  for (const file of ["faq.html", "en/faq.html", "ja/faq.html"]) assert.doesNotMatch(renderStaticPages("")[file], GOOGLE, file);
});

test("the app build (`--mode app`) has no tag, no Google origin and no Google Analytics sentence, even given an ID", () => {
  // What vite.config.js does with GA_MEASUREMENT_ID set in an app build.
  const app = analyticsFor({ ...readAnalyticsEnv({ GA_MEASUREMENT_ID: ID }), command: "build", mode: "app", debug: false });
  assert.equal(app, null);
  const index = readFileSync("index.html", "utf8");
  assert.equal(withAnalyticsTags(index, app), index);
  for (const origin of ["", "https://critical-point-wn6p.onrender.com"]) {
    const pages = renderStaticPages(origin, { analytics: app, app: true });
    assert.equal(Object.keys(pages).length, 15);
    for (const [file, html] of Object.entries(pages)) {
      // The policy's notice that the web turns it on 11-12 is not the app's to make: the app never does.
      assert.doesNotMatch(html, GOOGLE, file);
      assert.doesNotMatch(html, /변경 예고|Upcoming change|変更の予告/, file);
    }
    // Everything else is the web's page without it.
    const web = renderStaticPages(origin);
    for (const [file, language] of Object.entries(POLICIES)) assert.equal(pages[file], web[file].replace(`${ANALYTICS_NOTICE[language]}\n`, ""), file);
  }
  const config = readFileSync("vite.config.js", "utf8");
  assert.match(config, /staticPages\(analytics, \{ app: mode === "app" \}\)/);
  assert.match(config, /analyticsFor\(\{ \.\.\.readAnalyticsEnv\(loadEnv\(mode, process\.cwd\(\), "GA_"\)\), command, mode, debug: debugBuild \}\)/);
});

test("on, every page loads Google's tag and the file that configures it, with no inline script", () => {
  const index = withAnalyticsTags(readFileSync("index.html", "utf8"), on);
  const tags = `<script async src="https://www.googletagmanager.com/gtag/js?id=${ID}"></script>`;
  assert.match(index, new RegExp(`${tags.replace(/[.?/]/g, "\\$&")}\\n\\s*<script src="${on.path}" defer></script>\\n\\s*</head>`));
  assert.deepEqual(inlineScriptProblems(index), []);
  const pages = renderStaticPages("", { analytics: on });
  assert.equal(Object.keys(pages).length, 15);
  for (const [file, html] of Object.entries(pages)) {
    const head = html.slice(0, html.indexOf("</head>"));
    assert.ok(head.includes(tags) && head.includes(`<script src="${on.path}" defer></script>`), file);
    assert.deepEqual(inlineScriptProblems(html), [], file);
  }
  // The terms say nothing of it; their text is the same with and without.
  const off = renderStaticPages("");
  for (const file of ["terms.html", "en/terms.html", "ja/terms.html", "about.html", "contact.html"]) {
    assert.equal(pages[file].replace(/<script[^>]*><\/script>\n/g, ""), off[file], file);
  }
});

test("on, the policy names what Google Analytics collects, who gets it, for how long and how to refuse, in three languages", () => {
  const pages = renderStaticPages("", { analytics: on });
  const expect = {
    "privacy.html": ["(5) 방문 통계 — Google 애널리틱스", "Google LLC(미국)", "_ga", "2개월", "유입 경로", "대략적 위치", "시행일: 2026년 11월 12일"],
    "en/privacy.html": ["(e) Visit statistics — Google Analytics", "Google LLC (USA)", "_ga", "2 months", "how you arrived", "approximate location", "Effective: November 12, 2026"],
    "ja/privacy.html": ["(5) 訪問統計 — Googleアナリティクス", "Google LLC(米国)", "_ga", "2か月", "訪問経路", "おおよその位置", "施行日: 2026年11月12日"],
  };
  for (const [file, words] of Object.entries(expect)) {
    for (const word of words) assert.ok(pages[file].includes(word), `${file}: ${word}`);
    assert.ok(pages[file].includes('<a href="https://tools.google.com/dlpage/gaoptout">'), file);
  }
  // The notice of the change is gone once the change is in effect.
  for (const [file, language] of Object.entries(POLICIES)) assert.ok(!pages[file].includes(ANALYTICS_NOTICE[language]), file);
  assert.doesNotMatch(pages["privacy.html"], /변경 예고/);
  assert.doesNotMatch(pages["en/privacy.html"], /Upcoming change/);
  assert.doesNotMatch(pages["ja/privacy.html"], /変更の予告/);
  // The sentences that say there is no analytics are gone.
  assert.doesNotMatch(pages["privacy.html"], /분석용 쿠키나 외부 추적 도구를 쓰지 않습니다|<p>게임은 쿠키를 쓰지 않습니다/);
  assert.doesNotMatch(pages["en/privacy.html"], /no advertising or analytics cookies|<p>The game uses no cookies/);
  assert.doesNotMatch(pages["ja/privacy.html"], /分析用のCookie|<p>本ゲームはCookieを使用しません/);
  assert.match(pages["faq.html"], /방문 통계용 Google 애널리틱스 쿠키만/);
  assert.match(pages["en/faq.html"], /its only cookies are the Google Analytics ones/);
  assert.match(pages["ja/faq.html"], /訪問統計用のGoogleアナリティクスのCookieだけ/);
  for (const file of ["faq.html", "en/faq.html", "ja/faq.html"]) assert.doesNotMatch(pages[file], /analytics trackers|분석용 추적 도구|分析用のトラッキング/, file);
});

test("a wording the policy no longer has, or has twice, fails rather than leaving a stale sentence", () => {
  assert.equal(withSwaps("a b c", [["b", "x"]]), "a x c");
  assert.throws(() => withSwaps("a c", [["b", "x"]]), /exactly once/);
  assert.throws(() => withSwaps("b b", [["b", "x"]]), /exactly once/);
});

test("render.yaml's CSP lets the tag load and send, by host and with no wildcard, and keeps the backend check to Supabase", () => {
  const yaml = readFileSync("render.yaml", "utf8");
  const csp = readRenderYamlCsp(yaml);
  const page = withAnalyticsTags(readFileSync("index.html", "utf8"), on);
  assert.deepEqual(cspProblems(csp), []);
  assert.deepEqual(analyticsCspProblems(page, csp), []);
  assert.deepEqual(wildcardHostProblems(csp).filter((problem) => /google/.test(problem)), []);
  const before = "default-src 'self'; script-src 'self'; connect-src 'self' https://x.supabase.co; img-src 'self'";
  assert.equal(analyticsCspProblems(page, before).length, 3);
  assert.deepEqual(analyticsCspProblems(readFileSync("index.html", "utf8"), before), []);
  assert.match(backendOriginProblems("google-analytics.com", "connect-src 'self' https://www.google-analytics.com")[0], /names no backend origin/);
  // The variable is the dashboard's: render.yaml has the key and no value, and the build reads it without VITE_.
  assert.match(yaml, /- key: GA_MEASUREMENT_ID\n\s+sync: false/);
  assert.doesNotMatch(yaml, /G-CN8M5TQ77N/);
  const config = readFileSync("vite.config.js", "utf8");
  assert.match(config, /readAnalyticsEnv\(loadEnv\(mode, process\.cwd\(\), "GA_"\)\)/);
  assert.doesNotMatch(config, /VITE_GA/);
});
