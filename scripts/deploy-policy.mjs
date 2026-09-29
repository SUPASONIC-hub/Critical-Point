/**
 * What a deployed page is allowed to be, as pure functions: `check-deploy.mjs`
 * applies them to the live response, and to `render.yaml` and `dist/index.html`
 * offline; `unit-tests.mjs` pins the parsing. No network and no filesystem here.
 *
 * The header used to be checked for presence only, so a CSP of
 * `script-src * 'unsafe-inline'` would have passed. The value is what protects
 * the page, so the value is what gets checked.
 */

/** `"a b; c d"` -> Map { a => ["b"], c => ["d"] }. Directive names are case-insensitive. */
export function parseCsp(value) {
  const directives = new Map();
  for (const part of String(value ?? "").split(";")) {
    const [name, ...sources] = part.trim().split(/\s+/).filter(Boolean);
    if (name && !directives.has(name.toLowerCase())) directives.set(name.toLowerCase(), sources);
  }
  return directives;
}

const WILDCARDS = new Set(["*", "https:", "http:", "data:", "blob:"]);

/** Every way `value` falls short of the policy; empty when it holds. */
export function cspProblems(value) {
  const csp = parseCsp(value);
  const problems = [];
  const effective = (name) => csp.get(name) ?? csp.get("default-src") ?? null;

  const scripts = effective("script-src");
  if (!scripts) {
    problems.push("no script-src or default-src, so any script runs");
  } else {
    for (const source of scripts) {
      const lower = source.toLowerCase();
      if (lower === "'unsafe-inline'" || lower === "'unsafe-eval'" || lower === "'unsafe-hashes'") {
        problems.push(`script-src allows ${source}`);
      } else if (WILDCARDS.has(lower) || lower.includes("*")) {
        problems.push(`script-src allows scripts from ${source}`);
      }
    }
  }
  if (effective("object-src")?.join(" ") !== "'none'") {
    problems.push("object-src is not 'none'");
  }
  if (!csp.has("base-uri")) problems.push("no base-uri, so an injected <base> can re-point every relative script");
  if (!csp.has("frame-ancestors")) problems.push("no frame-ancestors, so the page can be framed");
  for (const name of ["img-src", "font-src", "connect-src", "default-src"]) {
    for (const source of csp.get(name) ?? []) {
      if (source === "*" || source === "https:" || source === "http:") {
        problems.push(`${name} allows any origin (${source})`);
      }
    }
  }
  return problems;
}

/**
 * Hosts written with a wildcard, where the page is allowed to send data.
 *
 * `connect-src https://*.supabase.co` names every project on the platform, so
 * a script that did get to run could post a player's save to a project of its
 * own and the policy would wave it through. `render.yaml` has to say it that
 * way -- the project's address is not in the repository -- so this is asked of
 * the live header, which the dashboard is meant to have narrowed, and only
 * reported for the file.
 */
export function wildcardHostProblems(value) {
  const csp = parseCsp(value);
  const problems = [];
  for (const name of ["connect-src", "form-action"]) {
    for (const source of csp.get(name) ?? []) {
      if (source.includes("*") && source !== "*") {
        problems.push(`${name} names a wildcard host (${source}); name the one origin the app calls`);
      }
    }
  }
  return problems;
}

/**
 * Inline script the policy above would block -- which, once `'unsafe-inline'`
 * is gone, means a page that silently stops working rather than an XSS hole.
 * Data blocks (`application/json`, `application/ld+json`) are not executed and
 * CSP does not govern them.
 */
