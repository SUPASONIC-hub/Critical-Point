#!/usr/bin/env node
/**
 * Did a pull request's Verify runs already prove the files this push to main
 * carries? deploy.yml asks this on every push to main, so that a merge whose
 * files were verified to the last byte on its pull request deploys at once
 * instead of waiting eighteen minutes for main's own Verify to say the same.
 *
 * "Yes" needs every one of these, and anything else -- a question the API did
 * not answer included -- is "no", which leaves the deploy to the old path
 * (deploy.yml's `workflow_run`, after main's Verify goes green):
 *
 *   1. The push is the merge commit of exactly one merged pull request into
 *      main (`merge_commit_sha` is this commit).
 *   2. Its tree is the tree of that pull request's head commit. Same tree hash,
 *      same files: git names a tree by the hash of its contents.
 *   3. Main as it was before the merge (the push's first parent) is an
 *      ancestor of that head. A pull request run checks out GitHub's test
 *      merge of the head into the base of the moment, not the head itself;
 *      when every earlier main is already in the head, that merge has the
 *      head's tree, so what the runs checked is what is deployed.
 *   4. No Verify run for that head is still running.
 *   5. Every job verify.yml defines -- verify-quick and each shard of
 *      verify-e2e and verify-season, read off the file itself so a new shard
 *      or job is asked for without this script changing -- went green in some
 *      run for that head, and the latest run in which the job was not skipped
 *      is the green one. A label run skips verify-quick and an unlabelled run
 *      skips the end-to-end tiers, so the runs are read together.
 *
 * It imports Node's own modules only: the job that runs it has no npm ci.
 */
import { appendFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** The events whose runs count as evidence for a head commit. */
export const EVIDENCE_EVENTS = new Set(["pull_request", "workflow_dispatch"]);

/**
 * The job names a complete Verify run reports, read from verify.yml. A matrix
 * job is reported once a value, as `id (value)`. Anything this reader does not
 * understand -- a job with its own `name:`, a matrix of two keys -- throws, and
 * a throw is a "no".
 */
export function requiredJobs(source) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => /^jobs:\s*$/.test(line));
  if (start < 0) throw new Error("verify.yml has no `jobs:` block.");
  const jobs = [];
  let current = null;
  let inMatrix = false;
  const finish = () => {
    if (!current) return;
    if (current.matrix === undefined) jobs.push(current.id);
    else for (const value of current.matrix) jobs.push(`${current.id} (${value})`);
  };
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line)) break;
    const id = line.match(/^ {2}([A-Za-z0-9_-]+):\s*$/);
    if (id) {
      finish();
      current = { id: id[1] };
      inMatrix = false;
      continue;
    }
    if (!current) continue;
    if (/^ {4}name:/.test(line)) throw new Error(`Job ${current.id} has a name of its own; its reported name cannot be predicted here.`);
    if (/^ {6}matrix:\s*$/.test(line)) {
      inMatrix = true;
      continue;
    }
    if (inMatrix && line.trim() && !line.trim().startsWith("#")) {
      if (/^ {0,7}\S/.test(line)) {
        inMatrix = false;
        continue;
      }
      const entry = line.match(/^ {8}([A-Za-z0-9_-]+):\s*\[([^\]]*)\]\s*$/);
      if (!entry) throw new Error(`Job ${current.id} has a matrix this reader does not understand: ${line.trim()}`);
      if (current.matrix !== undefined) throw new Error(`Job ${current.id} has a matrix of more than one key.`);
      current.matrix = entry[2]
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      if (!current.matrix.length) throw new Error(`Job ${current.id} has an empty matrix.`);
    }
  }
  finish();
  if (!jobs.length) throw new Error("verify.yml defines no jobs.");
  return jobs;
}

/**
 * The decision. `api(path)` answers a GitHub REST path below
 * `repos/{owner}/{repo}/` with parsed JSON, and throws when it cannot.
 * Returns `{ verified, reason, pr?, headSha? }`; it never throws.
 */
