# Critical Point Work Status

Last updated: 2026-09-29 (the audit fix pass merged 2026-09-28/29: saves that survive a crash, a restore, a stale tab and an older build; one x1.5 cap on the hand; cloud saves ordered by lineage and addresses kept as salted hashes; one canon for the loan; every hidden route, closing and dealt card reply written case by case; comfort settings on the intro; then the season fetched a case at a time)

This file holds what is true now: the shape of the project, the rules a change
has to keep, and the commands that prove it. What changed and why is in `git
log`: the commit messages here record the state that forced each change, not a
list of the files it touched.

## Current State

- The season is 55 cases: 프롤로그 01-05, 사건 01-49 and the finale
  (`CASE_SEQUENCE` in `src/gameCases.js`). A season deals about 490 decision
  windows, about 9 a case.
- `npm run verify:static` (25 checks, in parallel, ~40s) and `npm run
  verify:quick` pass. The browser tiers run against the production build served
  by `vite preview`, not the dev server.
- The play screen holds one decision on one screen: on a 390x844 phone the page
  is no taller than the viewport and every card sits above the action bar. The
  intro is held under four phone screens (3,376px). Both are in
  `tests/visual-regression.spec.js` and are budgets, not measurements -- ratchet
  them down, never up. The report has no height budget; `.report-archive`
  (`ReportArchive.jsx`) carries its bulk and priority 28 holds its shape.
- The whole app shares one dark "night-shift glass" layer: the `--ui-*` tokens in
  `src/styles/tokens.css` define the surfaces, lines, text steps, radii and
  motion every screen draws from, and no screen paints a light panel on the
  dark ground. Lime is the accent for the control that records a decision.
  Type is one committed Pretendard subset (priority 65), and Hangul wraps with
  `word-break: keep-all`.
- Online save is opt-in and off by default; nothing about a run leaves the
  device until the player turns it on (priority 59).
- The ranking is ordered by a score the server reads off the run's own `final`
  case row and types, and the server decides every timestamp, identity and
  rate a telemetry row claims (priority 60).
- Five comfort settings sit in a folded drawer on the intro's setup console:
  table time, a reading clock that waits, calm effects, no letter keys, a
  still intro (priority 87).
- The app fetches the season a case at a time: the first scene needs the
  index and one case chunk, not all 55 cases (priority 88).
- Fast CI checks and the heavyweight e2e tier are split in GitHub Actions; the
  e2e tier runs on three shards, and the uninterrupted season walk and full
  coverage run weekly. Visual regression has its own label-aware workflow and
  Linux-only baselines.
- Source text is valid UTF-8. Some Windows shells render Korean incorrectly, so
  text integrity is guarded by `npm run check:text`, not by terminal inspection.
- The Supabase schema is deployed through CLI migrations in
  `supabase/migrations/`, never by pasting SQL into the dashboard editor.
- Visual baselines were last recorded on 2026-09-29, after the font, colours,
  copy, the case card's markup and the phone header moved; the comparison
  passes on main (priority 19 says how to record them again).

Still open, on purpose:

- The finale is the one case that is not a pack (priority 74).
- Season length -- about 491 scenes a season, about 46 of them in the 프롤로그 --
  is an authoring decision, not a code problem.
- The calendar does not close: the 프롤로그 is 2023 and the season's weekdays
  are 2026's, so "3년" puts 사건 01 in 2025. 사건 26's committee sits on a
  Sunday, and 사건 49's 화요일 is still to be reconciled with the rest.
- Many voice lines are the card's label with a comma put into it (about 2,500
  when stream F2 counted them), not a line of their own.

## Maintenance Priorities

1. Keep `AppContent.jsx` as the pre-start shell and put gameplay orchestration in
   `GameRuntime.jsx`. The shell must not fabricate a field the runtime derives.
   Anything the intro cannot compute without the scene graph is left unrendered;
   anything it can compute comes from the same helper the runtime calls. The
   shell never repairs the save and never starts a case itself: a roadmap or
   NEW GAME+ press is queued and handed to the runtime
   (`queueRuntimeStartAction`), so opening a case from the roadmap cannot wipe
   the season it belongs to. `repairSavedState()` in `src/state/savedState.js`
   is the one repair helper, and a missing key that equals its default is not a
   repair -- otherwise every reload announced one. A run's starting resources
   come from `createOpeningResources` (`src/state/openingState.js`) and nowhere
   else; the shell, the runtime and the persistence hook all call it.
2. Keep `GameRuntime.jsx` under its budget (1,300 lines, 120 imported names;
   1,242 / 119 today). New derivations go into a hook of their own --
   `useCaseSystems`, `useResultReport`, `useChoiceCommit` (committing a
   decision, with its ranking row and telemetry) and `useRunReadout` (the
   log-derived readouts, memoised) are the pattern -- not into the component
   body. `npm run check:runtime-budget` holds the runtime, `gameData.js` and
   `gameLogic.js`, the play, result and report screens, the stage, and the
   three view-bag sizes. The stage (`src/gauntlet/GauntletStage.jsx`) is 804
   lines and 68 imported names; the hand, the table's notices, press timing,
   the frame variables and the table's numbers are their own modules
   (`GauntletHand.jsx`, `TableNotices.jsx`, `timing.js`, `fxVariables.js`,
   `tableRules.js`). `gameData.js` is 3,566 lines and 20 imported names against
   3,600 / 21; the graph build's last passes live in `src/nodes/sceneBuild.js`,
   which it reads through one namespace import. The ending's copy tables are
   `src/endingCopy.js`, so `ResultScreen.jsx` is held to 340 lines. Line counts
   here are the ones `check:runtime-budget` prints.
3. Keep browser-storage ownership in focused hooks such as `useAppPersistence` and `useLocalRanking`.
4. Route guarded button behaviour through `GuardedButton` instead of repeating
   `aria-disabled` and click guards. A blocked button stays focusable -- no
   `tabIndex={-1}` -- because a keyboard or screen-reader user has to be able
   to reach it to hear why it is blocked.
5. Put reusable Playwright flow behaviour in `tests/helpers/gameFlow.js`. Helpers
   click the way a player does: through the visible control, after it is
   enabled. Every spec takes `test` and `expect` from `tests/helpers/network.js`,
   whose route answers the stub backend and fails a test on any request that
   leaves the machine. A spec that presses a control that asks first accepts
   through `tests/helpers/dialogs.js`: Playwright dismisses an unanswered
   dialog, which turns the press into a silent no-op.
6. Keep CSS split by surface under `src/styles/app/` (nine sheets); preserve
   import order in `src/styles/app.css`. There is no catch-all late sheet any
   more -- `extensions.css` was retired on 2026-09-28 and its rules went home
   -- so a new rule goes to the file that owns its selector, and
   `check:css-structure` holds each sheet's budget and fails on a selector with
   a second home. `comfort.css` is last on purpose, so a tie on specificity
   goes to the player's setting (priority 87). A `transition` never lists
   `box-shadow`, and `check-css-tokens.mjs` allows five hard-coded hex colours,
   the five there are.
7. Regenerate `src/styles/critical.generated.css` with `npm run build:critical`
   whenever a stylesheet changes, and commit it. The build fails otherwise --
   it compares the hash of the sheet the file was cut from against the one it
   just produced. The build inlines that CSS and defers every emitted
   stylesheet with `media="print"`; an emitted external script
   (`assets/deferred-styles-*.js`) flips them back once loaded. Nothing
   executable is inline in `index.html`: the CSP gives scripts `'self'` only
   (priority 66).
8. Constants have one home. `src/appConfig.js`, `src/gameConstants.js` and
   `src/gameCases.js` own the shared values, larger narrative graph data stays
   in `src/gameData.js`, nothing else declares a name they export, and no
   storage-key literal is written down twice. `npm run check:constants`
   enforces both halves. `gameCases.js` owns `authoredNodeOrders`, the scene
   orders as written; `nodeOrders`, the orders the graph build extends with
   generated scenes, comes from `gameData.js`. The storage keys the fix pass
   added are exported constants in `appConfig.js`:
   `critical-point-unreadable-save-v1` (`SAVE_BACKUP_STORAGE_KEY`, local),
   `critical-point-chunk-reload-v1` (`CHUNK_RELOAD_SESSION_KEY`, session),
   `critical-point-board-id-v1` (`BOARD_WRITER_ID_KEY`) and
   `critical-point-accessibility-v1` (`ACCESSIBILITY_SETTINGS_KEY`).
