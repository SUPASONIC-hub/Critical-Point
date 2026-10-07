import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { parse as parseYaml } from "yaml";

import {
  assetCacheProblems,
  backendOriginProblems,
  backendPlacementProblems,
  cspProblems,
  entryScriptPath,
  firstAssetPath,
  firstRootImagePath,
  PERMISSIONS_OFF,
  permissionsSwitchedOff,
  readRenderYamlCsp,
  readRenderYamlHeaders,
  renderYamlHeaderProblems,
  ROOT_IMAGE_PATHS,
  rootImageCacheProblems,
  rootImageSamples,
  shellCacheProblems,
  siteHeaderProblems,
  wildcardHostProblems,
} from "../../scripts/deploy-policy.mjs";

const yaml = readFileSync("render.yaml", "utf8");
const served = (headers) => (name) => headers[name] ?? null;
const ALL_OFF = PERMISSIONS_OFF.map((feature) => `${feature}=()`).join(", ");
const GOOD = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "content-security-policy": "default-src 'self'",
  "strict-transport-security": "max-age=63072000; includeSubDomains",
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy": ALL_OFF,
};

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** render.yaml with one of its header rules taken out. */
function withoutRule(path, name) {
  const pattern = new RegExp(`^[ \\t]*- path: ${escaped(path)}[ \\t]*\\r?\\n[ \\t]*name: ${escaped(name)}[ \\t]*\\r?\\n[ \\t]*value: .*\\r?\\n`, "im");
  const cut = yaml.replace(pattern, "");
  assert.notEqual(cut, yaml, `render.yaml has a ${name} rule for ${path} to take out`);
  return cut;
}

test("render.yaml declares every header the live check asks for", () => {
  assert.deepEqual(renderYamlHeaderProblems(yaml), []);
  const headers = readRenderYamlHeaders(yaml);
  assert.ok(headers.some((header) => header.path === "/" && header.name === "cache-control"), "the page as a browser asks for it");
});

test("no rule can leave render.yaml without the offline check saying so", () => {
  // It used to ask for thirteen of the fifteen: the Cross-Origin-Resource-Policy
  // on /assets/* and the manifest's Content-Type could be deleted and pass.
  const headers = readRenderYamlHeaders(yaml);
  assert.equal(headers.length, 15, "a rule added to render.yaml is added to the README's table and to renderYamlHeaderProblems");
  for (const header of headers) {
    assert.notDeepEqual(renderYamlHeaderProblems(withoutRule(header.path, header.name)), [], `${header.path} ${header.name} can be deleted unnoticed`);
  }
});

test("the two readers of render.yaml read the same rules", () => {
  // `vite preview` sends these headers from a YAML parser (vite.config.js);
  // the deploy check, which runs without node_modules, reads them with a
  // pattern. A rule one of them cannot read is tested under one policy and
  // checked under another.
  const parsed = parseYaml(yaml)
    .services.flatMap((service) => service.headers ?? [])
    .map((rule) => ({ path: rule.path, name: rule.name.toLowerCase(), value: String(rule.value) }));
  assert.deepEqual(readRenderYamlHeaders(yaml), parsed);
});

test("the README's table of dashboard headers is render.yaml's list", () => {
  // The dashboard is filled in from the README by hand.
  const rows = [...readFileSync("README.md", "utf8").matchAll(/^\| `(\/[^`]*)` \| `([^`]+)` \| (.+?) \|\s*$/gm)].map((row) => ({
    path: row[1],
    name: row[2].toLowerCase(),
    value: row[3],
  }));
  const headers = readRenderYamlHeaders(yaml);
  assert.deepEqual(
    rows.map((row) => `${row.path} ${row.name}`),
    headers.map((header) => `${header.path} ${header.name}`),
    "the same rules, in the same order",
  );
  for (const [index, row] of rows.entries()) {
    // The two long values are copied from the file, and the table says so.
    if (row.value.includes("render.yaml")) continue;
    assert.equal(row.value, `\`${headers[index].value}\``, `${row.path} ${row.name}`);
  }
});

