# Critical Point Work Status

Last updated: 2026-09-16

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
    token lives in sessionStorage, so a reload of the betting tab settles the
    bet as a bust at once while a different tab is asked first
    (`table-held-elsewhere`). Settled seeds are also recorded outside the save,
    so a rolled-back save deals a fresh wall.
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
    The draft is the one surface allowed in front of the table, only there, and
    only because it is that screen's decision: it holds the clock, keys 1-3 take
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

`npm run verify:static` is twenty checks: lint, CSS format, unit and smoke
tests, encoding, text, CSS tokens, CSS structure, graph, dialogue, balance,
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
    세움테크's books in 03 and onto 온새's care hours in 04, lands on 312 people
    who never borrowed in 05, breaks the analyst in the next chair in 06, and is
    finally traced to the empty signature box in the finale. The analyst is the
    one who wrote the dissent on that loan three years ago and was transferred
    into the lab for it, so 사건 01 is personal before the first card is staked.
    Two people were added for the chain to be answerable: 윤상혁 (그룹전략실
    상무, speaks `f_confront`) left the box empty, and 임경수 (퇴직 심사팀장,
    speaks `c2_trace`) keeps the paper original the system no longer holds.
    Neither has a portrait, so both fall back to `/speaker-profile.webp` the way
    이민서 already did.

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
      The readable copy is inside the briefing, which is closed by default.
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
