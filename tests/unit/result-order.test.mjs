import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (path) => readFileSync(new globalThis.URL(`../../src/${path}`, import.meta.url), "utf8");

// A case's report (improvement notes D-10, 2026-10-22): the story first --
// the ending, the interlude, the next case -- then who the player was and the
// rank, then the score. It opened on the profile and the rank.
test("a case's report reads ending, interlude, next case, profile and rank, score", () => {
  const screen = source("screens/ResultScreen.jsx");
  const at = (mark) => {
    const index = screen.indexOf(mark);
    assert.ok(index > 0, `${mark} is on the report`);
    return index;
  };
  const order = [
    'aria-label={resultCopy.outcomeLabel}',
    'className={`interlude-panel',
    'className="next-case-panel"',
    'className={`result-hero',
    'className={`rank-panel',
  ].map(at);
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  // The arrival's focus is the ending's title, the first thing on the page now.
  assert.match(screen, /<h2 ref=\{titleRef\} tabIndex=\{-1\}>\{caseOutcome\.title\}<\/h2>/);
  assert.doesNotMatch(screen, /<h1 ref=\{titleRef\}/);
});

test("열지 않은 문 counts this case's doors on a case's report, the season's on the finale's", () => {
  const readout = source("state/useRunReadout.js");
  assert.match(readout, /const caseScoped = currentCase !== "final";/);
  assert.match(readout, /getCaseBranchNodes\(\)\.filter\(\(branch\) => !caseScoped \|\| branch\.caseId === currentCase\)/);
  assert.match(readout, /unopenedRecordCount: \(caseScoped \? caseClueShut : unopenedClueCount\) \+ logReadout\.unopenedBranchCount/);
  // The line under the count says the same two numbers the count is made of.
  assert.match(source("screens/ResultScreen.jsx"), /fill\(resultCopy\.why\.doorsLeft, \{ clues: unopenedRecordCount - unopenedBranchCount, branches: unopenedBranchCount \}\)/);
  assert.match(source("copy/result.js"), /doorsLeft: "단서 \{clues\}개와 분기 \{branches\}개가 아직 기록에 없습니다\."/);
});
