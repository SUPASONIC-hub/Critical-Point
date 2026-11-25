#!/usr/bin/env node
/**
 * Whether Notes Publish (.github/workflows/notes-publish.yml) should press
 * Deploy today. A note goes live with the first build on or after its day, so
 * a Deploy that failed on that day used to leave it waiting for the next merge.
 *
 * It presses when a note's day is today and the site does not already serve
 * it, or when an earlier note's page answers exactly 404. Anything else from
 * the site (a timeout, a 5xx) says nothing about an earlier note, so it waits
 * for tomorrow's run. At most one press per Seoul day: a Deploy dispatched
 * today, or one still running from today, holds the next run back.
 *
 * Node's own modules only: the workflow has no `npm ci`. The site's address is
 * a secret and is never printed.
 */
import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { NOTES, notePath, seoulDay } from "../src/notes/noteIndex.js";

const PROBE_TIMEOUT_MS = 30_000;
const ACTIVE = new Set(["queued", "in_progress", "waiting", "requested", "pending"]);

/** The address's origin, or "" when it is missing or not an http(s) address. */
export function originOf(url) {
  try {
    const { origin, protocol } = new URL(String(url ?? "").trim());
    return protocol === "https:" || protocol === "http:" ? origin : "";
  } catch {
    return "";
  }
}

/** `"live"` for 200, `"missing"` for exactly 404, `"unknown"` for anything else, a redirect or a failed request included. */
export async function probeNote(origin, slug, fetcher = fetch) {
  try {
    const { status } = await fetcher(`${origin}${notePath(slug)}`, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) });
    return status === 200 ? "live" : status === 404 ? "missing" : "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * `{ today, overdue }`: the slugs that call for a build. With no address, today's
 * notes, as before there was a probe. Newest first, stopping at the first
 * earlier note that is missing or cannot be read: one is enough to press, and
 * a site that is down should not cost a timeout per note.
 */
export async function notesToPublish({ notes = NOTES, today, origin, fetcher = fetch }) {
  const out = notes.filter((note) => note.published <= today).sort((a, b) => b.published.localeCompare(a.published));
  const todays = out.filter((note) => note.published === today);
  if (!origin) return { today: todays.map((note) => note.slug), overdue: [] };
  const waiting = [];
  for (const note of todays) if ((await probeNote(origin, note.slug, fetcher)) !== "live") waiting.push(note.slug);
  for (const note of out.filter((item) => item.published < today)) {
    const state = await probeNote(origin, note.slug, fetcher);
    if (state === "missing") return { today: waiting, overdue: [note.slug] };
    if (state === "unknown") break;
  }
  return { today: waiting, overdue: [] };
}

/** Whether today already has its press: a Deploy dispatched today, or any Deploy from today still running. */
export function pressedToday(runs, today) {
  return runs.some((run) => seoulDay(new Date(run.createdAt)) === today && (run.event === "workflow_dispatch" || ACTIVE.has(run.status)));
}

/** The one decision: `{ press, reason }`. */
export function decide({ today, overdue }, runs, day) {
  const slugs = [...today, ...overdue];
  if (!slugs.length) return { press: false, reason: "No note is waiting." };
  if (pressedToday(runs, day)) return { press: false, reason: `Waiting (${slugs.join(" ")}), but Deploy was already pressed today.` };
  return { press: true, reason: `${today.length ? `Out today: ${today.join(" ")}. ` : ""}${overdue.length ? `Overdue: ${overdue.join(" ")}.` : ""}`.trim() };
}

async function main() {
  const day = seoulDay();
  const due = await notesToPublish({ today: day, origin: originOf(process.env.DEPLOY_URL) });
  const needsRuns = due.today.length + due.overdue.length > 0;
  const runs = needsRuns
    ? JSON.parse(execFileSync("gh", ["run", "list", "--workflow", "deploy.yml", "--limit", "30", "--json", "event,status,createdAt"], { encoding: "utf8" }))
    : [];
  const { press, reason } = decide(due, runs, day);
  console.log(reason);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `press=${press}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${reason}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
