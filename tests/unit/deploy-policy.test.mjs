import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  assetCacheProblems,
  backendOriginProblems,
  entryScriptPath,
  firstAssetPath,
  firstRootImagePath,
  readRenderYamlCsp,
  readRenderYamlHeaders,
  renderYamlHeaderProblems,
  ROOT_IMAGE_PATHS,
  rootImageCacheProblems,
  shellCacheProblems,
  siteHeaderProblems,
  wildcardHostProblems,
} from "../../scripts/deploy-policy.mjs";

const yaml = readFileSync("render.yaml", "utf8");
const served = (headers) => (name) => headers[name] ?? null;
const GOOD = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "content-security-policy": "default-src 'self'",
  "strict-transport-security": "max-age=63072000; includeSubDomains",
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

test("render.yaml declares every header the live check asks for", () => {
  assert.deepEqual(renderYamlHeaderProblems(yaml), []);
  const headers = readRenderYamlHeaders(yaml);
  assert.ok(headers.length >= 10, `read ${headers.length} headers from render.yaml`);
  assert.ok(headers.some((header) => header.path === "/" && header.name === "cache-control"), "the page as a browser asks for it");
});

test("a header is judged by what it says", () => {
  assert.deepEqual(siteHeaderProblems(served(GOOD)), []);
  assert.deepEqual(siteHeaderProblems(served({})).length, Object.keys(GOOD).length);
  const problemsWith = (patch) => siteHeaderProblems(served({ ...GOOD, ...patch }));
  assert.match(problemsWith({ "strict-transport-security": "max-age=300" })[0], /strict-transport-security/);
  assert.match(problemsWith({ "cross-origin-opener-policy": "unsafe-none" })[0], /cross-origin-opener-policy/);
  assert.match(problemsWith({ "permissions-policy": "camera=(), microphone=(), geolocation=()" })[0], /payment, usb/);
  assert.match(problemsWith({ "permissions-policy": "camera=*, microphone=(), geolocation=(), payment=(), usb=()" })[0], /camera/);
  assert.match(problemsWith({ "referrer-policy": "unsafe-url" })[0], /referrer-policy/);
  assert.match(problemsWith({ "x-content-type-options": "sniff" })[0], /nosniff/);
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

test("a wildcard host is named where the page may send data", () => {
  assert.deepEqual(wildcardHostProblems("connect-src 'self' https://abcdefgh.supabase.co"), []);
  assert.equal(wildcardHostProblems("connect-src 'self' https://*.supabase.co").length, 1);
  assert.equal(wildcardHostProblems("connect-src 'self'; form-action https://*.example.com").length, 1);
  // render.yaml cannot name the project, so the file is where the wildcard is
  // written down and the live header is where it is refused.
  assert.equal(wildcardHostProblems(readRenderYamlCsp(yaml)).length, 1);
});
