import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { requiredJobs, sameTreeVerified } from "../../scripts/ci-same-tree-verified.mjs";

/**
 * deploy.yml's push door deploys a merge at once when this says yes, so every
 * way it can be wrong is a way an unverified commit reaches the site. The API
 * here is a fake that answers from a table, and a path it does not know throws,
 * as a failed request would.
 */
const VERIFY = readFileSync(".github/workflows/verify.yml", "utf8");
const JOBS = requiredJobs(VERIFY);

const PUSH = "a".repeat(40);
const MAIN_BEFORE = "b".repeat(40);
const HEAD = "c".repeat(40);
const TREE = "1".repeat(40);

const quickOnly = () => JOBS.map((name) => ({ name, conclusion: name === "verify-quick" || name === "scope" ? "success" : "skipped" }));
const e2eOnly = () => JOBS.map((name) => ({ name, conclusion: name === "verify-quick" ? "skipped" : "success" }));

function fakeApi({ headTree = TREE, compareStatus = "ahead", pulls, runs, jobs } = {}) {
  const table = {
    [`git/commits/${PUSH}`]: { tree: { sha: TREE }, parents: [{ sha: MAIN_BEFORE }, { sha: HEAD }] },
    [`git/commits/${HEAD}`]: { tree: { sha: headTree }, parents: [{ sha: MAIN_BEFORE }] },
    [`commits/${PUSH}/pulls`]: pulls ?? [{ number: 7, merged_at: "2026-11-03T01:00:00Z", merge_commit_sha: PUSH, base: { ref: "main" }, head: { sha: HEAD } }],
    [`compare/${MAIN_BEFORE}...${HEAD}`]: { status: compareStatus },
    [`actions/workflows/verify.yml/runs?head_sha=${HEAD}&per_page=100`]: {
      workflow_runs: runs ?? [
        { id: 1, event: "pull_request", head_sha: HEAD, status: "completed", conclusion: "success", created_at: "2026-11-03T00:00:00Z" },
        { id: 2, event: "pull_request", head_sha: HEAD, status: "completed", conclusion: "success", created_at: "2026-11-03T00:01:00Z" },
      ],
    },
    "actions/runs/1/jobs?filter=latest&per_page=100": { jobs: jobs?.[1] ?? quickOnly() },
    "actions/runs/2/jobs?filter=latest&per_page=100": { jobs: jobs?.[2] ?? e2eOnly() },
  };
  const asked = [];
  const api = async (resource) => {
    asked.push(resource);
    const answer = typeof table[resource] === "function" ? table[resource]() : table[resource];
    if (answer === undefined) throw new Error(`GET ${resource}: HTTP 404`);
    return structuredClone(answer);
  };
  return { api, asked, table };
}

const ask = (fake, extra = {}) => sameTreeVerified({ sha: PUSH, api: fake.api, verifySource: VERIFY, wait: async () => {}, ...extra });

test("the jobs asked for are every job verify.yml defines, each shard by name", () => {
  assert.ok(JOBS.includes("verify-quick"));
  assert.ok(JOBS.includes("verify-e2e (1)") && JOBS.includes("verify-e2e (5)"));
  assert.ok(JOBS.includes("verify-season (1)") && JOBS.includes("verify-season (4)"));
  const ids = [...VERIFY.slice(VERIFY.search(/^jobs:/m)).matchAll(/^ {2}([A-Za-z0-9_-]+):\s*$/gm)].map((match) => match[1]);
  for (const id of ids) assert.ok(JOBS.some((name) => name === id || name.startsWith(`${id} (`)), `${id} is not asked for`);
});

test("a job verify.yml names itself, or a matrix of two keys, is not guessed at", () => {
  assert.throws(() => requiredJobs("jobs:\n  a:\n    name: Something\n    runs-on: x\n"));
  assert.throws(() => requiredJobs("jobs:\n  a:\n    strategy:\n      matrix:\n        shard: [1, 2]\n        os: [x, y]\n"));
  assert.throws(() => requiredJobs("jobs:\n  a:\n    strategy:\n      matrix:\n        include:\n          - shard: 1\n"));
  assert.deepEqual(requiredJobs("jobs:\n  a:\n    strategy:\n      fail-fast: false\n      matrix:\n        shard: [1, 2]\n    steps:\n      - run: x\n  b:\n    runs-on: x\n"), ["a (1)", "a (2)", "b"]);
});

test("same tree, up to date, quick green in one run and the end-to-end tiers in a label run: deploys", async () => {
  const result = await ask(fakeApi());
  assert.equal(result.verified, true, result.reason);
  assert.equal(result.pr, 7);
});

test("a different tree falls back", async () => {
  const result = await ask(fakeApi({ headTree: "2".repeat(40) }));
  assert.equal(result.verified, false);
  assert.match(result.reason, /not the tree/);
});

test("a pull request that was behind main falls back, even with the same tree", async () => {
  const result = await ask(fakeApi({ compareStatus: "diverged" }));
  assert.equal(result.verified, false);
  assert.match(result.reason, /behind main/);
});

