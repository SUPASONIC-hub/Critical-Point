# Critical Point Work Status

Last updated: 2026-09-22 (사건 25-49, a fifty-case season, the plate seasons, a fourth ranking reset)

This file holds what is true now: the shape of the project, the rules a change
has to keep, and the commands that prove it. What changed and why is in `git
log`: the commit messages here record the state that forced each change, not a
list of the files it touched.

## Current State

- Core verification passes with `npm run verify`.
- The play screen and the intro are held to phone reading budgets in
  `tests/visual-regression.spec.js`: the play screen under 2,616px on a 390x844
  phone with the choices starting above 1,435px, and the intro under 3,376px.
  They are budgets, not measurements -- ratchet them down, never up. The play
  screen was 5,775px before the first layout pass and 3,953px before the record
  room. The report has no height budget; `.report-archive` carries its bulk and
  priority 28 is what holds its shape.
- The whole app shares one dark "night-shift glass" layer: the `--ui-*` tokens in
  `src/styles/tokens.css` define the surfaces, lines, text steps, radii and
  motion every screen draws from, and no screen paints a light panel on the
  dark ground any more. Lime is the accent for the control that records a
  decision. Type is Pretendard, shipped with the app (no font CDN), and Hangul
  wraps with `word-break: keep-all`.
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
14. Keep per-second state out of the root. A live decision window -- gauge,
    clock, pushes, staked card -- is `useGauntletWindow` state inside the
    stage, keyed by the window's seed, and the frame loop in `GauntletFx`
    writes CSS variables rather than React state. The runtime only hears about
    a window when it closes, through `resolveGauntlet`.
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
27. One decision, one screen, with nothing scrolled. `PlayScreen.jsx` renders
    the header and `GauntletStage`, and the stage renders the pot, the gauge,
    one question, the hand and the two verbs. The line that matters is the top
    of the fixed action bar, not the bottom of the viewport: the old test
    compared against the viewport, opened one scene, and stayed green while 42
    of 149 scenes hid a card under the bar on a 390x844 phone, all 149 on a
    360x740 one, and every five-card scene on a 1366x768 laptop. What holds it now:
    on a 390x844 phone, a Pixel 7, a 1280x720 desktop and a 1366x768 laptop every
    scene fits on every board -- fresh, sealed, overclocked with five relics --
    with its last card staked (`gauntlet-loop.spec.js` holds the densest scenes
    on each push; `layout-sweep.spec.js` walks every scene in the graph in the
    weekly full pass). A 360x740 phone fits every fresh board; a board carrying rules can
    still push the wild card up to ~80px under the bar there, which is the known
    gap. How it fits: a board rule that bills every card is a badge in the stats
    row, never a line on each card; the staked card carries its own detail
    instead of a strip fixed over the hand; the rules panel on a phone is one
    line; a wide screen is two panes, reading on the left and the hand on the
    right. The old board reached 3,953px for one of forty-two decisions and put a
    record room, a commit console and a tactical drawer in front of the choice;
    a new panel in front of the table is the change this rule exists to stop.
    The briefing page (priority 51) is not a panel on the table: it is a modal
    that holds the clock, closes before the first press, and the table under it
    is exactly the one these measurements hold.
28. The report is three acts. The ending, the rank and the next case are the
    first screen; `왜 이렇게 됐나` answers with three cards; everything else is
    inside `.report-archive`. It reached 10,616px on a phone -- twelve and a half
    screens as the reward for finishing -- by growing one named region at a time.
29. The table prints the bet and never the odds. A card shows its chips and the
    axis it burns; the HUD shows the pot, the multiplier, the gauge and the band
    the wall is drawn from. Nothing shows where the wall is inside that band or
    the chance that the next push crosses it: the previous board printed an exact
    bust percentage, and the best strategy became "press until it is not 0%".
    The heartbeat is the one instrument pointed at the wall, and it reads a
    seeded error of up to `TELL_ERROR`. `npm run check:pressure` is the ratchet:
    the best heartbeat policy has to beat every blind one and stay under 60% of
    what a player who could see the wall banks.
30. Lime is the accent for one thing at a time. `--c-acid` marks the control
    that records a decision and the active step of the decision rail; a note, a
    quote or a heading gets a lime rule at most. Four lime fills on one screen is
    the state this rule was written after.
31. A phase is player copy. `node.phase` prints on the scene chip and in the
    mission strip, so it names a story beat -- never the function that generated
    the node. "CONNECTIVE SCENE" shipped for weeks.
32. Every decision breaks the next board in a way the player can read. A bust
    wipes the case pot, strips the card's gains and deals BLACKOUT (cards face
    down, the wall closer) and AFTERSHOCK (the gauge starts hot); a timeout adds
    SILENCE (no heartbeat, 30s). Cashing hot deals HEAT DEBT, cashing without a
    push deals COLD FEET (the richest card sealed until the gauge reaches 30),
    two hot cashes in a row deal OVERCLOCK, and the axis a card burned hardest is
    FRACTURED. The rules live in `buildNextSchema`; the protocol breach banner
    names them as the window opens and the reveal names them before the player
    walks into them. A mutation that changes a number on a report and not a rule
    on the table does not belong in that list.
33. A sealed card must be openable without busting on any board that did not
    just bust: `SEAL_BREAK_GAUGE - 1 + stepMax < wallMin`. The e2e helpers push
    until cash enables and rely on it; a unit test asserts it for every
    non-bust schema.
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
    asked first (`table-held-elsewhere`). Since priority 58 the page going away
    writes a suspension first, so a reload of a *live* table keeps it; a table
    that already hit its wall is never suspended, so nothing here can undo one.
    Settled seeds are also recorded outside the save, so a rolled-back save
    deals a fresh wall.
36. A recovery slot rolls back the story, not the table. `restoreSaveSlot`
    passes the slot through `carryTableRecordIntoRestore`: busts settled since
    the slot stay in the log, the pot they wiped stays wiped, the board they
    broke stays broken, and the window count never goes backwards.
37. A bust skipping a scene must never be a shortcut. `check:pressure` plays a
    policy that busts every window it can to reach the case's end sooner; it has
    to bank under a quarter of the best blind policy.

