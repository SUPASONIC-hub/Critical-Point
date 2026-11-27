#!/usr/bin/env node
/**
 * The sitemap's lastmod file (scripts/sitemap-dates.json): which pages have
 * changed since it was written. Lists them by default and writes nothing;
 * `--write` dates each changed or new page today (or `--date YYYY-MM-DD`) and
 * drops addresses the sitemap no longer has.
 *
 *   npm run sitemap:dates
 *   npm run sitemap:dates -- --write
 *
 * A page is hashed by its words (`pageFingerprints`, scripts/site-pages.mjs),
 * not by the menu and markup every page shares. A page left stale would be
 * dated by each build's day, which is how all 198 were by 11-19; since 11-20
 * tests/unit/sitemap-dates.test.mjs fails until the file is written, so a pull
 * request that changes a page's words runs this with `--write`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { pageFingerprints } from "./site-pages.mjs";

export const DATES_FILE = fileURLToPath(new URL("./sitemap-dates.json", import.meta.url));

/** `{ stale, next }`: the addresses whose hash moved or that are new or gone, and the file's pages with them dated `date`. */
export function refreshDates(pages, prints, date) {
  const stale = [];
  const next = {};
  for (const [loc, hash] of Object.entries(prints)) {
    if (pages[loc]?.hash === hash) next[loc] = pages[loc];
    else {
      stale.push(loc);
      next[loc] = { hash, date };
    }
  }
  for (const loc of Object.keys(pages)) if (!(loc in prints)) stale.push(loc);
  return { stale, next };
}

function main(argv) {
  const write = argv.includes("--write");
  const at = argv.indexOf("--date");
  const date = at >= 0 ? argv[at + 1] : new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) throw new Error(`--date must be YYYY-MM-DD, got ${date}`);
  const file = JSON.parse(readFileSync(DATES_FILE, "utf8"));
  const { stale, next } = refreshDates(file.pages, pageFingerprints(), date);
  if (!stale.length) {
    console.log("sitemap-dates: every page is dated by its content.");
    return;
  }
  console.log(`sitemap-dates: ${stale.length} changed since the file was written:\n${stale.map((loc) => `  ${loc}`).join("\n")}`);
  if (!write) {
    console.log("Nothing written (add --write to date them today).");
    return;
  }
  writeFileSync(DATES_FILE, `${JSON.stringify({ ...file, pages: next }, null, 2)}\n`);
  console.log(`Written, dated ${date}.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv.slice(2));
