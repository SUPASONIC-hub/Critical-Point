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
axes and found 18 issues. All of them are now applied -- P-2 in the form the
measurements pointed at rather than the two mechanisms it suggested, which is
set out under "P-2, measured" below.

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

### P-2, measured (2026-09-03, second pass)

P-2 asked for two mechanisms and listed three pieces of evidence. The two
mechanisms were built and measured; the third piece of evidence turned out to be
the one carrying the weight, and that is what shipped.

**Shipped: the art is sized to the slot it is painted into.** The key visual was
a single 1,672px file used both as the intro backdrop and as the hero, so a
phone downloaded 146KB for a 356px slot, twice over once the responsive hero was
added. Each of the ten scene, ending and key-visual images now also exists at
480px and 960px, and the intro backdrop, the hero, the play scene and the ending
visual all pick by media and pixel density. The variants were re-encoded through
Chromium's own webp encoder, so this needs no image toolchain.

    first load     desktop 873KB -> 776KB      phone 890KB -> 744KB
    key visual     146KB -> 49KB desktop, 17KB phone
    play screen    desktop 326KB -> 194KB      phone 336KB -> 86KB

`npm run check:art` holds the variants and their byte budgets.

**Not shipped: lazy CSS chunks.** Splitting `play.css` into the screen chunk cuts
`index.css` from 155KB to 102KB (27.5KB to 19.0KB gzipped). Measured twice, from
both directions. With `@layer`, which is the only way load order can carry the
cascade, layers outrank specificity and not just order, so conflicts specificity
used to settle get rewritten: `.intro p { font-size: 20px }` in the base layer
lost to `.play-style-unlock { font-size: 12px }` in extensions purely because
extensions is a later layer, and seven computed styles changed on the intro
alone. Without layers, comparing every element's computed style across six
screens before and after found 101 (element, property) differences: the intro and
ranking screens read rules that live in `play.css` (`.panel-title-row` and its
children), and on the play screen the overrides `result.css` and
`extensions.css` apply to `.scene`, `.game-board` and the effect chips invert.
Clearing that means relocating some forty rules and then permanently owing the
rule that a screen file outranks the override layer. 8.5KB gzipped does not buy
that. Doing it properly means either flattening the five files into one
order-independent set, or a build step that emits per-screen CSS and proves
rule-for-rule equivalence.

**Not shipped: deferring the scene graph.** Stubbing every authored Korean string
in `src/nodes/`, `gameData.js` and `gameDialogue.js` takes the entry chunk from
348KB to 261KB, 115.7KB to 85.2KB gzipped. That 30KB is real, but the graph is
read synchronously at module scope by `AppContent`, both validation scripts and
the e2e helpers, and `AppContent` renders the intro, so nothing can be deferred
until the graph becomes async and every one of those readers is rewritten around
it. That is a larger and riskier change than the 30KB justifies today.

## Second audit (2026-09-03), applied

`docs/design-audit-2026-09-03-followup.md` re-measured the app after the first
pass landed and found nine things. All nine are applied.

- **Commit console (U-1).** It opened 1,639px down an 844px phone screen and took
  700ms of smooth scrolling to arrive; a tap during that landed on whatever slid
  past. It is fixed to the viewport on a phone now and opens at 726px, moving
  only for its 0.18s animation. The commit itself was always 44ms.
- **Choice ids (D-1).** 25 ids were shared between scenes and voice lines are
  keyed by id, so 89 of 304 spoken lines came from another decision. The 68
  colliding ids carry their scene as a prefix and 44 new lines were written for
  the decisions that had been borrowing. Every fixed choice now has authored
  copy; twelve had none before.
- **Case openings (D-2).** The 15 openings cloned the base scene's choices down
  to their ids, so the branch the previous case earned changed only the
  paragraph on top. Each now has its own ids and a fourth option that exists
  only on that branch.
- **Cognitive spread (S-1).** `cognitionScore` returned 100 for every strategy
  measured. It is normalised entropy over the four ways of thinking now: one
  repeated approach scores 0, an even spread across all four scores 100, and the
  five fixed strategies land between 25 and 84.
- **Consistency (S-2).** The axis spanned 21 to 49, so 28% of the score moved the
  total by eight points. Direction changes are counted directly and decisions
  under pressure weigh triple: a run that holds one line now scores 100 and one
  that oscillates scores 2.
