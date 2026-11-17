import assert from "node:assert/strict";
import { test } from "node:test";

import { WEEKLY_RULES } from "../../src/gauntlet/weeklyCalendar.js";
import { WEEK_RULE_CATALOGUE } from "../../src/gauntlet/weeklyRules.js";
import { renderContentPages } from "../../scripts/content-pages/pages.mjs";
import { dayIn, FIRST_LISTED_WEEK, listedWeeks, ruleIn, weeklyBody } from "../../scripts/content-pages/weekly-text.mjs";

/**
 * The weekly rule calendar page (방향 질의 Q12 (1)): every booked week from
 * FIRST_LISTED_WEEK with its days and its rule, in three languages, its
 * numbers the catalogue's own.
 */

const LANGUAGES = ["ko", "en", "ja"];
const pages = renderContentPages();

test("every booked week from W48 is on the page, in every language, with no blank left", () => {
  const weeks = listedWeeks();
  assert.ok(weeks.length >= 10);
  assert.equal(weeks[0].week >= FIRST_LISTED_WEEK, true);
  assert.equal(weeks.some((entry) => entry.id === "audit-cascade"), false, "the test week is before the list");
  for (const language of LANGUAGES) {
    const html = pages[`${language === "ko" ? "" : `${language}/`}weekly.html`];
    assert.ok(html, `${language} page`);
    for (const entry of weeks) {
      const rule = ruleIn(entry.id, language);
      assert.ok(rule, `${entry.id} has words in ${language}`);
      assert.doesNotMatch(rule.text, /\{|undefined|NaN/);
      assert.ok(html.includes(rule.label), `${language} lists ${entry.week}`);
    }
    assert.equal((html.match(/<li>/g) ?? []).length, weeks.length, `${language}: one item a week`);
  }
});

test("the page's words say the catalogue's numbers", () => {
  for (const id of new Set(WEEKLY_RULES.filter((entry) => entry.week >= FIRST_LISTED_WEEK).map((entry) => entry.id))) {
    assert.equal(ruleIn(id, "ko").text, WEEK_RULE_CATALOGUE[id].text, `${id}: the Korean is the catalogue's own sentence`);
  }
  assert.match(ruleIn("short-clock", "en").text, /8 seconds less.*1\.25 times/);
  assert.match(ruleIn("crisis-week", "ja").text, /熱3.*1\.2倍/);
  assert.equal(ruleIn("no-such-rule", "ko"), null);
  assert.equal(ruleIn("near-wall", "fr"), null);
});

test("days are Korean time, in the page's language", () => {
  const monday = Date.parse("2026-11-30T00:00:00+09:00");
  assert.equal(dayIn(monday, "ko"), "2026년 11월 30일(월)");
  assert.equal(dayIn(monday, "en"), "Mon, Nov 30, 2026");
  assert.equal(dayIn(monday, "ja"), "2026年11月30日(月)");
});

test("an empty calendar says so, and a dev week is never listed", () => {
  assert.match(weeklyBody("ko", []), /정해 둔 주가 아직 없습니다/);
  assert.equal(listedWeeks([{ week: "2027-W20", id: "near-wall", added: "dev" }]).length, 0);
});

test("the guide links the calendar and names every rule the calendar books", () => {
  for (const [file, href] of [["guide.html", "/weekly.html"], ["en/guide.html", "/en/weekly.html"], ["ja/guide.html", "/ja/weekly.html"]]) {
    assert.ok(pages[file].includes(`href="${href}"`), `${file} links ${href}`);
    for (const id of new Set(listedWeeks().map((entry) => entry.id))) assert.ok(pages[file].includes(WEEK_RULE_CATALOGUE[id].label), `${file} names ${id}`);
  }
});
