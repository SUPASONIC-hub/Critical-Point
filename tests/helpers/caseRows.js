/**
 * The case rows a page posts to playtest_sessions, read the way the server
 * reads them (F1 phase 3, S3/S7). Shared by the e2e specs and the unit test of
 * the case-open snapshot (tests/unit/case-open.test.mjs), so both measure a
 * row's `dynamics` with the same ruler.
 */

/** The server's cap on a case row's `dynamics`, as jsonb text (20261026000000). */
export const SERVER_DYNAMICS_BYTES = 6144;

/** `value` as Postgres prints jsonb: `": "` after a key and `", "` between items. */
export function jsonbText(value) {
  if (Array.isArray(value)) return `[${value.map(jsonbText).join(", ")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => `${JSON.stringify(key)}: ${jsonbText(item)}`).join(", ")}}`;
  return JSON.stringify(value);
}

/** The bytes of `value` as jsonb text: what the server's size check counts. */
export const jsonbBytes = (value) => new TextEncoder().encode(jsonbText(value)).length;

/**
 * Answers every request to the mock backend at `origin` and collects each
 * playtest_sessions row the page posts (a batch is spread into its rows).
 */
export async function collectPostedRows(page, origin) {
  const posted = [];
  // Playwright tries the most recently added route first, so the catch-all goes in first.
  await page.route(`${origin}/**`, (route) => route.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
  await page.route(`${origin}/rest/v1/playtest_sessions**`, async (route) => {
    if (route.request().method() === "POST") posted.push(...[route.request().postDataJSON()].flat());
    await route.fulfill({ status: 201, contentType: "application/json", body: "" });
  });
  return posted;
}
