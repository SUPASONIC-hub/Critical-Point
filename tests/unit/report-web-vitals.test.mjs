import assert from "node:assert/strict";
import { createVerify, generateKeyPairSync } from "node:crypto";
import { test } from "node:test";

/**
 * N28: the weekly phone speed line (scripts/report-web-vitals.mjs) over the
 * GA Data API (scripts/ga4-data-api.mjs). No network: `fetch` is handed in.
 */
const ga = await import("../../scripts/ga4-data-api.mjs");
const vitals = await import("../../scripts/report-web-vitals.mjs");

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const KEY = { type: "service_account", client_email: "reader@example.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }) };
const ENV = { GA4_SA_KEY: JSON.stringify(KEY), GA4_PROPERTY_ID: "123456789" };

const json = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const report = (dims, mets, rows) => ({
  dimensionHeaders: dims.map((name) => ({ name })),
  metricHeaders: mets.map((name) => ({ name })),
  rows: rows.map((row) => ({ dimensionValues: row.slice(0, dims.length).map((value) => ({ value })), metricValues: row.slice(dims.length).map((value) => ({ value })) })),
});

test("the env: both secrets or a named skip; a malformed one is an error that never echoes the key", () => {
  assert.deepEqual(ga.readGa4Env({}), { missing: ["GA4_SA_KEY", "GA4_PROPERTY_ID"] });
  assert.deepEqual(ga.readGa4Env({ GA4_SA_KEY: "x" }), { missing: ["GA4_PROPERTY_ID"] });
  const read = ga.readGa4Env({ ...ENV, GA4_PROPERTY_ID: "properties/123456789" });
  assert.equal(read.propertyId, "123456789");
  assert.deepEqual(Object.keys(read.key), ["client_email", "private_key"]);
  assert.equal(ga.readGa4Env({ ...ENV, GA4_SA_KEY: Buffer.from(ENV.GA4_SA_KEY).toString("base64") }).key.client_email, KEY.client_email);
  assert.throws(() => ga.readGa4Env({ ...ENV, GA4_PROPERTY_ID: "G-ABC1234" }), /property's number/);
  assert.throws(() => ga.readGa4Env({ ...ENV, GA4_SA_KEY: "{not json" }), (error) => /neither/.test(error.message) && !error.message.includes("not json"));
  assert.throws(() => ga.readGa4Env({ ...ENV, GA4_SA_KEY: JSON.stringify({ client_email: "a" }) }), /not a service account/);
});

test("the JWT is RS256, read-only scope, ten minutes, and verifies with the account's public key", () => {
  const jwt = ga.serviceAccountJwt(KEY, 1_800_000_000);
  const [header, claims, signature] = jwt.split(".");
  assert.deepEqual(JSON.parse(Buffer.from(header, "base64url")), { alg: "RS256", typ: "JWT" });
  assert.deepEqual(JSON.parse(Buffer.from(claims, "base64url")), { iss: KEY.client_email, scope: ga.GA4_SCOPE, aud: ga.TOKEN_URL, iat: 1_800_000_000, exp: 1_800_000_600 });
  const verify = createVerify("RSA-SHA256");
  verify.update(`${header}.${claims}`);
  assert.ok(verify.verify(publicKey, Buffer.from(signature, "base64url")));
});

test("rowsOf keys a report's rows by its headers", () => {
  assert.deepEqual(ga.rowsOf(report(["eventName"], ["eventCount"], [["cp_lcp", "4"]])), [{ eventName: "cp_lcp", eventCount: "4" }]);
  assert.deepEqual(ga.rowsOf({}), []);
});

test("p75 by nearest rank over a histogram", () => {
  assert.equal(vitals.weightedQuantile([]), null);
  assert.equal(vitals.weightedQuantile([[100, 1], [200, 1], [300, 1], [400, 1]]), 300);
  assert.equal(vitals.weightedQuantile([[1000, 3], [5000, 1]]), 1000);
  assert.equal(vitals.weightedQuantile([[1000, 2], [5000, 2]]), 5000);
  assert.equal(vitals.weightedQuantile([[Number.NaN, 5], [-1, 5], [700, 0], [800, 1]]), 800);
});

test("the histogram reads per device and for all, and flags what is past the line", () => {
  const rows = ga.rowsOf(
    report(["eventName", "deviceCategory", "customEvent:value"], ["eventCount"], [
      ["cp_lcp", "mobile", "1800", "6"],
      ["cp_lcp", "mobile", "3200", "4"],
      ["cp_lcp", "desktop", "900", "10"],
      ["cp_inp", "mobile", "120", "3"],
      ["cp_inp", "smart tv", "400", "1"],
      ["cp_inp", "mobile", "(not set)", "9"],
      ["page_view", "mobile", "1", "99"],
    ]),
  );
  const read = vitals.readHistogram(rows);
  assert.equal(read.method, "p75");
  assert.deepEqual(read.lcp.mobile, { value: 3200, n: 10 });
  assert.deepEqual(read.lcp.desktop, { value: 900, n: 10 });
  assert.deepEqual(read.lcp.all, { value: 1800, n: 20 });
  assert.deepEqual(read.inp.desktop, { value: 400, n: 1 });
  assert.deepEqual(read.inp.tablet, { value: null, n: 0 });
  assert.equal(vitals.overLine("lcp", read.lcp.mobile), true);
  assert.equal(vitals.overLine("inp", read.inp.mobile), false);
  assert.equal(vitals.overLine("inp", { value: 201, n: 1 }), true);
  assert.equal(vitals.overLine("lcp", { value: null, n: 0 }), false);
  assert.equal(vitals.headline({ ...read }), "폰 속도: LCP p75 3.20s · INP p75 120ms — ⚠ 기준 넘음(LCP) (지난 7일, 표본 10·3)");
});

test("the mean fallback, and the line that says it is a mean", () => {
  const rows = ga.rowsOf(report(["eventName", "deviceCategory"], ["eventCount", "eventValue"], [["cp_lcp", "mobile", "4", "8000"], ["cp_inp", "mobile", "2", "500"], ["cp_inp", "desktop", "2", "100"]]));
  const read = vitals.readMeans(rows);
  assert.equal(read.method, "mean");
  assert.deepEqual(read.lcp.mobile, { value: 2000, n: 4 });
  assert.deepEqual(read.inp.mobile, { value: 250, n: 2 });
  assert.deepEqual(read.inp.all, { value: 150, n: 4 });
  assert.deepEqual(read.lcp.tablet, { value: null, n: 0 });
  assert.equal(vitals.headline(read), "폰 속도: LCP 평균 2.00s · INP 평균 250ms — ⚠ 기준 넘음(INP) (지난 7일, 표본 4·2)");
  const text = vitals.describeVitals([{ ...vitals.WEEKS[0], ...read }]);
  assert.match(text, /평균\(p75는 GA 맞춤 측정기준 `value` 등록 뒤\)/);
  assert.match(text, /\| 지난 7일 \| 폰 \| 2\.00s \(4, 적음\) \| 250ms ⚠ \(2, 적음\) \|/);
  assert.match(text, /\| 지난 7일 \| PC \| — \| 50ms \(2, 적음\) \|/);
  assert.doesNotMatch(text, /태블릿/);
  assert.equal(vitals.headline(vitals.readMeans([])), "폰 속도: 지난 7일 폰 표본 없음");
});

test("the requests ask only for the two events, per week", () => {
  const request = vitals.histogramRequest(vitals.WEEKS[1]);
  assert.deepEqual(request.dateRanges, [{ startDate: "14daysAgo", endDate: "8daysAgo" }]);
  assert.deepEqual(request.dimensionFilter.filter.inListFilter.values, ["cp_lcp", "cp_inp"]);
  assert.ok(request.dimensions.some((dimension) => dimension.name === "customEvent:value"));
  assert.ok(!vitals.meanRequest(vitals.WEEKS[0]).dimensions.some((dimension) => dimension.name === "customEvent:value"));
});

/** A fake Google: the token endpoint and runReport, with or without the `value` dimension. */
function fakeGoogle({ valueDimension = true, tokenStatus = 200 } = {}) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, body: init.body, auth: init.headers.authorization });
    if (url === ga.TOKEN_URL) return tokenStatus === 200 ? json(200, { access_token: "tok" }) : json(tokenStatus, { error: "invalid_grant", error_description: "Invalid JWT Signature." });
    const request = JSON.parse(init.body);
    const wantsValue = request.dimensions.some((dimension) => dimension.name === "customEvent:value");
    if (wantsValue && !valueDimension) return json(400, { error: { code: 400, message: "Field customEvent:value is not a valid dimension." } });
    if (wantsValue) return json(200, report(["eventName", "deviceCategory", "customEvent:value"], ["eventCount"], [["cp_lcp", "mobile", "2100", "30"], ["cp_inp", "mobile", "90", "25"]]));
    return json(200, report(["eventName", "deviceCategory"], ["eventCount", "eventValue"], [["cp_lcp", "mobile", "3", "9000"]]));
  };
  return { fetch, calls };
}

