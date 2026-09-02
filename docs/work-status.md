# Critical Point Work Status

Last updated: 2026-09-02

## Current State

- Core verification passes with `npm run verify`.
- Visual regression is separated into `npm run test:visual` and a dedicated GitHub Actions workflow.
- Save/recovery, telemetry retry, full season flow, accessibility, contrast, and visual baselines are covered by automated tests.
- `작업지시서.md` is preserved as a historical artifact, but its text is mojibake and cannot be restored by a simple encoding conversion.

## Maintenance Priorities

1. Keep `AppContent.jsx` focused on orchestration and move screen contracts into `src/viewModels`.
2. Route guarded button behavior through `GuardedButton` instead of repeating `aria-disabled`, `tabIndex`, and click guards.
3. Put reusable Playwright flow behavior in `tests/helpers/gameFlow.js`.
4. Keep CSS token checks budget-based so design drift is caught before it reaches screenshots.
5. Run visual regression separately from the default PR verification because small font/image raster differences can be environment-sensitive.

## Verification Commands

```bash
npm run verify
npm run test:visual
```
