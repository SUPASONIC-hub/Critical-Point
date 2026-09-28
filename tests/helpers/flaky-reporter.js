import { appendFileSync } from "node:fs";

/**
 * Names the tests that passed only on a retry.
 *
 * CI runs with `--retries=1`, and a test that fails and then passes is reported
 * as passed: the run is green and the log says so. That is the right verdict
 * for the push and the wrong place to stop, because a test that fails half the
 * time is a bug in the test or in the game, and neither gets fixed while it is
 * invisible. This prints each one, raises an annotation on CI, and writes the
 * list to the job summary. It does not change the run's result.
 */
export default class FlakyReporter {
  constructor() {
    this.tests = new Set();
  }

  onTestEnd(test) {
    this.tests.add(test);
  }

  onEnd() {
    const flaky = [...this.tests].filter((test) => test.outcome() === "flaky");
    if (!flaky.length) return;
    const lines = flaky.map((test) => {
      const [, project, , ...title] = test.titlePath();
      const failed = test.results.find((result) => result.status !== "passed");
      const reason = String(failed?.error?.message ?? failed?.status ?? "").split("\n")[0].slice(0, 200);
      return { where: `${test.location.file}:${test.location.line}`, name: `[${project}] ${title.join(" › ")}`, reason, test };
    });
    console.log(`\n${flaky.length} test(s) passed only on a retry:`);
    for (const line of lines) {
      console.log(`  ${line.name}\n    first attempt: ${line.reason}`);
      if (process.env.GITHUB_ACTIONS) {
        console.log(`::warning file=${line.test.location.file},line=${line.test.location.line},title=Passed only on a retry::${line.name}: ${line.reason}`);
      }
    }
    if (process.env.GITHUB_STEP_SUMMARY) {
      try {
        appendFileSync(
          process.env.GITHUB_STEP_SUMMARY,
          `### Passed only on a retry (${flaky.length})\n\n${lines.map((line) => `- \`${line.name}\` — ${line.reason}`).join("\n")}\n\n`,
        );
      } catch {
        // The summary is a convenience; the log above already has the list.
      }
    }
  }

  printsToStdio() {
    return false;
  }
}
