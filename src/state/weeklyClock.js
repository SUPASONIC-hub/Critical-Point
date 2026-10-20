/**
 * The one place the week's rule asks what time it is.
 *
 * A screen that changes with the calendar is a baseline that breaks on its
 * own: the visual baselines and the e2e assertions are recorded on main, and
 * on the Monday an event week starts the intro and the briefing would carry a
 * line they were not recorded with, main would fail and the deploys behind it
 * would be skipped. So every build the tests play holds this clock still:
 *
 *   - `VITE_WEEKLY_RULE_CLOCK` (an ISO time) pins it. `.env.e2e` sets it for
 *     `npm run build:e2e`, the build the @prod tier and the visual run play,
 *     and scripts/run-e2e.mjs sets it for the dev server it starts. The
 *     deployed build has no such variable and reads the device's clock.
 *   - A pinned build also reads `globalThis.__weeklyRuleClock` (an ISO time or
 *     milliseconds), so the one e2e test of an event week can set it with
 *     `page.addInitScript` without touching the other tests. A build that is
 *     not pinned never looks at it.
 *   - Outside Vite (`import.meta.env` undefined: `npm test`, the season bots,
 *     the check scripts) the clock is held on the same pin. A unit test of
 *     `newGame` would otherwise stamp a rule in an event week and fail on
 *     main that Monday, which is the same trap one level down.
 *
 * Only the week's rule reads this. The table clock, the save stamps and the
 * telemetry keep `Date.now()`, so nothing else a test measures moves with it.
 *
 * `E2E_WEEKLY_RULE_CLOCK` is the pin both files have to name; the unit test
 * reads them and fails when either drifts, and fails when the pin's week has a
 * rule in the calendar.
 */
export const E2E_WEEKLY_RULE_CLOCK = "2026-01-07T12:00:00+09:00";

function toMs(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value === "") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

// Vite replaces `import.meta.env` in every build and in the dev server; node leaves it undefined.
// Only the one key is read off it: a build writes `import.meta.env` whole as an
// object literal in each module that names it bare (every VITE_ variable, 250
// bytes in the e2e build), and the entry chunk already carries two.
const NODE_ENV = Object.freeze({ VITE_WEEKLY_RULE_CLOCK: E2E_WEEKLY_RULE_CLOCK });
const viteEnv = () => (import.meta.env ? { VITE_WEEKLY_RULE_CLOCK: import.meta.env.VITE_WEEKLY_RULE_CLOCK } : NODE_ENV);

/** The pinned time a test build reads, or null in a build that reads the device. */
export function pinnedWeeklyClock(env = viteEnv()) {
  return toMs(env?.VITE_WEEKLY_RULE_CLOCK);
}

/** Now, as the week's rule reads it. */
export function weeklyRuleNow({ env = viteEnv(), scope = globalThis, now = () => Date.now() } = {}) {
  const pinned = pinnedWeeklyClock(env);
  if (pinned === null) return now();
  return toMs(scope?.__weeklyRuleClock) ?? pinned;
}