38. The heartbeat is also the table's rhythm, and the beat is a hand skill, never
    a second instrument. A push is graded PERFECT, GOOD or SLIP against the beat
    `GauntletFx` last sounded (`beatClock`, stamped with `performance.now()` when
    the beat fires, compared to the input event's `timeStamp`). Timing never
    moves the wall or the step: on-beat pushes build a combo and groove (the pot
    rides `getGrooveBonus`, capped at x1.5), a slip breaks the combo and costs
    `SLIP_SECONDS` of clock with creep, and groove never falls mid-window so the
    pot on the table never shrinks. A cash carries the combo into the next
    window; a bust takes it with the pot. `check:pressure` is the ratchet: a
    perfectly timed hand busts exactly as often as an untimed one, a slipping
    hand never banks more, and the beat must pay less over listening than
    listening pays over playing blind. The ending's vault slack reads the vault
    without `grooveVault`; the beat's own door is `BEAT_SLACK_COMBO`.
39. Relics bend a rule; they never break the table. A closed case (not the
    final one) drafts three relics from `getRelicPool` -- the defaults plus what
    the codex unlocked -- seeded by its last window so a reload cannot reroll
    them, and `openCaseRun` carries the offer to the next case's first table.
    The draft and the briefing page (priority 51) are the only surfaces allowed
    in front of the table; the draft is there only because it is that screen's
    decision: it holds the clock, keys 1-3 take
    a relic, Escape passes, and `dismissProtocolBreach` passes for flows that
    only need to get past a decision. A pick re-deals the untouched window
    (`REDEAL`) through the same `equipRelic` the runtime saves. The board
    records the relics it was dealt (`schema.relics`), so `applyRelics` is
    idempotent. A relic that softens a mutation names itself on the breach
    (`softenedBy`). The codex (`critical-point-relic-codex-v1`, owned by
    `useRelicTable`) outlives a reset, and feats unlock into it before that
    case's draft is dealt. `check:pressure` replays every relic alone and all
    together: listening must still beat blind play, stay under 0.6 of a
    wall-seeing player, busting to skip must stay under a quarter of blind play,
    and no single relic may lift best play past 1.35x. INSURANCE kept half the
    pot until it put listening at 0.59 of the ceiling; it keeps a third. A
    recovery slot keeps relics drafted since it and cannot return a spent
    INSURANCE. REBOOT no longer takes the active-rules panel: the draft and the
    reveal already say the case closed.

40. Every scene grounds itself, because no scene can rely on the one before it.
    The route split opens a case at four different authored scenes, so picking
    `layoff` in CASE 01 enters at `payday` with the accounting scene never
    played. `src/nodes/sceneContext.js` is where a scene says which room it
    happens in (`place`), how much of the deadline is left (`clock`), what it is
    actually asking (`question`) and how the analyst got there (`lead`);
    `applySceneContext` stamps the composed graph last, after every generator,
    and a scene without its own entry inherits place and clock from the nearest
    earlier scene in the case order. The visible line on the table is
    `node.question` -- it was generated from one template for all 149 scenes, so
    every window asked "지금 무엇을 먼저 지킬지 결정해야 합니다" under a
    different title while the situation stayed folded inside the briefing, which
    also never printed the `memo` the graph had carried since it was written.
    `npm test` holds the bar: place, clock and a question of its own on every
    scene, no two scenes asking the identical question, and no scene falling
    back to the template. Season-level continuity is copy, not derivation --
    `operatorBriefs` (the building the case moves to and why) is merged into
    `nextCaseSignals` in `src/appCopy.js` so the case-to-case seam keeps one
    home, and `getEndingEpilogue` answers all nine endings `getEndingVariant`
    can return, not four.

## Verification Commands

```bash
npm run verify
npm run test:visual
```

`npm run verify:static` is twenty-one checks: lint, CSS format, unit and smoke
tests, encoding, text, plain language, CSS tokens, CSS structure, graph, dialogue, balance,
the gauntlet loop simulation, endings, art, view contracts, constants, the runtime budget, the export
schema, the test storage keys, the visual baselines and the Node pin. None of them needs a browser, which is what lets
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

41. The season is seven cases, and the tables that describe it are keyed, not
    counted. 사건 06 (`src/nodes/case06.js`) sits between 사건 05 and the finale
    and is the one case whose subject is inside 트리거랩 -- it collects the two
    threads `c3_trap` and `f_confront` had left hanging about 오진우 having his
    own pressure condition. Adding it moved four kinds of key: the finale's
    `caseOpeningRoutes` and `getContinuityChallenge` now read `c6_after_*`
    instead of `c5_after_*`; `nextCaseSignals.case05` points at 사건 06 and a new
    `case06` entry points at the finale; the branch-briefing clone block maps
    `case06` to `c6_start`; and `AppContent`'s save-repair prefixes take `c6_`.
    Anything that counts the season now asks `CASE_SEQUENCE.length` -- the two
    achievement goals and, more importantly, the two collapse gates. A flat
    `humanCost >= 90` meant "15 a case" for six cases and silently became "12.9 a
    case" at seven, and a raw bust count charged the player for the extra windows
    a longer season deals: collapse went 22.8% -> 38.1% of 6000 seasons with no
    effect changed. `COLLAPSE_HUMAN_COST` and `BUST_PRESSURE_BASE_CASES` in
    `src/gameLogic.js` are what stop the next case from re-tuning the endings
    behind the author's back. Case 06 deliberately has no four-way route split:
    the other cases offer four strategies against an organisation, this one has a
    single person in it, so the authored middle is the route and only the
    free-text door opens another.

42. The report has one screen with no bet on it. `seasonInterludes` in
    `src/appCopy.js` is the beat between two cases -- a corridor, a text message,
    a vending machine -- keyed by the case that just closed and merged onto
    `nextCaseSignal` so the seam keeps one home. Six cases of sirens in one
    register is the state it exists to break, and it is also where the season
    plants what the cases cannot: 이민서 after 사건 02, 오진우 three cases before
    his own. It renders above the next-case panel with a mood tint and no
    control, so nothing on it can be played.

43. The tree carries only what the game runs. A sweep on 2026-09-16 removed the
    twenty-seven derivations `useCaseSystems` computed on every render and
    `GameRuntime` never destructured -- a relationship graph, hypothesis actions,
    investigation targets, a mid-boss, an evidence repair puzzle, a chapter
    transfer record -- together with the twenty helpers behind them, the whole of
    `src/characterSystems.js`, four choice-card formatters and two audio cues no
    caller had, the `sceneVisuals` table, and roughly forty CSS rules for
    components that no longer exist (the `--decision-*` FX block named a
    `CriticalPointEngine` the repo does not contain). Two portraits went with the
    speakers they belonged to: `반재현` and `윤서` were truncated spellings of
    `반재욱` and `한서윤`, so those scenes had been narrated by the fallback
    "사건 관계자" profile; `이민서` got the motif she was missing. Everything is
    in the history if the game wants it back. What the sweep must not take: a
    symbol referenced only by `scripts/unit-tests.mjs` or `scripts/smoke-test.mjs`
    is load-bearing for `verify:static` (`createDecisionTargetLock`,
    `getInvestigationOutcome`, `getDynamicMusicLayers`, `createGameEvent` and
    about twenty more), and `topicParticle` stays because priority 10 tells
    authors to reach for it. `src/state/errorRecovery.js` still duplicates eight
    functions from `src/state/savedState.js` and both halves have importers, so
    that one is a refactor, not a deletion.

44. The season is one chain, and its vocabulary is the one a Korean bank uses
    now. Seven cases used to be an anthology of unrelated organisations, so
    nothing learned in 사건 01 could be spent in 사건 04 and nothing in 사건 01
    mattered. They now hang off a single bad loan -- KD은행's 310억 to 플로우온,
    대출번호 2023-0412 -- which collapses in 01, is covered up in 02, is moved to
    노바웍스's books in 03 and onto 온새's care hours in 04, lands on 312 people
    who never borrowed in 05, breaks the analyst in the next chair in 06, and is
    finally traced to the empty signature box in the finale. The analyst is the
    one who wrote the dissent on that loan three years ago and was transferred
    into the lab for it, so 사건 01 is personal before the first card is staked.
    Two people were added for the chain to be answerable: 윤상혁 (그룹전략실
    상무, speaks `f_confront`) left the box empty, and 임경수 (퇴직 심사팀장,
    speaks `c2_trace`) keeps the paper original the system no longer holds.
    Neither has a portrait; see priority 72 for how an unpainted speaker is
    drawn.

    Two rules this bought, both about copy:
    - No Japanese-style loan vocabulary. 여신, 융자, 품의서, 결재란, 상각,
      기한이익 and 주채무계열 read as either a translation or a period piece;
      the text says 대출, 심사 보고서, 서명란, 손실 처리 and spells out what a
      clause does instead of naming it. Those words are at zero in `src/` and a
      new one should not come back.
    - A term a fifteen-year-old would not know is unpacked in brackets the first
      time a player can see it, in the scene body rather than the folded memo:
      부채비율, 산식, 엠바고, 유동성 위기 all do this once and never again.
    Nothing structural moved -- choice ids, effects, cognition, triggers, the
    graph and the nine endings are byte-identical, so `check:balance`,
    `check:endings` and the ranking tiers are unaffected. What changed is
    `speaker`, `title`, `text`, `memo`, `sceneContext`, `characterProfiles`,
    `seasonCasesBase`, `nextCaseSignals`, `seasonInterludes`, `operatorProfiles`
    and the intro premise.

45. The repository carries only what a build, a check or a deploy reads. The
    `.agents/` role scaffolding and `scripts/agent-cycle.mjs` were removed on
    2026-09-16: nothing referenced them, no workflow ran them, and their local
    run logs were already ignored. `report:pressure` went with them -- it was
    byte-identical to `check:pressure`, not a variant of it, unlike
    `report:endings` which passes `--report`. `.gitignore` lost `dist-map/`,
    `.tmp-css/` and `.tmp/`, which no script has written since the tooling that
    made them was deleted; the `Profile.jpg` / `!public/profile.jpg` pair stays,
    because Windows matches that name case-insensitively and the app's icon
    would go with it. `npm run verify:static` is still twenty checks.

46. Every scene has a picture, and none of them is a file. The season ships ten
    raster images, six of which are reused as ending backdrops, so 169 scenes
    shared none: the table named a room and drew nothing. Photographs do not
    scale to that -- `check:art` caps a 480px variant at 26KB each, and a scene
    rewritten into a different building would need its art re-cut. So the
    picture is computed. `src/scenePlate.js` reads the two facts a scene already
    states about itself, `place` and `phase`, and returns a motif plus a seed;
    `src/components/ScenePlate.jsx` draws that as inline SVG. Eight motifs cover
    the season -- skyline, street, floor, control, archive, corridor, hall, desk
    -- and the seed decides which windows are lit, where the vanishing point
    sits and which element takes the accent, so two scenes in one room differ and
    a scene never differs from itself. `npm test` holds all three: every scene
    resolves to a known motif, the spec is a pure function of the node, and no
    motif exists that no scene reaches.
    - A place names its building, then its room after a `·`. The room wins:
      `돌봄 배차 복구 통제실 · 복도` is a corridor. When the room names nothing
      the classifier knows, the building answers instead, which is what keeps
      `기록 보관소 B2 · 이전 참가자 구역` in the archive.
    - It prints twice. The backdrop sits behind the scene header, absolutely
      positioned, cropped to the middle band of the frame and masked to fade
      right, so it costs the table none of the one screen priority 27 gives it.
      The readable copies are the splash panel of the briefing page and the
      table's folded briefing.
    - An SVG root is a replaced element, so an absolutely positioned one takes
      its own intrinsic width and ignores `right`. `inset: 0 0 auto` therefore
      left the backdrop 360px wide inside a 328px header -- 15px past a 360px
      phone, which `gauntlet-loop.spec.js` caught and no other check would have.
      The backdrop states `width: 100%` instead of relying on two offsets. The
      panel needs no such guard: a closed `<details>` skips layout for its
      contents, so the drawing inside it contributes no width at all.
    - Colour is `--plate-*` only, mapped onto the night-shift tokens, and none of
      it is lime: priority 30 keeps that for the control that records a decision.
      The accent is `--ui-heat` on the pressure beats and `--ui-chip` elsewhere.
    - It is `aria-hidden`. The room and the deadline are already text in the
      dateline directly above it.

47. A baseline is stale the moment a screen's copy changes, and nothing in
    `verify:static` says so. `check:visual-baselines` only asserts that a file
    exists per platform, so the story rewrite on 2026-09-16 shipped an intro
    paragraph 40px taller than every committed screenshot and twenty green
    checks said nothing. Re-record with `npm run test:visual -- --update-snapshots`
    in the same pass that changes a screen, and remember that only `win32` can be
    recorded from a Windows checkout -- `linux` needs the Visual Regression
    workflow dispatched with `update_baselines`, which priority 19 already says.

    The geometry gate in front of that comparison now asks the captured PNG, not
    the DOM. It used to read `Math.ceil(scrollHeight)` and compare that to the
    baseline's pixel height, which agreed only as long as the document height
    stayed whole: the new intro copy made it fractional, the DOM read 2454, the
    capture rasterised 2452, and a run where nothing had drifted failed with the
    gate's own message telling the reader to fix `readCaptureGeometry()`. The
    capture is what `toHaveScreenshot()` compares, so it is what decides; the DOM
    number stays in the attached diagnostics.

48. 사건 07 is an eighth case, and the first one the analyst does not judge.
    Six cases ask what will be given up and none of them let anything be taken
    back, so the season ran on one register and reached the finale with nothing
    but resentment to spend. 사건 07 is the beat that pays: the group answers
    사건 06 with a posting rather than a dismissal -- no grounds needed, no
    appeal, 48 hours -- and the analyst spends those hours asking four people
    for the four things only they hold. Three of the four hand it over and every
    one of them is charged for it. Its own room set arrived with it (감사팀 서고,
    강서지점 창구, 회기동 헌책방), which is why the plate gained a `counter`
    motif.

    Adding it moved the same four kinds of key 사건 06 did -- `caseOpeningRoutes`
    and `getContinuityChallenge` now read `c7_after_*` for the finale, the
    `nextCaseSignals` chain gained a link, the branch-briefing clone block maps
    `case07` to `c7_start`, and `AppContent`'s save-repair prefixes take `c7_` --
    plus three that 사건 06 did not:
    - `check-dialogue.mjs` counts generated scenes (42 -> 48) and `smoke-test`
      counts their choices (132 -> 150). Both are per-case counts wearing a
      literal, so a case adds to both.
    - The collapse gate's pressure half was still a flat 31 while its human-cost
      half and the bust rate were already derived from `CASE_SEQUENCE.length`.
      `peakRiskPressure` is a maximum over case walks, so an eighth case takes an
      eighth draw at it and collapse went 31.6% -> 38.5% of 6000 seasons with no
      effect changed -- the same shape of drift priority 41 was written about.
      `COLLAPSE_PRESSURE` now rises by one per case past seven, which puts it
      back at 32.0%. Both halves being length-derived also prices a bust slightly
      lower, so the unit test's sample strain moved 28 -> 29.
    - A smoke assertion listed every case by name and sent the rest to an `else`
      that expected exactly one branching scene. The list was every case there
      was, so that branch had never run; 사건 07 fell into it with four branching
      scenes. Every case in this season splits, so the list is gone.

49. The plate draws rooms with people in them. The first version drew empty
    architecture, which is wallpaper: the audit room and the archive were the
    same grey box with different furniture, and the backdrop behind the speaker
    read as texture rather than a place. Three changes fixed it, and all three
    are still computed from the scene rather than shipped as art.
    - Silhouettes, standing or seated, placed where the scene's speaker would be.
      A room with one person in it stops being a diagram.
    - Light belongs to the building, not the case. `getPlateTone` hashes the
      segment of `place` before the `·`, so every room inside 트리거랩 is lit one
      colour and every room inside 강서지점 another, and the season's movement is
      visible before the dateline is read. The accent stays chip-or-heat in every
      building, because that pair means "how much pressure is on this scene" and
      cannot also mean "which building".
    - The accent carries a radial halo, and the backdrop went from 0.62 to 0.78
      opacity with the mask holding longer before it fades. `contrast.spec.js`
      and the axe pass both still hold over it.

50. `/scene-final.webp` and its two variants were promised to the browser by
    `src/responsiveArt.js` and rendered by nothing -- the endings reuse
    `scene-case01..05` and the three `ending-*` files, and no surface ever named
    this one. Deleted with its entry. `check:art` is 9 images now, not 10.

51. Reading is not on the clock. A window used to open live: 45 seconds, heat
    creeping after 4, and the scene's story -- its lead, its body and its four
    case facts -- folded shut inside `사건 브리핑`, so opening it spent the
    clock. The score's own 사고 리듬 band asks for 8 to 28 seconds of *deciding*
    and the 즉답 패널티 charges anything under 2, which means the design was
    asking for deliberation out of the same 45 seconds it made the player read
    three paragraphs in. In practice the table taught the opposite of what the
    project is about: do not read.

    A window now opens on the briefing page (`SceneBriefing.jsx`, styled in
    `briefing.css`): a modal page of a graphic novel -- the room as a splash
    panel with its place/clock caption and a sound effect, the speaker's
    portrait with the scene's question in a balloon, the lead and body as
    caption boxes, the memo as a pinned case file, and the protocol breach as a
    red panel when the last decision broke this board (the floating breach
    banner is gone; `data-testid="protocol-breach"` now names that panel). The
    page has its own reading clock, `getReadingSeconds(node)`: 6s plus one second
    per 16 characters, clamped to 12-35s. When it runs out the table opens by
    itself; `판 열기`/Space opens it sooner, and a card button or number key on
    the page opens it with that card already staked (`openTable(cardId)` goes
    through the same authority gate as a click on the table). The table's 45
    seconds stay paused the whole time the page is up, so nothing about the
    table's balance moved, and nothing in `check:pressure`, `check:balance` or
    `check:endings` changed.

    It also fixes the measurement. `responseTimeSec` is the window's elapsed,
    which only advances unpaused, so it is now decision time rather than reading
    time plus decision time -- the number this whole repository exists to
    collect was measuring two things at once and could not tell a careful reader
    from someone who skipped the text.

    What it cost, all of it in the harness: every flow that touches a table has
    to open it first. `dismissProtocolBreach` is the one place that knows --
    relic draft and briefing page both hold the clock -- and
    `startDebugNode`, `startFirstRun` and `resumeSavedRun` call it. Two ordering
    bugs came out of that and are worth remembering: a wait for an *enabled*
    card never returns while the briefing page is up, because every card is
    `aria-disabled` until the table opens; and the best-effort wait inside
    `dismissProtocolBreach` must stay short, because it runs on every scene of
    every walk and at the 60-second action timeout the suite began timing out in
    a different place each run.

52. Priority 27 is a rule about a decision under time pressure. The briefing
    page holds the table's clock and scrolls inside itself on a phone, so it is
    the one surface that may be taller than the screen -- and the layout tests
    measure the timed board, which is what the rule protects. That is why
    `startDebugNode` opens the table by default rather than the specs each
    reading past a briefing.

53. The season is ten cases, and its second act argues the thesis out loud.
    The game started from one question -- not "how smart am I" but "when do I
    get smart" -- and the claim that very different feelings wake the same
    obsessive thinking and aim it somewhere different. Seven cases had shown
    care and burden and never let a grudge think. 사건 08 「돈의 흔적」 is the
    grudge's intelligence: the posting from 사건 07 lands the analyst on the one
    counter a shell company's consulting fees pass through, and 오진우 follows
    them on his father's line -- a man above you is still a man, wanting spends
    money, money leaves a trail. 사건 09 「두 장의 손익계산서」 is care and
    burden together: 플로우온 is back at 72 hours for liquidation, the founder's
    son who refused the family business sits across the table for the bank that
    wants it closed, and he takes no help he cannot write down. The case closes
    on whether the sheet that rescues the company and the sheet that charges the
    people who broke it go on the same table. Three people arrived with it
    (나준혁, 권도현, 강태민; no portraits -- priority 72 draws them), plus a `revenge` trigger (복수) and interludes after
    both cases.

    Adding two cases moved the keys priority 48 lists, twice: node files and
    `nodeOrders`, the aftermath and connective and reaction tables (now named
    `lateSeason*`), the side-door plans, `dramaticRoutePlans`,
    `evidenceTurnaroundPlans`, `continuityMemoryChoicePlans`, `caseOpeningRoutes`
    (the finale reads `c9_after_*`), `branchOpeningCopy`, the clue, outcome,
    carryover and continuity tables in `gameLogic.js`, `nextCaseSignals`,
    `operatorBriefs`, `chapterRules`, `triggerLabSignals`, `chapterMotifs`,
    `caseSetting` and every scene's context. The counts that wear a literal
    moved too: `check-dialogue.mjs` 48 -> 60 generated scenes and `smoke-test`
    150 -> 186 choices. The collapse gates are length-derived, so nothing was
    retuned: collapse reads 34.2% of 6000 seasons (32.0% at eight cases). The two
    unit samples that sit on a coordinate of that gate moved (16 -> 26 busts,
    strain 29 -> 33), for the reason priority 48 already gives. The opening
    clone's base scene is `CASE_START_NODES[caseId]`, not a ternary that had to
    be extended per case.

54. The report names what woke the thinking. `getThinkingMotive` groups the
    run's trigger scores into four families -- 애정형 (affection, protection,
    trust: rescue), 복수형 (revenge, injustice, competition, recognition:
    correction), 책임형 (responsibility, order, reward, system: recovery) and
    탐구형 (the rest: discovery) -- and `판단 DNA` prints the winner with the road
    its thinking takes. A run with no record falls back to 책임형, the burden the
    season opens with. It sits inside `.report-archive`, so priority 28's first
    screen is unchanged.

