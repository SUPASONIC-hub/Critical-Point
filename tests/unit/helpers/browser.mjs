import { registerHooks } from "node:module";

/**
 * The three things the network modules take from a browser, stood in for so
 * they can be run by `node --test`: storage, the connection, and `fetch`.
 *
 * `src/telemetry.js` decides at import whether there is a server at all, from
 * `import.meta.env` and -- in a dev build -- from two storage keys. Node has no
 * `import.meta.env`, so a load hook gives that one module a dev environment,
 * and `installBrowser` writes the keys. Both have to happen before the module
 * is loaded, which is why the tests import what they test with `await import`.
 */
export const TEST_SERVER = "https://unit.supabase.test";

registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (!/\/src\/telemetry\.js(\?|$)/.test(url) || result.source == null) return result;
    return { ...result, source: String(result.source).replaceAll("import.meta.env", "({ DEV: true })") };
  },
});

export function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    unavailable: false,
    getItem(key) {
      if (this.unavailable) throw new Error("storage unavailable");
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (this.unavailable) throw new Error("storage unavailable");
      values.set(key, String(value));
    },
    removeItem(key) {
      if (this.unavailable) throw new Error("storage unavailable");
      values.delete(key);
    },
    clear() {
      values.clear();
    },
  };
}

const jsonResponse = (status, body) =>
  new globalThis.Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** What PostgREST answers when a trigger or a function raises. */
export const refusal = (status, message, code = "P0001") => jsonResponse(status, { code, message, details: null, hint: null });
/** What PostgREST answers when the database has no such function, or none with those arguments. */
export const missingFunction = (name) =>
  jsonResponse(404, { code: "PGRST202", message: `Could not find the function public.${name} in the schema cache`, details: null, hint: null });
export const ok = (body, status = 200) => jsonResponse(status, body);

/**
 * Installs the stand-ins on `globalThis` and returns the handles a test drives:
 * `storage`, `calls` (every request made, newest last), `respond(path, handler)`
 * to script an endpoint, and `setOnline`.
 */
export function installBrowser({ storage = {}, online = true } = {}) {
  const localStorage = createStorage({
    "critical-point-telemetry-url": TEST_SERVER,
    "critical-point-telemetry-key": "unit-test-key",
    ...storage,
  });
  const handlers = [];
  const calls = [];
  const connection = { onLine: online };

  Object.defineProperty(globalThis, "localStorage", { value: localStorage, configurable: true, writable: true });
  Object.defineProperty(globalThis, "navigator", { value: connection, configurable: true, writable: true });
  globalThis.fetch = async (url, options = {}) => {
    const path = String(url).replace(TEST_SERVER, "");
    const body = typeof options.body === "string" ? JSON.parse(options.body) : null;
    const call = { path, method: options.method ?? "GET", body };
    calls.push(call);
    const handler = handlers.find((entry) => path.startsWith(entry.path));
    if (!handler) throw new TypeError(`fetch failed: no handler for ${path}`);
    return handler.respond(call);
  };

  return {
    storage: localStorage,
    calls,
    /** Newest registration wins, so a test can replace an answer part-way. */
    respond(path, respond) {
      handlers.unshift({ path, respond: typeof respond === "function" ? respond : () => respond.clone() });
    },
    callsTo(path) {
      return calls.filter((call) => call.path.startsWith(path));
    },
    setOnline(value) {
      connection.onLine = value;
    },
  };
}
