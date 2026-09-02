# Critical Point Work Status

Last updated: 2026-09-02

## Current State

- Core verification passes with `npm run verify`.
- Fast CI checks and heavyweight E2E checks are split in GitHub Actions.
- Visual regression is separated into `npm run test:visual` and a dedicated label-aware workflow.
- Save/recovery, telemetry retry, season flow, accessibility, contrast, text integrity, graph schema, and visual baselines are covered by automated checks.
- Source text is valid UTF-8. Some Windows shells can render Korean incorrectly, so text integrity is guarded by `npm run check:text` instead of manual terminal inspection.
- The Supabase schema is deployed through CLI migrations in `supabase/migrations/`, not by pasting SQL into the dashboard editor.

## Maintenance Priorities

1. Keep `AppContent.jsx` focused on orchestration and move screen contracts into `src/viewModels`.
2. Keep browser-storage ownership in focused hooks such as `useAppPersistence` and `useLocalRanking`.
3. Route guarded button behavior through `GuardedButton` instead of repeating `aria-disabled`, `tabIndex`, and click guards.
4. Put reusable Playwright flow behavior in `tests/helpers/gameFlow.js`.
5. Keep CSS, text, and graph checks budget/schema-based so content drift is caught before it reaches screenshots.
6. Run heavyweight E2E and visual regression separately from default PR verification because browser raster differences can be environment-sensitive.
7. Add schema changes as new files in `supabase/migrations/` so the remote migration history stays authoritative. Never edit the applied baseline in place.
8. Never name a PL/pgSQL variable after a column of a table the same function writes to. `validate_telemetry_insert` did, and the resulting `42702` ambiguity blocked every telemetry insert. Prefix locals with `v_`.
9. A view that exposes a filtered subset of a table anon cannot read must stay `security_invoker = false`. The view's own WHERE clause is the security boundary.

## Verification Commands

```bash
npm run verify
npm run test:visual
```

## Database Deployment

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

On a project whose schema was applied by hand before the CLI workflow existed, mark the
baseline as applied once instead of pushing it:

```bash
npx supabase migration repair --status applied 20260902055713
```
