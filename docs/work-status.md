# Critical Point Work Status

Last updated: 2026-09-04

This file holds what is true now: the shape of the project, the rules a change
has to keep, and the commands that prove it. What changed and why is in
`docs/changelog/`.

## Current State

- Core verification passes with `npm run verify`.
- Fast CI checks and heavyweight E2E checks are split in GitHub Actions.
- Visual regression is separated into `npm run test:visual` and a dedicated label-aware workflow.
- Save/recovery, telemetry retry, season flow, accessibility, contrast, text integrity, graph schema, and visual baselines are covered by automated checks.
- Source text is valid UTF-8. Some Windows shells can render Korean incorrectly, so text integrity is guarded by `npm run check:text` instead of manual terminal inspection.
- The Supabase schema is deployed through CLI migrations in `supabase/migrations/`, not by pasting SQL into the dashboard editor.

## Maintenance Priorities

1. Keep `AppContent.jsx` as the pre-start shell and put gameplay orchestration in `GameRuntime.jsx`.
   The shell must not fabricate a field the runtime derives. Anything the intro cannot compute without
   the scene graph is left unrendered; anything it can compute comes from the same helper the runtime
   calls, not from a copy of it.
2. Keep `GameRuntime.jsx` under its budget. New derivations go into a hook of
   their own -- `useCaseSystems` and `useResultReport` are the pattern -- not
   into the component body. `npm run check:runtime-budget` holds lines,
   imports, each hook kind, and the three view-bag sizes.
3. Keep browser-storage ownership in focused hooks such as `useAppPersistence` and `useLocalRanking`.
4. Route guarded button behavior through `GuardedButton` instead of repeating `aria-disabled`, `tabIndex`, and click guards.
5. Put reusable Playwright flow behavior in `tests/helpers/gameFlow.js`.
6. Keep CSS split by surface under `src/styles/app/`; preserve import order in `src/styles/app.css`.
7. Regenerate `src/styles/critical.generated.css` with `npm run build:critical`
   whenever a stylesheet changes, and commit it. The build fails otherwise --
   it compares the hash of the sheet the file was cut from against the one it
   just produced.
8. Constants have one home. `src/appConfig.js`, `src/gameConstants.js` and
   `src/gameCases.js` own the shared values, larger narrative graph data stays
   in `src/gameData.js`, nothing else declares a name they export, and no
   storage-key literal is written down twice. `npm run check:constants`
   enforces both halves.
9. One rule decides whether a number was good for the run. `isResourceGain()` in
   `src/gameConstants.js` is that rule, and every surface that prints an effect asks
   it rather than comparing to zero -- `humanCost` and `fatigue` read backwards
   otherwise. Sort with `byEffectWeight` before naming a resource in a sentence.
10. Never bake a Korean particle into a format string. `endsOnConsonant`,
    `objectParticle`, `subjectParticle` and `topicParticle` in `src/playerLanguage.js`
    agree with whatever the sentence actually ends on, digits included.
11. Authored copy tables are matched to their labels by position. Editing one list
    means editing the other; `npm run check:dialogue` is what catches it when that
    does not happen.
12. Keep the balance guardrails honest. `scripts/check-balance.mjs` asserts that
    every choice costs something, that every resource moves both ways, and that
    no choice inside a scene and no column inside a case is Pareto-dominated by
    a sibling. Tune effects against it rather than around it.
13. Raise what choices give with `npm run raise:gains`, never by hand: the
    uplift has to stay a strictly increasing function of the magnitude, applied
    to gains only, or it starts inventing dominations that `check:balance` was
    written to catch. Read `npm run check:endings` afterwards -- bigger gains
    end seasons higher and thin out the endings that need a run to go badly.
14. Keep per-second state out of the root. The decision countdown is an external
    store (`src/state/decisionClock.js`) precisely because root state rebuilt the
    whole play view once a second.
15. Ship art at the width it is painted at. `src/responsiveArt.js` lists the
    images that have 480px and 960px variants and builds the `srcset` for them;
    `npm run check:art` fails when a variant is missing or has crept back up
    toward the original's weight. Regenerate variants by drawing the original to
    a canvas at the target width and reading back `toDataURL("image/webp", 0.82)`
    -- the browser is the encoder, so there is no image toolchain to install.
16. Keep CSS, text, and graph checks budget/schema-based so content drift is caught before it reaches screenshots.
17. Run heavyweight E2E and visual regression separately from default PR verification because browser raster differences can be environment-sensitive.
18. The e2e runner takes a free port from the OS. Never pin one: a dev server
    from another checkout answers the `/@vite/client` identity probe, so a
    pinned port lets the suite pass against a different working tree.
19. Visual baselines are per platform, and `linux` and `win32` are both
    committed. A runner added to a workflow needs its own set recorded before
    that job can pass -- dispatch Visual Regression with `update_baselines` and
    merge the branch it pushes. `npm run check:visual-baselines` says which are
    missing, and it runs inside `verify:static`.
20. A `run:` step in the Playwright container gets dash, not bash. Say
    `shell: bash` on any step that uses `pipefail`, arrays, or `[[`.
21. Node has one home: `.node-version`. The Render build reads it, and every
    `actions/setup-node` step takes `node-version-file: .node-version` rather
    than a literal. They drifted once -- CI on 24, the file on 22.16.0 -- which
    means the checks were passing on a major the deploy never built with. A
    workflow that hardcodes `node-version:` puts that gap back.
22. Add schema changes as new files in `supabase/migrations/` so the remote migration history stays authoritative. Never edit the applied baseline in place.
23. Never name a PL/pgSQL variable after a column of a table the same function writes to. `validate_telemetry_insert` did, and the resulting `42702` ambiguity blocked every telemetry insert. Prefix locals with `v_`.
24. Keep anon's read rules on the table, not in a view. `playtest_sessions` pairs an RLS policy (completed season rows) with a column-level grant (no `decision_log`, `session_id` or `id`), so `public_rankings` can stay `security_invoker = true` and any future reader inherits the same limits. A `security_definer` view would work too, but it moves the whole boundary into the view body and Supabase's advisor flags it as critical.

## Verification Commands

```bash
npm run verify
npm run test:visual
```

`npm run verify:static` is sixteen checks: lint, CSS format, unit and smoke
tests, encoding, text, CSS tokens, CSS structure, graph, dialogue, balance,
endings, art, view contracts, constants, the runtime budget and the visual
baselines. None of them needs a browser, which is what lets the deploy build
run them.

Two artifacts are generated with a browser and committed, so a deploy needs no
browser to build: `npm run build:art` and `npm run build:critical`. Each has a
guard that fails when its output has gone stale.

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
