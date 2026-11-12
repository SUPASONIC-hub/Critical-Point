import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { WEB_AD_CODE_MARKERS } from "./adsense-config.mjs";

/**
 * Bundle and first-paint budgets.
 *
 * Every budget here ratchets DOWN, never up. Until 2026-09-27 each one sat at
 * 97-99.7% of its chunk because every change that grew a chunk also raised its
 * number, which made the check a record of sizes rather than a limit on them.
 * They were re-baselined that day to the measured size plus about 5% -- room for
 * an ordinary change, not for a new feature -- and the history of the old
 * numbers is in `git log -p` of this file. A change that needs more than the
 * headroom has to take the weight out somewhere else, or say in its commit why
 * the cold path is worth more now.
 *
 * Raw bytes are what the browser parses; gzip is what reaches a phone. Both are
 * checked, gzip at 40% of the raw budget unless a budget names its own.
 */

const root = process.cwd();
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");

const budgets = [
  // The runtime: the table, the rules and the index every case needs. It
  // loads after the intro has painted and the player has clicked, never before.
  // 3,200,014 bytes / 935,327 gzip on 2026-09-27, with all fifty-five cases in
  // it; 524,788 / 167,683 on 2026-09-29, when each case became a chunk of its
  // own (scripts/vite-season-data.mjs).
  // -> 452,171 / 144,949 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 452,171 / 144,945 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (454,682 / 146,568 on the same commit).
  // 452,171 / 144,949 -> 453,263 / 145,429 on 2026-10-23, rebased on main
  // 5adcbb5 with lucide-react 1.60 installed (npm ci): measured 453,263 /
  // 145,425, the gzip plus 4, raised by what it lacked. The 1,092 raw bytes
  // are main's own since 2026-10-21 (main's budget is 551,000 / 176,100);
  // the chunk this branch writes did not change.
  // 453,263 / 145,429 -> 196,669 / 71,953 on 2026-10-24, Vite 8 (#225) rebased
  // on main 3d43a239: the season's store (src/runtime/gameData.app.js with
  // virtual:season) is no longer in this chunk. Main has more chunks that
  // import it (the table's PlayScreen, the case file's CaseCast), and Rolldown
  // writes it as a file of its own, gameData.app below, where Rollup kept it
  // here. Measured 196,669 / 71,949 in the e2e build (two builds, the same),
  // the gzip plus 4; with gameData.app the two are 476,836 / 154,714, under
  // main's 551,000 / 176,100 for this one chunk.
  // 196,669 / 71,953 -> 146,793 / 53,492 on 2026-10-24, Vite 8 (#225) rebased
  // on main 048ffce5 (#233): the table's relic hook (useRelicTable, in
  // PlayScreen) now imports src/state/settleChoice.js, which the runtime uses
  // too, so Rolldown writes what the two share as two files of their own,
  // gameLogic and RelicDraft below, where Rollup kept them here. Measured
  // 146,793 / 53,488 in the e2e build, the gzip plus 4; with gameData.app,
  // gameLogic and RelicDraft the four are 479,421 / 157,854, under main's
  // 551,000 / 176,100 for this one chunk.
  // 146,793 / 53,492 -> 147,040 / 53,578 on 2026-10-24, rebased on main
  // 239e615e (#240, the case-open snapshot in the runtime): measured 147,040 /
  // 53,574 in the e2e build, the gzip plus 4.
  // 147,040 / 53,578 -> 152,655 / 55,616 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 152,655 / 55,612 in the e2e build, the gzip plus 4.
  // 152,655 / 55,616 -> 141,946 / 51,964 on 2026-10-24, E-12: the season
  // record, read-scene and past-pick modules (newGamePlusCarry, endingBook,
  // seasonRecord, seenScenes, pastPicks) are now also imported by the online
  // save's restore (src/state/cloudDeviceRecords.js), so Rolldown writes them
  // into the shared season-store chunk below. Measured 141,946 / 51,960 in the
  // e2e build, the gzip plus 4.
  // 141,946 / 51,964 -> 142,728 / 52,274 on 2026-10-25 (B-2 final-case copy,
  // the owner's answers all (1)): the 33rd floor's far callback to 사건 49
  // (farCallbacks.f_confront, three lines and a fallback). Measured 142,728 /
  // 52,270 in the e2e build on main ea5b74aa, the gzip plus 4.
  // 52,274 -> 52,279 gzip on 2026-10-25, 묶음 A-13 (long scene bodies, text
  // only) on main 024904a3: the shortened case files change the hashed names
  // the chunk imports. Measured 142,728 / 52,275 in the e2e build, the gzip plus 4.
  // 142,728 / 52,279 -> 142,806 / 52,313 on 2026-10-25, #224 (RULES_MARK 3)
  // rebased on main 81a48f50: measured 142,806 / 52,309 in the e2e build, the
  // gzip plus 4. The case's rules for the audit and the links, and the season
  // row's mean score.
  // 142,728 / 52,279 -> 148,723 / 54,704 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // -> 148,761 / 54,732 on 2026-10-26, funnel-locale (앱출시-F F-6): a case row's summary names the page's language (toRowSummary reads LANG). Measured 148,761 / 54,728 plus 4.
  // 148,761 / 54,732 -> 149,305 / 54,905 on 2026-10-26, 영어판 3단계 (en-step3-screens): the epilogues, the collapse's toll and the operator file read by key (src/copy/epilogue.js). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 149,722 / 54,994 -> 149,740 / 54,996 on 2026-10-29, lang-layout-check: the layout sweep's narrow mode (LAYOUT_SCENES=hand5) jumps scene to scene through window.__cpDebugJump, an effect in useRuntimeRenderers that a release folds away to an empty effect. Measured 149,736 / 54,992 in the e2e build on main 43078a46, the gzip plus 4.
  // 54,996 -> 55,002 gzip on 2026-10-29, picker-narrow: the shorter Japanese premise (src/locales/ja/screens/intro.js) renames the hashed locale chunk the runtime imports; no code changed. Measured 149,736 / 54,998 in the e2e build, the gzip plus 4.
  // 149,740 / 55,002 -> 149,905 / 55,019 on 2026-10-30, ranking-save-copy over main c39870a7 (#376, #375): the local and season ranking save lines read from src/copy/notices.js in the page's language (they were English in the hook). Measured 149,901 / 55,015 in the e2e build, the plus 4.
  // 149,905 / 55,019 -> 150,034 / 55,070 on 2026-11-02, bgm-variety over main c680ddd5 (#389): while the decision's reveal sheet is open the music key is
  // reveal:gain / reveal:even / reveal:cost (revealOutcome in GameRuntime). Measured 150,030 / 55,066 in the e2e build, the plus 4.
  // 149,722 / 54,994 -> 149,806 / 55,026 on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): the case's rules for the audit and the links, and the season row's mean score, on main's keyed words. Measured 149,806 / 55,022, the gzip plus 4 in the e2e build.
  // 149,905 / 55,019 -> 149,982 / 55,050 on 2026-10-30, #224 (RULES_MARK 3, C-2, personal bests) merged with main 430dda1e (#378 ranking-save-copy, #375, #376): #224's rules and season mean beside main's keyed ranking save lines. Measured 149,982 / 55,046 in the e2e build, the gzip plus 4.
  // -> 150,122 / 55,099 on 2026-11-02, #224 merged with main 9be94346 (#388 bgm-variety): #224's rules and season mean beside main's reveal music key. Measured 150,122 / 55,095 in the e2e build, the gzip plus 4.
  // 149,806 -> 149,819 raw on 2026-10-29, D2 hall of fame draft (#308) merged with #224 602ec69b: only the chunk names it imports; the gzip stays under its line. Measured 149,819 in the e2e build.
  // 149,982 -> 150,002 raw on 2026-10-30, D2 hall of fame draft (#308) merged with #224 bb70e777 (main 430dda1e): only the chunk names it imports; the gzip stays under its line. Measured 150,002 in the e2e build.
  // 142,806 / 52,313 -> 142,907 / 52,366 on 2026-10-25, C-1(1) (the 판 읽기
  // axis) on #224 253e8e93: measured 142,907 / 52,362 in the e2e build, the
  // gzip plus 4. The score breakdown's 판 읽기 row and the case summary's
  // readingScore.
  // 149,806 / 55,026 -> 149,965 / 55,098 on 2026-10-29, C-1(1) (the 판 읽기 axis) merged with #224 602ec69b: the score breakdown's 판 읽기 row read by key and the case summary's readingScore. Measured 149,965 / 55,094, the gzip plus 4 in the e2e build.
  // 149,982 / 55,050 -> 150,155 / 55,115 on 2026-10-30, C-1 reading axis (#307) merged with #224 bb70e777 (main 430dda1e): C-1's reading record over #224 and main's ranking save lines. Measured 150,155 / 55,111 in the e2e build, the gzip plus 4.
  // -> 142,837 / 52,328 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7:
  // measured 142,837 / 52,324, the gzip plus 4. The debug jump and a replay link lay a peak case's first board
  // (runState.js jumpToNode, layCasePeak).
  // 149,806 / 55,026 -> 149,831 / 55,039 on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): the debug jump's and replay link's peak board (layCasePeak) on #224's keyed words. Measured 149,831 / 55,035. Measured in the e2e build, the gzip plus 4.
  // 149,982 / 55,050 -> 150,018 / 55,057 on 2026-10-30, table rhythm bundle (#316) merged with #224 bb70e777 (main 430dda1e): the table's rhythm over #224 and main's ranking save lines. Measured 150,018 / 55,053 in the e2e build, the gzip plus 4.
  // 142,806 / 52,313 -> 142,951 / 52,390 on 2026-10-25, c3-c4-rules (C-3 and C-4, RULES_MARK 4) on #224 0c989ba7: measured
  // 142,951 / 52,386 in the e2e build, the gzip plus 4. The pre-C-3 streak
  // read on a save (the hold on a type set aside) and the run's direction.
  // 149,806 / 55,026 -> 149,961 / 55,078 on 2026-10-29, c3-c4-rules (C-3, C-4, RULES_MARK 4) merged with #224 602ec69b: the pre-C-3 hold set aside on a save and the run's direction, on #224's keyed words. Measured 149,961 / 55,074, the gzip plus 4 in the e2e build.
  // 149,982 / 55,050 -> 150,144 / 55,110 on 2026-10-30, C-3·C-4 rules (#320) merged with #224 bb70e777 (main 430dda1e): the direction table and verdicts over #224 and main's ranking save lines. Measured 150,144 / 55,106 in the e2e build, the gzip plus 4.
  // 150,144 / 55,110 -> 150,282 / 55,161 on 2026-11-02, #320 c3-c4-rules merged with #224 c29c2efd (main 9be94346). Measured 150,282 / 55,157 in the e2e build, the gzip plus 4.
  // 149,965 / 55,098 -> 150,166 / 55,179 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): the 판 읽기 row, the peak board's jump and the pre-C-3 hold in one chunk. Measured 150,166 / 55,175 in the e2e build, the gzip plus 4, the raw the measurement.
  // -> 150,349 / 55,212 on 2026-10-30, 통합 리허설 (#379): #224 bb70e777 (main 430dda1e) with #307, #316, #320 and #308 merged in. Measured 150,349 / 55,208 in the e2e build, the gzip plus 4.
  // 55,212 -> 55,217 gzip on 2026-10-30, 통합 리허설 (#379) over #224 0d29141a (the English bank rail at 360px) with #307 #316 #320 #308. Measured 55,213, the gzip plus 4.
  // 55,115 -> 55,120 gzip on 2026-11-02, C-1 reading axis (#307) merged with #224 8dd649ce (main b2558d55). Measured 55,116 in the e2e build, the gzip plus 4.
  // 150,155 / 55,120 -> 150,271 / 55,174 on 2026-11-02, #307 c1-reading-axis merged with #224 c29c2efd (main 9be94346). Measured 150,271 / 55,170 in the e2e build, the gzip plus 4.
  // 55,057 -> 55,062 gzip on 2026-11-02, table-rhythm-bundle (#316) merged with #224 8dd649ce (main b2558d55). Measured 55,058 in the e2e build, the gzip plus 4.
  // 150,122 / 55,099 -> 150,140 / 55,112 on 2026-11-02, #316 table-rhythm-bundle merged with #224 c29c2efd (main 9be94346). Measured 150,140 / 55,108 in the e2e build, the gzip plus 4.
  // 150,349 / 55,217 -> 150,459 / 55,259 on 2026-11-02, 통합 리허설 (#379) over #224 c29c2efd (main 9be94346) with #307 #316 #320 #308. Measured 150,459 / 55,255 in the e2e build, the gzip plus 4.
  // 150,034 / 55,070 -> 150,255 / 55,171 on 2026-11-02, plate-story over main 9be94346 (#392): scene plates place the sound beside its source (src/plateStory.js), mark the player figure, and draw the case ending on the result screen. Measured 150,251 / 55,167 in the e2e build, the plus 4.
  // 150,255 / 55,171 -> 146,589 / 54,099 on 2026-11-02, plate-story over main acf3d999 (#392): the runtime is smaller over #393 (locale-gaps moved words into late chunks). Measured 146,585 / 54,095 in the e2e build, the plus 4.
  // 146,589 / 54,099 -> 147,128 / 54,263 on 2026-11-03, snap-after-reading over main 425eb4da: a quick pick after a briefing read through is not a snap (gameLogic's readThrough), the page's seconds and clock ride on the decision (readingTally's takeBriefingRead, useChoiceCommit) and a save keeps both (savedState). Measured 147,124 / 54,259 in the e2e build over main 7fc3a1c4, the plus 4.
  // 54,263 -> 54,266 gzip on 2026-11-04, snap-after-reading over main 22f43342 (#435): no code changed (raw 147,124 as before); the chunk names it imports shifted with #435's case copy. Measured 54,262 gzip in the e2e build, the gzip plus 4.
  // 146,589 / 54,099 -> 147,608 / 54,517 on 2026-11-03, caption-split over main f4625ad1: the briefing's sentences are cut by one shared function that counts the quotes in pairs and ends Japanese sentences at their full stops (src/components/proseSentences.js, imported by proseMarks.js and speakerLine.js). Measured 147,604 / 54,513 in the e2e build, the plus 4.
  // 147,608 / 54,517 -> 147,532 / 54,533 on 2026-11-04, caption-split over main 7ddced5f: a plural possessive (the analysts' room) is not a quote, and the marks and the speaker line read the one pairedQuotes (src/components/proseSentences.js). Measured 147,528 / 54,529 in the e2e build, the plus 4.
  // -> 148,023 / 54,707 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 4e3f8e48 (#447): the lines above together. Measured 148,019 / 54,703 in the e2e build, the plus 4.
  // 148,023 / 54,707 -> 148,023 / 54,709 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 62a25238 (#448): the chunk names it imports. Measured 148,019 / 54,705 in the e2e build, the plus 4.
  // 148,023 / 54,709 -> 148,174 / 54,763 on 2026-11-05, result-card-habit over main 3ca15f8d: D1, the habit's one sentence worded on the result side (habitCardLine in src/judgementHabit.js, cardLine in src/copy/habits.js) and put on the fingerprint's habit (useRunReadout.js). Measured 148,170 / 54,759 in the e2e build, the plus 4.
  // -> 148,174 / 54,770 on 2026-11-05, bundle-1105d with intro-cards-cv (E5, D1, table-a11y, canon-trainee-locales, static-shell, intro-cards-cv) over main c569cb99: the chunk names it imports moved with the sheet's hash, the gzip alone. Measured 148,170 / 54,766 in the e2e build, the plus 4.
  // -> 148,174 / 54,775 on 2026-11-05, bundle-1105d after merging main e68fe8cc (#454 studio-name, #455 docs): the chunk names it imports, the gzip alone. Measured 148,170 / 54,771 in the e2e build, the plus 4.
  // 54,709 -> 54,707 gzip on 2026-11-05, prose-bundle-b (#412 #413 #414 #417 #418 #419) over main 8ac59b71 (#456): no code changed (raw 148,019 as before); the chunk names it imports shifted with the trimmed case copy. Measured 54,703 gzip in the e2e build, the gzip plus 4.
  // -> 148,174 / 54,771 on 2026-11-05, bundle-1105d after merging main 977809b3 (#457 본문 줄이기 b), the static shell reverted and the roadmap summary's flex: none: the chunk names it imports, the gzip alone. Measured 148,170 / 54,767 in the e2e build, the plus 4.
  // 150,122 / 55,099 -> 146,676 / 54,136 on 2026-11-03, #224 merged with main cb904fb6 (#392 #398): main's plate story (ScenePlate) out of the runtime beside #224's rules; down from #224's 150,122 / 55,099. Measured 146,676 / 54,132 in the e2e build, the gzip plus 4.
  // 148,023 / 54,709 -> 148,514 / 54,950 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 148,510 / 54,946 in the e2e build, the plus 4.
  // 54,709 -> 54,707 gzip on 2026-11-05, prose-bundle-b (#412 #413 #414 #417 #418 #419) over main 8ac59b71 (#456): no code changed (raw 148,019 as before); the chunk names it imports shifted with the trimmed case copy. Measured 54,703 gzip in the e2e build, the gzip plus 4.
  // 54,950 -> 54,956 gzip on 2026-11-05, rules-1105 after merging main 33899116 (#456 #457 #460 prose bundles a-c): no code changed (raw 148,510); the case chunks it imports were renamed by the trimmed copy. Measured 148,510 / 54,952 in the e2e build, the gzip plus 4.
  // 148,023 / 54,709 -> 148,418 / 54,917 on 2026-11-05, mood-wire over mood-tags 98d32622: the page's mood (src/mood.js: MOODS, applyMood on <html data-mood>, onMoodChange) and the hook that follows the shown scene (src/state/sceneMood.js, called from useResultReport). Measured 148,414 / 54,913 in the e2e build, the plus 4.
  // 148,023 / 54,709 -> 148,023 / 54,714 on 2026-11-05, mood-tokens over main c569cb99: the ground follows the scene's mood (tokens.css: neutral one step lighter, tense/dread/bright/sorrow as :root[data-mood] blocks, --ui-ease-out), the felt's 0.6s fade (play.css), the intro scrims on the neutral ground and the critical CSS cut again; this chunk only by the stylesheet's name it imports. Measured 148,019 / 54,710 in the e2e build, the plus 4.
  // 148,023 / 54,709 -> 148,050 / 54,709 on 2026-11-05, mood-music over main c569cb99: the scene's mood picks the lead and voices the table's drone (musicScore.js moodLeads/setMusicMood, AdaptiveMusic's note-by-note lead crossfade; the drone moved into gauntlet/tensionDrone.js with a voicing per mood). Measured 148,046 / 54,699 in the e2e build, the raw plus 4 (the gzip is under its budget).
  // 148,418 / 54,917 -> 148,134 / 54,765 on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 24af89d7): the lines above together, less src/mood.js, which the entry now holds (AdaptiveMusic subscribes to it, so Rolldown moved the hub out of this chunk). Measured 148,130 / 54,761 in the e2e build, the plus 4.
  // 54,709 -> 54,707 gzip on 2026-11-05, prose-bundle-b (#412 #413 #414 #417 #418 #419) over main 8ac59b71 (#456): no code changed (raw 148,019 as before); the chunk names it imports shifted with the trimmed case copy. Measured 54,703 gzip in the e2e build, the gzip plus 4.
  // 54,765 -> 54,772 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 977809b3): the raw bytes are the same 148,130; the chunk names it imports shifted with the trimmed case copy (#456, #457). Measured 148,130 / 54,768 in the e2e build, the gzip plus 4.
  // 54,772 -> 54,771 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 33899116): the raw bytes are the same 148,130; the chunk names it imports (#460). Measured 148,130 / 54,767 in the e2e build, the gzip plus 4.
  // -> 148,285 / 54,824 on 2026-11-05, bundle-1105d after merging main 4f2d39cb (#458 mood colour and music, #460 본문 c): #458's scene moods over the bundle's lines above. Measured 148,281 / 54,820 in the e2e build, the plus 4.
  // 148,514 / 54,956 -> 148,622 / 54,994 on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 bundle-mood: mood tokens, glow, AdaptiveMusic): the two bundles' lines together. Measured 148,618 / 54,990 in the e2e build, the plus 4.
  // 148,023 / 54,709 -> 148,261 / 54,796 on 2026-11-05, tab-title-situation over main 24af89d7: the browser tab's titles (src/copy/tabTitles.js, shared by the result hook and the table), state/tabTitle.js filling the page's own title into them (composeTabTitle) and taking a title the page wrote as the new base. Measured 148,257 / 54,792 in the e2e build, the plus 4.
  // -> 150,137 / 55,351 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 150,133 / 55,347 in the e2e build, the plus 4.
  // 148,622 / 54,994 -> 150,687 / 55,613 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 150,683 / 55,609 in the e2e build, the plus 4.
  // -> 148,773 / 55,052 on 2026-11-05, bundle-1105d after merging main 7e1fe0f0 (#461 rules bundle): #461's rules over the bundle's lines above. Measured 148,769 / 55,048 in the e2e build, the plus 4.
  // 150,687 / 55,613 -> 150,835 / 55,672 on 2026-11-06, bundle-1106a after merging main 6f58cbb8 (#459 bundle-1105d: E5, D1, table-a11y, canon, intro cards): the two sides' lines together. Measured 150,831 / 55,668 in the e2e build, the plus 4.
  // 146,589 / 54,099 -> 146,633 / 54,110 on 2026-11-05, kd-spend-engine over main 2bd9a8ba (C9 PR 1): the case-closing decision records its relic draft (useChoiceCommit) and the runtime carries seasonSpent with the run. Measured 146,629 / 54,106 in the e2e build, the plus 4.
  // 146,589 / 54,099 -> 146,798 / 54,192 on 2026-11-05, kd-spend-ui over main 2bd9a8ba (C9 PR 2, on PR 1 66bdce6a): spendAtDraft in GameRuntime (the reroll and one more paid from the KD은행 계좌), the case-closing decision records its relic draft (useChoiceCommit) and the run carries seasonSpent. Measured 146,794 / 54,188 in the e2e build, the plus 4.
  // 148,023 / 54,709 -> 148,041 / 54,715 on 2026-11-05, scout-narrow over main 8ac59b71: SCOUT costs 믿음 1 (B1, 11-05 decision (1)): the log entry carries `threshold.scouted`. Measured 148,037 / 54,711 in the e2e build, the plus 4.
  // 148,023 / 54,709 -> 148,057 / 54,715 on 2026-11-05, stake-clock over main e68fe8cc: the table's meters read the clock the stake leaves (tableMeters' getWindowSeconds) and the names it imports from the engine shifted. Measured 148,053 / 54,711 in the e2e build, the plus 4.
  // 148,622 / 54,994 -> 148,736 / 55,069 on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): the lines above together (C9's draft record and seasonSpent on the run, the stake clock's getWindowSeconds, the scout's price). Measured 148,732 / 55,065 in the e2e build, the plus 4.
  // -> 148,883 / 55,121 on 2026-11-06, bundle-rules2 after merging main 6f58cbb8 (#459 묶음 1105d: 글자 크기, 결과 카드 습관 줄, 11px·aria-live, 캐논, 인트로 카드): #459's lines under the rules2 lines above. Measured 148,879 / 55,117 in the e2e build, the plus 4.
  // 150,835 / 55,672 -> 150,964 / 55,742 on 2026-11-06, bundle-1106a after merging main e1f5e515 (#463 bundle-rules2: C9 spend, 11px, B1 scout, B5 stake clock): the two sides' lines together. Measured 150,960 / 55,738 in the e2e build, the plus 4.
  // 149,905 / 55,019 -> 152,903 / 56,161 on 2026-10-30, E-11 번외 사건 틀 (draft) over main 430dda1e (#373 #374 #375 #376 #378): the side run (state/sideRun.js) and what the side screen takes from this chunk (state/sideCaseKit.js); the pack check stays out (state/sidePackCheck.js). Measured 152,899 / 56,157 in the e2e build, the plus 4.
  // 150,034 / 55,070 -> 150,034 / 55,084 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 149,314 / 55,080 in the e2e build, the plus 4.
  // 146,589 / 54,099 -> 149,553 / 55,207 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 425eb4da (#392 #398 #395). Measured 149,549 / 55,203 in the e2e build, the plus 4.
  // 56,161 -> 56,167 gzip on 2026-10-30, E-11 번외 1 (draft): the side slot's line after the logic report on the finale (ResultScreen) renames the chunks it imports; the runtime's code did not change. Measured 152,899 / 56,163, the gzip plus 4.
  // 152,903 / 56,161 -> 153,069 / 56,216 on 2026-10-30, E-11 번외 사건 온라인 저장 (draft) over e11-side01 6f8723b0 (main 430dda1e): the side records' event when a side case closes (state/sideRun.js). Measured 153,065 / 56,212 in the e2e build, the plus 4.
  // 56,216 -> 56,222 gzip on 2026-11-02, E-11 번외 사건 온라인 저장 (draft) over e11-side01 9eb5fe2c (main 2f085d28): only by the chunk names it imports. Measured 153,065 / 56,218 in the e2e build, the gzip plus 4.
  // 150,034 / 55,084 -> 150,034 / 55,143 on 2026-11-03, E-11 번외 사건 온라인 저장 (draft) over e11-side01 9ce20c45 (main 465ccb93). Measured 149,512 / 55,139 in the e2e build, the plus 4.
  // 149,553 / 55,207 -> 149,751 / 55,268 on 2026-11-03, E-11 번외 사건 온라인 저장 (draft) over e11-side01 dca98f20 (main 425eb4da). Measured 149,747 / 55,264 in the e2e build, the plus 4.
  // 53,439 -> 53,445 gzip on 2026-10-26 (old base), E-11 번외 2 (draft) restacked on
  // e11-side-cloud bb76437e: the chunk names it imports. Measured 145,874 /
  // 53,441, the gzip plus 4.
  // 153,069 / 56,216 kept on 2026-10-30, E-11 번외 2 (draft) over e11-side-cloud c25a95cd (main 430dda1e): no change of its own; measured 153,065 / 56,209.
  // 153,069 / 56,222 kept on 2026-11-02, E-11 번외 2 (draft) over e11-side-cloud 4fb9ad57 (main 2f085d28): measured 153,065 / 56,208.
  // 149,751 / 55,268 -> 149,751 / 55,275 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 900d1946 (main 425eb4da). Measured 149,747 / 55,271 in the e2e build, the plus 4.
  // 150,964 / 55,742 -> 153,646 / 56,482 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: the side run and the kit the side screen takes (as above). Measured 153,642 / 56,478 in the e2e build, the plus 4.
  // 153,646 / 56,482 -> 153,652 / 56,478 on 2026-11-11, E-11 번외 1 (draft) over e11-side-cases c0d04767 and main 568572d3 (#484 #502 #503): the side run over main's vite 8.3.6 build. Measured 153,648 / 56,474 in the e2e build, the plus 4.
  // -> 153,686 / 56,482 on 2026-11-11, bundle 1111 (#350 #301 #501) over main 568572d3: the three together. Measured 153,682 / 56,476 in the e2e build, the plus 4 (gzip under).
  // 153,686 / 56,482 -> 153,871 / 56,560 on 2026-11-11, E-11 번외 온라인 저장 (#317) over #314 9b34ba69 (main 5c93b496). Measured 153867 / 56556 (over budget only) in the e2e build, the plus 4.
  // -> 153,705 / 56,489 on 2026-11-11, cold-opening-style (#477) after merging main 5c93b496 (#504): both. Measured 153,701 / 56,485 in the e2e build, the plus 4.
  // 153,705 / 56,489 -> 153,883 / 56,590 on 2026-11-11, E-11 번외 온라인 저장 (#317) after merging main c61d6618 (#314). Measured 153879 / 56586 (over budget only) in the e2e build, the plus 4.
  // 153,883 / 56,590 -> 153,883 / 56,597 on 2026-11-11, prose-trim-29-38 over main accd990b. Measured - / 56593 (over budget only) in the e2e build, the plus 4.
  // 153,883 / 56,597 -> 157,229 / 58,019 on 2026-11-12, c2c3-result over main fbf1000c (C2-1 nearest ending, C3-3 card line, C3-4 witness paragraph). Measured 157225 / 58015 (over budget only) in the e2e build, the plus 4.
  // 157,229 / 58,019 -> 157,412 / 58,135 c4c5-copy over main 7ec2304e. Measured 157408 / 58131 (over budget only) in the e2e build, the plus 4.
  // 157,229 / 58,019 -> 157,367 / 58,055 a2a3-ending over main 7ec2304e. Measured 157363 / 58051 (over budget only) in the e2e build, the plus 4.
  { pattern: /^GameRuntime-.*\.js$/, maxBytes: 157_367, maxGzip: 58_055 },
  // src/gameLogic.js and the code it brings, shared by the runtime's chunk and
  // the table's settlement (settleChoice.js, #233), split out by Rolldown on
  // 2026-10-24 (see GameRuntime above). It loads with whichever of the two
  // asks first, never before. Measured 32,897 / 13,018 in the e2e build, the
  // gzip plus 4.
  // 32,897 / 13,022 -> 33,937 / 13,368 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 33,937 / 13,364 in the e2e build, the gzip plus 4. src/seasonScore.js (C-2's season mean and Q25's season-wide change of view, getCognitionMix) lands in this chunk under Rolldown.
  // 32,897 / 13,022 -> 32,897 / 13,039 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 13,035 gzip in the e2e build, the gzip plus 4.
  // 32,897 / 13,039 -> 34,278 / 13,357 on 2026-10-26, 영어판 3단계: the observer's samples, arcs and records and the endings' lines read by key (src/copy/observer.js), a name's particle as a blank. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 34,278 / 13,357 -> 34,459 / 13,422 on 2026-10-29, gate-reason-copy: a locked card's condition (getAuthorityGate) read by key from src/copy/observer.js `gate` and filled, so English and Japanese print it in their words. The Korean is the same. Measured 34,455 / 13,418 in the e2e build, the plus 4.
  // 13,422 -> 13,432 gzip on 2026-11-02, bgm-variety over main c680ddd5 (#389): no code changed (raw 34,455 as main); the entry's
  // export names it imports shifted with the music's new exports. Measured 13,428 gzip in the e2e build, the gzip plus 4.
  // 34,278 / 13,357 -> 35,281 / 13,719 on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): src/seasonScore.js (C-2's season mean, Q25) lands in this chunk under Rolldown, beside main's observer words. Measured 35,281 / 13,715, the gzip plus 4 in the e2e build.
  // 34,459 / 13,422 -> 35,503 / 13,781 on 2026-10-30, #224 merged with main 430dda1e: src/seasonScore.js beside main's keyed gate condition (#373). Measured 35,503 / 13,777 in the e2e build, the gzip plus 4.
  // 13,781 -> 13,806 gzip on 2026-11-02, #224 merged with main 9be94346 (#388): the music's new export names beside src/seasonScore.js. Measured 13,802 in the e2e build, the gzip plus 4.
  // 13,719 -> 13,738 gzip on 2026-10-29, D2 hall of fame draft (#308) merged with #224 602ec69b: the same 35,281 bytes, other chunk names inside. Measured 13,734, the gzip plus 4.
  // 13,781 -> 13,807 gzip on 2026-10-30, D2 hall of fame draft (#308) merged with #224 bb70e777 (main 430dda1e): the same 35,503 bytes or under, other chunk names inside. Measured 13,803, the gzip plus 4.
  // 33,937 / 13,368 -> 34,272 / 13,482 on 2026-10-25, C-1(1) (the 판 읽기
  // axis) on #224 253e8e93: measured 34,272 / 13,478 in the e2e build, the
  // gzip plus 4. getCaseRead moved here from tableAfterword.js (the score reads
  // it now), getReadingScore, and the seventh weight. 13,480 in a second build
  // on #224 0c989ba7 (the hashes), so 13,484.
  // 35,281 / 13,719 -> 35,620 / 13,836 on 2026-10-29, C-1(1) (the 판 읽기 axis) merged with #224 602ec69b: getCaseRead, getReadingScore and the seventh weight on #224's season mean. Measured 35,620 / 13,832, the gzip plus 4 in the e2e build.
  // 35,503 / 13,781 -> 35,842 / 13,900 on 2026-10-30, C-1 reading axis (#307) merged with #224 bb70e777 (main 430dda1e): C-1's reading axis beside main's keyed gate condition. Measured 35,842 / 13,896 in the e2e build, the gzip plus 4.
  // 35,842 / 13,900 -> 35,842 / 13,924 on 2026-11-02, #307 c1-reading-axis merged with #224 c29c2efd (main 9be94346). Measured raw under / 13,920 in the e2e build, the gzip plus 4.
  // -> 35,788 / 13,890 on 2026-10-30, 통합 리허설 (#379) over #224 bb70e777 (main 430dda1e). Measured 35,788 / 13,886 in the e2e build, the gzip plus 4.
  // 34,459 / 13,432 -> 36,080 / 14,049 on 2026-11-02, locale-gaps (#393) over main 9be94346: the scene beat, the default echo and the speeches read src/copy/judgment.js by key (sceneBeat, defaultEcho), and the speakers' profiles take the page's language. Measured 36,076 / 14,045 in the e2e build, the plus 4.
  // 36,080 / 14,049 -> 36,274 / 14,117 on 2026-11-03, snap-after-reading over main 425eb4da: a quick pick after a briefing read through is not a snap (gameLogic's readThrough), the page's seconds and clock ride on the decision (readingTally's takeBriefingRead, useChoiceCommit) and a save keeps both (savedState); the observer's 순응 표본 holds the same line. Measured 36,270 / 14,113 in the e2e build over main 811df47a, the plus 4.
  // 14,117 -> 14,116 gzip on 2026-11-04, snap-after-reading over main 22f43342 (#435): no code changed (raw 36,270 as before). Measured 14,112 gzip in the e2e build, the gzip plus 4.
  // 14,116 -> 14,123 gzip on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 62a25238 (#448): no code changed here (raw 36,270); #416's readThrough beside #448's lines. Measured 36,270 / 14,119 in the e2e build, the plus 4.
  // 36,080 / 14,049 -> 37,120 / 14,457 on 2026-11-03, #224 merged with main 465ccb93 (#391 #389 #390 #393 #388): src/seasonScore.js (C-2, Q25) beside main's keyed judgment lines and the speakers' profiles. Measured 37,120 / 14,453 in the e2e build, the gzip plus 4.
  // 37,120 / 14,457 -> 37,459 / 14,574 on 2026-11-03, #307 c1-reading-axis merged with #224 c55d71e1 (main 465ccb93): the reading axis's seventh score card beside #224's src/seasonScore.js and main's keyed judgment lines. Measured 37,459 / 14,570 in the e2e build, the gzip plus 4.
  // 36,274 / 14,123 -> 37,608 / 14,625 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 37,604 / 14,621 in the e2e build, the plus 4.
  // 14,123 -> 14,146 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 24af89d7): no code changed here (raw 36,270); the entry's export names it imports shifted with the music's mood exports. Measured 36,270 / 14,142 in the e2e build, the gzip plus 4.
  // 37,608 / 14,625 -> 37,608 / 14,639 on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 bundle-mood: mood tokens, glow, AdaptiveMusic): the two bundles' lines together. (raw under budget; the entry's export names it imports). Measured 37,604 / 14,635 in the e2e build, the plus 4.
  // 36,274 / 14,123 -> 36,316 / 14,136 on 2026-11-05, ending-reform-order over main c569cb99 (#453): the finale's 개혁 answer reads EVIDENCE REFORM before OPEN OVERSIGHT in getEndingVariant (one gate read once more, improvement note C2). Measured 36,312 / 14,132 in the e2e build, the plus 4.
  // 14,123 -> 14,147 gzip on 2026-11-05, tab-title-situation over main 24af89d7: no code changed here (raw 36,270); the chunk names it imports. Measured 14,143 gzip in the e2e build, the gzip plus 4.
  // -> 36,374 / 14,187 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 36,370 / 14,183 in the e2e build, the plus 4.
  // 37,608 / 14,639 -> 37,703 / 14,682 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 37,699 / 14,678 in the e2e build, the plus 4.
  // 14,639 -> 14,646 gzip on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): the lines above together (VAULT_SLACK_PER_CASE exported for check:endings; the raw bytes stay under 37,608). Measured 14,642 gzip in the e2e build, the gzip plus 4.
  // 36,080 / 14,049 -> 36,080 / 14,066 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 36,076 / 14,062 in the e2e build, the plus 4.
  // 13,422 -> 13,436 gzip on 2026-10-30, E-11 번외 사건 온라인 저장 (draft) over e11-side01 6f8723b0 (main 430dda1e): only the chunk names it imports. Measured 34,455 / 13,432, the gzip plus 4.
  // 37,703 / 14,682 -> 37,703 / 14,690 on 2026-11-10, memory-line-i18n (draft) over main cb8346da: only the chunk names it imports. Measured 37,699 / 14,686 in the e2e build, the gzip plus 4.
  // 37,703 / 14,690 -> 38,027 / 14,776 on 2026-11-12, c2c3-result over main fbf1000c (C2-1 nearest ending, C3-3 card line, C3-4 witness paragraph). Measured 38023 / 14772 (over budget only) in the e2e build, the plus 4.
  // 38,027 / 14,776 -> 38,027 / 14,783 c4c5-copy over main 7ec2304e. Measured - / 14779 (over budget only) in the e2e build, the plus 4.
  { pattern: /^gameLogic-.*\.js$/, maxBytes: 38_027, maxGzip: 14_783 },
  // Rolldown names this shared file after src/gauntlet/RelicDraft.jsx: the
  // modules the table and the runtime both import since #233, split out on
  // 2026-10-24 like gameLogic above.
  // Measured 19,564 / 8,584 in the e2e build, the gzip plus 4.
  // 19,564 / 8,588 -> 19,701 / 8,632 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 19,701 / 8,628 in the e2e build, the gzip plus 4. the settlement hands the case's rules on (settleChoice.js's getSettlementRules once, rules back for the hand-off).
  // 19,564 / 8,588 -> 19,567 / 8,588 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 19,567 in the e2e build.
  // 19,567 / 8,588 -> 25,798 / 11,056 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 26,671 / 11,352 -> 26,800 / 11,373 on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): the settlement hands the case's rules on; the hand's link tag reads hand.link. Measured 26,800 / 11,369, the gzip plus 4 in the e2e build.
  // 11,373 -> 11,378 gzip on 2026-10-30, D2 hall of fame draft (#308) merged with #224 bb70e777 (main 430dda1e): only the chunk names it imports. Measured 11,374, the gzip plus 4.
  // 19,701 / 8,632 -> 20,366 / 8,927 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7:
  // measured 20,366 / 8,923 and 8,920 (two builds), the larger gzip plus 4. C-7's five tools'
  // copy and icons, 「숨 고르기」 on the pass button (relics.js is in this chunk).
  // 26,800 / 11,373 -> 27,600 / 11,676 on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): C-7's five tools and 「숨 고르기」 through relic() and copy/relics.js (this chunk), their icons' names. Measured 27,600 / 11,672. Measured in the e2e build, the gzip plus 4.
  // 19,701 / 8,632 -> 20,520 / 8,916 on 2026-10-25, c3-c4-rules (C-3 and C-4, RULES_MARK 4) on #224 0c989ba7: measured
  // 20,520 / 8,912 in the e2e build, the gzip plus 4. The ladder's three new
  // steps (사건 01 to 03, each with its line) and the direction's names.
  // 26,800 / 11,373 -> 27,810 / 11,699 on 2026-10-29, c3-c4-rules (C-3, C-4, RULES_MARK 4) merged with #224 602ec69b: the ladder's 사건 01 to 03 steps and their lines (copy/unlocks.js), the directions' names and the streak's sentences (copy/table.js readout). Measured 27,810 / 11,695, the gzip plus 4 in the e2e build.
  // 27,810 / 11,699 -> 27,811 / 11,706 on 2026-11-02, #320 c3-c4-rules merged with #224 c29c2efd (main 9be94346). Measured 27,811 / 11,702 in the e2e build, the gzip plus 4.
  // 27,810 / 11,699 -> 28,610 / 12,005 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): C-7's tools, the ladder's 사건 01 to 03 lines and the directions' sentences together. Measured 28,610 / 12,001 in the e2e build, the gzip plus 4, the raw the measurement.
  // -> 28,610 / 12,002 on 2026-10-30, 통합 리허설 (#379) over #224 bb70e777 (main 430dda1e). Measured 28,610 / 11,998 in the e2e build, the gzip plus 4.
  // 12,002 -> 12,007 gzip on 2026-11-02, 통합 리허설 (#379) over #224 afdcac0c (main 2f085d28) with #307 #316 #320 #308. Measured 12,003 in the e2e build, the gzip plus 4.
  // 26,671 / 11,352 -> 26,682 / 11,352 on 2026-11-02, locale-gaps (#393) over main 9be94346: the habits' and judgment's tables (src/copy/habits.js, judgment.js) the table and the runtime share. Measured 26,678 raw (gzip under 11,352) in the e2e build, the plus 4.
  // 26,682 / 11,352 -> 26,792 / 11,414 on 2026-11-02, money-feedback over main acf3d999: the purse's three lines in the table's words (stage.purse, purseChange, purseSeason). Measured 26,788 / 11,410, the plus 4.
  // 26,800 / 11,414 -> 26,921 / 11,442 on 2026-11-03, #224 merged with main 465ccb93 (#391 #389 #390 #393 #388): the settlement's case rules and the link tag beside main's purse lines and habits' tables. Measured 26,921 / 11,438 in the e2e build, the gzip plus 4.
  // 27,600 / 11,676 -> 27,721 / 11,740 on 2026-11-03, #316 table-rhythm-bundle merged with #224 c55d71e1 (main 465ccb93): the table rhythm's board lines beside #224's case rules and main's purse lines. Measured 27,721 / 11,736 in the e2e build, the gzip plus 4.
  // 27,811 / 11,706 -> 27,930 / 11,767 on 2026-11-03, #320 c3-c4-rules merged with #224 c55d71e1 (main 465ccb93): C-3/C-4's direction words beside #224's case rules and main's purse lines. Measured 27,930 / 11,763 in the e2e build, the gzip plus 4.
  // 26,682 / 11,352 -> 30,382 / 13,225 on 2026-11-02, plate-story over main acf3d999 (#392): scene plates place the sound beside its source (src/plateStory.js), mark the player figure, and draw the case ending on the result screen. Measured 30,378 / 13,221 in the e2e build, the plus 4.
  // 26,792 / 11,414 -> 30,492 / 13,281 on 2026-11-02, plate-story over main b5abd681 (#392, with #391): Measured 30,488 / 13,277 in the e2e build, the plus 4.
  // 30,492 / 13,281 -> 30,498 / 13,286 on 2026-11-03, plate-room-locale over main 16b6d349: a translated scene keeps its Korean place and clock for the plate (src/locales/overlay.js, src/scenePlate.js), and the sound tries 17 and 14 before it gives up (src/plateStory.js). Measured 30,494 / 13,282 in the e2e build, the plus 4.
  // 30,498 / 13,286 -> 30,526 / 13,304 on 2026-11-04, kd-bank-account over main 629de24c: the KD은행 계좌 -- the purse as a button with the season a tap away, and 방금 (stage.purseJust). Measured 30,522 / 13,300 in the e2e build, the plus 4.
  // 30,526 / 13,304 -> 30,567 / 13,309 on 2026-11-05, table-a11y-1105 over main 3ca15f8d: the voice's wall call (E3 첫 단계: tableVoice.js describeWall and the zone read back off the danger line, tableMeters.js dangerZoneOf; stage.voice.wall). Measured 30,563 / 13,305 in the e2e build, the plus 4.
  // -> 30,567 / 13,314 on 2026-11-05, bundle-1105d with intro-cards-cv (E5, D1, table-a11y, canon-trainee-locales, static-shell, intro-cards-cv) over main c569cb99: the chunk names it imports moved with the sheet's hash, the gzip alone. Measured 30,563 / 13,310 in the e2e build, the plus 4.
  // 30,498 / 13,286 -> 30,627 / 13,319 on 2026-11-03, #224 merged with main cb904fb6 (#392 #398): #224's case rules and link tag beside main's plate words. Measured 30,627 / 13,315 in the e2e build, the gzip plus 4.
  // 30,627 / 13,319 -> 31,427 / 13,614 on 2026-11-03, #316 table-rhythm-bundle merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 31,427 / 13,610 in the e2e build, the gzip plus 4.
  // 30,627 / 13,319 -> 31,636 / 13,649 on 2026-11-03, #320 c3-c4-rules merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 31,636 / 13,645 in the e2e build, the gzip plus 4.
  // 31,636 / 13,649 -> 32,437 / 13,941 on 2026-11-03, 통합 리허설 (#379) over #224 30f5519d (main bb492d5d) with #307 #316 #320 #308: the four branches' lines together. Measured 32,437 / 13,937 in the e2e build, the gzip plus 4.
  // 30,526 / 13,304 -> 32,469 / 13,960 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 32,465 / 13,956 in the e2e build, the plus 4.
  // 30,526 / 13,304 -> 30,589 / 13,340 on 2026-11-05, collapse-staging over main c569cb99: the bust's stop (A2) -- the slam's third line in three languages, the heart stopped on the frame (fxVariables, the pulse reads —) and the drone's slower let-down (gauntletAudio). Measured 30,585 / 13,336 in the e2e build, the plus 4.
  // 30,526 / 13,304 -> 30,537 / 13,287 on 2026-11-05, hold-confirm over main e68fe8cc (A4 (1), 2026-11-05): the table's words gain 길게 눌러야 확정 (say.holdHint, voice.holdHint) and lose the long hold help. Measured 30,533 / 13,283 in the e2e build, the plus 4.
  // -> 30,478 / 13,281 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 30,474 / 13,277 in the e2e build, the plus 4.
  // -> 32,510 / 13,970 on 2026-11-05, bundle-1105d after merging main 7e1fe0f0 (#461 rules bundle): #461's rules over the bundle's voice wall call. Measured 32,506 / 13,966 in the e2e build, the plus 4.
  // 30,498 / 13,286 -> 31,366 / 13,569 on 2026-11-05, kd-spend-ui over main 2bd9a8ba (C9 PR 2, on PR 1 66bdce6a): the two buttons under the cards (「다시 뽑기 · 4,000」 R, 「하나 더 · 12,000」 B, DraftBuy with aria-disabled and its reason), the one-line notice and the second pick's title (src/copy/relics.js). Measured 31,362 / 13,565 in the e2e build, the plus 4.
  // 31,366 / 13,569 -> 32,024 / 13,855 on 2026-11-05, kd-spend-ui trim over main 2bd9a8ba: the draft reads what its two buys say itself (readDraftSpend, src/gauntlet/draftSpend.js, in this shared chunk now rather than the runtime's, where GauntletStage read it), so the stage is under its import budget again. Measured 32,020 / 13,851 in the e2e build, the plus 4.
  // 32,024 / 13,855 -> 32,084 / 13,861 on 2026-11-05, kd-spend-ui hint over main 2bd9a8ba: the line under the draft's note (spendHint: one more only when a slot is open; user decision 11-05 (1)). Measured 32,080 / 13,857 in the e2e build, the plus 4.
  // 30,526 / 13,304 -> 30,600 / 13,337 on 2026-11-05, scout-narrow over main 8ac59b71: SCOUT costs 믿음 1 (B1, 11-05 decision (1)): the table words shared here (scoutLabel, voice.scout) name the 믿음, and the meters read `canPayScout`. Measured 30,596 / 13,333 in the e2e build, the plus 4.
  // 32,469 / 13,960 -> 34,182 / 14,582 on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): C9's two buys under the hand (DraftBuy, readDraftSpend) beside C-7's pass button, and the paid draft's plain pass line (skipPaid). Measured 34,178 / 14,578 in the e2e build, the plus 4.
  // -> 34,223 / 14,594 on 2026-11-06, bundle-rules2 after merging main 6f58cbb8 (#459 묶음 1105d: 글자 크기, 결과 카드 습관 줄, 11px·aria-live, 캐논, 인트로 카드): #459's lines under the rules2 lines above. Measured 34,219 / 14,590 in the e2e build, the plus 4.
  // 32,469 / 13,960 -> 34,178 / 14,560 on 2026-11-06, bundle-1106a after merging main e1f5e515 (#463 bundle-rules2: C9 spend, 11px, B1 scout, B5 stake clock): the two sides' lines together. Measured 34,174 / 14,556 in the e2e build, the plus 4.
  // 34,178 / 14,560 -> 34,238 / 14,593 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 49f50741 (#475): the table's voice (src/gauntlet/tableVoice.js) speaks the settle line, the act start and the case result's collapse-line verdict for screen readers. Measured 34,234 / 14,589 in the e2e build, the plus 4.
  // 34,238 / 14,593 -> 34,238 / 14,590 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main ade608e5 (#481 studio-we-1109): only the chunk names it imports. Measured 34,234 / 14,586 in the e2e build, the plus 4.
  // 34,238 / 14,590 -> 34,238 / 14,588 on 2026-11-09, bundle 1109b: #482 #483 #487 over main 937d5170: the three together; only the chunk names it imports moved. Measured 34,234 / 14,584 in the e2e build, the plus 4.
  // 34,238 / 14,588 -> 34,238 / 14,599 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: only the chunk names it imports. Measured 14,595 gzip in the e2e build, the plus 4.
  // 34,238 / 14,588 -> 34,243 / 14,589 on 2026-11-10, deps-1123: vite 8.3.6 / lucide-react 1.69 after merging main cb8346da (replaces Dependabot #479 and #480; vite 8.3.6 changes the build's bytes). Measured 34,239 / 14,585 in the e2e build, the plus 4.
  // -> 26,832 / 11,414 on 2026-10-29 (C-15 카드 정보 줄이기, draft for after W47, on main 11cb3b16; was 19,725 / 8,660 on c8841dc0): tableReadout's describeStakedDetail, the staked card's detail without the number its burn prints. Measured 26,832 / 11,410 in the e2e build, the gzip plus 4.
  // 26,792 / 11,414 -> 26,957 / 11,484 on 2026-11-03 (C-15 over main 465ccb93, describeStakedDetail over locale-gaps and money-feedback): measured 26,953 / 11,480 in the e2e build, the plus 4.
  // 30,498 / 13,286 -> 30,663 / 13,356 on 2026-11-03, C-15 over main 425eb4da (#392 #398 #395), the badge fold and describeStakedDetail. Measured 30,659 / 13,352 in the e2e build, the plus 4.
  // 34,238 / 14,588 -> 34,403 / 14,661 on 2026-11-10, C-15 over main 3a507805 and cb8346da: the badge fold and describeStakedDetail over the phone rules. Measured 34,399 / 14,657 in the e2e build, the plus 4.
  // 34,403 / 14,661 (C-15) and 34,243 / 14,589 (deps-1123) -> 34,408 / 14,662 on 2026-11-11, C-15 after merging main 568572d3 (#484 #502 #503): both. Measured 34,404 / 14,658 in the e2e build, the plus 4.
  // 14,589 -> 14,598 gzip on 2026-11-11, E-11 번외 1 (draft) over e11-side-cases c0d04767 and main 568572d3 (#484 #502 #503): only the chunk names it imports. Measured 34,235 / 14,594 in the e2e build, the gzip plus 4.
  // 34,238 / 14,588 -> 34,243 / 14,589 on 2026-11-10, deps-1123: vite 8.3.6 / lucide-react 1.69 after merging main cb8346da (replaces Dependabot #479 and #480; vite 8.3.6 changes the build's bytes). Measured 34,239 / 14,585 in the e2e build, the plus 4.
  // 34,238 / 14,588 -> 34,238 / 14,599 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: only the chunk names it imports. Measured 14,595 gzip in the e2e build, the plus 4.
  // -> 34,241 / 14,597 on 2026-11-11, bundle 1111 (#350 #301 #501) over main 568572d3. Measured 34,237 / 14,593 in the e2e build, the plus 4.
  // 34,241 / 14,597 -> 34,241 / 14,598 on 2026-11-11, bundle 1111 (#350 #301 #501) after merging main d4048d83 (#426 font-split). Measured 34,237 / 14,594, the plus 4.
  // -> 34,241 / 14,597 on 2026-11-11, bundle 1111 after build:fonts (냄, 짧) and the critical CSS regenerated. Measured 34,237 / 14,593 in the e2e build, the plus 4.
  // 34,241 / 14,597 -> 34,404 / 14,666 on 2026-11-11, C-15 after merging main c61d6618. Measured 34400 / 14662 (over budget only) in the e2e build, the plus 4.
  // 34,241 / 14,597 -> 34,363 / 14,631 on 2026-11-12, e3-status (지금 상황 듣기: tableVoice's status line, a keyed node per line) over main fbf1000c. Measured 34,359 / 14,627 in the e2e build, the plus 4.
  // 34,363 / 14,631 -> 34,528 / 14,703 bundle 1112c (#520 #521) over main 4f927085. Measured 34524 / 14699 (over budget only) in the e2e build, the plus 4.
  // 34,528 / 14,703 -> 34,528 / 14,709 c4c5-copy over main 7ec2304e. Measured - / 14705 (over budget only) in the e2e build, the plus 4.
  { pattern: /^RelicDraft-.*\.js$/, maxBytes: 34_528, maxGzip: 14_709 },
  // The season's store as the app build reads it (src/runtime/gameData.app.js
  // and virtual:season, scripts/vite-season-data.mjs), split out of the
  // runtime's chunk by Rolldown on 2026-10-24 (see GameRuntime above). It is
  // imported by the runtime's chunk, so it loads with it, never before.
  // Measured 280,167 / 82,765 in the e2e build, the gzip plus 4.
  // 280,167 / 82,769 -> 280,189 / 82,773 on 2026-10-24 (B-10): the evidence
  // turns of 사건 30 and 31 were rewritten and their memos ride in the store;
  // measured 280,189 / 82,769 on main cf641639, the gzip plus 4.
  // 280,189 / 82,773 -> 291,131 / 87,094 on 2026-10-24, E-12: the NEW GAME+
  // record modules the runtime and the online save's restore share joined it (see
  // GameRuntime above), and Rolldown now names the file after one of them,
  // src/state/pastPicks.js. Measured 291,131 / 87,090 on main b0eb9cb0 (#287),
  // the gzip plus 4; with GameRuntime the two are 433,077 / 139,053 beside
  // 432,844 / 138,381 before (+233 raw / +672 gzip: the same code, packed
  // into the larger file). Both load with the runtime, as before.
  // 87,094 -> 87,101 gzip on 2026-10-25 (A-13 1/4): the raw bytes are the
  // same 291,131, but eight case files' hashed names in its import list
  // changed with their scene text and gzip worse; measured 87,097 on main
  // 1afa305e, the gzip plus 4. Nothing of the store's own changed.
  // 291,131 / 87,101 -> 290,343 / 86,964 on 2026-10-26, 영어판 3단계: runtimeSystems.js's words (src/copy/seasonEnd.js) first landed here, which imports the runtimeSystems chunk back, and the table read at load was undefined in the production build (runtime smoke); grouped with runtimeSystems now, and this file measured smaller. Measured in the e2e build, the gzip plus 4.
  // 86,970 -> 86,975 gzip on 2026-11-02, table-rhythm-bundle (#316) merged with #224 afdcac0c (main 2f085d28). Measured 86,971 in the e2e build, the gzip plus 4.
  // 290,343 / 86,970 -> 294,110 / 87,736 on 2026-11-02, locale-gaps (#393) over main 9be94346: the season store's lines (NEW GAME+, second season, ending book, the share tail) read from src/copy/seasonLines.js. Measured 294,106 / 87,732 in the e2e build, the plus 4.
  // 294,110 / 87,736 -> 294,128 / 87,748 on 2026-11-03, canon-fixes-1 over main 36104abd: the canon fixes' Korean, English and Japanese lines (the role of 가온정밀's CEO, keyed by its Korean, names its address in both dictionaries; the 사건 29→30 interlude); the case files' hashed names in its import list changed with their scene text. Measured 294,124 / 87,744 in the e2e build, the plus 4.
  // 87,748 -> 87,755 gzip on 2026-11-03, canon-fixes-2 over canon-fixes-1 (#424): the raw bytes are the same; the case files' hashed names in its import list changed with their scene text. Measured 294,124 / 87,751 in the e2e build, the plus 4.
  // 294,128 / 87,755 -> 294,162 / 87,766 on 2026-11-04, canon-a044 over main 7ddced5f: A044, 사건 26's 32억 goes to 해온파트너스와 같은 주소의 새 법인 in Korean, English and Japanese, and 사건 29's premise says 그리고 지금 (the case files' hashed names in its import list). Measured 294,158 / 87,762 in the e2e build, the plus 4.
  // 294,110 / 87,736 -> 294,110 / 87,752 on 2026-11-03, #308 d2-hall-of-fame merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 87,748 gzip (raw under 294,110) in the e2e build, the gzip plus 4.
  // 294,110 / 87,752 -> 294,110 / 87,758 on 2026-11-03, 통합 리허설 (#379) over #224 30f5519d (main bb492d5d) with #307 #316 #320 #308: the four branches' lines together. Measured 87,754 gzip (raw under 294,110) in the e2e build, the gzip plus 4.
  // 87,766 -> 87,777 gzip on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 294,158 / 87,773 in the e2e build (raw under 294,162), the gzip plus 4.
  // 87,777 -> 87,785 gzip on 2026-11-05, rules-1105 after merging main 33899116 (#456 #457 #460 prose bundles a-c): the case files' hashed names in its import list. Measured 294,158 / 87,781 in the e2e build, the gzip plus 4.
  // 87,766 -> 87,777 gzip on 2026-11-05, mood-wire over mood-tags 98d32622: the raw bytes are smaller (294,158); the case files' hashed names in its import list changed with the moods written on their scenes. Measured 294,158 / 87,773 in the e2e build, the gzip plus 4.
  // 87,777 -> 87,786 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 24af89d7): the raw bytes are the same 294,158; the case files' hashed names in its import list. Measured 294,158 / 87,782 in the e2e build, the gzip plus 4.
  // 87,786 -> 87,781 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 33899116): the raw bytes are the same 294,158; the case files' hashed names in its import list (#460). Measured 294,158 / 87,777 in the e2e build, the gzip plus 4.
  // 87,766 -> 87,771 gzip on 2026-11-05, tab-title-situation over main 24af89d7: the raw bytes are the same (294,158); the chunk names in its import list. Measured 87,767 gzip in the e2e build, the gzip plus 4.
  // 294,110 / 87,736 -> 294,110 / 87,741 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 294,106 / 87,737 in the e2e build, the plus 4.
  // 294,110 / 87,741 -> 294,110 / 87,746 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud c2954023 (main 465ccb93). Measured 294,106 / 87,742 in the e2e build, the plus 4.
  { pattern: /^pastPicks-.*\.js$/, maxBytes: 294_162, maxGzip: 87_785 },
  // One case: its scenes, replies and voice lines. A first visit fetches the
  // season's first one before the table and the rest behind it. The largest,
  // case01, was 79,679 / 19,176 on 2026-09-29, and 94,175 / 24,159 on
  // 2026-10-06, when cases 01-07 and the finale were written at the length of
  // the rest of the season: its thirty scenes are the most of any case. It is
  // not the chunk a first visit waits for; that one is prologue01.
  // A side case (E-11, src/nodes/sideNN.js) is a case's chunk too and shares
  // this ceiling (E11-번외사건-설계안 5절): 번외 1 (side01, eleven scenes, no
  // replies or voice lines) measured 20,965 / 7,033 on 2026-10-25 and 2026-10-29; 번외 3
  // (side03, ten scenes) 19,204 / 6,582 on 2026-10-26 and 2026-10-29.
  // replies or voice lines) measured 20,965 / 7,033 on 2026-10-25 and 2026-10-29.
  // 25,400 -> 25,418 gzip on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): B-13(2)'s `attended` on each path's closing decision is laid into the packs at build (sceneBuild.js markClosingDecisions); case01, the largest, measured 98,685 / 25,414, the raw under its line. Measured in the e2e build, the gzip plus 4.
  // 98,900 / 25,400 -> 91,536 / 23,304 on 2026-11-03, prose-trim-1 (#394) over main 465ccb93: the scene text of prologue 01-05 and cases 01-03 cut by 28.8%. 사건 01 still the largest, measured 91,532 / 23,300 in the e2e build, the plus 4.
  // 91,536 / 23,304 -> 91,632 / 23,319 on 2026-11-05, rules-1105 after merging main 33899116 (#456 #457 #460 prose bundles a-c): B-13(2)'s `attended` on each path's closing decision (#316, the 25,400 -> 25,418 line above) over the trimmed copy of 사건 01. Measured 91,628 / 23,315 in the e2e build, the plus 4.
  // 25,400 -> 25,416 gzip on 2026-11-05, mood-wire over mood-tags 98d32622: each tagged scene carries its mood in its case's file (`"mood":"tense"`; scripts/season-split.mjs buildRuntimeData reads src/sceneMoods.js at build time, and that table never ships): 321 scenes, 4,877 raw / 1,370 gzip bytes over all 55 files, at most 227 / 54 on one; case01 98,634 / 25,412. Measured in the e2e build, the gzip plus 4.
  // 98,900 / 25,400 -> 91,536 / 23,304 on 2026-11-03, prose-trim-1 (#394) over main 465ccb93: the scene text of prologue 01-05 and cases 01-03 cut by 28.8%. 사건 01 still the largest, measured 91,532 / 23,300 in the e2e build, the plus 4.
  // 91,536 / 23,304 -> 91,581 / 23,318 on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 977809b3): main's trimmed case01 (91,532 / 23,300) plus the moods written on its scenes (the line above, mood-wire). Measured 91,577 / 23,314 in the e2e build, the plus 4.
  // 91,632 / 23,319 -> 91,677 / 23,336 on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 bundle-mood: mood tokens, glow, AdaptiveMusic): the two bundles' lines together. (the moods on 사건 01's scenes beside B-13(2)'s attended). Measured 91,673 / 23,332 in the e2e build, the plus 4.
  // 91,677 / 23,336 -> 91,893 / 23,370 on 2026-11-06, mood-boost over main 6f58cbb8: 95 early scenes tagged by review (prologues 01-05, cases 01-05), their `"mood"` written on each; case01 the largest. Measured 91,889 / 23,366 in the e2e build, the plus 4.
  // 91,893 / 23,370 unchanged on 2026-11-06, mood-tags-2 over main d7dadd92: 413 more scenes set by review (cases 06-49 and the finale; 692 of 1,129 tagged), each with its `"mood"` in its case's file; the largest of those, case45, 69,502 / 18,516, so case01 (91,889 / 23,366, untouched) still sets the line. Measured in the e2e build, the plus 4.
  { pattern: /^(prologue0[1-5]|case[0-9]{2}|side[0-9]{2}|final)-.*\.js$/, maxBytes: 91_893, maxGzip: 23_370 },
  // The shell: what the intro needs to boot, now including the intro screen
  // itself, which stopped being a lazy chunk the entry had to fetch before it
  // could paint. 161,674 / 57,486 on 2026-09-27.
  // 60,400 -> 61,300 gzip on 2026-10-07, measured 60,666: the shell's start
  // save tied to the run's fields, the roadmap card that resumes or asks, the
  // board and ranking states, and the worker's second warm-up.
  // 169,800 -> 169,930 bytes on 2026-10-20, measured 169,930 in the e2e build
  // CI checks, on main after #209 (main itself 167,625): 이번 주의 규칙's calendar, clock and
  // device key, the start screen's and the ranking's fetch of its views, and
  // the ranking's board switch, after the words went to chunks of their own
  // and the clock stopped writing a third copy of import.meta.env (158). Raw
  // sizes carry no hash noise.
  // 169,930 -> 169,935 the same evening, measured 169,935: the case summary that
  // ships with the shell says 사라진 열한 쪽 again, not 11쪽 (+5 bytes), so the
  // dissent's length does not read as a page number beside 14쪽 and 26쪽.
  // 169,935 -> 169,938 on 2026-10-21, measured 169,938: the origin's story
  // under DISSENT is titled 반대 의견서를 쓴 밤, the button's own word (+3).
  // 169,938 -> 169,980 on 2026-10-21 (B3 on main e8584c3, the e2e build CI checks): the
  // audit's chunk in the preload list (26), the debug overlay's auditCount (13)
  // and one more dependency index (3). Folding the dev switch's leftovers
  // (an alias, a `&&!0`) by hand came out 2 bytes longer, so it stays.
  // 61,300 -> 61,308 gzip on 2026-10-21 (F1 phase 2, #216, draft), measured
  // 61,304 plus 4: the replay trail's chunk (windowTrail) in the preload list.
  // 169,980 / 61,300 -> 170,343 / 61,512 on 2026-10-23 (reading-layout on
  // main c08be0e), measured 170,343 / 61,508 plus 4 in the e2e build: 이야기
  // 글 크기 (D-5), its row in the comfort panel and the setting with its
  // attribute and factor, which <html> carries from the first paint. Cut back
  // first: the seen-glosses key went to seenGlosses.js (the runtime's), 45
  // bytes. The row as a chunk of its own (fetched as the panel drew) saved the
  // shell 91 gzip bytes for a 519-byte file and a longer worker list, and was
  // put back; one component for both rows of radios came out 44 gzip bytes
  // longer than the two copies.
  // Batch B on 2026-10-23 (the day's text and screen branches merged on main
  // 5adcbb5b), measured in the e2e build, the gzip plus 4: the entries above
  // were each measured on its own branch's base.
  // 169,980 / 61,300 -> 170,257 / 61,530 on 2026-10-21, measured 170,257 /
  // 61,526 in the e2e build, the gzip plus 4: NEW GAME+ on the start screen
  // (the memory panel's season number and last ending, the continue card's
  // · N회차). Cut first: the panel's sentence is written into the season record
  // when the season is counted (newGamePlusCarry.getMemoryLine, the runtime's
  // chunk), so the entry reads a stored line and the season number
  // (appConfig.getSeasonRound) and carries neither the sentence's rules nor
  // the record's reader (state/seasonRecord.js); that took the addition from
  // 1,082 / 428 to the 663 / 244 over main's 169,594 / 61,282 left here.
  // -> 170,288 / 61,540 the same day, measured 170,288 / 61,536: the ranking
  // rows read the NEW GAME+ mark (src/ranking.js, which the shell's board
  // takes), +31 / +10.
  // -> 170,409 / 61,597 the same evening, measured 170,409 / 61,593: the
  // panel's last sentence on what a NEW GAME+ table is (문구 질문 17).
  // -> 170,436 / 61,616 on 2026-10-23, NEW GAME+ (#220) rebased on main
  // d486f4e (#216, above): measured 170,436 / 61,612 in the e2e build, the
  // gzip plus 4. The raw 27 over #220 alone is the windowTrail preload entry
  // #216's raw budget had room for.
  // 61,300 -> 61,377 gzip on 2026-10-21 (A5, draft), measured 61,373 plus 4
  // (main 0df240a measured 169,594 / 61,278): the comfort panel's switch for
  // the edge notices, its label and its line (+188 raw, inside the raw budget).
  // 169,980 / 61,300 -> 170,097 / 61,478 on 2026-10-22 (story-first10, #241,
  // draft), measured 170,097 / 61,474 in the e2e build, the gzip plus 4: the
  // resume card's 지난 이야기 (D-9; the view field folded into `savedStory`,
  // its code cut to two lines first) and the reading clock's asked-once flag
  // in the comfort settings (A-11). The question itself is a chunk of its own.
  // On main's 61,308 (#216) this came to 170,124 / 61,480 on 2026-10-23,
  // rebased on 2c7b535: 170,124 / 61,484.
  // 169,980 / 61,308 -> 170,453 / 61,560 for ops-measure (2026-10-23, on main
  // 2c7b535), measured 170,453 / 61,556 in the e2e build, the gzip plus 4:
  // E-8's first season (the season count read off the NEW GAME+ keys, the
  // second box's key and the choice both starts read) and one more chunk in
  // the preload lists (sceneChoices, E-6).
  // -> 171,964 / 62,152 on 2026-10-23, 10-23 묶음 A 합친 상태 실측 (#220 #226
  // #262 #241 #251 #256 on main 5adcbb5): measured 171,964 / 62,148 in the
  // e2e build, the gzip plus 4; the four additions above, together.
  // [batch-c] second-season (#261) on 묶음 A:
  // -> 170,445 / 61,624 (second-season, draft, rebased on that NEW GAME+):
  // the runtime now reads the season number (appConfig.getSeasonRound) for the
  // second season's lines and card, and the entry exports it under one more
  // name; the +9 / +8 it took over the old NEW GAME+, carried over.
  // -> 170,478 / 61,630 the same day: E-5, the season's row title handed to
  // seasonViewModels (`title`) instead of the fixed SEASON 01 COMPLETE, from
  // the runtime's secondSeason.rowTitle. Both measured together on 2026-10-23
  // in the e2e build: 170,478 / 61,626, the gzip plus 4.
  // -> 170,684 / 61,701 the same day (second-season, draft), measured
  // 170,684 / 61,697 plus 4: E-1, the comfort panel's switch 읽은 장면 접기
  // (AccessibilityPanel.jsx) and its setting (accessibilitySettings.js), both
  // the shell's. The switch's sentence was cut to one line first.
  // -> 170,684 / 61,709 the same day, measured 170,684 / 61,705 plus 4: the
  // second season's lines as the user settled them (문구 질문 1~20, all (1)),
  // the same bytes in other words; the shared tail names the season before's
  // ending through getEndingPreview, which the result side already imported.
  // -> 172,181 / 62,223 on 2026-10-23, 10-23 묶음 C 합친 상태 실측 (#261 on 묶음 A):
  // measured 172,181 / 62,219 in the e2e build, the gzip plus 4.
  // [batch-c] 묶음 B (#277):
  // Batch B merged on batch A (2026-10-23), measured in the e2e build, the
  // gzip plus 4: the entries above were each measured on its own base.
  // 62,405 -> 62,411 gzip on 2026-10-23: batch B with batch A's notice fix
  // (d2e31d0a) merged in measured 62,407, the gzip plus 4.
  // -> 173,001 / 62,486 on 2026-10-23, 묶음 C (A + B + #261 + #272) 합친 상태 실측: measured
  // 173,001 / 62,482 in the e2e build (the larger of two builds), the gzip plus 4.
  // +398 / +229 on 2026-10-22 (F1 phase 3, S3, draft): the case row's dynamics
  // check and fit (payloadSchemas.js) and the opening snapshot stamped on a new game.
  // -> 173,724 / 62,701 on 2026-10-24 (#240 f1-s7 on f1-stage3 efba1927, main
  // 5ea63bf under it): measured 173,724 / 62,697 in the e2e build, the gzip plus 4.
  // E-3 결말 도감 on the memory panel (e3-endings), a fold whose head
  // (「결말 3/9 · 판결 2/3.」 and the next season's ending) and hints the
  // runtime writes into the season record (state/endingBook.js), so the entry
  // carries none of the copy, only the panel's <details> and
  // getPastRunMemory's `book`. Cut first: a count line, a next line and a fold
  // head of their own came to +348 / +128. Measured on batch-c with the
  // user's wording (10-23, all (1)) 173,179 / 62,555, on main 5ea63bf (#282)
  // 173,179 / 62,558.
  // -> 173,927 / 62,785 on 2026-10-24, e3-endings moved onto main 90247c0
  // (#240 + #283): measured 173,927 / 62,781 in the e2e build, the gzip plus 4.
  // 173,927 / 62,785 -> 172,057 / 62,112 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 172,057 / 62,108 in the e2e build, the gzip plus 4.
  // 172,057 / 62,112 -> 172,146 / 62,154 on 2026-10-24, E-12: the two device
  // keys the online save now carries (SEEN_SCENES_KEY, PAST_PICKS_KEY) are
  // spelled in appConfig.js, where cloudSave.js reads them without the scene
  // graph. Measured 172,146 / 62,150 in the e2e build, the gzip plus 4.
  // -> 172,244 / 62,205 on 2026-10-25, the tab token claim's longer wait
  // (TAB_TOKEN_CLAIM_MS 300, one more wait when the timer fired late, capped
  // at TAB_TOKEN_CLAIM_MAX_MS). Measured 172,244 / 62,201 in the CI e2e build,
  // the gzip plus 4.
  // -> 172,282 / 62,234 on 2026-10-25, 묶음 시대고증(#313): the intro's story
  // paragraph (KD's owner, Kingsdale) and the era words. Measured 172,282 /
  // 62,226 in CI and 62,230 here, the larger gzip plus 4.
  // 172,282 / 62,234 -> 172,403 / 62,270 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 172,403 / 62,266 gzip in the e2e build, the gzip plus 4.
  // 172,403 / 62,270 -> 173,126 / 62,668 on 2026-10-25, deletion-contact: the deletion-request sentence in the data notice with the support address as a mailto link (SUPPORT_CONTACT, getDeletionRequestText in appConfig.js). Measured 173,126 / 62,664 gzip in the e2e build on main 2998216 (#325), the gzip plus 4.
  // 173,126 / 62,668 -> 173,478 / 62,829 the same day, 개인정보처리방침·이용약관
  // on main 39176493 (#326): the intro's foot and the data drawer's note link
  // the two pages (privacyText.js holds the paths and the consent sentence,
  // moved, not added). Measured 173,478 / 62,825 in the e2e build, the gzip
  // plus 4.
  // 173,478 / 62,829 -> 175,169 / 63,528 on 2026-10-26, pwa-install-hint: the
  // install offer's listener and store (state/installPrompt.js, set in
  // main.jsx because `beforeinstallprompt` can arrive before the intro
  // renders), the slot in the comfort drawer (InstallHintSlot.jsx) and its
  // five lines in appCopy.js. The hint itself is InstallHint below. Measured
  // 175,169 / 63,524 in the e2e build, the gzip plus 4.
  // 175,169 / 63,528 -> 180,627 / 65,391 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // -> 180,652 raw on 2026-10-26, funnel-locale: 「화면 언어」 in the consent sentence (PLAYTEST_DATA_NOTICE) and the chunk names. Measured 180,652 / 65,373; the gzip budget holds.
  // 180,652 / 65,391 -> 180,744 / 65,403 on 2026-10-26, 일본어 1단계 (ja-step1): the hidden Japanese entry in SUPPORTED_LOCALES and the language choice showing a hidden language on its own pages only. Every other Korean chunk and the CSS are byte for byte main's (57931801). Measured 180,744 / 65,399 in the e2e build, the gzip plus 4.
  // 180,652 / 65,391 -> 181,779 / 65,912 on 2026-10-26, 영어판 3단계: the board's hook (src/copy/boardPost.js), the ranking's rows and status card and the pressures' names (leaderboard.js), online save's status lines (cloudSaveStatus.js, in cloudSave's chunk), and the intro's table naming the data notice, the deletion request and the three memories. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // -> 181,871 / 65,954 on 2026-10-26, 영어판 3단계 and 일본어 1단계 together (merged main f827c198): measured 181,871 / 65,950, the gzip plus 4.
  // 66,015 -> 66,033 gzip on 2026-10-29, save-unavailable-lite: the start screen's storage line in the page's language (src/shellNotices.js, one line laid over by the dictionary's notices, not the runtime's 6.8KB table). Measured 66,029 gzip in the e2e build over main d0c44b13 (#373), the gzip plus 4.
  // 182,001 / 66,033 -> 182,038 / 66,116 on 2026-10-29, adsense-readiness: the start screen's foot links five pages (SITE_PAGES, privacyText.js) and names three more in the intro's table (게임 소개 · 자주 묻는 질문 · 문의). Measured 182,034 / 66,112 in the e2e build over main 3e350266 (#374), the plus 4.
  // 66,116 -> 66,124 gzip on 2026-10-30, picker-narrow over main c3b40b6f (#376): no code changed; the hashed chunk names the entry imports
  // changed with the shorter Japanese premise and the pills' CSS. Measured 182,034 / 66,120 in the e2e build, the gzip plus 4.
  // 182,038 / 66,124 -> 188,124 / 67,821 on 2026-11-02, bgm-variety over main c680ddd5 (#389): four leads per music mode, the three reveal
  // tracks, the stake layers' pooled voices and src/components/musicScore.js (AdaptiveMusic plays from the start screen, so it sits in the
  // entry). Measured 188,120 / 67,817 in the e2e build, the plus 4.
  // 181,926 / 65,978 -> 182,095 / 66,082 on 2026-10-29, D2 hall of fame draft (#308) merged with #224 602ec69b: fetchHallOfFame in telemetry.js and the data notice's hall-of-fame sentence (introCopy.data.hallOfFameNotice). Measured 182,095 / 66,078 in the e2e build, the gzip plus 4.
  // 182,038 / 66,124 -> 182,212 / 66,213 on 2026-10-30, D2 hall of fame draft (#308) merged with #224 bb70e777 (main 430dda1e): fetchHallOfFame and the data notice's hall-of-fame sentence beside main's foot links, storage line and ranking save lines. Measured 182,212 / 66,209 in the e2e build, the gzip plus 4.
  // 66,213 -> 66,218 gzip on 2026-10-30, D2 hall of fame draft (#308) merged with #224 0d29141a (the English bank rail at 360px): only the chunk names it imports. Measured 66,214, the gzip plus 4.
  // 188,124 / 67,821 -> 188,300 / 67,918 on 2026-11-02, #308 d2-hall-of-fame merged with #224 c29c2efd (main 9be94346). Measured 188,300 / 67,914 in the e2e build, the gzip plus 4.
  // 65,978 -> 65,982 gzip on 2026-10-29, c3-c4-rules (C-3, C-4, RULES_MARK 4) merged with #224 602ec69b: only the chunk names it imports. Measured 65,979, the gzip plus 4 (raw under its line).
  // 182,095 / 66,082 -> 182,219 / 66,139 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): fetchHallOfFame and the notice's sentence over the other three's keyed reads. Measured 182,219 / 66,135 in the e2e build, the gzip plus 4, the raw the measurement.
  // -> 182,341 / 66,283 on 2026-10-30, 통합 리허설 (#379) over #224 bb70e777 (main 430dda1e). Measured 182,341 / 66,279 in the e2e build, the gzip plus 4.
  // -> 182,341 / 66,282 on 2026-10-30, 통합 리허설 (#379) over #224 0d29141a (the English bank rail at 360px) with #307 #316 #320 #308. Measured 182,341 / 66,278 in the e2e build, the gzip plus 4.
  // 188,300 / 67,918 -> 188,426 / 67,989 on 2026-11-02, 통합 리허설 (#379) over #224 c29c2efd (main 9be94346) with #307 #316 #320 #308. Measured 188,426 / 67,985 in the e2e build, the gzip plus 4.
  // 188,124 / 67,821 -> 189,363 / 68,363 on 2026-11-02, locale-gaps (#393) over main 9be94346: the entry's panels, titles, tab title, storage banner and music button read src/copy/introPanels.js and src/copy/music.js, and the default name is shown in the page's language. Measured 189,359 / 68,359 in the e2e build, the plus 4.
  // 189,363 / 68,363 -> 189,363 / 68,388 on 2026-11-03, #320 c3-c4-rules merged with #224 c55d71e1 (main 465ccb93): only the chunk names it imports and C-4's entry words beside main's keyed intro. Measured 68,384 gzip (raw under 189,363) in the e2e build, the gzip plus 4.
  // 68,363 -> 68,368 gzip on 2026-11-03, locale-review-1103 over main 16b6d349 (#392): no code changed (raw under 189,363); the habit name, the purse word and the 首席 title rename the hashed locale chunks the entry imports. Measured 68,364 gzip in the CI e2e build, the plus 4.
  // 189,363 / 68,368 -> 189,392 / 68,379 on 2026-11-03, week-board-after over main 36104abd: the ranking's boards fetch the week's chunk in the week after a rule week too (weekHasNews with -7 days, W47 점검 P9). Measured 189,388 / 68,375 in the e2e build, the plus 4.
  // 189,392 / 68,379 -> 189,436 / 68,408 on 2026-11-03, ranking-recheck-wider over main 36104abd (보안 점검 M2): the ranking asks for `rechecked` and a remote row not checked yet reads as pendingCheck (src/telemetry.js, src/ranking.js). Measured 189,432 / 68,404 in the e2e build, the plus 4; 68,408 gzip over main 811df47a (#411), so 68,412.
  // 68,379 -> 68,386 gzip on 2026-11-04, a11y-1103 over main 557d17bb: no entry code changed (raw under 189,392); the ranking chunk's name it imports changed. Measured 189,388 / 68,382 in the e2e build, the plus 4.
  // 68,386 -> 68,376 gzip on 2026-11-04, a11y-1103 over main 22f43342. Measured 189,388 / 68,372 in the e2e build, the plus 4.
  // 189,392 / 68,379 -> 189,456 / 68,430 on 2026-11-03, flaky-fix-1103 over main 4be2c339: the tab token's claim takes a "held" that comes
  // after its wait until a table has read the token (appConfig.takeTabToken). Measured 189,452 / 68,426 in the e2e build, the plus 4.
  // 189,456 / 68,430 -> 189,456 / 68,420 on 2026-11-04, flaky-fix-1103 over main 557d17bb. Measured 189,452 / 68,416 in the e2e build, the plus 4.
  // 189,456 / 68,420 -> 189,456 / 68,428 on 2026-11-04, flaky-fix-1103 over main 22f43342. Measured 189,452 / 68,424 in the e2e build, the plus 4.
  // 68,379 -> 68,384 gzip on 2026-11-04, kd-bank-account over main 629de24c: the account's name in the table's words. Measured 68,380 gzip in the e2e build (raw under 189,392), the plus 4.
  // 68,384 -> 68,378 gzip on 2026-11-04, kd-bank-account after merging main 9676ea92 (#424): measured 68,374 locally and in Linux CI, the plus 4.
  // 68,378 -> 68,382 gzip the same day: Linux CI measured 68,378 on 986edea7 (4 more than locally), the plus 4.
  // -> 189,456 / 68,429 on 2026-11-04, bundle-1105a (#440, #439, #442, #416 over main 2bd9a8ba): the lines above together. Measured 189,452 / 68,425 in the e2e build, the plus 4.
  // 189,392 / 68,379 -> 189,888 / 68,598 on 2026-11-04, seo-locale-start over main 22f43342: src/locale.js reads the start page's folder (/en/, /ja/) as a language, a choice made there moves to the chosen language's folder, and a page opened by ?lang= points its canonical at the folder. Measured 189,884 / 68,594 in the e2e build, the plus 4.
  // 189,392 / 68,379 -> 189,572 / 68,438 on 2026-11-03, perf-first-visit over main 8e930107: the intro fetches the runtime on idle only once the page has loaded (AppContent). Measured 189,568 / 68,434 in the e2e build, the plus 4.
  // 189,392 / 68,379 -> 189,407 / 68,395 on 2026-11-04, en-ko-leak over main 557d17bb: simplifyPlayerText reads the page's language (src/locale.js) and hands a page in another language back its own text. Measured 189,403 / 68,391 in the e2e build, the plus 4.
  // 189,407 / 68,395 -> 189,415 / 68,397 on 2026-11-04, en-ko-leak over main 22f43342: the intro reads its title reading from its copy, and the phase chip prints the phase as written. Measured 189,411 / 68,393, the plus 4.
  // 189,392 / 68,379 -> 190,097 / 68,670 on 2026-11-04, bundle-1104a over main 2bd9a8ba: the four lines above together (#433 #436 #445, with #429 #438). Measured 190,093 / 68,666 in the e2e build, the plus 4.
  // -> 190,158 / 68,698 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 4e3f8e48 (#447): the lines above together. Measured 190,154 / 68,694 in the e2e build, the plus 4.
  // 189,392 / 68,379 -> 189,737 / 68,502 on 2026-11-04, credits-alice over main 5d5d6ae4: the start screen's credit names SUPASONIC & ALICE and links both addresses (src/credits.js, StudioCredit.jsx). Measured 189,733 / 68,498 in the e2e build, the plus 4.
  // 68,502 -> 68,508 gzip on 2026-11-04, credits-alice over main 9676ea92 (canon-fixes-1): the entry names the renamed locale chunks. Measured 189,733 / 68,504 in the e2e build, the plus 4.
  // 190,097 / 68,670 -> 190,442 / 68,790 on 2026-11-04, bundle-1105b over main 4e3f8e48 (#447): the credit line above (#443) on bundle-1104a's entry. Measured 190,438 / 68,786 in the e2e build, the plus 4.
  // -> 190,506 / 68,833 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 62a25238 (#448): the lines above together. Measured 190,502 / 68,829 in the e2e build, the plus 4.
  // 190,506 / 68,833 -> 190,673 / 68,870 on 2026-11-04, tab-title-locale over main dc26d880: the tab's title in English and Japanese (pageTitle in the intro copy, put on the tab by src/locale.js through overlay.js pageTitle()). Measured 190,669 / 68,866 in the e2e build (setPageTitle exported for its unit test), the plus 4.
  // 189,392 / 68,379 -> 190,149 / 68,585 on 2026-11-04, board-auto-hide over main 2bd9a8ba: the board's two blocked-word refusals (src/copy/boardPost.js), the server's two new messages read back, and the hook's check that loads the list on 글 남기기 (src/state/useBoard.js; the list itself is its own chunk, boardBlockedTerms). Measured 190,145 / 68,581 in the e2e build, the plus 4.
  // 190,506 / 68,833 -> 191,263 / 69,016 on 2026-11-05, board-auto-hide over main 3d4183e5 (#449, #441): the board's two blocked-word refusals and the on-demand check above on main's entry. Measured 191,259 / 69,012 in the e2e build, the plus 4.
  // -> 191,476 / 69,094 on 2026-11-05, bundle-1105c (#450, #432, #425, #434) over main 3d4183e5 (#449, #441): the lines above together. Measured 191,472 / 69,090 in the e2e build, the plus 4.
  // 191,476 / 69,094 -> 192,346 / 69,281 on 2026-11-05, text-size-setting over main 3ca15f8d: 글자 크기 (E5, three steps), its row in the comfort panel and the setting with its attribute and factor, which <html> carries from the first paint. Measured 192,342 / 69,277 in the e2e build, the plus 4.
  // 191,476 / 69,094 -> 191,476 / 69,100 on 2026-11-05, result-card-habit over main 3ca15f8d: the chunk names it imports (D1 changed no entry code). Measured 191,472 / 69,096 in the e2e build, the gzip plus 4.
  // 191,476 / 69,094 -> 191,476 / 69,099 on 2026-11-05, table-a11y-1105 over main 3ca15f8d: the gzip alone moved with the stylesheet's hash (money.css, the account's 방금 at 11px). Measured 191,472 raw / 69,095 gzip in the e2e build, the plus 4.
  // -> 192,346 / 69,287 on 2026-11-05, bundle-1105d (E5, D1, table-a11y, canon-trainee-locales, static-shell) over main c569cb99: the lines above together. Measured 192,342 / 69,283 in the e2e build, the plus 4.
  // -> 192,346 / 69,292 on 2026-11-05, bundle-1105d with intro-cards-cv (E5, D1, table-a11y, canon-trainee-locales, static-shell, intro-cards-cv) over main c569cb99: the lines above together. Measured 192,342 / 69,288 in the e2e build, the plus 4.
  // 191,476 / 69,094 -> 191,573 / 69,173 on 2026-11-05, studio-name over main c569cb99: the studio's three names (STUDIO_NAMES, studioName) in the entry. Measured 191,569 / 69,169 in the e2e build, the plus 4.
  // -> 192,443 / 69,373 on 2026-11-05, bundle-1105d after merging main e68fe8cc (#454 studio-name, #455 docs): the studio's three names over the bundle's 글자 크기 setting, the lines above together. Measured 192,439 / 69,369 in the e2e build, the plus 4.
  // 189,363 / 68,368 -> 189,536 / 68,469 on 2026-11-03, #308 d2-hall-of-fame merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 189,536 / 68,465 in the e2e build, the gzip plus 4.
  // 189,536 / 68,469 -> 189,660 / 68,545 on 2026-11-03, 통합 리허설 (#379) over #224 30f5519d (main bb492d5d) with #307 #316 #320 #308: the four branches' lines together. Measured 189,660 / 68,541 in the e2e build, the gzip plus 4.
  // 191,573 / 69,173 -> 191,875 / 69,331 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 191,871 / 69,327 in the e2e build, the plus 4.
  // 69,094 -> 69,106 gzip on 2026-11-05, mood-wire over mood-tags 98d32622: the raw bytes are the same 191,472; the hashed names of the chunks it imports (GameRuntime, the case files) changed. Measured 191,472 / 69,102 in the e2e build, the gzip plus 4.
  // 191,476 / 69,094 -> 191,476 / 69,104 on 2026-11-05, mood-tokens over main c569cb99: the ground follows the scene's mood (tokens.css: neutral one step lighter, tense/dread/bright/sorrow as :root[data-mood] blocks, --ui-ease-out), the felt's 0.6s fade (play.css), the intro scrims on the neutral ground and the critical CSS cut again; the entry only by the stylesheet's name it imports. Measured 191,472 / 69,100 in the e2e build, the plus 4.
  // 191,476 / 69,094 -> 192,759 / 69,664 on 2026-11-05, mood-music over main c569cb99: the scene's mood picks the lead and voices the table's drone (musicScore.js moodLeads/setMusicMood, AdaptiveMusic's note-by-note lead crossfade; the drone moved into gauntlet/tensionDrone.js with a voicing per mood). Measured 192,755 / 69,660 in the e2e build, the plus 4.
  // -> 193,412 / 69,958 on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 24af89d7): the lines above together, plus src/mood.js (the hub, 5 lines of code) and the subscription that carries the page's mood to the score. Measured 193,408 / 69,954 in the e2e build, the plus 4.
  // 191,573 / 69,173 -> 191,573 / 69,178 on 2026-11-05, prose-bundle-a (#394 #399 #400 #401 #403 #405) over main 24af89d7: the trimmed case copy; the case files' hashed names in the entry's import list changed with their scene text. Measured 191,569 / 69,174 in the e2e build, the plus 4.
  // -> 192,443 / 69,369 on 2026-11-05, bundle-1105d after merging main 8ac59b71 (#456 본문 줄이기 a): the lines above together, the gzip alone moved with the chunk names. Measured 192,439 / 69,365 in the e2e build, the plus 4.
  // 191,573 / 69,178 -> 191,573 / 69,174 on 2026-11-05, prose-bundle-b (#412 #413 #414 #417 #418 #419) over main 8ac59b71 (#456): the trimmed case copy of cases 25-39 and 46-48; the case files' hashed names in the entry's import list changed with their scene text. Measured 191,569 / 69,170 in the e2e build, the plus 4.
  // -> 192,443 / 69,367 on 2026-11-05, bundle-1105d after merging main 977809b3 (#457 본문 줄이기 b), the static shell reverted and the roadmap summary's flex: none: the lines above together, the gzip alone moved with the chunk names. Measured 192,439 / 69,363 in the e2e build, the plus 4.
  // 69,958 -> 69,965 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 977809b3): the raw bytes are the same 193,408; the case files' hashed names in the entry's import list shifted with the trimmed case copy (#456, #457). Measured 193,408 / 69,961 in the e2e build, the gzip plus 4.
  // 191,573 / 69,174 -> 191,573 / 69,176 on 2026-11-05, prose-bundle-c (#420 #422 #423 #427 #428) over main 977809b3 (#457): the trimmed case copy of cases 19-24, 40-45 and 49; the case files' hashed names in the entry's import list changed with their scene text. Measured 191,569 / 69,172 in the e2e build, the plus 4.
  // 69,331 -> 69,335 gzip on 2026-11-05, rules-1105 after merging main 33899116 (#456 #457 #460 prose bundles a-c): no entry code changed (raw 191,871); the case files' hashed names in its import list. Measured 191,871 / 69,331 in the e2e build, the gzip plus 4.
  // 69,965 -> 69,957 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 33899116): the raw bytes are the same 193,408; the case files' hashed names in the entry's import list (#460). Measured 193,408 / 69,953 in the e2e build, the gzip plus 4.
  // -> 194,282 / 70,155 on 2026-11-05, bundle-1105d after merging main 4f2d39cb (#458 mood colour and music, #460 본문 c): #458's mood and music in the entry over the bundle's 글자 크기 setting and the rest above. Measured 194,278 / 70,151 in the e2e build, the plus 4.
  // 191,875 / 69,335 -> 193,717 / 70,143 on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 bundle-mood: mood tokens, glow, AdaptiveMusic): the two bundles' lines together. Measured 193,713 / 70,139 in the e2e build, the plus 4.
  // 191,476 / 69,094 -> 191,476 / 69,099 on 2026-11-05, collapse-staging over main c569cb99: the bust's stop (A2) -- the slam's third line in three languages, the heart stopped on the frame (fxVariables, the pulse reads —) and the drone's slower let-down (gauntletAudio). Measured 191,472 / 69,095 in the e2e build, the gzip plus 4 (the raw size under its budget).
  // 69,094 -> 69,100 gzip on 2026-11-05, ending-reform-order over main c569cb99 (#453): no code changed here (raw 191,472 as main); the entry names the renamed gameLogic chunk. Measured 69,096 gzip in the e2e build, the gzip plus 4.
  // 191,573 / 69,173 -> 191,949 / 69,273 on 2026-11-05, rank-title over main 24af89d7 (C1 기록 칭호): the fifth record title and its finished-season step (analystTitle.js), the line under the name (IntroScreen, intro.setup.rankTitle). Measured 191,945 / 69,269 in the e2e build, the plus 4.
  // -> 191,915 / 69,251 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 191,911 / 69,247 in the e2e build, the plus 4.
  // 193,717 / 70,143 -> 194,059 / 70,208 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 194,055 / 70,204 in the e2e build, the plus 4.
  // -> 194,587 / 70,288 on 2026-11-05, bundle-1105d after merging main 7e1fe0f0 (#461 rules bundle): #461's rules in the entry over the bundle's 글자 크기 setting and the rest above. Measured 194,583 / 70,284 in the e2e build, the plus 4.
  // 194,059 / 70,208 -> 194,929 / 70,355 on 2026-11-06, bundle-1106a after merging main 6f58cbb8 (#459 bundle-1105d: E5, D1, table-a11y, canon, intro cards): the two sides' lines together. Measured 194,925 / 70,351 in the e2e build, the plus 4.
  // 191,573 / 69,173 -> 191,595 / 69,187 on 2026-11-05, stake-clock over main e68fe8cc: the stake's three layers moved out of the score into their own leaf (src/gauntlet/stakeLayers.js), which the entry now carries for the score and the engine's clock. Measured 191,591 / 69,183 in the e2e build, the plus 4.
  // 193,717 / 70,143 -> 193,739 / 70,149 on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): the lines above together (the stake clock's tier in the entry's shared rules, the chunk names it imports). Measured 193,735 / 70,145 in the e2e build, the plus 4.
  // -> 194,609 / 70,303 on 2026-11-06, bundle-rules2 after merging main 6f58cbb8 (#459 묶음 1105d: 글자 크기, 결과 카드 습관 줄, 11px·aria-live, 캐논, 인트로 카드): #459's lines under the rules2 lines above. Measured 194,605 / 70,299 in the e2e build, the plus 4.
  // 194,929 / 70,355 -> 194,945 / 70,375 on 2026-11-06, bundle-1106a after merging main e1f5e515 (#463 bundle-rules2: C9 spend, 11px, B1 scout, B5 stake clock): the two sides' lines together. Measured 194,941 / 70,371 in the e2e build, the plus 4.
  // 194,945 / 70,375 -> 195,802 / 70,670 on 2026-11-06, mood-boost over main bb7781c7 (#464 bundle-1106a): the mood's texture in the entry's AdaptiveMusic (musicScore.js MOOD_TEXTURES, blendedTexture, moodLeadNote). Measured 195,798 / 70,666 in the e2e build, the plus 4.
  // 195,802 / 70,670 -> 195,825 / 70,677 on 2026-11-06, cold-opening over main d7dadd92 (#465 mood-boost): B-3(1) with its switch off, the page's state hook in IntroScreen (the branch, the page and its chunk are folded away by __CP_COLD_OPENING__). Measured 195,821 / 70,673 in the e2e build, the plus 4.
  // 195,825 / 70,677 -> 195,825 / 70,673 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 49f50741 (#475): only the chunk names the entry imports. Measured 195,821 / 70,669 in the e2e build, the plus 4.
  // 195,825 / 70,673 -> 195,799 / 70,663 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main ade608e5 (#481 studio-we-1109): #481's credit lines (src/credits.js) in the entry. Measured 195,795 / 70,659 in the e2e build, the plus 4.
  // 195,799 / 70,663 -> 195,799 / 70,661 on 2026-11-09, bundle 1109b: #482 #483 #487 over main 937d5170: the three together; only the chunk names it imports moved. Measured 195,795 / 70,657 in the e2e build, the plus 4.
  // 195,799 / 70,661 -> 195,799 / 70,667 on 2026-11-09, phone-heavy-bank over main c1d08daa (#488): no script changed; only the CSS file's name the entry carries. Measured 195,795 / 70,663 in the e2e build, the plus 4.
  // 195,799 / 70,667 -> 196,509 / 70,856 on 2026-11-10, music-tier-crackle over main e7ccb410: the bus's aligned dry path, the two tiers' bass past the drive and the music lab's before/after switch (musicScore.js CRACKLE_FIX_BEFORE). Measured 196,505 / 70,852 in the e2e build, the plus 4.
  // 196,509 / 70,856 -> 196,509 / 70,858 on 2026-11-10, music-tier-crackle after merging main 261accef (#496 #497): only the chunk names the entry imports. Measured 196,505 / 70,854 in the e2e build, the plus 4.
  // 196,509 / 70,858 -> 196,509 / 70,859 on 2026-11-10, phone-846-staked after merging main b77e4bfe (#498): only the asset names the entry imports (the index CSS changed). Measured 196,505 / 70,855 in the e2e build, the plus 4.
  // 196,509 / 70,859 -> 196,509 / 70,854 on 2026-11-10, phone-846-staked after merging main 3a507805 (#499): only the asset names the entry imports. Measured 196,505 / 70,850 in the e2e build, the plus 4.
  // 196,509 / 70,854 -> 196,509 / 70,862 on 2026-11-10, phone-390-staked over main cb8346da (#500): only the asset names the entry imports (the index CSS changed). Measured 196,505 / 70,858 in the e2e build, the plus 4.
  // 196,509 / 70,854 -> 196,589 / 70,885 on 2026-11-10, deps-1123: vite 8.3.6 / lucide-react 1.69 after merging main cb8346da (replaces Dependabot #479 and #480; vite 8.3.6 changes the build's bytes, lucide-react 1.69 draws TriangleAlert as TriangleExclamationPoint, the name the screens now import). Measured 196,585 / 70,881 in the e2e build, the plus 4.
  // 196,509 / 70,854 -> 197,127 / 71,083 on 2026-11-10, cold-opening-style (#477) over main cb8346da: B-3(1) switched on (COLD_OPENING_ENABLED = true), so the entry keeps IntroScreen's branch and the page's dynamic import that the off switch folded away. Measured 197,123 / 71,079 in the e2e build, the plus 4.
  // 196,589 / 70,885 (deps-1123) and 197,127 / 71,083 (cold-opening-style) -> 197,207 / 71,134 on 2026-11-10, cold-opening-style after merging main 312aa15c (#484 deps-1123): both. Measured 197,203 / 71,130 in the e2e build, the plus 4.
  // 196,509 / 70,862 (phone-390-staked) and 196,589 / 70,885 (deps-1123) -> 196,589 / 70,889 on 2026-11-10, phone-390-staked after merging main 312aa15c (#484): both. Measured 196,585 / 70,885 in the e2e build, the plus 4.
  // 196,589 / 70,889 -> 196,589 / 70,885 on 2026-11-11, phone-390-staked-all over main d4048d83 (#426): only the asset names the entry imports (the index CSS changed). Measured 196,585 / 70,881 in the e2e build, the plus 4.
  // 66,033 -> 66,046 gzip on 2026-10-29 (C-15 카드 정보 줄이기, draft for after W47, over main 6a36dcc9): this chunk's code is main's; what differs is the chunk and CSS names it imports (the CSS and RelicDraft changed, so their hashes did). Measured 181,951 / 66,042 in the e2e build, the gzip plus 4.
  // 66,124 holds on 2026-10-30 (C-15 over main c39870a7, #376 #375): measured 182,034 / 66,112 in the e2e build, under main's budget.
  // 196,589 / 70,889 holds on 2026-11-11, C-15 after merging main 568572d3 (#484 #502 #503): measured 196,585 / 70,881 in the e2e build, under main's budget.
  // 197,207 / 71,134 (cold-opening-style) and 196,589 / 70,889 (#503 phone-390-staked) -> 197,207 / 71,132 on 2026-11-11, cold-opening-style after merging main 568572d3 (#502 #503): both. Measured 197,203 / 71,128 in the e2e build, the plus 4.
  // 197,207 / 71,132 -> 197,207 / 71,136 on 2026-11-11, cold-opening-style after merging main d4048d83 (#426 font-split): only the asset names the entry imports (the font and index CSS changed). Measured 197,203 / 71,132 in the e2e build, the plus 4.
  // 182,038 / 66,124 -> 184,337 / 67,050 on 2026-10-30, E-11 번외 사건 틀 (draft) over main 430dda1e (#373 #374 #375 #376 #378): the start screen's side slot, hidden until a finale is closed and a side case is written (src/sideCases.js, the slot and its open/close in IntroScreen, its words in src/copy/intro.js), and the side-id guards of the local ranking and the window log. Measured 184,333 / 67,046 in the e2e build, the plus 4.
  // 189,363 / 68,363 -> 191,660 / 69,343 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 191,656 / 69,339 in the e2e build, the plus 4.
  // 189,363 / 68,368 -> 191,660 / 69,346 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 425eb4da (#392 #398 #395). Measured 191,656 / 69,342 in the e2e build, the plus 4.
  // 184,337 / 67,050 -> 184,581 / 67,170 on 2026-10-30, E-11 번외 1 (draft) over e11-side-cases da40ea69 (main 430dda1e): the release list's one entry for side01 (src/nodes/sidePacks.js) and `localizeSidePack` (src/locale.js), which lays a page's language over a side pack as it arrives. Measured 184,577 / 67,166, the plus 4.
  // 191,660 / 69,343 -> 191,907 / 69,449 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases 49bce887 (main 465ccb93). Measured 191,903 / 69,445 in the e2e build, the plus 4.
  // 191,660 / 69,346 -> 191,907 / 69,443 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases b40aa7d1 (main 425eb4da). Measured 191,903 / 69,439 in the e2e build, the plus 4.
  // 184,581 / 67,170 -> 184,636 / 67,165 on 2026-10-30, E-11 번외 사건 온라인 저장 (draft) over e11-side01 6f8723b0 (main 430dda1e): the side keys spelled in appConfig.js for the online save and the event's name; the marks and their merge stay out (state/sideMarks.js). Measured 184,632 / 67,161, the plus 4.
  // 191,907 / 69,449 -> 191,958 / 69,455 on 2026-11-03, E-11 번외 사건 온라인 저장 (draft) over e11-side01 9ce20c45 (main 465ccb93). Measured 191,954 / 69,451 in the e2e build, the plus 4.
  // 191,907 / 69,443 -> 191,958 / 69,449 on 2026-11-03, E-11 번외 사건 온라인 저장 (draft) over e11-side01 dca98f20 (main 425eb4da). Measured 191,954 / 69,445 in the e2e build, the plus 4.
  // 177,509 / 64,365 -> 177,678 / 64,418 on 2026-10-26 (old base), E-11 번외 2 (draft)
  // restacked on e11-side-cloud bb76437e: the release list's entry for side02.
  // Measured 177,678 / 64,414, the gzip plus 4.
  // 184,636 / 67,165 -> 184,809 / 67,216 on 2026-10-30, E-11 번외 2 (draft) over e11-side-cloud c25a95cd (main 430dda1e): the release list's entry for side02 (src/nodes/sidePacks.js) and its chunk loader. Measured 184,805 / 67,212, the plus 4.
  // 191,958 / 69,455 -> 192,131 / 69,503 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud c2954023 (main 465ccb93). Measured 192,127 / 69,499 in the e2e build, the plus 4.
  // 191,958 / 69,449 -> 192,131 / 69,500 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud dbab06b9 (main 425eb4da). Measured 192,127 / 69,496 in the e2e build, the plus 4.
  // 184,809 / 67,216 -> 184,982 / 67,275 on 2026-10-30, E-11 번외 3 (draft) over e11-side02 7ac9cb8e (main 430dda1e): the release list's entry for side03 (src/nodes/sidePacks.js) and its chunk loader. Measured 184,978 / 67,271, the plus 4.
  // 67,275 -> 67,281 gzip on 2026-11-02, E-11 번외 3 (draft) over e11-side02 5ec44e4e (main 2f085d28): its own code is the same; the merged base moves the gzip. Measured 184,978 / 67,277, the gzip plus 4.
  // 192,131 / 69,503 -> 192,304 / 69,561 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 57313263 (main 465ccb93). Measured 192,300 / 69,557 in the e2e build, the plus 4.
  // 192,131 / 69,500 -> 192,304 / 69,564 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 900d1946 (main 425eb4da). Measured 192,300 / 69,560 in the e2e build, the plus 4.
  // 196,509 / 70,858 -> 198,795 / 71,936 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: the start screen's side slot and the side-id guards (as above). Measured 198,791 / 71,932 in the e2e build, the plus 4.
  // 198,795 / 71,936 -> 198,795 / 71,928 on 2026-11-10, E-11 번외 사건 틀 (draft) over main cb8346da (#500): only the asset names the entry imports. Measured 198,791 / 71,924 in the e2e build, the plus 4.
  // 196,509 / 70,854 -> 196,509 / 70,862 on 2026-11-10, phone-390-staked over main cb8346da (#500): only the asset names the entry imports (the index CSS changed). Measured 196,505 / 70,858 in the e2e build, the plus 4.
  // 196,509 / 70,854 -> 196,589 / 70,885 on 2026-11-10, deps-1123: vite 8.3.6 / lucide-react 1.69 after merging main cb8346da (replaces Dependabot #479 and #480; vite 8.3.6 changes the build's bytes, lucide-react 1.69 draws TriangleAlert as TriangleExclamationPoint, the name the screens now import). Measured 196,585 / 70,881 in the e2e build, the plus 4.
  // 196,509 / 70,862 (phone-390-staked) and 196,589 / 70,885 (deps-1123) -> 196,589 / 70,889 on 2026-11-10, phone-390-staked after merging main 312aa15c (#484): both. Measured 196,585 / 70,885 in the e2e build, the plus 4.
  // 196,589 / 70,889 -> 199,119 / 72,103 on 2026-11-11, E-11 번외 1 (draft) over e11-side-cases c0d04767 and main 568572d3 (#484 #502 #503): the side slot and side-id guards (번외 사건 틀) and side01's entry in the release list over main's vite 8.3.6 entry. Measured 199,115 / 72,099 in the e2e build, the plus 4.
  // 196,509 / 70,854 -> 197,272 / 71,169 on 2026-11-10, memory-line-i18n (draft) over main cb8346da: the NEW GAME+ panel draws the last season's line from the record's ending and verdict in the page's language (getMemoryLine and its three lines moved from the runtime's seasonLines to introPanels), and the shell has a 결말 도감 stored in another language written again once the runtime is in (isStaleBook, #496 질문 1). Measured 197,268 / 71,165 in the e2e build, plus 4.
  // -> 199,649 / 72,275 on 2026-11-11, bundle 1111 (#350 #301 #501) over main 568572d3: the three together: the side slot (#301), the stale-book refresh (#501), the ad switch (#350). Measured 199,645 / 72,271 in the e2e build, the plus 4.
  // -> 199,649 / 72,266 on 2026-11-11, bundle 1111 after build:fonts (냄, 짧) and the critical CSS regenerated. Measured 199,645 / 72,262 in the e2e build, the plus 4.
  // 199,649 / 72,266 -> 199,893 / 72,424 on 2026-11-11, E-11 번외 1 (#314) over main 5c93b496 (#504). Measured 199889 / 72420 (over budget only) in the e2e build, the plus 4.
  // 199,893 / 72,424 -> 199,943 / 72,433 on 2026-11-11, E-11 번외 온라인 저장 (#317) over #314 9b34ba69 (main 5c93b496). Measured 199939 / 72429 (over budget only) in the e2e build, the plus 4.
  // 199,943 / 72,433 -> 200,113 / 72,500 on 2026-11-11, E-11 번외 2 (#321) over #317 f657d6ad (main 5c93b496). Measured 200109 / 72496 (over budget only) in the e2e build, the plus 4.
  // 200,113 / 72,500 -> 200,286 / 72,585 on 2026-11-11, E-11 번외 3 (#333) over #321 (main 5c93b496). Measured 200282 / 72581 (over budget only) in the e2e build, the plus 4.
  // -> 200,275 / 72,598 on 2026-11-11, cold-opening-style (#477) after merging main 5c93b496 (#504): both. Measured 200,271 / 72,594 in the e2e build, the plus 4.
  // 200,275 / 72,598 -> 200,519 / 72,704 on 2026-11-11, E-11 번외 1 (#314) after merging main 808834eb (#477). Measured 200515 / 72700 (over budget only) in the e2e build, the plus 4.
  // 200,519 / 72,704 -> 200,519 / 72,712 on 2026-11-11, prose-trim-19-28 over main c61d6618. Measured - / 72708 (over budget only) in the e2e build, the plus 4.
  // 200,519 / 72,704 -> 200,579 / 72,727 on 2026-11-11, E-11 번외 온라인 저장 (#317) after merging main c61d6618 (#314). Measured 200575 / 72723 (over budget only) in the e2e build, the plus 4.
  // 200,579 / 72,727 -> 200,735 / 72,779 on 2026-11-11, E-11 번외 2 (#321) after merging main d53a6ab2 (#317). Measured 200731 / 72775 (over budget only) in the e2e build, the plus 4.
  // 200,735 / 72,779 -> 200,908 / 72,844 on 2026-11-11, E-11 번외 3 (#333) after merging main accd990b (#321). Measured 200904 / 72840 (over budget only) in the e2e build, the plus 4.
  // 200,735 / 72,779 -> 200,735 / 72,784 on 2026-11-11, prose-trim-29-38 over main accd990b. Measured - / 72780 (over budget only) in the e2e build, the plus 4.
  // 200,735 / 72,784 -> 200,908 / 72,845 on 2026-11-11, bundle 1111b (#505 #506 #507 #508) over main 72d10e69. Measured 200904 / 72841 (over budget only) in the e2e build, the plus 4.
  // 200,908 / 72,845 -> 201,033 / 72,895 c4c5-copy over main 7ec2304e. Measured 201029 / 72891 (over budget only) in the e2e build, the plus 4.
  { pattern: /^index-.*\.js$/, maxBytes: 201_033, maxGzip: 72_895 },
  // The 홈 화면에 추가 hint (components/InstallHint.jsx), fetched only on a
  // browser that offers an install. Measured 559 / 319 on 2026-10-26, the
  // gzip plus 4.
  // 559 / 323 -> 564 / 323 on 2026-11-11, E-11 번외 온라인 저장 (#317) after merging main c61d6618 (#314). Measured 560 / - (over budget only) in the e2e build, the plus 4.
  { pattern: /^InstallHint-.*\.js$/, maxBytes: 564, maxGzip: 323 },
  // The table and its plate painters. 97,490 / 30,995 on 2026-09-27.
  // 102,400 / 32,600 -> 104,200 / 34,300 on 2026-09-28, with the table's
  // fixes from the audit. What it bought is the table being playable and
  // honest for more people: one gate for a card's click and its key, a bust
  // written before its slam is painted, Space and Enter left to the control
  // the keyboard walked to, presses graded where the pointer went down and
  // when the beat reached the ear, names a screen reader and a phone can read
  // for what only a tooltip said, and frame-loop variables that no longer
  // restyle the whole table. Measured 103,738 / 34,105. It is not on the first
  // paint: the chunk loads after the player has started a run.
  // 34,300 -> 34,373 gzip on 2026-10-20, measured 34,369 on main after #209
  // (34,363-34,369 on the day's three mains) plus the 4 bytes of hash noise: 이번 주의 규칙's briefing
  // panel. The panel and the catalogue lookup went to a chunk of their own
  // (WeekRulePanel, below); what stays is the two imports, the weeklyRules
  // import the bundler hoists, and the line that asks whether the page opens
  // a case. Main measured 34,274 that day, after #198, #205 and #209.
  // 34,300 -> 34,332 gzip on 2026-10-20, measured 34,328 plus the 4 bytes of
  // hash noise: 이번 주의 규칙's briefing panel. It took the chunk to 34,395;
  // the panel and the catalogue lookup went to a chunk of their own
  // (WeekRulePanel, below), which left the two imports and the line that asks
  // whether the page opens a case, 28 bytes over.
  // 34,332 -> 34,572 gzip on 2026-10-20, measured 34,568 plus the 4 bytes of
  // hash noise: B3's audit on the table (the run signal's 감사 n/N token, the
  // 확정 button's description, the voice's once-a-window line). It took the
  // chunk to 34,880; the audit's count, its judgement, its reading and its
  // words went to a chunk of their own (auditRisk, below), which left the
  // stage's token and description, the voice's hook and the import, 236
  // bytes over. The raw budget does not move (103,924).
  // 34,373 -> 34,615 on 2026-10-21, B3 rebased on main's 34,373 (#199):
  // measured 34,611 in the e2e build plus the 4 bytes of hash noise, the same
  // 240 bytes the audit took on the day-ten base.
  // 34,373 -> 34,591 gzip on 2026-10-21 (B2, #208, draft), measured 34,587
  // plus 4 on main 732ef05 (main 34,369): the run signal's 연결 n token, the
  // card's " · 연결" mark, the voice's once-a-board line and the closing
  // commit's call that hands the links on. The walk, the reading, the words
  // and the carrying are in cascadeRisk (below); #208 measured the same
  // +207 on 2026-10-20 with the links switched off. The raw budget does not move.
  // 104,200 / 34,615 -> 104,705 / 34,805 on 2026-10-21, the test week of
  // W44 (B3 and B2 merged, both above): measured 104,705 / 34,801 in the e2e
  // build, the gzip plus 4. The two risks' tokens, descriptions and voice hooks
  // together are 433 gzip bytes over main's 34,373, 19 under the two PRs'
  // sums; their play-view fields were folded into one (`tableRisk`) first.
  // The raw budget, which neither PR moved alone, goes up by the 505 the two
  // take together.
  // 34,805 -> 34,811 gzip on 2026-10-23: main at 5133eaf (#254 on top of
  // #242 and #248) measured 34,807 in CI's e2e build and failed Verify, so
  // #254 did not deploy; each PR had passed on its own base. The gzip plus 4.
  // #249 builds the same chunk byte for byte.
  // 104,705 / 34,805 -> 104,745 / 34,822 on 2026-10-21 (F1 phase 2, #216,
  // draft): measured 104,745 / 34,818 in the e2e build, the gzip plus 4 (main
  // about 34,801). The table writes each press into the window's replay
  // trail; the trail's code went to its own chunk (windowTrail, below) and
  // the trail rides on the window, so what is left here is the import and two
  // calls. Kept beside the window first, it measured 34,927, then 34,849.
  // 104,705 / 34,811 -> 104,943 / 34,891 on 2026-10-23 (reading-layout on
  // main c08be0e), measured 104,943 / 34,887 plus 4: the briefing's line
  // from the scene before (D-7), the room's picture behind the phone's title
  // (D-13) and the case file's cast on the spine (D-8). Cut back first from
  // 105,749 / 35,229: the lazy import of the cast, with its preload list of
  // sixteen files, and the warming of the case's portraits (D-14) moved to the
  // runtime (CaseCastFold.jsx, useRunReadout.js), and the cast's import takes
  // no preload list (vite.config.js).
  // 104,745 / 34,822 -> 105,832 / 35,227 on 2026-10-23 (table-readouts, #246,
  // draft), measured 105,832 / 35,223 in the e2e build on main d486f4e with
  // the branch, the gzip plus 4: 안전선까지 (C-5: its button, its S key and the
  // press that sends the same PUSH events), the audit's band on the gauge
  // (C-9, drawn as the wall band's box in green because no sheet had room for
  // a rule), LOCK's 상한 도달 (C-6) and the briefing's line for the speaker's
  // reaction (C-13). Everything that could leave did: the safe line's count,
  // the reveal's afterword, the case's read and the reaction lines are the
  // runtime's (tableAfterword.js, caseCopy). The branch's earlier raise was
  // dropped first; this is only what main's budget lacks.
  // 104,745 / 34,822 -> 105,205 / 35,038 on 2026-10-23 (story-copy-1, #243,
  // draft), measured 105,205 / 35,034 in the e2e build on main d486f4e with
  // the branch, the gzip plus 4: the LOST SCENE line naming the skipped
  // scene's place with its particles, the quiet table of 사건 42, 45 and 47 in
  // GauntletFx, the reveal's notices in 합니다체 and the case's opening voice
  // back on its first briefing (Q8 (1)). The branch's earlier raises were
  // dropped first; this is only what main's budget lacks.
  // Batch B on 2026-10-23 (the day's text and screen branches merged on main
  // 5adcbb5b), measured in the e2e build, the gzip plus 4: the entries above
  // were each measured on its own branch's base.
  // 104,705 / 34,805 -> 104,733 / 34,832 on 2026-10-21, measured 104,733 /
  // 34,828 in the e2e build, the gzip plus 4: the line a NEW GAME+ season
  // opens on (newGamePlusCarry.js), drawn on 프롤로그 01's first page. Its
  // panel and the condition it is shown under are elsewhere (WeekRulePanel,
  // below, and useRunReadout in the runtime's chunk); what stays is the one
  // string handed from the play screen through the table to the page.
  // 34,832 -> 34,838 the same day: the chunk's imports name hashed files,
  // and the start screen's change above moved its gzip to 34,833-34,834.
  // 104,745 / 34,822 -> 104,773 / 34,856 on 2026-10-23, NEW GAME+ (#220)
  // rebased on main d486f4e (#216, above): measured 104,773 / 34,852 in the
  // e2e build, the gzip plus 4. The raw is #216's plus #220's 28 exactly.
  // 104,705 / 34,805 -> 104,771 / 34,843 on 2026-10-21 (A5, draft): measured
  // 104,771 / 34,839, the gzip plus 4, on main 0df240a's 104,705 / 34,801.
  // What stays here of the edge notices is the import and the one element in
  // TableNotices; their words, timing and inline style are EdgeNotice's
  // (below), and play.css took no rule. 104,771 -> 104,810 on 2026-10-22
  // (B-15): the table hands the notice its case (a `caseId` prop of its own).
  // 104,705 / 34,805 -> 104,775 / 34,859 on 2026-10-22 (story-first10, #241,
  // draft), measured 104,775 / 34,855, the gzip plus 4: the briefing's
  // held-until-asked start and the reveal's story line under the verdict
  // (A-11, D-1), after the question's panel went to ReadingClockAsk and the
  // introduction panel left the grid's row arithmetic (D-6).
  // On main's 104,745 / 34,822 (#216) this came to 104,827 / 34,871 on
  // 2026-10-23, rebased on 2c7b535: 104,827 / 34,875.
  // 104,745 / 34,822 -> 105,055 / 34,952 for ops-measure (2026-10-23, on main
  // 2c7b535), measured 105,055 / 34,948 in the e2e build, the gzip plus 4:
  // D-11's reading tally (the briefing's report each frame, the stage's note
  // when the table opens, the reveal's 자세히 count) and E-6's line under the
  // reveal, whose fetch and words are a chunk of their own (sceneChoices,
  // below). Reporting the hold on each frame in place of a mount effect and a
  // line in the hold button took 71 / 24 off (105,126 / 34,972 before).
  // -> 105,284 / 35,047 on 2026-10-23, 10-23 묶음 A 합친 상태 실측 (#220 #226
  // #241 #256 together on main 5adcbb5): measured 105,284 / 35,043 in the e2e
  // build, the gzip plus 4.
  // [batch-c] second-season (#261) on 묶음 A:
  // -> 104,825 / 34,884 the same day (second-season, draft), measured
  // 104,825 / 34,880 plus 4: E-1, the briefing prints and times the scene as
  // told (`told`, `unfold`, `newMark`); the fold itself is WeekRulePanel's.
  // -> 105,341 / 35,085 on 2026-10-23, 10-23 묶음 C 합친 상태 실측 (#261 on 묶음 A):
  // measured 105,341 / 35,081 in the e2e build, the gzip plus 4.
  // [batch-c] #272 w4b-bubbles on 묶음 A + #261:
  // 104,773 / 34,856 -> 105,138 / 34,982 on 2026-10-23 (A-2·A-10, on #220):
  // the briefing's question in its own box (「당신의 판단」), the speaker's
  // line in the balloon and the name chip on the speaker's speech, and the
  // reveal's tag in place of the voice's quotes. Measured 105,138 / 34,978 in
  // the e2e build, the gzip plus 4. Which speech is the speaker's went to its
  // own chunk (speakerLine, below): written here it measured 106,104 / 35,438.
  // -> 105,695 / 35,243 on 2026-10-23, 10-23 묶음 C 합친 상태 실측 (묶음 A + #261 + #272):
  // measured 105,695 / 35,239 in the e2e build, the gzip plus 4.
  // [batch-c] 묶음 B (#277):
  // Batch B merged on batch A (2026-10-23), measured in the e2e build, the
  // gzip plus 4: the entries above were each measured on its own base.
  // -> 107,537 / 35,935 on 2026-10-23, 묶음 C (A + B + #261 + #272) 합친 상태 실측: measured
  // 107,537 / 35,931 in the e2e build (the larger of two builds), the gzip plus 4.
  // -> 107,563 / 35,944 the same day with 묶음 B's 1999ec42 + 2bc9694a merged (edge
  // notice, 안전선 button name): measured 107,563 / 35,940, the gzip plus 4.
  // -> 107,602 / 35,960 that evening (운영 확인 고칠 점 4: the C-13 box's 직전 판
  // line): measured 107,602 / 35,956 (the larger of two builds), the gzip plus 4.
  // +2 on 2026-10-22 (S3, draft): the case and its hand handed to openCaseRun.
  // On main's 107,602 that is 107,604 (2026-10-24, f1-s7 on efba1927): measured
  // 107,604 / 35,954 in the e2e build, the gzip plus 4.
  // -> 107,682 / 35,991 on 2026-10-24 (B-14(1) 지난 시즌의 당신, on e3-endings
  // over main 90247c0): the briefing's and the hand's four calls to
  // WeekRulePanel's pastPick and the hand's `past` prop; the tag itself is
  // WeekRulePanel's. Measured 107,682 / 35,987 in the e2e build, the gzip plus 4.
  // 107,682 / 35,991 -> 101,087 / 34,821 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 101,087 / 34,817 in the e2e build, the gzip plus 4.
  // 34,821 -> 34,826 gzip on 2026-10-25, 묶음 A-13 on main 024904a3 (hashed
  // chunk names only): measured 101,085 / 34,822 in the e2e build, the gzip plus 4.
  // -> 102,475 / 35,457 on 2026-10-24 (B-11(1) 막 표지, on main ea5b74aa): the
  // act title card's gate (actCardGate.js: the eight cases, the run's record of
  // the acts it was shown, and the opening-page test) and its fold, which
  // fetches the card (ActCard.jsx, its own chunk below) with its preload list.
  // Measured 102,475 / 35,449 in the e2e build (35,453 on da6292be; the larger
  // gzip plus 4).
  // -> 102,560 on 2026-10-25, #224 (RULES_MARK 3) rebased on main 0d0c7dbb:
  // B2's link tag beside the act card's gate. Measured 102,560 / 35,437; the
  // gzip budget still holds.
  // -> 102,514 / 35,481 on 2026-10-25, 묶음 시대고증(#313): the era words in
  // the play screen's copy. Measured 102,514 / 35,472 in CI and 35,477 here,
  // the larger gzip plus 4.
  // 102,514 / 35,481 -> 102,517 / 35,481 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 102,517 in the e2e build.
  // -> 102,622 / 35,465 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7:
  // measured 102,622 / 35,461, the gzip plus 4. The board's mark (「고점 판」,
  // 「숨 고른 판」) in the pot's label, the pass re-dealing the board.
  // 35,457 -> 35,465 gzip on 2026-10-25, c3-c4-rules (C-3 and C-4, RULES_MARK 4) on #224 0c989ba7: measured 102,550 /
  // 35,461, the gzip plus 4. The card's tag prints the direction, and the
  // hashed names it imports moved.
  // 102,517 / 35,481 -> 104,640 / 35,481 on 2026-11-02, money-feedback over main c680ddd5: the purse on the bank rail (readPurse) and the slam's flying amount (MoneyBurst). Measured 104,636 / 35,268, the plus 4.
  // 104,640 / 35,481 -> 104,743 / 35,481 on 2026-11-02, money-feedback over main 9be94346: the purse on the bank rail (readPurse) and the slam's flying amount (MoneyBurst). Measured 104,739 / 35,321, the plus 4.
  // 104,743 / 35,481 -> 105,051 / 35,481 on 2026-11-03, #224 merged with main 465ccb93 (#391 #389 #390 #393 #388): the 360px audit pill (GauntletStage) beside main's purse (BankPurse, MoneyBurst.jsx). Measured 105,051 raw (gzip under 35,481) in the e2e build.
  // 105,051 / 35,481 -> 105,110 / 35,481 on 2026-11-03, #316 table-rhythm-bundle merged with #224 c55d71e1 (main 465ccb93): the board's marks beside #224's 360px audit pill and main's purse. Measured 105,110 raw (gzip under 35,481) in the e2e build.
  // 104,743 -> 104,752 on 2026-11-03 (C-15 over main 465ccb93): the badge fold's markup over money-feedback. Measured 104,748 in the e2e build, the plus 4.
  // 102,517 -> 102,528 raw on 2026-10-26, E-11 번외 사건 틀 (draft) restacked on main
  // 1dcdda39: GauntletStage exported for the side screen's table. Measured
  // 102,528 / 35,480.
  // 104,743 / 35,481 -> 104,751 / 35,481 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 104,747 / 35,326 in the e2e build, the plus 4.
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 105_110, maxGzip: 35_481 },
  // 44,024 / 13,638 on 2026-09-27.
  // 45,610 / 14,397 on 2026-10-09 with the result card's import and the
  // interlude's paragraphs, 3 gzip bytes under the ceiling; 44,365 / 13,981
  // later that day, once the report
  // stopped carrying what it could not print: a stand-in observer record, an
  // "open" afterglow and an open verdict for runs the runtime cannot produce,
  // and a guard on every panel whose record is always there
  // (tests/unit/report-copy.test.mjs holds why). The same change gave the card
  // its four fields back in place of the whole view. The "open" afterglow was
  // not one of those after all -- a finale's ledger can be all zero -- and came
  // back on 2026-10-11 for that run, inside this ceiling. The ceiling stays where
  // it was: measured plus 5% would be 46,583 / 14,680, above it, and a budget
  // here does not go up.
  // 14,400 -> 14,543 gzip on 2026-10-22 (#238, the eight epilogues and four
  // verdicts rewritten: measured 14,539 plus 4). 14,543 -> 14,562 on
  // 2026-10-23: main at d486f4e (#216's replay record on top of #238)
  // measured 14,557 in CI's e2e build and failed Verify, so #216 did not
  // deploy; #216 had been measured before #238 merged. #218 (lucide 1.60,
  // TriangleAlert for AlertTriangle) measures 14,558 on top. The gzip plus 4.
  // 14,543 -> 14,572 gzip on 2026-10-23 (table-readouts, #246, draft):
  // measured 45,637 / 14,568 in the e2e build on main d486f4e with the branch,
  // the gzip plus 4; the report hands the card 사건당 금고 (score.vaultLine,
  // C-1 (3)). The raw ceiling stays.
  // 14,543 -> 14,565 gzip on 2026-10-23 (story-copy-1, #243, draft): measured
  // 45,609 / 14,561 in the e2e build on main d486f4e with the branch, the gzip
  // plus 4; the copy the report shares with the cases (A-14 피로, A-15 names
  // and titles, A-16 합니다체). The raw ceiling stays.
  // Batch B on 2026-10-23 (the day's text and screen branches merged on main
  // 5adcbb5b), measured in the e2e build, the gzip plus 4: the entries above
  // were each measured on its own branch's base.
  // 14,562 -> 14,578 gzip on 2026-10-23 (ops-measure, on main 2c7b535),
  // measured 14,574 plus 4. No code of the report changed: its hoisted
  // `import "./<chunk>-<hash>.js"` list gained one name, sceneChoices (E-6).
  // 46,300 / 14,578 -> 43,165 / 14,202 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 43,165 / 14,198 in the e2e build, the gzip plus 4.
  // -> 43,189 / 14,206 on 2026-10-24, E-12: measured 43,189 / 14,202, the
  // gzip plus 4. No code of the report changed: a name in its hoisted
  // `import "./<chunk>-<hash>.js"` list did (gameData.app -> pastPicks).
  // 43,189 / 14,211 -> 44,569 / 14,830 on 2026-10-25 (B-12(2) 「당신의 세 장면」,
  // src/threeScenes.js in the ending's last step, on main ea5b74aa): measured
  // 44,569 / 14,826 in the e2e build, the gzip plus 4.
  // 44,569 / 14,830 -> 44,583 / 14,831 on 2026-10-25, #224 (RULES_MARK 3) rebased on
  // main 7236f80b: measured 44,583 / 14,827 in the e2e build, the gzip plus 4. Hash names in its imports only.
  // 44,569 / 14,830 -> 44,575 / 14,830 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 44,575 in the e2e build.
  // 44,575 / 14,830 -> 48,936 / 16,122 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 48,936 / 16,122 -> 50,079 / 16,401 on 2026-10-26, 영어판 3단계: the ending sequence, the three twists, the verdicts and afterglows and 「당신의 세 장면」 read by key (src/copy/ending.js), and the forecast's 「유지」 from the report's table. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 50,079 -> 50,093 raw on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): only the chunk names it imports; the gzip stays under its line. Measured 50,093 in the e2e build.
  // 50,093 / 16,401 -> 50,095 / 16,401 on 2026-11-02, #308 d2-hall-of-fame merged with #224 c29c2efd (main 9be94346). Measured 50,095 in the e2e build, the gzip plus 4.
  // 50,093 / 16,401 -> 50,093 / 16,406 on 2026-11-02, #307 c1-reading-axis merged with #224 c29c2efd (main 9be94346). Measured raw under / 16,402 in the e2e build, the gzip plus 4.
  // -> 44,589 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7: measured 44,589 raw; hash names in its imports only, the gzip budget holds.
  // 50,093 / 16,401 -> 50,095 / 16,401 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): the four's result lines together; the gzip stays under its line. Measured 50,095 / under the gzip in the e2e build, the gzip plus 4, the raw the measurement.
  // 50,079 / 16,401 -> 50,213 / 16,456 on 2026-11-02, locale-gaps (#393) over main 9be94346: the habit names and lines (src/copy/habits.js) and the one-word analyst line (endingCopy.getAnalystName). Measured 50,209 / 16,452 in the e2e build, the plus 4.
  // 50,213 / 16,456 -> 50,224 / 16,456 on 2026-11-03, #224 merged with main 465ccb93 (#391 #389 #390 #393 #388): the personal bests beside main's habit names. Measured 50,224 raw (gzip under 16,456) in the e2e build.
  // 50,224 / 16,456 -> 50,229 / 16,456 on 2026-11-03, #316 table-rhythm-bundle merged with #224 c55d71e1 (main 465ccb93): only the chunk names it imports. Measured 50,229 raw (gzip under 16,456) in the e2e build.
  // 50,224 / 16,456 -> 50,224 / 16,461 on 2026-11-03, #320 c3-c4-rules merged with #224 c55d71e1 (main 465ccb93): the logic report's direction labels read from src/copy/logicReport.js. Measured 16,457 gzip (raw under 50,224) in the e2e build, the gzip plus 4.
  // 50,213 / 16,456 -> 50,356 / 16,517 on 2026-11-02, plate-story over main acf3d999 (#392): scene plates place the sound beside its source (src/plateStory.js), mark the player figure, and draw the case ending on the result screen. Measured 50,352 / 16,513 in the e2e build, the plus 4.
  // 50,356 / 16,517 -> 50,360 / 16,524 on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 33899116): no code changed here (raw 50,356 as before); the chunk names it imports shifted with the trimmed case copy (#456, #457, #460). Measured 50,356 / 16,520 in the e2e build, the plus 4.
  // 50,360 -> 50,371 raw on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 bundle-mood: mood tokens, glow, AdaptiveMusic): the two bundles' lines together. the hall of fame's badge words beside the mood lines (gzip under 16,524). Measured 50,367 raw in the e2e build, the plus 4.
  // 50,356 / 16,517 -> 50,361 / 16,528 on 2026-11-05, tab-title-situation over main 24af89d7: the result's tab title left src/copy/reportLines.js for src/copy/tabTitles.js; the chunk names it imports. Measured 50,357 / 16,524 in the e2e build, the plus 4.
  // -> 50,626 / 16,603 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 50,622 / 16,599 in the e2e build, the plus 4.
  // 50,371 / 16,524 -> 50,647 / 16,607 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 50,643 / 16,603 in the e2e build, the plus 4.
  // 50,647 / 16,607 -> 50,701 / 16,611 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 49f50741 (#475): the case result's collapse-line verdict in the table's voice. Measured 50,697 / 16,607 in the e2e build, the plus 4.
  // 50,701 / 16,611 -> 50,701 / 16,608 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main ade608e5 (#481 studio-we-1109): only the chunk names it imports. Measured 50,697 / 16,604 in the e2e build, the plus 4.
  // 50,701 / 16,608 -> 50,701 / 16,612 on 2026-11-09, bundle 1109b: #482 #483 #487 over main 937d5170: the three together; only the chunk names it imports moved. Measured 50,697 / 16,608 in the e2e build, the plus 4.
  // 50,701 / 16,612 -> 50,857 / 16,715 on 2026-11-10, enja-text-check (E4) over main e7ccb410: the report names a queued error row in the page's words (src/copy/report.js `session.errorRow`). Measured 50,853 / 16,711 in the e2e build, the plus 4.
  // 50,857 / 16,715 -> 50,857 / 16,722 on 2026-11-10, cold-opening-style (#477) over main cb8346da: only the chunk names it imports. Measured 50,857 / 16,718 in the e2e build, the gzip plus 4.
  // 50,079 / 16,401 -> 50,421 / 16,517 on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main 43078a46: the finale's line that the side slot opened (src/copy/result.js), and the side list it reads. Measured 50,421 / 16,513, the gzip plus 4.
  // 50,213 / 16,456 -> 50,560 / 16,594 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 50,556 / 16,590 in the e2e build, the plus 4.
  // 50,356 / 16,517 -> 50,697 / 16,646 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 425eb4da (#392 #398 #395). Measured 50,693 / 16,642 in the e2e build, the plus 4.
  // 50,857 / 16,715 -> 51,205 / 16,829 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: the finale's side-slot line and the side list it reads. Measured 51,201 / 16,825 in the e2e build, the plus 4.
  // 50,857 / 16,715 -> 51,010 / 16,808 on 2026-11-10, memory-line-i18n (draft) over main cb8346da: the report names the queue's rows again from their payloads in the page's words (state/pendingRowLabel.js, #496 질문 2). Measured 51,006 / 16,804 in the e2e build, plus 4.
  // -> 51,360 / 16,908 on 2026-11-11, bundle 1111 (#350 #301 #501) over main 568572d3: the three together. Measured 51,356 / 16,904 in the e2e build, the plus 4.
  // 51,360 / 16,908 -> 51,558 / 16,956 on 2026-11-12, c2c3-result over main fbf1000c (C2-1 nearest ending, C3-3 card line, C3-4 witness paragraph). Measured 51554 / 16952 (over budget only) in the e2e build, the plus 4.
  // 51,558 / 16,956 -> 51,558 / 16,961 c2c3-result over main fbf1000c (held read outside the view groups). Measured - / 16957 (over budget only) in the e2e build, the plus 4.
  // 51,558 / 16,961 -> 51,704 / 17,011 c4c5-copy over main 7ec2304e. Measured 51700 / 17007 (over budget only) in the e2e build, the plus 4.
  // 51,558 / 16,961 -> 52,421 / 17,333 a2a3-ending over main 7ec2304e. Measured 52417 / 17329 (over budget only) in the e2e build, the plus 4.
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 52_421, maxGzip: 17_333 },
  // ScenePlate (src/components/ScenePlate.jsx) became its own chunk on 2026-11-02, plate-story over main 9be94346 (#392): scene plates place the sound beside its source (src/plateStory.js), mark the player figure, and draw the case ending on the result screen. The briefing and ResultScreen both import it. Measured 47,057 / 14,458 in the e2e build, the plus 4.
  // 47,061 / 14,462 -> 47,091 / 14,478 on 2026-11-03, plate-room-locale over main 16b6d349: a translated scene keeps its Korean place and clock for the plate (src/locales/overlay.js, src/scenePlate.js), and the sound tries 17 and 14 before it gives up (src/plateStory.js). Measured 47,087 / 14,474 in the e2e build, the plus 4.
  // 50,356 / 16,517 -> 50,367 / 16,517 on 2026-11-03, #224 merged with main cb904fb6 (#392 #398): #224's personal bests beside main's plate story. Measured 50,367 raw (gzip under 16,517) in the e2e build.
  // 50,367 / 16,517 -> 50,367 / 16,522 on 2026-11-03, #320 c3-c4-rules merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 16,518 gzip (raw under 50,367) in the e2e build, the gzip plus 4.
  // 50,367 / 16,517 -> 50,369 / 16,517 on 2026-11-03, #308 d2-hall-of-fame merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 50,369 raw (gzip under 16,517) in the e2e build.
  // 50,369 / 16,522 -> 50,647 / 16,607 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 50,643 / 16,603 in the e2e build, the plus 4.
  // 50,647 / 16,607 -> 50,701 / 16,611 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 49f50741 (#475): the case result's collapse-line verdict in the table's voice. Measured 50,697 / 16,607 in the e2e build, the plus 4.
  // 50,701 / 16,611 -> 50,701 / 16,608 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main ade608e5 (#481 studio-we-1109): only the chunk names it imports. Measured 50,697 / 16,604 in the e2e build, the plus 4.
  // 50,701 / 16,608 -> 50,701 / 16,612 on 2026-11-09, bundle 1109b: #482 #483 #487 over main 937d5170: the three together; only the chunk names it imports moved. Measured 50,697 / 16,608 in the e2e build, the plus 4.
  // 50,701 / 16,612 -> 50,857 / 16,715 on 2026-11-10, enja-text-check (E4) over main e7ccb410: the report names a queued error row in the page's words (src/copy/report.js `session.errorRow`). Measured 50,853 / 16,711 in the e2e build, the plus 4.
  // 50,857 / 16,715 -> 50,857 / 16,722 on 2026-11-10, cold-opening-style (#477) over main cb8346da: only the chunk names it imports. Measured 50,857 / 16,718 in the e2e build, the gzip plus 4.
  // 50,857 / 16,715 -> 51,205 / 16,829 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: the finale's side-slot line and the side list it reads. Measured 51,201 / 16,825 in the e2e build, the plus 4.
  // 50,857 / 16,715 -> 51,010 / 16,808 on 2026-11-10, memory-line-i18n (draft) over main cb8346da: the report names the queue's rows again from their payloads in the page's words (state/pendingRowLabel.js, #496 질문 2). Measured 51,006 / 16,804 in the e2e build, plus 4.
  // -> 51,360 / 16,908 on 2026-11-11, bundle 1111 (#350 #301 #501) over main 568572d3: the three together. Measured 51,356 / 16,904 in the e2e build, the plus 4.
  // 51,360 / 16,908 -> 51,558 / 16,956 on 2026-11-12, c2c3-result over main fbf1000c (C2-1 nearest ending, C3-3 card line, C3-4 witness paragraph). Measured 51554 / 16952 (over budget only) in the e2e build, the plus 4.
  // 51,558 / 16,956 -> 51,558 / 16,961 c2c3-result over main fbf1000c (held read outside the view groups). Measured - / 16957 (over budget only) in the e2e build, the plus 4.
  // 51,558 / 16,961 -> 51,704 / 17,011 c4c5-copy over main 7ec2304e. Measured 51700 / 17007 (over budget only) in the e2e build, the plus 4.
  // 51,558 / 16,961 -> 52,421 / 17,333 a2a3-ending over main 7ec2304e. Measured 52417 / 17329 (over budget only) in the e2e build, the plus 4.
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 52_421, maxGzip: 17_333 },
  { pattern: /^ScenePlate-.*\.js$/, maxBytes: 47_091, maxGzip: 14_478 },
  // The whole stylesheet (the intro's share is also inlined; see
  // build-critical-css.mjs). 199,426 / 36,483 before 2026-09-27, when 133 unread
  // tokens went; 196,510 / 35,448 after. 185,195 / 33,636 on 2026-09-28, when 514
  // declarations that never won a cascade were cut and extensions.css retired.
  // 35,300 -> 35,363 gzip on 2026-10-20, measured 35,363 (the same in every
  // build): 이번 주의 규칙's notice, which shares the previous participant's
  // card rule, and the ranking's two board tabs. Main measured 35,264 that
  // day; grouping the pressed tab with a rule of the same declarations made
  // it 5 bytes larger, not smaller.
  // 35,363 -> 35,473 gzip on 2026-10-22 (reading-layout, draft), measured:
  // D-3 cut the briefing's zigzag and docked footer (raw down), and D-5, D-7,
  // D-8, D-13 and B-7 added the story's sizes, the bridge, the cast, the
  // phone's backdrop and the folded gloss.
  // 35,363 -> 35,408 gzip on 2026-10-23 (story-copy-1, #243, draft), measured
  // 191,964 / 35,404 in the e2e build on main d486f4e with the branch, the
  // gzip plus 4: the case's opening voice under the briefing's title and the
  // title strip's third row (Q8 (1)).
  // Batch B on 2026-10-23 (the day's text and screen branches merged on main
  // 5adcbb5b), measured in the e2e build, the gzip plus 4: the entries above
  // were each measured on its own branch's base.
  // 35,363 -> 35,383 gzip on 2026-10-23, 10-23 묶음 A 합친 상태 실측: measured
  // 191,859 / 35,379, the gzip plus 4 -- the five branches' rules, E-6's share
  // line (.gx-reveal-share) and the title strip's order for the NEW GAME+ line.
  // -> 35,386 gzip on 2026-10-23, 10-23 묶음 C 합친 상태 실측 (#261 on
  // 묶음 A, critical CSS and font subset rebuilt): measured 35,382, the gzip plus 4.
  // [batch-c] #272 w4b-bubbles on 묶음 A + #261:
  // 35,363 -> 35,473 gzip on 2026-10-23, measured 35,469 (the gzip plus 4):
  // the briefing's 「당신의 판단」 box, the balloon beside the portrait, a
  // lead told as a caption, the name chip, and the reveal's tag (A-2, A-10).
  // The box's name shares the reveal tag's rule, and the lead's box the
  // balloon's tail rule.
  // 35,473 -> 35,502 gzip the same day, measured 35,498 (the gzip plus 4): on
  // a phone, a case's first page that introduces a rule folds the balloon so
  // the introduction and the question stay on the first screen.
  // -> 35,521 gzip on 2026-10-23, 10-23 묶음 C 합친 상태 실측 (묶음 A + #261 + #272):
  // measured 35,517 in the e2e build, the gzip plus 4.
  // [batch-c] 묶음 B (#277):
  // Batch B merged on batch A (2026-10-23), measured in the e2e build, the
  // gzip plus 4: the entries above were each measured on its own base.
  // -> 35,701 gzip on 2026-10-23, 묶음 C (A + B + #261 + #272) 합친 상태 실측: measured
  // 35,697 in the e2e build (the larger of two builds), the gzip plus 4.
  // -> 35,725 the same day with 묶음 B's 1999ec42 merged (the gauge's reading on
  // one line on a phone on its side): measured 35,721, the gzip plus 4.
  // -> 35,752 that evening with the C-13 box's 직전 판 line and the balloon's tail under its words: measured 35,748, the gzip plus 4.
  // -> 35,769 on 2026-10-24 with the music pills scrolling off the table on a phone
  // (운영화면 문제 3 (1)): measured 35,765, the gzip plus 4.
  // -> 35,796 on 2026-10-24 with a sealed card's badges on a plain ground: measured
  // 35,792, the gzip plus 4.
  // 194,400 / 35,796 -> 191,685 / 35,791 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 191,685 / 35,787 in the e2e build, the gzip plus 4.
  // -> 191,778 / 35,830 on 2026-10-25 with B-12(2)'s 「당신의 세 장면」 coda
  // (main ea5b74aa): measured 191,778 / 35,826, the gzip plus 4.
  // -> 193,412 / 36,058 on 2026-10-25 (B-11(1) 막 표지, on main 024904a3): the
  // act title card's rules in briefing.css beside B-12(2)'s coda. Measured
  // 193,412 / 36,054 in the e2e build, the gzip plus 4.
  // -> 193,577 / 36,084 on 2026-10-25, #224 rebased on main 0d0c7dbb: B2's
  // link tag (.gx-card-link) and the phone signal row's 2px gap. Measured
  // 193,577 / 36,080, the gzip plus 4.
  // 193,412 / 36,058 -> 194,165 / 36,203 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 194,165 / 36,199 gzip in the e2e build, the gzip plus 4.
  // -> 194,339 / 36,241 the same day, 개인정보처리방침·이용약관 on main 29982165:
  // `.intro-legal` and the links' colour. Measured 194,339 / 36,237 in the e2e
  // build, the gzip plus 4.
  // -> 195,002 / 36,324 on 2026-10-26, pwa-install-hint: the hint's card in
  // comfort.css. Measured 195,002 / 36,320 in the e2e build, the gzip plus 4.
  // 195,002 / 36,324 -> 195,846 / 36,472 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 195,846 -> 195,847 raw on 2026-10-26, first-paint-cut: the @font-face's weight range in tokens.css, 45 920 -> 400 920
  // (the font's thin half cut, scripts/build-fonts.mjs). Measured 195,847 / 36,467; the gzip stays under its line.
  // -> 196,068 / 36,533 on 2026-10-29, lang-full: the recovery notice sits above the fixed
  // music and language controls (z-index 31). Measured 196,064 / 36,529 in the e2e build, the gzip plus 4.
  // -> 196,140 / 36,563 on 2026-10-29, intro-en-fit: a Japanese page on a phone of 360px or less draws the
  // premise at 14px / 1.6 (base-intro-ranking.css). Measured 196,140 / 36,559 in the e2e build, the gzip plus 4.
  // -> 196,161 raw on 2026-10-29, adsense-readiness: the foot's five links wrap on a narrow screen (.intro-legal flex-wrap). Measured 196,157 / 36,560; the gzip holds.
  // -> 196,345 / 36,599 on 2026-10-30, picker-narrow over main c3b40b6f (#376): on 360px or less the three language pills keep one row (12px type)
  // and the brand row comes up 8px (base-intro-ranking.css). Measured 196,341 / 36,595 in the e2e build, the gzip plus 4.
  // -> 196,428 / 36,624 on 2026-10-30, ja-hand-narrow over main c865d984 (#380): a Japanese card label on 360px or less a size
  // down (play.css), so a five-card hand keeps two lines in a CJK face. Measured 196,428 / 36,620 in the e2e build, the gzip plus 4.
  // -> 196,523 / 36,650 on 2026-10-30, intro-360-fit over main 7552870d (#381): on 360px or less the start button sits closer
  // to the premise (a 360x740 phone had the Korean one 2px under the screen) and the English premise takes 14px. Measured 196,523 / 36,646, the gzip plus 4.
  // -> 196,795 / 36,700 on 2026-10-30, bank-rail-fit over main 78e53e40 (#382): on 360px or less the HUD gives up its air
  // (30px clock, 18px bank pills, tighter gaps) so a bank row on two lines keeps a five-card hand above the action bar.
  // Measured 196,795 / 36,696 in the e2e build, the gzip plus 4.
  // -> 196,965 / 36,722 on 2026-11-02, en-hand5-linux over main 2f085d28 (#384): on 360px or less an English
  // card label takes 12px / 1.25 and an English five-card hand 4px gaps and 6px block paddings, so Linux
  // fonts keep the hand above the action bar. Measured 196,965 / 36,718 in the e2e build, the gzip plus 4.
  // 196,068 / 36,533 -> 196,229 / 36,558 on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): B2's link tag (.gx-card-link) and the phone signal row's 2px gap. Measured 196,229 / 36,554 in the e2e build, the gzip plus 4.
  // 196,345 / 36,599 -> 196,506 / 36,627 on 2026-10-30, #224 merged with main 430dda1e: B2's link tag and the signal row's gap over main's narrow pills. Measured 196,506 / 36,623 in the e2e build, the gzip plus 4.
  // 196,506 / 36,627 -> 196,655 / 36,661 on 2026-10-30, #224 hand5-en: an English page on a 360px phone sets the bank rail's labels at 10px, its pills at 5px a side and its gap at 3px, so Audit n/4 keeps the run's line on Stake and Vault's row (play.css). Measured 196,655 / 36,657 in the e2e build, the gzip plus 4.
  // 196,229 / 36,558 -> 196,473 / 36,590 on 2026-10-29, D2 hall of fame draft (#308) merged with #224 602ec69b: the hall of fame's badge on a ranking row (.ranking-hall-badge). Measured 196,473 / 36,586 in the e2e build, the gzip plus 4.
  // 196,506 / 36,627 -> 196,750 / 36,663 on 2026-10-30, D2 hall of fame draft (#308) merged with #224 bb70e777 (main 430dda1e): the hall-of-fame badge beside main's narrow pills. Measured 196,750 / 36,659 in the e2e build, the gzip plus 4.
  // 196,655 / 36,661 -> 196,899 / 36,695 on 2026-10-30, D2 hall of fame draft (#308) merged with #224 0d29141a (the English bank rail at 360px). Measured 196,899 / 36,691 in the e2e build, the gzip plus 4.
  // 193,577 / 36,084 -> 193,630 / 36,092 on 2026-10-25, C-1(1) (the 판 읽기
  // axis) on #224 0c989ba7: the score breakdown's seventh card, the penalty
  // card taking its row. Measured 193,630 / 36,088 in the e2e build, the gzip plus 4.
  // 196,229 / 36,558 -> 196,282 / 36,566 on 2026-10-29, C-1(1) (the 판 읽기 axis) merged with #224 602ec69b: the score breakdown's seventh card, the penalty card taking its row. Measured 196,282 / 36,562, the gzip plus 4 in the e2e build.
  // 196,506 / 36,627 -> 196,559 / 36,637 on 2026-10-30, C-1 reading axis (#307) merged with #224 bb70e777 (main 430dda1e). Measured 196,559 / 36,633 in the e2e build, the gzip plus 4.
  // 196,655 / 36,661 -> 196,708 / 36,670 on 2026-10-30, C-1 reading axis (#307) merged with #224 0d29141a (the English bank rail at 360px). Measured 196,708 / 36,666 in the e2e build, the gzip plus 4.
  // -> 193,674 / 36,114 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7:
  // the two board marks' colours (.gx-mark-peak, .gx-mark-breather). Measured
  // 193,674 / 36,110, the gzip plus 4; 193,675 raw once the peak's colour
  // went from heat to ember (contrast, 3.56:1 -> about 5.6:1).
  // 196,229 / 36,558 -> 196,327 / 36,585 on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): the board marks' colours (.gx-mark-peak, .gx-mark-breather) on #224's sheet. Measured 196,327 / 36,581. Measured in the e2e build, the gzip plus 4.
  // 196,506 / 36,627 -> 196,604 / 36,656 on 2026-10-30, table rhythm bundle (#316) merged with #224 bb70e777 (main 430dda1e). Measured 196,604 / 36,652 in the e2e build, the gzip plus 4.
  // 196,655 / 36,661 -> 196,753 / 36,689 on 2026-10-30, table rhythm bundle (#316) merged with #224 0d29141a (the English bank rail at 360px). Measured 196,753 / 36,685 in the e2e build, the gzip plus 4.
  // 196,473 / 36,590 -> 196,624 / 36,625 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): the 판 읽기 card, the board marks and the hall badge on one sheet. Measured 196,624 / 36,621 in the e2e build, the gzip plus 4, the raw the measurement.
  // -> 196,901 / 36,696 on 2026-10-30, 통합 리허설 (#379) over #224 bb70e777 (main 430dda1e). Measured 196,901 / 36,692 in the e2e build, the gzip plus 4.
  // -> 197,050 / 36,728 on 2026-10-30, 통합 리허설 (#379) over #224 0d29141a (the English bank rail at 360px) with #307 #316 #320 #308. Measured 197,050 / 36,724 in the e2e build, the gzip plus 4.
  // 196,655 / 36,661 -> 196,837 / 36,700 on 2026-10-30, #224 merged with main b2558d55 (#380 #381 #382 #383): main's Japanese card labels and 360px start button over #224's link tag, signal row and English bank rail. Measured 196,837 / 36,696 in the e2e build, the gzip plus 4.
  // 196,837 / 36,700 -> 196,890 / 36,709 on 2026-11-02, C-1 reading axis (#307) merged with #224 8dd649ce (main b2558d55). Measured 196,890 / 36,705 in the e2e build, the gzip plus 4.
  // 196,837 / 36,700 (#224) -> 196,935 / 36,727 on 2026-11-02, table-rhythm-bundle (#316) merged with #224 8dd649ce (main b2558d55). Measured 196,935 / 36,723 in the e2e build, the gzip plus 4.
  // 196,837 / 36,700 (#224) -> 197,081 / 36,731 on 2026-11-02, D2 hall of fame (#308) merged with #224 8dd649ce (main b2558d55). Measured 197,081 / 36,727 in the e2e build, the gzip plus 4.
  // 197,050 / 36,728 -> 197,232 / 36,764 on 2026-11-02, 통합 리허설 (#379) over #224 8dd649ce (main b2558d55) with #307 #316 #320 #308. Measured 197,232 / 36,760 in the e2e build, the gzip plus 4.
  // 196,837 / 36,700 -> 197,093 / 36,749 on 2026-11-02, #224 merged with main 2f085d28 (#384 bank-rail-fit): main's 360px HUD block over #224's link tag, signal row and English bank rail, the English gap now column-gap: 3px at the end of that block. Measured 197,093 / 36,745 in the e2e build, the gzip plus 4.
  // 197,093 / 36,749 -> 197,687 / 36,906 on 2026-11-02, #224 merged with main c680ddd5 (#389) and 9be94346 (#388): main's English 360px hand over #224's rules, and on 360px or less
  // Audit n/4 moves from the bank row to the signals' row (.gx-hud.has-audit, .gx-hud-audit). Measured 197,687 / 36,902 in the e2e build, the gzip plus 4.
  // 197,081 / 36,731 -> 197,337 / 36,778 on 2026-11-02, D2 hall of fame (#308) merged with #224 afdcac0c (main 2f085d28). Measured 197,337 / 36,774 in the e2e build, the gzip plus 4.
  // 197,687 / 36,906 -> 197,931 / 36,935 on 2026-11-02, #308 d2-hall-of-fame merged with #224 c29c2efd (main 9be94346). Measured 197,931 / 36,931 in the e2e build, the gzip plus 4.
  // 196,935 / 36,727 -> 197,191 / 36,774 on 2026-11-02, table-rhythm-bundle (#316) merged with #224 afdcac0c (main 2f085d28). Measured 197,191 / 36,770 in the e2e build, the gzip plus 4.
  // 197,687 / 36,906 -> 197,785 / 36,939 on 2026-11-02, #316 table-rhythm-bundle merged with #224 c29c2efd (main 9be94346). Measured 197,785 / 36,935 in the e2e build, the gzip plus 4.
  // 196,890 / 36,709 -> 197,146 / 36,758 on 2026-11-02, C-1 reading axis (#307) merged with #224 afdcac0c (main 2f085d28). Measured 197,146 / 36,754 in the e2e build, the gzip plus 4.
  // 197,687 / 36,906 -> 197,740 / 36,906 on 2026-11-02, #307 c1-reading-axis merged with #224 c29c2efd (main 9be94346). Measured 197,740 in the e2e build, the gzip plus 4.
  // 197,232 / 36,764 -> 197,488 / 36,813 on 2026-11-02, 통합 리허설 (#379) over #224 afdcac0c (main 2f085d28) with #307 #316 #320 #308. Measured 197,488 / 36,809 in the e2e build, the gzip plus 4.
  // 197,931 / 36,939 -> 198,082 / 36,978 on 2026-11-02, 통합 리허설 (#379) over #224 c29c2efd (main 9be94346) with #307 #316 #320 #308. Measured 198,082 / 36,974 in the e2e build, the gzip plus 4.
  // 196,965 / 36,722 -> 197,634 / 36,910 on 2026-11-02, plate-story over main 9be94346 (#392): scene plates place the sound beside its source (src/plateStory.js), mark the player figure, and draw the case ending on the result screen. Measured 197,630 / 36,906 in the e2e build, the plus 4.
  // 196,965 / 36,722 -> 198,822 / 37,098 on 2026-11-02, money-feedback over main c680ddd5. Measured 198,822 / 37,094 in the e2e build, the gzip plus 4.
  // 198,822 / 37,098 -> 198,856 / 37,110 on 2026-11-02, money-feedback over main 9be94346. Measured 198,856 / 37,106 in the e2e build, the gzip plus 4.
  // 198,856 / 37,110 -> 198,925 / 37,111 on 2026-11-02, money-feedback over main acf3d999. Measured 198,925 / 37,107 in the e2e build, the gzip plus 4.
  // 198,925 / 37,111 -> 199,594 / 37,294 on 2026-11-02, plate-story over main b5abd681 (#392, with #391): Measured 199,590 / 37,290 in the e2e build, the plus 4.
  // 198,925 / 37,111 -> 199,354 / 37,230 on 2026-11-02, pc-type-scale over main b5abd681: from 1025px wide the root reads 112.5% (18px)
  // but the start screen (:has(.intro)) keeps 16px, and the HUD numbers keep their size through --hud-rem. Measured 199,350 / 37,226, plus 4.
  // 199,354 / 37,230 -> 200,434 / 37,457 on 2026-11-03, #224 merged with main 465ccb93 (#391 #389 #390 #393 #388): #224's link tag, signal row, English bank rail and 360px audit place (sig-tight: the signals' icon and chain sentence hidden beside the count, three auto columns) over main's money.css, 360px English labels and 1025px type scale. Measured 200,434 / 37,453 in the e2e build, the gzip plus 4.
  // 200,434 / 37,457 -> 200,487 / 37,463 on 2026-11-03, #307 c1-reading-axis merged with #224 c55d71e1 (main 465ccb93): the seventh score card's CSS beside #224's 360px audit place and sig-tight signals and main's money.css and type scale. Measured 200,487 / 37,459 in the e2e build, the gzip plus 4.
  // 199,354 / 37,230 -> 200,019 / 37,440 on 2026-11-02, plate-story over main 5c00dffe (#392, with #390): Measured 200,015 / 37,436 in the e2e build, the plus 4.
  // 200,019 / 37,440 -> 200,372 / 37,500 on 2026-11-03, signal-row-fit over main 425eb4da: on 360px or less the English and
  // Japanese signals row gives LOCK its own width and the overclock line the rest (a 360px block of its own). Measured 200,372 / 37,496 in the e2e build, the gzip plus 4.
  // 200,372 / 37,500 -> 200,439 / 37,512 on 2026-11-03, intro-webkit-fit over main 7fc3a1c4: on 360px or less the Korean and
  // Japanese premise wraps plainly (WebKit's text-wrap: pretty took it a line longer). Measured 200,435 / 37,508, plus 4.
  // 200,439 / 37,512 -> 200,433 / 37,516 on 2026-11-04, a11y-1103 over main 5d5d6ae4: the hand's card edge at
  // --ui-line-field and its brighter hover (play.css). Measured 200,429 / 37,512 in the e2e build, plus 4.
  // 200,439 / 37,512 -> 202,784 / 38,004 on 2026-11-04, kd-bank-account over main 629de24c: the KD은행 계좌 band (below 1025px) and corner box (money.css), with the shell, the music pills and the layers in front of the table moved out from under it. Measured 202,780 / 38,000 in the e2e build, the plus 4.
  // 202,784 / 38,004 -> 203,176 / 38,053 on 2026-11-04, kd-bank-account after merging main 9676ea92 (#424): the band's 44px press area, the reveal's sheet shortened by the band and the box, the band under the music pills. Measured 203,172 / 38,049 locally and in Linux CI alike, the plus 4.
  // -> 203,170 / 38,056 on 2026-11-04, bundle-1105a (#440, #439, #442, #416 over main 2bd9a8ba): the lines above together. Measured 203,166 / 38,052 in the e2e build, the plus 4.
  // 200,439 / 37,512 -> 200,479 / 37,521 on 2026-11-03, plate-sound-clip over main 8e930107: the scene's sound is centred in its
  // transform, which the build keeps (it dropped the separate translate property). Measured 200,475 / 37,517 in the build, plus 4.
  // -> 203,210 / 38,064 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 4e3f8e48 (#447): the lines above together. Measured 203,206 / 38,060 in the e2e build, the plus 4.
  // 200,439 / 37,512 -> 200,791 / 37,581 on 2026-11-04, credits-alice over main 5d5d6ae4: the credit's address row (.studio-credit-mail),
  // which wraps one address under the other on a phone. Measured 200,787 / 37,577 in the e2e build, the plus 4.
  // 200,479 / 37,521 -> 200,831 / 37,589 on 2026-11-04, bundle-1105b over main 4e3f8e48 (#447): the credit's address row (#443) with plate-sound-clip's transform. Measured 200,827 / 37,585 in the e2e build, the plus 4.
  // -> 203,562 / 38,132 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 62a25238 (#448): the lines above together. Measured 203,558 / 38,128 in the e2e build, the plus 4.
  // 203,562 / 38,132 -> 203,747 / 38,157 on 2026-11-05, text-size-setting over main 3ca15f8d: the root reads --text-scale (tokens.css, three rules and the HUD rem divided by it). Measured 203,743 / 38,153 in the e2e build, the plus 4.
  // 200,831 / 37,589 -> 201,051 / 37,647 on 2026-11-05, intro-cards-cv over main 62a25238: the roadmap's cards below the first screen are laid out and drawn only as they come near it (content-visibility: auto with a closed card's intrinsic height, 280px, 300px on the phone rail; src/styles/app/base-intro-ranking.css). Measured 201,047 / 37,643 in the e2e build, the plus 4.
  // 201,051 / 37,647 -> 200,963 / 37,656 on 2026-11-05, intro-cards-cv trim over main 62a25238: the sheet fits its structure budget again (the phone rail sets --card-reserve on its existing .case-card rule, gradients lose default 180deg and 0% stops and spell rgb(... / 0) as transparent, radial positions shortened); 88 raw bytes fewer, and the gzip 9 bytes more from the changed repeats. Measured 200,959 / 37,652 in the e2e build, the plus 4.
  // -> 203,876 / 38,222 on 2026-11-05, bundle-1105d with intro-cards-cv (E5, D1, table-a11y, canon-trainee-locales, static-shell, intro-cards-cv) over main c569cb99: E5's root rules over the trimmed base-intro-ranking.css with its content-visibility rules. Measured 203,872 / 38,218 in the e2e build, the plus 4.
  // -> 203,882 / 38,222 on 2026-11-05, bundle-1105d after merging main 977809b3 (#457 본문 줄이기 b), the static shell reverted and the roadmap summary's flex: none: the one declaration (flex: none) on the card's summary, 6 bytes raw, the gzip the same. Measured 203,878 / 38,218 in the e2e build, the plus 4.
  // 203,562 / 38,132 -> 204,569 / 38,438 on 2026-11-05, mood-tokens over main c569cb99: the ground follows the scene's mood (tokens.css: neutral one step lighter, tense/dread/bright/sorrow as :root[data-mood] blocks, --ui-ease-out), the felt's 0.6s fade (play.css), the intro scrims on the neutral ground and the critical CSS cut again. Measured 204,565 / 38,434 in the e2e build, the plus 4.
  // 38,438 -> 38,432 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 977809b3): the two acid glows at 0.1 (the active case card, the next-case panel), for the readability check on the lighter neutral ground. Measured 204,565 / 38,428 in the e2e build, the plus 4.
  // -> 204,886 / 38,527 on 2026-11-05, bundle-1105d after merging main 4f2d39cb (#458 mood colour and music, #460 본문 c): #458's mood tokens and glows over the bundle's root rules and the card summary's flex: none. Measured 204,882 / 38,523 in the e2e build, the plus 4.
  // 200,434 / 37,457 -> 201,099 / 37,652 on 2026-11-03, #224 merged with main cb904fb6 (#392 #398): #224's 360px audit place and sig-tight signals beside main's plate story CSS. Measured 201,099 / 37,648 in the e2e build, the gzip plus 4.
  // 201,099 / 37,652 -> 201,152 / 37,657 on 2026-11-03, #307 c1-reading-axis merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 201,152 / 37,653 in the e2e build, the gzip plus 4.
  // 200,434 / 37,457 -> 200,532 / 37,494 on 2026-11-03, #316 table-rhythm-bundle merged with #224 c55d71e1 (main 465ccb93): the board's marks beside #224's 360px audit place and sig-tight signals and main's money.css and type scale. Measured 200,532 / 37,490 in the e2e build, the gzip plus 4.
  // 201,099 / 37,652 -> 201,197 / 37,687 on 2026-11-03, #316 table-rhythm-bundle merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 201,197 / 37,683 in the e2e build, the gzip plus 4.
  // 201,099 / 37,652 -> 201,343 / 37,672 on 2026-11-03, #308 d2-hall-of-fame merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 201,343 / 37,668 in the e2e build, the gzip plus 4.
  // 201,343 / 37,687 -> 201,494 / 37,715 on 2026-11-03, 통합 리허설 (#379) over #224 30f5519d (main bb492d5d) with #307 #316 #320 #308: the four branches' lines together. Measured 201,494 / 37,711 in the e2e build, the gzip plus 4.
  // 203,562 / 38,132 -> 205,041 / 38,403 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 205,037 / 38,399 in the e2e build, the plus 4.
  // 203,562 / 38,132 -> 204,569 / 38,438 on 2026-11-05, mood-tokens over main c569cb99: the ground follows the scene's mood (tokens.css: neutral one step lighter, tense/dread/bright/sorrow as :root[data-mood] blocks, --ui-ease-out), the felt's 0.6s fade (play.css), the intro scrims on the neutral ground and the critical CSS cut again. Measured 204,565 / 38,434 in the e2e build, the plus 4.
  // 38,438 -> 38,432 gzip on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 977809b3): the two acid glows at 0.1 (the active case card, the next-case panel), for the readability check on the lighter neutral ground. Measured 204,565 / 38,428 in the e2e build, the plus 4.
  // 205,041 / 38,403 -> 206,048 / 38,702 on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 bundle-mood: mood tokens, glow, AdaptiveMusic): the two bundles' lines together. Measured 206,044 / 38,698 in the e2e build, the plus 4.
  // 203,562 / 38,132 -> 203,575 / 38,173 on 2026-11-05, hold-confirm over main e68fe8cc (A4 (1), 2026-11-05): the held 확정's gauge (.gx-hold, its reduced-motion 0.6s) in place of the ::after line, less a duplicated hand rule and two merged blocks. Measured 203,571 / 38,169 in the e2e build, the plus 4.
  // -> 203,558 / 38,178 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 203,554 / 38,174 in the e2e build, the plus 4.
  // 206,048 / 38,702 -> 206,048 / 38,745 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 206,040 / 38,741 in the e2e build, the plus 4.
  // -> 206,351 / 38,789 on 2026-11-05, bundle-1105d after merging main 7e1fe0f0 (#461 rules bundle): #461's rules CSS over the bundle's root rules and the card summary's flex: none. Measured 206,347 / 38,785 in the e2e build, the plus 4.
  // 206,048 / 38,745 -> 206,347 / 38,833 on 2026-11-06, bundle-1106a after merging main 6f58cbb8 (#459 bundle-1105d: E5, D1, table-a11y, canon, intro cards): the two sides' lines together. Measured 206,343 / 38,829 in the e2e build, the plus 4.
  // 200,439 / 37,512 -> 201,129 / 37,614 on 2026-11-05, kd-spend-ui over main 2bd9a8ba (C9 PR 2, on PR 1 66bdce6a): the draft's two buy buttons in one row of two (44px high, the price on a second line on 360px), the closed state dimmed, the reason and the notice at 11px (src/styles/app/relics.css). Measured 201,125 / 37,610 in the e2e build, the plus 4.
  // 201,099 / 37,652 -> 201,051 / 37,650 on 2026-11-05, phone-en-stake-11px over rules-mark-3b 9e91c588: the 360px English bank rail's 10px label rule went (play.css; Audit n/4 sits on the signals' row, so Stake and Vault read 11px). Measured 201,047 / 37,646 in the e2e build, the plus 4.
  // 206,048 / 38,702 -> 206,671 / 38,799 on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): draft-spend.css (C9's two buys) and the stake clock's HUD lines, less the 360px English 10px label rule (phone-en-stake-11px). Measured 206,667 / 38,795 in the e2e build, the plus 4.
  // -> 206,974 / 38,884 on 2026-11-06, bundle-rules2 after merging main 6f58cbb8 (#459 묶음 1105d: 글자 크기, 결과 카드 습관 줄, 11px·aria-live, 캐논, 인트로 카드): #459's lines under the rules2 lines above. Measured 206,970 / 38,880 in the e2e build, the plus 4.
  // 206,347 / 38,833 -> 206,970 / 38,929 on 2026-11-06, bundle-1106a after merging main e1f5e515 (#463 bundle-rules2: C9 spend, 11px, B1 scout, B5 stake clock): the two sides' lines together. Measured 206,966 / 38,925 in the e2e build, the plus 4.
  // 206,970 / 38,929 -> 208,114 / 39,241 on 2026-11-06, mood-boost over main bb7781c7 (#464 bundle-1106a): the moods' hue-carrying grounds, lines, accents and frames (tokens.css), the edge tint (play.css .game-shell::after, briefing.css veil) and its @property. Measured 208,110 / 39,237 in the e2e build, the plus 4.
  // 208,114 / 39,241 -> 208,126 / 39,241 on 2026-11-06, static-shell-2 after merging main d7dadd92 (#465 mood-boost): the intro art's box takes its height from the viewport alone (min(100svh, 940px), 82svh on a phone; decision 13 (1)), so the static shell and the intro draw it the same. Measured 208,122 / 39,235 in the e2e build, the raw plus 4 (the gzip under its line).
  // 208,126 / 39,241 -> 208,226 / 39,265 on 2026-11-09, hand-fit-2px (#476) over main 49f50741: the 360px HUD's 2px gaps and, in Japanese, the signals row, dateline, speaker and lock seal at line-height 1.2 (Noto CJK's normal line is about 1.45em). Measured 208,222 / 39,261 in the e2e build, the plus 4.
  // 208,226 / 39,265 -> 209,113 / 39,370 on 2026-11-09, phone-390-fit over main 775bb69a (#476): a 361-390px block for English and Japanese (the 360px labels, HUD air and Japanese 1.2 lines; the English gauge row at 4px and the column over a rules hand at 4px) and, at 360px, the English streak's line cut with an ellipsis. Measured 209,109 / 39,366 in the e2e build, the plus 4.
  // 209,113 / 39,370 -> 209,171 / 39,378 on 2026-11-09, a32-411-fit over main c1d08daa (#488): the 360px HUD air in a block shared with phones up to 480 wide and 800 tall (play.css; Galaxy A32, 411x780). Measured 209,167 / 39,374 in the e2e build, the plus 4.
  // 209,113 / 39,370 -> 209,356 / 39,400 on 2026-11-09, phone-heavy-bank over main c1d08daa (#488): at 360px the relics sit beside the run's line when they fit (an overclocked board with a max bank put five-card hands 18px under the bar in Korean, 9 in Japanese), and at 361-390px the English signals take the 360px columns. Measured 209,352 / 39,396 in the e2e build, the plus 4.
  // 209,171 / 39,378 (#492 #493) and 209,356 / 39,400 (phone-heavy-bank) -> 209,414 / 39,403 on 2026-11-10, phone-heavy-bank after merging a32-follow (#493) and main b4535e99: both, the English signals' columns now in the 361-480px block. Measured 209,410 / 39,399 in the e2e build, the plus 4.
  // 209,414 / 39,403 -> 209,693 / 39,458 on 2026-11-10, en-signals-row over main e7ccb410 (#491): the English signals row at 361-480px as one flex line (the chain's sentence and the streak's direction line cut with an ellipsis; Linux, 390x844 and 411x780, the row ran 2 to 13px into itself). Measured 209,689 / 39,454 in the e2e build, the plus 4.
  // 209,414 / 39,403 -> 209,522 / 39,417 on 2026-11-10, phone-390-bank over main 201ca8ce (#496): the relics beside the run's line at 361-480px in Korean and Japanese (a 390x844 phone with a max bank put overclocked five-card hands 22px under the bar in Korean, 20 in Japanese). Measured 209,518 / 39,413 in the e2e build, the plus 4.
  // 209,522 / 39,417 -> 209,619 / 39,432 on 2026-11-10, phone-846-staked over main b77e4bfe (#498): the short phone's air (not its hidden portrait or cut question) also at 391-480px wide and up to 860px tall (411x846 Korean overclocked, a card staked: 25px under the bar; Pixel 7 412x839). Measured 209,615 / 39,428 in the e2e build, the plus 4.
  // 209,693 / 39,458 (en-signals-row) and 209,522 / 39,417 (#497) -> 209,801 / 39,474 on 2026-11-10, en-signals-row after merging main 261accef (#496 #497): both. Measured 209,797 / 39,470 in the e2e build, the plus 4.
  // 209,619 / 39,432 (phone-846-staked) and 209,801 / 39,474 (#499) -> 209,898 / 39,487 on 2026-11-10, phone-846-staked after merging main 3a507805 (#499): both. Measured 209,894 / 39,483 in the e2e build, the plus 4.
  // 209,898 / 39,487 -> 209,941 / 39,492 on 2026-11-10, phone-390-staked over main cb8346da (#500): the staked card's one-line detail in a block of its own for every phone up to 480 wide and 860 tall (390x844 Korean overclocked, a card staked in case 01: 9px under the bar). Measured 209,937 / 39,488 in the e2e build, the plus 4.
  // -> 196,266 / 36,582 on 2026-10-29 (C-15 카드 정보 줄이기, draft for after W47, on main 11cb3b16; was 193,614 / 36,108 on c8841dc0): play.css's fold for a board rule's badge and a plain 소모 없음. Measured 196,266 / 36,578 in the e2e build, the gzip plus 4.
  // -> 196,342 / 36,612 on 2026-10-29 (C-15 over main 6a36dcc9, with intro-en-fit's rule): measured 196,342 / 36,608 in the e2e build, the gzip plus 4.
  // -> 196,547 / 36,650 on 2026-10-30 (C-15 over main c39870a7, #376 #375, the badge fold over the foot's five links and the 360px pills): measured 196,543 / 36,646 in the e2e build, the plus 4.
  // -> 197,001 / 36,748 on 2026-11-02 (C-15 over main 2f085d28, the badge fold over ja-hand-narrow, intro-360-fit and bank-rail-fit): measured 196,997 / 36,744 in the e2e build, the plus 4.
  // 199,354 / 37,230 -> 199,556 / 37,277 on 2026-11-03 (C-15 over main 465ccb93, the badge fold over money-feedback and pc-type-scale): measured 199,552 / 37,273 in the e2e build, the plus 4.
  // 200,019 / 37,440 -> 200,221 / 37,489 on 2026-11-03, C-15 over main 425eb4da (#392 #398 #395), the badge fold and describeStakedDetail. Measured 200,217 / 37,485 in the e2e build, the plus 4.
  // 209,898 / 39,487 -> 210,100 / 39,539 on 2026-11-10, C-15 over main cb8346da (#499 #500): play.css's badge fold and the plain 소모 없음. Measured 210,096 / 39,535 in the e2e build, the plus 4.
  // 210,100 / 39,539 (C-15) and 209,941 / 39,492 (phone-390-staked, #503) -> 210,143 / 39,545 on 2026-11-11, C-15 after merging main 568572d3 (#484 #502 #503): both. Measured 210,139 / 39,541 in the e2e build, the plus 4.
  // 209,898 / 39,487 -> 213,956 / 41,401 on 2026-11-10, font-split over main cb8346da (the user's choice 1; held for W47, which was called off on 11-10): the second @font-face and its unicode-range (575 code points of the second font file, written by scripts/build-fonts.mjs). Measured 213,952 / 41,397 in the e2e build, the plus 4.
  // 213,956 / 41,401 (font-split) and 209,941 / 39,492 (phone-390-staked, #503) -> 213,999 / 41,407 on 2026-11-11, font-split after merging main 568572d3 (#484 #502 #503): both. Measured 213,995 / 41,403 in the e2e build, the plus 4.
  // 213,999 / 41,407 -> 213,902 / 41,395 on 2026-11-11, phone-390-staked-all over main d4048d83 (#426): the short phone's air (not its hidden portrait or cut question) on every phone up to 480 wide and 860 tall, 390x844 too, with the staked card's one-line detail folded into that block (390x844 overclocked, a card staked: Korean 16px, Japanese 20, English 16 under the bar). Measured 213,898 / 41,391 in the e2e build, the plus 4.
  // -> 213,985 / 41,396 on 2026-11-11, bundle 1111 after build:fonts (냄, 짧) and the critical CSS regenerated. Measured 213,981 / 41,392 in the e2e build, the plus 4.
  // 213,985 / 41,396 -> 213,999 / 41,403 on 2026-11-11, E-11 번외 1 (#314) over main 5c93b496 (#504). Measured 213995 / 41399 (over budget only) in the e2e build, the plus 4.
  // 213,999 / 41,403 -> 214,201 / 41,455 on 2026-11-11, C-15 after merging main c61d6618. Measured 214197 / 41451 (over budget only) in the e2e build, the plus 4.
  // 213,999 / 41,403 -> 214,218 / 41,444 on 2026-11-12, e3-status (the heart's .gx-listen button) over main fbf1000c. Measured 214,214 / 41,440 in the e2e build, the plus 4.
  // 214,218 / 41,444 -> 214,420 / 41,493 bundle 1112c (#520 #521) over main 4f927085. Measured 214416 / 41489 (over budget only) in the e2e build, the plus 4.
  // 214,420 / 41,493 -> 214,508 / 41,536 a2a3-ending over main 7ec2304e. Measured 214504 / 41532 (over budget only) in the e2e build, the plus 4.
  { pattern: /^index-.*\.css$/, maxBytes: 214_508, maxGzip: 41_536 },
  // The one font file (scripts/build-fonts.mjs), already compressed, so the raw
  // size is the transfer size. 270,000 bytes on 2026-09-27; it replaced 92
  // dynamic subsets, of which the intro alone pulled ~537KB.
  // 283,500 -> 197,740 on 2026-10-26, first-paint-cut (the user's choice 1): the
  // weight axis cut to 400-920, nothing asking for less. Measured 197,736 (from
  // 270,828), plus 4.
  // 197,740 -> 198,148 on 2026-11-02, plate-story (#392): ク, ド and ン for the Japanese sounds in the plate. Measured 198,144 plus 4.
  // 198,148 -> 199,128 on 2026-11-05, studio-name: ち, ぷ, も and よ for the Japanese studio name STUDIOもちぷよ (1,703 characters). Measured 199,124 plus 4.
  // 199,128 -> 131,356 on 2026-11-10, font-split over main 3a507805 (the user's choice 1): the one
  // file became two. This is the first, preloaded one: the start screen's characters in
  // the three languages, the intro's case cards, play styles and origins among them
  // (first measured on 2026-11-03/04 at 96,236 and then 129,424). Measured 131,352 plus 4.
  // 131,356 -> 131,476 on 2026-11-11, bundle 1111 (#350 #301 #501) after merging main d4048d83: build:fonts for the two start-screen characters #301 adds (냄, 짧). Measured 131,472, the plus 4.
  { pattern: /^pretendard-cp-(?!rest-).*\.woff2$/, maxBytes: 131_476, compressed: true },
  // The second file, every other syllable of the copy, fetched by unicode-range
  // when a page prints one and precached by the worker (service-worker-build.mjs).
  // Not in the first paint. Measured 82,780 plus 4 on 2026-11-10.
  // 82,784 -> 82,428 on 2026-11-11, bundle 1111 (#350 #301 #501) after merging main d4048d83: build:fonts for the two start-screen characters #301 adds (냄, 짧) (they left this file). Measured 82,424, the plus 4.
  // 82,428 -> 82,688 on 2026-11-11, E-11 번외 1 (#314) over main 5c93b496: build:fonts for 갭 and 뿌. Measured 82,684, the plus 4.
  { pattern: /^pretendard-cp-rest-.*\.woff2$/, maxBytes: 82_688, compressed: true },
  // The chunks below had no budget until 2026-09-28: the list named six files
  // and the build emits eleven, so a new 400KB lazy screen would have passed a
  // check described as a ratchet on every chunk. Measured that day, plus 5%.
  // React and the scheduler. 221,715 / 68,975. It moves only with a React bump.
  // -> 220,606 / 68,323 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 220,606 / 68,319 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (221,715 / 68,974 on the same commit).
  // 220,606 / 68,323 -> 220,621 / 68,331 on 2026-10-23, rebased on main
  // 5adcbb5 with its lock installed (npm ci): measured 220,621 / 68,327, the
  // gzip plus 4, raised by what it lacked. Nothing of the app's is in this
  // chunk; the 15 bytes came with the lock, not with this branch.
  { pattern: /^react-vendor-.*\.js$/, maxBytes: 220_621, maxGzip: 68_331 },
  // The four budgets below were first written against the tree before the
  // 2026-09-28 fix pass and are set here against the tree after it, measured
  // plus 5%: the same day's other changes are what they have to hold.
  // The lucide icons the screens import, tree-shaken. 13,711 / 4,900, with the
  // icons the board's states and the recovery controls added.
  // 14,400 / 5,150 -> 17,600 / 6,150 on 2026-10-21 with lucide-react 1.60,
  // measured 17,595 / 6,139 and raised by the shortfall only: the same 49
  // icons, no unused import to drop, but 1.x adds a provider context, alias
  // class names and a name/size record per icon to the shared code.
  // 17,600 / 6,150 -> 17,050 / 6,047 on 2026-10-23, Vite 8 (#225, the user's
  // choice 1): measured 17,050 / 6,043 in the e2e build on main 5adcbb5 with
  // lucide-react 1.60 installed (npm ci), the gzip plus 4. The 13,212 / 4,658
  // of 2026-10-21 was lucide 0.577 left in this checkout's node_modules.
  // 17,050 / 6,047 -> 17,286 / 6,142 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 17,286 / 6,138 gzip in the e2e build, the gzip plus 4.
  // 17,050 / 6,047 -> 17,296 / 6,140 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7:
  // C-7's five tool icons (ClipboardCheck, Files, Hourglass, Newspaper,
  // NotebookPen); the five they replace are still drawn elsewhere. Measured
  // 17,296 / 6,136 in the e2e build, the gzip plus 4.
  // 17,286 / 6,142 -> 17,532 / 6,240 on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): C-7's five tool icons on top of board-report's Flag. Measured 17,532 / 6,236. Measured in the e2e build, the gzip plus 4.
  // 17,532 / 6,240 -> 17,602 / 6,264 on 2026-11-10, deps-1123: vite 8.3.6 / lucide-react 1.69 after merging main cb8346da (replaces Dependabot #479 and #480; vite 8.3.6 changes the build's bytes, lucide-react 1.69 draws TriangleAlert and ShieldAlert as TriangleExclamationPoint and ShieldExclamationPoint, the names the screens now import). Measured 17,598 / 6,260 in the e2e build, the plus 4.
  { pattern: /^icons-vendor-.*\.js$/, maxBytes: 17_602, maxGzip: 6_264 },
  // 5,293 / 2,232, with the board's loading, error and retry states.
  // 5,560 / 2,350 -> 6,040 / 2,490 on 2026-10-07, measured 5,748 / 2,373 plus
  // 5%: a button that says why it will not act, and the counters as
  // descriptions rather than part of each field's name.
  // -> 5,502 / 2,359 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 5,502 / 2,355 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (5,748 / 2,370 on the same commit).
  // 5,502 / 2,359 -> 5,507 / 2,366 on 2026-10-23, rebased on main 5adcbb5
  // with lucide-react 1.60 installed (npm ci): measured 5,507 / 2,362, the
  // gzip plus 4, raised by what it lacked. The 5 bytes came with main and
  // lucide 1.60 (#218, which the screen imports from); this branch changes
  // nothing in it.
  // 5,507 / 2,366 -> 9,029 / 3,768 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 9,029 / 3,764 gzip in the e2e build, the gzip plus 4.
  // 9,029 / 3,768 -> 9,030 / 3,768 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 9,030 / 3,768 -> 10,077 / 4,118 on 2026-10-26, 영어판 3단계: the board's words read by key (src/copy/board.js), with the report form's reasons and refusals named from boardReport.js. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 10,077 -> 10,078 raw on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main 43078a46: only the names of the chunks it imports. Measured 10,078 in the e2e build.
  { pattern: /^BoardScreen-.*\.js$/, maxBytes: 10_078, maxGzip: 4_118 },
  // 3,860 / 1,759, with rows typed before they are rendered.
  // 4,060 / 1,850 -> 4,420 / 1,980 on 2026-10-06, measured 4,210 / 1,883 plus
  // 5%: the count that is not "0명" while it loads, the region that says when
  // the rows arrive, and `lang` on the English labels.
  // -> 4,800 / 2,100 on 2026-10-07, measured 4,567 / 2,001 plus 5%: a list
  // with spoken ranks, and a retry when the rows did not come.
  // -> 4,959 / 2,139 on 2026-10-23 (table-readouts, #246, draft), measured
  // 4,959 / 2,135 plus 4: 사건당 금고 on each row (C-1 (3)), worked out in the
  // screen so the entry chunk's ranking.js does not grow.
  // 4,800 -> 4,858 raw on 2026-10-21, measured: the NEW GAME+ tag on this
  // device's own rows (the gzip, 2,080, stays under its budget).
  // Batch B merged on batch A (2026-10-23), measured in the e2e build, the
  // gzip plus 4: the entries above were each measured on its own base.
  // 5,048 / 2,170 -> 4,793 / 2,147 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 4,793 / 2,143 in the e2e build, the gzip plus 4.
  // 4,793 / 2,147 -> 5,033 / 2,256 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 5,033 / 2,252 in the e2e build, the gzip plus 4. the personal bests' state, fetch and line (src/personalBests.js) and the heading that says the season record is a mean of cases.
  // 4,793 / 2,147 -> 5,503 / 2,416 on 2026-10-26, 영어판 3단계: the ranking's words read by key (src/copy/ranking.js) and dates in the page's language. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 5,503 / 2,416 -> 5,810 / 2,522 on 2026-11-03, ranking-recheck-wider over main 36104abd (보안 점검 M2): a row the server has not checked yet says 「확인 중」, with its explanation in a title. Measured 5,806 / 2,518 in the e2e build, the plus 4.
  // 5,503 / 2,416 -> 5,579 / 2,429 on 2026-11-03, a11y-1103: the 시즌 완료 badge shows its words and says the record's name in an sr-only span, not an aria-label on a span (axe aria-prohibited-attr). Measured 5,575 / 2,425 in the e2e build, the plus 4.
  // 5,579 / 2,429 -> 5,609 / 2,437 on 2026-11-04, a11y-1103: the row's place line carries data-testid="ranking-place", so a test reads the one place line and not the badge's sr-only line. Measured 5,605 / 2,433 in the e2e build, the plus 4.
  // 5,609 / 2,437 -> 5,609 / 2,436 on 2026-11-04, a11y-1103 over main 22f43342. Measured 5,605 / 2,432 in the e2e build, the plus 4.
  // -> 5,912 / 2,535 on 2026-11-05, bundle-1105c (#450, #432, #425, #434) over main 3d4183e5 (#449, #441): the lines above together (「확인 중」 over the ranking-place testid). Measured 5,908 / 2,531 in the e2e build, the plus 4.
  // 5,503 / 2,416 -> 5,836 / 2,575 on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): the personal bests' state, fetch and line (src/personalBests.js, its words ranking.pastBest) and the intro that says the season record is a mean of cases. Measured 5,836 / 2,571, the gzip plus 4 in the e2e build.
  // 5,836 / 2,575 -> 6,670 / 2,992 on 2026-10-29, D2 hall of fame draft (#308) merged with #224 602ec69b, the 2nd stage: the badges (src/hallOfFameBadges.js, public_hall_of_fame read on mount, its words ranking.hallBadge, hallMainBoard, hallProvisional) and the footnote's second sentence (ranking.hallFootnote). Measured 6,670 / 2,988 in the e2e build, the gzip plus 4.
  // 5,912 / 2,535 -> 7,079 / 3,112 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 7,075 / 3,108 in the e2e build, the plus 4.
  // 7,079 / 3,112 -> 7,251 / 3,201 on 2026-11-11, recheck-in-case over main 52027156. Measured 7247 / 3197 (over budget only) in the e2e build, the plus 4.
  { pattern: /^RankingScreen-.*\.js$/, maxBytes: 7_251, maxGzip: 3_201 },
  // Online save, which left the entry chunk: a device that never turned it on
  // does not download it. 9,530 / 3,780 and 4,510 / 1,890.
  // -> 10,960 / 4,380 on 2026-10-07, measured 10,438 / 4,173 plus 5%: the
  // online copy held through a reset, and uploads paced under the hourly limit.
  // 10,960 / 4,380 -> 10,523 / 4,284 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 10,523 / 4,280 in the e2e build, the gzip plus 4.
  // 10,523 / 4,284 -> 11,492 / 4,639 on 2026-10-24, E-12: the upload carries
  // the season record, the past picks and the read scenes inside the save,
  // and a restore takes them out of it. Measured 11,492 / 4,635, the gzip plus 4.
  // 11,492 / 4,639 -> 11,492 / 4,644 on 2026-10-25, board-report on main caeecda: only by the chunk names it imports. Measured 4,640 gzip in the e2e build, the gzip plus 4.
  // 11,492 -> 11,494 raw on 2026-10-26, pwa-install-hint: only by the chunk names it imports. Measured 11,494 / 4,638.
  // 11,494 -> 11,497 raw on 2026-10-26, funnel-locale: only by the chunk names it imports. Measured 11,497 / 4,636.
  // 11,497 / 4,644 -> 11,780 / 4,768 on 2026-10-26, 영어판 3단계: online save's status lines and refusals read by key (src/copy/cloudSaveStatus.js). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 4,768 -> 4,773 gzip on 2026-10-30, picker-narrow over main c3b40b6f (#376): only by the chunk names it imports. Measured 4,769 gzip in the e2e build, the gzip plus 4.
  // 11,780 -> 11,785 raw on 2026-11-02, bgm-variety over main c680ddd5 (#389): only by the chunk names it imports. Measured 11,781 raw.
  // 4,639 -> 4,645 gzip on 2026-10-25, c3-c4-rules (C-3 and C-4, RULES_MARK 4) on #224 0c989ba7: measured 11,492 / 4,641
  // (hashed names only), the gzip plus 4.
  // 11,780 / 4,768 -> 11,780 / 4,773 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): the hashed names it imports moved; the raw stays under its line. Measured under the raw / 4,769 in the e2e build, the gzip plus 4.
  // 11,780 / 4,773 -> 11,785 / 4,775 on 2026-10-30, E-11 번외 사건 틀 (draft) over main 430dda1e (#373 #374 #375 #376 #378): only by the chunk names it imports. Measured 11,781 / 4,771, the plus 4.
  // 11,785 / 4,773 -> 11,785 / 4,779 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 425eb4da (#392 #398 #395). Measured 11,781 / 4,775 in the e2e build, the plus 4.
  // 11,785 / 4,775 -> 12,364 / 4,992 on 2026-10-30, E-11 번외 사건 온라인 저장 (draft) over e11-side01 6f8723b0 (main 430dda1e): the upload carries the side marks (state/sideMarks.js) and a restore merges them. Measured 12,364 / 4,988, the gzip plus 4.
  // 11,785 / 4,773 -> 12,368 / 4,989 on 2026-11-03, E-11 번외 사건 온라인 저장 (draft) over e11-side01 9ce20c45 (main 465ccb93). Measured 12,364 / 4,985 in the e2e build, the plus 4.
  // 11,785 / 4,779 -> 12,368 / 4,988 on 2026-11-03, E-11 번외 사건 온라인 저장 (draft) over e11-side01 dca98f20 (main 425eb4da). Measured 12,364 / 4,984 in the e2e build, the plus 4.
  // 11,785 / 4,773 -> 11,901 / 4,809 on 2026-11-11, E-11 번외 온라인 저장 (#317) over #314 9b34ba69 (main 5c93b496). Measured 11897 / 4805 (over budget only) in the e2e build, the plus 4.
  // 11,901 / 4,809 -> 11,901 / 4,816 on 2026-11-11, E-11 번외 온라인 저장 (#317) after merging main c61d6618 (#314). Measured - / 4812 (over budget only) in the e2e build, the plus 4.
  // 11,901 / 4,816 -> 11,901 / 4,821 bundle 1112d (#523) over main 68c7071e. Measured - / 4817 (over budget only) in the e2e build, the plus 4.
  { pattern: /^cloudSave-.*\.js$/, maxBytes: 11_901, maxGzip: 4_821 },
  // E-12's merge of those three device keys on a restore, loaded only when a
  // copy is restored (cloudSave.applyCloudSave). Measured 1,934 / 938 in the
  // e2e build, the gzip plus 4.
  // 942 -> 948 on 2026-10-25, 묶음 A-3 (season labels) on main 8e75b128: no
  // code, the case chunks' new hashes. Measured 944, the gzip plus 4.
  // 1,934 / 948 -> 2,097 / 1,004 on 2026-10-26, E-11 번외 사건 온라인 저장
  // (draft) restacked on e11-side01 76c5b028: the side records' merge on a
  // restore. Measured 2,097 / 1,000, the gzip plus 4.
  { pattern: /^cloudDeviceRecords-.*\.js$/, maxBytes: 2_097, maxGzip: 1_004 },
  // The panel: 4,740 / 1,990 -> 5,090 / 2,100 on 2026-10-06, measured 4,845 /
  // 1,995 plus 5%, for telling a success from a failure -- two regions that
  // are on the page before they speak, where one alert said both.
  // -> 4,468 / 1,896 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 4,468 / 1,892 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (4,820 / 1,964 on the same commit).
  // -> 4,458 / 1,893 on 2026-10-23, rebased on main 5adcbb5 with
  // lucide-react 1.60 installed (npm ci): measured 4,458 / 1,889, the gzip
  // plus 4.
  // 4,458 / 1,893 -> 5,014 / 2,135 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 5,014 / 2,135 -> 5,023 / 2,138 on 2026-11-10, deps-1123: vite 8.3.6 / lucide-react 1.69 after merging main cb8346da (replaces Dependabot #479 and #480; vite 8.3.6 changes the build's bytes). Measured 5,019 / 2,134 in the e2e build, the plus 4.
  { pattern: /^CloudSavePanelBody-.*\.js$/, maxBytes: 5_023, maxGzip: 2_138 },
  // The table's engine, shared by the shell's save repair and the runtime, so
  // the bundler gives it a chunk of its own. 34,010 / 12,870.
  // 35,720 / 13,520 -> 37,870 / 14,200 on 2026-10-09, measured 36,063 /
  // 13,515 plus 5% (it stood at 35,120 raw before): the reducer, the next
  // board and the settlement each ask which rules the case plays under, for
  // the prologues' staged unlocks. The list of steps and its copy are kept
  // out of this chunk; they load with the runtime.
  // 14,200 -> 14,230 gzip on 2026-10-21 (B2, #208, draft), measured 14,226
  // plus 4 (main 14,050): CASCADE on the next board, the reveal's link line,
  // and the table's two lists of links (linksIn, linksOut) kept, handed to a
  // replay and back and opened on; their reading is cascadeRisk's.
  // 14,230 -> 14,338 gzip on 2026-10-21, the test week (B3 and B2 merged):
  // measured 14,334 plus 4. The settlement takes the audit's count and judges
  // it (settleAudit, in its own chunk) beside the links' CASCADE.
  // 14,338 -> 14,367 gzip on 2026-10-21 (F1 phase 2, #216, draft), measured
  // 14,363 plus 4: a window put down keeps its replay trail in the save
  // (normalizeSuspendedWindow), so the trail goes on after the resume.
  // +708 / +390 on 2026-10-22 (F1 phase 3, S3, draft): the case-open snapshot
  // (createCaseOpen, normalizeCaseOpen, stampCaseOpen, createCaseClose).
  // 14,757 -> 14,761 gzip on 2026-10-24 (f1-s7 on efba1927): measured 14,757,
  // at the ceiling, plus 4; the chunk's imports name hashed files that change under it.
  // 37,870 / 14,367 -> 35,483 / 13,311 on 2026-10-23, Vite 8 (#225, the
  // user's choice 1): measured 35,483 / 13,307 in the e2e build on main
  // 5adcbb5 with lucide-react 1.60 installed (npm ci), the gzip plus 4.
  // Rolldown and Oxc write it smaller than Rollup and esbuild did (35,399 /
  // 13,275 against 37,136 / 14,333 on the main of 2026-10-21).
  // 38,578 / 14,761 (main) -> 36,757 / 13,658 on 2026-10-24, Vite 8 (#225)
  // rebased on main 239e615e (#240): measured 36,757 / 13,654 in the e2e
  // build, the gzip plus 4. The case-open snapshot is in it; Rolldown and Oxc
  // still write it smaller than Rollup and esbuild did.
  // 36,757 / 13,658 -> 36,762 / 13,661 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 36,762 / 13,657 in the e2e build, the gzip plus 4. the settlement asks the case's rules (settleAudit, describeLinkMade); the gzip is under main's.
  // 36,757 / 13,658 -> 38,649 / 14,453 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 38,649 -> 38,654 raw on 2026-10-26, 영어판 3단계: only the names of the chunks it imports. Measured in the e2e build.
  // 39,663 / 14,647 -> 39,883 / 14,795 on 2026-10-28, lang-full: the reading clock counts an English page by words and a
  // Japanese one by characters at 0.89 (readingUnits). Measured 39,879 / 14,791.
  // 14,795 -> 14,836 gzip on 2026-11-02, bgm-variety over main c680ddd5 (#389): no code changed (raw 39,879 as main); the entry's
  // export names it imports shifted with the music's new exports. Measured 14,832 gzip in the e2e build, the gzip plus 4.
  // 39,883 -> 39,889 raw on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): the settlement asks the case's rules (settleAudit, describeLinkMade); the gzip stays under its line. Measured 39,889 in the e2e build.
  // 14,795 -> 14,801 gzip on 2026-10-30, C-1 reading axis (#307) merged with #224 0d29141a (the English bank rail at 360px): only the chunk names it imports. Measured 14,797, the gzip plus 4.
  // 36,762 / 13,661 -> 37,518 / 14,105 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7:
  // measured 37,518 / 14,101 in the e2e build, the gzip plus 4. The engine
  // takes the relic catalogue's new copy (relics.js lands here as well),
  // 「고점 판」 and 「숨 고르기」 (applyPeak, the pass's re-deal) and TESTIMONY's half pot.
  // 39,889 / 14,795 -> 40,661 / 15,278 on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): applyPeak, the pass's re-deal, TESTIMONY's half pot and the new tools' rules, on #224's audit and links. Measured 40,661 / 15,274. Measured in the e2e build, the gzip plus 4.
  // 36,762 / 13,661 -> 37,332 / 13,864 on 2026-10-25, c3-c4-rules (C-3 and C-4, RULES_MARK 4) on #224 0c989ba7: measured
  // 37,332 / 13,860 in the e2e build, the gzip plus 4. The streak held on a
  // direction (logicStreak.js's getLogicDirection and getEffectLean) and the
  // pre-C-3 hold set aside in upgradeRunRecord.
  // 39,889 / 14,795 -> 40,464 / 15,007 on 2026-10-29, c3-c4-rules (C-3, C-4, RULES_MARK 4) merged with #224 602ec69b: getLogicDirection and getEffectLean, upgradeRunRecord's pre-C-3 hold. Measured 40,464 / 15,003, the gzip plus 4 in the e2e build.
  // 40,661 / 15,278 -> 41,229 / 15,497 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): applyPeak and the new tools on getLogicDirection. Measured 41,229 / 15,493 in the e2e build, the gzip plus 4, the raw the measurement.
  // -> 41,229 / 15,499 on 2026-10-30, 통합 리허설 (#379) over #224 0d29141a (the English bank rail at 360px) with #307 #316 #320 #308. Measured 41,229 / 15,495 in the e2e build, the gzip plus 4.
  // 14,795 -> 14,801 gzip on 2026-10-30, #224 merged with main b2558d55: measured 14,797 in the e2e build (the code is the same; the names of the chunks it imports moved), the gzip plus 4.
  // 39,889 / 14,801 (#224) -> 40,464 / 15,006 on 2026-11-02, C-3·C-4 rules (#320) merged with #224 8dd649ce (main b2558d55). Measured 40,464 / 15,002 in the e2e build, the gzip plus 4.
  // 40,464 / 15,006 -> 40,464 / 15,050 on 2026-11-02, #320 c3-c4-rules merged with #224 c29c2efd (main 9be94346). Measured raw under / 15,046 in the e2e build, the gzip plus 4.
  // 39,889 / 14,801 (#224) -> 40,661 / 15,278 on 2026-11-02, table-rhythm-bundle (#316) merged with #224 8dd649ce (main b2558d55). Measured 40,661 / 15,274 in the e2e build, the gzip plus 4.
  // 40,661 / 15,278 -> 40,661 / 15,326 on 2026-11-02, #316 table-rhythm-bundle merged with #224 c29c2efd (main 9be94346). Measured raw under / 15,322 in the e2e build, the gzip plus 4.
  // 39,889 / 14,836 -> 39,889 / 14,842 on 2026-11-02, #307 c1-reading-axis merged with #224 c29c2efd (main 9be94346). Measured raw under / 14,838 in the e2e build, the gzip plus 4.
  // 39,883 / 14,836 -> 43,635 / 16,377 on 2026-11-02, locale-gaps (#393) over main 9be94346: the run's lines (route labels, restore, minutes, the far callbacks) read src/copy/runLines.js and src/copy/farCallbacks.js. Measured 43,631 / 16,373 in the e2e build, the plus 4.
  // 43,635 / 16,377 -> 44,126 / 16,529 on 2026-11-02, money-feedback over main acf3d999: the run's lastChange, seasonGained and seasonLost. Measured 44,122 / 16,525, the plus 4.
  // 44,126 -> 44,131 raw on 2026-11-03, week-board-after over main 36104abd: no code changed; the export names it imports from weeklyRules shifted with weekBoardsAt. Measured 44,127, the plus 4.
  // 44,126 / 16,529 -> 44,132 / 16,529 on 2026-11-03, #224 merged with main 465ccb93 (#391 #389 #390 #393 #388): the settlement's audit and link reads beside main's run lines. Measured 44,132 raw (gzip under 16,529) in the e2e build.
  // 44,132 / 16,529 -> 44,896 / 16,998 on 2026-11-03, #316 table-rhythm-bundle merged with #224 c55d71e1 (main 465ccb93): the table rhythm's run reads beside #224's settlement and main's run lines. Measured 44,896 / 16,994 in the e2e build, the gzip plus 4.
  // 44,132 / 16,529 -> 44,132 / 16,535 on 2026-11-03, #224 merged with main cb904fb6 (#392 #398): only the chunk names it imports. Measured 16,531 gzip (raw under 44,132) in the e2e build, the gzip plus 4.
  // 44,132 / 16,529 -> 44,704 / 16,734 on 2026-11-03, #320 c3-c4-rules merged with #224 c55d71e1 (main 465ccb93): C-3's direction streak beside #224's settlement and main's run lines. Measured 44,704 / 16,730 in the e2e build, the gzip plus 4.
  // 44,896 / 16,998 -> 45,465 / 17,217 on 2026-11-03, 통합 리허설 (#379) over #224 30f5519d (main bb492d5d) with #307 #316 #320 #308: the four branches' lines together. Measured 45,465 / 17,213 in the e2e build, the gzip plus 4.
  // 44,131 / 16,529 -> 45,469 / 17,220 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 45,465 / 17,216 in the e2e build, the plus 4.
  // 16,529 -> 16,577 gzip on 2026-11-05, tab-title-situation over main 24af89d7: no code changed here (raw 44,127); the table's tab block left src/copy/table.js and the chunk names it imports shifted. Measured 16,573 gzip in the e2e build, the gzip plus 4.
  // 44,131 / 16,529 -> 45,193 / 16,847 on 2026-11-05, kd-spend-engine over main 2bd9a8ba (C9 PR 1): the KD은행 계좌 pays at the draft -- rerollRelicOffer and buyExtraRelic (RELIC_REROLL_COST 4,000, RELIC_EXTRA_COST 12,000, once each a case), the relicDraft record and seasonSpent in the run state, blocked in practice and story mode. Measured 45,189 / 16,843 in the e2e build, the plus 4.
  // 44,131 / 16,529 -> 46,432 / 17,345 on 2026-11-05, kd-spend-ui over main 2bd9a8ba (C9 PR 2, on PR 1 66bdce6a): the KD은행 계좌 pays at the draft -- rerollRelicOffer and buyExtraRelic (RELIC_REROLL_COST 4,000, RELIC_EXTRA_COST 12,000, once each a case), the relicDraft record and seasonSpent in the run state, blocked in practice and story mode (PR 1), and readDraftSpend (src/gauntlet/draftSpend.js): each button's open or closed state and its one reason (PR 2). Measured 46,428 / 17,341 in the e2e build, the plus 4.
  // 46,432 / 17,345 -> 46,526 / 17,396 on 2026-11-05, kd-spend-ui hint over main 2bd9a8ba: the Korean line under the draft's note (src/copy/relics.js spendHint, which this chunk carries). Measured 46,522 / 17,392 in the e2e build, the plus 4.
  // 16,529 -> 16,554 gzip on 2026-11-05, scout-narrow over main 8ac59b71: SCOUT costs 믿음 1 (B1, 11-05 decision (1)): SCOUT_TRUST, `applyGauntletEffect`'s `scouted` and the verdict's `scouted` (raw 44,119, under). Measured 44,119 / 16,550 in the e2e build, the gzip plus 4.
  // 44,131 / 16,529 -> 44,750 / 16,759 on 2026-11-05, stake-clock over main e68fe8cc: the stake clock (src/gauntlet/stakeClock.js: decisionWindowSeconds, stakeTier), the board's stakeClock mark, advanceClock reading the tick tier by tier and a push that runs the clock out. Measured 44,746 / 16,755 in the e2e build, the plus 4.
  // 45,469 / 17,220 -> 48,539 / 18,413 on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): C9's rerollRelicOffer, buyExtraRelic and the draft record beside C-7's breather (a pass on a paid draft is a choice, 11-05 decision), the stake clock in advanceClock and the push, SCOUT's trust price. Measured 48,535 / 18,409 in the e2e build, the plus 4.
  // 45,469 / 17,220 -> 48,539 / 18,409 on 2026-11-06, bundle-1106a after merging main e1f5e515 (#463 bundle-rules2: C9 spend, 11px, B1 scout, B5 stake clock): the two sides' lines together. Measured 48,535 / 18,405 in the e2e build, the plus 4.
  // 48,539 / 18,409 -> 49,605 / 18,880 on 2026-11-10, enja-text-check (E4) over main e7ccb410: the recovery center's, the session code copy's and the remote-save queue's words moved out of the components into src/copy/runLines.js (`recoveryCenter`, `copyStatus`, `queue`), which this chunk carries. Measured 49,601 / 18,876 in the e2e build, the plus 4.
  // 49,605 / 18,880 -> 49,605 / 18,891 c4c5-copy over main 7ec2304e. Measured - / 18887 (over budget only) in the e2e build, the plus 4.
  { pattern: /^gauntletEngine-.*\.js$/, maxBytes: 49_605, maxGzip: 18_891 },
  // The season's result card: the two buttons at the ending, the card's
  // model and the canvas code that draws it, in one chunk the ending asks for
  // when it opens. 8,271 / 3,996 on 2026-10-09, plus 5%. The buttons are in
  // here and not in the report's chunk because that chunk had 181 gzip bytes
  // left (14,219 of 14,400); what the report's chunk carries for the card is
  // the import and the four fields it hands over.
  // 4,200 -> 4,209 gzip on 2026-10-19, measured 4,205 plus the 4 bytes of hash
  // noise the tableAudio line allows: the chunk's own code did not change, it
  // gained one more `import "./weeklyRules-<hash>.js"` (이번 주의 규칙 has a
  // chunk of its own, below). The raw budget does not move.
  // 4,209 -> 4,210 on 2026-10-20: 4,204-4,210 over eight builds, the hashes'.
  // 4,209 -> 4,228 gzip on 2026-10-20, measured 4,224 plus 4, for the same
  // reason: one more `import "./auditRisk-<hash>.js"` (B3's audit, below).
  // 4,210 -> 4,228 on 2026-10-21 (B2, #208, draft), measured 4,224 plus 4
  // (main 4,207): one more `import "./cascadeRisk-<hash>.js"`; its code did not change.
  // 8,690 / 4,229 -> 8,711 / 4,246 on 2026-10-21, the test week: both
  // imports, auditRisk's and cascadeRisk's, measured 8,711 / 4,242 plus 4.
  // 8,711 / 4,246 -> 8,745 / 4,261 on 2026-10-21 (F1 phase 2, #216, draft),
  // measured 8,745 / 4,257 plus 4: one more import, the replay trail's chunk.
  // 8,745 / 4,261 -> 8,853 / 4,290 on 2026-10-23 (table-readouts, #246,
  // draft), measured 8,853 / 4,286 plus 4: the card prints 사건당 금고 (C-1 (3))
  // beside the 논리 유지력. The words come from the report (score.vaultLine);
  // the card reads one string and draws it.
  // 8,745 / 4,261 -> 8,780 / 4,280 for ops-measure (2026-10-23), measured
  // 8,780 / 4,276 plus 4: one more import, sceneChoices (E-6); its code did not change.
  // [batch-c] second-season (#261) on 묶음 A:
  // 8,745 / 4,261 -> 8,801 / 4,287 on 2026-10-23 (second-season, draft),
  // measured 8,801 / 4,283 plus 4: E-5, the card's corner and the shared
  // line's tail are strings the result side hands in (secondSeason.getSeasonCard).
  // -> 8,836 / 4,310 on 2026-10-23, 10-23 묶음 C 합친 상태 실측 (#261 on 묶음 A):
  // measured 8,836 / 4,306 in the e2e build, the gzip plus 4.
  // [batch-c] 묶음 B (#277):
  // Batch B merged on batch A (2026-10-23), measured in the e2e build, the
  // gzip plus 4: the entries above were each measured on its own base.
  // -> 8,944 / 4,338 on 2026-10-23, 묶음 C (A + B + #261 + #272) 합친 상태 실측: measured
  // 8,944 / 4,334 in the e2e build (the larger of two builds), the gzip plus 4.
  // 8,944 / 4,338 -> 8,432 / 4,054 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 8,432 / 4,050 in the e2e build, the gzip plus 4.
  // 8,432 / 4,054 -> 8,659 / 4,168 on 2026-10-26, 영어판 3단계: the card's words and the copied line read by key (src/copy/resultCard.js, resultCardDraw.js). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 8,659 / 4,168 -> 8,787 / 4,224 on 2026-11-05, result-card-habit over main 3ca15f8d: D1, the habit's sentence drawn on the label's line and copied after the shared line, as two fields (habitLine, dnaTitle) handed in worded (resultCardModel.js, resultCard.js). Measured 8,783 / 4,220 in the e2e build, the plus 4.
  // 8,787 / 4,224 -> 8,959 / 4,325 on 2026-11-12, c2c3-result over main fbf1000c (C2-1 nearest ending, C3-3 card line, C3-4 witness paragraph). Measured 8955 / 4321 (over budget only) in the e2e build, the plus 4.
  { pattern: /^ResultCardShare-.*\.js$/, maxBytes: 8_959, maxGzip: 4_325 },
  // What a run and its report read about the analyst, the ending and the
  // record (src/runtimeSystems.js). It was in the entry chunk, inside
  // advancedSystems.js, where the screen before a run never called it: taking
  // it out took the entry chunk from 169,332 / 61,055 to 162,396 / 58,367 on
  // 2026-10-11. It is a file of its own, loaded beside the runtime, because
  // the runtime's chunk had 667 gzip bytes left and this is 2,600 inside it
  // (OWN_CHUNKS in vite.config.js). 7,103 / 3,633, plus 5%.
  // -> 6,994 / 3,548 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 6,994 / 3,544 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (7,084 / 3,621 on the same commit).
  // 6,994 / 3,548 -> 7,006 / 3,557 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 7,006 / 3,553 in the e2e build, the gzip plus 4.
  // 7,006 / 3,557 -> 8,451 / 3,981 on 2026-10-26, 영어판 3단계: its words (src/copy/seasonEnd.js: the ending scenes and names, the collapse's cause, the authority review, the aftermath) grouped with it in vite.config.js. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 3,989 -> 4,000 gzip on 2026-10-29, E-11 번외 사건 온라인 저장 (draft) restacked on e11-side01 7a6e26f8: only the chunk names it imports. Measured 8,487 / 3,996, the gzip plus 4.
  // 8,487 / 3,989 -> 8,487 / 4,002 on 2026-11-02, #308 d2-hall-of-fame merged with #224 c29c2efd (main 9be94346). Measured raw under / 3,998 in the e2e build, the gzip plus 4.
  // 3,989 -> 3,998 gzip on 2026-11-05, tab-title-situation over main 24af89d7: the raw bytes are the same (8,487); the chunk names it imports. Measured 3,994 gzip in the e2e build, the gzip plus 4.
  { pattern: /^runtimeSystems-.*\.js$/, maxBytes: 8_487, maxGzip: 4_002 },
  // The season's copy between and around cases (src/caseCopy.js): the
  // next-case teasers and interludes, chapter rules, rank legacy lines and
  // 에코's opening lines. It was in the runtime's chunk, which had 255 gzip
  // bytes left (175,845 of 176,100) on 2026-10-14; it is fetched beside the
  // runtime the same way runtimeSystems is (CASE_COPY in
  // vite.config.js), so nothing loads later than it did. Taking it out left the
  // runtime's ceiling where it was, for the changes that were waiting on it.
  // 108,233 / 34,828, plus 5%.
  // -> 108,190 / 34,757 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 108,190 / 34,753 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (108,206 / 34,759 on the same commit).
  // 108,190 / 34,757 -> 109,685 / 35,248 on 2026-10-23, rebased on main
  // 5adcbb5: measured 109,685 / 35,244, the gzip plus 4, raised by what it
  // lacked. The 1,495 bytes are main's copy since 2026-10-21 (main's budget
  // is 113,650 / 36,570); the bundler writes the strings as they are.
  // 109,685 / 35,248 -> 109,685 / 35,690 on 2026-10-24, rebased on main
  // 3d43a239: measured 107,213 / 35,686 in the e2e build (two builds, the
  // same), the gzip plus 4. The copy is main's since 5adcbb5 (main's budget is
  // 113,650 / 36,570); the raw bytes stay under what they were.
  // 109,685 / 35,690 -> 107,213 / 35,690 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 107,213 / 35,686 in the e2e build, the gzip plus 4.
  // 107,213 / 35,690 -> 107,220 / 35,694 on 2026-10-24, B-9 감정 배합 on main
  // b0eb9cb0: the 사건 43 막간 now reads the names on the cup-noodle lid
  // (+7 raw); measured 107,220 / 35,690 in the e2e build, the gzip plus 4.
  // -> 107,276 / 35,735 on 2026-10-25, 묶음 시대고증(#313): the interludes'
  // 접수 알림음·봉인 테이프·출력본 and the routes. Measured 107,276 / 35,731,
  // the gzip plus 4.
  // 107,276 / 35,735 -> 107,413 / 35,886 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 107,413 -> 107,420 raw on 2026-11-03, canon-fixes-1 over main 36104abd: the canon fixes' Korean, English and Japanese lines (the role of 가온정밀's CEO, keyed by its Korean, names its address in both dictionaries; the 사건 29→30 interlude). Measured 107,416 in the e2e build, the plus 4; the gzip is under its line.
  // 107,420 / 35,886 -> 107,426 / 35,892 on 2026-11-04, canon-a044 over main 7ddced5f: A044, 사건 26's 32억 goes to 해온파트너스와 같은 주소의 새 법인 in Korean, English and Japanese, and 사건 29's premise says 그리고 지금. Measured 107,422 / 35,888 in the e2e build, the plus 4.
  // 107,426 / 35,892 -> 107,667 / 35,994 c4c5-copy over main 7ec2304e. Measured 107663 / 35990 (over budget only) in the e2e build, the plus 4.
  { pattern: /^caseCopy-.*\.js$/, maxBytes: 107_667, maxGzip: 35_994 },
  // The table's sound (src/gauntlet/gauntletAudio.js). It was in the
  // PlayScreen chunk, which stood at 104,323 of 104,200 on 2026-10-19 when two
  // changes that each fitted were merged together; it is fetched with the table
  // (TABLE_AUDIO in vite.config.js), so nothing loads later than it did.
  // Taking it out took PlayScreen to 97,898 / 32,131. 6,676 / 2,166 measured.
  // -> 6,512 / 2,129 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 6,512 / 2,125 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (6,700 / 2,198 on the same commit).
  // 6,512 / 2,129 -> 6,512 / 2,134 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 6,512 / 2,130 in the e2e build, the gzip plus 4. not changed here: the imports' hashed names, one gzip byte.
  // 6,512 / 2,129 -> 6,538 / 2,143 on 2026-11-05, collapse-staging over main c569cb99: the bust's stop (A2) -- the slam's third line in three languages, the heart stopped on the frame (fxVariables, the pulse reads —) and the drone's slower let-down (gauntletAudio). Measured 6,534 / 2,139 in the e2e build, the plus 4.
  // -> 6,538 / 2,142 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 6,534 / 2,138 in the e2e build, the plus 4.
  { pattern: /^tableAudio-.*\.js$/, maxBytes: 6_512, maxGzip: 2_134 },
  // The other players' wall rate on the scene page (improvement notes D3):
  // src/state/useSceneBustRates.js and src/sceneTraces.js. Written into the
  // PlayScreen chunk they added about 945 / 441 bytes to it on 2026-10-19,
  // more than its 104,200 / 34,300 budget left before tableAudio came out; it
  // is fetched with the table (SCENE_TRACES in vite.config.js), so the line
  // appears when it did. PlayScreen carries only the import, 141 / 54.
  // 1,054 / 652 measured, plus the 4 bytes tableAudio was given for the
  // hashed file names it imports.
  // 1,058 / 656 -> 989 / 619 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 989 / 615 in the e2e build, the gzip plus 4.
  // 989 / 619 -> 998 / 619 on 2026-11-02, locale-gaps (#393) over main 9be94346: the scene's wall line read from src/copy/sceneRates.js. Measured 994 raw (gzip under 619) in the e2e build, the plus 4.
  // 989 -> 990 raw on 2026-10-29, E-11 번외 사건 온라인 저장 (draft) restacked on e11-side01 7a6e26f8: only the chunk names it imports. Measured 990 / 614.
  { pattern: /^sceneTraces-.*\.js$/, maxBytes: 998, maxGzip: 619 },
  // The other players' card share under the decision reveal (E-6, 2026-10-22):
  // src/state/useSceneChoiceRates.js and src/sceneChoices.js, the frame of
  // sceneTraces above (SCENE_CHOICES in vite.config.js). 1,216 / 724
  // measured, plus 4 each for the hashed names.
  // 1,220 / 728 -> 1,143 / 680 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 1,143 / 676 in the e2e build, the gzip plus 4.
  // 1,143 / 680 -> 1,175 / 680 on 2026-11-02, locale-gaps (#393) over main 9be94346: the pick-rate lines read from src/copy/sceneRates.js. Measured 1,171 raw (gzip under 680) in the e2e build, the plus 4.
  // 1,143 -> 1,144 raw on 2026-10-29, E-11 번외 사건 온라인 저장 (draft) restacked on e11-side01 7a6e26f8: only the chunk names it imports. Measured 1,144 / 674.
  { pattern: /^sceneChoices-.*\.js$/, maxBytes: 1_175, maxGzip: 680 },
  // 이번 주의 규칙 (2026-10-19), split off the entry chunk so the entry stays
  // under its budget: the rules and their words (src/gauntlet/weeklyRules.js),
  // shared by the runtime, the engine and the views below, and the start
  // screen's line and the ranking's two boards (WeeklyRuleViews.jsx), fetched
  // only in a week the calendar has (WeeklyRuleNotice.jsx). The entry keeps
  // the calendar, the clock and the device's choice. Each at what it measured
  // (1,141 / 715 and 1,662 / 909), the gzip with the 4 bytes of hash noise.
  // weeklyRules 1,141 -> 1,142 on 2026-10-20: HEAVY FRACTURE's "1.75배로"
  // (check:text) is one UTF-8 byte longer than "×1.75로".
  // 1,142 / 719 -> 1,159 / 738 on 2026-10-21, measured 1,159 / 734: NEAR WALL
  // says what the 4 is, 벽 띠가 열기 4만큼 앞당겨 선다 (+17).
  // 1,141 / 719 -> 1,552 / 957 on 2026-10-19, measured 1,552 / 953 plus the
  // hash noise: B3's AUDIT is a week's device, so its entry, its line, its
  // four numbers, the allowlist of devices and the check that reads it live
  // here. Cut first: its numbers were imported from tableRules.js, which
  // pulled that whole module into this chunk (2,033 / 1,246), and the line
  // lost its first sentence; the HUD's and the voice's words are in the
  // table's own chunk (tableMeters.js, tableVoice.js).
  // Rebased on main e8584c3 (2026-10-21): main's 1,159 (#212) plus B3's 411,
  // measured 1,570 / 969 in the e2e build, the gzip plus 4.
  // audit's own chunk (auditRisk, below).
  // 1,159 / 738 -> 1,560 / 966 on 2026-10-21 (B2, #208, draft), measured
  // 1,560 / 962: the cascade week (B2's test week, a device), its line, the
  // list of devices a week may switch on and the check that reads it.
  // 1,570 / 973 -> 2,051 / 1,160 on 2026-10-21, the test week: both weeks'
  // devices and lines, and W44's rule, which says the two lines again behind
  // one sentence of its own (they are written once and shared, 232 raw bytes
  // less than written out). Measured 2,051 / 1,156, the gzip plus 4.
  // 2,051 / 1,160 -> 2,104 / 1,179 on 2026-10-21: W44's line says that a
  // cash on a CASCADE board is not counted by the audit (B2 decision 10).
  // Measured 2,104 / 1,175, the gzip plus 4.
  // 2,104 / 1,179 -> 2,704 / 1,450 for ops-measure (2026-10-23), measured
  // 2,704 / 1,446 plus 4: E-9's SHORT CLOCK (its entry, its two numbers, the
  // overlay's relative clock and chips) and each event rule's line in the
  // story.
  // 2,704 / 1,450 -> 2,634 / 1,403 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 2,634 / 1,399 in the e2e build, the gzip plus 4.
  // 2,634 / 1,403 -> 2,315 / 1,303 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 2,315 / 1,299 in the e2e build, the gzip plus 4. the audit's numbers and the audit and cascade weeks left it; W47's line stays, written out.
  // 2,634 / 1,403 -> 2,636 / 1,403 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 2,636 in the e2e build.
  // 2,636 -> 2,637 raw on 2026-10-26, pwa-install-hint: only by the chunk names it imports. Measured 2,637 / 1,398.
  // 2,637 / 1,403 -> 3,215 / 1,600 on 2026-10-26, 영어판 3단계 (N1): the catalogue's words read by key (src/copy/weekRules.js, in this chunk), their numbers filled in from the constants when a rule is read. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 3,215 / 1,600 -> 3,360 / 1,671 on 2026-11-03, week-board-after over main 36104abd: weekBoardsAt, this week's board and last week's for the seven days after it (W47 점검 P9). Measured 3,356 / 1,667 in the e2e build, the plus 4.
  { pattern: /^weeklyRules-.*\.js$/, maxBytes: 3_360, maxGzip: 1_671 },
  // WeeklyRuleViews 1,662 / 913 -> 1,796 / 966 on 2026-10-22, the test week
  // moved to W47 right after W46's NEAR WALL: this week's line says the next
  // week's rule after it (gauntlet/weeklyRuleLine.js, in this chunk so the
  // weeklyRules chunk above stays as it was). Measured 1,796 / 962, the gzip
  // plus 4.
  // 1,796 / 966 -> 2,081 / 1,077 for ops-measure (2026-10-23, on main
  // 2c7b535), measured 2,081 / 1,073 plus 4: E-8's line and box for a first
  // season and E-9's line in the story before the rule, beside main's next
  // week's notice in the same line.
  // 2,081 / 1,077 -> 1,995 / 1,051 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 1,995 / 1,047 in the e2e build, the gzip plus 4.
  // 1,995 / 1,051 -> 1,996 / 1,051 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 1,996 in the e2e build.
  // -> 1,056 gzip on 2026-10-25 (개인정보처리방침·이용약관): measured 1,052, the
  // entry chunk's export names it imports by, plus 4; the file did not change.
  // 1,996 / 1,056 -> 2,176 / 1,138 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 2,176 / 1,138 -> 2,537 / 1,280 on 2026-10-26, 영어판 3단계: the start screen's line read by key, and the rules' words by id (src/copy/weekRule.js `line`, `rules`). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 2,537 / 1,280 -> 3,223 / 1,436 on 2026-11-06, w47-rule-line over main e1f5e515: the test week (W47) told as a board of its own, since #461 made 감사·연쇄 rules of the table (src/copy/weekRule.js `line.testWeek`, the two box labels; ko/en/ja). Measured 3,219 / 1,432 in the e2e build, the plus 4.
  { pattern: /^WeeklyRuleViews-.*\.js$/, maxBytes: 3_223, maxGzip: 1_436 },
  // Its panel on a case's opening page (src/gauntlet/WeekRulePanel.jsx,
  // WEEK_RULE_PANEL in vite.config.js), taken out of the PlayScreen chunk on
  // 2026-10-20 and fetched with it. 801 / 511 measured, the gzip plus 4.
  // 801 / 515 -> 1,271 / 648 on 2026-10-21, measured 1,271 / 644, the gzip
  // plus 4: the NEW GAME+ line's panel on the same page, above the week's
  // rule, kept out of the PlayScreen chunk the same way.
  // 801 / 515 -> 897 / 562 for the ops-measure draft (2026-10-22), measured
  // 897 / 558 plus 4: E-9's line in the story, printed and read by the clock.
  // -> 1,378 / 695 on 2026-10-23, 10-23 묶음 A 합친 상태 실측: the NEW GAME+
  // panel (#220) and E-9's line (#256) together, measured 1,378 / 691, the
  // gzip plus 4. -> 1,387 / 706 the same day, measured 1,387 / 702: the
  // NEW GAME+ line raised under the title strip (`order: -1`).
  // [batch-c] second-season (#261) on 묶음 A:
  // 1,271 / 648 -> 1,442 / 722 on 2026-10-22 (second-season, draft), measured
  // 1,442 / 718 plus 4: a NEW GAME+ case's first page also carries the grey
  // line on how the last season closed it (secondSeason.getCaseRecall).
  // 1,442 / 722 -> 1,838 / 916 on 2026-10-23 (second-season, draft), measured
  // 1,838 / 912 plus 4: E-1, a NEW GAME+ scene read the season before opens
  // folded and one none read is marked NEW (useSceneFold), kept out of the
  // PlayScreen chunk the same way.
  // -> 1,954 / 977 on 2026-10-23, 10-23 묶음 C 합친 상태 실측 (#261 on 묶음 A):
  // measured 1,954 / 973 in the e2e build, the gzip plus 4.
  // -> 2,460 / 1,158 on 2026-10-24 (B-14(1) 지난 시즌의 당신): `pastPick`, the
  // tag on the card the season before picked and the wild card's words (its
  // burn line moved here with them). Measured 2,460 / 1,154 in the e2e build,
  // the gzip plus 4.
  // 2,460 / 1,158 -> 2,304 / 1,114 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 2,304 / 1,110 in the e2e build, the gzip plus 4.
  { pattern: /^WeekRulePanel-.*\.js$/, maxBytes: 2_304, maxGzip: 1_114 },
  // The office's noise at the table's edge (개선 포인트 A5,
  // src/gauntlet/EdgeNotice.jsx, EDGE_NOTICE in vite.config.js), a file of its
  // own from the start and fetched with the table. Its style is inline, so no
  // stylesheet grows. 1,794 / 1,194 measured on 2026-10-21, the gzip plus 4;
  // 3,779 / 2,166 on 2026-10-22, when the two senders became nine acts' pairs
  // (B-15: eighteen senders, thirty-six lines) and the act is read off
  // CASE_SEQUENCE.
  // -> 3,786 / 2,180 on 2026-10-23, 10-23 묶음 A 합친 상태 실측 (measured
  // 3,786 / 2,176, the gzip plus 4): the notice moved from over the scene's
  // title to just above the action bar. -> 3,970 / 2,289 the same day,
  // measured 3,970 / 2,285, the gzip plus 4: the bar's top is read when the
  // notice is drawn (its buttons wrap with the font; at a fixed 96px the
  // notice covered 밀기 in CI). -> 4,133 / 2,368 the same day, measured
  // 4,133 / 2,364, the gzip plus 4: the bar is watched while the notice is up,
  // and the notice slides in from the left edge, not up over the bar.
  // -> 11,705 / 5,445 on 2026-10-24 (edge-per-case), measured 11,705 / 5,441
  // on main 5ea63bf, the gzip plus 4: the nine acts' pairs became one pair
  // per case (B-15, the user's decision: 55 messengers and 55 mails, 220
  // lines), and CASE_SEQUENCE is no longer read here.
  // 11,705 / 5,445 -> 11,609 / 5,405 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 11,609 / 5,401 in the e2e build, the gzip plus 4.
  // 11,609 / 5,405 -> 11,682 / 5,448 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  { pattern: /^EdgeNotice-.*\.js$/, maxBytes: 11_682, maxGzip: 5_448 },
  // The act title card (src/gauntlet/ActCard.jsx with actCardCopy.js, B-11(1)
  // 막 표지), 2026-10-24: eight acts' names and sentences, the count to the
  // season's end and the dialog, fetched by the PlayScreen chunk's fold only
  // on an act's first case. Measured 2,698 / 1,538 on main da6292be, the gzip plus 4.
  // 2,698 / 1,542 -> 2,952 / 1,675 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  { pattern: /^ActCard-.*\.js$/, maxBytes: 2_952, maxGzip: 1_675 },
  // The reading clock's one question (src/gauntlet/ReadingClockAsk.jsx,
  // READING_CLOCK_ASK in vite.config.js), 2026-10-22: 프롤로그 01-02 start held
  // and the first page the clock would open asks instead (A-11 = D-4).
  // Measured 1,348 / 775 in the e2e build, the gzip plus 4.
  // 10-23 묶음 A 합친 상태 실측: 1,348 / 782 (its imports name hashed files),
  // the gzip plus 4.
  // 1,348 / 786 -> 1,272 / 755 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 1,272 / 751 in the e2e build, the gzip plus 4.
  { pattern: /^ReadingClockAsk-.*\.js$/, maxBytes: 1_272, maxGzip: 755 },
  // B-3(1) 냉정한 오프닝's page (src/components/ColdOpening.jsx) and its own
  // stylesheet (ColdOpening.css), loaded only when a first-time device presses
  // 시작; in the build since 2026-11-10, cold-opening-style (#477) switched the
  // page on over main cb8346da. Measured 3,440 / 2,002 and 1,394 / 566 in the
  // e2e build, the plus 4. Switched off, neither file is emitted.
  { pattern: /^ColdOpening-.*\.js$/, maxBytes: 3_444, maxGzip: 2_006 },
  { pattern: /^ColdOpening-.*\.css$/, maxBytes: 1_398, maxGzip: 570 },
  // B3's audit (src/gauntlet/auditRisk.js, AUDIT_RISK in vite.config.js): its
  // count, its judgement, the table's reading and its words, out of the
  // engine's chunk (14,417 of 14,200 with it, 14,186 without) and the table's
  // on 2026-10-20. 1,680 / 938 measured, the gzip plus 4. 1,917 / 1,044 the
  // same day with the table record's audit sentence (describeAuditLedger,
  // user's choice 1): it went here because the result screen's chunk, where
  // the record is drawn, had 157 gzip bytes left and took it to 14,422 of
  // 14,400 even written as a file of its own, and that budget does not go up.
  // Raised by what it measured, the gzip plus 4.
  // 1,917 / 1,048 -> 2,078 / 1,128 on 2026-10-21: a cash on a CASCADE board
  // adds nothing (B2 decision 10), read off the board on the table by the
  // settlement and the 확정 preview and off the log's `environmentMode` by
  // the count. Measured 2,078 / 1,124, the gzip plus 4.
  // -> 1,927 / 1,053 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 1,927 / 1,049 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (2,078 / 1,124 on the same commit).
  // 1,927 / 1,053 -> 1,953 / 1,070 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 1,953 / 1,066 in the e2e build, the gzip plus 4. its numbers came here from weeklyRules, and the case's rules decide whether it counts.
  // 1,927 / 1,053 -> 2,254 / 1,175 on 2026-10-26, 영어판 3단계 (N1): the audit's lines read by key, their words in this chunk (src/copy/audit.js, grouped with it in vite.config.js). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 2,254 / 1,175 -> 2,285 / 1,207 on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): its numbers came here from weeklyRules, the case's rules decide whether it counts, and the record's line reads the case. Measured 2,285 / 1,203, the gzip plus 4 in the e2e build.
  // 1,953 / 1,070 -> 2,121 / 1,148 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7:
  // AUDIT CONTACT's limit (getAuditLimit) in the judgement, the HUD and the
  // record's sentence. Measured 2,121 / 1,144, the gzip plus 4.
  // 2,285 / 1,207 -> 2,440 / 1,282 on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): AUDIT CONTACT's limit (getAuditLimit) in the judgement, the HUD and the record's line on auditCopy. Measured 2,440 / 1,278. Measured in the e2e build, the gzip plus 4.
  // 1,953 / 1,070 -> 2,085 / 1,102 on 2026-10-25, c3-c4-rules (C-3 and C-4, RULES_MARK 4) on #224 0c989ba7: measured
  // 2,085 / 1,098 in the e2e build, the gzip plus 4. The cases before the
  // audit by the ladder each mark played (사건 02 at 4, 프롤로그 04 at 3).
  // 2,285 / 1,207 -> 2,417 / 1,239 on 2026-10-29, c3-c4-rules (C-3, C-4, RULES_MARK 4) merged with #224 602ec69b: the cases before the audit by the ladder each mark played (사건 02 at 4, 프롤로그 04 at 3). Measured 2,417 / 1,235, the gzip plus 4 in the e2e build.
  // 2,440 / 1,282 -> 2,572 / 1,314 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): AUDIT CONTACT's limit and the ladder's cases before the audit together. Measured 2,572 / 1,310 in the e2e build, the gzip plus 4, the raw the measurement.
  { pattern: /^auditRisk-.*\.js$/, maxBytes: 2_572, maxGzip: 1_314 },
  // B2's links (src/gauntlet/cascadeRisk.js, CASCADE_RISK in vite.config.js),
  // out of the PlayScreen, engine and runtime chunks on 2026-10-20. 322 / 306
  // while a constant switched it off and the build dropped the walk; on
  // 2026-10-21 it is switched by the season's week (`cascade`), so the walk,
  // the reading and the links a case's close carries over are all here:
  // 2,790 / 1,669 measured, the gzip plus 4.
  // 2,790 / 1,673 -> 2,637 / 1,541 on 2026-10-23, Vite 8 (#225, the user's
  // choice 1): measured 2,637 / 1,537 in the e2e build on main 5adcbb5 with
  // lucide-react 1.60 installed (npm ci), the gzip plus 4. Rolldown and Oxc
  // write it smaller than Rollup and esbuild did (2,637 / 1,536 against 2,790
  // / 1,667 on the main of 2026-10-21).
  // 1,541 -> 1,547 gzip on 2026-10-24, rebased on main 3d43a239: measured
  // 2,637 / 1,543, the gzip plus 4 (main's is 2,790 / 1,673).
  // 2,637 / 1,547 -> 2,608 / 1,531 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 2,608 / 1,527 in the e2e build, the gzip plus 4. the case's rules decide whether the links are on.
  // 2,637 / 1,547 -> 2,994 / 1,704 on 2026-10-26, 영어판 3단계 (N1): CASCADE's rule, the link line and the voice's lines read by key, their words in this chunk (src/copy/cascade.js, grouped with it in vite.config.js). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 1,704 -> 1,709 gzip on 2026-11-03 (#397, main cb904fb6 merged in): the code did not change, only the
  // file-name hashes it imports did; CI's Linux build measured cascadeRisk-sMXDqu_n.js at 1,705 (the local
  // Windows build 1,704 as cascadeRisk-DRhkSScz.js), the gzip plus 4. With main 425eb4da merged in, CI
  // measured 1,701 (cascadeRisk-Y5hf3-95.js): the hashes move it 1,701-1,705. The raw budget does not move.
  { pattern: /^cascadeRisk-.*\.js$/, maxBytes: 2_994, maxGzip: 1_709 },
  // The window's replay trail (F1 phase 2, src/gauntlet/windowTrail.js,
  // WINDOW_TRAIL in vite.config.js): the presses the table writes, the record
  // the runtime puts on the decision log entry. 1,376 / 771 measured on
  // 2026-10-21, the gzip plus 4.
  // 1,376 / 775 -> 1,195 / 680 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 1,195 / 676 in the e2e build, the gzip plus 4.
  { pattern: /^windowTrail-.*\.js$/, maxBytes: 1_195, maxGzip: 680 },
  // Whose a speech is and the speaker's first (A-2, src/gauntlet/speakerLine.js,
  // SPEAKER_LINE in vite.config.js), out of the PlayScreen chunk on
  // 2026-10-23. It imports nothing, so no shared chunk is split out with it.
  // 1,203 / 693 measured, the gzip plus 4.
  // 1,203 / 697 -> 1,157 / 654 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 1,157 / 650 in the e2e build, the gzip plus 4.
  // 654 -> 669 gzip on 2026-11-03, caption-split: its sentence cut is now proseSentences.js's, imported from the chunk that holds it rather than written here. Measured 1,153 / 665 in the e2e build, the plus 4.
  // 1,157 / 669 -> 1,056 / 623 on 2026-11-04, caption-split: speechSpans reads proseSentences.js's pairedQuotes instead of its own loop. Measured 1,052 / 619 in the e2e build, the plus 4.
  { pattern: /^speakerLine-.*\.js$/, maxBytes: 1_056, maxGzip: 623 },
  // [batch-c] 묶음 B (#277):
  // The case file's cast and the case's scenes so far (src/gauntlet/CaseCast.jsx
  // and caseCastModel.js, improvement notes D-8 and B-6(2)), fetched the first
  // time the table's case file opens (src/gauntlet/CaseCastFold.jsx, the
  // runtime's), because the PlayScreen chunk had no room for it. Measured with
  // the e2e build, the gzip plus the 4 bytes of hash noise: 2,120 / 1,111 on
  // 2026-10-22, 1,983 / 1,042 on 2026-10-23 once the table handed it its
  // SpeakerPortrait instead of the chunk importing it.
  // Batch B on 2026-10-23 (the day's text and screen branches merged on main
  // 5adcbb5b), measured in the e2e build, the gzip plus 4: the entries above
  // were each measured on its own branch's base.
  // Batch B merged on batch A (2026-10-23), measured in the e2e build, the
  // gzip plus 4: the entries above were each measured on its own base.
  // 1,072 -> 1,077 gzip on 2026-10-23: batch B with batch A's fixes merged
  // measured 1,073 (hash names only), the gzip plus 4.
  // 2,052 / 1,077 -> 1,652 / 907 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 1,652 / 903 in the e2e build, the gzip plus 4.
  { pattern: /^CaseCast-.*\.js$/, maxBytes: 1_652, maxGzip: 907 },
  // E-11 번외 사건: the side screen (src/screens/SideCaseScreen.jsx), fetched the
  // first time a side case is opened from the start screen's slot -- never in a
  // release until a side case is written. The side run and the table come from
  // the runtime's and the play screen's chunks. Measured 4,293 / 1,954
  // 2026-10-25, E-11 번외 사건 틀 (draft, main 7236f80b), the gzip plus 4.
  // 4,293 / 1,958 -> 4,594 / 2,081 on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main 43078a46: the screen's words read by key (src/copy/sideCase.js). The Korean is the same. Measured 4,594 / 2,077, the gzip plus 4.
  { pattern: /^SideCaseScreen-.*\.js$/, maxBytes: 4_594, maxGzip: 2_081 },
  // The locale preload (scripts/locale-preload.mjs, perf-first-visit 2026-11-03): the other languages' first files by name,
  // asked for from the head. Grows with each language's between-cases files; measured 951 raw / 492 gzip with two languages.
  { pattern: /^locale-preload-[0-9a-f]{8}\.js$/, maxBytes: 1_600, maxGzip: 700 },
  // This device's best of each ranking key gone by (src/personalBests.js,
  // improvement note E-7): the move of a retired key's best row to
  // `critical-point-personal-bests`, read once, and the ranking screen's line.
  // In the entry chunk it took that chunk to 171,399 / 61,949 on 2026-10-23;
  // the ranking screen fetches it when it opens. 2,740 / 1,251 measured, the
  // gzip plus 4.
  // 2,740 / 1,255 -> 2,566 / 1,109 on 2026-10-24, #224 (RULES_MARK 3,
  // C-2 and Q25, personal bests) rebased on main cf641639: measured
  // 2,566 / 1,105 in the e2e build, the gzip plus 4. measured under Vite 8 (2,740 / 1,251 under Rollup).
  // 2,566 / 1,109 -> 2,601 / 1,113 on 2026-10-25, C-1(1) on #224 253e8e93:
  // measured 2,601 / 1,109 in the e2e build, the gzip plus 4. One more retired
  // key, v10 (the local ranking moves to v11 with the 판 읽기 axis).
  // 2,566 / 1,109 -> 2,601 / 1,113 on 2026-10-25, c3-c4-rules (C-3 and C-4, RULES_MARK 4) on #224 0c989ba7: measured
  // 2,601 / 1,109 in the e2e build, the gzip plus 4. The v10 key retired (v11).
  { pattern: /^personalBests-.*\.js$/, maxBytes: 2_601, maxGzip: 1_113 },
  // The deferred-stylesheet loader (vite.config.js), a fixed string. 153 bytes.
  { pattern: /^deferred-styles-.*\.js$/, maxBytes: 200, maxGzip: 200 },
  // Rolldown's runtime helpers (Vite 8, #225): the CommonJS wrapper React is
  // read through and the namespace objects the app's dynamic imports return.
  // No codeSplitting group is offered the module, so it is a file of its own
  // that the page preloads (vite.config.js says more). Measured 726 / 429 on
  // 2026-10-21, the gzip plus 4 (the user's choice 1).
  // The other languages (src/locales, 다국어 틀, 2026-10-26): only a page in
  // that language fetches them, the service worker does not warm them, and no
  // Korean page waits on a byte of them. A language's case is the Korean case's
  // words alone; its dictionary is its screen copy (and the screens' tables,
  // src/locales/<lang>/screens); the overlay is the code they share. Measured in
  // the e2e build (English: 사건 01 the largest case), the gzip plus 4.
  // 73,483 / 21,390 -> 73,724 / 21,469 on 2026-10-26, 오진우가 경쟁자가 되는 경위 (ojinwoo-bridge): 사건 01's lead and memo say why he sits across the table, in English too. Measured in the e2e build, the gzip plus 4.
  // 73,724 / 21,469 -> 73,845 / 21,517 on 2026-10-26, 연속성 빈틈 ⑥~⑩ (continuity-rest): 사건 01 says when 한서윤 came as 실장 and why 도윤하 left his window, in English too. Measured in the e2e build, the gzip plus 4.
  // A side case's words (E-11, src/locales/en/nodes/sideNN.js) share this ceiling, like its Korean chunk above: 번외 1 measured 15,378 / 5,679 on 2026-10-29, 번외 3 14,907 / 5,555.
  // A side case's words (E-11, src/locales/en/nodes/sideNN.js) share this ceiling, like its Korean chunk above: 번외 1 measured 15,378 / 5,679 on 2026-10-29.
  // 73,845 / 21,517 -> 67,659 / 19,653 on 2026-11-03, prose-trim-1 (#394): the English of the shorter scenes. 사건 01 measured 67,655 / 19,649 in the e2e build, the plus 4.
  { pattern: /^locale-en-(prologue0[1-5]|case[0-9]{2}|side[0-9]{2}|final)-.*\.js$/, maxBytes: 67_659, maxGzip: 19_653 },
  // Japanese (일본어 1단계, 2026-10-26; hidden, ?lang=ja only): kana and kanji are three bytes each in UTF-8, so a case
  // is larger raw than its English though shorter to read. 사건 01 the largest, 82,376 / 23,101; the dictionary
  // (screen copy, 1,537 lines, and the page's system-font style) 109,813 / 38,565. Measured in the e2e build, the gzip plus 4.
  // 82,376 -> 82,383 on 2026-10-29, lang-terms (일본어판 표기 맞춤): 사건 01 measured 82,379, the raw plus 4.
  // A side case's words (E-11, src/locales/ja/nodes/sideNN.js) share this ceiling, like its Korean chunk above: 번외 1 measured 18,491 / 6,313 on 2026-10-29, 번외 3 16,717 / 5,970.
  // A side case's words (E-11, src/locales/ja/nodes/sideNN.js) share this ceiling, like its Korean chunk above: 번외 1 measured 18,491 / 6,313 on 2026-10-29.
  // 82,383 / 23,105 -> 75,270 / 21,047 on 2026-11-03, prose-trim-1 (#394): the Japanese of the shorter scenes. 사건 01 measured 75,266 / 21,043 in the e2e build, the plus 4.
  { pattern: /^locale-ja-(prologue0[1-5]|case[0-9]{2}|side[0-9]{2}|final)-.*\.js$/, maxBytes: 75_270, maxGzip: 21_047 },
  // 110,001 / 38,601 -> 152,779 / 51,777 on 2026-10-28, lang-full: the Japanese screen copy of English steps three and four
  // (endings, verdicts, board, ranking, week rules, table variants, narration) and 63 more speakers. Measured 152,775 / 51,773.
  // 51,777 -> 51,787 gzip on 2026-10-29, lang-terms (일본어판 표기 맞춤): measured 152,775 / 51,783, the gzip plus 4.
  // 152,779 / 51,787 -> 153,061 / 51,897 on 2026-10-29, gate-reason-copy over main d109b66b: the locked card's condition in Japanese. Measured 153,057 / 51,893, the plus 4.
  // 153,061 / 51,897 -> 153,139 / 51,933 on 2026-10-29, adsense-readiness: the foot's three new links in Japanese. Measured 153,135 / 51,929, the plus 4.
  // 153,139 / 51,933 -> 153,344 / 51,954 on 2026-10-30, ranking-save-copy over main c39870a7: the two ranking save lines in Japanese. Measured 153,340 / 51,950, the plus 4.
  // 152,779 / 51,787 -> 152,864 / 51,822 on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): the Japanese of 프롤로그 04's audit-and-links line, the ranking's intro and past best, the link tag, less the audit and cascade weeks. Measured 152,864 / 51,818, the gzip plus 4 in the e2e build.
  // 153,344 / 51,954 -> 153,429 / 51,974 on 2026-10-30, #224 merged with main 430dda1e: #224's Japanese lines beside main's ranking save lines. Measured 153,429 / 51,970, the gzip plus 4.
  // 152,864 / 51,822 -> 153,252 / 51,972 on 2026-10-29, D2 hall of fame draft (#308) merged with #224 602ec69b: the Japanese of the hall of fame's badge, footnote and data-notice sentence. Measured 153,252 / 51,968 in the e2e build, the gzip plus 4.
  // 153,429 / 51,974 -> 153,817 / 52,123 on 2026-10-30, D2 hall of fame draft (#308) merged with #224 bb70e777 (main 430dda1e): the hall of fame's Japanese lines beside main's. Measured 153,817 / 52,119, the gzip plus 4.
  // 152,864 / 51,822 -> 153,489 / 51,974 on 2026-10-29, c3-c4-rules (C-3, C-4, RULES_MARK 4) merged with #224 602ec69b: the Japanese of 사건 01 to 03's lines, the directions (人・立場の側・中立) and the streak's sentences. Measured 153,489 / 51,970, the gzip plus 4 in the e2e build.
  // 153,429 / 51,974 -> 154,054 / 52,128 on 2026-10-30, C-3·C-4 rules (#320) merged with #224 bb70e777 (main 430dda1e): C-3·C-4's Japanese lines beside main's. Measured 154,054 / 52,124, the gzip plus 4.
  // 152,864 / 51,822 -> 153,405 / 52,077 on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): the Japanese of C-7's tools, 「ひと息つく」, the board marks and the peak case's briefing. Measured 153,405 / 52,073. Measured in the e2e build, the gzip plus 4.
  // 153,429 / 51,974 -> 153,970 / 52,227 on 2026-10-30, table rhythm bundle (#316) merged with #224 bb70e777 (main 430dda1e): the bundle's Japanese lines beside main's. Measured 153,970 / 52,223, the gzip plus 4.
  // 152,864 / 51,822 -> 153,069 / 51,893 on 2026-10-29, C-1(1) (the 판 읽기 axis) merged with #224 602ec69b: the Japanese of the 판 읽기 card (勝負の読み) and its note. Measured 153,069 / 51,889; the raw is the measurement, the gzip plus 4.
  // 153,429 / 51,974 -> 153,634 / 52,037 on 2026-10-30, C-1 reading axis (#307) merged with #224 bb70e777 (main 430dda1e): C-1's Japanese lines beside main's. Measured 153,634 / 52,033, the gzip plus 4.
  // 153,489 / 52,077 -> 154,620 / 52,432 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): the Japanese of all four. Measured 154,620 / 52,428 in the e2e build, the gzip plus 4, the raw the measurement.
  // -> 155,185 / 52,576 on 2026-10-30, 통합 리허설 (#379) over #224 bb70e777 (main 430dda1e). Measured 155,185 / 52,572, the gzip plus 4.
  // 153,344 / 51,954 -> 179,578 / 60,103 on 2026-11-02, locale-gaps (#393) over main 9be94346: the Japanese of every new table (habits, judgment, logic report, scene rates, season lines, play reads, report lines, intro panels, music, run lines, far callbacks). Measured 179,574 / 60,099 in the e2e build, the plus 4.
  // 179,578 / 60,103 -> 179,701 / 60,151 on 2026-11-02, money-feedback over main acf3d999: the purse's three lines in Japanese. Measured 179,697 / 60,147, the plus 4.
  // 179,701 / 60,151 -> 179,747 / 60,166 on 2026-11-03, week-board-after over main 36104abd: the last week's board tab in Japanese. Measured 179,743 / 60,162, the plus 4.
  // 179,747 / 60,166 -> 179,769 / 60,178 on 2026-11-04, canon-fixes-1 over main 76cf4a07: the canon fixes' Korean, English and Japanese lines (the role of 가온정밀's CEO, keyed by its Korean, names its address in both dictionaries; the 사건 29→30 interlude). Measured 179,765 / 60,174, the plus 4.
  // 179,769 / 60,178 -> 179,871 / 60,198 on 2026-11-04, ranking-recheck-wider over main 76cf4a07: 「確認中」 and its explanation. Measured 179,867 / 60,194, the plus 4.
  // 179,747 / 60,166 -> 179,771 / 60,177 on 2026-11-04, kd-bank-account over main 629de24c: KD銀行口座 and 直近. Measured 179,767 / 60,173, the plus 4.
  // 179,769 / 60,178 -> 179,793 / 60,190 on 2026-11-04, kd-bank-account after merging main 9676ea92 (#424): KD銀行口座 and 直近 over the canon fixes. Measured 179,789 / 60,186 locally and in Linux CI, the plus 4.
  // 179,793 / 60,190 -> 179,858 / 60,204 on 2026-11-04, tab-title-locale over main dc26d880: the tab's title in English and Japanese (pageTitle in the intro copy, put on the tab by src/locale.js through overlay.js pageTitle()). Measured 179,854 / 60,200 in the e2e build, the plus 4.
  // 179,769 / 60,178 -> 179,989 / 60,211 on 2026-11-04, board-auto-hide over main 2bd9a8ba: the two blocked-word refusals in Japanese. Measured 179,985 / 60,207, the plus 4.
  // 179,793 / 60,190 -> 180,032 / 60,227 on 2026-11-05, board-auto-hide over main 3d4183e5: the two blocked-word refusals in Japanese over KD銀行口座. Measured 180,028 / 60,223 in the e2e build, the plus 4.
  // -> 180,288 / 60,311 on 2026-11-05, bundle-1105c (#450, #432, #425, #434) over main 3d4183e5 (#449, #441): the lines above together. Measured 180,284 / 60,307 in the e2e build, the plus 4.
  // 180,288 / 60,311 -> 180,543 / 60,355 on 2026-11-05, text-size-setting over main 3ca15f8d: the comfort panel's 글자 크기 row (legend, text, three labels). Measured 180,539 / 60,351 in the e2e build, the plus 4.
  // 180,288 / 60,311 -> 180,349 / 60,336 on 2026-11-05, result-card-habit over main 3ca15f8d: the habit sentence's Japanese (screens/habits.js cardLine). Measured 180,345 / 60,332 in the e2e build, the plus 4.
  // 180,288 / 60,311 -> 180,325 / 60,317 on 2026-11-05, table-a11y-1105 over main 3ca15f8d: the voice's wall call in Japanese (voice.wall). Measured 180,321 / 60,313 in the e2e build, the plus 4.
  // -> 180,641 / 60,387 on 2026-11-05, bundle-1105d (E5, D1, table-a11y, canon-trainee-locales, static-shell) over main c569cb99: the lines above together. Measured 180,637 / 60,383 in the e2e build, the plus 4.
  // 179,701 / 60,151 -> 179,786 / 60,177 on 2026-11-03, #224 merged with main 465ccb93 (#391 #389 #390 #393 #388): #224's Japanese lines (audit, links, bests) beside main's new tables and purse. Measured 179,786 / 60,173 in the e2e build, the gzip plus 4.
  // 179,786 / 60,177 -> 179,991 / 60,242 on 2026-11-03, #307 c1-reading-axis merged with #224 c55d71e1 (main 465ccb93): the reading axis's Japanese beside #224's and main's new tables. Measured 179,991 / 60,238 in the e2e build, the gzip plus 4.
  // 179,786 / 60,177 -> 180,327 / 60,411 on 2026-11-03, #316 table-rhythm-bundle merged with #224 c55d71e1 (main 465ccb93): the table rhythm's Japanese beside #224's and main's new tables. Measured 180,327 / 60,407 in the e2e build, the gzip plus 4.
  // 179,786 / 60,177 -> 180,518 / 60,361 on 2026-11-03, #320 c3-c4-rules merged with #224 c55d71e1 (main 465ccb93): C-3/C-4's Japanese beside #224's and main's new tables. Measured 180,518 / 60,357 in the e2e build, the gzip plus 4.
  // 179,786 / 60,177 -> 180,174 / 60,319 on 2026-11-03, #308 d2-hall-of-fame merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 180,174 / 60,315 in the e2e build, the gzip plus 4.
  // 180,518 / 60,411 -> 181,649 / 60,804 on 2026-11-03, 통합 리허설 (#379) over #224 30f5519d (main bb492d5d) with #307 #316 #320 #308: the four branches' lines together. Measured 181,649 / 60,800 in the e2e build, the gzip plus 4.
  // 180,288 / 60,311 -> 182,240 / 60,959 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 182,236 / 60,955 in the e2e build, the plus 4.
  // 180,288 / 60,311 -> 180,352 / 60,333 on 2026-11-05, collapse-staging over main c569cb99: the bust's stop (A2) -- the slam's third line in three languages, the heart stopped on the frame (fxVariables, the pulse reads —) and the drone's slower let-down (gauntletAudio). Measured 180,348 / 60,329 in the e2e build, the plus 4.
  // 180,288 / 60,311 -> 180,355 / 60,334 on 2026-11-05, rank-title over main 24af89d7 (C1 기록 칭호): the five titles (責任分析官 added) and the name line's words in Japanese. Measured 180,351 / 60,330 in the e2e build, the plus 4.
  // 180,288 / 60,311 -> 180,296 / 60,303 on 2026-11-05, hold-confirm over main e68fe8cc (A4 (1), 2026-11-05): 長押しが必要 and 長押しすると確定する, the hold help shortened. Measured 180,292 / 60,299 in the e2e build, the plus 4.
  // -> 182,102 / 60,625 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 182,098 / 60,621 in the e2e build, the plus 4.
  // 182,240 / 60,959 -> 184,054 / 61,313 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 184,050 / 61,309 in the e2e build, the plus 4.
  // -> 182,593 / 61,038 on 2026-11-05, bundle-1105d after merging main 7e1fe0f0 (#461 rules bundle): #461's rules in Japanese over the bundle's lines. Measured 182,589 / 61,034 in the e2e build, the plus 4.
  // 184,054 / 61,313 -> 184,407 / 61,384 on 2026-11-06, bundle-1106a after merging main 6f58cbb8 (#459 bundle-1105d: E5, D1, table-a11y, canon, intro cards): the two sides' lines together. Measured 184,403 / 61,380 in the e2e build, the plus 4.
  // 179,769 / 60,178 -> 180,238 / 60,356 on 2026-11-05, kd-spend-ui over main 2bd9a8ba (C9 PR 2, on PR 1 66bdce6a): the draft's two buttons, the notice, the second pick's title and line and the seven closed reasons in Japanese (src/locales/ja/screens/relics.js). Measured 180,234 / 60,352 in the e2e build, the plus 4.
  // 180,238 / 60,356 -> 180,350 / 60,404 on 2026-11-05, kd-spend-ui hint over main 2bd9a8ba: the draft's spendHint line (もう一つは枠が空いているときだけ). Measured 180,346 / 60,400 in the e2e build, the plus 4.
  // 180,288 / 60,311 -> 180,342 / 60,330 on 2026-11-05, scout-narrow over main 8ac59b71: SCOUT costs 믿음 1 (B1, 11-05 decision (1)): the Japanese scout button name, voice line and prologue 03 line say the price. Measured 180,338 / 60,326 in the e2e build, the plus 4.
  // 182,240 / 60,959 -> 182,959 / 61,274 on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): C9's draft lines (reroll, extra, spendNote, spendHint, second pick, off reasons, skipPaid), B1's scout price and B5's stake clock in Japanese. Measured 182,955 / 61,270 in the e2e build, the plus 4.
  // -> 183,312 / 61,351 on 2026-11-06, bundle-rules2 after merging main 6f58cbb8 (#459 묶음 1105d: 글자 크기, 결과 카드 습관 줄, 11px·aria-live, 캐논, 인트로 카드): #459's lines under the rules2 lines above. Measured 183,308 / 61,347 in the e2e build, the plus 4.
  // 184,407 / 61,384 -> 185,126 / 61,676 on 2026-11-06, bundle-1106a after merging main e1f5e515 (#463 bundle-rules2: C9 spend, 11px, B1 scout, B5 stake clock): the two sides' lines together. Measured 185,122 / 61,672 in the e2e build, the plus 4.
  // -> 183,930 / 61,484 on 2026-11-06, w47-rule-line over main e1f5e515: the test week (W47) told as a board of its own, since #461 made 감사·연쇄 rules of the table (src/copy/weekRule.js `line.testWeek`, the two box labels; ko/en/ja). Measured 183,926 / 61,480 in the e2e build, the plus 4.
  // -> 185,744 / 61,816 on 2026-11-06, w47-rule-line after merging main d7dadd92 (#464, #465): the W47 lines over main's. Measured 185,740 / 61,812 in the e2e build, the plus 4.
  // 185,744 / 61,816 -> 185,809 / 61,851 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 49f50741 (#475): the Japanese table voice lines (src/locales/ja/screens/table.js). Measured 185,805 / 61,847 in the e2e build, the plus 4.
  // 185,809 / 61,851 -> 187,054 / 62,254 on 2026-11-10, enja-text-check (E4) over main e7ccb410: the Japanese recovery center, copy flash, queue rows and error row (src/locales/ja/screens/runLines.js, report.js). Measured 187,050 / 62,250 in the e2e build, the plus 4.
  // 153,344 / 51,954 -> 154,420 / 52,285 on 2026-10-30, E-11 번외 사건 틀 (draft) over main 430dda1e (#373 #374 #375 #376 #378): the side slot's, the finale line's and the side screen's words in Japanese (screens/intro.js, result.js, sideCase.js). Measured 154,416 / 52,281, the plus 4.
  // 179,701 / 60,151 -> 180,777 / 60,484 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 180,773 / 60,480 in the e2e build, the plus 4.
  // 154,420 / 52,285 -> 154,509 / 52,340 on 2026-10-30, E-11 번외 1 (draft) over e11-side-cases da40ea69 (main 430dda1e): 番外1 and its title (`copy.sidePacks`). Measured 154,505 / 52,336, the plus 4.
  // 180,777 / 60,484 -> 180,866 / 60,540 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases 49bce887 (main 465ccb93). Measured 180,862 / 60,536 in the e2e build, the plus 4.
  // 154,509 / 52,340 -> 154,561 / 52,355 on 2026-10-30, E-11 번외 2 (draft) over e11-side-cloud c25a95cd (main 430dda1e): 番外2 and its title (`copy.sidePacks`). Measured 154,557 / 52,351, the plus 4.
  // 180,866 / 60,540 -> 180,918 / 60,555 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud c2954023 (main 465ccb93). Measured 180,914 / 60,551 in the e2e build, the plus 4.
  // 154,561 / 52,355 -> 154,607 / 52,369 on 2026-10-30, E-11 번외 3 (draft) over e11-side02 7ac9cb8e (main 430dda1e): 番外3 and its title (`copy.sidePacks`). Measured 154,603 / 52,365, the plus 4.
  // 180,918 / 60,555 -> 180,964 / 60,569 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 57313263 (main 465ccb93). Measured 180,960 / 60,565 in the e2e build, the plus 4.
  // 187,054 / 62,254 -> 188,130 / 62,575 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: the side slot's, the finale line's and the side screen's Japanese. Measured 188,126 / 62,571 in the e2e build, the plus 4.
  // 188,130 / 62,575 -> 188,219 / 62,632 on 2026-11-11, E-11 번외 1 (draft) over e11-side-cases c0d04767 and main 568572d3 (#484 #502 #503): 番外1 and its title (`copy.sidePacks`). Measured 188,215 / 62,628 in the e2e build, the plus 4.
  // 188,219 / 62,632 -> 188,271 / 62,649 on 2026-11-11, E-11 번외 2 (#321) over #317 f657d6ad (main 5c93b496). Measured 188267 / 62645 (over budget only) in the e2e build, the plus 4.
  // 188,271 / 62,649 -> 188,317 / 62,664 on 2026-11-11, E-11 번외 3 (#333) over #321 (main 5c93b496). Measured 188313 / 62660 (over budget only) in the e2e build, the plus 4.
  // 188,317 / 62,664 -> 188,472 / 62,723 on 2026-11-11, recheck-in-case over main 52027156. Measured 188468 / 62719 (over budget only) in the e2e build, the plus 4.
  // 188,317 / 62,664 -> 188,441 / 62,704 on 2026-11-12, e3-status (지금 상황 듣기 words) over main fbf1000c. Measured 188,437 / 62,700 in the e2e build, the plus 4.
  // 188,317 / 62,664 -> 189,273 / 62,982 on 2026-11-12, c2c3-result over main fbf1000c (C2-1 nearest ending, C3-3 card line, C3-4 witness paragraph). Measured 189269 / 62978 (over budget only) in the e2e build, the plus 4.
  // 189,273 / 62,982 -> 189,552 / 63,089 bundle 1112c (#520 #521) over main 4f927085. Measured 189548 / 63085 (over budget only) in the e2e build, the plus 4.
  // 189,552 / 63,089 -> 189,888 / 63,261 c4c5-copy over main 7ec2304e. Measured 189884 / 63257 (over budget only) in the e2e build, the plus 4.
  { pattern: /^locale-ja-index-.*\.js$/, maxBytes: 189_888, maxGzip: 63_261 },
  // index 91,605 / 33,973 -> 93,179 / 34,900 and overlay 2,894 / 1,183 -> 6,589 / 2,026 on 2026-10-26, en-speakers
  // (사건 11~최종 화자 63명의 영어 이름과 시범 범위 previewThrough: 범위 밖 사건은 영어 파일이 있어도 한국어로).
  // Both load on the English page only. Measured in the e2e build, the gzip plus 4.
  // 93,179 / 34,900 -> 124,761 / 45,295 on 2026-10-26, 영어판 3단계: the endings, verdicts, board, ranking, privacy lines, online save's status, the week's rules and line, the audit's and the links' lines in English. Only an English page fetches it. Measured in the e2e build, the gzip plus 4.
  // 128,593 / 46,483 -> 129,124 / 46,613 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): the English of all four. Measured 129,124 / 46,609 in the e2e build, the gzip plus 4, the raw the measurement.
  // -> 129,420 / 46,726 on 2026-10-30, 통합 리허설 (#379) over #224 bb70e777 (main 430dda1e). Measured 129,420 / 46,722, the gzip plus 4.
  // 128,593 / 46,483 -> 149,679 / 53,430 on 2026-11-02, locale-gaps (#393) over main 9be94346: the English of the same tables. Measured 149,675 / 53,426 in the e2e build, the plus 4.
  // 149,679 / 53,430 -> 149,778 / 53,469 on 2026-11-02, money-feedback over main acf3d999: the purse's three lines in English. Measured 149,774 / 53,465, the plus 4.
  // 149,778 / 53,469 -> 149,819 / 53,481 on 2026-11-03, week-board-after over main 36104abd: the last week's board tab in English. Measured 149,815 / 53,477, the plus 4.
  // 149,819 / 53,481 -> 149,852 / 53,501 on 2026-11-04, canon-fixes-1 over main 76cf4a07: the canon fixes' Korean, English and Japanese lines (the role of 가온정밀's CEO, keyed by its Korean, names its address in both dictionaries; the 사건 29→30 interlude). Measured 149,848 / 53,497, the plus 4.
  // 149,819 / 53,481 -> 149,843 / 53,493 on 2026-11-04, kd-bank-account over main 629de24c: KD Bank account and Last. Measured 149,839 / 53,489, the plus 4.
  // 149,852 / 53,501 -> 149,876 / 53,512 on 2026-11-04, kd-bank-account after merging main 9676ea92 (#424): KD Bank account and Last over the canon fixes. Measured 149,872 / 53,508 locally and in Linux CI, the plus 4.
  // 149,852 / 53,501 -> 149,807 / 53,485 on 2026-11-04, glossary-fix-1103 over main 557d17bb (#435 in): the English terms as the glossary has them (box to field, posting to transfer, queue-ticket to number-ticket, off probation to traineeship). Measured 149,803 / 53,481 in the e2e build, the plus 4.
  // 149,807 / 53,485 -> 149,930 / 53,532 on 2026-11-04, ranking-recheck-wider over main 22f43342: 「Being checked」 and its explanation. Measured 149,926 / 53,528, the plus 4.
  // 149,807 / 53,485 -> 149,831 / 53,496 on 2026-11-04, kd-bank-account after merging main 2bd9a8ba (#435's glossary in): KD Bank account and Last over the glossary's terms. Measured 149,827 / 53,492, the plus 4.
  // 149,807 / 53,485 -> 149,834 / 53,489 on 2026-11-04, en-ko-leak over main 22f43342: the brand's reading under the wordmark, Trigger Lab (screens.intro.titleReading, the user's choice 1). Measured 149,830 / 53,485, the plus 4.
  // -> 149,859 / 53,502 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 4e3f8e48 (#447): the lines above together. Measured 149,855 / 53,498 in the e2e build, the plus 4.
  // 149,859 / 53,502 -> 149,939 / 53,520 on 2026-11-04, tab-title-locale over main dc26d880: the tab's title in English and Japanese (pageTitle in the intro copy, put on the tab by src/locale.js through overlay.js pageTitle()). Measured 149,935 / 53,516 in the e2e build, the plus 4.
  // 149,807 / 53,485 -> 150,005 / 53,529 on 2026-11-04, board-auto-hide over main 2bd9a8ba: the two blocked-word refusals in English. Measured 150,001 / 53,525, the plus 4.
  // 149,859 / 53,502 -> 150,057 / 53,546 on 2026-11-05, board-auto-hide over main 3d4183e5: the two blocked-word refusals in English over bundle-1105a's dictionary. Measured 150,053 / 53,542 in the e2e build, the plus 4.
  // -> 150,260 / 53,611 on 2026-11-05, bundle-1105c (#450, #432, #425, #434) over main 3d4183e5 (#449, #441): the lines above together. Measured 150,256 / 53,607 in the e2e build, the plus 4.
  // 150,260 / 53,611 -> 150,444 / 53,653 on 2026-11-05, text-size-setting over main 3ca15f8d: the comfort panel's 글자 크기 row (legend, text, three labels). Measured 150,440 / 53,649 in the e2e build, the plus 4.
  // 150,260 / 53,611 -> 150,299 / 53,630 on 2026-11-05, result-card-habit over main 3ca15f8d: the habit sentence's English (screens/habits.js cardLine). Measured 150,295 / 53,626 in the e2e build, the plus 4.
  // 150,260 / 53,611 -> 150,296 / 53,618 on 2026-11-05, table-a11y-1105 over main 3ca15f8d: the voice's wall call in English (voice.wall). Measured 150,292 / 53,614 in the e2e build, the plus 4.
  // -> 150,519 / 53,684 on 2026-11-05, bundle-1105d (E5, D1, table-a11y, canon-trainee-locales, static-shell) over main c569cb99: the lines above together. Measured 150,515 / 53,680 in the e2e build, the plus 4.
  // 149,778 / 53,469 -> 149,845 / 53,504 on 2026-11-03, #224 merged with main 465ccb93 (#391 #389 #390 #393 #388): #224's English lines beside main's new tables and purse. Measured 149,845 / 53,500 in the e2e build, the gzip plus 4.
  // 149,845 / 53,504 -> 150,057 / 53,549 on 2026-11-03, #307 c1-reading-axis merged with #224 c55d71e1 (main 465ccb93): the reading axis's English beside #224's and main's new tables. Measured 150,057 / 53,545 in the e2e build, the gzip plus 4.
  // 149,845 / 53,504 -> 150,340 / 53,761 on 2026-11-03, #316 table-rhythm-bundle merged with #224 c55d71e1 (main 465ccb93): the table rhythm's English beside #224's and main's new tables. Measured 150,340 / 53,757 in the e2e build, the gzip plus 4.
  // 149,845 / 53,504 -> 150,511 / 53,680 on 2026-11-03, #320 c3-c4-rules merged with #224 c55d71e1 (main 465ccb93): C-3/C-4's English beside #224's and main's new tables. Measured 150,511 / 53,676 in the e2e build, the gzip plus 4.
  // 149,845 / 53,504 -> 150,176 / 53,642 on 2026-11-03, #308 d2-hall-of-fame merged with #224 9e4ec6bf (main bb492d5d): this branch's lines beside #224's and main's. Measured 150,176 / 53,638 in the e2e build, the gzip plus 4.
  // 150,511 / 53,761 -> 151,549 / 54,164 on 2026-11-03, 통합 리허설 (#379) over #224 30f5519d (main bb492d5d) with #307 #316 #320 #308: the four branches' lines together. Measured 151,549 / 54,160 in the e2e build, the gzip plus 4.
  // 150,260 / 53,611 -> 152,040 / 54,336 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 152,036 / 54,332 in the e2e build, the plus 4.
  // 150,260 / 53,611 -> 150,317 / 53,626 on 2026-11-05, collapse-staging over main c569cb99: the bust's stop (A2) -- the slam's third line in three languages, the heart stopped on the frame (fxVariables, the pulse reads —) and the drone's slower let-down (gauntletAudio). Measured 150,313 / 53,622 in the e2e build, the plus 4.
  // 150,260 / 53,611 -> 150,323 / 53,631 on 2026-11-05, rank-title over main 24af89d7 (C1 기록 칭호): the five titles (Chief Analyst added) and the name line's words in English. Measured 150,319 / 53,627 in the e2e build, the plus 4.
  // 150,260 / 53,611 -> 150,279 / 53,614 on 2026-11-05, hold-confirm over main e68fe8cc (A4 (1), 2026-11-05): "Hold, don't tap" and "Hold the button down to Commit", the hold help shortened. Measured 150,275 / 53,610 in the e2e build, the plus 4.
  // -> 151,681 / 53,930 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 151,677 / 53,926 in the e2e build, the plus 4.
  // 152,040 / 54,336 -> 153,461 / 54,636 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 153,457 / 54,632 in the e2e build, the plus 4.
  // -> 152,299 / 54,406 on 2026-11-05, bundle-1105d after merging main 7e1fe0f0 (#461 rules bundle): #461's rules in English over the bundle's lines. Measured 152,295 / 54,402 in the e2e build, the plus 4.
  // 153,461 / 54,636 -> 153,720 / 54,702 on 2026-11-06, bundle-1106a after merging main 6f58cbb8 (#459 bundle-1105d: E5, D1, table-a11y, canon, intro cards): the two sides' lines together. Measured 153,716 / 54,698 in the e2e build, the plus 4.
  // 149,807 / 53,485 -> 150,242 / 53,665 on 2026-11-05, kd-spend-ui over main 2bd9a8ba (C9 PR 2, on PR 1 66bdce6a): the same lines in English (src/locales/en/screens/relics.js). Measured 150,238 / 53,661 in the e2e build, the plus 4.
  // 150,242 / 53,665 -> 150,346 / 53,705 on 2026-11-05, kd-spend-ui hint over main 2bd9a8ba: the draft's spendHint line (One more only when a slot is open). Measured 150,342 / 53,701 in the e2e build, the plus 4.
  // 150,260 / 53,611 -> 150,308 / 53,625 on 2026-11-05, scout-narrow over main 8ac59b71: SCOUT costs 믿음 1 (B1, 11-05 decision (1)): the English scout button name, voice line and prologue 03 line say the price. Measured 150,304 / 53,621 in the e2e build, the plus 4.
  // 152,040 / 54,336 -> 152,663 / 54,573 on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): the same lines in English. Measured 152,659 / 54,569 in the e2e build, the plus 4.
  // -> 152,922 / 54,642 on 2026-11-06, bundle-rules2 after merging main 6f58cbb8 (#459 묶음 1105d: 글자 크기, 결과 카드 습관 줄, 11px·aria-live, 캐논, 인트로 카드): #459's lines under the rules2 lines above. Measured 152,918 / 54,638 in the e2e build, the plus 4.
  // 153,720 / 54,702 -> 154,343 / 54,949 on 2026-11-06, bundle-1106a after merging main e1f5e515 (#463 bundle-rules2: C9 spend, 11px, B1 scout, B5 stake clock): the two sides' lines together. Measured 154,339 / 54,945 in the e2e build, the plus 4.
  // -> 153,452 / 54,773 on 2026-11-06, w47-rule-line over main e1f5e515: the test week (W47) told as a board of its own, since #461 made 감사·연쇄 rules of the table (src/copy/weekRule.js `line.testWeek`, the two box labels; ko/en/ja). Measured 153,448 / 54,769 in the e2e build, the plus 4.
  // -> 154,873 / 55,082 on 2026-11-06, w47-rule-line after merging main d7dadd92 (#464, #465): the W47 lines over main's. Measured 154,869 / 55,078 in the e2e build, the plus 4.
  // 154,873 / 55,082 -> 154,931 / 55,114 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 49f50741 (#475): the English table voice lines (src/locales/en/screens/table.js). Measured 154,927 / 55,110 in the e2e build, the plus 4.
  // 154,931 / 55,114 -> 155,866 / 55,470 on 2026-11-10, enja-text-check (E4) over main e7ccb410: the English recovery center, copy flash, queue rows and error row (src/locales/en/screens/runLines.js, report.js). Measured 155,862 / 55,466 in the e2e build, the plus 4.
  // 155,866 / 55,470 -> 156,774 / 55,788 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: the side slot's, the finale line's and the side screen's English. Measured 156,770 / 55,784 in the e2e build, the plus 4.
  // 156,774 / 55,788 -> 156,862 / 55,841 on 2026-11-11, E-11 번외 1 (draft) over e11-side-cases c0d04767 and main 568572d3 (#484 #502 #503): Side case 1 and its title (`copy.sidePacks`). Measured 156,858 / 55,837 in the e2e build, the plus 4.
  // 55,470 -> 55,477 gzip on 2026-11-10, memory-line-i18n (draft) over main cb8346da: the memory line's words moved from seasonLines to introPanels in the dictionary. Measured 155,862 / 55,473, plus 4.
  // -> 156,774 / 55,786 on 2026-11-11, bundle 1111 (#350 #301 #501) over main 568572d3: the three together. Measured 156,770 / 55,782 in the e2e build, the plus 4.
  // 156,774 / 55,786 -> 156,862 / 55,838 on 2026-11-11, E-11 번외 1 (#314) over main 5c93b496 (#504). Measured 156858 / 55834 (over budget only) in the e2e build, the plus 4.
  // 156,862 / 55,838 -> 156,923 / 55,860 on 2026-11-11, E-11 번외 2 (#321) over #317 f657d6ad (main 5c93b496). Measured 156919 / 55856 (over budget only) in the e2e build, the plus 4.
  // 156,923 / 55,860 -> 156,978 / 55,879 on 2026-11-11, E-11 번외 3 (#333) over #321 (main 5c93b496). Measured 156974 / 55875 (over budget only) in the e2e build, the plus 4.
  // 156,978 / 55,879 -> 157,097 / 55,933 on 2026-11-11, recheck-in-case over main 52027156. Measured 157093 / 55929 (over budget only) in the e2e build, the plus 4.
  // 156,978 / 55,879 -> 157,100 / 55,906 on 2026-11-12, e3-status (지금 상황 듣기 words) over main fbf1000c. Measured 157,096 / 55,902 in the e2e build, the plus 4.
  // 156,978 / 55,879 -> 157,794 / 56,201 on 2026-11-12, c2c3-result over main fbf1000c (C2-1 nearest ending, C3-3 card line, C3-4 witness paragraph). Measured 157790 / 56197 (over budget only) in the e2e build, the plus 4.
  // 157,794 / 56,201 -> 158,035 / 56,278 bundle 1112c (#520 #521) over main 4f927085. Measured 158031 / 56274 (over budget only) in the e2e build, the plus 4.
  // 158,035 / 56,278 -> 158,306 / 56,407 c4c5-copy over main 7ec2304e. Measured 158302 / 56403 (over budget only) in the e2e build, the plus 4.
  { pattern: /^locale-en-index-.*\.js$/, maxBytes: 158_306, maxGzip: 56_407 },
  // The board's blocked words and how far each is matched (src/boardBlockedTerms.js, 2026-11-03; the scopes and guards
  // 2026-11-04, board-auto-hide over main 2bd9a8ba; 시발점 passed 11-04): fetched only when 글 남기기 is pressed, so nothing at first paint carries them. Measured 3,093 / 1,717, the plus 4.
  // 128,593 / 46,483 -> 128,682 / 46,495 on 2026-10-30, E-11 번외 사건 틀 (draft) over main 430dda1e (#373 #374 #375 #376 #378): the side slot's, the finale line's and the side screen's words in English. Measured 128,678 / 46,491, the plus 4.
  // 149,778 / 53,469 -> 150,686 / 53,783 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 150,682 / 53,779 in the e2e build, the plus 4.
  // 128,682 / 46,495 -> 128,770 / 46,546 on 2026-10-30, E-11 번외 1 (draft) over e11-side-cases da40ea69 (main 430dda1e): Side case 1 and its title (`copy.sidePacks`). Measured 128,766 / 46,542, the plus 4.
  // 150,686 / 53,783 -> 150,774 / 53,833 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases 49bce887 (main 465ccb93). Measured 150,770 / 53,829 in the e2e build, the plus 4.
  // 128,770 / 46,546 -> 128,831 / 46,568 on 2026-10-30, E-11 번외 2 (draft) over e11-side-cloud c25a95cd (main 430dda1e): Side case 2 and its title (`copy.sidePacks`). Measured 128,827 / 46,564, the plus 4.
  // 150,774 / 53,833 -> 150,835 / 53,856 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud c2954023 (main 465ccb93). Measured 150,831 / 53,852 in the e2e build, the plus 4.
  // 128,831 / 46,568 -> 128,886 / 46,586 on 2026-10-30, E-11 번외 3 (draft) over e11-side02 7ac9cb8e (main 430dda1e): Side case 3 and its title (`copy.sidePacks`). Measured 128,882 / 46,582, the plus 4.
  // 150,835 / 53,856 -> 150,890 / 53,874 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 57313263 (main 465ccb93). Measured 150,886 / 53,870 in the e2e build, the plus 4.
  { pattern: /^boardBlockedTerms-.*\.js$/, maxBytes: 3_097, maxGzip: 1_721 },
  // A language's copy between cases after 사건 10 (src/locales/<lang>/between/<first>-<last>.js, en-between-11-20,
  // 2026-10-26: the owner's choice 2): fetched only once `previewThrough` reaches its cases, so the dictionary above
  // stays as it was. 사건 11~20 (210 lines and 22 roles) measured 28,210 / 10,801, the gzip plus 4.
  // 2026-10-28, lang-full: both languages open to the end, so English 사건 21-final and Japanese 사건 11-final join it
  // (four files each); the largest measured 33,405 raw (ja 21-30) and 12,141 gzip (ja 31-40).
  // 33,409 -> 33,421 raw on 2026-11-03, canon-fixes-1 over main 36104abd: the canon fixes' Korean, English and Japanese lines (the role of 가온정밀's CEO, keyed by its Korean, names its address in both dictionaries; the 사건 29→30 interlude): ja 21-30 measured 33,417, the plus 4.
  // 33,421 -> 33,475 raw on 2026-11-04, canon-a044 over main 7ddced5f: A044, 사건 26's 32억 goes to 해온파트너스와 같은 주소의 새 법인 in Korean, English and Japanese, and 사건 29's premise says 그리고 지금: ja 21-30 measured 33,471, the plus 4.
  { pattern: /^locale-(en|ja)-between-case[0-9]{2}-[0-9]{2}-.*\.js$/, maxBytes: 33_475, maxGzip: 12_145 },
  // A language's table the runtime fetches once it opens (src/locales/<lang>/late/<module>.js, locale-gaps #393,
  // 2026-11-02): the speakers' profiles (gameDialogue.js and the case packs' characterProfiles) the scene beats in the
  // report draw from. vite.config.js names it locale-<lang>-late-<module>, so the service worker leaves it to a page in
  // that language and the dictionary above does not carry it. Japanese the larger, 59,419 / 20,428 (English 52,337 /
  // 19,332), in the e2e build, the plus 4.
  { pattern: /^locale-(en|ja)-late-gameDialogue-.*\.js$/, maxBytes: 59_423, maxGzip: 20_432 },
  // 6,589 / 2,026 -> 8,013 / 2,344 on 2026-10-26, 일본어 1단계: the Japanese files in the overlay's import maps and its
  // `addStyle` (a dictionary's own CSS). Loads on a page in another language only. Measured 8,013 / 2,340, the gzip plus 4.
  // 8,013 / 2,344 -> 8,731 / 2,640 on 2026-10-26, en-between-11-20: the between/ files in its import map, fetched once
  // `previewThrough` reaches them, a table keyed by case laid over only up to it, and `roleName` reading their
  // `caseRoles` (`caseRole`). Measured 8,731 / 2,636.
  // 8,731 / 2,640 -> 12,511 / 3,324 on 2026-10-28, lang-full: the import maps name every case and between/ file of both
  // languages (49 cases more for Japanese) and, with #365, a card keeps its Korean label. Measured 12,575 / 3,354.
  // 12,579 / 3,358 -> 12,868 / 3,438 on 2026-11-02, locale-gaps (#393) over main 9be94346: the late/ import map (the speakers' profiles, fetched when the runtime opens) and laying a late table over its module. Measured 12,864 / 3,434 in the e2e build, the plus 4.
  // 12,868 / 3,438 -> 12,991 / 3,500 on 2026-11-03, plate-room-locale over main 16b6d349: a translated scene keeps its Korean place and clock for the plate (src/locales/overlay.js, src/scenePlate.js), and the sound tries 17 and 14 before it gives up (src/plateStory.js). Measured 12,987 / 3,496 in the e2e build, the plus 4.
  // 12,579 / 3,358 -> 13,068 / 3,524 on 2026-10-29, E-11 번외 1 (draft) restacked on e11-side-cases a11ad2f5 (13,068 / 3,520 again over da40ea69 on 10-30): the side list among the shell's tables, `localizeSidePack`, and en/ja side01 in the one import map both case kinds now share (`nodeFile`; two globs would carry the map twice). Measured 13,068 / 3,520.
  // 12,868 / 3,438 -> 13,361 / 3,605 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases 49bce887 (main 465ccb93). Measured 13,357 / 3,601 in the e2e build, the plus 4.
  // 12,991 / 3,500 -> 13,484 / 3,667 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases b40aa7d1 (main 425eb4da). Measured 13,480 / 3,663 in the e2e build, the plus 4.
  // 13,068 / 3,524 -> 13,224 / 3,555 on 2026-10-30, E-11 번외 2 (draft) over e11-side-cloud c25a95cd (main 430dda1e): en/ja side02 in the one import map (`nodeFile`). Measured 13,224 / 3,551, the gzip plus 4.
  // 13,361 / 3,605 -> 13,517 / 3,639 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud c2954023 (main 465ccb93). Measured 13,513 / 3,635 in the e2e build, the plus 4.
  // 13,484 / 3,667 -> 13,640 / 3,704 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud dbab06b9 (main 425eb4da). Measured 13,636 / 3,700 in the e2e build, the plus 4.
  // 13,224 / 3,555 -> 13,380 / 3,582 on 2026-10-30, E-11 번외 3 (draft) over e11-side02 7ac9cb8e (main 430dda1e): en/ja side03 in the one import map (`nodeFile`). Measured 13,380 / 3,578, the gzip plus 4.
  // 13,517 / 3,639 -> 13,673 / 3,669 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 57313263 (main 465ccb93). Measured 13,669 / 3,665 in the e2e build, the plus 4.
  // 13,640 / 3,704 -> 13,796 / 3,731 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 900d1946 (main 425eb4da). Measured 13,792 / 3,727 in the e2e build, the plus 4.
  // 3,500 -> 3,505 gzip on 2026-11-03, canon-fixes-1 over main 36104abd: the canon fixes' Korean, English and Japanese lines (the role of 가온정밀's CEO, keyed by its Korean, names its address in both dictionaries; the 사건 29→30 interlude): the raw bytes are the same; the hashed names in its import maps changed and gzip worse. Measured 3,501, the plus 4.
  // 3,505 -> 3,520 gzip on 2026-11-03, canon-fixes-2 over canon-fixes-1 (#424): the raw bytes are the same; the case files' hashed names in its import maps changed and gzip worse. Measured 12,987 / 3,516, the plus 4.
  // 3,520 -> 3,525 gzip on 2026-11-04, bundle-1105b (#443 credits-alice + #446 canon-a044 over main 2bd9a8ba): the raw bytes are the same; #446 changes case files and their hashed names in the import maps gzip worse. Measured 12,987 / 3,521, the plus 4.
  // 12,991 / 3,525 -> 13,064 / 3,564 on 2026-11-04, tab-title-locale over main dc26d880: the tab's title in English and Japanese (pageTitle in the intro copy, put on the tab by src/locale.js through overlay.js pageTitle()). Measured 13,060 / 3,560 in the e2e build, the plus 4.
  // 13,064 / 3,564 -> 13,557 / 3,710 on 2026-11-11, E-11 번외 1 (draft) over e11-side-cases c0d04767 and main 568572d3 (#484 #502 #503): `localizeSidePack` and en/ja side01 in the import map beside main's pageTitle(). Measured 13,553 / 3,706 in the e2e build, the plus 4.
  // 13,557 / 3,710 -> 13,713 / 3,737 on 2026-11-11, E-11 번외 2 (#321) over #317 f657d6ad (main 5c93b496). Measured 13709 / 3733 (over budget only) in the e2e build, the plus 4.
  // 13,713 / 3,737 -> 13,869 / 3,767 on 2026-11-11, E-11 번외 3 (#333) over #321 (main 5c93b496). Measured 13865 / 3763 (over budget only) in the e2e build, the plus 4.
  // 13,713 / 3,737 -> 13,713 / 3,748 on 2026-11-11, prose-trim-19-28 after merging main accd990b (#321). Measured - / 3744 (over budget only) in the e2e build, the plus 4.
  // 13,713 / 3,748 -> 13,869 / 3,774 on 2026-11-11, bundle 1111b (#505 #506 #507 #508) over main 72d10e69. Measured 13865 / 3770 (over budget only) in the e2e build, the plus 4.
  // 13,869 / 3,767 -> 13,869 / 3,779 on 2026-11-11, prose-trim-39-final over main 72d10e69. Measured - / 3775 (over budget only) in the e2e build, the plus 4.
  { pattern: /^locale-overlay-.*\.js$/, maxBytes: 13_869, maxGzip: 3_779 },
  { pattern: /^rolldown-runtime-.*\.js$/, maxBytes: 726, maxGzip: 433 },
];

/**
 * What a release must not carry. The debug console -- the case jump, the
 * unlock-all button, the overlay -- is compiled out of a build that did not ask
 * for it (`debugBuild`, src/appConfig.js). It used to ship switched off, and a
 * `VITE_ENABLE_DEBUG_TOOLS=true` left in the build environment would have
 * switched it on for every visitor with every check green.
 *
 * The dev switch that forces this week's rule (`?week=`, weeklyCalendar.js)
 * is held the same way: its entry is the only place `added:"dev"` is written.
 */
const MUST_NOT_SHIP = ["debug-case-select", "debug-node-select", "debug-start-node", "unlock-all-cases", "debug-overlay", "DEBUG JUMP", 'added:"dev"'];

/**
 * The cold path: every byte a first visit on a phone waits on before the intro
 * can paint its hero -- the HTML, each script and stylesheet the HTML links,
 * the preloaded font, and the key visual the phone's `<picture>` picks at 2x
 * (what index.html preloads for it). Measured as transfer bytes: gzip for text,
 * raw for the font and the image.
 *
 * 490,643 bytes on 2026-09-27, down from ~776KB: ~537KB of font subsets became
 * one 270KB file, and a retina phone stopped fetching the -480 preload and
 * then the -960 the picture actually used. 494,937 once the old dynamic-subset
 * font stylesheet stopped being imported and the intro joined the entry chunk.
 */
const FIRST_PAINT_IMAGE = "triggerlab-key-visual-960.webp";

/**
 * A page in another language waits on two more scripts before it paints
 * (src/locale.js `loadLocale`, which src/main.jsx awaits): the overlay and,
 * through it, the language's dictionary. Until 2026-10-26 this check measured
 * the Korean page alone, and English (`?lang=en`) came to 544,820 and Japanese
 * (`?lang=ja`) to 548,489 against a 515,000 line nothing held them to. Each
 * language now has its own line; a language's extra chunks are named here, and
 * whatever they import that the Korean page does not already fetch is counted
 * with them.
 *
 * 515,000 for Korean until 2026-10-26; then first-paint-cut (the user's choice
 * 1): the font's weight axis cut to 400-920 (-73,092) and the key visual's 960
 * variant encoded at 0.75 (-12,372). Each line is that day's e2e build plus 4:
 * Korean 507,582 -> 422,113, English 544,820 -> 459,352, Japanese 548,489 ->
 * 463,021. Merged on 2026-10-28 over main 2c935e7 (#362's English step-three
 * and step-four screens grow the entry and the English dictionary), the lines
 * are that build plus 4: Korean 422,669, English 471,491, Japanese 463,608.
 * The same day the observer's Korean card words (코드 리뷰 10-26 낮음) put
 * them at 422,686, 471,543 and 463,660. Both languages open to the end
 * (lang-full, 10-28): English 472,083, Japanese 477,810 (the Japanese
 * dictionary carries the screen copy of English steps three and four).
 * The recovery notice over the fixed language pills (10-29) puts them at
 * 422,775, 472,175 and 477,902.
 * Japanese 477,900 on 10-29 (lang-terms, 일본어판 표기 맞춤), the plus 4; with the
 * recovery notice merged, Japanese 477,908.
 * index.html then names the two other languages (hreflang, og:locale:alternate,
 * lang-extras) and the policy links open the page's own language:
 * 422,950, 472,350 and 478,077; with lang-terms (main b7228340) and the
 * service worker skipping rel="alternate", 422,948, 472,339 and 478,083.
 * The Japanese premise drawn smaller on a narrow phone (intro-en-fit, 10-29)
 * puts the Korean at 422,964 (the critical CSS carries the rule); English
 * 472,329 and Japanese 478,085 stay under their lines. Merged over main
 * 4ad6f059 (#372's shorter English and Japanese card labels): 422,977, 472,339
 * and 478,095.
 * A locked card's condition in English and Japanese (gate-reason-copy, over
 * main d109b66b): 422,978, 472,430 and 478,220.
 * The start screen's storage line in the page's language (save-unavailable-lite,
 * src/shellNotices.js, over main d0c44b13): 422,996, 472,448 and 478,238.
 * The foot's five links (about, FAQ, contact and the two policies, in the
 * page's language; adsense-readiness, over main 3e350266): 423,083, 472,557
 * and 478,361.
 * The language pills kept one row on a 360px phone and the shorter Japanese
 * premise (picker-narrow, over main c3b40b6f; the critical CSS carries the
 * rule): 423,125, 472,600 and 478,386.
 * The ranking save lines in the page's language (ranking-save-copy, over main
 * c39870a7; the Korean only by the entry's hashed names): 423,114, 472,617
 * and 478,413.
 * A Japanese card label on 360px or less a size down (ja-hand-narrow, over
 * main c865d984; the index CSS carries the rule): 423,150, 472,646 and 478,442.
 * The start button closer to the premise on 360px or less (intro-360-fit,
 * over main 7552870d; the English premise at 14px there too): 423,171, 472,667
 * and 478,463.
 * The HUD's air on 360px or less, so a late-season bank row on two lines keeps
 * the hand above the bar (bank-rail-fit, over main 78e53e40; the index CSS
 * carries the rule): 423,219, 472,715 and 478,511.
 * An English card label and five-card hand tighter on 360px or less, for
 * Linux fonts (en-hand5-linux, over main 2f085d28; the index CSS carries the
 * rule): 423,305, 472,803 and 478,599.
 * Four leads per music mode, the reveal sheet's three tracks and the stake
 * layers in the entry (bgm-variety, over main c680ddd5): 425,012, 474,508
 * and 480,304.
 * #224 (RULES_MARK 3) merged with main 11cb3b16 (10-29): the Japanese dictionary's
 * new lines put Japanese at 477,922, the plus 4; Korean (422,752) and English stay under.
 * #224 merged with main 430dda1e (10-30): 423,106, 472,641 and 478,425, the plus 4.
 * The English bank rail fitted to a 360px phone (#224 hand5-en, 10-30; the critical CSS does not carry it): 423,147, 472,682 and 478,466, the plus 4.
 * c3-c4-rules (C-3, C-4, RULES_MARK 4) merged with #224 602ec69b (10-29): 422,808,
 * 472,351 and 478,130, the plus 4.
 * C-3·C-4 rules (#320) merged with #224 bb70e777 (main 430dda1e, 10-30): 423,148, 472,805 and 478,622, the plus 4.
 * C-3·C-4 rules (#320) merged with #224 0d29141a (the English bank rail at 360px), 10-30: 423,187, 472,844 and 478,661, the plus 4.
 * D2 hall of fame (#308) merged with #224 602ec69b (10-29): fetchHallOfFame, the notice's
 * sentence, the badge's CSS and the dictionaries' lines put them at 422,945, 472,519 and
 * 478,266, the e2e build plus 4.
 * D2 hall of fame draft (#308) merged with #224 bb70e777 (main 430dda1e, 10-30): 423,280, 472,958 and 478,751, the plus 4.
 * D2 hall of fame draft (#308) merged with #224 0d29141a (the English bank rail at 360px), 10-30: 423,315, 472,993 and 478,786, the plus 4.
 * C-1(1) (the 판 읽기 axis) merged with #224 602ec69b (10-29): the seventh score card's CSS in the
 * critical sheet and its words in the dictionaries put English at 472,236 and Japanese at 478,009,
 * the plus 4; Korean (422,764) stays under.
 * C-1 reading axis (#307) merged with #224 bb70e777 (main 430dda1e, 10-30): 423,114, 472,693 and 478,493, the plus 4.
 * C-1 reading axis (#307) merged with #224 0d29141a (the English bank rail at 360px), 10-30: 423,147, 472,726 and 478,526, the plus 4.
 * 통합 리허설 (#379) over #224 bb70e777 (main 430dda1e, 10-30): 423,480, 473,555 and 479,405, the plus 4.
 * 통합 리허설 (#379) over #224 0d29141a (the English bank rail at 360px) with #307 #316 #320 #308, 10-30: 423,512, 473,587 and 479,437, the plus 4.
 * #224 merged with main b2558d55 (10-30 evening; #380 #381 #382 #383): 423,175, 472,704 and 478,488, the plus 4.
 * C-1 reading axis (#307) merged with #224 8dd649ce (main b2558d55, 11-02): 423,256, 472,832 and 478,632, the plus 4.
 * C-3·C-4 rules (#320) merged with #224 8dd649ce (main b2558d55, 11-02): 423,218, 472,870 and 478,687, the plus 4.
 * D2 hall of fame (#308) merged with #224 8dd649ce (main b2558d55, 11-02): 423,419, 473,091 and 478,884, the plus 4.
 * #224 merged with main 2f085d28 (11-02; #384 bank-rail-fit): 423,304, 472,832 and 478,616, the plus 4.
 * #224 merged with main c680ddd5 and 9be94346 (11-02; #389 #388), Audit n/4 off the 360px bank row: 425,149, 474,677 and 480,461, the plus 4.
 * D2 hall of fame (#308) merged with #224 afdcac0c (main 2f085d28): 423,459, 473,131 and 478,924, the plus 4.
 * #308 d2-hall-of-fame merged with #224 c29c2efd (main 9be94346): 425,324, 474,993 and 480,786, the plus 4.
 * C-3·C-4 rules (#320) merged with #224 afdcac0c (main 2f085d28): 423,343, 472,995 and 478,812, the plus 4.
 * #320 c3-c4-rules merged with #224 c29c2efd (main 9be94346): 425,201, 474,853 and 480,670, the plus 4.
 * C-1 reading axis (#307) merged with #224 afdcac0c (main 2f085d28): 423,310, 472,884 and 478,684, the plus 4.
 * #307 c1-reading-axis merged with #224 c29c2efd (main 9be94346): 425,154, 474,730 and 480,530, the plus 4.
 * The entry's own Korean read by key so the other pages can lay their words
 * over it (locale-gaps #393, over main 9be94346: src/copy/introPanels.js,
 * music.js; the dictionaries carry every new table's English and Japanese):
 * 425,556, 482,416 and 489,089, the plus 4. The speakers' profiles are not in
 * these lines; they are the late/ chunks the runtime fetches.
 * money-feedback over main acf3d999: 425,946, 482,846 and 489,528, the plus 4.
 * The PC type scale (pc-type-scale, over main b5abd681; the index CSS and the
 * critical CSS carry the 112.5% root from 1025px, 16px kept on the start screen): 426,130, 483,029 and 489,711, the plus 4.
 * #224 merged with main 465ccb93 (11-03; #391 #389 #390 #393), the 360px signals tightened beside Audit n/4 (the critical CSS does not carry it): 426,317, 483,251 and 489,924, the plus 4.
 * #307 c1-reading-axis merged with #224 c55d71e1 (main 465ccb93, 11-03): 426,326, 483,304 and 489,997, the plus 4.
 * #320 c3-c4-rules merged with #224 c55d71e1 (main 465ccb93, 11-03): 426,383, 483,495 and 490,176, the plus 4.
// ko 422,779 -> 422,891, en 472,179 -> 472,502, ja 477,926 -> 478,315 on 2026-10-29, table-rhythm-bundle (C-7, B-13(2), C-10) merged with #224 602ec69b (main 43078a46): the index CSS's board marks and the five icons in icons-vendor (both on the first paint), and each dictionary's new lines. Measured 422,887 / 472,498 / 478,311. Measured in the e2e build, the gzip plus 4.
// ko 423,110 -> 423,241, en 472,645 -> 472,970, ja 478,429 -> 478,812 on 2026-10-30, table rhythm bundle (#316) merged with #224 bb70e777 (main 430dda1e, 10-30): 423,237, 472,966 and 478,808, the plus 4.
// ko 423,241 -> 423,269, en 472,970 -> 472,998, ja 478,812 -> 478,840 on 2026-10-30, table rhythm bundle (#316) merged with #224 0d29141a (the English bank rail at 360px), 10-30: 423,265, 472,994 and 478,836, the plus 4.
// ko 422,945 -> 423,130, en 472,519 -> 473,093, ja 478,315 -> 478,912 on 2026-10-29, the 11-30 rehearsal (integration-1130b: #224 602ec69b + #307 + #316 + #320 + #308): the four's index JS and CSS and each dictionary's lines on one first paint. Measured 423,126 / 473,089 / 478,908 in the e2e build, the plus 4.
// table-rhythm-bundle (#316) merged with #224 8dd649ce (main b2558d55, 11-02): 423,374, 473,096 and 478,938, the plus 4.
// 통합 리허설 (#379) over #224 8dd649ce (main b2558d55) with #307 #316 #320 #308, 11-02: 423,612, 473,680 and 479,530, the plus 4.
// table-rhythm-bundle (#316) merged with #224 afdcac0c (main 2f085d28): 423,425, 473,149 and 478,991, the plus 4.
// #316 table-rhythm-bundle merged with #224 c29c2efd (main 9be94346): 425,280, 475,004 and 480,846, the plus 4.
// 통합 리허설 (#379) over #224 afdcac0c (main 2f085d28) with #307 #316 #320 #308: 423,661, 473,729 and 479,579, the plus 4.
// 통합 리허설 (#379) over #224 c29c2efd (main 9be94346) with #307 #316 #320 #308: 425,534, 475,600 and 481,450, the plus 4.
// #316 table-rhythm-bundle merged with #224 c55d71e1 (main 465ccb93, 11-03): 426,458, 483,649 and 490,299, the plus 4.
 * E-11 번외 사건 틀 (draft, over main 2f085d28 on 11-02), the start screen's
 * side slot and its words in the entry: 424,217, 474,055 and 479,845.
 * E-11 번외 사건 틀 (draft) over main 465ccb93: 427,116, 484,321 and 491,022 (measured 427,112, 484,317, 491,018, plus 4).
 * E-11 번외 1 on it (11-02, over e11-side-cases 3dad5969): the side list's
 * entry and its language helper, the overlay's side path and the label and
 * title in each dictionary: 424,343, 474,401 and 480,195.
 * E-11 번외 1 (draft) over e11-side-cases 49bce887 (main 465ccb93): 427,224, 484,654 and 491,361 (measured 427,220, 484,650, 491,357, plus 4).
 * E-11 번외 사건 온라인 저장 on it (11-02, over e11-side01 9eb5fe2c): the side
 * keys and the event's name in the entry: 424,339, 474,394 and 480,188.
 * E-11 번외 2 on it (11-02, over e11-side-cloud 4fb9ad57): side02 in the
 * entry's list and the overlay's import map, the label and title in each
 * dictionary: 424,381, 474,489 and 480,276.
 * E-11 번외 3 on it (11-02, over e11-side02 5ec44e4e): side03 in the entry's list
 * and the overlay's import map, the label and title in each dictionary:
 * 424,450, 474,605 and 480,388.
 */
// 425,560 / 482,420 / 489,093 -> 425,751 / 482,612 / 489,285 on 2026-11-02, plate-story over main acf3d999 (#392): scene plates place the sound beside its source (src/plateStory.js), mark the player figure, and draw the case ending on the result screen. Measured 425,747 / 482,608 / 489,281 the plus 4.
// 425,950 / 482,850 / 489,532 -> 426,541 / 483,439 / 490,121 on 2026-11-02, plate-story over main b5abd681 (#392, with #391): the font's three kana and the plate's CSS. Measured 426,537 / 483,435 / 490,117, the plus 4.
// 426,134 / 483,033 / 489,715 -> 426,755 / 483,654 / 490,336 on 2026-11-02, plate-story over main 5c00dffe (#392, with #390): Measured 426,751 / 483,650 / 490,332, the plus 4.
// 426,755 / 483,654 / 490,336 -> 426,761 / 483,722 / 490,404 on 2026-11-03, plate-room-locale over main 16b6d349: a translated scene keeps its Korean place and clock for the plate (src/locales/overlay.js, src/scenePlate.js), and the sound tries 17 and 14 before it gives up (src/plateStory.js). Measured 426,757 / 483,718 / 490,400, the plus 4.
// 426,761 / 483,722 / 490,404 -> 426,814 / 483,775 / 490,461 on 2026-11-03, signal-row-fit over main 425eb4da (#395 on cb904fb6): LOCK its own width in the English and Japanese signals row on 360px or less (the index CSS carries the rule). Measured 426,810 / 483,771 / 490,457, the plus 4.
// 426,814 / 483,775 / 490,461 -> 426,833 / 483,809 / 490,494 on 2026-11-03, week-board-after over main 36104abd: the entry's ranking-board check and the two dictionaries' tab line. Measured 426,829 / 483,805 / 490,490, the plus 4.
// 426,833 / 483,809 / 490,494 -> 426,845 / 483,820 / 490,505 on 2026-11-03, intro-webkit-fit over main 7fc3a1c4: the Korean and Japanese premise wraps plainly on 360px or less (the index CSS carries the rule, the critical CSS only its hash; the language chunks only by their hashed names). Measured 426,841 / 483,816 / 490,501, the plus 4.
// 426,845 / 483,820 / 490,505 -> 426,845 / 483,841 / 490,518 on 2026-11-04, canon-fixes-1 over main 76cf4a07: the canon fixes' Korean, English and Japanese lines (the role of 가온정밀's CEO, keyed by its Korean, names its address in both dictionaries; the 사건 29→30 interlude): the two dictionaries and the overlay above. Measured 426,839 / 483,837 / 490,514 in the e2e build, the plus 4; the Korean fits its line.
// 426,845 / 483,841 / 490,518 -> 426,876 / 483,917 / 490,587 on 2026-11-04, ranking-recheck-wider over main 76cf4a07 (보안 점검 M2): the entry's `rechecked` read and the two dictionaries' 「확인 중」. Measured 426,872 / 483,913 / 490,583 in the e2e build, the plus 4.
// 426,845 / 483,841 / 490,518 -> 426,857 / 483,846 / 490,518 on 2026-11-04, a11y-1103 over main 557d17bb (#424, #435): the hand's card edge (the critical CSS), the ranking place's testid and the chunk names the entry imports. Measured 426,853 / 483,842 / 490,514 in the e2e build, the plus 4.
// 426,857 / 483,846 / 490,518 -> 426,847 / 483,846 / 490,514 on 2026-11-04, a11y-1103 over main 22f43342 (#431, #444). Measured 426,843 / 483,842 / 490,510 in the e2e build, the plus 4.
// 426,845 / 483,820 / 490,505 -> 426,892 / 483,868 / 490,553 on 2026-11-03, flaky-fix-1103 over main 4be2c339: the entry chunk's late tab-token answer. Measured 426,888 / 483,864 / 490,549, the plus 4.
// 426,892 / 483,868 / 490,553 -> 426,880 / 483,872 / 490,544 on 2026-11-04, flaky-fix-1103 over main 557d17bb (#424, #435): the two lines above together, re-measured. Measured 426,876 / 483,868 / 490,540 in the e2e build, the plus 4.
// 426,880 / 483,872 / 490,544 -> 426,889 / 483,887 / 490,555 on 2026-11-04, flaky-fix-1103 over main 22f43342 (#431, #444). Measured 426,885 / 483,883 / 490,551 in the e2e build, the plus 4.
// 426,845 / 483,820 / 490,505 -> 427,340 / 484,329 / 491,013 on 2026-11-04, kd-bank-account over main 629de24c: the KD은행 계좌's CSS in the index stylesheet and its words in the entry and the two dictionaries. Measured 427,336 / 484,325 / 491,009, the plus 4.
// 426,845 / 483,841 / 490,518 -> 427,386 / 484,397 / 491,075 on 2026-11-04, kd-bank-account after merging main 9676ea92 (#424). Measured 427,382 / 484,393 / 491,071 locally and in Linux CI, the plus 4.
// 427,386 / 484,397 / 491,075 -> 427,391 / 484,402 / 491,080 the same day: Linux CI measured 427,387 / 484,398 / 491,076 on 986edea7 (index.html and the entry 1 and 4 bytes more than locally), the plus 4.
// -> 427,435 / 484,446 / 491,106 on 2026-11-04, bundle-1105a (#440, #439, #442, #416 over main 2bd9a8ba): the lines above together, the critical CSS cut again. Measured 427,431 / 484,442 / 491,102 in the e2e build, the plus 4.
// 426,845 / 483,841 / 490,518 -> 427,509 / 484,083 / 491,247 on 2026-11-04, seo-locale-start over main 22f43342 (canon fixes 1·2 and the glossary in): index.html's description from the about page and its no-script intro and five links, and the entry's folder languages; English and Japanese are now measured from their own start pages (/en/, /ja/) in place of the Korean index.html. Measured 427,505 / 484,079 / 491,243, the plus 4.
// 426,845 / 483,841 / 490,518 -> 427,540 / 484,538 / 491,206 on 2026-11-04, perf-first-visit over main 22f43342: index.html names /assets/locale-preload-<hash>.js (a Korean page runs it and asks for nothing; it reads the stored language, then the folder, then ?lang=), and the entry waits for `load` before it warms the runtime. Measured 427,536 / 484,534 / 491,202, the plus 4.
// 426,845 / 483,841 / 490,518 -> 426,858 / 483,850 / 490,522 on 2026-11-04, en-ko-leak over main 557d17bb: the language check in simplifyPlayerText. Measured 426,854 / 483,846 / 490,518, the plus 4.
// 426,858 / 483,850 / 490,522 -> 426,861 / 483,864 / 490,539 on 2026-11-04, en-ko-leak over main 22f43342: the title reading in each dictionary (Trigger Lab, トリガーラボ). Measured 426,857 / 483,860 / 490,535, the plus 4.
// 426,845 / 483,820 / 490,505 -> 426,850 / 483,826 / 490,511 on 2026-11-03, plate-sound-clip over main 8e930107: the scene sound is centred in its transform (the index CSS grows; the critical CSS only its hash). Measured 426,846 / 483,822 / 490,507 in the CI e2e build, the plus 4.
// 426,850 / 483,826 / 490,511 -> 426,855 / 483,845 / 490,517 on 2026-11-04, plate-sound-clip over main 557d17bb (#424, #435): the two lines above together, re-measured. Measured 426,851 / 483,841 / 490,513 in the e2e build, the plus 4.
// 426,855 / 483,845 / 490,517 -> 426,852 / 483,851 / 490,519 on 2026-11-04, plate-sound-clip over main 22f43342 (#431 shortened the English dictionary, #444). Measured 426,848 / 483,847 / 490,515 in the e2e build, the plus 4.
// 426,845 / 483,841 / 490,518 -> 428,231 / 484,811 / 491,981 on 2026-11-04, bundle-1104a over main 2bd9a8ba: the lines above together (#429 #433 #436 #445 #438); the Korean page now names the locale preload, and English and Japanese are measured from /en/ and /ja/. Measured 428,227 / 484,807 / 491,977 in the e2e build, the plus 4.
// -> 428,803 / 485,392 / 492,556 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 4e3f8e48 (#447): the lines above together. The critical CSS cut again. Measured 428,799 / 485,388 / 492,552 in the e2e build, the plus 4.
// 426,845 / 483,841 / 490,518 -> 427,105 / 484,103 / 490,780 on 2026-11-04, credits-alice over main 9676ea92 (canon-fixes-1): the credit's two creators and their address links (the entry and the index CSS). Measured 427,101 / 484,099 / 490,776, the plus 4.
// 428,231 / 484,811 / 491,981 -> 428,480 / 485,062 / 492,230 on 2026-11-04, bundle-1105b over main 4e3f8e48 (#447): the credit (#443, the entry and the index CSS) on bundle-1104a's first paint. Measured 428,476 / 485,058 / 492,226 in the e2e build, the plus 4.
// -> 429,066 / 485,663 / 492,823 on 2026-11-04, bundle-1105a (#440, #439, #442, #416) over main 62a25238 (#448): the lines above together, the critical CSS cut again. Measured 429,062 / 485,659 / 492,819 in the e2e build, the plus 4.
// 429,066 / 485,663 / 492,823 -> 429,106 / 485,758 / 492,935 on 2026-11-04, tab-title-locale over main dc26d880: the tab's title in English and Japanese (pageTitle in the intro copy, put on the tab by src/locale.js through overlay.js pageTitle()). Measured 429,102 / 485,754 / 492,931, the plus 4.
// 426,845 / 483,841 / 490,518 -> 427,048 / 484,092 / 490,774 on 2026-11-04, board-auto-hide over main 2bd9a8ba: the entry's and the dictionaries' blocked-word refusals and the hook's on-demand check. Measured 427,044 / 484,088 / 490,770, the plus 4.
// 429,066 / 485,663 / 492,823 -> 429,247 / 485,884 / 493,059 on 2026-11-05, board-auto-hide over main 3d4183e5 (#449, #441): the entry's and the dictionaries' blocked-word refusals and the hook's on-demand check. Measured 429,243 / 485,880 / 493,055 in the e2e build, the plus 4.
// -> 429,328 / 486,074 / 493,267 on 2026-11-05, bundle-1105c (#450, #432, #425, #434) over main 3d4183e5 (#449, #441): the lines above together. Measured 429,324 / 486,070 / 493,263 in the e2e build, the plus 4.
// 429,328 / 486,074 / 493,267 -> 429,560 / 486,344 / 493,539 on 2026-11-05, text-size-setting over main 3ca15f8d: 글자 크기 (E5) in the entry, the index CSS (the root reads --text-scale; the critical CSS carries the rule) and the two dictionaries. Measured 429,556 / 486,340 / 493,535 in the e2e build, the plus 4.
// 429,328 / 486,074 / 493,267 -> 429,334 / 486,095 / 493,293 on 2026-11-05, result-card-habit over main 3ca15f8d: the entry's chunk names and the dictionaries' habit sentence (D1). Measured 429,330 / 486,091 / 493,289 in the e2e build, the plus 4.
// 429,328 / 486,074 / 493,267 -> 429,328 / 486,082 / 493,273 on 2026-11-05, table-a11y-1105 over main 3ca15f8d: the English and Japanese dictionaries carry the voice's wall call (E3 첫 단계); the Korean page is under its budget still. Measured 429,326 / 486,078 / 493,269 in the e2e build, the plus 4.
// 428,480 / 485,062 / 492,230 -> 428,933 / 485,454 / 492,668 on 2026-11-05, static-shell over main 62a25238: the build writes the intro's first viewport into #root of index.html and the /en/ and /ja/ start pages (scripts/static-shell.mjs), so each page's HTML grows. Measured 428,929 / 485,450 / 492,664 in the e2e build, the plus 4.
// -> 430,011 / 486,764 / 494,009 on 2026-11-05, bundle-1105d (E5, D1, table-a11y, canon-trainee-locales, static-shell) over main c569cb99: the lines above together. Measured 430,007 / 486,760 / 494,005 in the e2e build, the plus 4.
// 428,480 / 485,062 / 492,230 -> 428,596 / 485,174 / 492,344 on 2026-11-05, intro-cards-cv over main 62a25238: the roadmap cards' content-visibility rule in the index CSS (the critical CSS only its hash). Measured 428,592 / 485,170 / 492,340 in the e2e build, the plus 4.
// 428,596 / 485,174 / 492,344 -> 428,603 / 485,186 / 492,356 on 2026-11-05, intro-cards-cv trim over main 62a25238: the index CSS gzip 9 bytes more after the trim that fits base-intro-ranking.css to its structure budget (raw 88 bytes fewer). Measured 428,599 / 485,182 / 492,352 in the e2e build, the plus 4.
// -> 430,150 / 486,904 / 494,148 on 2026-11-05, bundle-1105d with intro-cards-cv (E5, D1, table-a11y, canon-trainee-locales, static-shell, intro-cards-cv) over main c569cb99: the lines above together. Measured 430,146 / 486,900 / 494,144 in the e2e build, the plus 4.
// 429,328 / 486,074 / 493,267 -> 430,386 / 487,129 / 494,322 on 2026-11-05, studio-name over main c569cb99: the font subset grows by ち, ぷ, も and よ (199,124) and the entry by the three names. Measured 430,382 / 487,125 / 494,318 in the e2e build, the plus 4.
// -> 431,207 / 487,959 / 495,203 on 2026-11-05, bundle-1105d after merging main e68fe8cc (#454 studio-name, #455 docs): the lines above together (the font subset regenerated at 199,124 and the studio's names in the entry over the static shell and E5). Measured 431,203 / 487,955 / 495,199 in the e2e build, the plus 4.
// #224 merged with main cb904fb6 (11-03; #392 plate-story, #398): 426,925, 483,922 and 490,595, the plus 4.
// #307 c1-reading-axis merged with #224 9e4ec6bf (main bb492d5d, 11-03): 426,931, 483,970 and 490,667, the plus 4.
// The CI build (Linux) measures the first paint 4 bytes over this PC's e2e build (#224 30f5519d): the budgets are this PC's plus 8 (the CI's plus 4), 426,939, 483,978 and 490,675.
// #316 table-rhythm-bundle merged with #224 9e4ec6bf (main bb492d5d, 11-03): 427,050, 484,304 and 490,958, the plus 4.
// The CI build (Linux) measures the first paint 4 bytes over this PC's e2e build (#224 30f5519d): the budgets are this PC's plus 8 (the CI's plus 4), 427,058, 484,312 and 490,966.
// #320 c3-c4-rules merged with #224 9e4ec6bf (main bb492d5d, 11-03): 426,985, 484,157 and 490,844, the plus 4.
// The CI build (Linux) measures the first paint 4 bytes over this PC's e2e build (#224 30f5519d): the budgets are this PC's plus 8 (the CI's plus 4), 426,993, 484,165 and 490,852.
// #308 d2-hall-of-fame merged with #224 9e4ec6bf (main bb492d5d, 11-03): 427,089, 484,217 and 490,894, the plus 4.
// The CI build (Linux) measures the first paint 4 bytes over this PC's e2e build (#224 30f5519d): the budgets are this PC's plus 8 (the CI's plus 4), 427,097, 484,225 and 490,902.
// 통합 리허설 (#379) over #224 30f5519d (main bb492d5d) with #307 #316 #320 #308, 11-03: 427,308, 484,956 and 491,596 on this PC; the budgets are those plus 8 (the CI's plus 4).
// 430,386 / 487,129 / 494,322 -> 430,913 / 488,378 / 495,494 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. Measured 430,909 / 488,374 / 495,490 in the e2e build, the plus 4.
// 429,328 / 486,074 / 493,267 -> 429,342 / 486,086 / 493,279 on 2026-11-05, mood-wire over mood-tags 98d32622: no first-paint code changed; the entry's and the worker's gzip moved with the hashed names of the chunks they name (the moods written on the case files). Measured 429,338 / 486,082 / 493,275 in the e2e build, the plus 4.
// 429,328 / 486,074 / 493,267 -> 429,663 / 486,406 / 493,600 on 2026-11-05, mood-tokens over main c569cb99: the ground follows the scene's mood (tokens.css: neutral one step lighter, tense/dread/bright/sorrow as :root[data-mood] blocks, --ui-ease-out), the felt's 0.6s fade (play.css), the intro scrims on the neutral ground and the critical CSS cut again (the index CSS and index.html's critical CSS). Measured 429,659 / 486,402 / 493,596 in the e2e build, the plus 4.
// 429,328 / 486,074 / 493,267 -> 429,898 / 486,630 / 493,822 on 2026-11-05, mood-music over main c569cb99: the scene's mood picks the lead and voices the table's drone -- the entry's AdaptiveMusic (musicScore.js moodLeads/setMusicMood, AdaptiveMusic's note-by-note lead crossfade; the drone moved into gauntlet/tensionDrone.js with a voicing per mood). Measured 429,894 / 486,626 / 493,818 in the e2e build, the plus 4.
// -> 431,496 / 488,234 / 495,428 on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 24af89d7): the lines above together. Measured 431,492 / 488,230 / 495,424 in the e2e build, the plus 4.
// 430,386 / 487,129 / 494,322 -> 430,390 / 487,123 / 494,315 on 2026-11-05, prose-bundle-a (#394 #399 #400 #401 #403 #405) over main 24af89d7: the trimmed case copy; the entry and the en·ja dictionaries name the renamed case chunks. Measured 430,386 / 487,119 / 494,311 in the e2e build, the plus 4.
// -> 431,207 / 487,951 / 495,195 on 2026-11-05, bundle-1105d after merging main 8ac59b71 (#456 본문 줄이기 a): the lines above together. Measured 431,203 / 487,947 / 495,191 in the e2e build, the plus 4.
// 430,390 / 487,123 / 494,315 -> 430,387 / 487,119 / 494,312 on 2026-11-05, prose-bundle-b (#412 #413 #414 #417 #418 #419) over main 8ac59b71 (#456): the trimmed case copy of cases 25-39 and 46-48; the entry and the en·ja dictionaries name the renamed case chunks. Measured 430,383 / 487,115 / 494,308 in the e2e build, the plus 4.
// -> 430,756 / 487,557 / 494,763 on 2026-11-05, bundle-1105d after merging main 977809b3 (#457 본문 줄이기 b), the static shell reverted (index.html back to main's) and the roadmap summary's flex: none: the lines above together. Measured 430,752 / 487,553 / 494,759 in the e2e build, the plus 4.
// 431,496 / 488,234 / 495,428 -> 431,500 / 488,226 / 495,421 on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 977809b3): the lines above together over the trimmed case copy (#456, #457), the two acid glows at 0.1 in the index CSS. Measured 431,496 / 488,222 / 495,417 in the e2e build, the plus 4.
// 430,387 / 487,119 / 494,312 -> 430,391 / 487,113 / 494,306 on 2026-11-05, prose-bundle-c (#420 #422 #423 #427 #428) over main 977809b3 (#457): the trimmed case copy of cases 19-24, 40-45 and 49; the entry and the en·ja dictionaries name the renamed case chunks. Measured 430,387 / 487,109 / 494,302 in the e2e build, the plus 4.
// 430,913 / 488,378 / 495,494 -> 430,916 / 488,364 / 495,479 on 2026-11-05, rules-1105 after merging main 33899116 (#456 #457 #460 prose bundles a-c): the trimmed copy's smaller en·ja dictionaries under this bundle's lines. Measured 430,912 / 488,360 / 495,475 in the e2e build, the plus 4.
// 431,500 / 488,226 / 495,421 -> 431,491 / 488,208 / 495,402 on 2026-11-05, bundle-mood (mood-wire, mood-tokens, mood-music over main 33899116): the lines above together over the trimmed case copy (#456, #457, #460); the entry and the en/ja dictionaries name the renamed case chunks. Measured 431,487 / 488,204 / 495,398 in the e2e build, the plus 4.
// -> 431,886 / 488,653 / 495,860 on 2026-11-05, bundle-1105d after merging main 4f2d39cb (#458 mood colour and music, #460 본문 c): the lines above together. Measured 431,882 / 488,649 / 495,856 in the e2e build, the plus 4.
// 430,916 / 488,364 / 495,479 -> 432,043 / 489,484 / 496,601 on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 bundle-mood: mood tokens, glow, AdaptiveMusic): the two bundles' lines together. Measured 432,039 / 489,480 / 496,597 in the e2e build, the plus 4.
// 429,328 / 486,074 / 493,267 -> 429,328 / 486,088 / 493,287 on 2026-11-05, collapse-staging over main c569cb99: the bust's stop (A2) -- the slam's third line in three languages, the heart stopped on the frame (fxVariables, the pulse reads —) and the drone's slower let-down (gauntletAudio). Measured 429,327 / 486,084 / 493,283 in the e2e build, the plus 4 (the Korean line unchanged).
// 429,328 / 486,074 / 493,267 -> 429,334 / 486,079 / 493,272 on 2026-11-05, ending-reform-order over main c569cb99 (#453): the entry's gzip only, by the renamed gameLogic chunk it names (the first paint's files are the same). Measured 429,330 / 486,075 / 493,268 in the e2e build, the plus 4.
// 430,386 / 487,129 / 494,322 -> 430,486 / 487,249 / 494,444 on 2026-11-05, rank-title over main 24af89d7 (C1 기록 칭호): the entry's fifth title and name line, and each dictionary's. Measured 430,482 / 487,245 / 494,440 in the e2e build, the plus 4.
// 430,386 / 487,129 / 494,322 -> 430,430 / 487,177 / 494,357 on 2026-11-05, hold-confirm over main e68fe8cc (A4 (1), 2026-11-05): the index CSS's gauge rules and the dictionaries' hold words. Measured 430,426 / 487,173 / 494,353 in the e2e build, the plus 4.
// 430,386 / 487,129 / 494,322 -> 430,386 / 487,129 / 494,300 on 2026-11-05, ja-no-font-preload over main 24af89d7: the Japanese start page no longer preloads the font (scripts/site-pages.mjs withoutFontPreload; measured FCP 13.8 -> 10.3 s on 11-05, cp-archive 메모-20261105/ja-fcp). Only /ja/index.html shrinks, by the tag's gzip bytes: the woff2 stays in the Japanese total, since every language counts the files the Korean index.html links (the stylesheet still asks for the font on /ja/). Measured 430,382 / 487,125 / 494,296 in the e2e build, the plus 4.
// The files the Korean page links (the font among them) are counted for every language, whatever the language's own head says: /ja/ dropped the font preload on 2026-11-05 and its line fell by the tag's bytes only.
// -> 430,533 / 487,566 / 494,734 on 2026-11-05, bundle-1106a (A2 C2 C3/C4 C1 A3 A4 ja-preload D3) over main 33899116: the lines above together. Measured 430,529 / 487,562 / 494,730 in the e2e build, the plus 4.
// 432,043 / 489,484 / 496,601 -> 432,173 / 489,915 / 497,065 on 2026-11-06, bundle-1106a after merging main 7e1fe0f0 (#461 rules-1105, #458 bundle-mood): the two sides' lines together. Measured 432,169 / 489,911 / 497,061 in the e2e build, the plus 4.
// -> 432,365 / 489,860 / 496,995 on 2026-11-05, bundle-1105d after merging main 7e1fe0f0 (#461 rules bundle): the lines above together. Measured 432,361 / 489,856 / 496,991 in the e2e build, the plus 4.
// 432,173 / 489,915 / 497,065 -> 432,507 / 490,290 / 497,455 on 2026-11-06, bundle-1106a after merging main 6f58cbb8 (#459 bundle-1105d): the two sides' lines together. Measured 432,503 / 490,286 / 497,451 in the e2e build, the plus 4.
// 426,845 / 483,841 / 490,518 -> 426,941 / 484,121 / 490,812 on 2026-11-05, kd-spend-ui over main 2bd9a8ba (C9 PR 2, on PR 1 66bdce6a): the draft's buy buttons' CSS in the index sheet (the critical CSS only its hash) and the two dictionaries' relic lines above. Measured 426,937 / 484,117 / 490,808 in the e2e build, the plus 4.
// 426,941 / 484,121 / 490,812 -> 426,950 / 484,131 / 490,822 on 2026-11-05, kd-spend-ui trim over main 2bd9a8ba: the draft's buy rules moved to a sheet of their own (src/styles/app/draft-spend.css, imported after relics.css; the index CSS carries the same rules, the critical CSS only its hash) and index.html's hashed names moved with them. Measured 426,946 / 484,127 / 490,818 in the e2e build, the plus 4.
// 426,950 / 484,131 / 490,822 -> 426,950 / 484,169 / 490,868 on 2026-11-05, kd-spend-ui hint over main 2bd9a8ba: the draft's spendHint line in the two dictionaries above (the Korean line rides the engine chunk, not the first paint). Measured 426,946 / 484,165 / 490,864 in the e2e build, the plus 4; the Korean budget stays.
// The CI build (Linux) measures the first paint 4 bytes over this PC's e2e build (9e4ec6bf: Korean 426,929, Japanese 490,601):
// the budgets are the CI's plus 4, 426,933, 483,927 and 490,605.
// 426,933 / 483,927 / 490,605 -> 426,929 / 483,921 / 490,604 on 2026-11-05, phone-en-stake-11px over rules-mark-3b 9e91c588: the 360px English bank rail's 10px label rule went (play.css; the critical CSS does not carry it). Measured 426,921 / 483,916 / 490,594 in the e2e build here, 4 / 6 / 1 under cb904fb6's 426,925 / 483,922 / 490,595; the CI build reads 4 / 1 / 6 over this PC (30f5519d), so the budgets are the CI's expected 426,925 / 483,917 / 490,600 plus 4.
// en 487,123 -> 487,130 and ja 494,315 -> 494,328 on 2026-11-05, scout-narrow over main 8ac59b71: SCOUT costs 믿음 1 (B1, 11-05 decision (1)): the language dictionaries above. Measured 430,381 / 487,126 / 494,324 in the e2e build, the plus 4 (ko under its 430,390).
// 430,386 / 487,129 / 494,322 -> 430,401 / 487,134 / 494,327 on 2026-11-05, stake-clock over main e68fe8cc: the entry carries the stake's three layers (stakeLayers.js) for the score and the clock. Measured 430,397 / 487,130 / 494,323 in the e2e build, the plus 4.
// 432,043 / 489,484 / 496,601 -> 432,147 / 489,827 / 497,021 on 2026-11-05, bundle-rules2 (kd-spend-engine, kd-spend-ui, phone-en-stake-11px, scout-narrow, stake-clock over rules-1105 dd2cd419): the lines above together (the index CSS and the entry; en and ja by their dictionaries). Measured 432,143 / 489,823 / 497,017 in the e2e build, the plus 4.
// -> 432,479 / 490,209 / 497,421 on 2026-11-06, bundle-rules2 after merging main 6f58cbb8 (#459 묶음 1105d: 글자 크기, 결과 카드 습관 줄, 11px·aria-live, 캐논, 인트로 카드): #459's lines under the rules2 lines above. Measured 432,475 / 490,205 / 497,417 in the e2e build, the plus 4.
// 432,507 / 490,290 / 497,455 -> 432,622 / 490,652 / 497,862 on 2026-11-06, bundle-1106a after merging main e1f5e515 (#463 bundle-rules2): the two sides' lines together. Measured 432,618 / 490,648 / 497,858 in the e2e build, the plus 4.
// 432,622 / 490,652 / 497,862 -> 433,234 / 491,263 / 498,475 on 2026-11-06, mood-boost over main bb7781c7 (#464 bundle-1106a): the lines above (index CSS and entry). Measured 433,230 / 491,259 / 498,471 in the e2e build, the plus 4.
// en 490,209 -> 490,337 and ja 497,421 -> 497,551 on 2026-11-06, w47-rule-line over main e1f5e515: the test week (W47) told as a board of its own, since #461 made 감사·연쇄 rules of the table (src/copy/weekRule.js `line.testWeek`, the two box labels; ko/en/ja). Measured 490,333 / 497,547 in the e2e build, the plus 4 (ko 432,474 under its 432,479).
// -> 433,241 / 491,404 / 498,624 on 2026-11-06, w47-rule-line after merging main d7dadd92 (#464, #465): the W47 lines over main's. Measured 433,237 / 491,400 / 498,620 in the e2e build, the plus 4.
// 433,241 / 491,404 / 498,624 -> 433,243 / 491,405 / 498,624 on 2026-11-06, cold-opening after merging main 97366b95 (#468 w47-rule-line): B-3(1) with its switch off (the entry line above) over the W47 lines. Measured 433,239 / 491,401 / 498,620 in the e2e build, the plus 4.
// 433,241 / 491,404 / 498,624 -> 434,268 / 492,190 / 499,699 on 2026-11-06, static-shell-2 after merging main 97366b95 (#465 mood-boost, #468 w47-rule-line; decision 13 (1)): the build writes the intro's first viewport into #root of index.html and the /en/ and /ja/ start pages (scripts/static-shell.mjs) with the header pills, kicker and premise hidden in the page's language and Japanese's face, the critical CSS now cut at 360px and on /en/ and /ja/ too, and the art's box from the viewport. Measured 434,264 / 492,186 / 499,695 in the e2e build, the plus 4.
// -> 434,273 / 492,195 / 499,703 on 2026-11-06, bundle-1106b (static-shell-2 6ac68416, mood-tags-2 9b6973cd over main 97366b95): the lines above together; the entry names the case chunks that now carry 692 mood tags. Measured 434,269 / 492,191 / 499,699 in the e2e build, the plus 4.
// 433,243 / 491,405 / 498,624 -> 434,283 / 492,205 / 499,714 on 2026-11-06, bundle-1106b after merging main ac0645d3 (#471 cold-opening, B-3(1) switched off): the static shell and mood-tag lines above over the cold opening's entry line. Measured 434,279 / 492,201 / 499,710 in the e2e build, the plus 4.
// 434,283 / 492,205 / 499,714 -> 434,341 / 492,256 / 499,767 on 2026-11-09, hand-fit-2px (#476) over main 49f50741: the index CSS line above (the critical CSS cut again). Measured 434,337 / 492,252 / 499,763 in the e2e build, the plus 4.
// 434,341 / 492,256 / 499,767 -> 434,496 / 492,417 / 499,945 on 2026-11-09, content-pages over main 775bb69a (#476): no script changed; index.html carries the site's links (the static shell's hidden menu under its floor and four more no-script links, scripts/static-shell.mjs, site-pages.mjs `startNoscript`), and /en/ and /ja/ theirs. Measured 434,492 / 492,413 / 499,941 in the e2e build, the plus 4.
// 434,283 / 492,205 / 499,714 -> 434,276 / 492,231 / 499,742 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 49f50741 (#475): the en/ja dictionaries above; the entry's gzip by the chunk names it imports. Measured 434,272 / 492,227 / 499,738 in the e2e build, the plus 4.
// 434,341 / 492,256 / 499,767 -> 434,342 / 492,290 / 499,801 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 775bb69a (#476 hand-fit-2px): the en/ja dictionary lines above over #476's index CSS. Measured 434,338 / 492,286 / 499,797 in the e2e build, the plus 4.
// 434,342 / 492,290 / 499,801 -> 434,328 / 492,274 / 499,786 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main ade608e5 (#481 studio-we-1109): the entry's credit lines and the start pages' studio name. Measured 434,324 / 492,270 / 499,782 in the e2e build, the plus 4.
// 434,496 / 492,417 / 499,945 -> 434,483 / 492,435 / 499,965 on 2026-11-09, table-a11y-2 (E3 stage 2) after merging main 283a74db (#478 content-pages): the en/ja dictionary lines above over content-pages' site links and #481's entry. Measured 434,479 / 492,431 / 499,961 in the e2e build, the plus 4.
// 434,496 / 492,417 / 499,945 -> 434,588 / 492,508 / 500,036 on 2026-11-09, phone-390-fit over main 283a74db (#478): the index CSS line above. Measured 434,584 / 492,504 / 500,032 in the e2e build, the plus 4.
// 434,483 / 492,435 / 499,965 (#482) and 434,588 / 492,508 / 500,036 (#483) -> 434,586 / 492,538 / 500,068 on 2026-11-09, bundle 1109b: #482 #483 #487 over main 937d5170: #483's and #487's CSS in the index sheet with #482's en/ja dictionary lines. Measured 434,582 / 492,534 / 500,064 in the e2e build, the plus 4.
// 434,586 / 492,538 / 500,068 -> 434,919 / 492,851 / 500,415 on 2026-11-09, pages-a11y-ld after merging main c1d08daa (#488 bundle 1109b): no script changed; the start page's head carries the site and the game as JSON-LD (scripts/structured-data.mjs, `startStructuredData` in site-pages.mjs; 685 bytes raw, one line), and /en/ and /ja/ theirs. Measured 434,915 / 492,847 / 500,411 in the e2e build, the plus 4.
// 434,586 / 492,538 / 500,068 -> 434,597 / 492,551 / 500,080 on 2026-11-09, a32-411-fit over main c1d08daa (#488): the index CSS line above and the critical CSS it regenerates. Measured 434,593 / 492,547 / 500,076 in the e2e build, the plus 4.
// 434,919 / 492,851 / 500,415 (#489) and 434,597 / 492,551 / 500,080 (a32-411-fit) -> 434,929 / 492,863 / 500,426 on 2026-11-09, a32-411-fit after merging main f97f5079 (#489 pages-a11y-ld, #490): #489's JSON-LD in the start pages' heads with this branch's index CSS. Measured 434,925 / 492,859 / 500,422 in the e2e build, the plus 4.
// 434,919 / 492,851 / 500,415 -> 434,954 / 492,886 / 500,449 on 2026-11-09, phone-heavy-bank over main d07a852b (#489): the index CSS line above. Measured 434,950 / 492,882 / 500,445 in the e2e build, the plus 4.
// 434,929 / 492,863 / 500,426 (#493) and 434,954 / 492,886 / 500,449 (phone-heavy-bank) -> 434,945 / 492,876 / 500,438 on 2026-11-10, phone-heavy-bank after merging a32-follow (#493) and main b4535e99: the index CSS line above and the critical CSS it regenerates. Measured 434,941 / 492,872 / 500,434 in the e2e build, the plus 4.
// 434,945 / 492,876 / 500,438 -> 435,003 / 492,935 / 500,498 on 2026-11-10, en-signals-row over main e7ccb410 (#491): the index CSS line above and the critical CSS it regenerates. Measured 434,999 / 492,931 / 500,494 in the e2e build, the plus 4.
// 434,945 / 492,876 / 500,438 -> 434,945 / 493,237 / 500,846 on 2026-11-10, enja-text-check (E4) over main e7ccb410: the English and Japanese dictionaries' lines above (Korean unchanged, measured 434,944). Measured 493,233 / 500,842 in the e2e build, the plus 4.
// 434,945 / 493,237 / 500,846 -> 434,965 / 493,253 / 500,862 on 2026-11-10, phone-390-bank over main 201ca8ce (#496): the index CSS line above and the critical CSS it regenerates. Measured 434,961 / 493,249 / 500,858 in the e2e build, the plus 4.
// 435,003 / 492,935 / 500,498 (en-signals-row) and 434,965 / 493,253 / 500,862 (#496 #497) -> 435,021 / 493,308 / 500,919 on 2026-11-10, en-signals-row after merging main 261accef (#496 #497): the index CSS line above, the critical CSS it regenerates and #496's dictionaries. Measured 435,017 / 493,304 / 500,915 in the e2e build, the plus 4.
// 434,965 / 493,253 / 500,862 -> 435,162 / 493,451 / 501,061 on 2026-11-10, music-tier-crackle after merging main 261accef (#496 enja-text-check, #497 phone-390-bank): the entry line above. Measured 435,158 / 493,447 / 501,057 in the e2e build, the plus 4.
// 435,162 / 493,451 / 501,061 -> 435,179 / 493,468 / 501,077 on 2026-11-10, phone-846-staked over main b77e4bfe (#498): the index CSS line above and the critical CSS it regenerates. Measured 435,175 / 493,464 / 501,073 in the e2e build, the plus 4.
// 435,021 / 493,308 / 500,919 (en-signals-row) and 435,162 / 493,451 / 501,061 (#498) -> 435,217 / 493,503 / 501,114 on 2026-11-10, en-signals-row after merging main b77e4bfe (#498): both. Measured 435,213 / 493,499 / 501,110 in the e2e build, the plus 4.
// 435,179 / 493,468 / 501,077 (phone-846-staked) and 435,217 / 493,503 / 501,114 (#499) -> 435,226 / 493,515 / 501,125 on 2026-11-10, phone-846-staked after merging main 3a507805 (#499): both, and the critical CSS regenerated. Measured 435,222 / 493,511 / 501,121 in the e2e build, the plus 4.
// 426,761 / 483,722 / 490,404 -> 427,739 / 485,001 / 491,707 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 425eb4da (#392 #398 #395). Measured 427,735 / 484,997 / 491,703, the plus 4.
// 427,739 / 485,001 / 491,707 -> 427,836 / 485,326 / 492,038 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases b40aa7d1 (main 425eb4da). Measured 427,832 / 485,322 / 492,034, the plus 4.
// 427,224 / 484,654 / 491,361 -> 427,224 / 484,660 / 491,367 on 2026-11-03, E-11 번외 사건 온라인 저장 (draft) over e11-side01 9ce20c45 (main 465ccb93). Measured under / 484,656 / 491,363, the plus 4.
// 427,836 / 485,326 / 492,038 -> 427,842 / 485,336 / 492,048 on 2026-11-03, E-11 번외 사건 온라인 저장 (draft) over e11-side01 dca98f20 (main 425eb4da). Measured 427,838 / 485,332 / 492,044, the plus 4.
// 427,224 / 484,660 / 491,367 -> 427,277 / 484,764 / 491,463 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud c2954023 (main 465ccb93). Measured 427,273 / 484,760 / 491,459, the plus 4.
// 427,842 / 485,336 / 492,048 -> 427,893 / 485,443 / 492,146 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud dbab06b9 (main 425eb4da). Measured 427,889 / 485,439 / 492,142, the plus 4.
// 427,277 / 484,764 / 491,463 -> 427,334 / 484,869 / 491,564 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 57313263 (main 465ccb93). Measured 427,330 / 484,865 / 491,560, the plus 4.
// 427,893 / 485,443 / 492,146 -> 427,957 / 485,552 / 492,251 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 900d1946 (main 425eb4da). Measured 427,953 / 485,548 / 492,247, the plus 4.
// 435,217 / 493,503 / 501,114 -> 436,297 / 494,902 / 502,517 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: the entry's side slot and the two dictionaries' side lines. Measured 436,293 / 494,898 / 502,513, the plus 4.
// 436,297 / 494,902 / 502,517 -> 436,303 / 494,909 / 502,522 on 2026-11-10, E-11 번외 사건 틀 (draft) over main cb8346da (#500): main's index CSS and critical CSS under the side slot. Measured 436,299 / 494,905 / 502,518, the plus 4.
// 435,226 / 493,515 / 501,125 -> 435,238 / 493,525 / 501,135 on 2026-11-10, phone-390-staked over main cb8346da (#500): the index CSS line above and the critical CSS it regenerates. Measured 435,234 / 493,521 / 501,131 in the e2e build, the plus 4.
// 435,226 / 493,515 / 501,125 -> 435,276 / 493,566 / 501,174 on 2026-11-10, deps-1123: vite 8.3.6 / lucide-react 1.69 after merging main cb8346da (#500 phone-846-staked; replaces Dependabot #479 and #480): the entry and icons-vendor lines above. Measured 435,272 / 493,562 / 501,170 in the e2e build, the plus 4.
// 435,238 / 493,525 / 501,135 (phone-390-staked) and 435,276 / 493,566 / 501,174 (deps-1123) -> 435,285 / 493,575 / 501,186 on 2026-11-10, phone-390-staked after merging main 312aa15c (#484): both. Measured 435,281 / 493,571 / 501,182 in the e2e build, the plus 4.
// 426,761 / 483,722 / 490,404 -> 426,808 / 483,769 / 490,455 on 2026-11-03, C-15 over main 425eb4da (#392 #398 #395), the badge fold and describeStakedDetail. Measured 426,804 / 483,765 / 490,451, the plus 4.
// 435,226 / 493,515 / 501,125 -> 435,280 / 493,569 / 501,178 on 2026-11-10, C-15 over main cb8346da (#499 #500): the index CSS line above. Measured 435,276 / 493,565 / 501,174 in the e2e build, the plus 4.
// 435,280 / 493,569 / 501,178 (C-15) and 435,285 / 493,575 / 501,186 (main) -> 435,335 / 493,624 / 501,233 on 2026-11-11, C-15 after merging main 568572d3 (#484 #502 #503): both, and the critical CSS regenerated. Measured 435,331 / 493,620 / 501,229 in the e2e build, the plus 4.
// 435,285 / 493,575 / 501,186 -> 436,501 / 495,333 / 502,949 on 2026-11-11, E-11 번외 1 (draft) over e11-side-cases c0d04767 and main 568572d3 (#484 #502 #503): the side slot and side01 in the entry, the dictionaries' side lines and the overlay's side pack. Measured 436,497 / 495,329 / 502,945, the plus 4.
// 435,226 / 493,515 / 501,125 -> 435,238 / 493,525 / 501,135 on 2026-11-10, phone-390-staked over main cb8346da (#500): the index CSS line above and the critical CSS it regenerates. Measured 435,234 / 493,521 / 501,131 in the e2e build, the plus 4.
// 435,226 / 493,515 / 501,125 -> 435,276 / 493,566 / 501,174 on 2026-11-10, deps-1123: vite 8.3.6 / lucide-react 1.69 after merging main cb8346da (#500 phone-846-staked; replaces Dependabot #479 and #480): the entry and icons-vendor lines above. Measured 435,272 / 493,562 / 501,170 in the e2e build, the plus 4.
// 435,226 / 493,515 / 501,125 -> 435,455 / 493,744 / 501,354 on 2026-11-10, cold-opening-style (#477) over main cb8346da: the entry line above (the switch on). Measured 435,451 / 493,740 / 501,350 in the e2e build, the plus 4.
// 435,276 / 493,566 / 501,174 (deps-1123) and 435,455 / 493,744 / 501,354 (cold-opening-style) -> 435,526 / 493,816 / 501,425 on 2026-11-10, cold-opening-style after merging main 312aa15c (#484): both. Measured 435,522 / 493,812 / 501,421 in the e2e build, the plus 4.
// 435,238 / 493,525 / 501,135 (phone-390-staked) and 435,276 / 493,566 / 501,174 (deps-1123) -> 435,285 / 493,575 / 501,186 on 2026-11-10, phone-390-staked after merging main 312aa15c (#484): both. Measured 435,281 / 493,571 / 501,182 in the e2e build, the plus 4.
// 435,526 / 493,816 / 501,425 (cold-opening-style) and 435,285 / 493,575 / 501,186 (#503 phone-390-staked) -> 435,529 / 493,820 / 501,428 on 2026-11-11, cold-opening-style after merging main 568572d3 (#502 #503): both. Measured 435,525 / 493,816 / 501,424 in the e2e build, the plus 4.
// 435,226 / 493,515 / 501,125 -> 371,424 / 429,687 / 437,379 on 2026-11-10, font-split over main cb8346da (the user's choice 1, held for W47 and released on 11-10): the font is two files and only the first, the start screen's characters, is preloaded (199,124 -> 131,352); the stylesheet carries the second file's unicode-range (inline critical CSS too). Measured 371,420 / 429,683 / 437,375 in the e2e build, the plus 4.
// 371,424 / 429,687 / 437,379 (font-split) and 435,285 / 493,575 / 501,186 (main 568572d3: #484 deps, #503) -> 371,483 / 429,748 / 437,438 on 2026-11-11, font-split after merging main 568572d3: both, and the critical CSS regenerated. Measured 371,479 / 429,744 / 437,434 in the e2e build, the plus 4.
// 371,483 / 429,748 / 437,438 -> 371,465 / 429,729 / 437,420 on 2026-11-11, phone-390-staked-all over main d4048d83 (#426): the index CSS line above and the critical CSS it regenerates. Measured 371,461 / 429,725 / 437,416 in the e2e build, the plus 4.
// 435,529 / 493,820 / 501,428 (cold-opening-style) and 371,483 / 429,748 / 437,438 (#426 font-split) -> 371,726 / 429,990 / 437,682 on 2026-11-11, cold-opening-style after merging main d4048d83 (#426): both, and the critical CSS regenerated (the same bytes as main's). Measured 371,722 / 429,986 / 437,678 in the e2e build, the plus 4.
// 426,761 / 483,722 / 490,404 -> 427,739 / 485,001 / 491,707 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 425eb4da (#392 #398 #395). Measured 427,735 / 484,997 / 491,703, the plus 4.
// 435,217 / 493,503 / 501,114 -> 436,297 / 494,902 / 502,517 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: the entry's side slot and the two dictionaries' side lines. Measured 436,293 / 494,898 / 502,513, the plus 4.
// 436,297 / 494,902 / 502,517 -> 436,303 / 494,909 / 502,522 on 2026-11-10, E-11 번외 사건 틀 (draft) over main cb8346da (#500): main's index CSS and critical CSS under the side slot. Measured 436,299 / 494,905 / 502,518, the plus 4.
// 435,226 / 493,515 / 501,125 -> 435,543 / 493,837 / 501,430 on 2026-11-10, memory-line-i18n (draft) over main cb8346da: the entry's memory line and stale-book refresh (above). Measured 435,539 / 493,833 / 501,426, plus 4.
// -> 436,673 / 495,280 / 502,895 on 2026-11-11, bundle 1111 (#350 #301 #501) over main 568572d3: the three together, and the critical CSS regenerated. Measured 436,669 / 495,276 / 502,891 in the e2e build, the plus 4.
// 435,226 / 493,515 / 501,125 -> 371,424 / 429,687 / 437,379 on 2026-11-10, font-split over main cb8346da (the user's choice 1, held for W47 and released on 11-10): the font is two files and only the first, the start screen's characters, is preloaded (199,124 -> 131,352); the stylesheet carries the second file's unicode-range (inline critical CSS too). Measured 371,420 / 429,683 / 437,375 in the e2e build, the plus 4.
// 371,424 / 429,687 / 437,379 (font-split) and 435,285 / 493,575 / 501,186 (main 568572d3: #484 deps, #503) -> 371,483 / 429,748 / 437,438 on 2026-11-11, font-split after merging main 568572d3: both, and the critical CSS regenerated. Measured 371,479 / 429,744 / 437,434 in the e2e build, the plus 4.
// 371,483 / 429,748 / 437,438 (font-split) and 436,673 / 495,280 / 502,895 (bundle 1111) -> 372,867 / 431,449 / 439,148 on 2026-11-11, bundle 1111 (#350 #301 #501) after merging main d4048d83 (#426 font-split): both, the critical CSS regenerated. Measured 372,863 / 431,445 / 439,144 in the e2e build, the plus 4.
// -> 372,960 / 431,541 / 439,239 on 2026-11-11, bundle 1111 after build:fonts (냄, 짧) and the critical CSS regenerated. Measured 372,956 / 431,537 / 439,235 in the e2e build, the plus 4.
// -> 373,130 / 431,933 / 439,637 on 2026-11-11, E-11 번외 1 (#314) over main 5c93b496 (#504). Measured first paint, the plus 4.
// -> 373,139 / 431,941 / 439,646 on 2026-11-11, E-11 번외 온라인 저장 (#317) over #314 9b34ba69 (main 5c93b496). Measured first paint, the plus 4.
// -> 373,207 / 432,060 / 439,755 on 2026-11-11, E-11 번외 2 (#321) over #317 f657d6ad (main 5c93b496). Measured first paint, the plus 4.
// -> 373,292 / 432,194 / 439,886 on 2026-11-11, E-11 번외 3 (#333) over #321 (main 5c93b496). Measured first paint, the plus 4.
// -> 373,291 / 431,871 / 439,569 on 2026-11-11, cold-opening-style (#477) after merging main 5c93b496 (#504): both. Measured 373,287 / 431,867 / 439,565 in the e2e build, the plus 4.
// -> 373,408 / 432,211 / 439,916 on 2026-11-11, E-11 번외 1 (#314) after merging main 808834eb (#477). Measured first paint, the plus 4.
// -> 373,461 / 432,264 / 439,968 on 2026-11-11, C-15 after merging main c61d6618. Measured first paint, the plus 4.
// -> 373,416 / 432,221 / 439,926 on 2026-11-11, prose-trim-19-28 over main c61d6618. Measured first paint, the plus 4.
// -> 373,432 / 432,235 / 439,938 on 2026-11-11, E-11 번외 온라인 저장 (#317) after merging main c61d6618 (#314). Measured first paint, the plus 4.
// -> 373,484 / 432,339 / 440,036 on 2026-11-11, E-11 번외 2 (#321) after merging main d53a6ab2 (#317). Measured first paint, the plus 4.
// -> 373,551 / 432,455 / 440,147 on 2026-11-11, E-11 번외 3 (#333) after merging main accd990b (#321). Measured first paint, the plus 4.
// -> 373,484 / 432,346 / 440,041 on 2026-11-11, prose-trim-19-28 after merging main accd990b (#321). Measured first paint, the plus 4.
// -> 373,490 / 432,344 / 440,036 on 2026-11-11, prose-trim-29-38 over main accd990b. Measured first paint, the plus 4.
// -> 373,490 / 432,347 / 440,045 on 2026-11-11, noscript-guide over main accd990b. Measured first paint, the plus 4.
// -> 373,557 / 432,468 / 440,161 on 2026-11-11, bundle 1111b (#505 #506 #507 #508) over main 72d10e69. Measured first paint, the plus 4.
// -> 373,551 / 432,465 / 440,155 on 2026-11-11, prose-trim-39-final over main 72d10e69. Measured first paint, the plus 4.
// -> 373,551 / 432,520 / 440,218 on 2026-11-11, recheck-in-case over main 52027156. Measured first paint, the plus 4.
// -> 373,605 / 432,518 / 440,211 on 2026-11-11, C-15 after merging main fbf1000c. Measured first paint, the plus 4.
// -> 373,605 / 432,565 / 440,262 bundle 1112a (#514 #322) over main fbf1000c. Measured first paint, the plus 4.
// -> 373,585 / 432,524 / 440,230 on 2026-11-12, e3-status (지금 상황 듣기) over main fbf1000c, critical CSS regenerated. Measured first paint, the plus 4.
// -> 373,551 / 432,788 / 440,476 on 2026-11-12, c2c3-result over main fbf1000c (C2-1 nearest ending, C3-3 card line, C3-4 witness paragraph). Measured first paint, the plus 4.
// -> 373,645 / 432,958 / 440,676 bundle 1112c (#520 #521) over main 4f927085. Measured first paint, the plus 4.
// -> 373,611 / 432,578 / 440,275 on 2026-11-12, bundle 1112b (#516 #517) over main 4f927085, CI measured (373,607 / 432,574 / 440,271), the plus 4.
// -> 373,634 / 432,946 / 440,665 bundle 1112c (#520 #521 390) over main e3687e46. Measured first paint, the plus 4.
// -> 373,687 / 433,129 / 440,892 c4c5-copy over main 7ec2304e. Measured first paint, the plus 4.
// -> 373,683 / 432,970 / 440,695 a2a3-ending over main 7ec2304e. Measured first paint, the plus 4.
const FIRST_PAINT_BUDGETS = { ko: 373_683, en: 432_970, ja: 440_695 };
const LOCALE_FIRST_PAINT = {
  en: [/^locale-overlay-.*\.js$/, /^locale-en-index-.*\.js$/],
  ja: [/^locale-overlay-.*\.js$/, /^locale-ja-index-.*\.js$/],
};

let files;
try {
  files = readdirSync(assetsDir);
} catch {
  console.error("Bundle size check could not find dist/assets. Run npm run build first.");
  process.exit(1);
}

const failures = [];
const reported = [];
const budgeted = new Set();
for (const budget of budgets) {
  // Every match, not the first: a second `index-*.js` would otherwise ride in
  // unmeasured behind the one the list happened to return first.
  const matches = files.filter((name) => budget.pattern.test(name));
  if (!matches.length) failures.push(`no bundle matched ${budget.pattern}`);
  for (const file of matches) {
    budgeted.add(file);
    checkBudget(file, budget);
  }
}
for (const file of files) {
  if (!budgeted.has(file)) failures.push(`${file} has no size budget. Every file the build emits into dist/assets needs one.`);
}
for (const file of files.filter((name) => name.endsWith(".js"))) {
  const source = readFileSync(path.join(assetsDir, file), "utf8");
  for (const marker of MUST_NOT_SHIP) {
    if (source.includes(marker)) failures.push(`${file} contains "${marker}": the debug tools are in this build.`);
  }
}

function checkBudget(file, budget) {
  const assetPath = path.join(assetsDir, file);
  const bytes = statSync(assetPath).size;
  if (bytes > budget.maxBytes) failures.push(`${file} is ${bytes} bytes, over the ${budget.maxBytes} byte budget.`);
  if (budget.compressed) {
    reported.push(`${file}: ${bytes} bytes`);
    return;
  }
  const gzipBytes = gzipSync(readFileSync(assetPath)).length;
  const gzipBudget = budget.maxGzip ?? Math.ceil(budget.maxBytes * 0.4);
  reported.push(`${file}: ${bytes} bytes raw / ${gzipBytes} bytes gzip`);
  if (gzipBytes > gzipBudget) failures.push(`${file} is ${gzipBytes} gzip bytes, over the ${gzipBudget} gzip budget.`);
}

// The service worker (src/serviceWorker/worker.js), written to the root by
// `serviceWorker()` in vite.config.js. Its size is its code plus one line that
// lists every file of the release: 8,358 / 2,992 on 2026-10-06, plus 5%. It
// is fetched after `load`, so it is on no paint's path.
// 8,780 / 3,150 -> 8,792 / 3,171 on 2026-10-19, measured 8,792 / 3,167 (gzip
// plus the 4 bytes of hash noise): the list names two more files, the chunks
// 이번 주의 규칙 was split into above; the worker's code did not change.
// 8,792 / 3,171 -> 8,828 / 3,183 on 2026-10-20, measured 8,828 / 3,179 (gzip
// plus 4): one more file, the week's rule's briefing panel (WeekRulePanel).
// 8,828 / 3,183 -> 8,862 / 3,200 on 2026-10-20, measured 8,862 / 3,196 on main
// after #209 (3,188-3,196 on the day's three mains; main itself 8,754 / 3,146)
// plus 4: the same three more file names in a longer list.
// 8,828 / 3,183 -> 8,860 / 3,196 on 2026-10-20, measured 8,860 / 3,192 (gzip
// plus 4): one more file, B3's audit (auditRisk).
// 8,862 / 3,200 -> 8,896 / 3,215 on 2026-10-21 (B2, #208, draft), measured
// 8,896 / 3,211 plus 4 (main 8,862 / 3,194): one more file, cascadeRisk.
// 8,894 / 3,217 -> 8,928 / 3,231 on 2026-10-21, the test week: both risks'
// files in the list, measured 8,928 / 3,227 plus 4.
// 8,928 / 3,231 -> 8,962 / 3,248 on 2026-10-21 (F1 phase 2, #216, draft),
// measured 8,962 / 3,244 plus 4: one more file, the replay trail's chunk.
// 8,993 / 3,261 on 2026-10-23 in batch B, measured 8,993 / 3,257 plus 4:
// the replay trail's chunk and CaseCast both in the list.
// 8,928 / 3,231 -> 8,959 / 3,240 on 2026-10-22 (reading-layout, draft),
// measured 8,959 / 3,236 plus 4: one more file in the list, CaseCast.
// 8,928 / 3,231 -> 8,961 / 3,244 on 2026-10-21 (A5, draft), measured 8,961 /
// 3,240 plus 4 (main 8,928 / 3,222): one more file, EdgeNotice.
// 8,928 / 3,231 -> 8,966 / 3,246 on 2026-10-22 (story-first10, #241, draft):
// one more file, the reading clock's question (ReadingClockAsk), measured
// 8,966 / 3,242 plus 4.
// On main's 8,962 / 3,248 (#216, the trail's chunk) both files together
// measured 9,000 / 3,258 on 2026-10-23, rebased on 2c7b535: 9,000 / 3,262.
// 8,962 / 3,248 -> 8,997 / 3,258 for ops-measure (2026-10-23), measured
// 8,997 / 3,254 plus 4: one more file, sceneChoices (E-6).
// -> 9,068 / 3,294 on 2026-10-23, 10-23 묶음 A 합친 상태 실측: EdgeNotice,
// ReadingClockAsk and sceneChoices all in the list, measured 9,068 / 3,290
// plus 4.
// [batch-c] #272 w4b-bubbles on 묶음 A + #261:
// 8,962 / 3,248 -> 8,996 / 3,261 on 2026-10-23 (A-2, on #220), measured
// 8,996 / 3,257 plus 4: one more file, the briefing balloon's speakerLine.
// -> 9,102 / 3,312 on 2026-10-23, 10-23 묶음 C 합친 상태 실측 (묶음 A + #261 +
// #272, speakerLine in the list too): measured 9,102 / 3,308 plus 4.
// [batch-c] 묶음 B (#277):
// 9,099 / 3,309 on 2026-10-23, batch B on batch A, measured 9,099 / 3,305
// plus 4: CaseCast and batch A's three files all in the list.
// -> 9,133 / 3,328 on 2026-10-23, 묶음 C (A + B + #261 + #272) 합친 상태 실측:
// measured 9,133 / 3,319 and, after the CI fixes, 3,324; the larger gzip plus 4.
// -> 9,207 / 3,356 on 2026-10-24, Vite 8 (#225) rebased on main 3d43a239:
// measured 9,207 / 3,352 plus 4 (two builds, the same). The list names two
// more files than main's, rolldown-runtime and gameData.app; the worker's
// code did not change.
// -> 9,272 / 3,382 on 2026-10-24, rebased on main 048ffce5 (#233): measured
// 9,272 / 3,378 plus 4. Two more files in the list, gameLogic and RelicDraft
// (see GameRuntime above); the worker's code did not change.
// 9,272 / 3,382 -> 9,272 / 3,386 on 2026-10-24, Vite 8 (#225) on main
// e72c415f: measured 9,272 / 3,382, at the ceiling, plus 4.
// -> 9,310 / 3,409 on 2026-10-24, E-12: measured 9,310 / 3,400 and, on main
// b0eb9cb0 (#287), 3,405; the larger plus 4. One
// more file in the list, cloudDeviceRecords, and gameData.app is now named
// pastPicks; the worker's code did not change.
// -> 9,340 / 3,424 on 2026-10-24 (B-11(1) 막 표지, on main ea5b74aa): measured
// 9,340 / 3,415 here and 3,420 in CI (the file names' hashes); the larger plus
// 4. One more file in the list, ActCard; the worker's code did not change.
// -> 9,376 / 3,435 on 2026-10-25, #224 rebased on main 0d0c7dbb: measured
// 9,376 / 3,431 plus 4. One more file in the list, personalBests.
// -> 3,431 gzip on 2026-10-25, 묶음 시대고증(#313): the chunk names' hashes
// only (measured 3,427 plus 4); the worker's code did not change.
// -> 9,863 / 3,555 on 2026-10-25, 개인정보처리방침·이용약관: the worker
// answers the four policy pages network first and keeps them (DOCUMENT_PAGE,
// answerPage), and the warm list names them. Measured 9,863 / 3,551 plus 4.
// -> 9,897 / 3,567 on 2026-10-26, pwa-install-hint: one more file in the warm
// list, InstallHint; the worker's code did not change. Measured 9,897 / 3,563
// plus 4.
// -> 9,897 / 3,573 on 2026-10-26, funnel-locale: the chunk names' hashes only;
// the worker's code did not change. Measured 9,897 / 3,569 plus 4.
// 9,897 / 3,573 -> 9,948 / 3,586 on 2026-10-28, lang-extras: the Japanese privacy policy and terms join its
// network-first pages and its warm-up list. Measured 9,944 / 3,582.
// 9,948 / 3,586 -> 10,106 / 3,624 on 2026-10-29, adsense-readiness: the about, FAQ and contact pages in three languages
// join its network-first pages and its warm-up list (nine names). Measured 10,102 / 3,620 over main 3e350266.
// -> 9,933 / 3,584 on 2026-10-29, #224 (RULES_MARK 3, C-2, personal bests) merged with main 11cb3b16 (다국어 틀): one more file in the warm list,
// personalBests. Measured 9,933 / 3,580 plus 4.
// 10,106 / 3,624 -> 10,138 / 3,642 on 2026-10-30, #224 merged with main 430dda1e: personalBests in the warm list beside main's nine pages. Measured 10,138 / 3,638 plus 4.
// -> 9,376 / 3,441 on 2026-10-25, C-1(1) on #224 0c989ba7: measured 9,376 /
// 3,437 and 3,436 in two e2e builds (the file names' hashes), the larger plus
// 4; the worker's code did not change.
// -> 9,376 / 3,444 on 2026-10-25, table-rhythm-bundle (C-7, B-13(2), C-10) on #224 0c989ba7:
// measured 3,440 and 3,445 gzip (two builds), the larger plus 4; the same files, their hashes only.
// 3,642 -> 3,649 gzip on 2026-10-30, 통합 리허설 (#379) over #224 0d29141a (the English bank rail at 360px) with #307 #316 #320 #308. Measured 3,645 plus 4.
// 3,642 -> 3,647 gzip on 2026-11-02, table-rhythm-bundle (#316) merged with #224 8dd649ce (main b2558d55). Measured 3,643 in the e2e build, the gzip plus 4.
// 3,624 -> 3,629 gzip on 2026-11-02, money-feedback over main 9be94346: the warm-up list's hashed names only. Measured 3,625, the plus 4.
// 10,138 / 3,642 -> 10,138 / 3,643 on 2026-11-03, #224 merged with main 465ccb93: personalBests in the warm list beside main's nine pages and hashed names. Measured 10,138 / 3,639, the gzip plus 4.
// 10,106 / 3,624 -> 10,139 / 3,639 on 2026-11-02, plate-story over main 9be94346 (#392): scene plates place the sound beside its source (src/plateStory.js), mark the player figure, and draw the case ending on the result screen. Measured 10,135 / 3,635, the plus 4.
// 10,106 / 3,629 -> 10,139 / 3,643 on 2026-11-02, plate-story over main b5abd681 (#392, with #391): Measured 10,135 / 3,639, the plus 4.
// 3,643 -> 3,651 gzip on 2026-11-03, canon-fixes-2 over canon-fixes-1 (#424): the warm-up list's hashed names only. Measured 10,135 / 3,647, the plus 4.
// 10,139 / 3,651 -> 10,237 / 3,676 on 2026-11-04, seo-locale-start over main 22f43342: the worker answers /en/ and /ja/ as the page (LANGUAGE_START). Measured 10,233 / 3,672, the plus 4.
// 10,139 / 3,651 -> 10,176 / 3,662 on 2026-11-04, perf-first-visit over main 22f43342: the locale preload joins the files the page names. Measured 10,172 / 3,658, the plus 4.
// 10,139 / 3,651 -> 10,274 / 3,696 on 2026-11-04, bundle-1104a over main 2bd9a8ba: the two lines above together (the start pages and the locale preload). Measured 10,270 / 3,692 in the e2e build, the plus 4.
// 10,139 / 3,651 -> 10,179 / 3,660 on 2026-11-04, board-auto-hide over main 2bd9a8ba: one more file in the warm list, boardBlockedTerms; the worker's code did not change. Measured 10,175 / 3,656, the plus 4.
// 10,274 / 3,696 -> 10,314 / 3,712 on 2026-11-05, board-auto-hide over main 3d4183e5: one more file in the warm list, boardBlockedTerms, beside the start pages and the locale preload. Measured 10,310 / 3,708 in the e2e build, the plus 4.
// 10,139 / 3,643 -> 10,171 / 3,660 on 2026-11-03, #224 merged with main cb904fb6: personalBests in the warm list beside main's ScenePlate. Measured 10,171 / 3,656, the gzip plus 4.
// 3,660 -> 3,666 gzip on 2026-11-03, 통합 리허설 (#379) over #224 30f5519d: the warm list's hashed names. Measured 3,662, the gzip plus 4.
// 10,314 / 3,712 -> 10,350 / 3,724 on 2026-11-05, rules-1105 (#379 = #224 #307 #316 #320 #308 over main 24af89d7): the lines above together. one more file in the warm list (personalBests). Measured 10,346 / 3,720 in the e2e build, the plus 4.
// 3,724 -> 3,731 gzip on 2026-11-05, rules-1105 after merging main 33899116 (#456 #457 #460 prose bundles a-c): the warm list's hashed names only. Measured 10,346 / 3,727, the gzip plus 4.
// 3,712 -> 3,719 gzip on 2026-11-05, mood-wire over mood-tags 98d32622: the raw bytes are the same 10,310; the hashed names in its warm list changed. Measured 10,310 / 3,715 in the e2e build, the gzip plus 4.
// 3,731 -> 3,737 gzip on 2026-11-06, bundle-1106b after merging main ac0645d3 (#471 cold-opening): the warm list's hashed names only (raw 10,346 the same). Measured 10,346 / 3,733, the gzip plus 4.
// 10,346 / 3,737 -> 10,619 / 3,810 on 2026-11-09, content-pages over main 49f50741: the worker keeps the content pages (DOCUMENT_PAGE: the guide, the cast, the making-of, the case files) and the warm list names twelve more pages, the case files' index among them (a case's own page is kept once read, not warmed). Measured 10,615 / 3,806 in the e2e build, the plus 4.
// 10,619 / 3,810 -> 10,688 / 3,826 on 2026-11-10, cold-opening-style (#477) over main cb8346da: the warm list names the cold opening's two files now that the switch is on. Measured 10,684 / 3,822, the plus 4.
// 3,826 -> 3,836 gzip on 2026-11-10, cold-opening-style after merging main 312aa15c (#484 deps-1123): the warm list's hashed names only (raw 10,684 the same). Measured 10,684 / 3,832, the gzip plus 4.
// 10,619 / 3,810 -> 10,663 / 3,820 on 2026-11-10, font-split over main cb8346da: the second font file joins the install list. Measured 10,659 / 3,816 in the e2e build, the plus 4.
// 10,688 / 3,836 (cold-opening-style) and 10,663 / 3,820 (#426 font-split) -> 10,732 / 3,843 on 2026-11-11, cold-opening-style after merging main d4048d83 (#426): both, the cold opening's two files and the second font file in the lists. Measured 10,728 / 3,839 in the e2e build, the plus 4.
// 10,106 / 3,624 -> 10,143 / 3,640 on 2026-10-30, E-11 번외 사건 틀 (draft) over
// main 430dda1e: one more file in the list, SideCaseScreen; the worker's code did
// not change. Measured 10,139 / 3,636 plus 4.
// 10,106 / 3,629 -> 10,143 / 3,637 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 465ccb93. Measured 10,139 / 3,633, the plus 4.
// 10,139 / 3,643 -> 10,176 / 3,652 on 2026-11-03, E-11 번외 사건 틀 (draft) over main 425eb4da (#392 #398 #395). Measured 10,172 / 3,648, the plus 4.
// 10,143 / 3,640 -> 10,172 / 3,651 on 2026-10-30, E-11 번외 1 (draft) over e11-side-cases da40ea69 (main 430dda1e): side01 and its English and Japanese words in the list; the worker's code did not change. Measured 10,168 / 3,647 plus 4.
// 10,143 / 3,637 -> 10,172 / 3,651 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases 49bce887 (main 465ccb93). Measured 10,168 / 3,647, the plus 4.
// 10,176 / 3,652 -> 10,205 / 3,667 on 2026-11-03, E-11 번외 1 (draft) over e11-side-cases b40aa7d1 (main 425eb4da). Measured 10,201 / 3,663, the plus 4.
// 10,172 / 3,651 -> 10,172 / 3,654 on 2026-10-30, E-11 번외 사건 온라인 저장 (draft) over e11-side01 6f8723b0 (main 430dda1e): the list's hashed names; the worker's code did not change. Measured 10,168 / 3,650 plus 4.
// -> 9,992 / 3,606 on 2026-10-26 (old base), E-11 번외 2 (draft) restacked on
// e11-side-cloud bb76437e: one more file in the list, side02. Measured 9,992 /
// 3,602 plus 4.
// 10,172 / 3,654 -> 10,201 / 3,660 on 2026-10-30, E-11 번외 2 (draft) over e11-side-cloud c25a95cd (main 430dda1e): side02 and its English and Japanese words in the list; the worker's code did not change. Measured 10,197 / 3,656 plus 4.
// 10,172 / 3,651 -> 10,201 / 3,663 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud c2954023 (main 465ccb93). Measured 10,197 / 3,659, the plus 4.
// 10,205 / 3,667 -> 10,234 / 3,675 on 2026-11-03, E-11 번외 2 (draft) over e11-side-cloud dbab06b9 (main 425eb4da). Measured 10,230 / 3,671, the plus 4.
// 10,201 / 3,660 -> 10,230 / 3,675 on 2026-10-30, E-11 번외 3 (draft) over e11-side02 7ac9cb8e (main 430dda1e): side03 and its English and Japanese words in the list; the worker's code did not change. Measured 10,226 / 3,671 plus 4.
// 10,201 / 3,663 -> 10,230 / 3,666 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 57313263 (main 465ccb93). Measured 10,226 / 3,662, the plus 4.
// 10,234 / 3,675 -> 10,263 / 3,689 on 2026-11-03, E-11 번외 3 (draft) over e11-side02 900d1946 (main 425eb4da). Measured 10,259 / 3,685, the plus 4.
// 10,619 / 3,810 -> 10,656 / 3,820 on 2026-11-10, E-11 번외 사건 틀 (draft) over main 3a507805: one more file in the list, SideCaseScreen. Measured 10,652 / 3,816 plus 4.
// 10,656 / 3,820 -> 10,685 / 3,828 on 2026-11-11, E-11 번외 1 (draft) over e11-side-cases c0d04767 and main 568572d3 (#484 #502 #503): side01 and its English and Japanese words in the list. Measured 10,681 / 3,824, the plus 4.
// 10,619 / 3,810 -> 10,663 / 3,820 on 2026-11-10, font-split over main cb8346da: the second font file joins the install list. Measured 10,659 / 3,816 in the e2e build, the plus 4.
// 10,656 / 3,820 (E-11) and 10,663 / 3,820 (font-split) -> 10,700 / 3,839 on 2026-11-11, bundle 1111 (#350 #301 #501) after merging main d4048d83 (#426 font-split): both files in the install list. Measured 10,696 / 3,835 in the e2e build, the plus 4.
// -> 10,700 / 3,831 on 2026-11-11, bundle 1111 after build:fonts (냄, 짧) and the critical CSS regenerated. Measured 10,696 / 3,827 in the e2e build, the plus 4.
// -> 10,729 / 3,848 on 2026-11-11, E-11 번외 1 (#314) over main 5c93b496 (#504), the plus 4.
// -> 10,758 / 3,848 on 2026-11-11, E-11 번외 2 (#321) over #317 f657d6ad (main 5c93b496), the plus 4.
// -> 10,787 / 3,872 on 2026-11-11, E-11 번외 3 (#333) over #321 (main 5c93b496), the plus 4.
// -> 10,769 / 3,861 on 2026-11-11, cold-opening-style (#477) after merging main 5c93b496 (#504): both. Measured 10,765 / 3,857 in the e2e build, the plus 4.
// -> 10,798 / 3,875 on 2026-11-11, E-11 번외 1 (#314) after merging main 808834eb (#477), the plus 4.
// -> 10,827 / 3,884 on 2026-11-11, E-11 번외 2 (#321) after merging main d53a6ab2 (#317), the plus 4.
// -> 10,856 / 3,897 on 2026-11-11, E-11 번외 3 (#333) after merging main accd990b (#321), the plus 4.
const WORKER_BUDGET = { maxBytes: 10_856, maxGzip: 3_897 };
try {
  const worker = readFileSync(path.join(distDir, "sw.js"));
  const gzipBytes = gzipSync(worker).length;
  reported.push(`sw.js: ${worker.length} bytes raw / ${gzipBytes} bytes gzip`);
  if (worker.length > WORKER_BUDGET.maxBytes) failures.push(`sw.js is ${worker.length} bytes, over the ${WORKER_BUDGET.maxBytes} byte budget.`);
  if (gzipBytes > WORKER_BUDGET.maxGzip) failures.push(`sw.js is ${gzipBytes} gzip bytes, over the ${WORKER_BUDGET.maxGzip} gzip budget.`);
} catch {
  failures.push("dist/sw.js is missing; the build writes it (serviceWorker() in vite.config.js).");
}

// First paint.
const html = readFileSync(path.join(distDir, "index.html"), "utf8");
const coldAssets = new Set();
for (const match of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
  const tag = match[0];
  if (/<link\b/.test(tag) && !/\brel="(?:stylesheet|modulepreload|preload)"/.test(tag)) continue;
  if (/\brel="preload"/.test(tag) && !/\bas="font"/.test(tag)) continue;
  const url = tag.match(/\b(?:src|href)="\/(assets\/[^"]+)"/)?.[1];
  if (url) coldAssets.add(url);
}
const transfer = (relative) => {
  const buffer = readFileSync(path.join(distDir, relative));
  return /\.(woff2|webp|png|jpe?g)$/.test(relative) ? buffer.length : gzipSync(buffer).length;
};
let firstPaint = gzipSync(Buffer.from(html)).length;
const parts = [`index.html ${firstPaint}`];
for (const asset of coldAssets) {
  const bytes = transfer(asset);
  firstPaint += bytes;
  parts.push(`${path.basename(asset)} ${bytes}`);
}
try {
  const image = transfer(FIRST_PAINT_IMAGE);
  firstPaint += image;
  parts.push(`${FIRST_PAINT_IMAGE} ${image}`);
} catch {
  failures.push(`dist/${FIRST_PAINT_IMAGE} is missing; the intro preloads it.`);
}
if (!coldAssets.size) failures.push("dist/index.html links no /assets/ files; the first-paint budget measured nothing.");
if (firstPaint > FIRST_PAINT_BUDGETS.ko) {
  failures.push(`The first paint transfers ${firstPaint} bytes, over the ${FIRST_PAINT_BUDGETS.ko} byte budget (${parts.join(", ")}).`);
}
reported.push(`first paint ${firstPaint} bytes (${parts.join(", ")})`);

// The same page in another language: the Korean bytes plus its chunks and
// whatever they import statically that is not already counted.
const staticImports = (name) =>
  [...readFileSync(path.join(assetsDir, name), "utf8").matchAll(/\b(?:import|from)\s*["']\.\/([^"']+\.js)["']/g)].map((match) => match[1]);
for (const [lang, patterns] of Object.entries(LOCALE_FIRST_PAINT)) {
  const counted = new Set([...coldAssets].map((asset) => path.basename(asset)));
  const queue = [];
  for (const pattern of patterns) {
    const name = files.find((file) => pattern.test(file));
    if (name) queue.push(name);
    else failures.push(`No chunk matches ${pattern} in dist/assets; the ${lang} first paint waits on it.`);
  }
  // The language's own start page (/en/, /ja/, since 11-03) in place of the
  // Korean index.html: the same files, its words.
  const ownPage = path.join(distDir, lang, "index.html");
  const ownBytes = existsSync(ownPage) ? gzipSync(readFileSync(ownPage)).length : null;
  if (ownBytes === null) failures.push(`dist/${lang}/index.html is missing; the ${lang} start page is written by startPages() in vite.config.js.`);
  let total = firstPaint - gzipSync(Buffer.from(html)).length + (ownBytes ?? gzipSync(Buffer.from(html)).length);
  const extra = [`${lang}/index.html ${ownBytes}`];
  while (queue.length) {
    const name = queue.shift();
    if (counted.has(name)) continue;
    counted.add(name);
    const bytes = transfer(`assets/${name}`);
    total += bytes;
    extra.push(`${name} ${bytes}`);
    queue.push(...staticImports(name));
  }
  if (total > FIRST_PAINT_BUDGETS[lang]) {
    failures.push(`The ${lang} first paint (/${lang}/) transfers ${total} bytes, over the ${FIRST_PAINT_BUDGETS[lang]} byte budget (the Korean ${firstPaint}, ${extra.join(", ")}).`);
  }
  reported.push(`${lang} first paint ${total} bytes (the Korean ${firstPaint}, ${extra.join(", ")})`);
}

// Web ads (출시 로드맵 2단계) are off unless the build was given
// ADSENSE_ADS=on (draft #350, #341 reopened): a site build without it, AdSense site
// verification (ADSENSE_CLIENT) included, carries no ad code in any script.
if (process.env.ADSENSE_ADS !== "on") {
  const scripts = [path.join(distDir, "sw.js"), ...readdirSync(assetsDir).filter((name) => name.endsWith(".js")).map((name) => path.join(assetsDir, name))];
  const carrier = scripts.find((file) => WEB_AD_CODE_MARKERS.test(readFileSync(file, "utf8")));
  if (carrier) failures.push(`${path.relative(distDir, carrier)} carries web ad code ("${WEB_AD_CODE_MARKERS.exec(readFileSync(carrier, "utf8"))[0]}") in a build without ADSENSE_ADS=on.`);
  else reported.push("no web ad code");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Bundle size checks passed (${reported.join("; ")}).`);
}