test("the whole run: token, two weeks of p75, under the lines, no warning", async () => {
  const google = fakeGoogle();
  const result = await vitals.report(ENV, { fetch: google.fetch });
  assert.equal(result.warn, null);
  assert.match(result.text, /\*\*폰 속도: LCP p75 2\.10s · INP p75 90ms — 기준 안 \(지난 7일, 표본 30·25\)\*\*/);
  assert.match(result.text, /\| 그 전 7일 \| 폰 \| 2\.10s \(30\) \| 90ms \(25\) \|/);
  assert.equal(google.calls.length, 3);
  assert.equal(google.calls[0].url, ga.TOKEN_URL);
  assert.match(google.calls[1].url, /\/v1beta\/properties\/123456789:runReport$/);
  assert.equal(google.calls[1].auth, "Bearer tok");
  assert.equal(result.json.weeks.length, 2);
  // The key is never in anything printed.
  assert.ok(!JSON.stringify(result).includes("PRIVATE KEY"));
});

test("without the value dimension it falls back to the mean once, and warns past the line", async () => {
  const google = fakeGoogle({ valueDimension: false });
  const result = await vitals.report(ENV, { fetch: google.fetch });
  assert.equal(google.calls.length, 4, "token, a refused histogram, then two means: the histogram is not asked again");
  assert.match(result.text, /LCP 평균 3\.00s/);
  assert.equal(result.warn, "폰 속도: LCP 평균 3.00s · INP 평균 — — ⚠ 기준 넘음(LCP) (지난 7일, 표본 3·0)");
  assert.equal(result.json.weeks[0].method, "mean");
});

