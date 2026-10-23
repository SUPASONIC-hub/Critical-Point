import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Rules a later sheet or a wider query silently undoes. They are read from the
 * source because nothing here renders a page: the browser suite holds what
 * they look like, and this holds that they are still written the way that
 * makes them apply.
 */
const sheet = (name) => readFileSync(new globalThis.URL(`../../src/styles/app/${name}.css`, import.meta.url), "utf8");

test("the phone-on-its-side layout is for phones", () => {
  const queries = sheet("responsive").match(/@media[^{]*orientation: landscape[^{]*/g) ?? [];
  assert.equal(queries.length, 3);
  for (const query of queries) {
    assert.match(query, /\(pointer: coarse\)/, `${query.trim()}: a laptop zoomed to 200% is this short too`);
  }
});

test("the table's shell does not pad the notch a second time", () => {
  const shell = sheet("responsive").match(/\(pointer: coarse\) \{\s*\.game-shell \{[^}]*\}/)?.[0] ?? "";
  assert.match(shell, /padding:/);
  assert.doesNotMatch(shell, /safe-area-inset-(left|right)/, "the body already pads the sides");
});

test("no phone on its side reads the question as one line", () => {
  const clamps = (sheet("responsive").match(/\.gx-question \{[^}]*\}/g) ?? []).filter((rule) => rule.includes("line-clamp"));
  assert.equal(clamps.length, 1);
  assert.match(clamps[0], /-webkit-line-clamp: 2;/);
});

test("the reveal keeps out from under a side notch at every width", () => {
  // recovery.css comes later and sets the backdrop's padding under 768px; one
  // class there, so two here.
  assert.match(sheet("responsive"), /\.shell \.decision-reveal-backdrop \{\s*padding: [^;]*safe-area-inset-right[^;]*safe-area-inset-left/);
  assert.match(sheet("recovery"), /\n {2}\.decision-reveal-backdrop \{/);
});

test("the quiet skip outranks the ending's primary button", () => {
  const result = sheet("result");
  assert.match(result, /\.ending-shell \.ending-beat \.ending-quiet-skip \{/);
  assert.ok(result.includes(".ending-shell .ending-beat button {"), "the rule it has to beat is still two classes and a tag");
});

test("a card's streak sign is printed at every width, on the line its tag already has", () => {
  const hand = readFileSync(new globalThis.URL("../../src/gauntlet/GauntletHand.jsx", import.meta.url), "utf8");
  const tag = hand.slice(hand.indexOf("export function CardType("), hand.indexOf("export function WildName("));
  // Inside the tag, for the eye; the words for a screen reader stay beside it.
  assert.match(tag, /<span className=\{`gx-card-type[^>]*>\s*\{mark && <b className="gx-card-move"[^>]*aria-hidden="true">\{mark\} <\/b>\}/);
  assert.match(tag, /const mark = getMoveMark\(move\);/);
  assert.match(tag, /\{move && <span className="sr-only">\{describeCardMove\(move\)\}<\/span>\}/);

  // No sheet takes the sign, or the tag it is in, off the screen: under 720px
  // the rest of the type's name is cut (`.gx-card-type i`) and the sign is not.
  const hides = /display:\s*none|visibility:\s*hidden|font-size:\s*0[;\s]|opacity:\s*0[;\s]/;
  const isTheSign = (selector) => /\.gx-card-move\b/.test(selector) || /\.gx-card-type(?![-\w])(?!.*\si$)/.test(selector);
  let read = 0;
  for (const name of ["play", "responsive", "comfort", "briefing", "recovery", "relics"]) {
    for (const [, selectors, body] of sheet(name).replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const mine = selectors.split(",").map((selector) => selector.trim()).filter(isTheSign);
      if (mine.length === 0) continue;
      read += 1;
      assert.doesNotMatch(body, hides, `${name}.css hides ${mine.join(", ")}`);
    }
  }
  assert.ok(read >= 3, "the tag's own rules are still where this reads them");
  // The phone's cut is still the name's other words, and only those.
  const phone = sheet("play").match(/@media \(max-width: 719px\) \{\s*\.gx-streak em \{[\s\S]*?\n\}/)?.[0] ?? "";
  assert.match(phone, /\.gx-streak i,\s*\.gx-card-type i \{\s*font-size: 0;\s*\}/);
  assert.doesNotMatch(phone, /gx-card-move/);

  // Out of the card's flow, so it adds no height to a card: the tag is
  // absolutely placed on the card's top edge and the sign is inline in it.
  assert.match(sheet("play"), /\.gx-card > \.gx-card-type,\s*\.gx-comic-cards \.gx-card-type \{\s*position: absolute;\s*top: -8px;/);
});

test("the gauge marks the heats its rules read, and takes no height for it", () => {
  const stage = readFileSync(new globalThis.URL("../../src/gauntlet/GauntletStage.jsx", import.meta.url), "utf8");
  const meter = stage.slice(stage.indexOf('role="meter"'), stage.indexOf('className="gx-gauge-read"'));
  // From the rules' own numbers, not a copy of them.
  assert.match(meter, /\{logic && GAUGE_MARKS\.map\(\(at\) => \(\s*<span key=\{at\} className="gx-gauge-mark"[^>]*style=\{\{ left: `\$\{at\}%` \}\} \/>/);
  const rule = sheet("play").match(/\n\.gx-gauge-mark \{([^}]*)\}/)?.[1] ?? "";
  assert.match(rule, /position: absolute;/, "inside the track, out of its flow");
  assert.match(rule, /border-inline: 1px solid/, "a border is still drawn in forced colours");
  assert.doesNotMatch(rule, /height|margin|padding/);
});

test("the callsign field's focus ring survives forced colours", () => {
  const focus = sheet("base-intro-ranking").match(/\.intro \.start-panel \.start-input-row input:focus-visible \{[^}]*\}/)?.[0] ?? "";
  assert.match(focus, /outline: 2px solid transparent;/, "a box-shadow is dropped in forced colours; a transparent outline is repainted");
});

test("the mastery bar's fill is drawn in forced colours", () => {
  // A background colour is repainted as the canvas there, and the bar is nothing else.
  const fills = sheet("responsive").match(/@media \(forced-colors: active\) \{[\s\S]*?(\.gx-gauge-fill,[^{]*)\{[^}]*\}/);
  assert.ok(fills, "the forced-colours block lists the fills");
  assert.match(fills[1], /\.gx-focus-modes i b,/);
  assert.match(fills[0].slice(fills[0].lastIndexOf("{")), /forced-color-adjust: none;\s*background: Highlight;/);
});
test("a stance that cannot be changed is dimmed, and the one in force is not", () => {
  const play = sheet("play");
  assert.match(play, /\.gx-focus-modes \[aria-disabled="true"\] \{\s*cursor: not-allowed;\s*\}/);
  assert.match(play, /\.gx-focus-modes \[aria-disabled="true"\]:not\(\.active\) \{\s*opacity: 0\.5;\s*\}/, "the active stance is what a locked table is holding: it stays at full strength");
  // The attribute those rules read is GuardedButton's: the row set it by hand
  // with the click still wired and no reason, and explained the count in a title.
  const row = readFileSync(new globalThis.URL("../../src/gauntlet/StanceRow.jsx", import.meta.url), "utf8");
  assert.match(row, /<GuardedButton[^>]*?blocked=\{blocked\}\s+aria-describedby=\{blocked \? "gx-stance-blocked gx-stance-detail" : "gx-stance-detail"\}/);
  assert.match(row, /\{blocked && <span id="gx-stance-blocked" className="sr-only">[^<]+<\/span>\}/);
  assert.match(row, /<span id="gx-stance-detail" className="sr-only">/);
  assert.equal(/aria-disabled=|\stitle=/.test(row), false, "no raw aria-disabled, and nothing a phone cannot show");
});

test("the briefing cards, the draft's skip and its folded feats are pressed over 44px and drawn no larger", () => {
  const play = sheet("play");
  assert.match(play, /\.gx-comic-card::before \{\s*content: "";\s*position: absolute;\s*inset: -4px 0;\s*\}/);
  assert.match(play, /\.gx-codex-note summary::before \{\s*content: "";\s*position: absolute;\s*inset: -10px 0;\s*\}/);
  assert.match(play, /\.gauntlet-stage \.gx-draft-skip::before \{\s*content: "";\s*position: absolute;\s*inset: 0 0 -8px;\s*\}/);
  assert.match(sheet("briefing"), /\.gx-comic-card \{[^}]*min-height: 40px;/);
  assert.match(sheet("relics"), /\.gx-codex-note summary \{\s*position: relative;\s*min-height: 24px;/);
  assert.match(sheet("relics"), /\.gauntlet-stage \.gx-draft-skip \{\s*position: relative;\s*margin-left: auto;\s*min-height: 38px;/);
});

test("the header's tools and the stances are pressed over 44px tall, not 44 less their borders", () => {
  const play = sheet("play");
  // Placed against the padding box: -8px around a 28px button with a 1px border is 42.
  assert.match(play, /\.gauntlet-shell \.top-actions\.compact-actions button::before \{\s*content: "";\s*position: absolute;\s*inset: calc\(50% - 22px\) -1\.5px;\s*\}/);
  assert.match(play, /\.gx-focus-modes button::before \{\s*content: "";\s*position: absolute;\s*inset: calc\(50% - 22px\) 0;\s*\}/);
  // SCOUT's 14px pill (1px border) on a phone takes the same area.
  assert.match(play, /\.gx-scout::before,\s*\.gx-focus-modes button::before \{/);
  assert.match(play, /\.gx-comic-cards > \*,\s*\.gx-scout \{\s*position: relative;\s*\}/);
});

test("the music pills, the folded case file and the report's tools are pressed over 44px and drawn no larger", () => {
  const intro = sheet("base-intro-ranking");
  assert.match(intro, /\.music-toggle,\s*\.music-volume-toggle \{\s*position: relative;/);
  assert.match(intro, /\.music-toggle::before,\s*\.music-volume-toggle::before \{\s*content: "";\s*position: absolute;\s*inset: calc\(50% - 22px\);\s*\}/);
  const play = sheet("play");
  assert.match(play, /\.gx-brief summary \{\s*position: relative;/);
  // Down from its top, and folded only: .gx-scene clips above, and open it would cover the text.
  assert.match(play, /\.gx-brief:not\(\[open\]\) summary::before \{\s*content: "";\s*position: absolute;\s*inset: 0 0 auto;\s*height: 44px;\s*\}/);
  const result = sheet("result");
  assert.match(result, /\.result-page \.top-actions \.ghost \{\s*position: relative;/);
  assert.match(result, /\.result-why-doors \.ghost \{\s*position: relative;/);
  assert.match(result, /\.result-page \.top-actions \.ghost::before,\s*\.result-why-doors \.ghost::before \{\s*content: "";\s*position: absolute;\s*inset: calc\(50% - 22px\) 0;\s*\}/);
  // The phone's dock scrolls sideways and clips at its padding box: 3px of reach needs 6px of padding.
  assert.match(result, /\.result-page \.top-actions \{[^}]*padding: 6px;/);
});

test("the clock, the key hints and the card preview are sized in the type's own unit", () => {
  const play = sheet("play");
  const boxes = [...play.matchAll(/\.gx-clock \{[^}]*\}|\.gx-card-key \{[^}]*\}|\.gx-hand-head kbd \{[^}]*\}|\.gx-card-preview \{[^}]*\}/g)].map((match) => match[0]);
  assert.ok(boxes.length >= 10, `found ${boxes.length} rules`);
  for (const box of boxes) {
    const sized = box.match(/^\s*(?:min-|max-)?(?:width|height): [^;]*;/gm) ?? [];
    for (const declaration of sized) assert.doesNotMatch(declaration, /\dpx/, `${box.split("{")[0].trim()} holds rem type in a px box: ${declaration.trim()}`);
  }
});
test("a phone on its side keeps the fold that prints the question and the cards whole", () => {
  const responsive = sheet("responsive");
  const hidden = responsive.match(/\(pointer: coarse\) \{[\s\S]*?\{\s*display: none;\s*\}/g) ?? [];
  assert.equal(hidden.length, 3);
  for (const rule of hidden) assert.doesNotMatch(rule, /\.gx-brief\b/, "the table cuts both to two lines there, and nothing else prints them");
  // On the speaker's line, and beside the question once that line is gone: a
  // row of its own is 14px the shortest screens do not have.
  assert.match(responsive, /\(max-height: 480px\)[\s\S]*?\.gx-brief \{\s*grid-row: 2;\s*\}/);
  assert.match(responsive, /\(max-height: 360px\)[^{]*\{\s*\.gx-speaker \{\s*display: none;\s*\}[\s\S]*?\.gx-question \{\s*grid-column: 1;\s*\}\s*\.gx-brief \{\s*grid-row: 1;\s*\}/);
});
/**
 * Issue #100. Written from arithmetic on 2026-10-13 and not yet measured in a
 * browser: the sweep's "the fullest ... hands fit on an overclocked board with
 * five relics" tests are what say it fits. This holds that the rules are still
 * written so that they apply, and that they still add up to the 19px the
 * worst of the 23 hands was under by.
 */
test("a short phone gives a five-card hand under a rules line 20px without cutting a label", () => {
  const play = sheet("play");
  const short = play.match(/@media \(max-width: 480px\) and \(max-height: 760px\) \{[\s\S]*?\n\}/)?.[0] ?? "";
  const px = (rule, property) => Number(rule.match(new RegExp(`\\n\\s*${property}: (\\d+)px`))?.[1]);

  const hand = short.match(/\n {2}\.gx-read:has\(\.gx-active-rules\) ~ \.hand-5 \{[^}]*\}/)?.[0] ?? "";
  const card = short.match(/\n {2}\.gx-read:has\(\.gx-active-rules\) ~ \.hand-5 \.gx-card \{[^}]*\}/)?.[0] ?? "";
  const column = short.match(/\n {2}\.gx-read:has\(\.gx-active-rules\) \{[^}]*\}/)?.[0] ?? "";
  assert.ok(hand && card && column, "the three rules are in the short-phone block");

  // What they are taken from: the short phone's own hand, and the phone's card.
  const plainHand = px(short.match(/\n {2}\.gx-hand \{[^}]*\}/)?.[0] ?? "", "gap");
  const phoneCard = play.match(/@media \(max-width: 719px\) \{\s*\.gauntlet-stage \.gx-card \{[^}]*\}/)?.[0] ?? "";
  const [, padBlock] = phoneCard.match(/padding: (\d+)px \d+px;/) ?? [];
  const plainColumn = px(short.match(/\n {2}\.gx-read,\s*\.gx-table \{[^}]*\}/)?.[0] ?? "", "gap");
  assert.ok(plainHand && padBlock && plainColumn, "the rules they are taken from are where this reads them");

  // Two rows of two cards and a strip: three rows of padding, two row gaps,
  // and two rows whose cards stack a label over their numbers.
  const fromPadding = 3 * 2 * (Number(padBlock) - px(card, "padding-block"));
  const fromCardGap = 2 * (px(phoneCard, "gap") - px(card, "gap"));
  const fromHandGap = 2 * (plainHand - px(hand, "gap"));
  assert.equal(fromPadding + fromCardGap + fromHandGap, 20, "19px is the furthest a hand was under the action bar; a rounded 19 can be 19.99");
  // The column above the hand: the HUD, the rules line, the gauge and the scene.
  assert.ok(3 * (plainColumn - px(column, "gap")) >= 3, "and the column above gives 3px more");

  // More specific than the rules it changes, wherever they sit in the sheet:
  // `.gauntlet-stage .gx-card` is two classes and comes later.
  assert.match(play, /\n {2}\.gauntlet-stage \.gx-card \{\s*gap: 6px;/);
  // The room is not taken from the words. Only a phone on its side cuts a label at two lines.
  assert.doesNotMatch(short, /\.gx-card-label/);
  assert.match(play, /@media \(max-width: 719px\) \{[\s\S]*?\.gx-card-label \{[^}]*-webkit-line-clamp: 3;/);
  // The board is told by the rules line, as the situation board's rule tells it.
  assert.match(short, /\.gx-active-rules ~ \.gx-situation \{\s*display: none;/);
  const stage = readFileSync(new globalThis.URL("../../src/gauntlet/GauntletStage.jsx", import.meta.url), "utf8");
  const read = stage.indexOf('<div className="gx-read">');
  const rules = stage.indexOf('className="gx-active-rules"');
  const head = stage.indexOf('<div className="gx-hand-head"');
  assert.ok(read > 0 && read < rules && rules < head, "the rules line is inside the column the hand follows");
  assert.match(readFileSync(new globalThis.URL("../../src/gauntlet/GauntletHand.jsx", import.meta.url), "utf8"), /className=\{`choices gx-hand hand-\$\{handSize\}`\}/);
});

/**
 * Written from arithmetic on 2026-10-13, not yet measured: at 360x740 the
 * docked cards started at 493px and the first briefing's introduction ended at
 * 555px. With 판 열기 alone docked (56px, 8px off the bottom) the dock starts
 * at 676px. From 2026-10-22 (D-3) every phone docks 판 열기 alone: at 390x844
 * the docked cards covered about 250px of the story.
 */
test("every phone docks 판 열기 alone under the briefing, and the cards follow the story", () => {
  const briefing = sheet("briefing");
  const query = briefing.match(/@media ([^{]*)\{\s*\.gx-comic-actions \{\s*display: contents;\s*\}/)?.[1] ?? "";
  assert.match(query, /\(max-height: 35em\),/, "any screen that short, whatever its width");
  assert.match(query, /\(max-width: 700px\)\s*$/, "and every phone upright, whatever its height");
  const open = briefing.slice(briefing.indexOf(query)).match(/\.gx-open-table \{[^}]*\}/)?.[0] ?? "";
  assert.match(open, /position: sticky;\s*bottom: 8px;/);
  assert.match(briefing, /\n\.gx-open-table \{[^}]*min-height: 56px;/, "740 - 8 - 56 = 676px, and the panel ends at 555px");
  // The story is one straight column of boxes: no zigzag, no tilt, no slanted lead.
  assert.doesNotMatch(briefing, /\.gx-panel-story \.gx-caption:nth-child/);
  assert.doesNotMatch(briefing.match(/\.gx-caption-lead \{[^}]*\}/)?.[0] ?? "", /italic/);
  assert.match(briefing, /\n\.gx-caption \{[^}]*font-weight: 500;/);
});

test("an intro drawer opened by its link stops below the music pills", () => {
  const intro = sheet("base-intro-ranking");
  const pills = intro.match(/\.music-controls \{[^}]*\}/)?.[0] ?? "";
  const size = intro.match(/\.music-toggle,\s*\.music-volume-toggle \{[^}]*\}/)?.[0] ?? "";
  const drawer = intro.match(/\n\.intro-drawer \{[^}]*\}/)?.[0] ?? "";
  const top = pills.match(/top: (max\(16px, env\(safe-area-inset-top\)\));/)?.[1];
  const height = Number(size.match(/min-height: (\d+)px;/)?.[1]);
  assert.ok(top && height, "the pills are still placed and sized where this reads them");
  const margin = drawer.match(/scroll-margin-top: calc\((.*) \+ (\d+)px\);/);
  assert.ok(margin, "the drawer has a scroll margin");
  assert.equal(margin[1], top, "the same offset the pills are pinned at, notch included");
  assert.ok(Number(margin[2]) > height, "and more than their height below it");
});

// Four leftovers of the 2026-10-12 screen check. Each number below was computed
// from the sheets and the font's own advances, not read off a screen.
const source = (path) => readFileSync(new globalThis.URL(`../../src/${path}`, import.meta.url), "utf8");

test("the LOCK button's sub-line is the charge and the price, without the stance", () => {
  // At 390px the button has 82px inside its padding (74px at 360px). With the
  // stance in front the line was 94 to 112px and `nowrap`; without it, 57 to 70px.
  const stage = source("gauntlet/GauntletStage.jsx");
  const lock = stage.match(/data-testid="commit-focus"[\s\S]*?<\/button>/)?.[0] ?? "";
  // At LOCK's cap the line is 상한 도달 alone (C-6, 2026-10-22), shorter than the charge and the price.
  assert.match(lock, /<small>\{lockCapped \? "상한 도달" : <>\{Math\.round\(win\.focus\)\} · −\{LOCK_PRESS_SECONDS\}초<\/>\}<\/small>/);
  assert.match(stage, /data-testid="gauntlet-focus">[\s\S]*?<b[^>]*>\{focusBonus\.label\} \{Math\.round\(win\.focus\)\}<\/b>/, "the HUD's signal is where the stance is named");
  // What the arithmetic stands on: three columns, a 6px gap and 10px sides on a phone.
  const phone = sheet("play").match(/\n {2}\.gx-actions \{\s*grid-template-columns: 1fr 0\.78fr 1\.12fr;\s*gap: 6px;\s*padding-inline: 10px;\s*\}/);
  assert.ok(phone, "the phone's dock is still the one the sub-line was measured in");
  assert.match(sheet("play"), /\.gx-actions button small \{[^}]*white-space: nowrap;/);
});

test("the comfort panel is inset once by the drawer, not twice", () => {
  const panel = sheet("comfort").match(/\.intro \.intro-drawer > \.accessibility-panel \{[^}]*\}/)?.[0] ?? "";
  assert.match(panel, /display: grid;/);
  assert.doesNotMatch(panel, /padding/, "the drawer's own 20px is the inset; 20px more left a toggle's text 184px at 360px");
  assert.match(sheet("base-intro-ranking"), /\.intro \.intro-drawer > :not\(summary\) \{\s*width: auto;\s*margin: 2px 20px 20px;\s*\}/);
});

test("the result page's brand pill keeps clear of two music icons, not of two labelled pills", () => {
  const pill = sheet("result").match(/@media \(max-width: 480px\) \{[\s\S]*?\n {2}\.result-page \.brand-mark \{[^}]*\}/)?.[0] ?? "";
  const reserved = Number(pill.match(/max-width: calc\(100% - (\d+)px\);/)?.[1]);
  // The icons end 92px from the screen's edge (10 + 38 + 6 + 38) and the page
  // is padded 16px, so 76px of the row is under them.
  assert.ok(reserved >= 76, "the pill ends before the music icons begin");
  // The title is 165px of text in a pill with 30px of padding and border, on a
  // row of 328px at 360px.
  assert.ok(328 - reserved >= 195, "and TRIGGERLAB: CRITICAL POINT is printed whole at 360px");
  const phone = sheet("responsive").match(/@media \(max-width: 480px\) \{\s*\.music-controls \{[\s\S]*?\.music-controls span \{\s*display: none;\s*\}/)?.[0] ?? "";
  assert.match(phone, /right: max\(10px, env\(safe-area-inset-right\)\);/);
  assert.match(phone, /padding: 0 9px;/, "the icons are still the size this was measured against");
});

test("a phone draws the room behind the briefing's title, and its panel is the room's name and clock (D-13)", () => {
  const briefing = sheet("briefing");
  const phone = briefing.slice(briefing.indexOf("@media (max-width: 700px)"));
  assert.match(briefing, /\n\.gx-comic-top > \.gx-plate-backdrop \{\s*display: none;\s*\}/, "a wider page draws it in its panel");
  assert.match(phone, /\.gx-comic-top \{\s*position: relative;\s*z-index: 0;\s*\}/, "the title is the drawing's stacking context");
  assert.match(phone, /\.gx-comic-top > \.gx-plate-backdrop \{\s*display: block;\s*height: 100%;/);
  assert.match(phone, /\.gx-panel-splash > \.gx-plate,\s*\.gx-sfx \{\s*display: none;\s*\}/);
  assert.match(phone, /\.gx-caption-place \{\s*position: relative;\s*inset: auto;/, "the caption is in the flow, above the halftone");
  // A face a reader can recognise at 96px, and the name larger beside it.
  assert.match(phone, /\.gx-panel-speaker \{\s*grid-template-columns: 96px 1fr;\s*\}/);
  assert.match(phone, /\.gx-speaker-tag b \{\s*font-size: 1\.375rem;\s*\}/);
  const jsx = readFileSync(new globalThis.URL("../../src/gauntlet/SceneBriefing.jsx", import.meta.url), "utf8");
  const header = jsx.slice(jsx.indexOf('<header className={`gx-comic-top'), jsx.indexOf("</header>"));
  assert.match(header, /<ScenePlate node=\{node\} nodeId=\{nodeId\} variant="backdrop" \/>/);
  // The place caption keeps the sizes it always had.
  assert.match(briefing, /\.gx-caption \{[^}]*border: 2px solid/);
  assert.match(briefing, /\.gx-caption-place \{[^}]*padding: 6px 10px;[^}]*line-height: 1\.55;/);
  assert.match(briefing, /\.gx-caption-place b \{\s*font-size: 0\.8125rem;/);
  assert.match(briefing, /\.gx-caption-place span \{[^}]*font-size: 0\.75rem;/);
  assert.match(briefing, /\.gx-panel \{[^}]*border: 3px solid/);
});

test("the intro's board button glints twice and then rests (D-15)", () => {
  const intro = sheet("base-intro-ranking");
  const pill = intro.match(/\.intro \.top-actions \.intro-board-button \{[^}]*\}/)?.[0] ?? "";
  const sweep = intro.match(/\.intro \.top-actions \.intro-board-button::after \{[^}]*\}/)?.[0] ?? "";
  assert.match(pill, /animation: board-glow [^;]* 2;/);
  assert.match(sweep, /animation: board-shine [^;]* 2;/);
  assert.doesNotMatch(pill + sweep, /infinite/);
});
