# Critical Point Work Status

Last updated: 2026-09-04

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

**Applied: M-1, splitting the intro out of AppContent.** `AppContent.jsx` is now a
376-line pre-start shell; `GameRuntime.jsx` (2,402 lines) owns the play and result
derivations and mounts lazily once a run starts, is resumed, or a debug/replay
entry asks for it. `src/state/errorRecovery.js` carries the silent-failure
reporting both files need.

    entry chunk    124KB gzip (at f360e19) -> 31.6KB gzip, 83KB raw
    entry sources  47 files -> 19; gameData, gameDialogue and gameLogic are gone
    AppContent     2,387 lines -> 376, plus GameRuntime at 2,402 (+391 total)

The line total grew because the shell assembles its own intro view bag, which the
runtime also assembles for the intro it still renders after a run pauses back to
the menu. That duplication is the price paid for the 90KB, and it is the first
thing to clean up next.

What the shell cannot compute without the graph, it does not render: the season
journey, the past-run memory and the debug console are absent from the shell
intro rather than faked, which is the rule the task was written around. One field
had broken that rule -- the storage banner was a four-line stub in the shell that
ignored consent and offline state, so three of its four states printed the wrong
sentence on a deployed build. `createTelemetrySummary` moved from
`viewModels/reportViewModels.js` to `viewModels/appViewModels.js` and both callers
share it again; the intro baselines are back to their pre-split height of 6,632px.

Verified: `verify:static` (11 checks), `npm run build`, `test:runtime`,
`npm run test:e2e` (110 passed) and `npm run test:visual` (5 passed).

## Follow-ups from the M-1 review (2026-09-03)

Five findings came out of reviewing the intro split. All five are applied; one of
them is applied as a measurement and a "no", which is set out below.

- **One intro, assembled once (M-2).** `AppContent.jsx` and `GameRuntime.jsx` each
  built the intro's 82-field bag, and 23 of the shell's fields were placeholders.
  `src/viewModels/introViewModel.js` builds it now: constants imported once,
  shared values derived once, and `INTRO_FIELDS_WITHOUT_RUNTIME` (in
  `appViewModels.js`) naming the 18 fields the shell cannot supply along with the
  empty value it shows instead. The storage keys, `formatSaveTime`, `limitText`,
  `makeEmptyScores`, `createRunId`, `debugToolsEnabled`, the game title constants,
  `normalizeCaseSummary` and `getCaseStatusText` were all declared twice and now
  have one home. AppContent is 278 lines and GameRuntime is 2,356, down from 376
  and 2,402. The intro also stopped guessing: the shell reads the New Game+ memory
  and the previous participant's message from storage instead of showing nothing,
  lists the completed cases it can build from the save, and the resume card prints
  the case and the save time rather than a raw node id and "진행률 0%".
- **The contract check knows there is one assembler (V-1).** `check-view-contracts`
  fails if a screen's bag is built in two files, if it is built somewhere other
  than the file that owns it, or if `INTRO_FIELDS_WITHOUT_RUNTIME` names a field
  the intro does not have. Verified by making it fail on purpose.
- **The e2e runner checks that the server is its own (T-1).** `--strictPort` makes
  vite exit when the port is taken, and `waitForServer` then attached to whatever
  else was answering -- a leftover `vite preview` on 5197 made three visual tests
  time out for 60s each with no explanation. The runner now fails in four seconds
  with the reason, having asked the server for `/@vite/client`.
- **The session code is out of the baselines (T-2).** It is regenerated per browser
  context, so two intro baselines and the result baseline carried eight glyphs of
  noise that only passed because of the pixel budget. It is hidden by
  `stabilizeVisualPage` through `data-testid="session-code"`.
- **Per-screen CSS: measured, not shipped (P-3).** With the intro on its own chunk,
  the question was whether the play and result stylesheets could leave the first
  load. Measured against the running app: the intro reads 3 selectors from
  `play.css` and 22 from `result.css`, the play screen reads 65 from `result.css`,
  and `extensions.css` splits cleanly (32 shell selectors, 60 play selectors, no
  overlap). The blocker is not the count but the shape: the media blocks group
  selectors across screens on purpose -- one rule sets the padding of
  `.brand-row`, `.topbar`, `.game-header`, `.start-input-row` and `.top-actions`
  together -- so splitting per screen copies declarations rather than moving them.
  Those blocks moved out of the bottom of `result.css` into
  `src/styles/app/responsive.css`, in the same cascade position, and the intro
  rule that had been living at the end of `result.css` moved to
  `base-intro-ranking.css`. Computed styles across six screen states are
  byte-identical before and after. `check-css-structure` lost its place at a
  comment written in front of an at-rule and had been swallowing the rest of the
  file; with that fixed the true counts are 9 selectors with two homes and 53
  repeats, not 8 and 51.

