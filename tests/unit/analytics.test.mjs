import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { analyticsConfigSource, analyticsFor, readAnalyticsEnv, withAnalyticsTags, withSwaps } from "../../scripts/analytics-config.mjs";
import { analyticsCspProblems, backendOriginProblems, cspProblems, inlineScriptProblems, readRenderYamlCsp, wildcardHostProblems } from "../../scripts/deploy-policy.mjs";
import { renderStaticPages } from "../../scripts/site-pages.mjs";

/**
 * Google Analytics 4 (scripts/analytics-config.mjs): off by default and
 * byte for byte the build without it; on, Google's tag on every page and the
 * policy's section in three languages; never in the e2e or a debug build.
 */
const ID = "G-CN8M5TQ77N";
const on = analyticsFor({ id: ID, command: "build", mode: "production", debug: false });
const GOOGLE = /googletagmanager|google-analytics|gtag|애널리틱스|Analytics|アナリティクス/;

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
  assert.equal(on.id, ID);
  assert.match(on.path, /^\/assets\/analytics-[0-9a-f]{8}\.js$/);
  assert.equal(on.source, analyticsConfigSource(ID));
  assert.match(on.source, /gtag\("config","G-CN8M5TQ77N",\{allow_google_signals:false,allow_ad_personalization_signals:false\}\)/);
});

test("off, index.html and the fifteen pages are the ones without it", () => {
  const index = readFileSync("index.html", "utf8");
  assert.equal(withAnalyticsTags(index, null), index);
  assert.doesNotMatch(index, /googletagmanager|gtag/);
  for (const origin of ["", "https://critical-point-wn6p.onrender.com"]) {
    const off = renderStaticPages(origin, { analytics: null });
    assert.deepEqual(off, renderStaticPages(origin));
    assert.equal(Object.keys(off).length, 15);
    for (const [file, html] of Object.entries(off)) assert.doesNotMatch(html, GOOGLE, file);
  }
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