55. The plate moves. The far plane drifts, the accent's halo breathes and its
    light flickers, the air carries dust by day and rain (outdoors) or slow
    specks (indoors) after midnight, screen rooms get raster lines and a light
    band every 7s, pressure beats get a slow red vignette, and the briefing copy
    zooms and pans over 32s. Particle positions and timings come from a second
    generator on the scene's seed, so a scene never differs from itself and the
    existing drawings did not move. It is all transform or opacity inside the
    SVG's own clipped viewport (priority 27 and the `width: 100%` rule hold),
    none of it is lime (priority 30), and under reduced motion it stops on a
    finished drawing. Two motifs arrived with 사건 08 and 09: `coast`
    (경포/바닷가/펜션/해변/항구/방파제) and `gallery` (갤러리/화랑/전시장), tested
    before the generic room words. `street` also answers 중앙시장, 골목 and
    주차장 -- not 시장, which is inside 전시장 and turned the gallery into a street.
    The play.css budget is 3360 / 70200.

56. Priority 44's vocabulary rule applies to names as well as terms. New copy
    uses the words a Korean bank uses today (승인, 작성일, 대출 -- 결재, 기안 and
    여신 are at zero in `src/` and one of them had come back in 사건 07), and a
    person or a company is named the way someone would be named now: 탁필성,
    문기석, 권혁배, 권혁수, 서명철, 남궁철 and 한결은행 became 나준혁, 강태민,
    권태호, 권승우, 배성준, 남궁현 and 브릿지은행. A rename keeps the old name's
    last syllable shape -- a consonant ending for a consonant ending -- because
    the particles already written after it (와/과, 은/는) agree with the old name,
    and a vowel-for-consonant swap breaks every one of them silently. A term a
    fifteen-year-old would not know is still unpacked in brackets the first
    time it appears in a scene body: 채권단, 회생, 청산, 선순위 담보, 출자전환,
    고용 승계, 배임, 횡령, 매출채권, 보전 신청, 정기검사, 담보 순위, 감정평가법인,
    세무 대리인 and 휴면 법인 계좌 all do this once.

