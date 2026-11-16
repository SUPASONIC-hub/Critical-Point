/**
 * docs/event-week.md (F7, 2026-11-05 (1): the event week's procedure as a
 * document) against the code it describes. Its calendar table drifted once
 * (it stopped at 2027-W03 while the calendar ran to W15 and took W49's crisis
 * week), so chapter 2 is now held to MERGED_WEEKS row by row, and chapter 7
 * to every calendar migration and every file it names.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

import { DAY_MS, KST_OFFSET_MS, WEEKLY_RULES, weekStartMs } from "../../src/gauntlet/weeklyCalendar.js";

const DOC = "docs/event-week.md";
const doc = fs.readFileSync(DOC, "utf8").replace(/\r\n/g, "\n");
const chapter = (n) => doc.slice(doc.indexOf(`\n## ${n}. `), doc.indexOf(`\n## ${n + 1}. `) > 0 ? doc.indexOf(`\n## ${n + 1}. `) : undefined);
const kstDay = (ms) => new Date(ms + KST_OFFSET_MS).toISOString().slice(5, 10);

test("chapter 2's table is the calendar: every week, its dates, its rule and the day it was merged", () => {
  const rows = [...chapter(2).matchAll(/^\| (\d{4}-W\d{2}) \| (\d{2}-\d{2}) ~ (\d{2}-\d{2}) \| `([a-z-]+)`[^|]* \| (\d{2}-\d{2}) \|$/gm)].map((m) => m.slice(1));
  assert.ok(WEEKLY_RULES.length > 0);
  assert.equal(WEEKLY_RULES[0].added === "dev", false, "Node has no dev switch");
  assert.deepEqual(
    rows,
    WEEKLY_RULES.map(({ week, id, added }) => {
      const start = weekStartMs(week);
      return [week, kstDay(start), kstDay(start + 6 * DAY_MS), id, added.slice(5)];
    }),
  );
});

test("chapter 7 names every calendar migration, and every repository file it names is there", () => {
  const files = chapter(7);
  const calendar = fs.readdirSync("supabase/migrations").filter((name) => /weekly_rule|test_week/.test(name) && name.endsWith(".sql"));
  assert.ok(calendar.length >= 6);
  for (const name of calendar) assert.ok(files.includes(name), `${DOC} chapter 7 does not name ${name}`);
  const named = new Set([...doc.matchAll(/`((?:src|scripts|tests|supabase)\/[^`*<>\s]+)`/g)].map((m) => m[1]));
  assert.ok(named.size > 15);
  assert.deepEqual([...named].filter((file) => !fs.existsSync(file)), []);
});
