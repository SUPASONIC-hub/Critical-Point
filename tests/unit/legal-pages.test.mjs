import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

import { DATA_ITEMS, REMOTE_FIELDS, renderLegalPages, SUMMARY_FIELDS } from "../../scripts/legal-pages.mjs";
import { SUPPORT_CONTACT } from "../../src/appConfig.js";
import { PLAYTEST_DATA_NOTICE, PRIVACY_PAGE_PATH, TERMS_PAGE_PATH } from "../../src/privacyText.js";
import { toRowSummary } from "../../src/state/useChoiceCommit.js";
import { createSeasonTelemetryPayload } from "../../src/viewModels/seasonViewModels.js";

/**
 * The privacy policy says what the code sends, and nothing the code sends is
 * missing from it (scripts/legal-pages.mjs).
 *
 * What the page may write is read from where it is decided: the column grants
 * anon holds (the last `grant insert (...) on public.<table> to anon` for each
 * table in supabase/migrations -- `check:grants` runs the client's own payloads
 * through them, so a column the client sends is a column granted), and the
 * arguments of the online save's `put_cloud_save` call in src/cloudSave.js.
 * Every one of them has to be named in `REMOTE_FIELDS`, and the item it maps to
 * has to be printed on both policy pages.
 */
const pages = renderLegalPages();
const decode = (html) => html.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const ko = decode(pages["privacy.html"]);
const en = decode(pages["en/privacy.html"]);

function anonInsertGrants() {
  const grants = {};
  const files = readdirSync("supabase/migrations").filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = readFileSync(`supabase/migrations/${file}`, "utf8");
    for (const match of sql.matchAll(/grant\s+insert\s*\(([^)]*)\)\s*on\s+(?:table\s+)?public\.(\w+)\s+to\s+anon\b/gi)) {
      grants[match[2]] = match[1].split(",").map((column) => column.trim()).filter(Boolean);
    }
  }
  return grants;
}

function cloudSaveArguments() {
  const source = readFileSync("src/cloudSave.js", "utf8");
  const call = /callSupabaseRpc\("put_cloud_save",\s*\{([\s\S]*?)\n\s*\}\)/.exec(source);
  assert.ok(call, "src/cloudSave.js no longer calls put_cloud_save the way this test reads it");
  return [...call[1].matchAll(/^\s*(p_\w+)\s*:/gm)].map((match) => match[1]);
}

test("the pages are written at their four addresses, each naming the other language", () => {
  assert.deepEqual(Object.keys(pages).sort(), ["en/privacy.html", "en/terms.html", "privacy.html", "terms.html"]);
  assert.equal(PRIVACY_PAGE_PATH, "/privacy.html");
  assert.equal(TERMS_PAGE_PATH, "/terms.html");
  for (const [file, html] of Object.entries(pages)) {
    assert.match(html, /^<!doctype html>/, file);
    assert.match(html, new RegExp(`<html lang="${file.startsWith("en/") ? "en" : "ko"}">`), file);
    assert.doesNotMatch(html, /<script\b/i, `${file}: the CSP gives scripts 'self' only, and a policy page needs none`);
    assert.ok(html.includes(`mailto:${SUPPORT_CONTACT}`), `${file} gives the contact address`);
  }
});

test("every column the page may write is covered by an item the policy prints", () => {
  const grants = anonInsertGrants();
  const remote = { ...grants, put_cloud_save: cloudSaveArguments() };
  // The tables the game writes; free_text_analyses has no anon grant left.
  assert.deepEqual(Object.keys(grants).sort(), ["app_error_logs", "board_posts", "board_reports", "playtest_feedback", "playtest_sessions"]);
  for (const [table, columns] of Object.entries(remote)) {
    assert.ok(REMOTE_FIELDS[table], `the policy does not cover ${table}`);
    for (const column of columns) {
      const item = REMOTE_FIELDS[table][column];
      assert.ok(item, `${table}.${column} is sent and no item of the policy covers it (REMOTE_FIELDS in scripts/legal-pages.mjs)`);
      assert.ok(ko.includes(DATA_ITEMS[item].ko), `privacy.html does not print the item for ${table}.${column}`);
      assert.ok(en.includes(DATA_ITEMS[item].en), `en/privacy.html does not print the item for ${table}.${column}`);
    }
    // And nothing listed that the page cannot send.
    assert.deepEqual(Object.keys(REMOTE_FIELDS[table]).sort(), [...columns].sort(), `${table}: REMOTE_FIELDS and what is sent differ`);
  }
  assert.deepEqual(Object.keys(REMOTE_FIELDS).sort(), Object.keys(remote).sort());
});

test("the screen language a case row's summary carries is an item of its own on both pages, and in the consent sentence", () => {
  const added = Object.keys(toRowSummary({}));
  assert.ok(added.includes("locale"), "the case row names the page's language (toRowSummary)");
  for (const key of added.filter((name) => name !== "endingVariant")) {
    const item = SUMMARY_FIELDS[key];
    assert.ok(item, `summary.${key} is sent and the policy does not name it (SUMMARY_FIELDS in scripts/legal-pages.mjs)`);
    assert.ok(ko.includes(DATA_ITEMS[item].ko), `privacy.html does not print the item for summary.${key}`);
    assert.ok(en.includes(DATA_ITEMS[item].en), `en/privacy.html does not print the item for summary.${key}`);
  }
  assert.match(PLAYTEST_DATA_NOTICE, /화면 언어/);
});

test("a row the runtime builds sends only granted columns, so the grants are the list", () => {
  const grants = anonInsertGrants();
  const row = createSeasonTelemetryPayload({ caseSummary: {}, completedCaseCount: 1, runId: "run", sessionCode: "CODE", sessionId: "session" });
  for (const key of Object.keys(row)) assert.ok(grants.playtest_sessions.includes(key), `the season row sends ${key}, which anon may not write`);
  assert.equal(row.player_name, "익명 분석관", "the policy says the leaderboard name is fixed");
});

test("the policy quotes the sentence beside the consent box, and says the box starts ticked", () => {
  assert.ok(ko.includes(PLAYTEST_DATA_NOTICE));
  assert.ok(readFileSync("src/screens/IntroScreen.jsx", "utf8").includes("PLAYTEST_DATA_NOTICE"), "the intro prints the shared sentence");
  assert.match(ko, /켜진 상태로 시작/);
  assert.match(en, /ticked by default/);
});

test("the decisions of 2026-10-25 hold: no names, one overseas line, no ads on the web", () => {
  for (const html of [ko, en]) {
    assert.match(html, /Supabase Inc\.\s?\((?:미국|USA)\)/);
    assert.doesNotMatch(html.replace(/<style>[\s\S]*?<\/style>/, ""), /[{}]/, "no placeholder left");
    assert.doesNotMatch(html, /AdSense|AdMob|IDFA/, "no ads yet, so none to describe");
  }
  assert.match(ko, /담당: 임계점 개발자/);
  assert.match(ko, /지금은 광고가 없/);
  assert.match(en, /currently shows no ads/);
  assert.match(ko, /8자리 세션 코드/);
  assert.match(decode(pages["terms.html"]), new RegExp(`href="${PRIVACY_PAGE_PATH}"`));
  assert.match(decode(pages["en/terms.html"]), /href="\/en\/privacy\.html"/);
});