57. A second sweep on 2026-09-16, same rule as priority 43: what nothing reads
    goes. `src/state/savedState.js` no longer carries a copy of the eight
    error-recovery functions; `errorRecovery.js` is the single source (the
    intro shell loads it without the scene graph) and `savedState.js`
    re-exports `recordAppError`, with the queue label settled on "에러 로그".
    `GameRuntime` lost its second save-suppression flag and the two functions
    behind it, which only defaults no render path reached could call.
    `boardChangePrompts` had no reader. `docs/operations.md` had no link; its
    deploy and retention notes are in the README now. Symbols used only inside
    their own module lost `export`. Three hand-kept case lists that had fallen
    behind the season were bugs, not style: the intro's unlock chain stopped at
    사건 05 and opened the finale straight after it (06 and 07 never unlocked
    through play), `unlockAllCasesForTest` stopped at 06, and 사건 07 opened on
    사건 01's echo line because the intro-echo ternary stopped at 06. The unlock
    is "the previous case in `seasonCasesBase` is complete" with a unit test,
    the test unlock is `CASE_SEQUENCE` minus the finale, and the echoes are the
    `caseIntroEchoes` table. `raise-choice-gains.mjs` had also stopped listing
    cases at 05.

58. A table can be put down. Ten cases do not fit in one sitting, and a touched
    window used to settle as a bust whenever the run came back without it -- a
    phone reclaiming a background tab counted. Now leaving on purpose
    (`저장 후 나가기`), the page going to the background, or `pagehide` writes the
    live window's progress into the run as `dynamics.suspended`
    (`useWindowSuspension`), and the stage deals the same seed on return with
    that progress on top (`createWindow({ resume })`). What keeps it honest:
    - The wall and the tell are dealt from the seed again and never read from
      the save; `resumeWindow` clamps progress under the wall and the clock.
    - Only a live window is suspended. A bust is closed the moment it happens,
      so there is nothing to suspend and a reload still settles it.
    - A snapshot taken because the page was hidden is cleared the instant the
      page is visible again, before input can reach the table, so "hide, push
      into the wall, reload" has nothing to reload into.
    - A suspension carries the run's `windowIndex` and is dropped by
      `normalizeRunState` once that window settles; the stage clears it on its
      first hold write.
    The exit confirm that warned a bet would bust is gone. `save-resume.spec.js`
    holds the exit path and the reload path; `unit-tests.mjs` holds the tamper
    and staleness cases.

