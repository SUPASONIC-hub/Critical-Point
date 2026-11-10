import assert from "node:assert/strict";
import { test } from "node:test";

const { QUERY, testWeekQuery, readTestWeek, describeTestWeek, readSimulation, loadSimulation, SIMULATION_LINES, seasonLocale, ENGLISH_WARNING, bugSignals } = await import("../../scripts/report-test-week.mjs");

// One window of a case's decision log, as useChoiceCommit writes it (the fields the report reads).
const board = (state, gauge, pushes, environmentMode = "stable", burn = 0) => ({
  nodeId: `n${gauge}`, choiceId: "c", environmentMode,
  threshold: { state, busted: state === "bust", gauge, pushes },
  riskRewardEffect: burn ? { trust: -burn } : {},
});

test("the test week's report reads the audit and the links the way the game settles them, and prints no row", () => {
  const quiet = [board("cash", 30, 1), board("cash", 30, 1), board("cash", 30, 1), board("cash", 30, 1, "reboot")];
  const nearly = [board("cash", 30, 1), board("cash", 30, 1), board("cash", 30, 1, "cascade"), board("bust", 50, 3), board("cash", 65, 4, "reboot")];
  const heavy = [board("cash", 20, 1, "stable", 9), board("cash", 45, 2, "cascade"), board("cash", 35, 2, "reboot")];
  const rows = [
    { run_id: "secret-run-a", case_id: "case01", device: 1, vault: 900, log: quiet },
    { run_id: "secret-run-a", case_id: "case02", device: 1, vault: 1500, log: nearly },
    { run_id: "secret-run-a", case_id: "final", device: 1, vault: 2000, ending: "collapse", log: heavy },
    { run_id: "secret-run-a", case_id: "season-final", device: 1, ranked_week: "2026-W47", log: [] },
    // A NEW GAME+ season's case rows carry the mark (newGamePlusMark); the CLI's JSON may give it as text.
    { run_id: "secret-run-b", case_id: "case01", device: 2, vault: 100, new_game_plus: "true", log: [{ ...board("cash", 30, 1), assistStory: true }] },
    // Seasons of the week without the rule come back as one bare row each.
    { run_id: "secret-run-c", case_id: "turned-down", device: 2, ending: null, vault: null, log: [] },
    { run_id: "secret-run-d", case_id: "turned-down", device: 3, ending: null, vault: null, log: [] },
  ];
  const t = readTestWeek(rows);
  assert.equal(t.seasons, 2, "a season without the rule is not one of the week's");
  assert.equal(t.newGamePlus, 1, "a season whose rows carry newGamePlus is counted once");
  assert.equal(t.turnedDown, 2);
  assert.equal(t.devicesOn, 2);
  assert.equal(t.devicesOff, 2);
  assert.equal(t.devices, 3, "a device that played with and without the rule is one device");
  assert.equal(t.finished, 1);
  assert.equal(t.ranked, 1);
  assert.equal(t.judged, 3, "a story case is not judged");
  assert.equal(t.caught, 1, "four quiet cashes fill the audit");
  assert.equal(t.nearLimit, 2);
  assert.equal(t.nearLimitClear, 1, "a cash at 65 took the audit back down before the close");
  assert.equal(t.vaultLost, 300, "the caught close moved 900, three parts of the 1,200 it secured");
  assert.equal(t.cascadeBoards, 2, "a board is CASCADE when the entry before it dealt one");
  assert.equal(t.cascadeBusts, 1);
  assert.equal(t.made, 1, "a heavy cash makes a link");
  assert.equal(t.collapse, 1);
  const text = describeTestWeek(t);
  assert.doesNotMatch(text, /secret-run/);
  assert.match(text, /시즌당 적발/);
  assert.match(text, /규칙 없이 친 시즌\(규칙을 끔·첫 시즌 기본 꺼짐.*\| 2 \(50\.0%\) \|/);
  assert.match(text, /그중 NEW GAME\+ 시즌.*\| 1 \(50\.0%\) \|/);
  assert.match(text, /서로 다른 기기.*\| 2 \/ 2 \/ 3 \|/);
});

test("a season's language: any English case row makes it English, none naming one is ko(추정), and past half the summary warns", () => {
  assert.equal(seasonLocale([{ locale: "ko" }, { locale: "en" }, { locale: null }]), "en", "any English row");
  assert.equal(seasonLocale([{ locale: null }, { locale: "ko" }]), "ko");
  assert.equal(seasonLocale([{ locale: null }, { locale: "fr" }, {}]), null, "no supported language named: ko(추정)");
  assert.equal(seasonLocale([{ locale: "ko" }, { locale: "ja" }]), "ja", "a Japanese row (10-28: open to the end)");
  assert.equal(seasonLocale([{ locale: "ja" }, { locale: "en" }]), "en", "English first, as before");
  const jaWeek = readTestWeek([{ run_id: "r1", case_id: "case01", device: 1, vault: 1, log: [], locale: "ja" }, { run_id: "r2", case_id: "case01", device: 2, vault: 1, log: [], locale: "en" }, { run_id: "r3", case_id: "case01", device: 3, vault: 1, log: [], locale: "ko" }]);
  assert.deepEqual([jaWeek.english, jaWeek.japanese, jaWeek.korean], [1, 1, 1]);
  const jaText = describeTestWeek(jaWeek);
  assert.match(jaText, /\| 시즌 \| 그중 일본어 화면 시즌.*\| 1 \(33\.3%\) \| \|/);
  assert.ok(jaText.includes(`**${ENGLISH_WARNING}**`), "English and Japanese together past half");
  const caseRow = (run, locale, extra = {}) => ({ run_id: run, case_id: "case01", device: 1, vault: 100, log: [], locale, ...extra });
  const rows = [
    caseRow("secret-run-a", "en"),
    { run_id: "secret-run-a", case_id: "season-final", device: 1, locale: null, log: [] },
    caseRow("secret-run-b", "ko"),
    caseRow("secret-run-c", null),
    caseRow("secret-run-d", "en"),
    { run_id: "secret-run-e", case_id: "turned-down", device: 2, locale: null, log: [] },
  ];
  const half = readTestWeek(rows);
  assert.deepEqual([half.english, half.korean, half.presumedKorean], [2, 1, 1], "a season without the rule is not one of the week's");
  const text = describeTestWeek(half);
  assert.match(text, /\| 시즌 \| 그중 영어 화면 시즌\(사건 행 하나라도 `summary\.locale` = en\) · 한국어 \/ ko\(추정\) \| 2 \(50\.0%\) · 1 \/ 1 \| \|/);
  assert.ok(!text.includes(ENGLISH_WARNING), "exactly half is not past half");
  const more = describeTestWeek(readTestWeek([...rows, caseRow("secret-run-f", "en")]));
  assert.match(more, /그중 영어 화면 시즌.*\| 3 \(60\.0%\) · 1 \/ 1 \|/);
  assert.ok(more.includes(`**${ENGLISH_WARNING}**`));
  assert.match(ENGLISH_WARNING, /「시즌당」 줄.*감4·연3.*참고로만/);
  assert.doesNotMatch(more, /secret-run/);
});

test("the query is one read-only statement", () => {
  assert.match(QUERY, /^with runs as \(/);
  assert.doesNotMatch(QUERY, /\b(insert|update|delete|drop|alter|create|grant|truncate)\b|;/i);
  assert.match(QUERY, /'audit-cascade'/);
  assert.match(QUERY, /'2026-W47'/);
  assert.equal(QUERY, testWeekQuery("2026-W47", "audit-cascade"));
});

test("the query sends no device id out of the database, only its rank among the week's", () => {
  const selected = QUERY.slice(QUERY.lastIndexOf("\nselect "));
  assert.doesNotMatch(selected, /session_id|session_code/);
  assert.match(selected, /s\.summary->>'newGamePlus' = 'true' as new_game_plus/);
  assert.match(selected, /s\.summary->>'locale' as locale/);
  assert.match(QUERY, /dense_rank\(\) over \(order by r\.session_id\) as device/);
});

test("the workflow and the script read the calendar's test week by default (W47 since 2026-10-22), and only its rows", async () => {
  const { readFileSync } = await import("node:fs");
  const { WEEKLY_RULES } = await import("../../src/gauntlet/weeklyRules.js");
  const tests = WEEKLY_RULES.filter((entry) => entry.id === "audit-cascade").map((entry) => entry.week);
  assert.deepEqual(tests, ["2026-W47"]);
  assert.equal(QUERY, testWeekQuery(tests[0], "audit-cascade"));
  const workflow = readFileSync(new URL("../../.github/workflows/test-week.yml", import.meta.url), "utf8");
  assert.equal([...workflow.matchAll(/\d{4}-W\d{2}/g)].map(([week]) => week).filter((week) => week !== tests[0]).length, 0, "the workflow names no other week");
  // A day outside the week: the query keeps only runs whose first row came in that week, so it reads nothing.
  assert.match(QUERY, /having public\.kst_iso_week\(min\(s\.completed_at\)\) = '2026-W47'/);
  assert.match(describeTestWeek(readTestWeek([])), /시작한 시즌 \/ 사건 행 \| 0 \/ 0/);
  assert.match(describeTestWeek(readTestWeek([])), /그중 영어 화면 시즌.*\| 0 \(—\) · 0 \/ 0 \|/);
});

test("the reference column is the bot with both rules on (check:endings' own lines), not each rule alone", () => {
  assert.deepEqual(readSimulation(SIMULATION_LINES), {
    seasons: 600, collapse: "23.0%", made: "45.22", back: "33.81", cascadeBust: "12.7%", bust: "11.4%",
    caught: "0.62", caughtShare: "7.5%", vaultLost: "0.3%",
  });
  const text = describeTestWeek(readTestWeek([]));
  assert.match(text, /시즌당 적발 \/ 적발이 있었던 시즌 \| — \/ 0 \(—\) \| 0\.62 \/ 7\.5% \(둘 다 켬·면제, 600시즌 봇\) \|/);
  assert.match(text, /금고로 갈 몫의 잃은 비율\(추정\) \| — \| 0\.3% \|/);
  assert.match(text, /CASCADE 판 BUST \(모든 판\) \| — \(—\) \| 12\.7% \(11\.4%\) \|/);
  assert.match(text, /\| 끝난 시즌당 만듦 \/ 돌아옴\(끝난 시즌의 판만\) \| — \/ — \| 45\.22 \/ 33\.81 \|/);
  assert.match(text, /\| 시작한 시즌당 만듦 \/ 돌아옴\(멈춘 시즌 포함\) \| — \/ — \| \|/, "the bot's figures stand beside the finished seasons only");
  assert.match(text, /붕괴 결말 \| — \(0\/0\) \| 23\.0% \|/);
  assert.match(text, /감사·연쇄를 함께 켠 시즌 봇입니다/);
  assert.doesNotMatch(text, /따로 켠|1\.75 \/|\| 0\.7% \||20\.7%/);
  // A run with one rule off prints no line for it, and the report says so rather than show a stale figure.
  assert.throws(() => readSimulation(SIMULATION_LINES.split("\n").slice(0, 2).join("\n")), /no audit line/);
  // Before #461 the lines carried the rule's week switch; a saved run or variable may still hold that form.
  const old = SIMULATION_LINES.replace("CASCADE (measured, ", "CASCADE (measured, CASCADE_WEEK=1, ").replace("Audit (measured, ", "Audit (measured, AUDIT_WEEK=1, ");
  assert.notEqual(old, SIMULATION_LINES);
  assert.deepEqual(readSimulation(old), readSimulation(SIMULATION_LINES));
  assert.deepEqual(readSimulation(old.replaceAll("\n", " ")), readSimulation(SIMULATION_LINES));
  // The per-archetype lines (`CASCADE (measured) random …`) are not the aggregate.
  assert.throws(() => readSimulation(SIMULATION_LINES.replace(/^CASCADE \(measured, /m, "CASCADE (measured) random ")), /no CASCADE line/);
});

test("a finished season without the week on its ranking row is the bug signal, as a board left empty is (P4, 11-03)", () => {
  const finishedRun = (run, device, ranked_week) => [
    { run_id: run, case_id: "case01", device, vault: 100, log: [board("cash", 30, 1)] },
    { run_id: run, case_id: "season-final", device, ranked_week, log: [] },
  ];
  const stopped = { run_id: "secret-run-z", case_id: "case01", device: 9, vault: 100, log: [board("cash", 30, 1)] };
  // Every finished season ranked: no signal, whatever the seasons that stopped.
  const fine = readTestWeek([...finishedRun("secret-run-a", 1, "2026-W47"), stopped]);
  assert.deepEqual([fine.finished, fine.ranked, fine.unranked], [1, 1, 0]);
  assert.deepEqual(bugSignals(fine), []);
  assert.match(describeTestWeek(fine), /\| 끝난 시즌 \/ 이 주 랭킹에 오른 시즌 \/ 이 주가 안 붙은 끝난 시즌 \| 1 \/ 1 \/ 0 \|/);
  assert.match(describeTestWeek(fine), /\| 버그 신호\(판정기준 ①, 표본과 상관없이\) \| 없음 \|/);
  // One of two not stamped: counted, the board is not empty, so not the signal.
  const one = readTestWeek([...finishedRun("secret-run-a", 1, "2026-W47"), ...finishedRun("secret-run-b", 2, null)]);
  assert.deepEqual([one.finished, one.ranked, one.unranked], [2, 1, 1]);
  assert.deepEqual(bugSignals(one), []);
  // Finished seasons and none on the week's board: the signal the old 「랭킹 > 끝난 시즌」 could never raise.
  const empty = readTestWeek([...finishedRun("secret-run-a", 1, null), ...finishedRun("secret-run-b", 2, "2026-W46")]);
  assert.deepEqual([empty.finished, empty.ranked, empty.unranked], [2, 0, 2]);
  assert.deepEqual(bugSignals(empty), ["끝난 시즌은 있는데 이 주 랭킹 0"]);
  const text = describeTestWeek(empty);
  assert.match(text, /\| 버그 신호\(판정기준 ①, 표본과 상관없이\) \| \*\*끝난 시즌은 있는데 이 주 랭킹 0\*\* \|/);
  assert.doesNotMatch(text, /secret-run/);
  // No finished season yet (the week's first nights): nothing to rank, no signal.
  assert.deepEqual(bugSignals(readTestWeek([stopped])), []);
});

test("the judgement's other bug signals come off the same counts", () => {
  const signals = (t) => bugSignals({ caught: 0, judged: 0, cascadeBoards: 0, boards: 0, cascadeBusts: 0, finished: 0, ranked: 0, caseRows: 0, ...t });
  assert.deepEqual(signals({ caught: 7, judged: 10 }), ["감1 적발 70% 이상"]);
  assert.deepEqual(signals({ caught: 6, judged: 10 }), []);
  assert.deepEqual(signals({ cascadeBoards: 5, boards: 10 }), ["연1 CASCADE 판 50% 이상"]);
  assert.deepEqual(signals({ cascadeBoards: 5, boards: 20, cascadeBusts: 3 }), ["연2 CASCADE 판 BUST 60% 이상"]);
  assert.deepEqual(signals({ caseRows: 3 }), ["사건 행은 있는데 판정한 닫힘 0"]);
  // A story case is not judged, so a week of story cases alone raises the last one.
  assert.deepEqual(bugSignals(readTestWeek([{ run_id: "r", case_id: "case01", device: 1, vault: 1, log: [{ ...board("cash", 30, 1), assistStory: true }] }])), ["사건 행은 있는데 판정한 닫힘 0"]);
});

test("links per season: the bot's figures stand beside the finished seasons, the started ones are their own line (P5, 11-03)", () => {
  const twoCascade = [board("cash", 30, 1, "cascade"), board("cash", 30, 1, "cascade"), board("cash", 30, 1)];
  const oneCascade = [board("cash", 30, 1, "cascade"), board("cash", 30, 1)];
  const heavy = [board("cash", 20, 1, "stable", 9), board("cash", 45, 2)];
  const rows = [
    // Finished: 2 + 1 CASCADE boards, one link made.
    { run_id: "secret-run-a", case_id: "case01", device: 1, vault: 100, log: twoCascade },
    { run_id: "secret-run-a", case_id: "case02", device: 1, vault: 200, log: [...oneCascade, ...heavy] },
    { run_id: "secret-run-a", case_id: "season-final", device: 1, ranked_week: "2026-W47", log: [] },
    // Stopped after one case: 1 CASCADE board, no season-final row.
    { run_id: "secret-run-b", case_id: "case01", device: 2, vault: 100, log: oneCascade },
    { run_id: "secret-run-c", case_id: "case01", device: 3, vault: 100, log: [board("cash", 30, 1)] },
  ];
  const t = readTestWeek(rows);
  assert.deepEqual([t.seasons, t.finished, t.cascadeBoards, t.finishedBack, t.made, t.finishedMade], [3, 1, 4, 3, 1, 1]);
  const text = describeTestWeek(t);
  assert.match(text, /\| 끝난 시즌당 만듦 \/ 돌아옴\(끝난 시즌의 판만\) \| 1\.00 \/ 3\.00 \| 45\.22 \/ 33\.81 \|/, "3 CASCADE boards in the one finished season");
  assert.match(text, /\| 시작한 시즌당 만듦 \/ 돌아옴\(멈춘 시즌 포함\) \| 0\.33 \/ 1\.33 \| \|/, "4 over the 3 started");
});

test("a fresh bot measurement reaches the reference column through TEST_WEEK_SIM, pasted as one line or three (P3, 11-03)", async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const fresh = SIMULATION_LINES.replace("collapse 23.0%", "collapse 22.4%").replace("(0.62 a season)", "(1.40 a season)").replace("bust on them 12.7%", "bust on them 13.1%");
  // A text box runs the three lines into one; check:endings' whole output has other lines around them.
  assert.deepEqual(readSimulation(fresh.replaceAll("\n", " ")), readSimulation(fresh));
  assert.equal(readSimulation(`Replaying 600 seasons...\n${fresh}\nDone.`).collapse, "22.4%");
  assert.deepEqual(loadSimulation({}), { ...readSimulation(SIMULATION_LINES), fresh: false }, "empty: the script's 11-06 lines");
  const dir = mkdtempSync(join(tmpdir(), "test-week-sim-"));
  try {
    const file = join(dir, "sim.txt");
    writeFileSync(file, `${fresh.replaceAll("\n", " ")}\n`);
    const sim = loadSimulation({ TEST_WEEK_SIM: file });
    assert.deepEqual([sim.collapse, sim.caught, sim.cascadeBust, sim.fresh], ["22.4%", "1.40", "13.1%", true]);
    const text = describeTestWeek(readTestWeek([]), sim);
    assert.match(text, /\| 1\.40 \/ 7\.5% \(둘 다 켬·면제, 600시즌 봇, 다시 잼\) \|/);
    assert.match(text, /붕괴 결말 \| — \(0\/0\) \| 22\.4% \|/);
    assert.match(text, /TEST_WEEK_SIM으로 넘긴 다시 잰 값/);
    assert.doesNotMatch(text, /11-06 main ac0645d3에서 잰 값/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.doesNotMatch(describeTestWeek(readTestWeek([])), /다시 잼/);
});

test("the workflow passes the measurement as a file from its input or the repository variable, never into a command line", async () => {
  const { readFileSync } = await import("node:fs");
  const workflow = readFileSync(new URL("../../.github/workflows/test-week.yml", import.meta.url), "utf8");
  assert.match(workflow, /\n {6}sim:\n {8}description: .+\n {8}required: false\n {8}default: ""\n/);
  assert.match(workflow, /SIM_LINES: \$\{\{ inputs\.sim \|\| vars\.TEST_WEEK_SIM_LINES \}\}/);
  assert.match(workflow, /printf '%s\\n' "\$SIM_LINES" > sim\.txt\n\s+export TEST_WEEK_SIM=sim\.txt/);
  const runs = [...workflow.matchAll(/run: \|?\n?([\s\S]*?)(?=\n {6}- |\n*$)/g)].map(([, body]) => body);
  assert.ok(runs.every((body) => !/\$\{\{\s*(inputs\.sim|vars\.)/.test(body)), "the lines go through env, not into a script's text");
  assert.match(workflow, /rm -f rows\.json query\.err sim\.txt/);
});

test("the test week's JSON for the run's artifact carries the summary's counts and no run id", async () => {
  const { testWeekJson } = await import("../../scripts/report-test-week.mjs");
  const rows = [
    { run_id: "secret-run-json", case_id: "case01", device: 8001, vault: 100, log: [board("cash", 30, 1)] },
    { run_id: "secret-run-json", case_id: "season-final", device: 8001, ranked_week: "2026-W47", log: [] },
  ];
  const json = testWeekJson(rows);
  assert.deepEqual(json.counts, readTestWeek(rows), "the same counts the Markdown is written from");
  const text = JSON.stringify(json);
  assert.ok(!text.includes("secret-run") && !text.includes("8001"), "no run id and no device");
});
