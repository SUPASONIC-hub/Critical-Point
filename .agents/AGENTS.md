# Critical Point Agent Team

This directory defines the autonomous improvement loop for the game.

## Non-negotiable boundaries

- Work only inside the repository and the current run directory.
- Never commit, push, reset, checkout, or discard user changes.
- Never expose, print, or read secrets from `.env`, Supabase credentials, or CI secrets.
- Never apply a remote database migration. The DBA may add a migration file; a human
  or deployment pipeline applies it after review.
- Never install packages or change lockfiles during an agent cycle.
- Keep changes small enough for QA to verify in one cycle.
- Every claim in an artifact must point to a file, command, test, or explicit assumption.

## Cycle contract

The cycle runs in this order:

1. PM: choose one measurable product outcome.
2. Planner: turn it into an implementation slice and acceptance criteria.
3. Design: define interaction, visual, accessibility, and responsive behavior.
4. Sound: define audio feedback and fallback behavior using existing assets first.
5. DBA: inspect telemetry and persistence impact; add a migration only when required.
6. Developer: implement the approved slice and focused tests.
7. QA: run focused checks plus the appropriate project verification tier.

Agents communicate through markdown files in the run directory supplied by the
orchestrator. The developer must read all upstream artifacts before editing. QA
must report failures instead of weakening a test or silently skipping a check.