## What the screen says about a choice (2026-09-04)

Playing a season and reading every sentence the game prints about a button found
three ways the description had come apart from the decision.

- **One rule for what a number means.** `humanCost` and `fatigue` are the two
  resources where a rising number is the loss. The effect chips knew that; the
  four surfaces that summarise the same effect did not, and split by sign: the
  line above the chips, the reveal's opened/closed columns, the reveal's closing
  sentence and the result ledger. 56 of 495 choices were announced as winning a
  rising 사람 피해. All four call `isResourceGain()` now, and sort by
  `byEffectWeight` so the sentence names the resource that actually moved rather
  than whichever key the effect object listed first.
- **Particles agree with the word in front of them.** Runtime-built sentences had
  the particle baked into the format string, so the play screen printed
  "사람 피해을" and the reveal printed "신뢰이 올라간다". `playerLanguage.js` owns
  `endsOnConsonant` and the three particle helpers; numbers follow the Korean
  reading of the last digit, so 2/4/5/9 take 를 and anything ending in 0 does
  not. `gameLogic`'s private `getSubjectParticle` was the same function and is
  gone, along with the two extra resource-label tables that had the reveal
  calling 믿음 "신뢰" one line under a chip that said 믿음.
- **Lines answer the button they sit under.** Generated scenes take copy from an
  array matched to the labels by position, with nothing tying the two together.
  When the 15 connective scenes' labels were rewritten the tables stayed behind,
  so "살아남을 돈을 먼저 확보한다" spoke "근거와 책임자를 같은 문서에 공개하겠습니다";
  `c3_rival` and `c5_verdict` had two lines each straight swapped. The 18 reaction
  scenes were all correct. The connective tables are rewritten against the labels
  now.

`npm run check:dialogue` is new: it walks the 36 generated scenes and fails when
another voice line in the same scene answers a label better than the one assigned
to it. Korean marks grammar with endings, so it compares stems. Only voice lines
are checked -- an echo argues from what the choice gave up, which is often the
sibling's subject, and both arrays live in the same table entry. Verified by
restoring the old table: it catches seven of the misassignments including both
swapped pairs.

`run-e2e.mjs` reads `E2E_PORT`. It already refused to test against a server that
was not its own, but had no way out of a taken port, so two checkouts of this
repo on one machine could not both run verification. The improvement pass below
went further and made a free port the default, so `E2E_PORT` is now the override
for the cases that need a known address rather than the escape hatch.

## Improvement pass (2026-09-04)

Six things, all applied. What each one measured is below; the running history is
in `docs/changelog/`.

- **The visual workflow could not have passed once (CI-1).** Only `win32`
  baselines were committed and the job ran on `ubuntu-latest`, so Playwright
  looked for `-chromium-linux.png` and reported five missing snapshots on every
  push to main and every Tuesday cron. The job runs in
  `mcr.microsoft.com/playwright:v1.62.1-noble` now, so the renderer is pinned as
  tightly as the code; `@playwright/test` is pinned exactly to match the tag, and
  `npm run check:visual-baselines` fails if the two disagree, if a CI platform
  has no baseline, or if a baseline belongs to no screenshot. A
  `workflow_dispatch` input records the Linux set and pushes it to a branch --
  they cannot be produced from Windows, so **the Linux baselines still have to be
  recorded once before that job can go green**, and `check:visual-baselines` is
  deliberately out of `verify:static` until they land.
  `snapshotPathTemplate` is also spelled out in `playwright.config.js` rather
  than left to the default, since the platform token is the whole issue.
- **App.jsx was outside the M-1/M-2 split (C-1).** It carried a third
  `debugToolsEnabled` (without the `?? {}` guard the shared one has, so it
  returned `undefined` rather than `false`), a second `DEBUG_RENDER_CRASH_KEY`
  literal, a hardcoded `caseSequence` nothing imported, and one sentence written
  twice -- once in Korean and once as thirteen unicode escapes -- which the panel
  could print twice in a row. All now come from `appConfig.js`.
  `npm run check:constants` is the ratchet: no file may redeclare a name a home
  module exports, and no storage-key literal may be written down twice.
- **A leftover dev server was answering the test suite (T-3).** The e2e runner
  pinned port 5197. T-1 taught it to reject a squatter that is not a vite dev
  server, but another checkout's dev server passes that probe, so the suite could
  test a different working tree and pass. Found live: a server from 13:47 was
  still holding 5197 and served two runs of `test:visual`. The runner asks the OS
  for a free port now, which removes the collision rather than detecting it.
