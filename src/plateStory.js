import { isResourceGain } from "./gameConstants.js";

/**
 * What a plate says about the story: where its sound comes from, and how the
 * case's last room looks once the case has closed.
 *
 * The briefing's sound effect (툭, 두근 ...) sat in the bottom-right corner of
 * every splash panel, so a heartbeat landed on the floor and a phone's buzz on
 * the far wall from the phone. Playtesters liked the word and not the corner
 * (2026-11-02, D). A sound is drawn beside the thing that makes it now: a
 * heartbeat beside the player, a tap at the desk, a buzz at the lit screen.
 *
 * Everything here is a pure function of the plate's own cast -- the figures
 * `ScenePlate.jsx` collected while it drew the room -- so the same scene puts
 * its sound in the same place on every reload, and nothing here imports a
 * drawing.
 */

/** The plate's viewBox, which every coordinate below is in. */
export const PLATE_WIDTH = 320;
export const PLATE_HEIGHT = 132;

/**
 * What each word in the briefing's two sound pools is the sound of, by
 * position: `sfxCalm` and `sfxBroken` in every language list the same six and
 * three sounds in this order (src/copy/briefing.js), so 두근, thump and ドクン
 * are all a heartbeat.
 */
export const SOUND_KINDS = {
  calm: ["tick", "thump", "buzz", "tap", "swish", "click"],
  broken: ["bang", "crack", "smash"],
};

/**
 * Where a sound comes from. A heartbeat is the player's; a tick and a crack are
 * the room's wall; a buzz, a click and a smash are the room's one lit thing,
 * the device the halo is drawn behind; a tap, a swish and a bang land on the
 * surface where paper and fists do.
 */
const SOUND_SOURCES = {
  tick: "wall",
  thump: "player",
  buzz: "device",
  tap: "surface",
  swish: "surface",
  click: "device",
  bang: "surface",
  crack: "wall",
  smash: "device",
};

/** The kind of the sound a briefing drew from its pool at `index`. */
export function getSoundKind(index, broken = false) {
  const pool = SOUND_KINDS[broken ? "broken" : "calm"];
  return pool[Math.abs(index) % pool.length];
}

/**
 * The surface in each room where things are put down: the desk's papers, the
 * café table, the bed, the counter top. Read off the painters under
 * `components/plate/motifs/`; where a painter jitters the surface, this is the
 * middle of its range, which is near enough for a word to read as from it.
 */
const SURFACES = {
  airport: [213, 96],
  archive: [40, 56],
  auditorium: [152, 66],
  bookshop: [225, 104],
  cafe: [187, 92],
  callcenter: [160, 106],
  chamber: [180, 104],
  coast: [104, 100],
  construction: [278, 100],
  control: [160, 116],
  corridor: [160, 66],
  counter: [160, 82],
  courtroom: [160, 74],
  desk: [50, 92],
  factory: [164, 92],
  floor: [44, 118],
  gallery: [160, 114],
  hall: [160, 96],
  lobby: [230, 86],
  market: [160, 90],
  memorial: [116, 90],
  newsroom: [196, 86],
  orchard: [44, 100],
  school: [160, 104],
  server: [60, 70],
  skyline: [160, 110],
  street: [160, 100],
  studio: [166, 112],
  trading: [120, 86],
  transit: [160, 70],
  ward: [100, 100],
};

/**
 * The wall a clock hangs on. The desk has its clock drawn (the far circle at
 * the top right), and the hearing room and the courtroom their emblem; every
 * other room ticks from high on its back wall.
 */
const WALLS = { desk: [298, 22], chamber: [160, 18], courtroom: [160, 14] };
const WALL = [250, 20];

/**
 * The briefing page pushes the room in slowly (`gx-plate-push`, plate.css):
 * from scale 1.02 to 1.09 and 5 left, 2 up, about the middle of the frame. The
 * word is not on the stage, so a figure walks under it over thirty seconds
 * unless its box is measured at both ends of the move -- and at rest, which is
 * what a reader who asked for less motion sees.
 */
const STAGE_FRAMES = [
  [1, 0, 0],
  [1.02, 0, 0],
  [1.09, -5, -2],
];
const STAGE_ORIGIN = [160, 66];

/** Air kept between a figure and the word, and between the word and its source. */
const FIGURE_PAD = 2;
const GAP = 4;

/**
 * The frame the word stays inside. The right edge keeps 12: the splash panel
 * is clipped to a slant that takes 3% off its bottom-right corner (briefing.css).
 */
const EDGE = { left: 4, top: 4, right: 12, bottom: 4 };

/**
 * The word's size in viewBox units. briefing.css sizes it off the panel's
 * width, so it is the same share of the picture at every panel size -- 34px on
 * the narrowest panel that shows it, 60px on the widest -- and a spot that is
 * clear here is clear at every size. Two smaller sizes are tried before a
 * crowded room gives up on the word.
 */