test("missing secrets skip, and failures say the status, never throw", async () => {
  let asked = false;
  const skipped = await vitals.report({}, {
    fetch: async () => {
      asked = true;
    },
  });
  assert.equal(asked, false);
  assert.match(skipped.text, /GA4_SA_KEY·GA4_PROPERTY_ID 없음 — GA를 읽지 않음/);
  assert.equal(skipped.warn, null);

  const bad = await vitals.report({ ...ENV, GA4_PROPERTY_ID: "G-ABC1234" }, { fetch: async () => assert.fail("no request") });
  assert.match(bad.text, /읽지 않음: GA4_PROPERTY_ID must be/);

  const denied = await vitals.report(ENV, { fetch: fakeGoogle({ tokenStatus: 400 }).fetch });
  assert.match(denied.text, /GA 읽기 실패: GA token: HTTP 400 -- Invalid JWT Signature\./);
  assert.ok(!denied.text.includes("PRIVATE KEY"));

  const htmlPage = {
    ok: false,
    status: 503,
    json: async () => {
      throw new SyntaxError("html");
    },
  };
  const notJson = await vitals.report(ENV, { fetch: async (url) => (url === ga.TOKEN_URL ? json(200, { access_token: "t" }) : htmlPage) });
  assert.match(notJson.text, /GA runReport: HTTP 503\n/);

  const noToken = await vitals.report(ENV, { fetch: async () => json(200, {}) });
  assert.match(noToken.text, /no access_token/);
});

test("a 400 that is about the value dimension is told apart from other errors", () => {
  assert.equal(vitals.missingValueDimension({ status: 400, reason: "Field customEvent:value is not a valid dimension." }), true);
  assert.equal(vitals.missingValueDimension({ status: 403, reason: "customEvent:value" }), false);
  assert.equal(vitals.missingValueDimension({ status: 400, reason: "Quota exceeded" }), false);
  assert.equal(vitals.missingValueDimension(null), false);
});
