/**
 * CSS structure check.
 *
 * The files under src/styles/app are a cascade, so the same selector can
 * legitimately appear in an earlier file and again in a later one that has to
 * outrank it. That freedom is also how a selector ends up with three homes and
 * nobody can say what it computes to without replaying the import order by hand.
 *
 * This keeps the count from growing: a selector defined in more than one file
 * (at the top level, or under the same media condition), or twice in one file
 * under the same media context, has to be one of the known leftovers. The four
 * budgets are ratchets -- lower them as the leftovers are cleaned up, never
 * raise them.
 *
 * The budgets read 8 and 51 until 2026-09-03, when the parser below stopped
 * losing its place at a comment written in front of an at-rule. It had been
 * swallowing everything after such a comment as a single rule, which hid two
 * selectors with two homes and two repeats. Nothing in the stylesheets changed;
 * the count did.
 *
 * base-intro-ranking.css read 1690 lines / 35349 bytes until 2026-09-09, when
 * the intro gained the cold-open drawers.
 *
 * play.css read 3292 lines / 68581 bytes until 2026-09-09, when the commit
 * console gained the target-lock rows, and 3338 / 69629 until later the same
 * day, when the record room, the play rail and the decision clock landed. That
 * pass removed far more markup than it added CSS: the stylesheet grew 5KB and
 * the phone's play screen lost more than half its height. The file budgets are sized to the file
 * as it stands, so a surface that grows has to move its number; the two
 * duplication budgets above are the ones that only go down.
 *
 * Since 2026-10-13 a file's lines and bytes are counted with its comments
 * taken out (scripts/css-size.mjs has the rule). The numbers in the two
 * paragraphs above, and every one dated before that day in the notes beside
 * `fileBudgets`, are of the file as written, comments included.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

import { measureCss } from "./css-size.mjs";

const APP_DIR = "src/styles/app";
const IMPORT_ORDER = readFileSync("src/styles/app.css", "utf8")
  .split(/\r?\n/)
  .map((line) => line.match(/@import "\.\/app\/([^"]+)"/)?.[1])
  .filter(Boolean);

const budgets = {
  // Selectors that still live in two files. Every one of these is a shared
  // prelude whose other selectors belong elsewhere, so splitting it would copy
  // declarations rather than remove them.
  // 9 -> 0 on 2026-09-15: the glass pass gave every leftover one home.
  selectorsWithTwoHomes: 0,
  // A selector overridden later in the same file is ordinary CSS and readable in
  // one pass -- unlike the same override hiding in another file -- so this budget
  // is deliberately looser. It should still only go down.
  // 50 -> 23 on 2026-09-15, ratcheted to what the glass pass left.
  // 23 -> 11 on 2026-09-28, to what it measures.
  // 11 -> 10 on 2026-10-08: one of the play header's two h1 rules went, with
  // the wrapping it asked of a title that never wraps.
  repeatedInOneFile: 10,
  // The two numbers above count less than their names say, and these two are
  // the rest of it (2026-10-08). They are ratchets like the others: measured
  // on the day they were added, and they only go down.
  //
  // "Two homes" above reads the top level alone, so a selector that two files
  // both restyle under the same media condition was nobody's count: the same
  // question -- which file wins -- with the import order as the only answer.
  // Four today: `.season-summary-list`, `.ranking-page .topbar`,
  // `.board-page .topbar`, `.next-case-panel button`.
  selectorsWithTwoHomesUnderOneCondition: 4,
  // "Repeated in one file" above keys on the whole comma list, so
  // `.a, .b { }` followed by `.a { }` is no repeat to it. This one counts
  // each selector of the list on its own, under one condition, in one file.
  // (Split on every comma it reads 145; 35 of those are halves of an `:is()`.)
  // 110 -> 107 the same day: the dead rules that left play.css and the intro's
  // 860px blocks took three repeats with them.
  selectorsRepeatedInOneFile: 107,
};

// Lines and UTF-8 bytes of each sheet WITHOUT ITS COMMENTS, since 2026-10-13
// (the rule is in css-size.mjs: a comment goes with the spaces in front of it,
// and a line that held nothing else goes with its line break).
//
// Before that day the file was counted as written. The build strips comments,
// so the budget was charging for bytes no player downloads, and with sheets
// sitting 3, 12 and 39 bytes under their number the way to fit a rule was to
// delete the note that explained another. A comment costs nothing now.
//
// Nothing was loosened to get there. Each number came down by exactly the
// comment lines and bytes its sheet held on 2026-10-13 (at cce9df8), so every
// sheet had the same room to the byte on both sides of the change:
//
//                           as written       comments      without         budget          room
//   base-intro-ranking.css  3169 / 76897   139 /  9799   3030 / 67098   3031 / 67101     1 /    3
//   play.css                2869 / 61486   115 /  8280   2754 / 53206   2925 / 55420   171 / 2214
//   plate.css                665 / 15121    77 /  5632    588 /  9489    588 /  9768     0 /  279
//   briefing.css             699 / 15243    31 /  2222    668 / 13021    674 / 13078     6 /   57
//   recovery.css             320 /  6891     6 /   398    314 /  6493    324 /  6702    10 /  209
//   relics.css               479 / 10002     9 /   690    470 /  9312    473 /  9410     3 /   98
//   responsive.css           444 / 10488    39 /  2533    405 /  7955    406 /  7967     1 /   12
//   result.css              2534 / 60761    51 /  3711   2483 / 57050   2509 / 57089    26 /   39
//   comfort.css              135 /  3755    16 /  1109    119 /  2646    124 /  2691     5 /   45
//
// The histories below keep their numbers as they were measured at the time,
// comments included; each ends with the step to the number that holds now.
// A budget moved after 2026-10-13 is a number without comments on both sides.
const fileBudgets = {
  // base-intro-ranking.css read 1795 / 38900 until 2026-09-10, when the intro
  // was redesigned into the full-bleed cold open. The file grew because it
  // absorbed the intro's second home: `.intro-shell`, `.intro`, `.intro > p`
  // and `.intro-visual` each had a definition here and an override in the
  // late-overrides block at the foot of the file, and every one of those pairs
  // collapsed into one rule. The line count went up, the number of places you
  // have to read to know what the intro computes to went down.
  // 2000 / 47400 -> 2460 / 58400 on 2026-09-15 for the night-shift glass
  // pass: the full-bleed hero with its stat row, the drawer grid, the roadmap
  // card grid and phone rail, and a ranking screen with its own podium rows.
  // The dossier's "square everything" reset went; rounded surfaces now come
  // from the shared --ui-* tokens rather than per-rule literals.
  // 2460 / 58400 -> 2540 / 60000 on 2026-09-16 for the folded 기기 간 이어하기
  // panel under the intro's primary action (the continuation code, its status
  // line and the load form).
  // 2540 / 60000 -> 2840 / 66900 on 2026-09-23 for the 참가자 게시판. It is a
  // second public page with the ranking's frame -- page, topbar, hero, status
  // card, row-card stack -- plus the one surface the ranking has no equivalent
  // of: a composer, with two fields and their counters, the privacy call-out and
  // its 익명화 button, the submit row's disabled state, and the off-screen
  // honeypot. The rules sit beside the ranking's because they share the frame;
  // splitting them into a file of their own would copy those five blocks rather
  // than remove them.
  // 2840 / 66900 -> 2875 / 67800 on 2026-09-23 for the 게시판 pill's glint in
  // the intro header: accent rim, glow and light sweep, and their two keyframes.
  // 2875 / 67800 -> 2910 / 69400 on 2026-09-27: the intro's infinite
  // decorations (the brand dot's pulse, the CTA and board-pill sweeps) moved
  // off box-shadow and left onto pseudo-elements that animate transform and
  // opacity, and body keeps content out from under a landscape notch.
  // 2910 / 69400 -> 3030 / 72300 the same day: 21 rules for the intro's
  // prestart and origin panels moved here out of extensions.css.
  // 3030 / 72300 -> 2990 / 71400 on 2026-09-28: the light operator-origin
  // panel and the first draft of the start row went (69 declarations a dark
  // rule always overrode), and eight rules came home from extensions.css.
  // 2990 / 71400 -> 3170 / 76900 on 2026-10-06, measured 3168 / 76817. Type
  // went from px to rem in every sheet (435 declarations, a few bytes each:
  // about 500 here), so the player's own font size reaches the page. The
  // opening burst came in from the one minified line it had been after
  // app.css's imports (118 lines). The rest is surfaces that had none: dark
  // buttons and a dark field for the online-save panel, its two message
  // regions, the note beside the consent box, the loading screen's count and
  // way out, and the quiet button's two half-rules made one.
  // 3170 / 76900 -> 3031 / 67101 on 2026-10-13: comments no longer counted
  // (139 lines and 9799 bytes of them that day), the room unchanged.
  // 3031 / 67101 -> 3073 / 67949 on 2026-10-25 for the board's report button
  // (store UGC rules): the action row under each post, a 44px toggle, the
  // in-place reason fieldset with its legend, radios, note and buttons, and
  // the live line that answers a report. Measured 3073 / 67946, room 0 / 3.
  // 3073 / 67949 -> 3083 / 68150 the same day, measured: the foot of the
  // intro links the privacy policy and the terms (.intro-legal), and those
  // links and the data drawer's note take the colour around them.
  // 3083 / 68150 -> 3128 / 69168 on 2026-10-26 for the language choice on the
  // intro (LanguagePicker.jsx, 다국어 틀): the pills with their 44px target,
  // the lit one, the preview line, and the phone's corner placement with room
  // under it for the preview line. Measured.
  // 3128 / 69168 -> 3137 / 69401 on 2026-10-29, measured: a wide screen pins
  // the three language pills under the music controls (position: fixed), out
  // of the brand row, so the start button stays inside a 1280x720 screen.
  // 3137 / 69401 -> 3141 / 69500 the same day, measured: a Japanese page on a
  // phone of 360px or less draws the premise at 14px / 1.6, since the system
  // CJK face it falls back to wraps it two lines longer than the Korean.
  // 3141 / 69500 -> 3142 / 69521 on 2026-10-29, measured (adsense-readiness):
  // the foot's five page links wrap on a narrow screen (.intro-legal).
  // 3142 / 69521 -> 3155 / 69767 on 2026-10-30, measured (picker-narrow over
  // main c3b40b6f): on 360px or less the three language pills keep one row
  // (closer, 8px padding, 12px type, out to the music controls) and the brand
  // row comes up 8px under them.
  // 3137 / 69401 -> 3148 / 69686 on 2026-10-29 (D2 hall of fame draft on #224
  // 602ec69b), measured: the hall of fame's badge on a ranking row
  // (.ranking-hall-badge), a rule of its own (11 lines) so the badge list
  // above is not written twice.
  // 3155 / 69767 -> 3166 / 70052 on 2026-10-30, measured (D2 over #224
  // bb70e777, main 430dda1e): the badge rule beside main's narrow pills.
  // 3155 / 69767 -> 3159 / 69883 on 2026-10-30, measured (intro-360-fit): on
  // 360px or less the start button sits closer to the premise (a 360x740
  // phone had the Korean one 2px under the screen) and the English premise
  // takes the Japanese 14px there (Linux CI put its button at 746).
  // 3159 / 69883 -> 3170 / 70168 on 2026-10-30, measured (통합 리허설 over #224
  // 8dd649ce, main b2558d55): D2's badge rule beside main's 360px start button.
  // 3166 / 70052 -> 3170 / 70168 on 2026-11-02, measured (D2 over #224
  // 8dd649ce, main b2558d55): the badge rule beside intro-360-fit.
  // 3159 / 69883 -> 3159 / 69903 on 2026-11-02, measured (pc-type-scale): from 1024px wide the
  // root reads 18px; the case card's numeral keeps its size through --hud-rem.
  // 3159 / 69903 -> 3162 / 69982 on 2026-11-03, measured (intro-webkit-fit): on
  // 360px or less the premise wraps plainly outside English, where WebKit's
  // text-wrap: pretty took the Korean and Japanese one a line longer.
  // 3162 / 69982 -> 3184 / 70411 on 2026-11-04, measured (credits-alice): the
  // start screen's credit takes a row for SUPASONIC's and ALICE's addresses.
  // -> 3195 / 70696 on 2026-11-05, rules-1105 (#224 #307 #316 #320 #308): 다섯 규칙의 CSS가 한 번에 들어와 사용자 결정으로 실측으로 올림, 다음 묶음부터는 내리기만.
  // 3195 / 70696 -> 3194 / 70687 on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 mood: the glow alphas), measured.
  "base-intro-ranking.css": { lines: 3194, bytes: 70687 },
  // play.css lost the most to the 2026-09-11 prune: the record-room pass removed
  // the identity strip, the repeated scene question and the status board, and
  // their rules stayed behind. It read 3290 / 72600 after that and moved back up
  // for `.commit-push`, the control that raises the pot -- a surface that did not
  // exist before, because until then the only way to push your luck was to sit
  // still and let the clock do it.
  // All of play.css went on 2026-09-14 with the board it styled: 3320 lines
  // became the header, the reveal and the report panels that other screens
  // still render, plus the gauntlet table. Every file below was ratcheted to
  // what the same prune left in it.
  // 1321 / 24541 -> 1515 / 28847 on 2026-09-15 for the beat: the approach ring
  // on the push button, the grade call-outs, the combo badge, fever and the
  // flash layer. Every rule is an overlay -- absolute or fixed, transform and
  // opacity only -- so the phone's one-screen table did not get taller.
  // 1515 / 28847 -> 1739 / 34222 later the same day for the fit pass: the
  // phone header, the compact rules panel and relic icons, the short-phone
  // scene, the odd-card row, the two-pane wide table. A measurement found 42 of
  // 149 scenes hiding a card under the action bar on a phone; these rules are
  // what put all of them back above it.
  // 1739 / 34222 -> 1858 / 36660 for the FOCUS lock: the third verb in the
  // gauntlet action bar, its HUD charge rail, mobile fit, and reduced-motion
  // reticle handling.
  // 1858 / 36660 -> 1916 / 37752 for focus modes: STRIKE / STEADY / EXPOSE
  // segmented controls, active-mode glow, and mobile compaction.
  // 1916 / 37752 -> 1965 / 38879 for stance mastery: the season-level LOCK
  // progress rail in the gauntlet bank, with mode-colored bars and compact text.
  // 1965 / 38879 -> 3045 / 62300 on 2026-09-15 for the glass table: the
  // drained clock ring, the ticked gauge tube, tactile cards with key hints and
  // sealed/fractured/wild states, the mastery rail folded into the segmented
  // stance control, the floating dock, the vertically composed wide table, and
  // the five minified .gx-* lines that used to sit after app.css's imports and
  // silently outrank this file. The phone table still fits all 149 scenes.
  // 3045 / 62300 -> 3080 / 63200 on 2026-09-16 for the scene dateline: place and
  // clock above the speaker, plus the briefing's lead line and the case memo --
  // which every scene had carried since the graph was written and which had
  // never reached the DOM, so the briefing explained the table and not the
  // situation. One 11px row; the phone table still fits all 149 scenes.
  // 3070 / 63000 -> 3210 / 67400 on 2026-09-16 for the scene plate: the
  // `--plate-*` palette, a faded backdrop behind the scene header and a
  // readable copy inside the briefing. The drawing itself is SVG built in
  // `ScenePlate.jsx`, so this is the whole stylesheet cost of giving all 169
  // scenes a picture, and the backdrop is absolutely positioned so the table
  // keeps every pixel of the one screen priority 27 gives it.
  // 3210 / 67400 -> 3360 / 70200 on 2026-09-16 for the plate's air: far-plane
  // drift, a breathing halo and flickering accent, seeded dust or rain, a
  // refresh sweep on screen rooms, a heat vignette on pressure beats and a slow
  // push-in on the briefing copy. Transform and opacity only, clipped by the
  // SVG's own viewport, and all of it parked under reduced motion.
  // 3360 / 70200 -> 3400 / 71400 on 2026-09-18: the plate's light is now keyed to
  // the organisation that owns the room rather than a hash of the room's name, so
  // the four tone classes became six -- one per employer, plus one warm white for
  // everywhere in the season that employs nobody.
  // 3400 / 71400 -> 3335 / 69500 on 2026-09-21: the reading beat moved off the
  // table into its own page (briefing.css), and the in-table open button, the
  // dimmed hand and the unfolded briefing went with it.
  // 3335 / 69500 -> 3405 / 70900 on 2026-09-21 for the plate's effects layer:
  // camera flashes in the rooms the public watches, daylight rays, a storm's
  // lightning, and the tone for the legislature and the press.
  // 3405 / 70900 -> 3425 / 71200 later the same day for steam over the market
  // and café plates.
  // 3425 / 71200 -> 3075 / 63400 on 2026-09-22, when the scene plate moved out
  // to plate.css with the second half of the season's rooms and effects (bytes
  // counted with CRLF endings, as a Windows checkout has them).
  // 3075 -> 3100 lines on 2026-09-27: the bust flash became two opacity layers
  // instead of an animated viewport background.
  // 3100 -> 3155 the same day: seven rules for the reveal's stakes and the
  // chapter panels moved here out of extensions.css.
  // 3155 / 66400 -> 3040 / 63700 on 2026-09-28: the light decision reveal and
  // the play header's first draft went (69 declarations that never won), the
  // report's panel rules at the head of the file moved to result.css, and
  // seven rules came home from extensions.css.
  // Unchanged on 2026-10-06, measured 2988 / 63612: px to rem cost this file
  // about 450 bytes, and the developer's overlay (nine rules) moved to
  // recovery.css beside the debug jump panel, which is what it is.
  // 3040 / 63700 -> 2925 / 55420 on 2026-10-13: comments no longer counted
  // (115 lines and 8280 bytes of them that day), the room unchanged.
  // 55420 -> 55522 bytes on 2026-10-23, 10-23 묶음 A 합친 상태 실측: E-6's
  // share line under the reveal took a plain rule of its own (.gx-reveal-share)
  // in place of the relic notice's warning bar.
  // [batch-c] #272 w4b-bubbles on 묶음 A:
  // 2925 / 55420 -> 2925 / 55551 on 2026-10-23, measured: the reveal's
  // 「당신의 판단」 tag in place of the voice's quotes (A-10), one rule the
  // briefing's question box shares.
  // -> 2925 / 55661 on 2026-10-23, 10-23 묶음 C 합친 상태 실측: 묶음 A의
  // .gx-reveal-share and #272's 「당신의 판단」 tag together.
  // [batch-c] 묶음 B (#277):
  // 55420 -> 55572 bytes on 2026-10-22 (D-8), measured 2861 / 55572: the
  // case file's cast cards and its list of the case's scenes so far.
  // 55572 -> 55616 bytes on 2026-10-23 in batch B, measured: the reveal's
  // afterword keeping its verdict on one line, and the table readouts (C-13);
  // 55726 with batch A's share line (E-6) under it, measured.
  // -> 2925 / 55865 on 2026-10-23, 묶음 C (A + B + #261 + #272) 합친 상태 실측.
  // -> 2931 / 56015 on 2026-10-24, measured: a sealed card's badges on a plain
  // ground over its stripes.
  // -> 56132 bytes on 2026-10-30, measured: a 360px phone's Japanese card
  // labels a size down, so five-card hands keep two lines in a CJK face.
  // -> 56181 bytes on 2026-10-25, measured: #224's link mark as a tag on the
  // card's edge (in the burn chip it pushed the chip onto a line of its own).
  // -> 56227 on 2026-10-25, measured: the run's line 2px apart on a phone,
  // so 감사 n/4 stays on 판돈 and 금고's row.
  // -> 56429 on 2026-10-30, measured: an English page on a 360px phone sets the
  // bank rail tighter (10px labels, 5px pills, 3px gap) so Audit n/4 keeps the
  // run's line on Stake and Vault's row.
  // -> 56343 on 2026-10-25, measured: the board's mark in the pot's label
  // (「고점 판」 C-10, 「숨 고른 판」 C-7), two colour rules and no line more.
  // -> 56545 on 2026-10-30, measured: the two together (#316 over #224 0d29141a).
  // -> 56546 on 2026-10-30, measured: #224 merged with main b2558d55, the
  // Japanese card labels (main) and the English bank rail (#224) together.
  // -> 56662 on 2026-10-30, measured: #316's marks over #224 8dd649ce (main b2558d55).
  // -> 56662 on 2026-11-02, measured: #316 merged with #224 8dd649ce (main
  // b2558d55), the board's marks beside the Japanese card labels.
  // -> 56505 bytes on 2026-10-30, measured (bank-rail-fit): on 360px or less
  // the HUD gives up its air so a bank row on two lines (late-season numbers)
  // keeps a five-card hand above the action bar.
  // -> 56733 bytes on 2026-11-02, measured (en-hand5-linux): on 360px or less
  // an English card label 12px / 1.25 and an English five-card hand's air
  // trimmed, so Linux fonts keep the hand above the action bar.
  // -> 56896 bytes, 2944 lines on 2026-11-02, measured: #224 merged with main 2f085d28, bank-rail-fit's
  // 360px HUD (main) with the English bank rail (#224) folded into its block.
  // -> 57684 bytes, 2986 lines on 2026-11-02, measured: #224 merged with main c680ddd5 (#389 en-hand5-linux), and on
  // 360px or less Audit n/4 moves from the bank row to the signals' row (.gx-hud.has-audit, .gx-hud-audit).
  // -> 57012 bytes, 2952 lines on 2026-11-02, measured: #316 merged with #224
  // afdcac0c (main 2f085d28), the board's marks beside the 360px HUD.
  // -> 57800 bytes, 2994 lines on 2026-11-02, measured: merged with #224 c29c2efd (main 9be94346, Audit n/4 off the 360px bank row).
  // -> 57012 bytes, 2952 lines on 2026-11-02, measured: 통합 리허설 (#379) over
  // #224 afdcac0c with #307 #316 #320 #308, the same as #316 alone.
  // -> 56973 bytes on 2026-11-02, measured (pc-type-scale, on top of en-hand5-linux): from 1024px wide
  // the pot and the clock keep their size through --hud-rem while the root
  // reads 18px.
  // -> 2950 / 57388 on 2026-11-03, measured (signal-row-fit): on 360px or less
  // the English and Japanese signals row gives LOCK its own width (no icon,
  // no empty track) and the overclock line the rest, so LOCK no longer runs
  // under the logic streak. In a 360px block of its own by the streak's rules,
  // apart from the HUD block that the audit token (#224) adds to.
  // -> 3029 / 58893 on 2026-11-05, rules-1105 (#224 #307 #316 #320 #308): 다섯 규칙의 CSS가 한 번에 들어와 사용자 결정으로 실측으로 올림, 다음 묶음부터는 내리기만.
  // 3029 / 58893 -> 3029 / 58883 on 2026-11-05, rules-1105 after merging main 4f2d39cb (#458 mood), measured.
  // -> 58276 bytes, 2998 lines on 2026-11-05, measured (phone-en-stake-11px over rules-mark-3b 9e91c588): the 360px English
  // bank rail's 10px label rule went; Audit n/4 sits on the signals' row now, so Stake and Vault read 11px like ko and ja.
  // 3029 / 58883 -> 3025 / 58815 on 2026-11-05, measured (bundle-rules2: kd-spend-engine, kd-spend-ui, phone-en-stake-11px,
  // scout-narrow, stake-clock over rules-1105 dd2cd419): the 360px English 10px label rule out (phone-en-stake-11px) beside
  // the stake clock's HUD lines; the ratchet goes down with it, never up again after rules-1105's one raise.
  // 3025 / 58815 -> 3035 / 59047 on 2026-11-06, mood-boost after merging main e1f5e515 (#463), measured: the mood's edge tint (.game-shell::after).
  // 3035 / 59047 -> 3035 / 59146 on 2026-11-09, hand-fit-2px (#476), measured: Japanese HUD and scene lines at 1.2 on a 360px phone (Noto CJK's normal line put nine overclocked five-card hands 6px under the bar).
  // 3035 / 59146 -> 3095 / 60291 on 2026-11-09, phone-390-fit, measured: a 361-390px block giving English and Japanese the 360px fits (overclocked five-card hands up to 58px under the bar on a 390x844 phone, Linux fonts) and the English streak's ellipsis at 360px.
  // 3095 / 60291 -> 3097 / 60365 on 2026-11-09, a32-411-fit, measured: the 360px HUD air (2px rows and paddings, a 30px clock, 18px pills) moved out of the 360px block into one block shared with phones up to 480 wide and 800 tall (a Galaxy A32, 411x780: nineteen five-card hands 9px under the bar at a pot of 99,999).
  // 3095 / 60291 -> 3109 / 60592 on 2026-11-09, phone-heavy-bank, measured: the relics beside the run's line at 360px (an overclocked board with a max bank, Korean 18px under the bar) and the English signals' 360px columns at 361-390px.
  // 3097 / 60365 (a32-411-fit, #493) and 3109 / 60592 (phone-heavy-bank) -> 3111 / 60666 on 2026-11-10, phone-heavy-bank after merging a32-follow (#493), measured: both, the English signals' columns now in the 361-480px block.
  // 3111 / 60666 -> 3133 / 61044 on 2026-11-10, en-signals-row, measured: the English signals row at 361-480px as one flex line, the streak's direction line cut with an ellipsis (Linux, 390x844 and 411x780: 2 to 13px into itself with a late season's bank).
  "play.css": { lines: 3133, bytes: 61044 },
  // plate.css arrived on 2026-09-22: the drawn room's palette, its two layers
  // of effects (flash, rays, steam, lightning; snow, stage light, LEDs, bokeh,
  // the price board, the near-plane sway, the mood grade, the light leak).
  // 500 / 11300 -> 590 / 13100 later on 2026-09-22 for the seasons of the second
  // year: blossom, the monsoon's puddles, heat haze, fireworks, leaves, the moon.
  // 590 / 13100 -> 665 / 15000 on 2026-09-23 for the hour the light switch
  // missed (dusk), the paper that turns in the rooms made of paper, the near and
  // far planes closing on a pressure beat, and the backdrop breathing behind the
  // table instead of standing still under a running clock.
  // 665 / 15400 -> 588 / 9768 on 2026-10-13: comments no longer counted
  // (77 lines and 5632 bytes of them that day), the room unchanged.
  // 588 / 9768 -> 619 / 10135 on 2026-11-02, measured (plate-story, E and F):
  // the player's own figure in the hand's colour inside an outline, and the
  // result's copy of a case's last room with its three tones.
  "plate.css": { lines: 619, bytes: 10135 },
  // briefing.css arrived on 2026-09-21 with the graphic-novel briefing page in
  // front of each table, sized to the file.
  // 635 / 13200 -> 670 / 14000 later the same day for the glitch a broken
  // board's splash panel arrives with.
  // 670 / 14100 -> 685 / 14400 on 2026-09-27: the glitch moved off a filter on
  // the plate onto its own fringe layer.
  // 685 / 14400 -> 700 / 14600 the same day: the reading clock became a button
  // that holds, and its held state.
  // 700 / 14600 -> 705 / 14900 on 2026-09-28: the reading clock keeps its
  // caption on a phone, stacked under the number.
  // 705 / 14900 -> 705 / 15300 on 2026-10-06, measured 703 / 15226: rem, a
  // locked card that stays in the tab order, and the page keeping itself out
  // from under a notch on either side.
  // 705 / 15300 -> 674 / 13078 on 2026-10-13: comments no longer counted
  // (31 lines and 2222 bytes of them that day), the room unchanged.
  // 674 / 13078 -> 697 / 13630 on 2026-10-23, measured: the speaker's own
  // line in the balloon, the question in a box with no tail (「당신의 판단」),
  // a lead told as a caption and the name chip on the speaker's speech (A-2).
  // The tail and the lead's box share one rule.
  // 697 / 13630 -> 709 / 13853 the same day, measured: on a phone, a case's
  // first page that introduces a rule gives the speaker's balloon up so the
  // introduction and the question stay on the first screen (390x664, 390x844).
  // -> 710 / 13866 on 2026-10-23, 10-23 묶음 C 합친 상태 실측: 묶음 A's
  // NEW GAME+ line raised under the title strip with #272's balloon rules.
  // [batch-c] 묶음 B (#277):
  // 674 / 13078 -> 652 / 12653 on 2026-10-22 (D-3), measured 646 / 12596,
  // the room unchanged: the story's zigzag and tilt, the slanted lead, and
  // the phone's docked footer, which every phone now lays out as the short
  // screen did (22 lines and 425 bytes).
  // 652 / 12653 -> 653 / 12696 the same day (D-7), measured: the line from
  // the scene before, over the briefing's first box.
  // 653 / 12696 -> 676 / 13060 the same day (D-13), measured: a phone draws
  // the room behind the page's title, its panel keeps the room's name and
  // clock, and the speaker's face is 96px. Two lines over the 674 the sheet
  // held before D-3, 18 bytes under its 13078.
  // story-copy-1 (Q8 (1)) took it 674 / 13078 -> 681 / 13293 on its own base:
  // the case's opening voice under the title and the title strip's third row.
  // 696 / 13379 on 2026-10-23 in batch B, measured with both and with the
  // speaker's line on the last table (C-13) in a box of its own; 697 / 13392
  // on batch A, measured.
  // -> 740 / 14201 on 2026-10-23, 묶음 C (A + B + #261 + #272) 합친 상태 실측:
  // B's phone page (D-3, D-13, Q8, C-13) with #272's balloon, question box and chip.
  // -> 746 / 14302 the same evening, measured: C-13's box names the table it
  // is about on a small line of its own (운영 확인 고칠 점 4); 748 / 14339 with
  // the balloon's tail drawn under its words (고칠 점 1), measured.
  // 748 / 14339 -> 846 / 16306 on 2026-10-24, measured: B-11(1)'s act title
  // card (ActCard.jsx) in front of an act's first briefing -- its backdrop,
  // page, kicker, name, sentence, count, 계속 with the bar of the time left,
  // and the reduced-motion rule that stills all three.
  // 846 / 16306 -> 846 / 16328 on 2026-11-02, measured (pc-type-scale): the
  // briefing timer keeps its size through --hud-rem from 1024px wide.
  // 846 / 16306 -> 849 / 16456 on 2026-11-02, measured (plate-story, D): the
  // sound is lettered beside what makes it, placed in the drawing's units, so
  // the splash panel is a size container and the word's corner pin became a
  // position read off the plate. 849 / 16478 over main 5c00dffe (with
  // pc-type-scale), measured.
  // 849 / 16478 -> 849 / 16498 on 2026-11-03, measured (plate-sound-clip): the
  // word is centred in its transform, which the build keeps, not by the
  // separate translate property the build dropped.
  // 849 / 16498 -> 854 / 16681 on 2026-11-06, mood-boost, measured: the briefing veil's mood edge and the page's mood frame.
  "briefing.css": { lines: 854, bytes: 16681 },
  // 270 / 5754 -> 330 / 7100 on 2026-10-06, measured 328 / 7068: the
  // developer's overlay came here from the foot of play.css.
  // 330 / 7100 -> 324 / 6702 on 2026-10-13: comments no longer counted
  // (6 lines and 398 bytes of them that day), the room unchanged.
  "recovery.css": { lines: 324, bytes: 6702 },
  // relics.css arrived on 2026-09-15 with the relic draft, sized to the file.
  // 460 / 9400 -> 465 / 9510 on 2026-09-15 when the draft became a glass modal.
  // 465 / 9510 -> 482 / 9950 on 2026-09-27: the proc glow is a layer faded by
  // opacity rather than an animated box-shadow.
  // 9950 -> 10100 bytes on 2026-10-06, measured 481 / 10065: rem, and the
  // draft's side insets.
  // 482 / 10100 -> 473 / 9410 on 2026-10-13: comments no longer counted
  // (9 lines and 690 bytes of them that day), the room unchanged.
  // 473 / 9410 -> 472 / 9356 on 2026-11-05, measured (bundle-rules2): kd-spend-ui's trim moved the draft's two buys into
  // draft-spend.css and left relics.css a line shorter; the ratchet follows.
  "relics.css": { lines: 472, bytes: 9356 },
  // 200 / 4700 -> 204 / 4800 on 2026-09-27: reduced motion zeroes delays too.
  // 204 / 4800 -> 240 / 5850 on 2026-09-28 for the forced-colours block: an
  // edge on every bar's track and a system colour on its fill.
  // 240 / 5850 -> 445 / 10500 on 2026-10-06, measured 444 / 10470, for a
  // phone held on its side: under 480px of height the table had no layout of
  // its own and the hand sat a screen and a half below the action bar. The
  // block is the wide screen's two panes at a phone's scale, with two shorter
  // steps under it, and it lives here because it restyles the header, the
  // music controls, the table, the dock and the reveal together.
  // 445 / 10500 -> 406 / 7967 on 2026-10-13: comments no longer counted
  // (39 lines and 2533 bytes of them that day), the room unchanged.
  // 406 / 7967 -> 414 / 8085 on 2026-10-23, measured: the gauge's reading
  // kept to one line on a phone on its side once 안전선 ×N joined it.
  // -> 417 / 8161 on 2026-10-24, measured: off the table the music pills
  // scroll with the page on a phone (운영화면 문제 3 (1)).
  // -> 417 / 8165 on 2026-11-02, measured (money-feedback): a phone on its
  // side gives the purse line a 30px clock and 2px off the HUD's air.
  "responsive.css": { lines: 417, bytes: 8165 },
  // 1225 / 25700 -> 1750 / 43100 on 2026-09-15: the result screen stopped
  // mixing white report cards into a dark page. The hero card and rank ring, the
  // tool dock, the lead row, the metric tile grid, and dark surfaces for about
  // twenty archive panels that each used to paint their own light ground; the
  // table ledger's rules also moved here from the foot of app.css.
  // 1750 / 43100 -> 1772 / 43650 on 2026-09-16: the next-case panel says which
  // building the season moves to and why, from the `operatorBriefs` table that
  // had been written and never read.
  // 1772 / 43650 -> 1815 / 44800 on 2026-09-16 for the 막간 panel: the beat
  // between two cases, with a mood tint, on the report's only unpressured
  // screen. Six cases in one register was the state this panel exists to break.
  // 1815 / 44800 -> 2130 / 52100 on 2026-09-27: 52 rules for the ending
  // sequence and the report's panels moved here out of extensions.css.
  // 2130 / 52100 -> 2560 / 60800 on 2026-09-28, the one budget that rose:
  // extensions.css was retired and 80 of the 95 rules it had left belong to
  // the ending sequence and the report's panels, and the report rules that sat
  // at the head of play.css came here too. The nine sheets together went from
  // 11,492 lines / 257,177 bytes to 10,767 / 242,536 in the same pass, with
  // 514 declarations that never won a cascade deleted.
  // 2560 / 60800 -> 2509 / 57089 on 2026-10-13: comments no longer counted
  // (51 lines and 3711 bytes of them that day), the room unchanged.
  // 2509 -> 2512 lines on 2026-10-25, C-1(1) (the 판 읽기 axis), measured: the
  // score breakdown's seventh card leaves the penalty card alone in its row,
  // and one rule gives it the row. The bytes still fit.
  "result.css": { lines: 2512, bytes: 57089 },
  // New on 2026-09-29 for the comfort settings. Measured 131 / 3,633.
  // 140 / 3800 -> 124 / 2691 on 2026-10-13: comments no longer counted
  // (16 lines and 1109 bytes of them that day), the room unchanged.
  // 124 / 2691 -> 133 / 3047 on 2026-10-22 (D-5), measured: 이야기 글 크기,
  // the story's prose at 1.125 or 1.25 times its size. Paid for by D-3 the
  // same day, which took briefing.css down 22 lines and 425 bytes.
  // 133 / 3047 -> 175 / 3849 on 2026-10-26 (pwa-install-hint), measured: the
  // 홈 화면에 추가 card under the settings in the intro's comfort drawer
  // (components/InstallHint.jsx), drawn only where a browser offers an install.
  "comfort.css": { lines: 175, bytes: 3849 },
  // New on 2026-11-02 (money-feedback): the bank rail's purse and the slam's
  // amount that flies into it, in a file of its own beside play.css's 360px
  // fits. Measured 128 / 2331; 133 / 2478 with the purse line set solid on a
  // phone, upright (480px or less) or on its side (Linux hand5, the densest
  // boards at 390x844, the phone-on-its-side tests).
  // 133 / 2478 -> 261 / 5264 on 2026-11-04 (kd-bank-account), measured: the
  // purse leaves the rail and is the KD은행 계좌, a band across the top below
  // 1025px and a corner box above it, with the shell, the music pills and the
  // layers in front of the table moved out from under it, and the season's
  // columns a tap away. The phone's purse-line fit (line-height 1, the season
  // joining the line) is gone with the line.
  // 261 / 5264 -> 282 / 5713 the same day, measured: the band's 44px press
  // area, and the reveal's sheet shortened by the band (and under the box).
  // 282 / 5713 -> 283 / 5730 the same day, measured: the band under the music
  // pills (29), the corner box over the layers (30).
  "money.css": { lines: 283, bytes: 5730 },
  // New on 2026-11-05 (kd-spend-ui, C9 PR 2 over main 2bd9a8ba): the relic
  // draft's two buys out of the KD은행 계좌 (다시 뽑기, 하나 더: RelicDraft.jsx's
  // DraftBuy), in a file of their own beside relics.css, whose 473 / 9410 was
  // every line spent. Measured 41 / 808.
  "draft-spend.css": { lines: 41, bytes: 808 },
};

/** Every rule, in cascade order, tagged with the at-rules it sits inside. */
function readRules() {
  const rules = [];
  for (const file of IMPORT_ORDER) {
    const css = readFileSync(`${APP_DIR}/${file}`, "utf8");
    const stack = [];
    let index = 0;
    let preludeStart = 0;
    while (index < css.length) {
      if (css[index] === "/" && css[index + 1] === "*") {
        index = css.indexOf("*/", index) + 2;
        // The prelude restarts after a comment. Without this a comment sitting
        // in front of an at-rule made the prelude read as "/* ... */ @media",
        // which does not start with "@", so the whole block was consumed as one
        // rule and every rule after it in that file looked top-level.
        preludeStart = index;
        continue;
      }
      if (css[index] === "{") {
        const prelude = css.slice(preludeStart, index).trim();
        if (prelude.startsWith("@")) {
          stack.push(prelude);
          index += 1;
        } else {
          const end = css.indexOf("}", index);
          rules.push({ file, context: stack.join(" && "), selector: prelude.replace(/\s+/g, " ") });
          index = end + 1;
        }
        preludeStart = index;
        continue;
      }
      if (css[index] === "}") {
        stack.pop();
        index += 1;
        preludeStart = index;
        continue;
      }
      index += 1;
    }
  }
  return rules;
}