- **Reflection (S-3).** Opening a hidden record counts toward it, so a player who
  never uses free text is no longer starting a fifth of the score at zero.
- **humanCost per case (D-3).** The floor in `check-balance` is per case rather
  than season-wide, and case 03 and the final case were filled to it: coverage
  now runs 44% to 70% instead of 25% to 65%.
- **Status board (U-2).** The turn brief folds like the five drawers under it and
  the resource list is gone from it entirely -- the rail above the choices is
  its one home. The board is 413px instead of 820px and the mobile play screen is
  3,906px, down from 5,775px before either pass.
- **Art variants (O-1).** `npm run build:art` regenerates them, so the procedure
  `check:art` enforces is a command rather than a paragraph.

One check changed shape while doing this. `check-balance` used to require each
column to end a case strictly best on some resource; it now requires that no
column is Pareto-dominated. That is the property the file exists to protect, and
it does not misfire when two columns both cap a resource at 100.

## Third audit (2026-09-03), applied

`docs/design-audit-2026-09-03-round3.md` found eight things. Seven are applied;
the eighth is a refactor with its own shape, described at the end.

- **The failure ending can happen (E-1).** `collapse` asked for pressure 82 or
  humanCost 70 while resources reset at every case start, so a single case peaked
  at 33 and 31 across 4,000 runs. The ruling reads the season now: the human cost
  each case ended on, added up, and the highest pressure any case reached. Case
  summaries carry `finalHumanCost` and `peakRiskPressure` for it. Thresholds are
  52 peak pressure or 150 season human cost -- reached by a run that keeps
  offloading cost, or by one that protects everyone until nothing is left.
- **FIELD PACT can happen (E-2).** It asked for high trust with low legitimacy,
  which the final case could not produce because its two rise together. It
  compares them against each other now, and `f_confront` gained the one route in
  the last case that buys trust with legitimacy.
- **The fallback ending reads the run (E-3).** A quarter of runs reach it and it
  was one line for all of them. It has three forms, named for whichever of trust,
  legitimacy or capital the run ended holding.
- **No dead choices (D-1).** 11 choices lost to a sibling on every axis. Each was
  given the thing its own label is good at, and `check-balance` now runs its
  domination test inside every scene as well as between the columns of a case.
- **Every choice has its own line (D-2).** 45 branch-opening lines were written,
  so the three openings of a case no longer say the same sentences: all 320
  choices now have a unique voice line and a unique echo reply, up from 274.
- **The commit console stops covering the board (U-1, U-2).** Its observer
  preview and resource forecast fold behind a summary, the title row and the
  stacked action buttons collapse on a phone, and it is 213px instead of 356px --
  one card behind it instead of two including the one just selected. The page
  padding while it is open drops from 60dvh to 34dvh.

`npm run check:endings` is new: it walks 6,000 random seasons and fails if any of
the nine endings has become unreachable, which is the shape of bug that hid two
of them.

**Still open: M-1, splitting the intro out of AppContent.** The entry chunk is
453KB of source, of which AppContent is 98KB, gameData 62KB and gameDialogue
22KB. Nothing can be deferred while AppContent renders the intro, because its
import graph is what pulls the scene graph into the first load. The change is to
move the play and result derivations into a runtime component that mounts after
the intro, leaving a shell that owns pre-start state. That is a session of its
own, not a step inside another one, and the 30KB gzipped it would recover does
not justify doing it carelessly at the end of a long pass.

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
13. Ship art at the width it is painted at. `src/responsiveArt.js` lists the
    images that have 480px and 960px variants and builds the `srcset` for them;
    `npm run check:art` fails when a variant is missing or has crept back up
    toward the original's weight. Regenerate variants by drawing the original to
    a canvas at the target width and reading back `toDataURL("image/webp", 0.82)`
    -- the browser is the encoder, so there is no image toolchain to install.
14. Keep anon's read rules on the table, not in a view. `playtest_sessions` pairs an RLS policy (completed season rows) with a column-level grant (no `decision_log`, `session_id` or `id`), so `public_rankings` can stay `security_invoker = true` and any future reader inherits the same limits. A `security_definer` view would work too, but it moves the whole boundary into the view body and Supabase's advisor flags it as critical.

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