test("a header is judged by what it says", () => {
  assert.deepEqual(siteHeaderProblems(served(GOOD)), []);
  assert.deepEqual(siteHeaderProblems(served({})).length, Object.keys(GOOD).length);
  const problemsWith = (patch) => siteHeaderProblems(served({ ...GOOD, ...patch }));
  assert.match(problemsWith({ "strict-transport-security": "max-age=300" })[0], /strict-transport-security/);
  assert.match(problemsWith({ "cross-origin-opener-policy": "unsafe-none" })[0], /cross-origin-opener-policy/);
  assert.match(problemsWith({ "permissions-policy": ALL_OFF.replace("payment=(), ", "").replace(", usb=()", "") })[0], /leaves payment, usb on$/);
  assert.match(problemsWith({ "permissions-policy": ALL_OFF.replace("camera=()", "camera=*") })[0], /leaves camera on$/);
  assert.match(problemsWith({ "referrer-policy": "unsafe-url" })[0], /referrer-policy/);
  assert.match(problemsWith({ "x-content-type-options": "sniff" })[0], /nosniff/);
});

test("every feature render.yaml switches off is asked of the live header", () => {
  // Five of the seventeen were: the rest could be lost between the file and
  // the dashboard. The list in the script is the file's, both ways.
  const declared = readRenderYamlHeaders(yaml).find((header) => header.name === "permissions-policy").value;
  assert.deepEqual(permissionsSwitchedOff(declared).sort(), [...PERMISSIONS_OFF].sort());
  for (const feature of PERMISSIONS_OFF) {
    const without = ALL_OFF.split(", ").filter((entry) => entry !== `${feature}=()`).join(", ");
    assert.match(siteHeaderProblems(served({ ...GOOD, "permissions-policy": without })).join("\n"), new RegExp(`leaves ${feature} on`));
  }
});

test("a policy is held to what its directives say, not to their being there", () => {
  const good = "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'";
  assert.deepEqual(cspProblems(good), []);
  assert.deepEqual(cspProblems(readRenderYamlCsp(yaml)), []);
  // All three passed until 2026-10-07: present, and meaning nothing.
  assert.match(cspProblems(good.replace("base-uri 'self'", "base-uri *")).join("\n"), /^base-uri allows \*/);
  assert.match(cspProblems(good.replace("frame-ancestors 'none'", "frame-ancestors *")).join("\n"), /^frame-ancestors allows \*/);
  assert.match(cspProblems(good.replace("frame-ancestors 'none'", "frame-ancestors https:")).join("\n"), /^frame-ancestors allows https:/);
  const loose = cspProblems(`${good}; script-src-elem * 'unsafe-inline'`);
  assert.deepEqual(loose, ["script-src-elem allows scripts from *", "script-src-elem allows 'unsafe-inline'"]);
  assert.deepEqual(cspProblems(`${good}; script-src-attr 'unsafe-inline'`), ["script-src-attr allows 'unsafe-inline'"]);
  assert.deepEqual(cspProblems(`${good}; script-src-attr 'none'`), []);
  // What was already refused still is.
  assert.match(cspProblems("default-src *; object-src 'none'; base-uri 'self'; frame-ancestors 'none'").join("\n"), /script-src allows scripts from \*/);
  assert.match(cspProblems("object-src 'none'").join("\n"), /no script-src or default-src[\s\S]*no base-uri[\s\S]*no frame-ancestors/);
  assert.match(cspProblems(good.replace("script-src 'self'", "script-src 'self' 'unsafe-eval'")).join("\n"), /^script-src allows 'unsafe-eval'$/);
});

test("the page is asked for on every visit, by browsers and by caches between", () => {
  assert.deepEqual(shellCacheProblems("no-cache"), []);
  assert.deepEqual(shellCacheProblems("no-store"), []);
  assert.deepEqual(shellCacheProblems("public, max-age=0, must-revalidate"), []);
  // What the live site served on 2026-09-28.
  assert.equal(shellCacheProblems("public, max-age=0, s-maxage=300").length, 1);
  assert.equal(shellCacheProblems("public, max-age=300").length, 1);
  assert.equal(shellCacheProblems("").length, 1);
  assert.equal(shellCacheProblems(null).length, 1);
});

test("a fingerprinted asset is kept for a year and never asked about", () => {
  assert.deepEqual(assetCacheProblems("public, max-age=31536000, immutable"), []);
  assert.equal(assetCacheProblems("public, max-age=0, s-maxage=300").length, 2);
  assert.equal(assetCacheProblems("public, max-age=31536000").length, 1);
  assert.equal(assetCacheProblems("public, s-maxage=31536000, immutable").length, 1, "s-maxage is not max-age");
  assert.equal(assetCacheProblems(null).length, 2);
});