59. Saves follow the player, device first. `writeSaveState` fires
    `SAVE_WRITTEN_EVENT` after every write that reached storage;
    `src/cloudSave.js` (loaded by the intro shell, so no scene graph) marks the
    save pending and uploads it a few seconds later when online, on the
    `online` event, on a 30s retry, or on the next launch. The copy is filed
    under a 12-symbol continuation code (no 0/O/1/I; 60 bits) shown in the
    folded `다른 기기에서 이어하기` panel under the intro's primary action
    (`CloudSavePanel`), with the settled-window seeds alongside so a loaded save
    cannot replay a wall this device has seen. Loading a code writes the save
    paused, merges the seeds and adopts the code, so both devices share one
    copy; 이어하기 is still the player's own click. The server refuses an
    upload older than what it holds, which the panel reports as a conflict with
    "더 최근 저장 불러오기". Supabase not configured means device-only, said
    plainly in the panel.

60. The database follows the season. Migration
    `20260916000000_ten_case_season_cloud_saves.sql` replaced every hand-kept
    case list (three insert policies, three branches of
    `validate_telemetry_insert`) with `is_season_case_id()`, which accepts any
    `caseNN`: the live database had been refusing every case, feedback and
    error row from 사건 06 on since 사건 06 existed. It added `cloud_saves`
    (RLS on, no grants) behind `put_cloud_save` / `get_cloud_save`, security
    definer, keyed by the code's SHA-256, 1.5MB cap. And it deleted the four
    `season-final` rows so the ranking starts over on the ten-case season;
    per-case telemetry was kept. The local board moved to
    `critical-point-local-ranking-v2` and removes v1 on first read. Verified
    against the live project with the anon key: the two functions work, the
    table itself is refused, `public_rankings` is empty.

61. The 10-case season walk in `season-flow.spec.js` has 300s, not 180s: at
    ten cases it takes 2.7 minutes alone on the development machine, the same
    on the commit before this pass, and ran out under a parallel suite.

62. The season is eleven cases, and the eleventh one answers the objection the
    other ten earn. Priority 53 gave the thesis its second act: 사건 08 is the
    grudge's intelligence, 사건 09 is affection's and responsibility's. Both end
    in a win, and both are exactly what the source conversation refused to
    believe -- that someone can keep spending themselves on other people's
    problems and not run out. 사건 10 「멈추지 못하는 사람」 agrees with the
    objection instead of arguing with it. Ten days after 플로우온 is saved,
    도윤하 -- who has counted, alone and off the books, all 1,740 people hurt by
    the loan she sold at a branch counter -- collapses, and the list, never
    registered as an official record, is due for automatic deletion in 96 hours.
    The case asks what goodwill costs and who holds the invoice, not whether it
    is good. Moving the list from one person to a procedure keeps it alive and
    drops the 212 the rules were not written for; the last scene does not
    resolve that trade.

    What moved, beyond the eleven tables every case fills (priority 53 lists
    them): `caseOpeningRoutes.final` and `getContinuityChallenge().final` re-key
    from `c9_after_*` to `c10_after_*`, and the three `f_start_*` openings were
    rewritten -- they narrated 사건 09's aftermaths and now narrate 사건 10's, so
    the two heading regexes in `season-flow.spec.js` moved with them.

    Numbers that had to move, and why:
    - `check-dialogue.mjs` 60 -> 66 generated scenes, `smoke-test.mjs` 186 -> 204
      authored choices. Three connective and three reaction scenes per case.
    - `check-runtime-budget.mjs`: `gameData.js` 3120/17 -> 3320/18,
      `gameLogic.js` 1395 -> 1420. `check-bundle-size.mjs`: GameRuntime
      660_000 -> 720_000. `check-css-structure.mjs`: `play.css` 3360/70200 ->
      3400/71400 for the two extra tone classes in priority 63.
    - `unit-tests.mjs` collapse sample 26 -> 33 busts. Both halves of the
      collapse gate derive from the season length, so an eleventh case prices a
      bust lower (`x 6/11`) and sets the line higher (`31 + (11-7)`).
    - The case was authored hotter than its neighbours: its mean peak risk
      pressure measured 25.0 against a season mean of 18.5, and because
      `peakRiskPressure` is a season-wide max, that alone took collapse from
      34.2% to 46.7% of 6,000 random seasons. Its `time`, `fatigue` and
      `capital` costs were scaled back until the case measured 20.7, next to
      사건 08's 21.2 and 사건 09's 20.3, and collapse settled at 36.6%. A new
      case has to be measured against the season, not just balanced inside
      itself; `check:endings` passes either way, because it has no ceiling on
      collapse.

63. The plate's light belongs to the organisation, not to a hash. Priority 49
    gave each building its own colour so the season's movement would be legible
    before the dateline is read, and `getPlateTone` implemented it as
    `hashString(place.split("·")[0]) % 4`. That text is the building *and the
    room*, so `플로우온 본사 8층 상황실` and `플로우온 본사 8층 재무회의실`
    hashed to different numbers. Measured over the season's 91 places it gave
    트리거랩 four colours, 플로우온 four, 온새 three and KD은행 two -- the lab
    changed colour sixteen times while the player stood still, which is the one
    thing the tone exists to prevent. `ORG_RULES` now names the six owners
    (lab, client, rival, bank, care, and `outside` for everywhere in the season
    that employs nobody), and `unit-tests.mjs` asserts the exact room sets that
    used to disagree.

    Five rooms were added at the same time, because 24 distinct places were
    falling through to the generic `desk`: `cafe`, `lobby`, `transit` (the back
    of a car, tested before the road it is on), `bookshop` (a second floor made
    of paper, tested before the alley outside it) and `ward`. That took the
    fallback from 24 places to 17, and the 17 left are actually desks. Rain now
    falls behind glass in `transit` and `cafe` as well as outdoors.

