import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { buildSeasonReadyRows, formatSeasonReady, READY_COLUMNS, seasonVerdict, sideFileId, summaryLines } from "../../scripts/season-ready.mjs";

/**
 * N47 Season 준비표 (2026-11-18): report:season-ready weighs check:case's
 * warnings and the e2e specs per side case file, and side case PRs get the
 * summary line only, never a failure.
 */

const warn = (unit, kind, item = "x") => ({ unit, kind, item });

test("side case files are side01..side99, never the placeholder or the list", () => {
  assert.equal(sideFileId("side01.js"), "side01");
  assert.equal(sideFileId("side12.js"), "side12");
  for (const file of ["side00.js", "sidePacks.js", "case01.js", "side1.js", "side01.ts"]) assert.equal(sideFileId(file), null, file);
});

test("a row counts its warnings by column, and is ready with none and an e2e spec", () => {
  const rows = buildSeasonReadyRows({
    ids: ["side11", "side10"],
    titles: { side10: "열", side11: "열하나" },
    listed: ["side10"],
    warnings: [warn("side11", "초상"), warn("side11", "en 키"), warn("side11", "ja 이름"), warn("side11", "TODO"), warn("docs/canon.md", "중복")],
    specs: ["side10", "side11"],
  });
  assert.deepEqual(rows.map((row) => row.id), ["side10", "side11"]);
  assert.deepEqual(rows[0], { id: "side10", title: "열", listed: true, warnings: 0, counts: { portrait: 0, locale: 0, other: 0 }, e2e: true, ready: true });
  assert.deepEqual(rows[1].counts, { portrait: 1, locale: 2, other: 1 });
  assert.equal(rows[1].ready, false);
  assert.equal(buildSeasonReadyRows({ ids: ["side12"] })[0].ready, false, "no e2e spec, not ready");
  assert.deepEqual(READY_COLUMNS.map((column) => column.key), ["portrait", "locale", "other"]);
});

test("the verdict: 공개 가능 only when every file a release does not list is ready", () => {
  const ready = { listed: false, ready: true };
  assert.match(seasonVerdict([{ id: "side01", listed: true, ready: true }]).line, /^새로 준비된 번외 없음/);
  assert.equal(seasonVerdict([{ id: "side01", listed: true, ready: false }]).ready, false);
  const go = seasonVerdict([{ id: "side10", ...ready }, { id: "side01", listed: true, ready: false }]);
  assert.equal(go.ready, true);
  assert.equal(go.line, "공개 가능 — side10 준비됨.");
  const wait = seasonVerdict([{ id: "side10", ...ready }, { id: "side11", listed: false, ready: false }]);
  assert.equal(wait.ready, false);
  assert.equal(wait.line, "아직 — side11에 경고나 e2e 빠짐.");
});

test("the table is markdown with one row a file and the verdict under it", () => {
  const rows = buildSeasonReadyRows({ ids: ["side10"], titles: { side10: "열" }, specs: ["side10"] });
  const text = formatSeasonReady(rows, { docWarnings: 2 });
  assert.match(text, /^## Season 준비표/);
  assert.match(text, /\| side10 \| 열 \| 대기 \| 0 \| 0 \| 0 \| 0 \| 있음 \| 초록 \|/);
  assert.match(text, /문서 경고 2개/);
  assert.match(text, /\*\*공개 가능 — side10 준비됨\.\*\*/);
});

test("a PR's summary is one line a case, counts by kind, no items", () => {
  const lines = summaryLines(["side01", "side02"], [warn("side02", "초상", "누구"), warn("side02", "en 키", "a"), warn("side02", "en 키", "b")]);
  assert.deepEqual(lines, ["side01: 경고 없음", "side02: 경고 3개 (초상 1, en 키 2)"]);
});

test("check:case --summary and --json print what the workflow and the report read, and exit 0", () => {
  const summary = spawnSync(process.execPath, ["scripts/check-case.mjs", "--summary", "side01"], { encoding: "utf8" });
  assert.equal(summary.status, 0);
  assert.match(summary.stdout.trim(), /^side01: (경고 없음|경고 \d+개 \(.+\))$/);
  const json = spawnSync(process.execPath, ["scripts/check-case.mjs", "--json", "side01"], { encoding: "utf8" });
  assert.equal(json.status, 0);
  const parsed = JSON.parse(json.stdout);
  assert.deepEqual(parsed.ids, ["side01"]);
  assert.ok(Array.isArray(parsed.warnings));
});

test("the workflow is warnings only and runs on side case files", () => {
  const workflow = readFileSync(".github/workflows/case-check.yml", "utf8");
  assert.match(workflow, /src\/nodes\/side\*\.js/);
  assert.match(workflow, /continue-on-error: true/);
  assert.match(workflow, /check-case\.mjs --summary/);
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(pkg.scripts["report:season-ready"], "node scripts/report-season-ready.mjs");
});
