import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { decide, notesToPublish, originOf, pressedToday, probeNote } from "../../scripts/notes-publish-due.mjs";

/**
 * Notes Publish presses Deploy again for a note whose day has passed and whose
 * page the site still answers 404 for, at most once a Seoul day.
 */

const ORIGIN = "https://site.example";
const notes = [
  { slug: "old", published: "2026-11-21" },
  { slug: "recent", published: "2026-11-23" },
  { slug: "today", published: "2026-11-25" },
  { slug: "later", published: "2026-11-27" },
];
/** A site answering each slug's status (default 200), and the slugs it was asked for. */
const site = (statuses = {}) => {
  const asked = [];
  const fetcher = async (url) => {
    const slug = /\/notes\/(.+)\.html$/.exec(url)[1];
    asked.push(slug);
    const status = statuses[slug] ?? 200;
    if (status === "down") throw new Error("connect failed");
    return { status };
  };
  return { asked, fetcher };
};

test("only an exact 404 is missing: a redirect, a 5xx or a failed request says nothing", async () => {
  for (const [status, state] of [[200, "live"], [404, "missing"], [301, "unknown"], [503, "unknown"], ["down", "unknown"]]) {
    assert.equal(await probeNote(ORIGIN, "old", site({ old: status }).fetcher), state, String(status));
  }
});

test("a note whose day passed and whose page is 404 is overdue; a future note is never asked about", async () => {
  const { asked, fetcher } = site({ recent: 404 });
  assert.deepEqual(await notesToPublish({ notes, today: "2026-11-26", origin: ORIGIN, fetcher }), { today: [], overdue: ["recent"] });
  assert.ok(!asked.includes("later"));
});

test("nothing is waiting when every published page is live", async () => {
  assert.deepEqual(await notesToPublish({ notes, today: "2026-11-26", origin: ORIGIN, fetcher: site().fetcher }), { today: [], overdue: [] });
});

test("today's note is waiting unless the site already serves it", async () => {
  assert.deepEqual(await notesToPublish({ notes, today: "2026-11-25", origin: ORIGIN, fetcher: site({ today: 404 }).fetcher }), { today: ["today"], overdue: [] });
  assert.deepEqual(await notesToPublish({ notes, today: "2026-11-25", origin: ORIGIN, fetcher: site({ today: "down" }).fetcher }), { today: ["today"], overdue: [] }, "as before the probe");
  assert.deepEqual(await notesToPublish({ notes, today: "2026-11-25", origin: ORIGIN, fetcher: site().fetcher }), { today: [], overdue: [] });
});

test("notes sharing a day (ready notes go out at once since 2026-11-25) are each waited for, and each found when one is missing", async () => {
  const shared = [...notes, { slug: "today-2", published: "2026-11-25" }, { slug: "today-3", published: "2026-11-25" }];
  assert.deepEqual(await notesToPublish({ notes: shared, today: "2026-11-25", origin: ORIGIN, fetcher: site({ "today-2": 404 }).fetcher }), { today: ["today-2"], overdue: [] });
  assert.deepEqual(await notesToPublish({ notes: shared, today: "2026-11-25", origin: "", fetcher: site().fetcher }), { today: ["today", "today-2", "today-3"], overdue: [] });
  assert.deepEqual(await notesToPublish({ notes: shared, today: "2026-11-26", origin: ORIGIN, fetcher: site({ "today-3": 404 }).fetcher }), { today: [], overdue: ["today-3"] });
});

test("a site that is down costs one request and presses nothing for earlier notes", async () => {
  const { asked, fetcher } = site({ today: "down", recent: "down", old: "down" });
  assert.deepEqual(await notesToPublish({ notes, today: "2026-11-26", origin: ORIGIN, fetcher }), { today: [], overdue: [] });
  assert.deepEqual(asked, ["today"]);
});

test("with no address it does what it did before: today's notes only, and no request", async () => {
  const { asked, fetcher } = site();
  assert.deepEqual(await notesToPublish({ notes, today: "2026-11-25", origin: "", fetcher }), { today: ["today"], overdue: [] });
  assert.deepEqual(asked, []);
});

test("one press per Seoul day: a dispatch today or a Deploy still running from today holds it back", () => {
  const day = "2026-11-24";
  // 00:30 KST on the 24th is 15:30 UTC on the 23rd.
  assert.ok(pressedToday([{ event: "workflow_dispatch", status: "completed", createdAt: "2026-11-23T15:30:00Z" }], day));
  assert.ok(pressedToday([{ event: "workflow_run", status: "in_progress", createdAt: "2026-11-23T15:30:00Z" }], day));
  assert.ok(!pressedToday([{ event: "workflow_run", status: "completed", createdAt: "2026-11-23T15:30:00Z" }], day), "a finished merge deploy is not a press");
  assert.ok(!pressedToday([{ event: "workflow_dispatch", status: "completed", createdAt: "2026-11-23T14:59:00Z" }], day), "23:59 KST was yesterday");
  assert.ok(!pressedToday([{ event: "workflow_run", status: "in_progress", createdAt: "2026-11-23T14:59:00Z" }], day), "a build from before midnight may not write today's note");
});

test("decide presses once, and running again the same day does not press again", () => {
  const day = "2026-11-24";
  const due = { today: [], overdue: ["recent"] };
  assert.equal(decide(due, [], day).press, true);
  assert.equal(decide(due, [{ event: "workflow_dispatch", status: "queued", createdAt: "2026-11-23T15:11:00Z" }], day).press, false);
  assert.equal(decide({ today: [], overdue: [] }, [], day).press, false);
  // Yesterday's failed press does not hold today's retry back.
  assert.equal(decide(due, [{ event: "workflow_dispatch", status: "completed", createdAt: "2026-11-22T21:00:00Z" }], day).press, true);
});

test("originOf keeps the origin only, and takes nothing that is not a web address", () => {
  assert.equal(originOf("https://site.example/some/path?x=1"), ORIGIN);
  for (const value of ["", undefined, "not a url", "ftp://site.example"]) assert.equal(originOf(value), "");
});

test("the workflow reads the secret only in the deciding step and presses on its answer", () => {
  const workflow = readFileSync(".github/workflows/notes-publish.yml", "utf8");
  assert.match(workflow, /DEPLOY_URL: \$\{\{ secrets\.DEPLOY_URL \}\}/);
  assert.match(workflow, /run: node scripts\/notes-publish-due\.mjs/);
  assert.match(workflow, /if: steps\.due\.outputs\.press == 'true'/);
  assert.doesNotMatch(workflow, /echo .*DEPLOY_URL/);
});
