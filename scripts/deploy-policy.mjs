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