64. A third sweep, same rule as priorities 43 and 57: `src/state/gameEvents.js`
    (an event-sourcing sketch for an investigation system nothing dispatches)
    and `src/viewModels/playChoiceViewModel.js` (`createDecisionTargetLock`, a
    commit-console disclosure row no JSX renders and no CSS styles) had no
    inbound reference from app code -- only from a test each, so the suite was
    the only thing keeping them alive. Both are gone with their tests, and
    `eslint.config.js` lost `dist-map/**`, `.tmp/**` and `.agents/runs/**`,
    which priority 57 removed from `.gitignore` and missed here.

65. A baseline waits for the font it is measured in. The Linux baseline and the
    Linux comparison of the same commit disagreed by 2,840 pixels, all of them
    the fourth choice card, whose box measured two pixels taller in the
    recording than in the comparison while its row-mate matched exactly. The
    scene's four choices are static data and the accessibility tree was
    identical in both runs, so what differed was the layout, caught at two
    different moments. Pretendard ships as ~90 dynamic subsets with
    `font-display: swap`: a screen paints in fallback metrics and relays itself
    when the subset carrying its glyphs lands. `stabilizeVisualPage` froze
    animations, transitions, the clock and the heartbeat, and never waited for
    that. It now awaits `document.fonts.ready` plus the two frames the reflow
    lands in, so a baseline cannot be recorded in a state the comparison is
    unable to reproduce. Re-recording the Windows set against it produced
    byte-identical files -- the race only bites the CI container, where the font
    cache is cold -- and the Linux re-record changed exactly one file, the one
    that had been failing.

    This is the shape of bug the whole visual tier exists to catch and could not
    catch in itself: both halves were green in isolation, and only the pair
    disagreed.

66. Deploying presses its own button, and `render.yaml` presses nothing. That
    file is a Blueprint spec, so Render applies it only to a service it manages
    as one, and the service serving the game was created by hand in the
    dashboard. Measured against the live site, two of its settings had never
    been in effect:

    - `autoDeploy: true` had never deployed anything. Every release until
      2026-09-18 was a person pressing `Deploy latest commit`.
    - The `headers` block was not being sent. The site answered with
      `x-content-type-options` and nothing else: no CSP, no Referrer-Policy, no
      Permissions-Policy, and an `index.html` cached for five minutes rather
      than `no-cache`.

    `.github/workflows/deploy.yml` is the press. It hangs off Verify rather than
    off the push, so what reaches the site is a commit whose end-to-end tier
    also went green -- which the Render build command never runs, stopping at
    `verify:static`. Render's own Auto-Deploy would deploy every push regardless
    of CI, which is why it is still off. The headers were mirrored into the
    dashboard by hand; `render.yaml` carries a header saying it is inert, and
    stays as the written record of what the service should be.

    Two repository secrets now matter, and both were absent until this pass:
    `RENDER_DEPLOY_HOOK` (the deploy hook URL, which carries its own key, so it
    is the secret in full) and `DEPLOY_URL` (the site's address, which is not
    secret). Without the first nothing deploys; without the second nothing is
    checked.

    `Deployed Smoke Check` is why the missing headers were found, and it is also
    the reason they went unnoticed for so long. With `DEPLOY_URL` unset it took
    an `if` branch that echoes a sentence and exits 0, so a job named for
    checking a deployment reported a green tick having fetched nothing -- good
    enough to make a reader conclude the latest commit was live. Both it and
    the deploy job now raise a warning annotation when they skip, because an
    annotation is the part of a run that reaches the checks list. A job that
    cannot do its work should say so where the tick is, not in a log nobody
    opens.

67. The beat test aimed at a window shorter than a frame. `pushAtBeat` waited
    for `--gx-beat-phase <= 0.02`, and that variable clamps at 1 instead of
    wrapping, so it only sits that low for the first 2% of a period -- about
    12ms of a 600ms beat, against the 16.7ms frame the callback polls on. The
    window was stepped over whenever a runner was loaded, and a reading that did
    catch it could be a frame stale before the click dispatched, which is how a
    press the helper reported as landed produced no grade at all.

    `--gx-beat-zone` is the app's own answer to whether a press lands in the
    GOOD window, computed from the clock it grades with, and that window is
    +/-18% of the period with a 60ms floor -- wide enough that a frame of drift
    stays inside. The helper reads that instead, and waits to see the phase
    actually change before trusting any of it, because a variable written every
    frame and then abandoned reads live forever.

    This test had been failing intermittently on main since at least 2026-09-16
    (four red Verify runs on commits that had nothing to do with it). A timing
    helper that samples a rendered variable and acts a frame later has to aim at
    the middle of the tolerance, not its edge.

68. The free-input card now has an LLM reading alongside the regex one, and the
    regex one did not move. `scoreFreeText` still decides the resource effect,
    the cognition axes, the three-signal success gate and the branch target,
    all inside the submit handler, because that handler is synchronous and the
    betting window it runs under is a stopwatch -- a card that pauses for a
    network round trip after the player commits is a card that broke. The model
    is asked only for what can arrive late: the trigger vote and its
    confidence, the headquarters line, the ending weight, and two scores the
    result screen reads at the end of the run. If nothing comes back the entry
    keeps `llmEnriched: false` and there is nothing to undo, which is why the
    regex scorer is the default path rather than the fallback.

    Three things the prompt was originally written to do, it cannot. It cannot
    judge the two-second penalty: it never sees a response time, and
    `exploitPenalty` excludes free-text entries anyway. It cannot own "rhythm":
    `rhythmScore` is a stopwatch and the model was being asked to score prose,
    so the prose axis is called `grounding` and feeds `reflectionScore`
    instead. And it cannot name 사람 피해 as a fracture target, because
    `scoreFreeText` never writes `humanCost` -- billing 1.5x on a number the
    card cannot move bills nothing.

    The key lives in `supabase/functions/analyze-free-text`, not the bundle:
    this is a static site and the browser holds only the anon key. The player's
    sentence leaves the device only with telemetry consent and only when
    `detectPrivacySignals` is clear -- text the game already refuses to quote
    back into the next scene is text it refuses to send.

    The reading reaches telemetry two ways, and the second exists because of
    when it lands. A card enriched now is part of the `log` state, so the next
    card's `decision_log` carries it -- every card but the last one of a case,
    which is still in flight when that case's row is written. `free_text_analyses`
    takes that one on its own row. The table holds no player prose and
    `free_text` must never become a column on it: what is stored is what the
    model said about the sentence, not the sentence. It is insert-only under the
    same `validate_telemetry_insert` trigger as every other telemetry table --
    that trigger's `if/elsif` chain names three tables and falls through to the
    shared session-id and rate-limit checks for a fourth, which is the whole
    reason this table needs no new validation of its own. It also means the
    analysis rows spend the same 120-per-hour budget as case telemetry.

