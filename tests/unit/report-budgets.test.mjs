import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const { QUERY, NEAR, DEFAULTS, DATABASE_PLAN_BYTES, readBudgets, nearLimits, describeBudgets } = await import("../../scripts/report-budgets.mjs");

const HOUR = 3600;

test("the read is one SELECT of counts and limits, and no key of a writer", () => {
  assert.match(QUERY, /^select /);
  assert.equal(QUERY.trim().split(";").filter((part) => part.trim()).length, 1, "one statement");
  assert.doesNotMatch(QUERY, /\b(insert|update|delete|drop|alter|grant|truncate)\b/i);
  // Only the two global counters are joined, by name: no address's row is read.
  assert.match(QUERY, /on t\.actor_key = k\.name/);
  assert.doesNotMatch(QUERY, /\bcloud_saves\b|\bsession_id\b|\bpayload\b/);
});

test("the defaults are the server's", () => {
  const migrations = (name) => readFileSync(`supabase/migrations/${name}`, "utf8");
  assert.match(migrations("20261103010000_cloud_unknown_address_and_tier_list.sql"), new RegExp(`private_setting_int\\('cloud_daily_new_codes', ${DEFAULTS.cloud}\\)`));
  assert.match(migrations("20261014000000_telemetry_validator_parts.sql"), new RegExp(`private_setting_int\\('telemetry_daily_bytes', ${DEFAULTS.telemetryBytes}\\)`));
  assert.match(QUERY, new RegExp(`'cloud_daily_new_codes', ${DEFAULTS.cloud}\\)`));
  assert.match(QUERY, new RegExp(`'telemetry_daily_bytes', ${DEFAULTS.telemetryBytes}\\)`));
});

test("a limit at 80% or more alarms, the database never does", () => {
  const budgets = readBudgets([
    { name: "global:cloud-new", used: "2400", ceiling: "3000", age_seconds: String(5 * HOUR) },
    { name: "global:telemetry-bytes", used: 104857600, ceiling: 209715200, age_seconds: 2 * HOUR },
    { name: "database", used: 520000000, ceiling: DATABASE_PLAN_BYTES, age_seconds: null },
  ]);
  assert.equal(budgets[0].ratio, 0.8);
  assert.deepEqual(nearLimits(budgets).map((budget) => budget.name), ["global:cloud-new"]);
  assert.equal(NEAR, 0.8);
  const summary = describeBudgets(budgets);
  assert.match(summary, /\*\*1개 한도가 80%를 넘었습니다\.\*\*/);
  assert.match(summary, /\| 온라인 저장 새 코드\(하루\) \| 2,400 \| 3,000 \| 80\.0% ⚠ \| 5시간째 \|/);
  assert.match(summary, /\| 텔레메트리 바이트\(하루\) \| 100\.0 MB \| 200\.0 MB \| 50\.0% \| 2시간째 \|/);
  assert.match(summary, /\| 데이터베이스 크기 \| .* \| 지금 \|/);
  assert.doesNotMatch(summary, /데이터베이스 크기[^\n]*⚠/);
});

test("a day that ended is that day's total, and still counts", () => {
  const [ended, never] = readBudgets([
    { name: "global:cloud-new", used: 2990, ceiling: 3000, age_seconds: 30 * HOUR },
    { name: "global:telemetry-bytes", used: null, ceiling: 209715200, age_seconds: null },
  ]);
  assert.equal(ended.ended, true);
  assert.equal(nearLimits([ended, never]).length, 1);
  assert.equal(never.used, 0);
  const summary = describeBudgets([ended, never]);
  assert.match(summary, /끝난 하루\(30시간 전 시작\)/);
  assert.match(summary, /아직 없음/);
  assert.match(describeBudgets([never]), /80%를 넘은 한도는 없습니다\./);
});
