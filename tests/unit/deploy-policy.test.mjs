import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  assetCacheProblems,
  firstAssetPath,
  readRenderYamlCsp,
  readRenderYamlHeaders,
  renderYamlHeaderProblems,
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

test("a wildcard host is named where the page may send data", () => {
  assert.deepEqual(wildcardHostProblems("connect-src 'self' https://abcdefgh.supabase.co"), []);
  assert.equal(wildcardHostProblems("connect-src 'self' https://*.supabase.co").length, 1);
  assert.equal(wildcardHostProblems("connect-src 'self'; form-action https://*.example.com").length, 1);
  // render.yaml cannot name the project, so the file is where the wildcard is
  // written down and the live header is where it is refused.
  assert.equal(wildcardHostProblems(readRenderYamlCsp(yaml)).length, 1);
});