test("a run still going for the head falls back", async () => {
  const fake = fakeApi();
  fake.table[`actions/workflows/verify.yml/runs?head_sha=${HEAD}&per_page=100`].workflow_runs[1].status = "in_progress";
  const result = await ask(fake);
  assert.equal(result.verified, false);
  assert.match(result.reason, /still running/);
});

test("a red shard falls back", async () => {
  const jobs = e2eOnly().map((job) => (job.name === "verify-e2e (3)" ? { ...job, conclusion: "failure" } : job));
  const result = await ask(fakeApi({ jobs: { 2: jobs } }));
  assert.equal(result.verified, false);
  assert.match(result.reason, /verify-e2e \(3\) ended failure/);
});

test("a later red run outweighs an earlier green one", async () => {
  const red = e2eOnly().map((job) => (job.name === "verify-season (2)" ? { ...job, conclusion: "cancelled" } : job));
  // Run 1 is the earlier, green on everything; run 2, later, ends a shard cancelled.
  const all = JOBS.map((name) => ({ name, conclusion: "success" }));
  const result = await ask(fakeApi({ jobs: { 1: all, 2: red } }));
  assert.equal(result.verified, false);
  assert.match(result.reason, /verify-season \(2\) ended cancelled/);
});

test("label runs alone, with no quick tier, fall back", async () => {
  const result = await ask(
    fakeApi({ runs: [{ id: 2, event: "pull_request", head_sha: HEAD, status: "completed", conclusion: "success", created_at: "2026-11-03T00:01:00Z" }] }),
  );
  assert.equal(result.verified, false);
  assert.match(result.reason, /never ran verify-quick/);
});

test("a head without the e2e label, whose end-to-end tiers were skipped, falls back", async () => {
  const result = await ask(fakeApi({ runs: [{ id: 1, event: "pull_request", head_sha: HEAD, status: "completed", conclusion: "success", created_at: "2026-11-03T00:00:00Z" }] }));
  assert.equal(result.verified, false);
  assert.match(result.reason, /never ran verify-e2e \(1\)/);
});

test("no runs at all, or only runs of another event, fall back", async () => {
  assert.equal((await ask(fakeApi({ runs: [] }))).verified, false);
  const other = await ask(fakeApi({ runs: [{ id: 1, event: "schedule", head_sha: HEAD, status: "completed", conclusion: "success", created_at: "2026-11-03T00:00:00Z" }] }));
  assert.equal(other.verified, false);
});

test("a push that is not one pull request's merge commit falls back", async () => {
  assert.equal((await ask(fakeApi({ pulls: [] }))).verified, false);
  const contains = await ask(fakeApi({ pulls: [{ number: 7, merged_at: "2026-11-03T01:00:00Z", merge_commit_sha: "d".repeat(40), base: { ref: "main" }, head: { sha: HEAD } }] }));
  assert.equal(contains.verified, false);
  const open = await ask(fakeApi({ pulls: [{ number: 7, merged_at: null, merge_commit_sha: PUSH, base: { ref: "main" }, head: { sha: HEAD } }] }));
  assert.equal(open.verified, false);
});

test("the pull request is asked for again before silence counts as an answer", async () => {
  const fake = fakeApi();
  const found = fake.table[`commits/${PUSH}/pulls`];
  let calls = 0;
  fake.table[`commits/${PUSH}/pulls`] = () => (++calls === 1 ? [] : found);
  const result = await ask(fake);
  assert.equal(result.verified, true, result.reason);
  assert.equal(calls, 2);
});

test("an unanswered question, a short hash or an unreadable verify.yml falls back without throwing", async () => {
  const fake = fakeApi();
  delete fake.table[`compare/${MAIN_BEFORE}...${HEAD}`];
  const result = await ask(fake);
  assert.equal(result.verified, false);
  assert.match(result.reason, /unanswered/);
  assert.equal((await ask(fakeApi(), { sha: "abc1234" })).verified, false);
  assert.equal((await ask(fakeApi(), { verifySource: "" })).verified, false);
});

test("Verify and Visual Regression skip the same documents-only pull requests", () => {
  const line = (file) => readFileSync(file, "utf8").match(/^\s*docs_only_pattern='([^']+)'\s*$/m)?.[1];
  const verify = line(".github/workflows/verify.yml");
  assert.ok(verify, "verify.yml has no docs_only_pattern line");
  assert.equal(line(".github/workflows/visual-regression.yml"), verify);
  const docs = new RegExp(verify);
  for (const file of ["README.md", "docs/history.md", "docs/images/a.png", "src/locales/en/NOTES.md"]) assert.ok(docs.test(file), file);
  for (const file of ["src/App.jsx", "package.json", "docs.js", "scripts/check-doc-numbers.mjs", "README.md.bak", ".github/workflows/verify.yml"]) assert.ok(!docs.test(file), file);
});
