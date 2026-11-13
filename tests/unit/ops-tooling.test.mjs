import assert from "node:assert/strict";
import { test } from "node:test";

const { QUERY, readOpsHealth, describeOpsHealth, maskMessage, quietDays, describeInactivity } = await import("../../scripts/report-ops-health.mjs");
const { readWorkflows, toEnable, describeKeepalive } = await import("../../scripts/workflow-keepalive.mjs");
const { readConfig, fetchTable, backup, backupDay, TABLES, PAGE } = await import("../../scripts/backup-local.mjs");

test("the ops read is one SELECT that never takes a session, stack or feedback body", () => {
  assert.equal(QUERY.trim().split(";").filter((part) => part.trim()).length, 1);
  assert.doesNotMatch(QUERY, /\b(insert|update|delete|drop|alter|grant|truncate)\b/i);
  assert.doesNotMatch(QUERY, /session_id|session_code|error_stack|dom_snapshot|component_stack|feedback\s*->|f\.feedback|context/);
  assert.match(QUERY, /left\(.*, 40\)/);
});

test("yesterday's errors, top three cut and masked, and feedback as a count", () => {
  const health = readOpsHealth([
    { kind: "errors", message: null, n: "12" },
    { kind: "feedback", message: null, n: 3 },
    { kind: "top", message: "TypeError at user kim@example.com id 1234567", n: "7" },
    { kind: "top", message: "Failed https://x.example/a?b=c", n: 3 },
    { kind: "top", message: "deadbeefcafe | `x`", n: 2 },
    { kind: "top", message: "fourth", n: 1 },
  ]);
  assert.equal(health.errors, 12);
  assert.equal(health.feedback, 3);
  assert.equal(health.top.length, 3);
  const text = describeOpsHealth(health, 3);
  assert.match(text, /어제 오류 12건\(상위 3: /);
  assert.match(text, /의견 3건/);
  assert.doesNotMatch(text, /kim@example\.com|1234567|x\.example|deadbeefcafe/);
  assert.doesNotMatch(text, /⚠/);
});

test("a message never passes 40 characters", () => {
  assert.ok(maskMessage("a".repeat(100)).length <= 40);
  assert.equal(maskMessage(null), "");
});

test("the inactivity warning starts at 45 quiet days", () => {
  const now = new Date("2026-11-12T00:00:00Z");
  assert.equal(quietDays("2026-09-28T00:00:00Z", now), 45);
  assert.equal(quietDays("not a date", now), null);
  assert.match(describeInactivity(45), /⚠/);
  assert.doesNotMatch(describeInactivity(44), /⚠/);
  assert.equal(describeInactivity(null), "");
  assert.match(describeOpsHealth({ errors: 0, feedback: 0, top: [] }, 50), /어제 오류 0건\n.*의견 0건[\s\S]*⚠/);
});

test("keepalive turns on only what GitHub turned off for inactivity", () => {
  const workflows = readWorkflows({
    workflows: [
      { id: 1, name: "Funnel", state: "active" },
      { id: 2, name: "Board Reports", state: "disabled_inactivity" },
      { id: 3, name: "Test Week", state: "disabled_manually" },
    ],
  });
  assert.deepEqual(toEnable(workflows).map((w) => w.id), [2]);
  const text = describeKeepalive(workflows, 10);
  assert.match(text, /1개를 다시 켰습니다: `Board Reports`/);
  assert.match(text, /손으로 끈 워크플로는 그대로 둡니다: `Test Week`/);
  assert.match(describeKeepalive(readWorkflows([]), null), /꺼진 워크플로는 없습니다/);
});

test("the backup needs both settings and reads with GET only, page by page", async () => {
  assert.throws(() => readConfig({}), /SUPABASE_URL/);
  assert.throws(() => readConfig({ SUPABASE_URL: "https://a.supabase.co" }), /SERVICE_ROLE_KEY/);
  const config = readConfig({ SUPABASE_URL: "https://a.supabase.co/", SUPABASE_SERVICE_ROLE_KEY: "k", BACKUP_ROOT: "R" });
  assert.equal(config.url, "https://a.supabase.co");
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    const from = Number(init.headers.Range.split("-")[0]);
    const size = url.includes("cloud_saves") && from === 0 ? PAGE : url.includes("cloud_saves") ? 2 : 1;
    return { ok: true, json: async () => Array.from({ length: size }, (_, i) => ({ i: from + i })) };
  };
  assert.equal((await fetchTable("cloud_saves", config, fetchImpl)).length, PAGE + 2);
  assert.ok(calls.every((call) => call.init.method === "GET"));

  const files = {};
  const { dir, counts } = await backup({ config, now: new Date("2026-11-12T16:00:00Z"), fetchImpl, write: (path, body) => (files[path] = body), mkdir: () => {}, log: () => {} });
  assert.match(dir, /2026-11-13$/);
  assert.deepEqual(Object.keys(counts), TABLES);
  assert.equal(counts.cloud_saves, PAGE + 2);
  assert.ok(Object.keys(files).some((path) => path.endsWith("manifest.json")));
  await assert.rejects(fetchTable("x", config, async () => ({ ok: false, status: 401 })), /HTTP 401/);
  assert.equal(backupDay(new Date("2026-11-12T14:59:00Z")), "2026-11-12");
});
