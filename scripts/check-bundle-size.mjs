import { readFileSync, readdirSync, statSync } from "node:fs";
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
  // 142,728 / 52,279 -> 148,723 / 54,704 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // -> 148,761 / 54,732 on 2026-10-26, funnel-locale (앱출시-F F-6): a case row's summary names the page's language (toRowSummary reads LANG). Measured 148,761 / 54,728 plus 4.
  // 148,761 / 54,732 -> 149,305 / 54,905 on 2026-10-26, 영어판 3단계 (en-step3-screens): the epilogues, the collapse's toll and the operator file read by key (src/copy/epilogue.js). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 149,722 / 54,994 -> 152,719 / 56,135 on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main b7228340: the side run (state/sideRun.js) and what the side screen takes from this chunk (state/sideCaseKit.js); the pack check stays out (state/sidePackCheck.js). Measured 152,719 / 56,131 in the e2e build, the gzip plus 4.
  { pattern: /^GameRuntime-.*\.js$/, maxBytes: 152_719, maxGzip: 56_135 },
  // src/gameLogic.js and the code it brings, shared by the runtime's chunk and
  // the table's settlement (settleChoice.js, #233), split out by Rolldown on
  // 2026-10-24 (see GameRuntime above). It loads with whichever of the two
  // asks first, never before. Measured 32,897 / 13,018 in the e2e build, the
  // gzip plus 4.
  // 32,897 / 13,022 -> 32,897 / 13,039 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 13,035 gzip in the e2e build, the gzip plus 4.
  // 32,897 / 13,039 -> 34,278 / 13,357 on 2026-10-26, 영어판 3단계: the observer's samples, arcs and records and the endings' lines read by key (src/copy/observer.js), a name's particle as a blank. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  { pattern: /^gameLogic-.*\.js$/, maxBytes: 34_278, maxGzip: 13_357 },
  // Rolldown names this shared file after src/gauntlet/RelicDraft.jsx: the
  // modules the table and the runtime both import since #233, split out on
  // 2026-10-24 like gameLogic above.
  // Measured 19,564 / 8,584 in the e2e build, the gzip plus 4.
  // 19,564 / 8,588 -> 19,567 / 8,588 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 19,567 in the e2e build.
  // 19,567 / 8,588 -> 25,798 / 11,056 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  { pattern: /^RelicDraft-.*\.js$/, maxBytes: 26_671, maxGzip: 11_352 },
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
  { pattern: /^pastPicks-.*\.js$/, maxBytes: 290_343, maxGzip: 86_970 },
  // One case: its scenes, replies and voice lines. A first visit fetches the
  // season's first one before the table and the rest behind it. The largest,
  // case01, was 79,679 / 19,176 on 2026-09-29, and 94,175 / 24,159 on
  // 2026-10-06, when cases 01-07 and the finale were written at the length of
  // the rest of the season: its thirty scenes are the most of any case. It is
  // not the chunk a first visit waits for; that one is prologue01.
  { pattern: /^(prologue0[1-5]|case[0-9]{2}|final)-.*\.js$/, maxBytes: 98_900, maxGzip: 25_400 },
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
  // 181,926 / 65,978 -> 184,204 / 66,885 on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main b7228340: the start screen's side slot, hidden until a finale is closed and a side case is written (src/sideCases.js, the slot and its open/close in IntroScreen, its words in src/copy/intro.js), and the side-id guards of the local ranking and the window log. Measured 184,204 / 66,881 in the e2e build, the gzip plus 4.
  { pattern: /^index-.*\.js$/, maxBytes: 184_204, maxGzip: 66_885 },
  // The 홈 화면에 추가 hint (components/InstallHint.jsx), fetched only on a
  // browser that offers an install. Measured 559 / 319 on 2026-10-26, the
  // gzip plus 4.
  { pattern: /^InstallHint-.*\.js$/, maxBytes: 559, maxGzip: 323 },
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
  // -> 102,514 / 35,481 on 2026-10-25, 묶음 시대고증(#313): the era words in
  // the play screen's copy. Measured 102,514 / 35,472 in CI and 35,477 here,
  // the larger gzip plus 4.
  // 102,514 / 35,481 -> 102,517 / 35,481 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 102,517 in the e2e build.
  // 102,517 -> 102,528 raw on 2026-10-26, E-11 번외 사건 틀 (draft) restacked on main
  // 1dcdda39: GauntletStage exported for the side screen's table. Measured
  // 102,528 / 35,480.
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 102_528, maxGzip: 35_481 },
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
  // 44,569 / 14,830 -> 44,575 / 14,830 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 44,575 in the e2e build.
  // 44,575 / 14,830 -> 48,936 / 16,122 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 48,936 / 16,122 -> 50,079 / 16,401 on 2026-10-26, 영어판 3단계: the ending sequence, the three twists, the verdicts and afterglows and 「당신의 세 장면」 read by key (src/copy/ending.js), and the forecast's 「유지」 from the report's table. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  // 50,079 / 16,401 -> 50,421 / 16,513 on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main b7228340: the finale's line that the side slot opened (src/copy/result.js), and the side list it reads. Measured 50,421 / 16,509, the gzip plus 4.
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 50_421, maxGzip: 16_513 },
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
  { pattern: /^index-.*\.css$/, maxBytes: 196_068, maxGzip: 36_533 },
  // The one font file (scripts/build-fonts.mjs), already compressed, so the raw
  // size is the transfer size. 270,000 bytes on 2026-09-27; it replaced 92
  // dynamic subsets, of which the intro alone pulled ~537KB.
  // 283,500 -> 197,740 on 2026-10-26, first-paint-cut (the user's choice 1): the
  // weight axis cut to 400-920, nothing asking for less. Measured 197,736 (from
  // 270,828), plus 4.
  { pattern: /^pretendard-cp-.*\.woff2$/, maxBytes: 197_740, compressed: true },
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
  { pattern: /^icons-vendor-.*\.js$/, maxBytes: 17_286, maxGzip: 6_142 },
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
  // 10,077 -> 10,078 raw on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main b7228340: only the names of the chunks it imports. Measured 10,078 in the e2e build.
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
  // 4,793 / 2,147 -> 5,503 / 2,416 on 2026-10-26, 영어판 3단계: the ranking's words read by key (src/copy/ranking.js) and dates in the page's language. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  { pattern: /^RankingScreen-.*\.js$/, maxBytes: 5_503, maxGzip: 2_416 },
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
  // 11,780 -> 11,781 raw on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main b7228340: only by the chunk names it imports. Measured 11,781 / 4,768; the gzip budget holds.
  { pattern: /^cloudSave-.*\.js$/, maxBytes: 11_781, maxGzip: 4_768 },
  // E-12's merge of those three device keys on a restore, loaded only when a
  // copy is restored (cloudSave.applyCloudSave). Measured 1,934 / 938 in the
  // e2e build, the gzip plus 4.
  // 942 -> 948 on 2026-10-25, 묶음 A-3 (season labels) on main 8e75b128: no
  // code, the case chunks' new hashes. Measured 944, the gzip plus 4.
  { pattern: /^cloudDeviceRecords-.*\.js$/, maxBytes: 1_934, maxGzip: 948 },
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
  { pattern: /^CloudSavePanelBody-.*\.js$/, maxBytes: 5_014, maxGzip: 2_135 },
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
  // 36,757 / 13,658 -> 38,649 / 14,453 on 2026-10-26, 다국어 틀 (en-step1, on main 1cbdf70e): src/locale.js and the intro's language choice (index), and the screens' words moved into src/copy/*.js tables read by key so another language can be laid over them -- the Korean is the same, the keys and reads are what grew (the table's words now sit in RelicDraft, which the table and the runtime share). Measured in the e2e build, the gzip plus 4.
  // 38,649 -> 38,654 raw on 2026-10-26, 영어판 3단계: only the names of the chunks it imports. Measured in the e2e build.
  // 39,663 / 14,647 -> 39,883 / 14,795 on 2026-10-28, lang-full: the reading clock counts an English page by words and a
  // Japanese one by characters at 0.89 (readingUnits). Measured 39,879 / 14,791.
  { pattern: /^gauntletEngine-.*\.js$/, maxBytes: 39_883, maxGzip: 14_795 },
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
  { pattern: /^ResultCardShare-.*\.js$/, maxBytes: 8_659, maxGzip: 4_168 },
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
  { pattern: /^runtimeSystems-.*\.js$/, maxBytes: 8_487, maxGzip: 3_989 },
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
  { pattern: /^caseCopy-.*\.js$/, maxBytes: 107_413, maxGzip: 35_886 },
  // The table's sound (src/gauntlet/gauntletAudio.js). It was in the
  // PlayScreen chunk, which stood at 104,323 of 104,200 on 2026-10-19 when two
  // changes that each fitted were merged together; it is fetched with the table
  // (TABLE_AUDIO in vite.config.js), so nothing loads later than it did.
  // Taking it out took PlayScreen to 97,898 / 32,131. 6,676 / 2,166 measured.
  // -> 6,512 / 2,129 on 2026-10-21, Vite 8 (#225, the user's choice 1):
  // measured 6,512 / 2,125 in the e2e build, the gzip plus 4. Rolldown and
  // Oxc write it smaller than Rollup and esbuild did (6,700 / 2,198 on the same commit).
  { pattern: /^tableAudio-.*\.js$/, maxBytes: 6_512, maxGzip: 2_129 },
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
  { pattern: /^sceneTraces-.*\.js$/, maxBytes: 989, maxGzip: 619 },
  // The other players' card share under the decision reveal (E-6, 2026-10-22):
  // src/state/useSceneChoiceRates.js and src/sceneChoices.js, the frame of
  // sceneTraces above (SCENE_CHOICES in vite.config.js). 1,216 / 724
  // measured, plus 4 each for the hashed names.
  // 1,220 / 728 -> 1,143 / 680 on 2026-10-24, Vite 8 (#225) on main
  // e72c415f: measured 1,143 / 676 in the e2e build, the gzip plus 4.
  { pattern: /^sceneChoices-.*\.js$/, maxBytes: 1_143, maxGzip: 680 },
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
  // 2,634 / 1,403 -> 2,636 / 1,403 on 2026-10-25, board-report: the report button, its reason fieldset and its live line on each board post (BoardScreen, useBoardReport, boardReport.js), saveBoardReport in telemetry.js, the Flag icon and the report CSS; the other chunks only by the chunk names they import. Measured 2,636 in the e2e build.
  // 2,636 -> 2,637 raw on 2026-10-26, pwa-install-hint: only by the chunk names it imports. Measured 2,637 / 1,398.
  // 2,637 / 1,403 -> 3,215 / 1,600 on 2026-10-26, 영어판 3단계 (N1): the catalogue's words read by key (src/copy/weekRules.js, in this chunk), their numbers filled in from the constants when a rule is read. The Korean is the same. Measured in the e2e build, the gzip plus 4.
  { pattern: /^weeklyRules-.*\.js$/, maxBytes: 3_215, maxGzip: 1_600 },
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
  { pattern: /^WeeklyRuleViews-.*\.js$/, maxBytes: 2_537, maxGzip: 1_280 },
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
  // 1,927 / 1,053 -> 2,254 / 1,175 on 2026-10-26, 영어판 3단계 (N1): the audit's lines read by key, their words in this chunk (src/copy/audit.js, grouped with it in vite.config.js). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  { pattern: /^auditRisk-.*\.js$/, maxBytes: 2_254, maxGzip: 1_175 },
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
  // 2,637 / 1,547 -> 2,994 / 1,704 on 2026-10-26, 영어판 3단계 (N1): CASCADE's rule, the link line and the voice's lines read by key, their words in this chunk (src/copy/cascade.js, grouped with it in vite.config.js). The Korean is the same. Measured in the e2e build, the gzip plus 4.
  { pattern: /^cascadeRisk-.*\.js$/, maxBytes: 2_994, maxGzip: 1_704 },
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
  { pattern: /^speakerLine-.*\.js$/, maxBytes: 1_157, maxGzip: 654 },
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
  // 4,293 / 1,958 -> 4,594 / 2,080 on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main b7228340: the screen's words read by key (src/copy/sideCase.js). The Korean is the same. Measured 4,594 / 2,076, the gzip plus 4.
  { pattern: /^SideCaseScreen-.*\.js$/, maxBytes: 4_594, maxGzip: 2_080 },
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
  { pattern: /^locale-en-(prologue0[1-5]|case[0-9]{2}|final)-.*\.js$/, maxBytes: 73_845, maxGzip: 21_517 },
  // Japanese (일본어 1단계, 2026-10-26; hidden, ?lang=ja only): kana and kanji are three bytes each in UTF-8, so a case
  // is larger raw than its English though shorter to read. 사건 01 the largest, 82,376 / 23,101; the dictionary
  // (screen copy, 1,537 lines, and the page's system-font style) 109,813 / 38,565. Measured in the e2e build, the gzip plus 4.
  // 82,376 -> 82,383 on 2026-10-29, lang-terms (일본어판 표기 맞춤): 사건 01 measured 82,379, the raw plus 4.
  { pattern: /^locale-ja-(prologue0[1-5]|case[0-9]{2}|final)-.*\.js$/, maxBytes: 82_383, maxGzip: 23_105 },
  // 110,001 / 38,601 -> 152,779 / 51,777 on 2026-10-28, lang-full: the Japanese screen copy of English steps three and four
  // (endings, verdicts, board, ranking, week rules, table variants, narration) and 63 more speakers. Measured 152,775 / 51,773.
  // 51,777 -> 51,787 gzip on 2026-10-29, lang-terms (일본어판 표기 맞춤): measured 152,775 / 51,783, the gzip plus 4.
  // 152,779 / 51,787 -> 153,851 / 52,114 on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main b7228340: the side slot's, the finale line's and the side screen's words in Japanese (screens/intro.js, result.js, sideCase.js). Measured 153,851 / 52,110, the gzip plus 4.
  { pattern: /^locale-ja-index-.*\.js$/, maxBytes: 153_851, maxGzip: 52_114 },
  // index 91,605 / 33,973 -> 93,179 / 34,900 and overlay 2,894 / 1,183 -> 6,589 / 2,026 on 2026-10-26, en-speakers
  // (사건 11~최종 화자 63명의 영어 이름과 시범 범위 previewThrough: 범위 밖 사건은 영어 파일이 있어도 한국어로).
  // Both load on the English page only. Measured in the e2e build, the gzip plus 4.
  // 93,179 / 34,900 -> 124,761 / 45,295 on 2026-10-26, 영어판 3단계: the endings, verdicts, board, ranking, privacy lines, online save's status, the week's rules and line, the audit's and the links' lines in English. Only an English page fetches it. Measured in the e2e build, the gzip plus 4.
  { pattern: /^locale-en-index-.*\.js$/, maxBytes: 128_593, maxGzip: 46_483 },
  // A language's copy between cases after 사건 10 (src/locales/<lang>/between/<first>-<last>.js, en-between-11-20,
  // 2026-10-26: the owner's choice 2): fetched only once `previewThrough` reaches its cases, so the dictionary above
  // stays as it was. 사건 11~20 (210 lines and 22 roles) measured 28,210 / 10,801, the gzip plus 4.
  // 2026-10-28, lang-full: both languages open to the end, so English 사건 21-final and Japanese 사건 11-final join it
  // (four files each); the largest measured 33,405 raw (ja 21-30) and 12,141 gzip (ja 31-40).
  { pattern: /^locale-(en|ja)-between-case[0-9]{2}-[0-9]{2}-.*\.js$/, maxBytes: 33_409, maxGzip: 12_145 },
  // 6,589 / 2,026 -> 8,013 / 2,344 on 2026-10-26, 일본어 1단계: the Japanese files in the overlay's import maps and its
  // `addStyle` (a dictionary's own CSS). Loads on a page in another language only. Measured 8,013 / 2,340, the gzip plus 4.
  // 8,013 / 2,344 -> 8,731 / 2,640 on 2026-10-26, en-between-11-20: the between/ files in its import map, fetched once
  // `previewThrough` reaches them, a table keyed by case laid over only up to it, and `roleName` reading their
  // `caseRoles` (`caseRole`). Measured 8,731 / 2,636.
  // 8,731 / 2,640 -> 12,511 / 3,324 on 2026-10-28, lang-full: the import maps name every case and between/ file of both
  // languages (49 cases more for Japanese) and, with #365, a card keeps its Korean label. Measured 12,575 / 3,354.
  { pattern: /^locale-overlay-.*\.js$/, maxBytes: 12_579, maxGzip: 3_358 },
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
 * recovery notice merged, Japanese 477,908. E-11 번외 사건 틀 (draft, restacked
 * on main b7228340 on 10-29), the start screen's side slot and its words in the
 * entry: 423,685, 473,389 and 479,149.
 */
const FIRST_PAINT_BUDGETS = { ko: 423_689, en: 473_393, ja: 479_153 };
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
// -> 9,934 raw on 2026-10-29, E-11 번외 사건 틀 (draft) restacked on main
// b7228340: one more file in the list, SideCaseScreen; the worker's code did
// not change. Measured 9,934 / 3,572; the gzip budget holds.
const WORKER_BUDGET = { maxBytes: 9_934, maxGzip: 3_573 };
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
  let total = firstPaint;
  const extra = [];
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
    failures.push(`The ${lang} first paint (?lang=${lang}) transfers ${total} bytes, over the ${FIRST_PAINT_BUDGETS[lang]} byte budget (the Korean ${firstPaint}, ${extra.join(", ")}).`);
  }
  reported.push(`${lang} first paint ${total} bytes (the Korean ${firstPaint}, ${extra.join(", ")})`);
}

// Web ads (출시 로드맵 2단계) are off unless the build was given
// ADSENSE_ADS=on (draft #341): a site build without it, AdSense site
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