test("the asset the cache policy is read from is one the page links", () => {
  const html = '<link rel="icon" href="/icons/favicon-32.png"><script type="module" crossorigin src="/assets/index-Bszxvk0K.js"></script><link rel="stylesheet" href="/assets/index-zkSe9dBJ.css">';
  assert.equal(firstAssetPath(html), "/assets/index-Bszxvk0K.js");
  assert.equal(firstAssetPath('<script src="https://example.onrender.com/assets/index-Bszxvk0K.js"></script>'), "/assets/index-Bszxvk0K.js");
  assert.equal(firstAssetPath('<script src="/assets/plain.js"></script>'), null, "a name with no fingerprint says nothing about fingerprinted files");
  assert.equal(firstAssetPath("<p>no assets</p>"), null);
});

test("an image at the root is kept for a day, not for good and not for nothing", () => {
  assert.deepEqual(rootImageCacheProblems("public, max-age=86400, stale-while-revalidate=604800"), []);
  // The host's default, measured 2026-09-28: every image asked about on every visit.
  assert.equal(rootImageCacheProblems("public, max-age=0, s-maxage=300").length, 1);
  assert.equal(rootImageCacheProblems(null).length, 1);
  // The fingerprinted policy on a name that never changes.
  assert.equal(rootImageCacheProblems("public, max-age=31536000, immutable").length, 2);
  const headers = readRenderYamlHeaders(yaml);
  for (const path of ROOT_IMAGE_PATHS) {
    assert.ok(headers.some((header) => header.path === path && header.name === "cache-control"), `render.yaml has a Cache-Control rule for ${path}`);
  }
  assert.match(
    renderYamlHeaderProblems(yaml.replace(/- path: \/\*\.webp\s*\n\s*name: Cache-Control\s*\n\s*value: .*\n/, "")).join("\n"),
    /\/\*\.webp: an image served from the root/,
  );
});

test("the image the cache policy is read from is one the page names at the root", () => {
  const html =
    '<meta property="og:image" content="/triggerlab-key-visual.jpg" /><link rel="icon" href="/icons/favicon-32.png">' +
    '<link rel="preload" as="image" imagesrcset="/triggerlab-key-visual-480.webp 1x, /triggerlab-key-visual-960.webp 2x">';
  assert.equal(firstRootImagePath(html), "/triggerlab-key-visual.jpg");
  assert.equal(firstRootImagePath('<link imagesrcset="/a-480.webp 1x, /a-960.webp 2x">'), "/a-480.webp");
  assert.equal(firstRootImagePath('<img src="/assets/art-Bszxvk0K.webp"><link href="/icons/icon-192.png">'), null, "a fingerprinted or nested file is not a root image");
});

test("each rule for the root's images has a file of its own to be read from", () => {
  // A release: `og:image` is absolute (the one .jpg the page names), and the
  // first image in the markup is a .webp. The check read that one alone, so
  // the .jpg and icon rules could be missing from the dashboard unnoticed.
  const release =
    '<meta property="og:image" content="https://game.example/triggerlab-key-visual.jpg" /><link rel="icon" href="/icons/favicon-32.png">' +
    '<link rel="preload" as="image" imagesrcset="/triggerlab-key-visual-480.webp 1x, /triggerlab-key-visual-960.webp 2x">' +
    '<script type="module" src="/assets/index-Bszxvk0K.js"></script>';
  assert.deepEqual(rootImageSamples(release), [
    { rule: "/*.webp", path: "/triggerlab-key-visual-480.webp" },
    { rule: "/*.jpg", path: "/triggerlab-key-visual.jpg" },
    { rule: "/icons/*", path: "/icons/favicon-32.png" },
  ]);
  assert.deepEqual(rootImageSamples(release).map((sample) => sample.rule), ROOT_IMAGE_PATHS);
  // A local build names the same .jpg without an origin.
  assert.equal(rootImageSamples(release.replace("https://game.example", ""))[1].path, "/triggerlab-key-visual.jpg");
  // A rule the page names nothing under is said to be unread, not passed.
  assert.deepEqual(rootImageSamples('<img src="/assets/art-Bszxvk0K.webp">').map((sample) => sample.path), [null, null, null]);
});