9. One rule decides whether a number was good for the run. `isResourceGain()` in
   `src/gameConstants.js` is that rule, and every surface that prints an effect asks
   it rather than comparing to zero -- `humanCost` and `fatigue` read backwards
   otherwise. Sort with `byEffectWeight` before naming a resource in a sentence.
   A resource is named with its canonical label from `easyResourceLabels` in
   `src/playerLanguage.js` -- 남은 시간, 현금, 믿음, 공정함, 사람 피해, 지침 --
   the words the chips print, never a synonym. Those six are the only
   resources: `applyEffect` (`src/riskLogic.js`) moves only the keys of
   `initialResources`, and only by a finite number, so a misspelt key cannot
   become a seventh resource and a non-number cannot make one NaN.
10. Never bake a Korean particle into a format string. `endsOnConsonant`,
    `objectParticle`, `subjectParticle`, `topicParticle` and `directionParticle`
    (로/으로, which treats a final ㄹ like a vowel) in `src/playerLanguage.js`
    agree with whatever the sentence actually ends on, digits included.
    `npm run check:text` fails on a one-line template that puts a particle
    straight after an interpolation, and reads the particle written after
    every declared name, so a rename that changes the last sound fails there.
11. A choice in a connective or reaction scene is one object: its label, its
    effect, the line the player speaks and the reply (`connectiveScenes` and
    `reactionScenes` on a pack, and the finale's in `gameData.js`). They were
    four lists matched by position, and editing one without the others answered
    a button with another button's line. `npm run check:dialogue` still reads
    the replies' order: a scene fails when some other order of its replies
    answers the labels clearly better than the written one (measured on swapped
    pairs, it catches a little over half). The route, evidence and authored
    scenes' choices keep their lines in `voiceLines` and `echoReplies`, keyed by
    choice id.
12. Keep the balance guardrails honest. `scripts/check-balance.mjs` asserts that
    every choice costs something, that every resource moves both ways, that no
    choice inside a scene and no column inside a case is Pareto-dominated by a
    sibling, that no generated column is more than 90% one cognition --
    cognition is read from the label's phrasing and the effect's dominant axis,
    not from the card's position -- and that no column carries one axis as its
    top gain in more than half of its cards. Tune effects against it rather
    than around it. A scene's cards are dealt in a shuffled order seeded on the
    scene id (`src/nodes/sceneBuild.js`), so position says nothing; the scene
    records `leadChoiceId`, the card it was written to lead with, and the
    adaptive reframe and the relationship bridge follow that card, never
    `choices[0]`.
13. Raise what choices give with `npm run raise:gains`, never by hand: the
    uplift has to stay a strictly increasing function of the magnitude, applied
    to gains only, or it starts inventing dominations that `check:balance` was
    written to catch. Read `npm run check:endings` afterwards.
14. Keep per-second state out of the root. A live decision window -- gauge,
    clock, pushes, staked card -- is `useGauntletWindow` state inside the
    stage, keyed by the window's seed, and the frame loop in `GauntletFx`
    writes CSS variables -- never on the document root, never into React
    state. They are registered as not inherited (`registerFxVariables`) and
    written on the elements that read them, which `FX_READERS` in
    `src/gauntlet/fxVariables.js` lists, and on the stage for the harness; a
    unit test fails when a rule reads one on an element missing from that
    list. The runtime only hears about a
    window when it closes, through `resolveGauntlet`. The table's keys live in
    `useTableKeys`, its forecast derivations in `tableReadout.js`.
15. Ship art at the width it is painted at. `src/responsiveArt.js` lists the
    images that have 480px and 960px variants and builds the `srcset` for them;
    `npm run check:art` fails when a variant is missing or has crept back up
    toward the original's weight. Regenerate variants with `npm run build:art`
    -- the browser is the encoder, so there is no image toolchain to install.
16. Keep CSS, text, and graph checks budget/schema-based so content drift is caught before it reaches screenshots.
17. Keep heavyweight e2e and raster comparison apart from default PR
    verification. The default e2e list is every spec except `@visual`
    (screenshots) and `@season-full` (the uninterrupted walk); the measurement
    tests in `visual-regression.spec.js` and `save-resume.spec.js` are in it.
    The season is walked in eight `@season-segment` tests of seven cases, each
    from a fresh save at its first case, which Verify runs as a job of its own
    on four shards on every push; the rest of the list runs on three. The continuous walk -- the only thing that carries
    resources and flags across all 55 cases -- is `npm run test:e2e:season`,
    run weekly by Full Coverage with `test:e2e:full`.
18. The e2e runner takes a free port from the OS. Never pin one: a dev server
    from another checkout answers the `/@vite/client` identity probe, so a
    pinned port lets the suite pass against a different working tree. With
    `--preview` the probe compares the served `index.html` to
    `dist/index.html` for the same reason.
19. Visual baselines are Linux only, recorded and compared in the digest-pinned
    Playwright container. Record them with `npm run test:visual:docker --
    --update-snapshots`, or dispatch Visual Regression with
    `update_baselines=true` and merge the `visual-baselines/<run_id>` branch it
    pushes. `win32` and `darwin` files are gitignored, and
    `npm run check:visual-baselines` (in `verify:static`) fails on a missing
    Linux baseline, on an orphaned one, and on any other platform's file.
    There is no freshness rule: re-record in the same pass that changes a
    screen's copy, font or colour.
20. A `run:` step in the Playwright container gets dash, not bash. Say
    `shell: bash` on any step that uses `pipefail`, arrays, or `[[`.
21. Node has one home: `.node-version` (an exact x.y.z). The Render build reads
    it, and every `actions/setup-node` step takes `node-version-file:
    .node-version`. `npm run check:node` parses the workflows as YAML and
    rejects an inline `node-version:`, a job that runs npm before (or without)
    its setup-node step, a `NODE_VERSION` in `render.yaml`, and an
    `engines.node` that admits any other major (`">=24 <25"` today).
22. Add schema changes as new files in `supabase/migrations/` so the remote
    migration history stays authoritative. Never edit an applied migration in
    place.
23. Never name a PL/pgSQL variable after a column of a table the same function writes to. `validate_telemetry_insert` did, and the resulting `42702` ambiguity blocked every telemetry insert. Prefix locals with `v_`.
24. The intro's primary action starts the run. One click from a cold load
    reaches a choice, with the default analyst name and no setup interaction;
    when a save exists that same slot resumes it in one click. Nothing that
    merely scrolls or focuses may take that position, and no test may assert
    that it does. The setup console keeps its fields and stays expanded;
    everything optional folds. A case card on the roadmap is an `<article>`
    whose `<h2>` holds the button, and the button's `::after` covers the card,
    so the whole card is still what a pointer presses without a button holding
    a heading and a block (a locked card is `.locked-case`).
25. Keep anon's read rules on the table, not in a view. anon holds no
    table-wide privilege on anything: the grants migration revokes all from
    `anon` and `authenticated` and grants columns back. On `playtest_sessions`
    anon may read `run_tag`, `player_name`, `case_id`, `case_title`,
    `completed_at`, `summary` and `score`, and the RLS policy shows completed
    season rows with `score is not null`. `public_rankings` is
    `security_invoker = true`, ordered by `score` (server-ordered and
    server-typed, not server-computed; priority 60), and
    publishes `run_tag` rather than `run_id` or `session_code`. A
    `security_definer` view would move the whole boundary into the view body,
    and Supabase's advisor flags it as critical.
26. Every procedural cue reads the mute preference before it touches the audio
    graph. `playOpeningAccent`, `playTargetLockCue` and `playDecisionRevealCue`
    all open with that check. A cue that can only fire mid-run may bail when the
    shared `AudioContext` is missing; one that can fire on the first click has
    to build it inside the gesture instead. The listeners that unblock autoplay
    are removed once the context is running, and the shared context is
    suspended while the tab is hidden.
27. One decision, one screen, with nothing scrolled. `PlayScreen.jsx` renders
    the header and `GauntletStage`, and the stage renders the pot, the gauge,
    one question, the hand and the two verbs. The line that matters is the top
    of the fixed action bar, not the bottom of the viewport. On a 390x844 phone,
    a Pixel 7, a 1280x720 desktop and a 1366x768 laptop every scene fits on
    every board -- fresh, sealed, overclocked with five relics -- with its last
    card staked (`gauntlet-loop.spec.js` holds the densest scenes on each push;
    `layout-sweep.spec.js` walks every scene in the weekly full pass). A 360x740
    phone fits every fresh board; a board carrying rules can still push the
    wild card up to ~80px under the bar there, which is the known gap. How it
    fits: a board rule that bills every card is a badge in the stats row, never
    a line on each card; the staked card carries its own detail; the rules panel
    on a phone is one line; a wide screen is two panes. A new panel in front of
    the table is the change this rule exists to stop. The briefing page
    (priority 51) and the relic draft (priority 39) are modals that hold the
    clock, not panels on the table, and the comfort settings (priority 87) live
    on the intro. On a phone the header's three icon buttons are drawn 30x28
    but each has an invisible 44px-tall hit area, and 초기화 sits 9px further
    off than the others.
28. The report is three acts. The ending, the rank and the next case are the
    first screen; `왜 이렇게 됐나` answers with three cards; everything else is
    inside `.report-archive`, which is its own file (`ReportArchive.jsx`). It
    reached 10,616px on a phone once, by growing one named region at a time.
    The archive's body is drawn only while the `<details>` is open (it is most
    of the page's DOM); nothing in it keeps state of its own, and a test that
    reads it opens it first. The report's verdicts, afterglows and axis copy
    are tables in `src/endingCopy.js`, not literals in `ResultScreen.jsx`.
29. The table prints the bet and never the odds. A card shows its chips and the
    axis it burns; the HUD shows the pot, the multiplier, the gauge and the band
    the wall is drawn from. Nothing shows where the wall is inside that band or
    the chance that the next push crosses it: an exact bust percentage made the
    best strategy "press until it is not 0%". The heartbeat is the one
    instrument pointed at the wall, and it reads a seeded error of up to
    `TELL_ERROR`. `npm run check:pressure` is the ratchet: the best heartbeat
    policy has to beat every blind one and stay under 60% of what a player who
    could see the wall banks. It plays the window count the graph actually
    deals (measured, 9 a case) rather than a literal, and it plays hands that
    charge a stance and LOCK as well as hands that only push: the x1.5 cap
    (priority 38) is on the beat and LOCK together.
30. Lime is the accent for one thing at a time. `--c-acid` marks the control
    that records a decision and the active step of the decision rail; a note, a
    quote or a heading gets a lime rule at most.
31. A phase is player copy and nothing else. `node.phase` prints on the scene
    chip and in the mission strip, so it names a story beat -- never the
    function that generated the node -- and the picture does not read it: the
    plate reads `place` and `pressure` (priority 46).
32. Every decision breaks the next board in a way the player can read. A bust
    wipes the case pot, strips the card's gains and deals BLACKOUT (cards face
    down, the wall closer) and AFTERSHOCK (the gauge starts hot); a timeout adds
    SILENCE (no heartbeat, 30s). Cashing hot deals HEAT DEBT, cashing without a
    push deals COLD FEET (the richest card sealed until the gauge reaches 30),
    two hot cashes in a row deal OVERCLOCK, and the axis a card burned hardest is
    FRACTURED. The rules live in `buildNextSchema`; the briefing's breach panel
    names them as the window opens and the reveal names them before the player
    walks into them. A mutation that changes a number on a report and not a rule
    on the table does not belong in that list. The season also leans in on its
    own: every 100 windows the top of the wall band drops by 2 and creep rises
    by 0.03, up to four steps (`getSeasonEscalation`); the lowest wall never
    moves.
