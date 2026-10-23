import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { ALL_RULES, getTableRules, getUnlockIntro, isTableTaught, STAGED, STORY_RULES, UNLOCK_LADDER } from "../../src/gauntlet/tableUnlocks.js";

/**
 * The short decision reveal: when it is shown, and that the choice to open the
 * whole sheet is kept nowhere but in the page.
 *
 * The rule is one function of the case and the run (`isTableTaught`). What the
 * short sheet draws is read from the component's source here and from a browser
 * in tests/gauntlet-loop.spec.js.
 */

const source = (file) => readFileSync(new URL(`../../src/${file}`, import.meta.url), "utf8");
const LADDER = UNLOCK_LADDER.map((step) => step.caseId);

test("the table is taught from the first case the ladder does not name, and not before", () => {
  assert.deepEqual(LADDER, CASE_SEQUENCE.slice(0, LADDER.length), "the ladder is the head of the season");
  for (const caseId of CASE_SEQUENCE) {
    const onLadder = LADDER.includes(caseId);
    assert.equal(isTableTaught(caseId, {}, true), !onLadder, `${caseId}, a plain run`);
    assert.equal(isTableTaught(caseId, null, true), !onLadder, `${caseId}, no run at all`);
    // A story run is told less in a prologue, and the prologue is still a step.
    assert.equal(isTableTaught(caseId, { story: true }, true), !onLadder, `${caseId}, a story run`);
  }
  // The last step plays under every rule and is still introducing two of them.
  assert.deepEqual([...getTableRules("prologue05", {}, true)].sort(), [...ALL_RULES].sort());
  assert.equal(isTableTaught("prologue05", {}, true), false);
  assert.equal(isTableTaught("case01", {}, true), true);
});

test("a run begun with NEW GAME+ has been taught from its first table; only the mark itself counts", () => {
  for (const caseId of CASE_SEQUENCE) assert.equal(isTableTaught(caseId, { veteran: true }, true), true, caseId);
  for (const caseId of LADDER) {
    assert.equal(isTableTaught(caseId, { veteran: "yes", windowIndex: 400 }, true), false, "a run that is merely far along is not a veteran's");
    assert.equal(isTableTaught(caseId, { veteran: true, story: true }, true), true);
  }
});

test("with the switch off nothing is being introduced, and a case nobody named is not a step", () => {
  for (const caseId of CASE_SEQUENCE) assert.equal(isTableTaught(caseId, {}, false), true, caseId);
  for (const caseId of ["no-such-case", undefined, null]) assert.equal(isTableTaught(caseId, {}, true), true, `${caseId}`);
  assert.equal(isTableTaught("prologue01", {}), !STAGED, "asked without a flag it answers for the shipped switch");
});

test("where the table is taught, the case plays under everything and has nothing to say about new rules", () => {
  for (const caseId of CASE_SEQUENCE) {
    for (const run of [{}, { veteran: true }, { story: true }, { veteran: true, story: true }]) {
      if (!isTableTaught(caseId, run, true)) {
        assert.ok(LADDER.includes(caseId) && run.veteran !== true);
        continue;
      }
      assert.equal(getTableRules(caseId, run, true), run.story ? STORY_RULES : ALL_RULES, `${caseId} ${JSON.stringify(run)}`);
      assert.deepEqual(getUnlockIntro(caseId, run, true), []);
    }
  }
});

test("the rule is pure: the same answer every time, and nothing it is handed is changed", () => {
  const run = Object.freeze({ veteran: false, story: false });
  const first = CASE_SEQUENCE.map((caseId) => isTableTaught(caseId, run, true));
  assert.deepEqual(CASE_SEQUENCE.map((caseId) => isTableTaught(caseId, run, true)), first);
  assert.ok(first.every((answer) => typeof answer === "boolean"));
});

