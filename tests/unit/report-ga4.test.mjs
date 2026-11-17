import assert from "node:assert/strict";
import { createVerify, generateKeyPairSync } from "node:crypto";
import test from "node:test";

import {
  API,
  describeScenes,
  describeWeeks,
  readRows,
  readSecrets,
  reportGa4,
  SCENE_EVENT,
  sceneRequest,
  SCOPE,
  serviceAccountJwt,
  STEPS,
  TOKEN_URL,
  weeklyRequest,
} from "../../scripts/report-ga4.mjs";

/** N17 (2026-11-16): the first hour's GA4 numbers in the funnel summary, read with a service account. */

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const KEY = { client_email: "funnel@example.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }), private_key_id: "abc123" };
const ENV = { GA4_SA_KEY: JSON.stringify(KEY), GA4_PROPERTY_ID: "123456789" };
const decode = (part) => JSON.parse(Buffer.from(part, "base64url").toString("utf8"));

test("without either secret, or with a wrong one, it skips and says why", () => {
  assert.match(readSecrets({}).skip, /GA4_SA_KEY·GA4_PROPERTY_ID 비밀이 없어/);
  assert.match(readSecrets({ GA4_SA_KEY: ENV.GA4_SA_KEY }).skip, /^GA4_PROPERTY_ID 비밀이 없어/);
  assert.match(readSecrets({ ...ENV, GA4_PROPERTY_ID: "G-ABC123" }).skip, /속성 번호/);
  assert.match(readSecrets({ ...ENV, GA4_SA_KEY: "{not json" }).skip, /JSON이 아닙니다/);
  assert.match(readSecrets({ ...ENV, GA4_SA_KEY: "{}" }).skip, /client_email/);
  const ok = readSecrets(ENV);
  assert.equal(ok.propertyId, "123456789");
  assert.equal(ok.key.client_email, KEY.client_email);
});

test("the assertion is a signed RS256 JWT for the read-only Analytics scope", () => {
  const now = Date.UTC(2026, 10, 16, 3);
  const jwt = serviceAccountJwt(KEY, now);
  const [header, claims, signature] = jwt.split(".");
  assert.deepEqual(decode(header), { alg: "RS256", typ: "JWT", kid: "abc123" });
  assert.deepEqual(decode(claims), { iss: KEY.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now / 1000, exp: now / 1000 + 3600 });
  assert.ok(createVerify("RSA-SHA256").update(`${header}.${claims}`).verify(publicKey, Buffer.from(signature, "base64url")));
});

test("the two requests ask for the three steps by week and the scenes of 프롤로그 01·02, nothing about a person", () => {
  const weekly = weeklyRequest();
  assert.deepEqual(weekly.dimensions.map((d) => d.name), ["isoYearIsoWeek", "eventName"]);
  assert.deepEqual(weekly.dimensionFilter.filter.inListFilter.values, ["cp_start_pressed", "cp_first_table_open", "cp_prologue01_done"]);
  const scenes = sceneRequest();
  assert.deepEqual(scenes.dimensions.map((d) => d.name), ["customEvent:case_no", "customEvent:scene_no"]);
  assert.equal(scenes.dimensionFilter.filter.stringFilter.value, SCENE_EVENT);
  for (const body of [weekly, scenes]) {
    assert.deepEqual(body.metrics.map((m) => m.name), ["totalUsers", "eventCount"]);
    assert.doesNotMatch(JSON.stringify(body), /city|country|deviceId|pagePath|userId|clientId/i);
  }
});

const report = (rows) => ({ rows: rows.map(([dims, users, events]) => ({ dimensionValues: dims.map((value) => ({ value })), metricValues: [{ value: String(users) }, { value: String(events) }] })) });

test("the weekly table is newest first, with each step's share of the one before", () => {
  const rows = readRows(report([
    [["202646", "cp_start_pressed"], 10, 12],
    [["202646", "cp_first_table_open"], 8, 9],
    [["202646", "cp_prologue01_done"], 4, 4],
    [["202647", "cp_start_pressed"], 5, 5],
  ]));
  const lines = describeWeeks(rows);
  assert.equal(lines[2], `| 주 | ${STEPS.map((s) => s.label).join(" | ")} | 첫 판/시작 | 끝/첫 판 |`);
  assert.equal(lines[4], "| 2026-W47 | 5 | 0 | 0 | 0% | — |");
  assert.equal(lines[5], "| 2026-W46 | 10 | 8 | 4 | 80% | 50% |");
  assert.match(describeWeeks([]).join("\n"), /아직 없음/);
});

test("the scene table orders the scenes and reads each against its case's first", () => {
  const lines = describeScenes(readRows(report([[["2", "1"], 6, 6], [["1", "2"], 7, 8], [["1", "1"], 10, 10], [["(not set)", "1"], 3, 3]])));
  assert.deepEqual(lines.slice(2), [
    "| 사건 | 장면 | 사용자 | 그 사건 첫 장면 대비 |",
    "|---|--:|--:|--:|",
    "| 프롤로그 01 | 1 | 10 | 100% |",
    "| 프롤로그 01 | 2 | 7 | 70% |",
    "| 프롤로그 02 | 1 | 6 | 100% |",
  ]);
  assert.match(describeScenes([]).join("\n"), /아직 `cp_scene` 이벤트가 없습니다/);
});

/** A stand-in for Google's two endpoints. */
function fakeFetch({ token = true, weekly = { rows: [] }, scenes = { rows: [] } } = {}) {
  const calls = [];
  const reply = (status, body) => ({ ok: status < 400, status, json: async () => body });
  const impl = async (url, init) => {
    calls.push({ url, init });
    if (url === TOKEN_URL) return token ? reply(200, { access_token: "tok" }) : reply(400, { error: "invalid_grant", error_description: "Invalid JWT Signature." });
    const body = JSON.parse(init.body);
    const answer = body.dimensions[0].name === "isoYearIsoWeek" ? weekly : scenes;
    return answer.error ? reply(400, answer) : reply(200, answer);
  };
  return { impl, calls };
}

test("the whole section: skipped without secrets, read with them, and never a throw", async () => {
  const skipped = await reportGa4({}, async () => assert.fail("nothing is asked without secrets"));
  assert.deepEqual(skipped.warnings, []);
  assert.match(skipped.lines.join("\n"), /^## 첫 시간 \(GA4\)\n\nGA4_SA_KEY·GA4_PROPERTY_ID 비밀이 없어/);

  const { impl, calls } = fakeFetch({ weekly: report([[["202646", "cp_start_pressed"], 3, 3]]) });
  const read = await reportGa4(ENV, impl);
  assert.deepEqual(read.warnings, []);
  assert.match(read.lines.join("\n"), /\| 2026-W46 \| 3 \| 0 \| 0 \| 0% \| — \|/);
  assert.equal(calls.length, 3);
  assert.equal(calls[1].url, `${API}/properties/123456789:runReport`);
  assert.equal(calls[1].init.headers.Authorization, "Bearer tok");
  assert.ok(!calls.some((call) => JSON.stringify(call).includes("PRIVATE KEY")), "the key itself is never sent, only the signed assertion");

  const refused = await reportGa4(ENV, fakeFetch({ token: false }).impl);
  assert.match(refused.lines.join("\n"), /GA4 인증 실패: token 400 Invalid JWT Signature\./);
  assert.equal(refused.warnings.length, 1);
  assert.doesNotMatch(JSON.stringify(refused), /PRIVATE KEY/);

  const unregistered = await reportGa4(ENV, fakeFetch({ scenes: { error: { message: "Field customEvent:case_no is not a valid dimension." } } }).impl);
  assert.match(unregistered.lines.join("\n"), /맞춤 측정기준 `case_no`·`scene_no`가 아직 등록되지 않았습니다/);
  assert.deepEqual(unregistered.warnings, [], "an unregistered dimension is a step for the owner, not a failure");

  const broken = await reportGa4(ENV, fakeFetch({ weekly: { error: { message: "User does not have sufficient permissions for this property." } } }).impl);
  assert.match(broken.lines.join("\n"), /주별 표를 읽지 못했습니다: 400 User does not have sufficient permissions/);
  assert.equal(broken.warnings.length, 1);
});