33. A sealed card must be openable without busting on any board that did not
    just bust: `SEAL_BREAK_GAUGE - 1 + stepMax < wallMin`. `normalizeSchema`
    enforces it, because every board passes through it: on a board whose
    modifiers leave no room, the seal opens earlier (`sealBreak`) and the push
    and the wall stay what their rules made them. The e2e helpers push until
    cash enables and rely on it; a unit test asserts it for every non-bust
    schema.
34. The run's table record is rebuilt from the decision log (`createGauntletLedger`),
    never from live state, so a resumed save and a live run agree. The vault is
    carried in each case summary as `gauntlet`.
35. One table at a time, and nothing a tab writes can undo the wall. Saves go
    through `writeSaveState`, which stamps a `saveRevision`; the runtime's
    `persist` refuses a write when storage is ahead in play this tab has not
    seen (`isSaveAheadOf`: another run, a window settled past this one, or a
    window another tab holds) and locks the table instead. A newer revision on
    its own is not a conflict -- a tab that only opened the game must not lock
    the one playing. A touched window is saved as `<seed>#<tab token>`, the
    token lives in sessionStorage, so a touched window found in the save with no
    suspension beside it settles as a bust at once while a different tab is
    asked first (`table-held-elsewhere`). A duplicated tab copies
    sessionStorage, token included, so a tab that starts with a token asks over
    a `BroadcastChannel` whether a live tab holds it and takes its own when one
    answers (`claimTabToken`). A bust writes the window's close into the hold
    before the slam is painted -- `<seed>#<token>~<cause>` -- so a reload under
    the slam finds it closed, not fresh. Settled seeds are also recorded
    outside the save, so a rolled-back save deals a fresh wall. A writer that
    edits the stored save in place and knows nothing of the run in memory (the
    error recovery) writes with `sideChannel`: like `force`, but a tab already
    behind storage stays behind, so its next ordinary save still meets the
    conflict check.
36. A recovery slot rolls back the story, not the table. There are five slots,
    each holding the whole log. `restoreSaveSlot` passes the slot through
    `carryTableRecordIntoRestore`: busts settled since the slot stay in the log,
    the pot they wiped stays wiped, the board they broke stays broken, and the
    window count never goes backwards. A restore stops the runtime's saves
    before it writes and reloads, so nothing the live tab still holds lands on
    top of it. Every control that throws progress away -- restore, delete a
    slot, clear the error log, start fresh, replay a case, `R` on the result
    screen -- asks first through `confirmAction` (`src/state/confirmAction.js`);
    a spec that presses one answers through `tests/helpers/dialogs.js`.
37. A bust skipping a scene must never be a shortcut. `check:pressure` plays a
    policy that busts every window it can to reach the case's end sooner; it has
    to bank under a quarter of the best blind policy.