69. The second reader runs offline, not live. The project has no Anthropic key
    -- the account is shared and provisioning one is a permission question, not
    a budget one (a card costs about half a cent on Haiku) -- so
    `VITE_ENABLE_LIVE_ANALYSIS` defaults to false and the browser makes no call
    at all. Without that flag every free-input card would spend a Supabase
    function invocation to be told 503.

    `npm run analyze:free-text` does the reading instead: it pulls collected
    `decision_log` entries with the service-role key (fetched from the linked
    project at run time, never stored), runs each card through Claude Code in
    headless mode -- which authenticates as the person at the keyboard rather
    than as a key the project would have to own -- and writes JSONL plus a
    summary to `analysis-out/`, which is gitignored because it holds player
    sentences. What it gives up is the in-game reaction; what it keeps is
    everything the prompt was written to learn.

    Two things this cost. The prompt moved to
    `supabase/functions/analyze-free-text/prompt.js` so the edge function and
    the batch runner read one copy -- a prompt that drifts makes the batch
    numbers say nothing about the live ones. And the assistant prefill that
    forced the opening brace is gone: it works on Haiku and returns a 400 on
    Sonnet 5, Opus 5 and the whole 4.6+ family, so it would have turned a
    one-word model swap into an outage. The client's parser tolerates a
    preamble instead.

    The runner spawns the published `claude` executable directly with
    `shell: false` and sends the prompt over stdin. The Windows npm shim is a
    `.ps1`/`.cmd` pair that cmd.exe cannot always find from a POSIX PATH, and
    the easy fix for that -- `shell: true` -- would put a player's sentence on
    a command line.