test("the commit decides it, the reveal is told, and neither the save nor a setting keeps the choice", () => {
  const commit = source("state/useChoiceCommit.js");
  assert.match(commit, /short: isTableTaught\(currentCase, gauntletRun\),/, "from the case and the run the decision was made under");

  // The reveal is never saved, so `short` is not in a save either.
  const runState = source("state/runState.js");
  assert.match(runState, /decisionReveal: \{\s+save: null,\s+load: \(\) => null,/);

  const reveal = source("components/DecisionReveal.jsx");
  assert.match(reveal, /^let detailsOpen = false;\r?$/m, "the visit's, in the module");
  assert.doesNotMatch(reveal, /localStorage|sessionStorage|accessibilitySettings|getAccessibility/, "no storage and no setting");
  assert.match(reveal, /const full = !decisionReveal\.short \|\| detailsOpen;/);
});

test("자세히 is a button that says whether it is open, on the short sheet only, and the focus trap can reach it", () => {
  const reveal = source("components/DecisionReveal.jsx");
  assert.match(
    reveal,
    /\{decisionReveal\.short && \(\s+<button type="button" className="gx-reveal-more" data-testid="reveal-details" aria-expanded=\{detailsOpen\} onClick=\{toggleDetails\}>\s+자세히\s+<\/button>\s+\)\}/,
  );
  // Under the verdict and above everything it opens: what grows, grows below the button.
  assert.ok(reveal.indexOf('data-testid="reveal-details"') > reveal.indexOf("<p>{subline}</p>"));
  assert.ok(reveal.indexOf('data-testid="reveal-details"') < reveal.indexOf('data-testid="consequence-ledger"'));
  // Focus still opens on the way out, which is still the last control.
  assert.match(reveal, /if \(decisionReveal\) nextRef\.current\?\.focus\(\{ preventScroll: true \}\);/);
  assert.ok(reveal.indexOf('data-testid="decision-next"') > reveal.indexOf('data-testid="reveal-details"'));
  // The trap lists what it cycles through by selector; a `button` is on the list.
  assert.match(source("GameRuntime.jsx"), /decisionRevealRef\.current\?\.querySelectorAll\("button, /);
});

test("the short sheet leaves out the ledger, the pot's sum, the words of the choice and the sentence made from the effect, and nothing else", () => {
  const reveal = source("components/DecisionReveal.jsx");
  assert.match(reveal, /const consequenceLines = full \? createConsequenceLines\(\{ verdict, busted, nextMutations \}\) : \[\];/);
  assert.match(reveal, /\{full && verdict && \(\s+<div className="gx-reveal-pot"/);
  // A card the room played for the player is said on the short sheet too.
  assert.match(reveal, /\{\(full \|\| decisionReveal\.forced\) && \(\s+<p className="decision-reveal-choice">/);
  // The story line is on every sheet, straight under the verdict (D-1): the
  // card's own line, or the beat's last sentence for a bust, a forced card or a reframe.
  assert.match(reveal, /const storyLine = decisionReveal\.echo \|\| String\(decisionReveal\.beat \?\? ""\)\.split\("\\n"\)\.at\(-1\);/);
  assert.match(reveal, /\{storyLine && \(\s+<div className="decision-reveal-beat" data-testid="reveal-story">/);
  const story = reveal.indexOf('data-testid="reveal-story"');
  assert.ok(story > reveal.indexOf("<p>{subline}</p>") && story < reveal.indexOf('data-testid="reveal-details"'), "under the verdict, above 자세히");
  assert.ok(story < reveal.indexOf('<div className="decision-reveal-stakes"'), "above the bill");
  // Everything else is drawn on what it was always drawn on.
  for (const kept of [
    '{decisionReveal.unlockedRelics?.length > 0 && (',
    '{verdict?.relicOffer?.length > 0 && (',
    '{overclockMutation && !busted && (',
    '<div className="decision-reveal-stakes" role="group"',
    '{decisionReveal.skippedTitle && (',
    '{nextMutations.length > 0 && (',
    '{decisionReveal.clue && (',
  ]) {
    assert.ok(reveal.includes(`        ${kept}`), `drawn on what it was always drawn on: ${kept}`);
  }
});