38. The heartbeat is also the table's rhythm, and the beat is a hand skill, never
    a second instrument. A push is graded PERFECT, GOOD or SLIP against the beat
    `GauntletFx` last sounded (`beatClock`, stamped with `performance.now()` when
    the beat fires, compared to the input event's `timeStamp`). Timing never
    moves the wall or the step: on-beat pushes build a combo and groove, and
    the pot rides the hand -- groove and LOCK multiplied together
    (`getHandBonus`) under one cap, `HAND_CAP` = x1.5, because LOCK on top of
    a full groove once reached x3.2. A slip breaks the combo and costs
    `SLIP_SECONDS` of clock with creep, and groove never falls mid-window. A
    cash carries the combo into the next window; a bust takes it with the pot.
    `check:pressure` is the ratchet: a perfectly timed hand busts exactly as
    often as an untimed one, a slipping hand never banks more, and the beat must
    pay less over listening than listening pays over playing blind. The
    ending's vault slack (19,500 a case) reads the vault without `grooveVault`;
    the beat's own door is `BEAT_SLACK_COMBO`. A timing helper in the tests
    reads `--gx-beat-zone` (the app's own answer, +/-18% of the period with a
    60ms floor) rather than aiming at the edge of a phase value it samples a
    frame late.
39. Relics bend a rule; they never break the table. A closed case (not the
    final one) drafts three relics from `getRelicPool` -- the defaults plus what
    the codex unlocked -- seeded by its last window so a reload cannot reroll
    them, and `openCaseRun` carries the offer to the next case's first table.
    The draft and the briefing page are the only surfaces allowed in front of
    the table: the draft holds the clock, traps focus and returns it on close,
    keys 1-3 take a relic, Enter takes the focused one, Escape passes, and
    `dismissProtocolBreach` passes for flows that only need to get past a
    decision. A pick re-deals the untouched window (`REDEAL`) through the same
    `equipRelic` the runtime saves. The board records the relics it was dealt
    (`schema.relics`), so `applyRelics` is idempotent. A relic that softens a
    mutation names itself on the breach (`softenedBy`). The codex
    (`critical-point-relic-codex-v1`, owned by `useRelicTable`) outlives a
    reset, and feats unlock into it before that case's draft is dealt. The
    stance relics are 악력, 닻 and 돋보기 (KINETIC GRIP, STEADY ANCHOR, GLASS
    LENS), each unlocked by three charged cashes in its stance.
    `check:pressure` replays every relic alone and all together with a timed
    hand: listening must still beat blind play, stay under 0.6 of a
    wall-seeing player, busting to skip must stay under a quarter of blind
    play, and no single relic may lift best play past 1.35x. SPLINT is exempt
    from the lift floor by design -- it bends what a resource costs, not what
    the table banks. A recovery slot keeps relics drafted since it and cannot
    return a spent INSURANCE. A case played again after it closed is practice
    (`openCaseRun({ replayOf })`): it plays the same table, drafts no relic and
    keeps nothing -- the vault, the relics, the mastery and any waiting draft
    are handed back when it closes or is left, and the summary keeps the table
    record of the first close.
40. Every scene grounds itself, because no scene can rely on the one before it.
    The route split opens a case at different authored scenes, so a scene may
    be entered with its predecessor never played. `src/nodes/sceneContext.js`
    (and each pack's context table) is where a scene says which room it happens
    in (`place`), how much of the deadline is left (`clock`), what it is
    actually asking (`question`) and how the analyst got there (`lead`);
    `applySceneContext` stamps the composed graph last, after every generator,
    and a scene without its own entry inherits place and clock from the nearest
    earlier scene in the case order. `npm test` holds the bar: place, clock and
    a question of its own on every scene, no two scenes asking the identical
    question, and no scene falling back to the template. Season-level
    continuity is copy, not derivation: `operatorBriefs` is merged into
    `nextCaseSignals` so the case-to-case seam keeps one home, and
    `getEndingEpilogue` answers all nine endings.
41. The season's tables are keyed, not counted, and they are looked up by the
    case being opened. `caseOpeningRoutes` and `getContinuityChallenge` for a
    case read the aftermath of the case before it -- the finale reads
    `c49_after_*`, 사건 01 reads 프롤로그 05's -- so a continuity challenge
    reaches the table of the case that opens, not the one that closed.
    `check:graph` walks every way each case can close through the outcome,
    carryover and continuity tables and fails on an outcome any of them drops,
    and on an opening whose challenge no card on that scene can meet
    (`UNMEETABLE_CHALLENGES`, the list of known exceptions, is empty). Meeting
    a challenge makes a hidden clue possible (`getDiscoveryClue`), and the copy
    says that, not "보너스".
    Anything that counts the season asks `CASE_SEQUENCE.length`. The flow surge
    is retired; only reports from older saves still show one.
42. The report has one screen with no bet on it. `seasonInterludes` is the beat
    between two cases -- a corridor, a text message, a vending machine -- keyed
    by the case that just closed and merged onto `nextCaseSignal` so the seam
    keeps one home. It renders above the next-case panel with a mood tint and
    no control, so nothing on it can be played.
43. The tree carries only what the game runs. A derivation no surface reads, a
    helper only its own test calls, a CSS rule for a component that no longer
    exists: delete it, it is in the history. What a sweep must not take: a
    symbol referenced by `scripts/unit-tests.mjs` or `scripts/smoke-test.mjs`
    that the app also uses, and `topicParticle`, which priority 10 tells
    authors to reach for.
44. The season is one chain, and its vocabulary is the one a Korean bank uses
    now. Every case hangs off a single bad loan -- KD은행's 310억 to 플로우온,
    대출번호 2023-0412 -- and the analyst is the one who wrote the dissent on it.
    Two rules about copy, both enforced by `npm run check:plain-language`
    (priority 71):
    - No Japanese-style loan vocabulary (여신, 융자, 품의, 기안, 결재 ...).
    - A term a fifteen-year-old would not know is unpacked in brackets the first
      time a player can see it in each case, in the scene body rather than the
      folded memo.
45. The repository carries only what a build, a check or a deploy reads. The
    `Profile.jpg` / `!public/profile.jpg` pair in `.gitignore` stays, because
    Windows matches that name case-insensitively and the app's icon would go
    with it: every file in `public/icons/` is cut from `public/profile.jpg`
    (`npm run build:icons`), the favicon the owner chose. Text files are LF on every platform (`.gitattributes`,
    `.editorconfig`): the byte budgets measured a different file on a Windows
    CRLF checkout than on the Linux runner.
46. Every scene has a picture, and none of them is a file. `src/scenePlate.js`
    reads two facts the graph already holds about a scene, `place` and
    `pressure` (set by the graph build from the scene's kind and
    `pressureBeats` in `src/nodes/sceneBuild.js`, or by the scene context),
    and returns a motif plus a seed -- never `phase`, which is copy (priority
    31); `src/components/ScenePlate.jsx`
    draws that as inline SVG. `npm test` holds it: every scene resolves to a
    known motif, the spec is a pure function of the node, and no motif exists
    that no scene reaches.
    - A place names its building, then its room after a `·`. The room wins;
      when the room names nothing the classifier knows, the building answers.
      A more specific room word is tested before the generic one it contains
      (`chamber` before `hall`, `courtroom` before the hearing room, `transit`
      before the road, `bookshop` before the alley).
    - The backdrop sits behind the scene header, cropped and masked, so it costs
      the table none of the one screen priority 27 gives it. An SVG root is a
      replaced element, so the backdrop states `width: 100%` instead of relying
      on two offsets.
    - Colour is `--plate-*` only and none of it is lime (priority 30).
    - It is `aria-hidden`: the room and the deadline are already text above it.
47. A screen's copy, font or colour changing makes its baseline stale, and
    nothing in `verify:static` says so -- re-record in the same pass
    (priority 19). The geometry gate in front of the comparison asks the
    captured PNG, not the DOM: a fractional document height rasterises a pixel
    or two differently from `scrollHeight`, and the capture is what
    `toHaveScreenshot()` compares.
48. Adding a case moves keys in a known set of places: the case's pack,
    `CASE_SEQUENCE` and start/result nodes in
    `gameCases.js`, the copy in `caseCopy.js`, the next case's openings keyed
    on this one's aftermath, and `season_case_ids()` in a new migration
    (`check:grants` fails until it matches). A scene under pressure is named in
    `pressureBeats` or says `pressure` in its scene context; a person whose job
    changes gets a role span (`characterRoleSpans` in `gameDialogue.js`), or a
    pack's `characterOverrides` for its own case; a fact about the loan is
    checked against `docs/canon.md` (priority 84). Counts that wear a literal --
    `check-dialogue.mjs`'s generated scenes, `smoke-test.mjs`'s choices -- move
    with it. Measure a new case against the season with `report:endings`, not
    just inside itself.
49. The plate draws rooms with people in them: silhouettes placed where the
    speaker would be. Light belongs to the organisation that owns the room
    (priority 63), and the accent stays chip-or-heat in every building, because
    that pair means "how much pressure is on this scene". `contrast.spec.js`
    and the axe pass both hold over the backdrop.
50. Every image `src/responsiveArt.js` lists must have a surface that renders
    it; `check:art` holds nine images at two widths.
51. Reading is not on the clock. A window opens on the briefing page
    (`SceneBriefing.jsx`, `briefing.css`): the room as a splash panel, the
    speaker's portrait with the scene's question, the lead and body as caption
    boxes, the memo as a pinned case file, and the protocol breach as a red
    panel when the last decision broke this board
    (`data-testid="protocol-breach"`). The page has its own reading clock,
    `getReadingSeconds(node)`, 12-50s; when it runs out the table opens by
    itself. The clock is a button (`aria-pressed`) that holds and resumes it,
    and it starts held when the player asked for that (priority 87).
    `판 열기`/Space/Enter/W opens the table sooner, and a card button or number
    key opens it with that card staked (`openTable(cardId)` goes through the
    same authority gate as a click on the table). The page traps focus and
    returns it when it closes. The table's 45 seconds stay paused the whole
    time, so `responseTimeSec` is decision time, not reading time plus decision
    time. In the harness, `dismissProtocolBreach` is the one place that knows
    how to get past the page and the draft; a wait for an *enabled* card never
    returns while the page is up, and the best-effort wait inside it must stay
    short because it runs on every scene of every walk.
52. Priority 27 is a rule about a decision under time pressure. The briefing
    page holds the table's clock and scrolls inside itself on a phone, so it is
    the one surface that may be taller than the screen; the layout tests
    measure the timed board, which is why `startDebugNode` opens the table by
    default.
53. The season's middle argues the thesis out loud: different feelings wake the
    same obsessive thinking and aim it somewhere different. 사건 08 is the
    grudge's intelligence, 사건 09 care and burden together, 사건 10 the price
    of that obsession. Keep that shape when rewriting them.
54. The report names what woke the thinking. `getThinkingMotive` groups the
    run's trigger scores into four families -- 애정형, 복수형, 책임형, 탐구형 --
    and `판단 DNA` prints the winner. A run with no record falls back to 책임형.
    It sits inside `.report-archive`, so priority 28's first screen is
    unchanged.
55. The plate moves, but a scene never differs from itself: particle positions
    and timings come from a second generator on the scene's seed. All motion is
    transform or opacity inside the SVG's clipped viewport, none of it is lime,
    and under reduced motion it stops on a finished drawing.
56. Priority 44's vocabulary rule applies to names as well as terms. A person
    or a company is named the way someone would be named now. A rename keeps
    the old name's last-syllable shape -- a consonant ending for a consonant
    ending -- because the particles already written after it agree with the old
    name, and a swap breaks every one of them silently. One name is one person
    across the season, and `check:graph` enforces it: a pack that introduces a
    name the season already has a profile for fails, and so does a speaker with
    no profile. A change of role is a role span or `characterOverrides`
    (priority 48), never a second profile.
57. `src/state/errorRecovery.js` is the single source of the error-recovery
    functions (the intro shell loads it without the scene graph);
    `savedState.js` re-exports `recordAppError`. One failure is one record: a
    render crash that React, the catching boundary and a parent boundary all
    report is recorded once, only a `react-render` failure counts toward the
    retry limit, and the error path keeps one recovery slot per broken scene
    rather than one per record. Hand-kept case lists are bugs:
    the unlock chain is "the previous case in `seasonCasesBase` is complete",
    the test unlock is `CASE_SEQUENCE` minus the finale, and intro echoes are
    the `caseIntroEchoes` table.
58. A table can be put down. Leaving on purpose (`저장 후 나가기`), the page
    going to the background, or `pagehide` writes the live window's progress
    into the run as `dynamics.suspended`, and the stage deals the same seed on
    return with that progress on top (`createWindow({ resume })`).
    `useWindowSuspension` is the single page-lifecycle handler. What keeps it
    honest:
    - The wall and the tell are dealt from the seed again and never read from
      the save; `resumeWindow` clamps progress under the wall and the clock.
    - Only a live window is suspended. A bust is closed the moment it happens,
      written into the hold (`~<cause>`, priority 35) before its slam is
      painted, so a reload still settles it. A closed window still on its
      verdict slam is `settling`: it cannot be suspended, and `저장 후 나가기`
      is refused until it lands.
    - A snapshot taken because the page was hidden is cleared the instant the
      page is visible again, before input can reach the table.
    - A suspension carries the run's `windowIndex` and is dropped by
      `normalizeRunState` once that window settles.
    `save-resume.spec.js` holds the exit and reload paths (it is in the default
    e2e list); `unit-tests.mjs` holds the tamper and staleness cases.
59. Online save is opt-in, and device first. Nothing uploads until the player
    turns 온라인 저장 on in `CloudSavePanel`, which creates the continuation
    code (12 symbols, no 0/O/1/I); `main.jsx` installs the sync only on a
    device that already opted in. After that `writeSaveState` fires
    `SAVE_WRITTEN_EVENT` on every write that reached storage and
    `src/cloudSave.js` (loaded by the intro shell, so no scene graph) uploads a
    few seconds later when online, on the `online` event, on a 30s retry, or on
    the next launch. The upload (`createCloudSavePayload`) strips the player's
    name, feedback comments and the telemetry queue; loading a copy keeps this
    device's name, research consent and queue, merges the settled-window seeds
    so a loaded save cannot replay a wall this device has seen, and ends replay
    mode. Two devices are ordered by lineage, not by the clock: the server
    counts accepted writes (`revision`), an upload names the revision it was
    built on, and it is refused when the stored copy has moved past it
    (`20260929030000_cloud_save_lineage.sql`). A refusal is a conflict, and a
    conflict stays -- nothing uploads again until the player loads the server's
    copy or says this device's progress should replace it. `peek_cloud_save`
    asks what revision the server holds without fetching the save. The panel
    can delete the copy under a code (`delete_cloud_save`), and a copy nobody
    has uploaded to for 180 days is purged. The client falls back to the older
    calls when the database has not been migrated yet. The consent copy
    describes what is sent, and no longer mentions free input.
    A replay link never writes the save: while one is open `writeSaveState` and
    `appendSaveSlot` are no-ops, and starting a run, restoring a slot or
    loading a cloud copy ends replay mode.
60. The server decides what a telemetry row says about time, identity and pace
    (`20260928000000_trusted_telemetry_writes.sql`). `created_at` and
    `completed_at` are `now()` whatever the client sends -- case and season
    rows no longer send `completed_at` at all -- sizes are capped, and a
    ranking row's `player_name` is forced to 익명 분석관 and its `case_title`
    to a constant. A `season-final` row is accepted only when the run already
    has rows for every case in `season_case_ids()`, the first of them at least
    ten minutes old and the first and last at least fifteen minutes apart; one
    per run, two per session a day, twenty per address a day. Its score is the
    one the server reads, and types, from the run's own `final` case row, and
    its public summary is built from an allow-list of typed keys of that row
    (`ranking_public_summary`, `20260929010000_telemetry_caps_and_ranking.sql`)
    -- server-ordered and server-typed, not server-computed.
    `season_case_ids()` is the database's copy of `CASE_SEQUENCE`, and
    `check:grants` fails when they differ, so a change to the season's cases
    needs a migration redefining it. Rate limits key on `request_client_key()`
    -- a SHA-256 of the address under a salt only the database holds, an IPv6
    address reduced to its /64 first -- where the address is
    `request_client_ip()`: `cf-connecting-ip`, else the right-most
    `x-forwarded-for` hop, the one the trusted proxy appended. No raw address
    is stored. The atomic `bump_rate_limit` counts telemetry 240 an hour per
    (address, session) and 1,200 per address. It is still a playtest ranking,
    not an anti-cheat system; the ranking badge says RUN LINKED, not verified.
61. Telemetry is idempotent by `event_id`, minted once when the payload is
    built (`src/state/telemetryEventId.js`) and reused by the retry queue.
    Delivery is a plain POST; a `409` (the unique `event_id` already landed)
    counts as delivered. `on_conflict` is not used because it needs SELECT on
    `event_id`, which anon does not have. The privacy check runs before the
    first send; `spokenChoice` is not private; a `comment` is allowed only on
    feedback rows, whose shape is `{ event_id, session_id, session_code,
    case_id, feedback: { caseTitle, submittedAt, clarity, difficulty, comment }
    }`. An invalid queue item is dropped instead of invalidating the save, and
    the queue drops a row the server refuses permanently (any 4xx except 408,
    425 and 429) rather than retrying it forever. The server answers a refusal
    for pace 429 and a "not yet" 425 (`PT429`, `PT425`); a refusal nothing
    cures stays 400. The client also reads the "not yet" message out of a 400,
    which is what a database before `20260929010000` sends
    (`src/state/telemetryBatch.js`). The queue holds 119 rows -- two per case,
    the ranking row and eight error reports, counted from `CASE_SEQUENCE` --
    and drops errors first, then feedback, then case rows.
62. Collapse is harm or overreach, not heat. `getEndingVariant` reads the
    season (`getSeasonStrain`, in `gameLogic.js`): a mean human cost of 20 a
    case, or 10 a case with a fifth of the windows busted
    (`ENDING_GATES.collapseHarmPerCase`, `collapseOverreachHarm`,
    `collapseBustRate`). Peak pressure no longer decides it: a maximum over case
    walks grows with the length of the season, and every added case used to
    retune the endings behind the author's back.
63. The plate's light belongs to the organisation, not to a hash. `ORG_RULES`
    names the owners (lab, client, rival, bank, care, public, and `outside` for
    everywhere that employs nobody), so every room of one building is lit one
    colour; `unit-tests.mjs` asserts the room sets that used to disagree.
64. Code a test is the only reader of is not load-bearing; delete both (priority
    43). `eslint.config.js` and `.gitignore` list only paths something writes.
65. Type is one font file. Pretendard ships as one committed subset,
    `src/assets/fonts/pretendard-cp.woff2` (~264KB, family "Critical Point
    Sans", preloaded, weights up to 900), cut by `npm run build:fonts` from the
    characters the source actually uses (`pretendard-cp.charset.txt`).
    `npm run check:fonts` fails when source text uses a character the subset
    lacks, so new copy means running `build:fonts` and committing both files.
    `pretendard` is a devDependency for its source TTF only; there is no font
    CDN and no second font stylesheet. Visual baselines still await
    `document.fonts.ready` and two frames before capture.
66. Deploying presses its own button, and `render.yaml` presses nothing. That
    file is a Blueprint spec and the live service was created by hand, so its
    settings -- `autoDeploy`, the headers -- are the written record, mirrored
    into the dashboard by hand. `.github/workflows/deploy.yml` hangs off Verify,
    so only a commit whose e2e tier went green deploys, and Render's own
    Auto-Deploy stays off. The Render build is `npm ci --include=dev && npm run
    build` and runs no checks. The deploy job needs `RENDER_DEPLOY_HOOK`; its
    second job (`needs: deploy`) needs `DEPLOY_URL`, waits until the site's
    `<meta name="build-sha">` (written from `RENDER_GIT_COMMIT`) names this
    commit or a later one, then runs `check:deploy`. Either job raises a
    warning annotation when it skips, because a job that cannot do its work
    should say so where the tick is. `check:deploy` checks the CSP by value
    (`scripts/deploy-policy.mjs`): `script-src 'self'` with no
    `'unsafe-inline'`, `'unsafe-eval'` or wildcard; `object-src 'none'`;
    `base-uri` and `frame-ancestors` present; no image, font or connect source
    open to any origin. `render.yaml` also sets `img-src 'self' data: blob:`,
    `font-src 'self' data:`, `form-action`, `manifest-src` and `worker-src`.
    `check:deploy` also reads six site headers by value (nosniff, a referrer
    policy that does not leak the address, the CSP, a year of HSTS, a
    same-origin opener policy, a permissions policy that switches camera,
    microphone, geolocation, payment and usb off), the cache policy of the
    page (`no-cache`) and of the hashed assets (a year, `immutable`), and fails
    the live header on a `connect-src` wildcard host such as
    `https://*.supabase.co` (`render.yaml` has to say it that way, so for the
    file it is only reported).
    `node scripts/check-deploy.mjs --offline` checks `render.yaml` and
    `dist/index.html` (no inline script, no `on*=` handler, no `javascript:`
    URL) without a network.
67. A timing helper that samples a rendered variable and acts a frame later has
    to aim at the middle of the tolerance, not its edge, and has to see the
    value change before trusting it -- a variable written every frame and then
    abandoned reads live forever.
68. Free text is gone from play (priority 77); nothing in the game sends player
    prose anywhere but the 참가자 게시판 and a feedback comment.
69. There is no LLM reading in the project: no edge function, no batch runner,
    no `VITE_ENABLE_LIVE_ANALYSIS`. `free_text_analyses` stays in the schema as
    history, service-role only.
70. When the season's length changes, reset both rankings: a migration deletes
    the `season-final` rows (per-case telemetry stays) and the local board moves
    to a new `critical-point-local-ranking-vN` key that retires the old ones
    (v7 today). The 2026-09-28 migration also deleted every season row the new
    server rules would have refused, so the public ranking starts over when it
    is pushed.
71. Plain language is a check, not a habit. `npm run check:plain-language`
    bans the Japanese-era loan vocabulary from every file that carries player
    copy, and requires every glossary term (189) to carry a plain explanation
    at the first place a player can read it in each case -- per opening, since
    a case can be entered on any of them. Only narration (lead and body) is
    checked. A term matches at a word start only. Add a term to the glossary
    rather than explaining it once by hand.
72. A plate has an effects layer, drawn from the scene's own seed over a static
    film grain: flashes in rooms the public watches, rays by day under open sky,
    lightning at night under pressure, and season layers read off the clock.
    With motion reduced the flashes, lightning, steam and glitch are not shown.
    A speaker without a painted portrait is drawn by `SpeakerPortrait` -- a
    back-lit silhouette tinted from the name, with the initial -- never a stock
    photo.
73. A case is written to a bible that requires anger, laughter, sorrow and joy,
    and is checked by the pack validator before it is wired in -- that is
    `check:graph`, which validates each pack's shape. Parallel authors get
    names handed out, not examples: one person per name across the season, and
    the check enforces it (priority 56).
74. A case is one file. Every case but the finale is a pack:
    `src/nodes/<id>.js` exports its authored scenes and one object with a field
    per table -- aftermath, connective and reaction scenes with effects and
    copy, side door, hidden route, evidence turn, memory choice, openings keyed
    on the previous case's aftermath, voice and echo lines, people, setting and
    scene context, clue, outcomes, carryovers and continuity challenges. A pack
    may also carry `characterOverrides` (who someone is for that case only) and,
    on its route plan, `system.finalTitle` / `finalText` / `finalMemo` (its
    hidden route's closing scene).
    `src/nodes/casePacks.js` lists the packs and each owning module merges its
    field. What is still written by hand per case: `CASE_SEQUENCE`,
    start/result nodes, `authoredNodeOrders`, objectives and `seasonCasesBase` in
    `gameCases.js`; the teaser, interlude, chapter rule, operator brief and
    intro echo in `caseCopy.js`; the lab signal in `appCopy.js`; the music
    motif; and `season_case_ids()` (priority 60). The scene graph is built on
    `structuredClone` copies of the authored tables, and an authored `next`
    must be the one the built graph uses -- `check:graph` fails on a dead one.
    사건 01-11 were moved into packs as they were written, so they are held
    to what a pack's tables must agree on but not to the scene counts
    (`EARLY_PACKS` and `PACK_OMISSIONS` in `scripts/validate-game-graph.mjs`):
    사건 01 has four connective scenes and unprefixed ids, 사건 01 and 03-05
    carry a `routeBody`, and 사건 02's routes are written scene by scene on
    its pack (`writtenRoutes`). The finale is a pack too (`src/nodes/finalCase.js`),
    held as loosely as the early ones; no case writes into the tables of
    `gameData.js`, `gameDialogue.js`, `gameLogic.js` or `sceneContext.js` any more.
75. The ending's gates are placed against the season a player plays.
    `npm run check:endings` replays 600 seasons from seven player archetypes
    through the runtime's own functions -- the opening route and carryover, the
    scene challenge and clue reader, a seeded window on the live board, the
    effect a cash or a bust applies, the blackout skip, the case summary, the
    relic draft, season wear and escalation -- and asserts every ending is
    reached in at least 1% of seasons, none in more than 40%, a people-first
    player collapses in at most 10%, and one who spends people for position
    collapses in at least half. `npm run report:endings` prints the spread,
    which moves a little with every effect change; at the end of the
    2026-09-27 pass collapse read about 22% and every other ending sat between
    about 4% and 20%, field pact and human record the largest. The ruling reads season
    means and rates: clue gates are rates of cases played; standing gates read
    the mean of each case's closing resources (`finalResources` in the case
    summary, alongside `reframeRouteCount` and `peopleFirstCount`); the
    authority gate asks for records from 60% of the cases opened, never fewer
    than four; a finale that burns the records closes OPEN OVERSIGHT, EVIDENCE
    REFORM and HUMAN RECORD. The gates a player is told about live in
    `ENDING_GATES`, and the report's advice quotes them. Later cases open with
    `SEASON_WEAR` (fatigue +14, time -8 by the finale, linear in position).
76. The season's entry point is data. `src/gameCases.js` owns
    `SEASON_ENTRY_CASE`, `SEASON_ENTRY_NODE`, `caseNodePrefix`,
    `caseAftermathNodeId` and `caseDisplayCode`, and `authoredNodeOrders` (the
    built `nodeOrders` comes from `gameData.js`); no file names the season's
    first case, and the tests do not either. A scene knows its own case
    (`node.caseId`), and a check that needs it reads that rather than matching
    ids against a pattern. The header stamp is the case's own label, not its
    position; the progress line measures position (1/55).
77. 판을 다시 짠다 is a card, not a text box. It routes into
    `reframeRouteNodes[caseId]` on a cash, once per case, where three authored
    options are the decision. Its price is `REFRAME_EFFECT` and
    `REFRAME_COGNITION`; `REFRAME_CARD_ID` is the id the table selects it by.
    Everything the old sentence fed is keyed on what the player did:
    `entry.reframe`, `entry.reframeOpenedRoute`, `reframeCount`,
    `reflectionScore`, the BOARD BREAKER style and the HUMAN RECORD ending. An
    old save's `freeText` fields are simply not read. What a player meets
    around the card is written for its case, and `check:graph` fails when it
    is not: every hidden route closes on a scene its case wrote (not the
    shared generated one), every reply is authored, and every memory card a
    run can be dealt answers in its own words. A choice with no voice line
    speaks its own label; 54 do, held as a ceiling that may only fall. Only
    사건 01-05 have a route split, so only 사건 02-06 can be dealt a route
    memory card; the 48 cards no run could reach are deleted, and `check:graph`
    fails on a card no run can be dealt and on a kind of memory the previous
    case can hand on with no card written for it (111 cards today).
    `check:plain-language` fails on the retired text box's phrases
    (`RETIRED_PHRASES`).
78. The privacy patterns have one home, `src/privacyText.js`, a leaf module:
    importing them from `gameLogic.js` pulls the whole season into the entry
    chunk. `gameLogic.js` re-exports them for the runtime. `appConfig.js`
    carries `limitText` and `makeEmptyScores` for the same reason.
79. 참가자 게시판: a nickname, 300 characters, and no account. It is the only
    place player prose is published under a name, so the anti-spam is on the
    table (`20260923010000_add_board_posts.sql`,
    `20260928010000_board_filters_and_moderation.sql`). Every check runs under
    `pg_advisory_xact_lock` on the writer's address key, stored in `actor_key`
    (a column anon can neither write nor read; the salted hash of priority 60,
    never the address), so concurrent posts are decided one at a time. The
    board's writer is its own id (`BOARD_WRITER_ID_KEY`), not the telemetry
    session. Per address and session: one post per 30 seconds, 10 an hour; per
    address: 3 per 30 seconds, 30 an hour. A repeat of the same body from the
    same device within six hours is a retry, accepted and dropped; the same
    body from another device on the address is refused out loud, so the second
    writer is told. The link filter reads the nickname too, knows more TLDs,
    folds obfuscations (`[.]`, `(dot)`, full-width dots, 닷컴) and takes a
    Hangul label as a domain. A TLD ends in an explicit lookahead,
    `(?![a-z0-9-])`, not a word boundary: Postgres's `\b` is a backspace, and
    `\y` under a UTF-8 ctype sees no boundary between `.com` and a particle
    (`spam.com으로`). The browser and the database read one fixture list,
    `tests/fixtures/board-filter-cases.json`, so a disagreement fails a check.
    `clean_board_text` trims Unicode
    whitespace and invisible characters. Phone numbers and e-mail addresses are
    refused server-side. `moderate_board_post(id, hidden)` hides or restores a
    post and only service_role may execute it. The client mirrors every rule
    and adds a honeypot and a three-second floor.
80. Every table the Data API serves has its grants written down, and the grants
    converge (`20260928030000_converge_data_api_grants.sql`): revoke all from
    `anon` and `authenticated`, then grant back exact columns. Functions follow
    the same rule (`20260929040000_function_execute_grants.sql`): the only ones
    anon may execute are `is_season_case_id` (the telemetry insert policies
    call it) and the four cloud-save calls, `put_cloud_save`,
    `get_cloud_save`, `peek_cloud_save` and `delete_cloud_save`, and
    `check:grants` fails on any other. Cloud saves are reached only through
    those calls: `saved_at` is clamped to `now()`, a `revision` column counts
    writes (priority 59), puts are limited to 240 an hour per code and 600 per
    address, reads to 120 an hour per address, a payload to 400,000 bytes of
    `save` and `settledWindows`, and an address to five new codes a day. There
    are 34 migrations and eight tables.
    `free_text_analyses` is service-role only; the client writes nothing to it. `purge_old_telemetry` covers seven tables and is scheduled daily by
    `pg_cron` when the extension exists. `npm run check:grants` (in
    `verify:static`) replays every migration into PGlite with the API roles and
    no automatic grants, fails on RLS off, a table service_role cannot use, a
    policy whose privilege was never granted, or any table-wide privilege for
    anon or authenticated, runs the client's exact payloads, reads and RPCs as
    anon, and checks `season_case_ids()` against `CASE_SEQUENCE`. Any new table
    carries its own grants in the migration that creates it.
81. The bundle's budgets ratchet down, never up. `npm run check:bundle` holds
    each chunk at its measured size plus about 5%, the font file on its own,
    and the first paint as a whole -- the HTML, every script and stylesheet it
    links, the preloaded font and the key visual a phone picks (about 495KB
    measured). The intro screen is in the entry chunk rather than a lazy one it
    had to fetch before painting, and the GameRuntime chunk is prefetched on
    idle and on hover or focus of the start action. Only `board-glow` still
    animates a paint property. A number that has to rise is a decision worth
    writing here, not a constant worth editing quietly. The one that rose in
    the fix pass is PlayScreen, 102,400 / 32,600 -> 104,200 / 34,300 bytes
    (raw / gzip), for the table's audit fixes: one gate for a card's click and
    key, a bust written before its slam, Space and Enter left to the focused
    control, presses graded where the pointer went down, readable names, and
    frame variables that no longer restyle the whole table. Every chunk the
    build emits has a budget, and a chunk without one fails.
82. Actions are pinned by commit SHA with the tag in a comment, and Dependabot
    (npm and actions, weekly, grouped; npm majors and `@playwright/test`
    ignored, since Playwright moves with the visual-regression container)
    proposes bumps, with no labels. A Dependabot pull request runs the e2e
    shards and the visual comparison by its author, not by a label: its
    default labels used to arrive as four `labeled` events whose skipped and
    cancelled runs buried the one that checked the code, and a dependency bump
    is the change most likely to break the running game. Workflows run with `contents: read`; only the job that pushes
    recorded baselines may write. Concurrency groups cancel superseded pull
    request runs, never a push to main, and never a deploy. The `supabase` CLI
    is a pinned devDependency, so `npx supabase` runs that version.
83. Keys: 1-9 stake a card, Space or W pushes, E locks focus, Q cycles the
    stance, Enter cashes; P saves and Shift+P saves and leaves. A key with
    Ctrl, Cmd or Alt held is never the game's -- those are the browser's
    reload, print and friends -- and bare Shift does nothing, because Shift+P
    used to fire a focus lock first. Letter keys are read off the physical key
    (`event.code`: `KeyW`, `KeyP`, ...), because with a Hangul layout on
    `event.key` is a jamo. Space and Enter belong to whatever control the
    keyboard walked to with Tab; only with nothing such focused do they push
    and cash. On the result screen `R` replays the case after asking and `N`
    opens the next one. Escape closes the ranking and the board from anywhere.
    With letter keys turned off (priority 87), 1-9, W, E, Q, P, R and N do
    nothing, and Space, Enter and Escape stay.
84. The facts about the loan have one home, `docs/canon.md`: 대출번호
    2023-0412, the committee's and the approval's dates, the minute the dissent
    was returned, the ratios, the floors, the borrower's staff. Fifty-five
    cases written by many hands restate them, and the 프롤로그 once gave three
    approval dates.
    `npm run check:canon` (`scripts/check-canon.mjs`, in `verify:static`)
    holds the copy to the same table in `CANON`, reading source text, so a
    fact is changed in `docs/canon.md` and `CANON` together, never in one
    scene.
85. A save is never thrown away for being old. `tests/unit/save-fixtures.test.mjs`
    loads saves as earlier builds wrote them (`tests/unit/fixtures/saves/`,
    each naming the commit it came from) through the runtime's own parse,
    repair and validate pipeline. Adding a field the validator requires means
    adding the fixture for the build before it first. A save this build cannot
    read is not deleted: it is kept under `critical-point-unreadable-save-v1`
    (`backUpUnreadableSave`) so a later build can restore it.
86. A missing chunk is answered with a reload, never charged to the save. A
    deploy replaces the hashed files, so a tab left open across one asks for a
    name that is gone. `src/state/chunkReload.js` reloads once by itself (at
    most once a minute, marked in `critical-point-chunk-reload-v1`), and on a
    second failure `LazyScreen` shows a panel with 새로고침; nothing is recorded
    against the run. Every lazy import goes through `loadedChunk`, because an
    import the preload handler took resolves to `undefined` instead of
    throwing, and that must read as a `ChunkLoadError`, not a crash.
87. Comfort settings live on the intro, in a folded drawer of the setup
    console -- never a panel in front of the table (priority 27). They are
    stored under one key (`ACCESSIBILITY_SETTINGS_KEY`,
    `critical-point-accessibility-v1`, in `appConfig.js`) and read by
    `src/state/accessibilitySettings.js`, a leaf module the shell loads before
    the first paint without the scene graph:
    - Table time x1 / x1.5 / x2 slows the window's clock: the TICK is fed that
      many times fewer seconds (`useGauntletWindow`). The schema, the save and
      the wall are untouched. A decision made on a slowed clock carries
      `assistTime`, a case summary the slowest of its decisions and the
      finale the slowest of the season, and a ranking row shows "테이블 시간
      ×1.5" once `20260929050000_ranking_assist_time.sql` is applied; until
      then the server drops the key and the row shows no mark.
    - The reading clock starts held (priority 51).
    - Calm effects: no shake, the flash and the vignette turned down, the bust
      without its full-screen flashes, whatever the OS says.
    - Letter keys off: 1-9, W, E, Q, P, R, N do nothing (WCAG 2.1.4).
    - A still intro: ticker, drifting art and wordmark glitch stop (WCAG 2.2.2).
    CSS answers two of them through attributes on `<html>`,
    `data-calm-effects` and `data-still-intro`, set in `main.jsx` before the
    first paint; their rules are `comfort.css`, the last sheet, with a budget
    of its own.
88. The app build fetches the season a case at a time; Node reads it whole.
    `scripts/vite-season-data.mjs` runs `scripts/season-split.mjs --emit-json`
    once at build time and serves `virtual:season` (the store,
    `src/seasonRuntime.js`, with the index every case needs: orders, openings,
    memory-card plans, each case's fork, the people, the pack fields
    `gameLogic.js` reads) and one `virtual:season-case/<caseId>` chunk per
    case (its scenes, replies and voice lines, 15-19KB gzip). In the app build
    only, imports of `gameData.js` and `gameDialogue.js` are swapped for
    `src/runtime/*.app.js`, which answer the same names from the store;
    GameRuntime went from 3.26MB / 960KB gzip to 525KB / 169KB. The rules
    that read the season's tables take them as arguments
    (`src/seasonRules.js`), so both sides run the same code, and
    `tests/unit/season-runtime.test.mjs` holds the store to `gameData.js`
    table by table and rule by rule.
    - The store's tables are the same objects, filled as cases arrive, so a
      reader stays synchronous. Only code that opens a case waits for it.
    - `src/state/caseArrival.js` decides the waiting. A first visit mounts once
      `SEASON_ENTRY_CASE` has arrived and fetches the rest behind the table. A
      device holding any save waits for every case: repairing a save reads the
      scenes of every case it closed, and a repair that could not find them
      would rewrite what it read. A page opened from a replay link waits for
      every case too, and reads the link at the runtime's first render, not
      at import, since the scenes it names are checked against the season.
      `startCase` and the debug start go through
      `whenCaseReady`; a case file a deploy removed reloads like any missing
      chunk (priority 86).
    - A new reader of `nodes`, `echoReplies` or `choiceVoiceLines` that can run
      before its case is open must wait with `whenCaseReady` or read only the
      index. The real `gameData.js` answers `ensureCase`, `ensureAllCases` and
      `isCaseLoaded` at once, so a unit test will not catch a missing wait;
      the dev server and `test:e2e:preview` will.
    - In the dev server a change under `src/nodes/` or to the modules the
      season is built from drops the built data and reloads the page.
    - `check:bundle` holds GameRuntime at 551,000 / 176,100 bytes and every
      case chunk to one budget, 84,000 / 20,200 (case01 is the largest).

## Verification Commands

```bash
npm run verify:static   # 25 checks, in parallel
npm run verify:quick    # + check:specs, build:e2e, check:bundle, check:deploy:offline,
                        #   test:runtime, test:e2e:preview, test:performance
npm run verify          # + test:e2e
npm run verify:full     # + test:e2e:full, test:e2e:season
npm run test:coverage   # the unit tests with per-module coverage floors
npm run test:visual:docker   # visual regression in the pinned Linux container
```

`npm run verify:static` is `scripts/verify-static.mjs`: 25 checks run side by
side in a pool, each one's output held and printed as a block, and the run fails
after all of them have reported. The list is `CHECKS` in that file, and each
entry is an npm script, so `npm run <check>` alone does exactly what it does
there: `test:coverage` (unit, smoke and `tests/unit/**/*.test.mjs`, with the
coverage floors read off the same run; `npm test` is the same tests without
them), `lint` (`eslint --cache`), `check:pressure`, `check:endings`,
`check:balance`, `check:types` (`tsc -p jsconfig.json` over the pure modules listed there, with
`src/vite-env.d.ts` typing the build-time env; a module joins once it passes as
is), `check:dialogue`, `check:graph`, `check:runtime-budget`, `check:views`,
`check:constants`, `check:text`, `check:plain-language`, `check:encoding`,
`check:css`, `check:css-structure`, `format:check`, `check:art`,
`check:fonts`, `check:export-schema`, `check:test-storage`,
`check:visual-baselines`, `check:node`, `check:grants` and `check:canon`. None
of them needs a browser.

`test:coverage` is `scripts/check-coverage.mjs`. It leaves the authored data
(`src/nodes/`, `gameData.js`, `gameDialogue.js`, `gameCases.js`, the copy
modules, `musicData.js`) out of the sum, holds every measured module to its
own floor in `scripts/coverage-floors.json`, and lists the modules no test
loads. Every test process writes its own coverage record, so the records are
merged line by line, function by function and branch by branch; keeping the
last one made a module's number depend on which process finished last. The
merged totals are held at 84% of lines, 82% of functions and 73% of branches:
the branch floor was lowered from 83 to 72 once, only because the union counts
branches that only some processes report, and has risen since. Every floor is
a ratchet: `--update` rewrites the file from the measurement and refuses to
lower anything without `--allow-lower`.

`npm run verify:quick` adds `check:specs` (every spec file loads), the
production build in e2e mode (`build:e2e`), `check:bundle`,
`check:deploy:offline`, `test:runtime` (the runtime smoke against `vite preview` of `dist/`), `test:e2e:preview` (the
`@prod` specs against the same build) and `test:performance`. The dev-mode
smoke is `npm run test:runtime:dev`. Run the browser tiers one at a time:
several at once on one machine time out on page loads.

Four artifacts are generated and committed, so a deploy needs no browser and no
font tooling to build: `npm run build:art`, `npm run build:critical`, `npm run
build:fonts` and `npm run build:icons`. The first three have a guard that fails
when their output has gone stale (`check:art`, the build's hash comparison,
`check:fonts`).

## Database Deployment

The project is linked. Apply new schema changes by adding a migration and
pushing it -- after the client that expects it is deployed, never before:

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
CLI ran. Always `db push` before trusting `migration list`, and verify behaviour against
the live database when a migration fixes a runtime error.

Pushing the fix pass's migrations (2026-09-28 and 2026-09-29, through
`20260929050000_ranking_assist_time.sql`, which lets the ranking publish
`assistTime`; priority 87): run `npx supabase migration list --linked` and
`npx supabase db push --dry-run` first. `20260928025000_reconcile_playtest_feedback.sql`
was committed after `20260928030000` and `20260928040000`; if those two are
already applied on the remote, `db push` refuses the earlier-numbered file
and needs `npx supabase db push --include-all`. That migration gives the live
`playtest_feedback` table the `feedback` column the client sends and gives
only `submitted_at` a default.

Manual steps after pushing the 2026-09-28 migrations:

- Verify the rate-limit key: a request that sends its own `cf-connecting-ip`
  must not be counted under that address.
- Confirm the `purge-old-telemetry` job exists in `pg_cron` (the migration
  skips scheduling when the extension is missing).
- Confirm the Render dashboard's CSP matches `render.yaml`.
- Disable sign-ups in the Supabase dashboard; `supabase/config.toml` only
  governs the local stack.
- Expect the public ranking to be empty: season rows the new rules would refuse
  were deleted.