export const SOUND_EM = 30;
const SOUND_SIZES = [SOUND_EM, 25, 21];

/** The word is printed turned 9 degrees (`.gx-sfx`). */
const TILT = (9 * Math.PI) / 180;

/**
 * Where to try the word, in order, around its source: beside it, then above
 * to either side, then over it, then below. A comic letters a sound beside
 * what made it before it letters one on top.
 */
const AROUND = [
  [1, 0],
  [-1, 0],
  [1, -1],
  [-1, -1],
  [0, -1],
  [1, 1],
  [-1, 1],
  [0, 1],
];

/** The narrowest splash panel that shows the word: a 701px window (briefing.css hides it at 700). */
const NARROWEST_PANEL_PX = 368;

function round(value) {
  return Math.round(value * 10) / 10;
}

/**
 * How many ems a line of text runs, without a font to ask: a Hangul, kana or
 * full-width glyph is an em, a capital about three quarters, a small letter a
 * little over half. Generous on purpose -- an estimate that runs long only
 * keeps the word further from a face.
 */
export function measureEms(text = "", { tight = false } = {}) {
  let ems = 0;
  for (const glyph of String(text)) {
    const code = glyph.codePointAt(0);
    if (code >= 0x1100) ems += 1;
    else if (glyph === " ") ems += 0.3;
    else if (/[!.,:'·]/.test(glyph)) ems += 0.36;
    else if (/[A-Z0-9]/.test(glyph)) ems += 0.74;
    else ems += 0.6;
  }
  // `.gx-sfx` is set at -0.04em.
  return tight ? Math.max(0, ems - 0.04 * [...String(text)].length) : ems;
}

/** The box the turned word covers, at `em` units to the em. */
export function getSoundSize(label, em = SOUND_EM) {
  // The shadow is 3px down and right of a 2px outline, about a tenth of an em.
  const width = (measureEms(label, { tight: true }) + 0.24) * em;
  const height = 1.16 * em;
  return {
    width: round(width * Math.cos(TILT) + height * Math.sin(TILT)),
    height: round(width * Math.sin(TILT) + height * Math.cos(TILT)),
  };
}

/**
 * The place-and-clock caption pinned to the panel's top-left corner, in
 * viewBox units. It is HTML at a fixed pixel size, so it covers the most of
 * the picture on the narrowest panel; measured there, the zone is clear of it
 * on every panel. Its width is the longer of its two lines, capped at the 72%
 * briefing.css allows, and a capped line wraps.
 */
export function getCaptionZone(place = "", clock = "") {
  const lines = [
    [String(place ?? ""), 13],
    [String(clock ?? ""), 12],
  ].filter(([text]) => text);
  if (!lines.length) return null;
  const toUnits = PLATE_WIDTH / NARROWEST_PANEL_PX;
  // 10px from the corner, 10px padding each side and a 2px border.
  const room = NARROWEST_PANEL_PX * 0.72 - 24;
  let width = 0;
  let height = 16;
  for (const [text, size] of lines) {
    const run = measureEms(text) * size;
    width = Math.max(width, Math.min(run, room));
    height += Math.ceil(run / room) * size * 1.55;
  }
  return [0, 0, round((10 + 24 + width) * toUnits + GAP), round((10 + height) * toUnits + GAP)];
}

/** A figure's box as the slow push-in carries it, at rest and at both ends. */
function stagedBox([x0, y0, x1, y1]) {
  const [ox, oy] = STAGE_ORIGIN;
  const xs = [];
  const ys = [];
  for (const [scale, tx, ty] of STAGE_FRAMES) {
    xs.push(ox + scale * (x0 - FIGURE_PAD - ox + tx), ox + scale * (x1 + FIGURE_PAD - ox + tx));
    ys.push(oy + scale * (y0 - FIGURE_PAD - oy + ty), oy + scale * (y1 + FIGURE_PAD - oy + ty));
  }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function overlaps(a, b) {
  return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
}

/** The player's figure, or the first in the room when a painter names none. */
export function getPlayerFigure(figures = []) {
  return figures.find((figure) => figure.player) ?? figures[0] ?? null;
}

/** The box a sound of this kind comes from: a figure's, or a point's. */
function getSoundSource(kind, { motif, figures, lit }) {
  const from = SOUND_SOURCES[kind] ?? "surface";
  if (from === "player") {
    const player = getPlayerFigure(figures);
    if (player) return player.box;
  }
  const [x, y] = (from === "device" && lit) || (from === "wall" && (WALLS[motif] ?? WALL)) || SURFACES[motif] || SURFACES.desk;
  return [x, y, x, y];
}

/** The centre one step off the source box in direction (dx, dy), pulled back inside the frame. */
function beside([x0, y0, x1, y1], [dx, dy], { width, height }) {
  const x = dx < 0 ? x0 - GAP - width / 2 : dx > 0 ? x1 + GAP + width / 2 : (x0 + x1) / 2;
  const y = dy < 0 ? y0 - GAP - height / 2 : dy > 0 ? y1 + GAP + height / 2 : (y0 + y1) / 2;
  return [
    round(Math.min(Math.max(x, EDGE.left + width / 2), PLATE_WIDTH - EDGE.right - width / 2)),
    round(Math.min(Math.max(y, EDGE.top + height / 2), PLATE_HEIGHT - EDGE.bottom - height / 2)),
  ];
}

/**
 * Where the briefing letters a scene's sound, in viewBox units: the word's
 * centre (`x`, `y`) and its size (`em`), or null when the room has no spot the
 * word fits in without covering someone.
 *
 * The rule: start at the thing that makes the sound (`SOUND_SOURCES`) and try
 * the eight spots around it in `AROUND`'s order; the first that sits inside
 * the frame and covers no figure and no part of the caption is the one. When
 * all eight are taken -- a crowd in the seats, a caption across the top -- the
 * clear spot nearest the source wins, scanning the frame in reading order so a
 * tie always breaks the same way; and when no spot is clear at all the word
 * is tried smaller, twice. A sound is decoration and a face is not, so a room
 * with no room for it prints no word rather than one over a head.
 */
export function placePlateSound({ kind, label, motif = "desk", figures = [], lit = null, place = "", clock = "" } = {}) {
  if (!label) return null;
  const source = getSoundSource(kind, { motif, figures, lit });
  const caption = getCaptionZone(place, clock);
  const blocked = figures.map((figure) => stagedBox(figure.box));
  if (caption) blocked.push(caption);
  const [sourceX, sourceY] = [(source[0] + source[2]) / 2, (source[1] + source[3]) / 2];
  for (const em of SOUND_SIZES) {
    const size = getSoundSize(label, em);
    const fits = ([x, y]) => {
      const box = [x - size.width / 2, y - size.height / 2, x + size.width / 2, y + size.height / 2];
      return (
        box[0] >= EDGE.left - 0.05
        && box[1] >= EDGE.top - 0.05
        && box[2] <= PLATE_WIDTH - EDGE.right + 0.05
        && box[3] <= PLATE_HEIGHT - EDGE.bottom + 0.05
        && !blocked.some((other) => overlaps(box, other))
      );
    };
    const near = AROUND.map((step) => beside(source, step, size)).find(fits);
    if (near) return { x: near[0], y: near[1], em };
    let best = null;
    for (let y = Math.ceil(EDGE.top + size.height / 2); y <= PLATE_HEIGHT - EDGE.bottom - size.height / 2; y += 2) {
      for (let x = Math.ceil(EDGE.left + size.width / 2); x <= PLATE_WIDTH - EDGE.right - size.width / 2; x += 2) {
        if (!fits([x, y])) continue;
        const distance = Math.hypot(x - sourceX, y - sourceY);
        if (!best || distance < best.distance) best = { x, y, distance };
      }
    }
    if (best) return { x: best.x, y: best.y, em };
  }
  return null;
}

/**
 * One drawn person's box, from the same marks `figure()` and `seated()` draw
 * in components/plate/primitives.jsx: a head at the top, shoulders as wide as
 * the figure gets, the base on the floor line.
 */
export function getFigureBox(x, baseY, height, { seated = false } = {}) {
  const head = Math.max(2.4, height * (seated ? 0.2 : 0.17));
  const shoulder = head * (seated ? 1.8 : 1.85);
  return [round(x - shoulder), round(baseY - height), round(x + shoulder), round(baseY)];
}

/**
 * The light a case's result prints its last room in.
 *
 * The ending the case closed on carries what it moves into the next case
 * (`carryovers` in src/nodes/caseNN.js). Weighed the way every other surface
 * weighs an effect -- `isResourceGain`, so a falling 피로 counts as a gain --
 * an ending whose gains are at least twice its costs is `good`, one whose
 * costs are at least twice its gains is `bad`, and the rest are `mixed`, which
 * is also what an ending with nothing recorded reads as. A season that
 * collapsed closes `bad` whatever its last case carried.
 */
export function getOutcomeTone(carryover = {}, { failure = false } = {}) {
  if (failure) return "bad";
  let gain = 0;
  let cost = 0;
  for (const [key, value] of Object.entries(carryover ?? {})) {
    if (typeof value !== "number" || value === 0) continue;
    if (isResourceGain(key, value)) gain += Math.abs(value);
    else cost += Math.abs(value);
  }
  if (gain > 0 && gain >= cost * 2) return "good";
  if (cost > 0 && cost >= gain * 2) return "bad";
  return "mixed";
}
