import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

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
  { pattern: /^GameRuntime-.*\.js$/, maxBytes: 551_000, maxGzip: 176_100 },
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
  { pattern: /^index-.*\.js$/, maxBytes: 170_441, maxGzip: 61_556 },
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
  { pattern: /^index-.*\.js$/, maxBytes: 171_964, maxGzip: 62_152 },
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
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 106_566, maxGzip: 35_484 },
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
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 105_284, maxGzip: 35_047 },
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
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 46_300, maxGzip: 14_578 },
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
  { pattern: /^index-.*\.css$/, maxBytes: 194_400, maxGzip: 35_543 },
  // 35,363 -> 35,383 gzip on 2026-10-23, 10-23 묶음 A 합친 상태 실측: measured
  // 191,859 / 35,379, the gzip plus 4 -- the five branches' rules, E-6's share
  // line (.gx-reveal-share) and the title strip's order for the NEW GAME+ line.
  { pattern: /^index-.*\.css$/, maxBytes: 194_400, maxGzip: 35_383 },
  // The one font file (scripts/build-fonts.mjs), already compressed, so the raw
  // size is the transfer size. 270,000 bytes on 2026-09-27; it replaced 92
  // dynamic subsets, of which the intro alone pulled ~537KB.
  { pattern: /^pretendard-cp-.*\.woff2$/, maxBytes: 283_500, compressed: true },
  // The chunks below had no budget until 2026-09-28: the list named six files
  // and the build emits eleven, so a new 400KB lazy screen would have passed a
  // check described as a ratchet on every chunk. Measured that day, plus 5%.
  // React and the scheduler. 221,715 / 68,975. It moves only with a React bump.
  { pattern: /^react-vendor-.*\.js$/, maxBytes: 232_800, maxGzip: 72_400 },
  // The four budgets below were first written against the tree before the
  // 2026-09-28 fix pass and are set here against the tree after it, measured
  // plus 5%: the same day's other changes are what they have to hold.
  // The lucide icons the screens import, tree-shaken. 13,711 / 4,900, with the
  // icons the board's states and the recovery controls added.
  // 14,400 / 5,150 -> 17,600 / 6,150 on 2026-10-21 with lucide-react 1.60,
  // measured 17,595 / 6,139 and raised by the shortfall only: the same 49
  // icons, no unused import to drop, but 1.x adds a provider context, alias
  // class names and a name/size record per icon to the shared code.
  { pattern: /^icons-vendor-.*\.js$/, maxBytes: 17_600, maxGzip: 6_150 },
  // 5,293 / 2,232, with the board's loading, error and retry states.
  // 5,560 / 2,350 -> 6,040 / 2,490 on 2026-10-07, measured 5,748 / 2,373 plus
  // 5%: a button that says why it will not act, and the counters as
  // descriptions rather than part of each field's name.
  { pattern: /^BoardScreen-.*\.js$/, maxBytes: 6_040, maxGzip: 2_490 },
  // 3,860 / 1,759, with rows typed before they are rendered.
  // 4,060 / 1,850 -> 4,420 / 1,980 on 2026-10-06, measured 4,210 / 1,883 plus
  // 5%: the count that is not "0명" while it loads, the region that says when
  // the rows arrive, and `lang` on the English labels.
  // -> 4,800 / 2,100 on 2026-10-07, measured 4,567 / 2,001 plus 5%: a list
  // with spoken ranks, and a retry when the rows did not come.
  // -> 4,959 / 2,139 on 2026-10-23 (table-readouts, #246, draft), measured
  // 4,959 / 2,135 plus 4: 사건당 금고 on each row (C-1 (3)), worked out in the
  // screen so the entry chunk's ranking.js does not grow.
  { pattern: /^RankingScreen-.*\.js$/, maxBytes: 4_959, maxGzip: 2_139 },
  // 4,800 -> 4,858 raw on 2026-10-21, measured: the NEW GAME+ tag on this
  // device's own rows (the gzip, 2,080, stays under its budget).
  { pattern: /^RankingScreen-.*\.js$/, maxBytes: 4_858, maxGzip: 2_100 },
  // Online save, which left the entry chunk: a device that never turned it on
  // does not download it. 9,530 / 3,780 and 4,510 / 1,890.
  // -> 10,960 / 4,380 on 2026-10-07, measured 10,438 / 4,173 plus 5%: the
  // online copy held through a reset, and uploads paced under the hourly limit.
  { pattern: /^cloudSave-.*\.js$/, maxBytes: 10_960, maxGzip: 4_380 },
  // The panel: 4,740 / 1,990 -> 5,090 / 2,100 on 2026-10-06, measured 4,845 /
  // 1,995 plus 5%, for telling a success from a failure -- two regions that
  // are on the page before they speak, where one alert said both.
  { pattern: /^CloudSavePanelBody-.*\.js$/, maxBytes: 5_090, maxGzip: 2_100 },
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
  { pattern: /^gauntletEngine-.*\.js$/, maxBytes: 37_870, maxGzip: 14_367 },
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
  { pattern: /^ResultCardShare-.*\.js$/, maxBytes: 8_853, maxGzip: 4_290 },
  // 8,745 / 4,261 -> 8,780 / 4,280 for ops-measure (2026-10-23), measured
  // 8,780 / 4,276 plus 4: one more import, sceneChoices (E-6); its code did not change.
  { pattern: /^ResultCardShare-.*\.js$/, maxBytes: 8_780, maxGzip: 4_280 },
  // What a run and its report read about the analyst, the ending and the
  // record (src/runtimeSystems.js). It was in the entry chunk, inside
  // advancedSystems.js, where the screen before a run never called it: taking
  // it out took the entry chunk from 169,332 / 61,055 to 162,396 / 58,367 on
  // 2026-10-11. It is a file of its own, loaded beside the runtime, because
  // the runtime's chunk had 667 gzip bytes left and this is 2,600 inside it
  // (runtimeSystemsChunk in vite.config.js). 7,103 / 3,633, plus 5%.
  { pattern: /^runtimeSystems-.*\.js$/, maxBytes: 7_460, maxGzip: 3_815 },
  // The season's copy between and around cases (src/caseCopy.js): the
  // next-case teasers and interludes, chapter rules, rank legacy lines and
  // 에코's opening lines. It was in the runtime's chunk, which had 255 gzip
  // bytes left (175,845 of 176,100) on 2026-10-14; it is fetched beside the
  // runtime the same way runtimeSystems is (CASE_COPY in
  // vite.config.js), so nothing loads later than it did. Taking it out left the
  // runtime's ceiling where it was, for the changes that were waiting on it.
  // 108,233 / 34,828, plus 5%.
  { pattern: /^caseCopy-.*\.js$/, maxBytes: 113_650, maxGzip: 36_570 },
  // The table's sound (src/gauntlet/gauntletAudio.js). It was in the
  // PlayScreen chunk, which stood at 104,323 of 104,200 on 2026-10-19 when two
  // changes that each fitted were merged together; it is fetched with the table
  // (TABLE_AUDIO in vite.config.js), so nothing loads later than it did.
  // Taking it out took PlayScreen to 97,898 / 32,131. 6,676 / 2,166 measured.
  { pattern: /^tableAudio-.*\.js$/, maxBytes: 6_700, maxGzip: 2_205 },
  // The other players' wall rate on the scene page (improvement notes D3):
  // src/state/useSceneBustRates.js and src/sceneTraces.js. Written into the
  // PlayScreen chunk they added about 945 / 441 bytes to it on 2026-10-19,
  // more than its 104,200 / 34,300 budget left before tableAudio came out; it
  // is fetched with the table (SCENE_TRACES in vite.config.js), so the line
  // appears when it did. PlayScreen carries only the import, 141 / 54.
  // 1,054 / 652 measured, plus the 4 bytes tableAudio was given for the
  // hashed file names it imports.
  { pattern: /^sceneTraces-.*\.js$/, maxBytes: 1_058, maxGzip: 656 },
  // The other players' card share under the decision reveal (E-6, 2026-10-22):
  // src/state/useSceneChoiceRates.js and src/sceneChoices.js, the frame of
  // sceneTraces above (SCENE_CHOICES in vite.config.js). 1,216 / 724
  // measured, plus 4 each for the hashed names.
  { pattern: /^sceneChoices-.*\.js$/, maxBytes: 1_220, maxGzip: 728 },
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
  { pattern: /^weeklyRules-.*\.js$/, maxBytes: 2_704, maxGzip: 1_450 },
  // WeeklyRuleViews 1,662 / 913 -> 1,796 / 966 on 2026-10-22, the test week
  // moved to W47 right after W46's NEAR WALL: this week's line says the next
  // week's rule after it (gauntlet/weeklyRuleLine.js, in this chunk so the
  // weeklyRules chunk above stays as it was). Measured 1,796 / 962, the gzip
  // plus 4.
  // 1,796 / 966 -> 2,081 / 1,077 for ops-measure (2026-10-23, on main
  // 2c7b535), measured 2,081 / 1,073 plus 4: E-8's line and box for a first
  // season and E-9's line in the story before the rule, beside main's next
  // week's notice in the same line.
  { pattern: /^WeeklyRuleViews-.*\.js$/, maxBytes: 2_081, maxGzip: 1_077 },
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
  { pattern: /^WeekRulePanel-.*\.js$/, maxBytes: 1_387, maxGzip: 706 },
  // The office's noise at the table's edge (개선 포인트 A5,
  // src/gauntlet/EdgeNotice.jsx, EDGE_NOTICE in vite.config.js), a file of its
  // own from the start and fetched with the table. Its style is inline, so no
  // stylesheet grows. 1,794 / 1,194 measured on 2026-10-21, the gzip plus 4;
  // 3,779 / 2,166 on 2026-10-22, when the two senders became nine acts' pairs
  // (B-15: eighteen senders, thirty-six lines) and the act is read off
  // CASE_SEQUENCE.
  // -> 3,786 / 2,180 on 2026-10-23, 10-23 묶음 A 합친 상태 실측 (measured
  // 3,786 / 2,176, the gzip plus 4): the notice moved from over the scene's
  // title to just above the action bar.
  { pattern: /^EdgeNotice-.*\.js$/, maxBytes: 3_786, maxGzip: 2_180 },
  // The reading clock's one question (src/gauntlet/ReadingClockAsk.jsx,
  // READING_CLOCK_ASK in vite.config.js), 2026-10-22: 프롤로그 01-02 start held
  // and the first page the clock would open asks instead (A-11 = D-4).
  // Measured 1,348 / 775 in the e2e build, the gzip plus 4.
  // 10-23 묶음 A 합친 상태 실측: 1,348 / 782 (its imports name hashed files),
  // the gzip plus 4.
  { pattern: /^ReadingClockAsk-.*\.js$/, maxBytes: 1_348, maxGzip: 786 },
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
  { pattern: /^auditRisk-.*\.js$/, maxBytes: 2_078, maxGzip: 1_128 },
  // B2's links (src/gauntlet/cascadeRisk.js, CASCADE_RISK in vite.config.js),
  // out of the PlayScreen, engine and runtime chunks on 2026-10-20. 322 / 306
  // while a constant switched it off and the build dropped the walk; on
  // 2026-10-21 it is switched by the season's week (`cascade`), so the walk,
  // the reading and the links a case's close carries over are all here:
  // 2,790 / 1,669 measured, the gzip plus 4.
  { pattern: /^cascadeRisk-.*\.js$/, maxBytes: 2_790, maxGzip: 1_673 },
  // The window's replay trail (F1 phase 2, src/gauntlet/windowTrail.js,
  // WINDOW_TRAIL in vite.config.js): the presses the table writes, the record
  // the runtime puts on the decision log entry. 1,376 / 771 measured on
  // 2026-10-21, the gzip plus 4.
  { pattern: /^windowTrail-.*\.js$/, maxBytes: 1_376, maxGzip: 775 },
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
  { pattern: /^CaseCast-.*\.js$/, maxBytes: 2_017, maxGzip: 1_060 },
  // The deferred-stylesheet loader (vite.config.js), a fixed string. 153 bytes.
  { pattern: /^deferred-styles-.*\.js$/, maxBytes: 200, maxGzip: 200 },
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
const FIRST_PAINT_BUDGET = 515_000;
const FIRST_PAINT_IMAGE = "triggerlab-key-visual-960.webp";

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
const WORKER_BUDGET = { maxBytes: 9_068, maxGzip: 3_294 };
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
if (firstPaint > FIRST_PAINT_BUDGET) {
  failures.push(`The first paint transfers ${firstPaint} bytes, over the ${FIRST_PAINT_BUDGET} byte budget (${parts.join(", ")}).`);
}
reported.push(`first paint ${firstPaint} bytes (${parts.join(", ")})`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Bundle size checks passed (${reported.join("; ")}).`);
}