test("the entry script is the module the page starts from", () => {
  const html = '<script type="module" crossorigin src="/assets/index-Cdp_ULJ-.js"></script><script src="/assets/deferred-styles-ae3dcf14.js" defer></script>';
  assert.equal(entryScriptPath(html), "/assets/index-Cdp_ULJ-.js");
  assert.equal(entryScriptPath('<script src="/assets/deferred-styles-ae3dcf14.js" defer></script>'), null);
});

test("a release names the backend its own CSP lets it call", () => {
  const live = "default-src 'self'; connect-src 'self' https://abcdefgh.supabase.co";
  assert.deepEqual(backendOriginProblems('const u="https://abcdefgh.supabase.co";', live), []);
  // Built with no VITE_SUPABASE_URL: every header right, no ranking.
  assert.match(backendOriginProblems('const u=void 0;', live)[0], /built without VITE_SUPABASE_URL/);
  // Built for another project.
  assert.equal(backendOriginProblems('const u="https://zzzzzzzz.supabase.co";', live).length, 1);
  // render.yaml can only say the wildcard; the placeholder build matches it.
  assert.deepEqual(backendOriginProblems('const u="https://e2e.supabase.co";', readRenderYamlCsp(yaml)), []);
  assert.equal(backendOriginProblems('const u="https://e2e.example.com";', readRenderYamlCsp(yaml)).length, 1);
  assert.match(backendOriginProblems("x", "default-src 'self'; connect-src 'self'")[0], /names no backend origin/);
});

test("a backend named outside the entry script is caught before the deploy, not after", () => {
  const csp = readRenderYamlCsp(yaml);
  const entry = "/assets/index-Cdp_ULJ-.js";
  const withBackend = 'const u="https://e2e.supabase.co";';
  // Where it is today.
  assert.deepEqual(backendPlacementProblems(entry, [[entry, withBackend], ["/assets/case01-abc.js", "x"]], csp), []);
  // A build with no backend at all is a correct build, and only a note.
  assert.deepEqual(backendPlacementProblems(entry, [[entry, "x"], ["/assets/case01-abc.js", "y"]], csp), []);
  // The split moved it: the live check reads the entry script alone.
  const moved = backendPlacementProblems(entry, [[entry, "x"], ["/assets/vendor-123.js", withBackend]], csp);
  assert.equal(moved.length, 1);
  assert.match(moved[0], /in \/assets\/vendor-123\.js and not in the entry script \/assets\/index-Cdp_ULJ-\.js/);
  // A policy that names no backend has nothing to place.
  assert.deepEqual(backendPlacementProblems(entry, [[entry, "x"], ["/assets/vendor-123.js", withBackend]], "connect-src 'self'"), []);
});

test("a wildcard host is named where the page may send data", () => {
  assert.deepEqual(wildcardHostProblems("connect-src 'self' https://abcdefgh.supabase.co"), []);
  assert.equal(wildcardHostProblems("connect-src 'self' https://*.supabase.co").length, 1);
  assert.equal(wildcardHostProblems("connect-src 'self'; form-action https://*.example.com").length, 1);
  // render.yaml cannot name the project, so the file is where the wildcard is
  // written down and the live header is where it is refused.
  assert.equal(wildcardHostProblems(readRenderYamlCsp(yaml)).length, 1);
});

test("the service worker's file is asked for again every time, like the page", async () => {
  const { WORKER_PATH, workerCacheProblems } = await import("../../scripts/deploy-policy.mjs");
  const declared = readRenderYamlHeaders(yaml).find((header) => header.path === WORKER_PATH && header.name === "cache-control");
  assert.equal(declared?.value, "no-cache");
  assert.deepEqual(workerCacheProblems("no-cache"), []);
  assert.match(workerCacheProblems("public, max-age=0, s-maxage=300")[0], /^the service worker is held by shared caches for 300s/);
  assert.match(workerCacheProblems("public, max-age=600")[0], /^the service worker may be reused without asking/);
  // The file has to say it: a render.yaml without the rule is a failure of the offline check.
  const without = yaml.replace(/- path: \/sw\.js\s*\n\s*name: Cache-Control\s*\n\s*value: no-cache\s*\n/, "");
  assert.notEqual(without, yaml);
  assert.match(renderYamlHeaderProblems(without).join("\n"), /\/sw\.js: the service worker is served with no Cache-Control/);
});