70. The season is twelve cases, and the twelfth room is the first one anybody
    outside can see into. Ten cases were decided behind doors, and the man at
    the top of the chain -- 윤상혁 -- never had to stand in any of them. 사건 11
    「모두가 보는 방」 makes the loan a news story (탐사보도 매체 리드라인, 기자
    서하린), calls the analyst to a 국정감사 as a 참고인 (보좌관 차지원 holds
    the seven minutes), and calls 윤상혁 as a witness who does not come. It is
    also the season's widest emotional range on purpose: anger at two scripts
    that each end on a sentence the analyst cannot prove, the first laughter
    in eleven cases at a mock hearing on apple crates, 한서윤's confession that
    she signed the rejection, 오진우 and his father at one table, and a
    포장마차 night that ends with the 33rd floor's call the finale answers.

    Same shape as 사건 10 -- one line to the room, no route split, so
    `dramaticRoutePlans.case11.choices` is empty -- and the same tables priority
    53 lists. The finale re-keyed a third time: `caseOpeningRoutes.final` and
    `getContinuityChallenge().final` now read `c11_after_*`, the three
    `f_start_*` openings narrate 사건 11's aftermaths, and the heading regexes in
    `season-flow.spec.js` moved with them. Numbers that moved: generated scenes
    66 -> 72 and authored generated choices 204 -> 222; `gameData.js` budget
    3320/18 -> 3500/19; the collapse samples 33 -> 40 busts and strain 33 -> 35,
    because both halves of the collapse gate derive from the season length.
    The case was measured against the season rather than only balanced inside
    itself (priority 62's lesson): collapse moved 36.6% -> 32.6% of 6,000 random
    seasons, so it is not the hottest case.

    The ranking started over with it, the same way it did for the ten-case
    season: `20260921010000_twelve_case_season_ranking_reset.sql` deletes the
    `season-final` rows (per-case telemetry stays), and the local board moved to
    `critical-point-local-ranking-v3`, removing v1 and v2 on first read. Any
    later change to the season's length should do both.

71. Plain language is a check, not a habit. `npm run check:plain-language`
    (`scripts/check-plain-language.mjs`) holds the two promises the README
    makes about words. The Japanese-era loan vocabulary (여신, 융자, 품의, 기안,
    결재, 금번, 익일, 불입, 수순) is banned from every file that carries player
    copy -- it had crept back once, "개정을 기안한 부서" in 사건 10. And every
    term in its glossary must carry a (plain explanation) at the first place a
    player can read it in each case: every case can be entered on its own, and
    a case can open on its default scene or on an opening variant, so each
    opening that uses a term explains it, and the rest of the case explains it
    at first use unless every opening already did. Only narration (lead and
    body) is checked; labels and memos lean on it. A term matches at a word
    start only -- 우선순위 is not 선순위. Its first run found 22 gaps in cases
    01, 05, 08, 09 and 10; they were filled, not allowlisted. Add a term to the
    glossary rather than explaining it once by hand. Names follow the same
    rule by review: 세움테크 read as dated and is now 노바웍스 (same vowel ending,
    so every particle after it still agrees).

72. A plate has an effects layer, and a speaker without a portrait is drawn.
    `getScenePlate` returns three more facts the scene already states: `flash`
    (the rooms the public watches -- the new `chamber` and `newsroom` motifs and
    anything the new `public` organisation owns, 국회 and 리드라인), `rays`
    (open sky by day) and `lightning` (open sky at night under pressure).
    `ScenePlate.jsx` draws them in `paintFx` from the scene's own seed, over a
    static film grain every plate carries, and all of it is transform or
    opacity; with motion reduced the flashes and lightning are not shown. A
    broken board's briefing splash arrives with a red/cyan glitch done with
    `filter` so the plate's own push-in keeps its transform. `chamber` is tested
    before `hall`, because 정무위원회 회의실 contains 회의실.
    Seven speakers had no painted portrait and all fell back to one stock photo,
    so 나준혁, 권도현, 서하린 and 차지원 wore the same face. `SpeakerPortrait`
    draws them instead -- a back-lit silhouette tinted from the name, with the
    initial -- and `speaker-profile.webp` and its 160px variant were deleted
    with the fallback that was their only reader.

73. The season is thirteen cases, and the thirteenth walks into the lives the
    loan landed on. For twelve cases the 1,740 were a number -- counted,
    cited, split into a relay table -- and never a room. 사건 12 「1,740번째
    사람」 answers the hearing with a 300억 voluntary compensation fund that
    comes with a 부제소 합의, and goes to the people it is for: 문가을, who runs
    a rice-cake shop in 망원시장 and leads the victims' group, and whose husband
    ran the supplier 가온정밀 and died the year after. The range is deliberate:
    a room of 340 asking why the dissent did not stop it, a 추석 rush on the
    steamers, an anniversary at a columbarium with a letter addressed to "the
    reviewer who wrote the dissent", and the day the first payment lands. It
    closes on whether the 212 from 사건 10 are inside the compensation standard.

    Same shape as 사건 10 and 11. The finale re-keyed a fourth time, to
    `c12_after_*`, and the `f_start_*` openings and the heading regexes moved
    again. Numbers that moved: generated scenes 72 -> 78, authored generated
    choices 222 -> 240; `gameData.js` 3500/19 -> 3700/20, `gameLogic.js` 1420 ->
    1460; collapse samples 40 -> 49 busts and strain 35 -> 36; the season walk's
    timeout 420s -> 480s. Collapse moved 32.6% -> 29.0% of 6,000 random seasons.
    Three rooms were added to the plate (`market`, `memorial`, `factory`), the
    public tone took in 금융감독원, high-windowed rooms get daylight rays, and
    rooms with something on the boil get steam. The glossary gained 분쟁조정,
    부제소 합의, 집단소송 and 협동조합.

    The ranking was reset again the same day, by the rule priority 70 set:
    `20260921020000_thirteen_case_season_ranking_reset.sql` and the local key
    `critical-point-local-ranking-v4`, which retires v1 through v3.

74. The season is twenty-five cases, and a case is one file. Adding a case used
    to mean editing some twenty tables across `gameData.js`, `gameLogic.js`,
    `gameDialogue.js` and `sceneContext.js` (priority 53 lists them). From
    사건 12 on, a case is a pack: `src/nodes/caseNN.js` exports its five
    authored scenes and one object with a field per table -- aftermath,
    connective and reaction scenes with their effects and copy, the side door,
    the hidden route, the evidence turn, the memory choice, the three openings
    keyed on the previous case's aftermath, voice and echo lines, new people,
    the setting and every scene's context, the clue, the outcomes, carryovers
    and continuity challenges. `src/nodes/casePacks.js` lists the packs and the
    module that owns each table merges the field. 사건 12 was moved into that
    shape first and the composed graph compared byte for byte against the
    commit before (scenes, orders, lines, openings, outcomes): identical.
    What is still written by hand per case is small and lives where the intro
    can read it: `CASE_SEQUENCE`, start/result nodes, `nodeOrders`,
    objectives and `seasonCasesBase` in `gameCases.js`; the teaser,
    interlude, chapter rule, operator brief and intro echo in `caseCopy.js`;
    the lab signal in `appCopy.js`; the music motif. `AppContent`'s save
    repair and `check-plain-language`'s file list now derive from the case id
    and the folder instead of naming every case.

    사건 13-24 are two acts. 3막 「사슬은 반복된다」 (13-18): the group stages
    reform while moving loss onto new people the same way, and each case closes
    one colleague's arc -- 13 「혁신의 얼굴」 (a reform committee wants the
    dissenter as its face; 백아린 arrives), 14 「착한 펀드」 (an ESG fund sells
    the group's bad loans to retirees; 도윤하), 15 「정규직 심사」 (이민서's
    permanent job for a signed confession, on her brother's 수능 day), 16
    「무인 창고」 (robots leased in, the night shift out; 강태민), 17 「수첩의
    이름들」 (반재욱's notebook of the 47 he let go), 18 「스카우트」
    (브릿지은행 offers 오진우 the knife). 4막 「설계자」 (19-24) turns to the lab
    itself: 19 「종이의 무게」 (임경수's paper originals before demolition), 20
    「에코의 업데이트」 (에코 replaced by an engine trained on the analysts'
    reactions), 21 「첫 번째 참가자」 (the lab's first participant on Jeju), 22
    「인턴 문하준」 (the engine refuses 끝까지정밀), 23 「주주총회」 (one-share
    shareholders against 윤상혁's board seat), 24 「마지막 출근」 (the lab is
    dissolved and the signature box is handed over). The finale re-keyed a
    fifth time, to `c24_after_*`, with new `f_start_*` openings. Every new
    case was written to a bible that requires anger, laughter, sorrow and joy,
    and checked by a pack validator before it was wired in.

    Numbers that moved: generated scenes 78 -> 150, authored generated choices
    240 -> 456; `gameData.js` 3700/20 -> 3600/21 (it shrank); GameRuntime chunk
    800KB -> 1.52MB (prose), the intro chunk 120KB -> 105KB (the case copy moved
    out of `appCopy.js` into `caseCopy.js`, which only the runtime loads),
    PlayScreen 81KB -> 92KB; the season walk 480s -> 1200s (it takes ~11 minutes
    alone), and the Verify e2e job 25 -> 45 minutes, which it had outgrown. The collapse gate's
    per-case lift now stops at thirteen (`COLLAPSE_PRESSURE_CEILING_CASES`): a
    maximum grows with the log of the draws and the bust term is a rate, so the
    straight line put the gate at 49 and collapse at 0.5% of 6000 seasons.
    Held at 37 the nine endings read within a few points of the thirteen-case
    season (collapse 29.0% -> 26.4%). The unit samples moved to 94 busts and
    strain 36.5 for the same reason priority 62 gives.

    Words: the glossary grew from 29 to 98 terms, and every one is explained
    in parentheses at its first narrated use in each case, including 8 terms
    the pass over cases 01-12 found (상환, 담보 순위, 부도, 자문료, 계열사,
    풀필먼트, 인사위원회, 발령). Evidence-turn entry costs vary per case so the
    unique-effect floor (70%) holds.

    The plate gained six rooms -- studio, auditorium, server, orchard, trading,
    school -- and a second effects layer, in its own `plate.css` (moved out of
    `play.css`, imported right after it): snow on a winter clock (12/1/2월,
    첫눈, 한파…) instead of rain, stage light from the rig, blinking LEDs,
    night bokeh over a city, a price board, a near plane that sways against the
    far one, a colour grade from the scene's first trigger (warm, hot, cold)
    and a light leak across the briefing copy. Reduced motion stops all of it
    and hides the leak. `설명회장` is an auditorium now, not a meeting table.

    The ranking was reset by priority 70's rule:
    `20260922000000_twenty_five_case_season_ranking_reset.sql` and the local key
    `critical-point-local-ranking-v5`, which retires v1 through v4.
    `docs/free-input-analysis-prompt.md` was deleted: it was a second copy of
    `supabase/functions/analyze-free-text/prompt.js`, which calls itself the
    one copy, and nothing read it.

75. The season is fifty cases. 사건 25-49 are four more acts between 사건 24 and
    the finale: 5막 「흩어진 자리」 (25-30: 윤상혁 promoted to KD캐피탈, the team
    scattered, a stalled PF site, a credit-union run, an insurer's call centre,
    Singapore, the lab's records sold to a hiring-score company), 6막 「조사」
    (31-36: the regulator, a prosecutors' raid, a whistleblower's week, 윤상혁's
    daughter, the monsoon, the chairman's offer to pin it all on one man), 7막
    「기록의 전쟁」 (37-42: the leak, the class action, a documentary, the
    fitness score, a second hearing, a night of fireworks at 경포), and 8막
    「서명」 (43-49: the board, the verdict, 임경수's last page, 에코 restored, a
    second 추석, a new loan the analyst can sign, and the call to the 33rd
    floor). The finale re-keyed a sixth time, to `c49_after_*`.

    Written by 25 parallel authors to a second bible (volume 1's rules plus the
    new rooms, seasons, fixed evidence entry costs and a softer fast column),
    each pack clean in the pack validator before wiring. Parallel authors reuse
    example names, so a continuity pass made one person per name: 채이안 is the
    KD캐피탈 위험관리부장, 도건우 the group crisis-TF lead, 석재우 the CEO office's
    chief of staff; the rest were renamed, and KD캐피탈's floors were fixed
    (위험관리부 12층, 대표이사실 20층). Future parallel writing should hand out
    names, not examples.

    Numbers that moved: generated scenes 150 -> 300, authored generated choices
    456 -> 906; GameRuntime chunk 1.52MB -> 3MB (about 860KB gzip), intro chunk
    105KB -> 125KB (the season list), PlayScreen 92KB -> 100KB; the season walk
    1200s -> 2700s and the Verify e2e job 45 -> 80 minutes. The collapse gate
    needed nothing: with its lift capped at thirteen it reads 25.5% at fifty
    cases; only the two unit samples moved (188 busts, strain 36.8). The
    glossary is 189 terms; a second pass explained its new terms in cases 01-49.

    The plate gained four rooms (`construction`, `courtroom` -- tested before the
    hearing room, so a 법정 is not a 국정감사 -- `airport`, `callcenter`), and
    장례식장/빈소, 방송국, 편집실 and 루프탑/마리나 joined existing rooms. A third
    effects layer reads the second year's seasons off the clock: blossom (4월,
    벚꽃), the monsoon (장마, 폭우: heavy rain by day too, with rings in the
    puddles), heat haze, festival fireworks, leaves (9월, 낙엽) and the 추석
    moon, drawn behind the room so buildings stand in front of it. Clear nights
    (fireworks, moon) never draw the random night rain. No scene written before
    this pass states any of those seasons, so no existing plate or baseline
    changed.

    README now describes every case from 01, and the ranking was reset by
    priority 70's rule: `20260922010000_fifty_case_season_ranking_reset.sql` and
    `critical-point-local-ranking-v6`, which retires v1 through v5.
