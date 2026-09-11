# Critical Point Work Status

Last updated: 2026-09-09

This file holds what is true now: the shape of the project, the rules a change
has to keep, and the commands that prove it. What changed and why is in
`docs/changelog/`.

## Current State

- Core verification passes with `npm run verify`.
- The play screen is 2,370px on a 390x844 phone and the report 3,081px; they were
  3,953px and 10,616px before the 2026-09-09 layout pass. Both numbers are held
  by budget tests in `tests/visual-regression.spec.js`.
- The whole app shares the intro's night ground; panels stay light. Lime is the
  accent for the control that records a decision.
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
17. Run heavyweight E2E and raster comparison separately from default PR
    verification because browser raster differences can be environment-sensitive.
    Only the `@visual` screenshot tests are separate, though. The measurement
    tests in `visual-regression.spec.js` -- viewport reachability, the intro
    reading budget, horizontal overflow -- run in the default e2e list with
    `--grep-invert @visual`. They were in neither list once, so nothing ran
    them: the intro could have grown back past its budget with every gate green.
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
    means the checks were passing on a major the deploy never built with.
    `npm run check:node` is the ratchet: it rejects an inline `node-version:`,
    a pin that is not an exact x.y.z, a job that runs npm with no setup-node, a
    `NODE_VERSION` in `render.yaml`, and an `engines.node` naming another
    major.
22. Add schema changes as new files in `supabase/migrations/` so the remote migration history stays authoritative. Never edit the applied baseline in place.
23. Never name a PL/pgSQL variable after a column of a table the same function writes to. `validate_telemetry_insert` did, and the resulting `42702` ambiguity blocked every telemetry insert. Prefix locals with `v_`.
24. The intro's primary action starts the run. One click from a cold load
    reaches a choice, with the default analyst name and no setup interaction;
    when a save exists that same slot resumes it in one click. Nothing that
    merely scrolls or focuses may take that position again, and no test may
    assert that it does -- one did, and three cycles polished the copy of a
    button that did not start the game rather than open the door. The setup
    console keeps its fields and stays expanded; everything optional folds.
25. Keep anon's read rules on the table, not in a view. `playtest_sessions` pairs an RLS policy (completed season rows) with a column-level grant (no `decision_log`, `session_id` or `id`), so `public_rankings` can stay `security_invoker = true` and any future reader inherits the same limits. A `security_definer` view would work too, but it moves the whole boundary into the view body and Supabase's advisor flags it as critical.
26. Every procedural cue reads the mute preference before it touches the audio
    graph. `playOpeningAccent`, `playTargetLockCue` and `playDecisionRevealCue`
    all open with that check -- the start accent lost it once and played for
    someone who had muted. A cue that can only fire mid-run may bail when the
    shared `AudioContext` is missing; one that can fire on the first click has
    to build it inside the gesture instead.
27. One decision, one screen. `PlayScreen.jsx` renders the scene, the clock,
    the three standing resources and the choices; everything else belongs in
    `RecordRoom.jsx`, behind one door. The phone budget in
    `visual-regression.spec.js` is the ratchet -- the screen was 3,953px for one
    of forty-two decisions before this rule existed. A new panel in front of the
    choice is the change this rule exists to stop.
28. The report is three acts. The ending, the rank and the next case are the
    first screen; `왜 이렇게 됐나` answers with three cards; everything else is
    inside `.report-archive`. It reached 10,616px on a phone -- twelve and a half
    screens as the reward for finishing -- by growing one named region at a time.
29. Numbers stay behind `전술 정보`. The choice cards print the qualitative
    trade-off; the resource deltas, the observer preview and the risk hint are
    all gated on `showTacticalDetails`, because the screen promises the player
    can judge on the scene first and the chips used to render regardless. The
    risk hint went back behind the gate on 2026-09-10; it had been printing on
    every card. Closed, a card carries no exact number at all; open, `· 위험 +N`
    is the one figure the gate hands over, and season-flow asks for exactly that
    -- it subtracts the risk hint by name rather than dropping the check, so any
    other signed number appearing behind the gate still fails.
    Settled on 2026-09-11, after the scan had held the test red since `f66347e`:
    the four choice ordinals are the visible half of each button's
    `aria-keyshortcuts`, not numbers about the case, so they carry
    `.choice-shortcut` and the scan skips them. The board is back to the two
    standing numbers `GameHeader` promises -- which case, and how far in --
    against a budget of 5. The budget was not the thing that was wrong, so it
    did not move.
30. Lime is the accent for one thing at a time. `--c-acid` marks the control
    that records a decision and the active step of the decision rail; a note, a
    quote or a heading gets a lime rule at most. Four lime fills on one screen is
    the state this rule was written after.
31. A phase is player copy. `node.phase` prints on the scene chip and in the
    mission strip, so it names a story beat -- never the function that generated
    the node. "CONNECTIVE SCENE" shipped for weeks.
32. A roguelike buff the player cannot see is not a buff. The reducer banks
    reboots, the permanent multiplier they buy and the resources the push
    multiplier added; `PressureLedger` is where all three are read, mounted in
    the record room mid-run and in `.report-archive` after it. It is rebuilt
    from the decision log, never from reducer state -- the log survives a reload
    and the reducer does not, so a ledger read off state would zero itself on a
    resumed run. This is the decision the `ResultScreen` budget move (975 -> 977
    lines, 13 -> 14 imports) was made for.

## Verification Commands

```bash
npm run verify
npm run test:visual
```

`npm run verify:static` is seventeen checks: lint, CSS format, unit and smoke
tests, encoding, text, CSS tokens, CSS structure, graph, dialogue, balance,
endings, art, view contracts, constants, the runtime budget, the visual
baselines and the Node pin. None of them needs a browser, which is what lets
the deploy build run them.

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
