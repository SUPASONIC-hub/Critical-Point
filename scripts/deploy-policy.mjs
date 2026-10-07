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
const isWide = (source) => WILDCARDS.has(source.toLowerCase()) || source.includes("*");

/** Every way `value` falls short of the policy; empty when it holds. */
export function cspProblems(value) {
  const csp = parseCsp(value);
  const problems = [];
  const effective = (name) => csp.get(name) ?? csp.get("default-src") ?? null;

  if (!effective("script-src")) problems.push("no script-src or default-src, so any script runs");
  // `script-src-elem` and `script-src-attr` are what a browser reads for a
  // <script> and for an inline handler when they are there, in place of
  // `script-src`: a policy with a strict `script-src` and a loose
  // `script-src-elem` beside it runs anything, and used to pass.
  for (const name of ["script-src", "script-src-elem", "script-src-attr"]) {
    for (const source of (name === "script-src" ? effective(name) : csp.get(name)) ?? []) {
      const lower = source.toLowerCase();
      if (lower === "'unsafe-inline'" || lower === "'unsafe-eval'" || lower === "'unsafe-hashes'") {
        problems.push(`${name} allows ${source}`);
      } else if (isWide(source)) {
        problems.push(`${name} allows scripts from ${source}`);
      }
    }
  }
  if (effective("object-src")?.join(" ") !== "'none'") {
    problems.push("object-src is not 'none'");
  }
  // By what they say, like the rest: `base-uri *` and `frame-ancestors *` are
  // both there and both mean the same as leaving them out.
  if (!csp.has("base-uri")) problems.push("no base-uri, so an injected <base> can re-point every relative script");
  for (const source of (csp.get("base-uri") ?? []).filter(isWide)) {
    problems.push(`base-uri allows ${source}, so an injected <base> can re-point every relative script`);
  }
  if (!csp.has("frame-ancestors")) problems.push("no frame-ancestors, so the page can be framed");
  for (const source of (csp.get("frame-ancestors") ?? []).filter(isWide)) {
    problems.push(`frame-ancestors allows ${source}, so the page can be framed`);
  }
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

/**
 * What the app has no use for, and render.yaml's Permissions-Policy switches
 * off by name. All of them are asked of the live header: five were, so the
 * other twelve could be lost on the way into the dashboard and nothing said
 * so. A unit test holds this list to the file's.
 */
export const PERMISSIONS_OFF = [
  "accelerometer",
  "bluetooth",
  "browsing-topics",
  "camera",
  "display-capture",
  "encrypted-media",
  "geolocation",
  "gyroscope",
  "hid",
  "magnetometer",
  "microphone",
  "midi",
  "payment",
  "publickey-credentials-get",
  "serial",
  "usb",
  "xr-spatial-tracking",
];

/** The features a Permissions-Policy value switches off for everyone: `name=()`. */
export function permissionsSwitchedOff(value) {
  return [...String(value ?? "").matchAll(/([a-z-]+)\s*=\s*\(\s*\)/gi)].map((match) => match[1].toLowerCase());
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
    const off = new Set(permissionsSwitchedOff(value));
    const missing = PERMISSIONS_OFF.filter((feature) => !off.has(feature));
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
 * The scene art, the portraits and the key visual are served from the root
 * under names that do not change when the picture does (`public/`, not
 * `assets/`). So they are neither of the two cases above: kept for a year, a
 * replaced picture would never arrive; asked about on every visit -- which is
 * what the host's default of `max-age=0` does -- thirty-odd images are
 * thirty-odd round trips before a returning player sees the first scene. A day
 * is the middle: at least an hour, at most thirty days, and never `immutable`.
 */
export function rootImageCacheProblems(value) {
  const text = String(value ?? "").toLowerCase();
  const browser = maxAge(text, "max-age");
  const problems = [];
  if (browser === null || browser < 3600) {
    problems.push(`an image served from the root is kept for ${browser ?? 0}s (${value || "no Cache-Control"}), so it is asked about again on every visit; serve max-age=86400`);
  } else if (browser > 2592000) {
    problems.push(`an image served from the root is kept for ${browser}s (${value}); its name does not change with its content, so a replaced picture would not arrive`);
  }
  if (/\bimmutable\b/.test(text)) problems.push(`an image served from the root is marked immutable (${value}), and its name does not change with its content`);
  return problems;
}

/**
 * `/sw.js` is asked for by one fixed name and says which release a device
 * keeps, so it is held to what the page is: asked for again every time. A
 * browser does that for a worker on its own; a cache in front of the site
 * does not, and one that keeps the file for five minutes has devices
 * installing the release before this one for five minutes after a deploy.
 */
export const WORKER_PATH = "/sw.js";

export function workerCacheProblems(value) {
  return shellCacheProblems(value).map((problem) => problem.replace(/^the page\b/, "the service worker"));
}

/** The rules render.yaml declares that policy under: the two formats in `public/`, and the icons. */
export const ROOT_IMAGE_PATHS = ["/*.webp", "/*.jpg", "/icons/*"];

/** The first image the page names at the root, as a path: `/triggerlab-key-visual-480.webp`. */
export function firstRootImagePath(html) {
  const match = /["'\s,](\/[A-Za-z0-9._-]+\.(?:webp|jpe?g))(?=["'\s,?#])/i.exec(String(html ?? ""));
  return match ? match[1] : null;
}

/**
 * One file the page names for each of those rules: `[{ rule, path }]`, with a
 * null path where it names none. The live check used to read the first image
 * alone, which on a release is a `.webp` -- so `/*.jpg` and `/icons/*` could
 * be missing from the dashboard for good and no warning ever said so.
 *
 * A name written with its origin counts: a release's `og:image` is absolute
 * (`absoluteSiteUrls`, vite.config.js) and is the one `.jpg` the page names.
 */
export function rootImageSamples(html) {
  const text = String(html ?? "");
  const named = (file) => new RegExp(`["'\\s,](?:https?://[^"'\\s,/]+)?(/${file})(?=["'\\s,?#])`, "i").exec(text)?.[1] ?? null;
  return [
    { rule: "/*.webp", path: named("[A-Za-z0-9._-]+\\.webp") },
    { rule: "/*.jpg", path: named("[A-Za-z0-9._-]+\\.jpg") },
    { rule: "/icons/*", path: named("icons/[A-Za-z0-9._-]+") },
  ];
}

/** The script the page starts from, as a path: `/assets/index-abc123.js`. */
export function entryScriptPath(html) {
  for (const match of String(html ?? "").matchAll(/<script\b([^>]*)>/gi)) {
    if (!/\btype\s*=\s*["']?module/i.test(match[1])) continue;
    const src = /\bsrc\s*=\s*["'](?:https?:\/\/[^"'/]+)?(\/[^"'?#]+\.js)["']/i.exec(match[1])?.[1];
    if (src) return src;
  }
  return null;
}

/**
 * Was this release built with the backend it is allowed to talk to?
 *
 * The build reads `VITE_SUPABASE_URL` from the host's environment and writes
 * it into the entry script; when the variable is missing the app runs with
 * telemetry, the ranking, the board and online save switched off and says
 * nothing (render.yaml, `envVars`). Every header is then still correct, so a
 * service rebuilt without its keys passed this check with half the game gone.
 *
 * The page's own `connect-src` names the origin the app may call, so the
 * script has to contain it. A wildcard host (`https://*.supabase.co`, which
 * is all render.yaml can say) is matched as a pattern.
 */
export function backendOriginProblems(script, cspValue) {
  const origins = (parseCsp(cspValue).get("connect-src") ?? []).filter((source) => /^https:\/\/[^/]+$/i.test(source));
  if (origins.length === 0) return ["connect-src names no backend origin, so there is nothing to look for in the entry script"];
  const text = String(script ?? "");
  const named = origins.some((origin) => {
    const pattern = origin.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[A-Za-z0-9-]+");
    return new RegExp(pattern, "i").test(text);
  });
  return named
    ? []
    : [
        `the entry script names none of the origins connect-src allows (${origins.join(", ")}): the release was built without VITE_SUPABASE_URL, ` +
          "or for another project, so telemetry, the ranking, the board and online save are off",
      ];
}

/**
 * The backend's address in a chunk that is not the entry script, for the
 * check that runs before a deploy. `scripts` is `[[path, text]]` for every
 * script the build holds.
 *
 * The live check reads the entry script and fails a release that does not
 * name its backend. Offline the same finding is only a note -- a desktop
 * build with no `.env.local` has no backend and is a correct build -- so a
 * change to how the bundle is split that moved the address out of the entry
 * script passed every check before the merge and turned Deploy red after it.
 * A build that names its backend somewhere else is that case, and it is told
 * apart from a build that names none.
 */
export function backendPlacementProblems(entryPath, scripts, cspValue) {
  const names = (text) => backendOriginProblems(text, cspValue).length === 0;
  const entry = scripts.find(([file]) => file === entryPath);
  if (!entry || names(entry[1])) return [];
  const elsewhere = scripts.filter(([file, text]) => file !== entryPath && names(text)).map(([file]) => file);
  if (elsewhere.length === 0) return [];
  return [
    `the backend's address is in ${elsewhere.join(", ")} and not in the entry script ${entryPath}: ` +
      "the check after a deploy reads the entry script alone and would fail this release",
  ];
}

/**
 * What `render.yaml` has to declare, so the written record and the checks
 * agree on what the dashboard is meant to be set to. Every rule in the file
 * is asked for here: a line that could be deleted without this noticing is a
 * line the dashboard can lose the same way.
 */
export function renderYamlHeaderProblems(yaml) {
  const headers = readRenderYamlHeaders(yaml);
  const find = (path, name) => headers.find((header) => header.path === path && header.name === name)?.value ?? null;
  const problems = siteHeaderProblems((name) => find("/*", name)).map((problem) => `/*: ${problem}`);
  for (const path of ["/", "/index.html"]) {
    problems.push(...shellCacheProblems(find(path, "cache-control")).map((problem) => `${path}: ${problem}`));
  }
  problems.push(...workerCacheProblems(find(WORKER_PATH, "cache-control")).map((problem) => `${WORKER_PATH}: ${problem}`));
  problems.push(...assetCacheProblems(find("/assets/*", "cache-control")).map((problem) => `/assets/*: ${problem}`));
  for (const path of ROOT_IMAGE_PATHS) {
    problems.push(...rootImageCacheProblems(find(path, "cache-control")).map((problem) => `${path}: ${problem}`));
  }
  if (!/^same-origin$/i.test((find("/assets/*", "cross-origin-resource-policy") ?? "").trim())) {
    problems.push("/assets/*: cross-origin-resource-policy is not same-origin, so another site can load the scripts and the font");
  }
  if (!/^application\/manifest\+json$/i.test((find("/manifest.webmanifest", "content-type") ?? "").trim())) {
    problems.push("/manifest.webmanifest: content-type is not application/manifest+json");
  }
  return problems;
}