- **The test files run under `node:test` (T-4).** 1,229 lines of flat assertions
  stopped at the first failure, so one regression hid the other 225. All 213 are
  named cases now -- names taken from the assert messages they already carried --
  and the assert count is unchanged (225 + 24). Verified by breaking two on
  purpose: 2 failed by name, 211 still ran. One counter that was incremented in
  one assertion and read by the next is derived at module scope instead.
- **GameRuntime has two seams cut out of it (M-3).** `useResultReport` (the
  closing report's twenty derivations) and `useCaseSystems` (the thirty-six
  evidence, hypothesis, relationship and chapter derivations) are hooks now, with
  their free variables computed from the AST rather than read off by eye.
  `useMemo` went 26 to 18 and imported names 220 to 173.
  `npm run check:runtime-budget` holds the line: lines, imports, and each hook
  kind, plus the three view bags. Ratchet them down, never up.
- **The intro's CSS no longer waits for the play and result screens (P-4).**
  P-2 and P-3 both measured splitting the stylesheet per screen and said no,
  correctly: the files are a cascade and moving a rule changes what wins.
  Inlining adds instead of moving -- the full sheet still loads, in the same
  order, with the same contents, so the settled cascade is unchanged by
  construction and a miss is a flash rather than a wrong screen.

      render-blocking bytes    28.5KB gzip -> 8.0KB gzip
      critical CSS             29.0KB of 153.6KB, inlined
      full sheet               unchanged, media="print" until onload

  `npm run build:critical` measures it with Chromium's CSS coverage at both
  baseline viewports and then proves the claim: with the deferred sheet blocked,
  eleven intro elements compute identically to the full sheet across fourteen
  properties. The output is committed, like the art variants, because the deploy
  environment has no browser. It records the hash of the sheet it was cut from
  and `vite.config.js` fails the build when they differ -- a rule-by-rule guard
  was tried first and could not see a rule being *added*, which is exactly the
  change that brings the flash back.

Not done, and left for the owner to decide: the branch
`worktree-next-improvement` holds one unmerged commit (`2a084b0`, effect-chip
signs and Korean particle agreement). The stale worktree that was checked out on
it is gone; the branch and its commit are untouched.


## What a choice gives (2026-09-04)

Every authored gain went up by a tenth, never by less than one point, and no cost
moved. 914 gains across 449 effects, applied by `scripts/raise-choice-gains.mjs`
so that the rule is one line of code rather than 914 hand edits.

The map is `magnitude + max(1, round(magnitude / 10))`, which is strictly
increasing and therefore cannot invent a domination: on any one resource the
order between two siblings comes from comparing their values, and raising the
gains while fixing the costs preserves every one of those comparisons -- a gain
still beats a cost, a bigger gain still beats a smaller one, equal stays equal.
Being injective it also cannot collapse two effect vectors into one, so the
uniqueness floor is untouched. `check:balance` reports the same four numbers it
did before: 495 choices, 86% unique, humanCost on 56%, 86 fatigue recoveries.

What it does move is the season. Measured over the same 36,000 case-ends
`check-endings` walks, from the same seed:

                    average           at the 100 cap
    trust           56.9 -> 60.4      0.0% -> 0.7%
    legitimacy      68.3 -> 72.3      4.2% -> 8.1%
    capital         86.3 -> 86.6     16.0% -> 17.5%
    humanCost        8.0 ->  7.7     (at zero) 24.8% -> 27.4%
    fatigue         34.5 -> 33.6

All nine endings are still reachable, but the ones that need a run to end badly
got thinner, because a season that gains more ends higher: `evidence-reform`
10.5% -> 7.5%, `profitable-silence` 1.9% -> 1.1%, `cold-justice` 2.2% -> 1.6%,
`field-pact` 0.3% -> 0.2%, while `open-oversight` went 27.8% -> 31.0%.
`field-pact` is now twelve seasons in six thousand. The sampling is seeded, so
that number is stable rather than lucky, but it is the figure to watch: another
uplift of this size is the one that would take it to zero, and
`npm run check:endings` is what would say so.

The two play-screen baselines were re-recorded. The differing pixels are
confined to the choice list -- y 1901-2704 of 2867 on desktop, y 2233-3310 of
3907 on mobile -- which is the effect chips and nothing else.

## Maintenance Priorities

1. Keep `AppContent.jsx` as the pre-start shell and put gameplay orchestration in `GameRuntime.jsx`.
   The shell must not fabricate a field the runtime derives. Anything the intro cannot compute without
   the scene graph is left unrendered; anything it can compute comes from the same helper the runtime
   calls, not from a copy of it.