export function inlineScriptProblems(html) {
  const problems = [];
  const text = String(html ?? "");
  for (const match of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const [, attributes, body] = match;
    const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attributes)?.[1]?.toLowerCase() ?? "";
    if (/\bsrc\s*=/i.test(attributes) || type === "application/json" || type === "application/ld+json") continue;
    if (body.trim()) problems.push(`inline <script${attributes}> (${body.trim().slice(0, 40)}...)`);
  }
  for (const match of text.matchAll(/<[a-z][^>]*?\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi)) {
    problems.push(`inline ${match[1]} handler: ${match[0].slice(0, 80)}`);
  }
  for (const match of text.matchAll(/\b(?:href|src|action)\s*=\s*["']?\s*javascript:/gi)) {
    problems.push(`javascript: URL: ${match[0]}`);
  }
  return problems;
}

/** The Content-Security-Policy value `render.yaml` declares for `/*`. */
export function readRenderYamlCsp(yaml) {
  const match = /name:\s*Content-Security-Policy\s*\n\s*value:\s*(["']?)(.+?)\1\s*$/im.exec(String(yaml ?? ""));
  return match ? match[2] : null;
}

/** Every header `render.yaml` declares: `[{ path, name, value }]`, names lower-cased. */
export function readRenderYamlHeaders(yaml) {
  const headers = [];
  const pattern = /-\s*path:\s*(\S+)\s*\n\s*name:\s*(\S+)\s*\n\s*value:\s*(["']?)(.+?)\3\s*$/gim;
  for (const match of String(yaml ?? "").matchAll(pattern)) {
    headers.push({ path: match[1], name: match[2].toLowerCase(), value: match[4] });
  }
  return headers;
}

/** The headers every page is served with, and what each has to say. */
const SITE_HEADERS = [
  ["x-content-type-options", (value) => (/^nosniff$/i.test(value.trim()) ? null : "is not nosniff")],
  ["referrer-policy", (value) => (/unsafe-url|no-referrer-when-downgrade/i.test(value) ? "sends the full address to other origins" : null)],
  ["content-security-policy", () => null],
  // A browser that has seen this asks for https from then on. A year at least:
  // anything shorter lapses between two visits of an occasional player.
  ["strict-transport-security", (value) => {
    const seconds = Number(/max-age\s*=\s*"?(\d+)/i.exec(value)?.[1] ?? 0);
    return seconds >= 31536000 ? null : `max-age is ${seconds}s; a year (31536000) at least`;
  }],
  // A page that opened this one, or that this one opened, gets no handle on it.
  ["cross-origin-opener-policy", (value) => (/^same-origin(-allow-popups)?$/i.test(value.trim()) ? null : "is not same-origin")],
  // What the app has no use for, switched off by name: a script that ran would
  // have to ask, and the browser would refuse.
  ["permissions-policy", (value) => {
    const off = new Set([...value.matchAll(/([a-z-]+)\s*=\s*\(\s*\)/gi)].map((match) => match[1].toLowerCase()));
    const missing = ["camera", "microphone", "geolocation", "payment", "usb"].filter((feature) => !off.has(feature));
    return missing.length ? `leaves ${missing.join(", ")} on` : null;
  }],
];

/** `getHeader(name)` returns the served value or null. Every header that is missing or says too little. */
export function siteHeaderProblems(getHeader) {
  const problems = [];
  for (const [name, judge] of SITE_HEADERS) {
    const value = getHeader(name);
    if (!value) {
      problems.push(`${name} is missing`);
      continue;
    }
    const problem = judge(String(value));
    if (problem) problems.push(`${name} ${problem}`);
  }
  return problems;
}

const maxAge = (value, directive) => {
  const match = new RegExp(`(?:^|[,\\s])${directive}\\s*=\\s*"?(\\d+)`, "i").exec(String(value ?? ""));
  return match ? Number(match[1]) : null;
};

/**
 * The shell must be asked for again on every visit, by the browser and by any
 * cache in between: it is the one file that names the fingerprinted ones, so a
 * stale copy points at assets a deploy has already replaced.
 */
export function shellCacheProblems(value) {
  const text = String(value ?? "").toLowerCase();
  if (!text.trim()) return ["the page is served with no Cache-Control"];
  if (/\bno-store\b/.test(text)) return [];
  const problems = [];
  const browser = maxAge(text, "max-age");
  const shared = maxAge(text, "s-maxage");
  if (!/\bno-cache\b/.test(text) && browser !== 0) problems.push(`the page may be reused without asking (${value}); serve no-cache`);
  if (shared !== null && shared > 0) problems.push(`the page is held by shared caches for ${shared}s (${value}), so a deploy is not seen until then`);
  return problems;
}

/** A fingerprinted file never changes behind its name, so it is kept for a year and never asked about. */
export function assetCacheProblems(value) {
  const text = String(value ?? "").toLowerCase();
  const browser = maxAge(text, "max-age");
  const problems = [];
  if (browser === null || browser < 31536000) problems.push(`a fingerprinted asset is kept for ${browser ?? 0}s (${value || "no Cache-Control"}); serve max-age=31536000`);
  if (!/\bimmutable\b/.test(text)) problems.push(`a fingerprinted asset is not immutable (${value || "no Cache-Control"}), so every visit asks about it again`);
  return problems;
}

/** The first fingerprinted file the page links, as a path: `/assets/index-abc123.js`. */
export function firstAssetPath(html) {
  const match = /\b(?:src|href)\s*=\s*["'](?:https?:\/\/[^"'/]+)?(\/assets\/[^"'?#]+-[A-Za-z0-9_-]{6,}\.(?:js|css|woff2))["']/i.exec(String(html ?? ""));
  return match ? match[1] : null;
}

/**
 * What `render.yaml` has to declare, so the written record and the checks
 * agree on what the dashboard is meant to be set to.
 */
export function renderYamlHeaderProblems(yaml) {
  const headers = readRenderYamlHeaders(yaml);
  const find = (path, name) => headers.find((header) => header.path === path && header.name === name)?.value ?? null;
  const problems = siteHeaderProblems((name) => find("/*", name)).map((problem) => `/*: ${problem}`);
  for (const path of ["/", "/index.html"]) {
    problems.push(...shellCacheProblems(find(path, "cache-control")).map((problem) => `${path}: ${problem}`));
  }
  problems.push(...assetCacheProblems(find("/assets/*", "cache-control")).map((problem) => `/assets/*: ${problem}`));
  return problems;
}
