import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import briefingCopy from "../../src/copy/briefing.js";
import enBriefing from "../../src/locales/en/screens/briefing.js";
import jaBriefing from "../../src/locales/ja/screens/briefing.js";
import { CASE_SEQUENCE, caseAftermathNodeId, nodes } from "../../src/gameData.js";
import { getOutcomeCarryover } from "../../src/gameLogic.js";
import { getPlateMotif, PLATE_MOTIFS } from "../../src/scenePlate.js";
import {
  getCaptionZone,
  getFigureBox,
  getOutcomeTone,
  getPlayerFigure,
  getSoundKind,
  getSoundSize,
  placePlateSound,
  PLATE_HEIGHT,
  PLATE_WIDTH,
  SOUND_EM,
  SOUND_KINDS,
} from "../../src/plateStory.js";

/**
 * The plate as a story (2026-11-02, D/E/F): the briefing's sound lettered
 * beside what makes it, the player's own figure marked, and a case's result
 * printing its last room in the light the case closed on.
 */
const source = (path) => readFileSync(new globalThis.URL(`../../src/${path}`, import.meta.url), "utf8");

// Every word the briefing can print, in every language, with its kind.
const SOUNDS = [briefingCopy, enBriefing, jaBriefing].flatMap((copy) => [
  ...copy.sfxCalm.map((label, index) => ({ label, kind: getSoundKind(index, false) })),
  ...copy.sfxBroken.map((label, index) => ({ label, kind: getSoundKind(index, true) })),
]);