/**
 * The selectors of a rule's comma list, each on its own. A comma inside
 * `:is()`, `:not()` or `:where()` belongs to that selector: splitting on every
 * comma made `.page :is(.a` and `.b)` out of one selector.
 */
function selectorsOf(rule) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < rule.selector.length; index += 1) {
    const char = rule.selector[index];
    if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(rule.selector.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(rule.selector.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

const failures = [];

const onDisk = readdirSync(APP_DIR).filter((entry) => entry.endsWith(".css")).sort();
const imported = [...IMPORT_ORDER].sort();
assert.deepEqual(
  onDisk,
  imported,
  `every file in ${APP_DIR} must be imported by app.css: on disk ${onDisk.join(", ")}, imported ${imported.join(", ")}`,
);

for (const file of onDisk) {
  const css = readFileSync(`${APP_DIR}/${file}`, "utf8");
  const budget = fileBudgets[file];
  if (!budget) {
    failures.push(`${file} has no CSS size budget.`);
    continue;
  }
  // Comments are not counted (2026-10-13), and the message says so: the
  // number is not the one an editor or `wc` shows for the file, and nobody
  // should conclude from it that deleting a comment would help.
  const { lines, bytes } = measureCss(css);
  if (lines > budget.lines) failures.push(`${file} is ${lines} lines without its comments, over the ${budget.lines} budget.`);
  if (bytes > budget.bytes) failures.push(`${file} is ${bytes} bytes without its comments, over the ${budget.bytes} budget.`);
}

const rules = readRules();

const homes = new Map();
for (const rule of rules) {
  if (rule.context !== "") continue;
  for (const selector of selectorsOf(rule)) {
    if (!homes.has(selector)) homes.set(selector, new Set());
    homes.get(selector).add(rule.file);
  }
}
const twoHomes = [...homes].filter(([, files]) => files.size > 1);
if (twoHomes.length > budgets.selectorsWithTwoHomes) {
  failures.push(
    `${twoHomes.length} selectors are defined at the top level of more than one file; budget is ${budgets.selectorsWithTwoHomes}.\n` +
      twoHomes.map(([selector, files]) => `    ${selector} -- ${[...files].join(", ")}`).join("\n"),
  );
}

const conditionalHomes = new Map();
for (const rule of rules) {
  if (rule.context === "") continue;
  for (const selector of selectorsOf(rule)) {
    const key = `${rule.context} { ${selector} }`;
    if (!conditionalHomes.has(key)) conditionalHomes.set(key, new Set());
    conditionalHomes.get(key).add(rule.file);
  }
}
const twoConditionalHomes = [...conditionalHomes].filter(([, files]) => files.size > 1);
if (twoConditionalHomes.length > budgets.selectorsWithTwoHomesUnderOneCondition) {
  failures.push(
    `${twoConditionalHomes.length} selectors are defined under the same condition in more than one file; budget is ${budgets.selectorsWithTwoHomesUnderOneCondition}.\n` +
      twoConditionalHomes.map(([key, files]) => `    ${key} -- ${[...files].join(", ")}`).join("\n"),
  );
}

const seen = new Map();
for (const rule of rules) {
  const key = `${rule.file}||${rule.context}||${rule.selector}`;
  seen.set(key, (seen.get(key) ?? 0) + 1);
}
const repeats = [...seen.values()].reduce((sum, count) => sum + count - 1, 0);
if (repeats > budgets.repeatedInOneFile) {
  failures.push(`${repeats} rules repeat a selector inside one file; budget is ${budgets.repeatedInOneFile}.`);
}

const seenSelectors = new Map();
for (const rule of rules) {
  for (const selector of selectorsOf(rule)) {
    const key = `${rule.file}||${rule.context}||${selector}`;
    seenSelectors.set(key, (seenSelectors.get(key) ?? 0) + 1);
  }
}
const selectorRepeats = [...seenSelectors.values()].reduce((sum, count) => sum + count - 1, 0);
if (selectorRepeats > budgets.selectorsRepeatedInOneFile) {
  const worst = [...seenSelectors]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([key, count]) => `    ${key.split("||").filter(Boolean).join(" | ")} x${count}`);
  failures.push(
    `${selectorRepeats} selectors are written again inside one file under the same condition; budget is ${budgets.selectorsRepeatedInOneFile}. The most repeated:\n${worst.join("\n")}`,
  );
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(
  `CSS structure checks passed (${rules.length} rules, ${twoHomes.length}/${budgets.selectorsWithTwoHomes} selectors with two homes, ` +
    `${twoConditionalHomes.length}/${budgets.selectorsWithTwoHomesUnderOneCondition} with two homes under one condition, ` +
    `${repeats}/${budgets.repeatedInOneFile} rules and ${selectorRepeats}/${budgets.selectorsRepeatedInOneFile} selectors repeated in one file).`,
);
