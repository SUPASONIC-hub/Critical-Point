import { expect, test as base } from "@playwright/test";

/**
 * No test talks to anything but this machine.
 *
 * The specs stub their backend at one made-up origin. Until this fixture the
 * only thing keeping the suite off a real one was that nobody had a `.env`: the
 * app reads `VITE_SUPABASE_URL` before the address a spec writes to storage, so
 * with a developer's `.env.local` in place the ranking, board and telemetry
 * tests would have written to the live project. `run-e2e.mjs` blanks those
 * variables for the server it starts; this is the other half, and it holds for
 * a server started by hand too.
 *
 * Every request a page makes is one of three things:
 *   - this machine (the app, its assets): let through;
 *   - the stub origin: answered here with an empty backend, unless the spec
 *     routes it itself -- a page route is asked before a context route;
 *   - anything else: refused, recorded, and the test that made it fails. That
 *     also holds the rule that the app loads no font and no script from a CDN.
 *
 * A spec imports `test` and `expect` from here instead of from Playwright. A
 * test that builds its own context calls `guardNetwork` on it.
 */
export const BACKEND_ORIGIN = "https://e2e.supabase.co";

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]"]);

function kindOf(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return "stray";
  }
  if (["data:", "blob:", "about:"].includes(parsed.protocol)) return "local";
  if (LOCAL_HOSTS.has(parsed.hostname)) return "local";
  if (parsed.origin === BACKEND_ORIGIN) return "backend";
  return "stray";
}

/** What an empty backend answers: no rows to a read, created to a write, null to an RPC. */
async function answerAsEmptyBackend(route) {
  const request = route.request();
  const headers = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" };
  if (request.method() === "OPTIONS") return route.fulfill({ status: 204, headers });
  if (request.method() === "GET" || request.method() === "HEAD") {
    return route.fulfill({ status: 200, headers, contentType: "application/json", body: "[]" });
  }
  if (new URL(request.url()).pathname.includes("/rpc/")) {
    return route.fulfill({ status: 200, headers, contentType: "application/json", body: "null" });
  }
  return route.fulfill({ status: 201, headers, contentType: "application/json", body: "" });
}

/** Installs the guard on a context; returns the list the refused requests are written to. */
export async function guardNetwork(context) {
  const strays = [];
  await context.route(
    (url) => kindOf(url.href) !== "local",
    async (route) => {
      const url = route.request().url();
      if (kindOf(url) === "backend") return answerAsEmptyBackend(route);
      strays.push(`${route.request().method()} ${url}`);
      return route.abort("blockedbyclient");
    },
  );
  return strays;
}

export function expectNoStrayRequests(strays) {
  expect(strays, `the page asked for something outside this machine:\n${strays.join("\n")}`).toEqual([]);
}

export const test = base.extend({
  context: async ({ context }, use) => {
    const strays = await guardNetwork(context);
    await use(context);
    expectNoStrayRequests(strays);
  },
});

export { expect };