2. Keep browser-storage ownership in focused hooks such as `useAppPersistence` and `useLocalRanking`.
3. Route guarded button behavior through `GuardedButton` instead of repeating `aria-disabled`, `tabIndex`, and click guards.
4. Put reusable Playwright flow behavior in `tests/helpers/gameFlow.js`.
5. Keep CSS split by surface under `src/styles/app/`; preserve import order in `src/styles/app.css`.
6. Keep shared data constants in `src/gameConstants.js` and larger narrative graph data in `src/gameData.js`.
7. Keep CSS, text, and graph checks budget/schema-based so content drift is caught before it reaches screenshots.
8. Run heavyweight E2E and visual regression separately from default PR verification because browser raster differences can be environment-sensitive.
9. Add schema changes as new files in `supabase/migrations/` so the remote migration history stays authoritative. Never edit the applied baseline in place.
10. Never name a PL/pgSQL variable after a column of a table the same function writes to. `validate_telemetry_insert` did, and the resulting `42702` ambiguity blocked every telemetry insert. Prefix locals with `v_`.
11. One rule decides whether a number was good for the run. `isResourceGain()` in
    `src/gameConstants.js` is that rule, and every surface that prints an effect asks
    it rather than comparing to zero -- `humanCost` and `fatigue` read backwards
    otherwise. Sort with `byEffectWeight` before naming a resource in a sentence.
12. Never bake a Korean particle into a format string. `endsOnConsonant`,
    `objectParticle`, `subjectParticle` and `topicParticle` in `src/playerLanguage.js`
    agree with whatever the sentence actually ends on, digits included.
13. Authored copy tables are matched to their labels by position. Editing one list
    means editing the other; `npm run check:dialogue` is what catches it when that
    does not happen.
14. Keep the balance guardrails honest. `scripts/check-balance.mjs` asserts that
    every choice costs something, that every resource moves both ways, and that
    no choice inside a scene and no column inside a case is Pareto-dominated by
    a sibling. Tune effects against it rather than around it.
15. Keep per-second state out of the root. The decision countdown is an external
    store (`src/state/decisionClock.js`) precisely because root state rebuilt the
    whole play view once a second.
16. Ship art at the width it is painted at. `src/responsiveArt.js` lists the
    images that have 480px and 960px variants and builds the `srcset` for them;
    `npm run check:art` fails when a variant is missing or has crept back up
    toward the original's weight. Regenerate variants by drawing the original to
    a canvas at the target width and reading back `toDataURL("image/webp", 0.82)`
    -- the browser is the encoder, so there is no image toolchain to install.
17. Keep anon's read rules on the table, not in a view. `playtest_sessions` pairs an RLS policy (completed season rows) with a column-level grant (no `decision_log`, `session_id` or `id`), so `public_rankings` can stay `security_invoker = true` and any future reader inherits the same limits. A `security_definer` view would work too, but it moves the whole boundary into the view body and Supabase's advisor flags it as critical.

15. Constants have one home. `src/appConfig.js`, `src/gameConstants.js` and
    `src/gameCases.js` own the shared values; nothing else declares a name they
    export, and no storage-key literal is written down twice.
    `npm run check:constants` enforces both.
16. Keep `GameRuntime.jsx` under its budget. New derivations go into a hook of
    their own -- `useCaseSystems` and `useResultReport` are the pattern -- not
    into the component body. `npm run check:runtime-budget` holds lines,
    imports, each hook kind, and the three view-bag sizes.
17. The e2e runner takes a free port from the OS. Never pin one: a dev server
    from another checkout answers the `/@vite/client` identity probe, so a
    pinned port lets the suite pass against a different working tree.
18. Regenerate `src/styles/critical.generated.css` with `npm run build:critical`
    whenever a stylesheet changes, and commit it. The build fails otherwise --
    it compares the hash of the sheet the file was cut from against the one it
    just produced.
19. Raise what choices give with `npm run raise:gains`, never by hand: the
    uplift has to stay a strictly increasing function of the magnitude, applied
    to gains only, or it starts inventing dominations that `check:balance` was
    written to catch. Read `npm run check:endings` afterwards -- bigger gains
    end seasons higher and thin out the endings that need a run to go badly.
20. Visual baselines are per platform. A runner added to a workflow needs its
    baselines recorded and committed before that job can pass;
    `npm run check:visual-baselines` says which are missing.
## Verification Commands

```bash
npm run verify
npm run test:visual
```

`npm run verify:static` is fourteen checks: lint, format, tests, encoding, text,
CSS tokens, CSS structure, graph, balance, endings, art, views, constants and the
runtime budget.

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