// The push-in the word has to stay clear of, as plateStory.js measures it.
function staged([x0, y0, x1, y1]) {
  const frames = [
    [1, 0, 0],
    [1.02, 0, 0],
    [1.09, -5, -2],
  ];
  const xs = frames.flatMap(([s, tx]) => [160 + s * (x0 - 2 - 160 + tx), 160 + s * (x1 + 2 - 160 + tx)]);
  const ys = frames.flatMap(([s, , ty]) => [66 + s * (y0 - 2 - 66 + ty), 66 + s * (y1 + 2 - 66 + ty)]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function wordBox(spot, label) {
  const { width, height } = getSoundSize(label, spot.em);
  return [spot.x - width / 2, spot.y - height / 2, spot.x + width / 2, spot.y + height / 2];
}

const overlaps = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

/** Holds the three promises the rule makes: inside the frame, off every figure, off the caption. */
function assertClear(spot, { label, figures, place, clock }, where) {
  const box = wordBox(spot, label);
  assert.ok(box[0] >= 3.9 && box[1] >= 3.9, `${where}: "${label}" starts inside the frame (${box.map(Math.round)})`);
  assert.ok(box[2] <= PLATE_WIDTH - 11.9 && box[3] <= PLATE_HEIGHT - 3.9, `${where}: "${label}" ends inside the frame (${box.map(Math.round)})`);
  for (const figure of figures) {
    assert.ok(!overlaps(box, staged(figure.box)), `${where}: "${label}" covers a figure at ${figure.box}`);
  }
  const caption = getCaptionZone(place, clock);
  if (caption) assert.ok(!overlaps(box, caption), `${where}: "${label}" covers the caption`);
}

// Rooms as their painters lay them out, at the middle of each jitter: the
// lone desk, and the four that seat a crowd.
const person = (x, baseY, height, extra = {}) => ({ box: getFigureBox(x, baseY, height, extra), player: Boolean(extra.player) });
const ROOMS = {
  desk: { figures: [person(158, 104, 34, { seated: true, player: true })], lit: [158, 44] },
  auditorium: {
    figures: [
      person(176, 72, 20, { player: true }),
      ...[0, 1, 2, 3].flatMap((row) =>
        Array.from({ length: 7 + row }, (_, seat) => 10 + (300 / (7 + row)) * seat + 300 / (7 + row) / 2)
          .filter((x) => Math.abs(x - 160) >= 12)
          .map((x) => person(Math.round(x), 98 + row * 12, 11 + row * 2.6, { seated: true })),
      ),
    ],
    lit: [160, 58],
  },
  callcenter: {
    figures: [0, 1, 2].flatMap((row) =>
      Array.from({ length: 6 }, (_, seat) =>
        person(26 + seat * 52 + (row % 2) * 14, 76 + row * 16, Math.round(14 * (1 + row * 0.12) * 10) / 10, { seated: true, player: row === 2 && seat === 2 }),
      ),
    ),
    lit: [160, 31],
  },
  courtroom: {
    figures: [
      person(160, 30, 16, { seated: true }),
      person(58, 72, 18, { seated: true }),
      person(262, 72, 18, { seated: true }),
      person(160, 84, 22, { player: true }),
      ...[0, 1].flatMap((row) => Array.from({ length: 6 }, (_, seat) => person(28 + seat * 52 + row * 10, 124 + row * 6, 14 + row * 2, { seated: true }))),
    ],
    lit: [160, 34],
  },
  hall: {
    figures: [person(35.5, 101, 22.5, { seated: true, player: true }), person(284.5, 101, 22.5, { seated: true }), person(68.5, 83, 16.5, { seated: true }), person(251.5, 83, 16.5, { seated: true })],
    lit: [160, 30],
  },
};

test("every language's sounds line up with the kinds that place them", () => {
  for (const copy of [briefingCopy, enBriefing, jaBriefing]) {
    assert.equal(copy.sfxCalm.length, SOUND_KINDS.calm.length);
    assert.equal(copy.sfxBroken.length, SOUND_KINDS.broken.length);
  }
  assert.equal(getSoundKind(1), "thump", "두근 is a heartbeat");
  assert.equal(getSoundKind(3), "tap", "툭 is a tap");
  assert.equal(getSoundKind(2), "buzz", "지이잉 is a phone's buzz");
  assert.equal(getSoundKind(0, true), "bang");
  assert.equal(getSoundKind(7), getSoundKind(1), "an index past the pool wraps");
  // The briefing asks by the same index it drew the word with.
  const briefing = source("gauntlet/SceneBriefing.jsx");
  assert.match(briefing, /const index = hashSeed\(`sfx:\$\{nodeId\}`\) % pool\.length;\s*return \{ label: pool\[index\], kind: getSoundKind\(index, broken\) \};/);
  assert.match(briefing, /<ScenePlate node=\{node\} nodeId=\{nodeId\} sound=\{sfx\.label\} soundKind=\{sfx\.kind\} \/>/);
  assert.doesNotMatch(briefing, /<strong className="gx-sfx"/, "the word is lettered by the plate now, not pinned to a corner");
});

test("a sound is lettered beside what makes it", () => {
  const desk = ROOMS.desk;
  const player = getPlayerFigure(desk.figures).box;
  const at = (kind, label) => placePlateSound({ kind, label, motif: "desk", ...desk });
  // 두근: beside the player, at the player's height.
  const thump = at("thump", "두근");
  const thumpBox = wordBox(thump, "두근");
  assert.ok(thumpBox[0] >= player[2] || thumpBox[2] <= player[0] || thumpBox[3] <= player[1], "the heartbeat is beside or over the player");
  assert.ok(Math.abs(thump.x - (player[0] + player[2]) / 2) < 70, `the heartbeat is near the player (x ${thump.x})`);
  // 툭: at the desk's papers, not in the corner.
  const tap = at("tap", "툭");
  assert.ok(Math.hypot(tap.x - 50, tap.y - 92) < 50, `the tap is at the papers (${tap.x}, ${tap.y})`);
  // 지이잉: at the lit screen.
  const buzz = at("buzz", "지이잉");
  assert.ok(Math.hypot(buzz.x - 158, buzz.y - 44) < 100, `the buzz is at the screen (${buzz.x}, ${buzz.y})`);
  // Three kinds, three different places.
  assert.equal(new Set([thump, tap, buzz].map(({ x, y }) => `${x},${y}`)).size, 3);
  for (const [spot, label] of [[thump, "두근"], [tap, "툭"], [buzz, "지이잉"]]) assertClear(spot, { label, ...desk }, "desk");
  // The player's figure is the one the painter marked, and the first when none is.
  assert.equal(getPlayerFigure([{ box: [0, 0, 1, 1] }, { box: [2, 2, 3, 3], player: true }]).box[0], 2);
  assert.equal(getPlayerFigure([{ box: [0, 0, 1, 1] }]).box[0], 0);
  assert.equal(getPlayerFigure([]), null);
});

test("the same room always letters its sound in the same place", () => {
  for (const [motif, room] of Object.entries(ROOMS)) {
    for (const { kind, label } of SOUNDS) {
      const first = placePlateSound({ kind, label, motif, ...room, place: "트리거랩 4층 분석실", clock: "D-3 · 오후 2:00" });
      assert.deepEqual(placePlateSound({ kind, label, motif, ...room, place: "트리거랩 4층 분석실", clock: "D-3 · 오후 2:00" }), first, `${motif} ${label}`);
    }
  }
});

test("over every scene's own caption the word stays in the frame and off every figure, crowds included", () => {
  // Each motif's scenes, with the caption each one really prints.
  const captions = new Map();
  for (const node of Object.values(nodes)) {
    if (!node?.place && !node?.clock) continue;
    const motif = getPlateMotif(String(node.place ?? ""));
    if (!captions.has(motif)) captions.set(motif, []);
    captions.get(motif).push([node.place ?? "", node.clock ?? ""]);
  }
  let placed = 0;
  let checked = 0;
  for (const [motif, room] of Object.entries(ROOMS)) {
    // The longest captions are the hard ones; every room meets the season's five longest.
    const longest = [...captions.values()].flat().sort((a, b) => b.join("").length - a.join("").length).slice(0, 5);
    for (const [place, clock] of [...(captions.get(motif) ?? []), ...longest, ["", ""]]) {
      for (const { kind, label } of SOUNDS) {
        const spot = placePlateSound({ kind, label, motif, ...room, place, clock });
        checked += 1;
        if (!spot) continue;
        placed += 1;
        assertClear(spot, { label, figures: room.figures, place, clock }, `${motif} under "${place}"`);
      }
    }
  }
  // A crowded room may give up on a long word under a long caption, never often.
  assert.ok(placed / checked > 0.97, `${placed} of ${checked} placed`);
});

test("the rule's own edges: a room with no clear spot prints no word, a crowd shrinks it", () => {
  const wall = [{ box: [0, 0, PLATE_WIDTH, PLATE_HEIGHT], player: true }];
  assert.equal(placePlateSound({ kind: "thump", label: "두근", figures: wall }), null, "never over a head");
  assert.equal(placePlateSound({ kind: "thump", label: "" }), null, "no word, no spot");
  // Leave one narrow gap: only a smaller word fits it.
  const gap = [
    { box: [0, 0, PLATE_WIDTH, 50] },
    { box: [0, 84, PLATE_WIDTH, PLATE_HEIGHT] },
  ];
  const squeezed = placePlateSound({ kind: "tap", label: "툭", motif: "desk", figures: gap });
  assert.ok(squeezed && squeezed.em < SOUND_EM, `the word shrinks to fit (${JSON.stringify(squeezed)})`);
  assertClear(squeezed, { label: "툭", figures: gap }, "gap");
  // An empty room with no player still letters a heartbeat, from the room's surface.
  const empty = placePlateSound({ kind: "thump", label: "두근", motif: "ward" });
  assertClear(empty, { label: "두근", figures: [] }, "empty ward");
  // A kind nobody named lands on the surface; a motif nobody named, on the desk's.
  assert.ok(placePlateSound({ kind: "hum", label: "hum", motif: "nowhere" }));
  // The word grows with its letters, and a caption with its text.
  assert.ok(getSoundSize("SMASH!").width > getSoundSize("툭").width);
  assert.equal(getCaptionZone("", ""), null);
  assert.ok(getCaptionZone("트리거랩 기록 보관소 B2 · 이전 참가자 구역", "D-1")[3] > getCaptionZone("로비", "D-1")[3], "a long place wraps to a taller caption");
});

test("every room marks one figure as the player, drawn in the hand's colour inside an outline", () => {
  const dir = new globalThis.URL("../../src/components/plate/motifs/", import.meta.url);
  const painters = readdirSync(dir).filter((name) => name.endsWith(".jsx") && name !== "index.jsx");
  assert.equal(painters.length, PLATE_MOTIFS.length);
  for (const name of painters) {
    const text = readFileSync(new globalThis.URL(name, dir), "utf8");
    assert.equal(text.match(/\{ player(?::[^}]*)? \}/g)?.length, 1, `${name} names exactly one player figure`);
  }
  const primitives = source("components/plate/primitives.jsx");
  assert.match(primitives, /export function figure\(key, x, baseY, height, \{ player = false \} = \{\}\)/);
  assert.match(primitives, /export function seated\(key, x, baseY, height, \{ player = false \} = \{\}\)/);
  assert.equal(primitives.match(/<g key=\{key\} className=\{playerClass\(player\)\}>/g)?.length, 2);
  // Both figures are measured from the same marks they draw.
  assert.match(primitives, /record\(getFigureBox\(x, baseY, height\), player\);/);
  assert.match(primitives, /record\(getFigureBox\(x, baseY, height, \{ seated: true \}\), player\);/);
  const plate = source("styles/app/plate.css");
  assert.match(plate, /--plate-player: var\(--c-gx-hand\);\s*--plate-player-edge: var\(--ui-text\);/);
  // A shape cue as well as a colour: a stroke drawn under the fill.
  assert.match(plate, /\.gx-plate-player \{\s*fill: var\(--plate-player\);\s*stroke: var\(--plate-player-edge\);\s*stroke-width: 1\.8;[^}]*paint-order: stroke;/);
  // Heads are not narrower than the box says.
  const [x0, y0, x1, y1] = getFigureBox(100, 100, 40);
  assert.deepEqual([x0 < 100 - 40 * 0.17, y0, x1 > 100 + 40 * 0.17, y1], [true, 60, true, 100]);
  assert.deepEqual(getFigureBox(100, 100, 10, { seated: true }), [95.7, 90, 104.3, 100]);
});

test("a case's result picks its plate's light from what the ending carried", () => {
  // 사건 01's three endings: people first carries more than it costs, the
  // numbers cost about what they give, silence costs more than it buys.
  assert.equal(getOutcomeTone(getOutcomeCarryover({ caseId: "case01", choiceId: "c1_after_people" })), "good");
  assert.equal(getOutcomeTone(getOutcomeCarryover({ caseId: "case01", choiceId: "c1_after_numbers" })), "mixed");
  assert.equal(getOutcomeTone(getOutcomeCarryover({ caseId: "case01", choiceId: "c1_after_silence" })), "bad");
  // A falling 피로 is a gain, a rising one a cost (isResourceGain).
  assert.equal(getOutcomeTone({ fatigue: -6 }), "good");
  assert.equal(getOutcomeTone({ fatigue: 6 }), "bad");
  assert.equal(getOutcomeTone({}), "mixed", "an ending with nothing recorded");
  assert.equal(getOutcomeTone(undefined), "mixed");
  assert.equal(getOutcomeTone({ trust: 0, note: "x" }), "mixed", "zeros and non-numbers weigh nothing");
  assert.equal(getOutcomeTone({ trust: 9 }, { failure: true }), "bad", "a collapsed season closes dark");
  // Over the season every ending reads as one of the three, and all three occur.
  const tones = new Set();
  for (const caseId of CASE_SEQUENCE) {
    for (const choice of nodes[caseAftermathNodeId(caseId)]?.choices ?? []) {
      const tone = getOutcomeTone(getOutcomeCarryover({ caseId, choiceId: choice.id }));
      assert.ok(["good", "mixed", "bad"].includes(tone));
      tones.add(tone);
    }
  }
  assert.deepEqual([...tones].sort(), ["bad", "good", "mixed"]);
  // The result screen prints the case's last scene, re-toned, decorative like every plate.
  const screen = source("screens/ResultScreen.jsx");
  assert.match(screen, /<ScenePlate node=\{caseOutcome\.scene\.node\} nodeId=\{caseOutcome\.scene\.nodeId\} variant="result" outcome=\{caseOutcome\.scene\.tone\} \/>/);
  const report = source("state/useResultReport.js");
  assert.match(report, /const sceneNodeId = outcomeEntry \? outcomeNodeId : /);
  const drawing = source("components/ScenePlate.jsx");
  assert.match(drawing, /outcome \? `gx-plate-outcome-\$\{outcome\}` : ""/);
  assert.match(drawing, /aria-hidden="true"\s*focusable="false"/);
  assert.match(drawing, /<strong className="gx-sfx" aria-hidden="true"/);
  const plate = source("styles/app/plate.css");
  for (const tone of ["good", "mixed", "bad"]) assert.match(plate, new RegExp(`\\.gx-plate-outcome-${tone} \\{\\s*filter: `));
});