export async function sameTreeVerified({ sha, api, verifySource, workflowFile = "verify.yml", pullsAttempts = 3, wait = defaultWait }) {
  const no = (reason, extra = {}) => ({ verified: false, reason, ...extra });
  try {
    if (!/^[0-9a-f]{40}$/.test(sha ?? "")) return no(`${sha} is not a full commit hash.`);
    let required;
    try {
      required = requiredJobs(verifySource);
    } catch (error) {
      return no(`Could not read which jobs Verify runs: ${error.message}`);
    }

    const commit = await api(`git/commits/${sha}`);
    const tree = commit?.tree?.sha;
    const firstParent = commit?.parents?.[0]?.sha;
    if (!tree || !firstParent) return no(`${sha} has no tree or no parent the API would name.`);

    // The pull request is associated with its merge commit a moment after the
    // merge; ask again before taking silence for an answer.
    let merged = [];
    for (let attempt = 1; attempt <= pullsAttempts; attempt += 1) {
      const pulls = await api(`commits/${sha}/pulls`);
      merged = (Array.isArray(pulls) ? pulls : []).filter((pull) => pull?.merged_at && pull?.merge_commit_sha === sha && pull?.base?.ref === "main");
      if (merged.length || attempt === pullsAttempts) break;
      await wait(attempt);
    }
    if (merged.length !== 1) return no(merged.length ? `${sha} is the merge commit of ${merged.length} pull requests.` : `${sha} is not the merge commit of a pull request into main.`);
    const pr = merged[0].number;
    const headSha = merged[0]?.head?.sha;
    if (!/^[0-9a-f]{40}$/.test(headSha ?? "")) return no(`#${pr} names no head commit.`, { pr });

    const head = await api(`git/commits/${headSha}`);
    if (head?.tree?.sha !== tree) return no(`The tree of ${sha} is not the tree of #${pr}'s head ${headSha}: the merge brought in files the pull request's runs never saw.`, { pr, headSha });

    if (firstParent !== headSha) {
      const compare = await api(`compare/${firstParent}...${headSha}`);
      if (!["ahead", "identical"].includes(compare?.status)) return no(`#${pr} was behind main (${firstParent}) when it merged, so its runs checked a merge with an older main.`, { pr, headSha });
    }

    const listing = await api(`actions/workflows/${workflowFile}/runs?head_sha=${headSha}&per_page=100`);
    const runs = (listing?.workflow_runs ?? []).filter((run) => run?.head_sha === headSha && EVIDENCE_EVENTS.has(run?.event));
    if (!runs.length) return no(`#${pr}'s head ${headSha} has no Verify run.`, { pr, headSha });
    const running = runs.filter((run) => run.status !== "completed");
    if (running.length) return no(`Verify is still running for #${pr}'s head (run ${running.map((run) => run.id).join(", ")}).`, { pr, headSha });

    // Newest first: the latest word on a job is the one that counts.
    runs.sort((a, b) => Date.parse(b.created_at ?? 0) - Date.parse(a.created_at ?? 0) || b.id - a.id);
    const latest = new Map();
    for (const run of runs) {
      const jobs = await api(`actions/runs/${run.id}/jobs?filter=latest&per_page=100`);
      for (const job of jobs?.jobs ?? []) {
        if (!job?.name || job.conclusion === "skipped" || latest.has(job.name)) continue;
        latest.set(job.name, { conclusion: job.conclusion, run: run.id });
      }
    }
    const missing = required.filter((name) => !latest.has(name));
    if (missing.length) return no(`#${pr}'s head never ran ${missing.join(", ")} (they are skipped on a draft, on a pull request without the e2e label, and on one that changes only documents).`, { pr, headSha });
    const red = required.filter((name) => latest.get(name).conclusion !== "success");
    if (red.length) return no(`On #${pr}'s head ${red.map((name) => `${name} ended ${latest.get(name).conclusion} (run ${latest.get(name).run})`).join(", ")}.`, { pr, headSha });

    return { verified: true, reason: `${sha} has the tree of #${pr}'s head ${headSha}, which was up to date with main, and Verify passed all ${required.length} jobs on it.`, pr, headSha };
  } catch (error) {
    return no(`A question to the API went unanswered (${error.message}); nothing is decided on that.`);
  }
}

function defaultWait(attempt) {
  return new Promise((resolve) => setTimeout(resolve, attempt * 5000));
}

/** `api` for the command line: the REST API with the job's token. */
export function githubApi({ repo, token, fetchImpl = fetch }) {
  return async (resource) => {
    const response = await fetchImpl(`https://api.github.com/repos/${repo}/${resource}`, {
      headers: { accept: "application/vnd.github+json", authorization: `Bearer ${token}`, "x-github-api-version": "2022-11-28" },
    });
    if (!response.ok) throw new Error(`GET ${resource}: HTTP ${response.status}`);
    return response.json();
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const { SHA, GH_TOKEN, GH_REPO, GITHUB_OUTPUT } = process.env;
  let verifySource = "";
  try {
    verifySource = readFileSync(".github/workflows/verify.yml", "utf8");
  } catch {
    // requiredJobs turns the empty source into a "no".
  }
  const result = await sameTreeVerified({ sha: SHA, api: githubApi({ repo: GH_REPO, token: GH_TOKEN }), verifySource });
  if (GITHUB_OUTPUT) appendFileSync(GITHUB_OUTPUT, `verified=${result.verified}\n`);
  console.log(result.verified ? `Deploying now: ${result.reason}` : `Not deploying from the push: ${result.reason} The deploy waits for main's own Verify.`);
}
