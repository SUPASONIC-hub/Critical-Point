# Critical Point Work Status

Last updated: 2026-09-03

## Current State

- Core verification passes with `npm run verify`.
- Fast CI checks and heavyweight E2E checks are split in GitHub Actions.
- Visual regression is separated into `npm run test:visual` and a dedicated label-aware workflow.
- Save/recovery, telemetry retry, season flow, accessibility, contrast, text integrity, graph schema, and visual baselines are covered by automated checks.
- Source text is valid UTF-8. Some Windows shells can render Korean incorrectly, so text integrity is guarded by `npm run check:text` instead of manual terminal inspection.
- The Supabase schema is deployed through CLI migrations in `supabase/migrations/`, not by pasting SQL into the dashboard editor.

## Design Audit (2026-09-03)

`docs/design-audit-2026-09-03.md` measured the graph and the screens across nine
axes and found 18 issues. All of them are now applied except the bundle split
(P-2), which is explained at the bottom of this section.

- Resource design (G-1, G-2). Picking the first column every time used to win
  every axis at once. Effects were rewritten so each archetype pays: people
  first ends broke and tired, procedure first makes someone wait, profit first
  is the only one that gives fatigue back. `npm run check:balance` is the
  ratchet that keeps it true.
- Scene templates (N-1, N-2, N-3). Reaction scenes have their own effect and
  copy tables instead of reusing the connective scene above them, six connective
  scenes carry a case-specific fourth option, and the hidden detours no longer
  all hang off the first column -- two are conditional on the run.
- Screens (U-1..U-4). A sticky resource rail sits above the choices, the
  operator brief and the per-choice secondary lines moved behind the existing
  "판단 근거" toggle, effect chips carry magnitude marks, and free-text signals
  need a written sentence rather than four keywords.
- Scoring and gates (G-3, G-4, G-5). Burst score is led by consistency under
  pressure rather than response rhythm, hidden records have more ways to open
  and one late recovery, and the decision window keeps charging past zero.
- Performance (P-1). The decision countdown lives in `src/state/decisionClock.js`
  outside React state; only the two components that print it subscribe per
  second, and the root subscribes to a coarse phase.

Not applied: P-2 (bundle and CSS splitting). Both halves need structural work
this pass did not scope. Lazy-loading `play.css` would reorder the cascade that
`src/styles/app.css` documents and `check-css-structure` guards -- `extensions.css`
has to outrank it, and a lazy chunk lands after it. Deferring per-case node
modules needs the scene graph to become async, and every consumer, script and
test reads it synchronously. The audit's own dependency-ordered work queue leaves
P-2 out for the same reason.

## Maintenance Priorities

1. Keep `AppContent.jsx` focused on orchestration and move screen contracts into `src/viewModels`.
2. Keep browser-storage ownership in focused hooks such as `useAppPersistence` and `useLocalRanking`.
3. Route guarded button behavior through `GuardedButton` instead of repeating `aria-disabled`, `tabIndex`, and click guards.
4. Put reusable Playwright flow behavior in `tests/helpers/gameFlow.js`.
5. Keep CSS split by surface under `src/styles/app/`; preserve import order in `src/styles/app.css`.
6. Keep shared data constants in `src/gameConstants.js` and larger narrative graph data in `src/gameData.js`.
7. Keep CSS, text, and graph checks budget/schema-based so content drift is caught before it reaches screenshots.
8. Run heavyweight E2E and visual regression separately from default PR verification because browser raster differences can be environment-sensitive.
9. Add schema changes as new files in `supabase/migrations/` so the remote migration history stays authoritative. Never edit the applied baseline in place.
10. Never name a PL/pgSQL variable after a column of a table the same function writes to. `validate_telemetry_insert` did, and the resulting `42702` ambiguity blocked every telemetry insert. Prefix locals with `v_`.
11. Keep the balance guardrails honest. `scripts/check-balance.mjs` asserts that
    every choice costs something, that every resource moves both ways, and that
    each of the three columns ends strictly best on at least one axis in every
    case. Tune effects against it rather than around it.
12. Keep per-second state out of the root. The decision countdown is an external
    store (`src/state/decisionClock.js`) precisely because root state rebuilt the
    whole play view once a second.
13. Keep anon's read rules on the table, not in a view. `playtest_sessions` pairs an RLS policy (completed season rows) with a column-level grant (no `decision_log`, `session_id` or `id`), so `public_rankings` can stay `security_invoker = true` and any future reader inherits the same limits. A `security_definer` view would work too, but it moves the whole boundary into the view body and Supabase's advisor flags it as critical.

## Verification Commands

```bash
npm run verify
npm run test:visual
```

`npm run verify:static` now includes `npm run check:balance`.

## Database Deployment

The project is linked and `npx supabase db push` reports it up to date. Apply new
schema changes by adding a migration and pushing it:

```bash
npx supabase migration new <name>
npx supabase db push
```

Credentials come from `supabase/.env.local` (`SUPABASE_ACCESS_TOKEN`,
`SUPABASE_DB_PASSWORD`), which is ignored by `supabase/.gitignore`. The CLI cannot run
its browser login flow from a non-TTY shell, so the env vars are the only way to drive
it from an agent session.

Caution: when `link` first created the remote history table it recorded both existing
migrations as applied without executing them -- the schema had been applied by hand in
the SQL editor. The history table therefore reflects what `link` inferred, not what the
CLI ran. Always `db push` before trusting `migration list`, and verify behavior against
the live database when a migration fixes a runtime error.
