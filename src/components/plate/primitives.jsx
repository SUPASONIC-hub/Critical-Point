import { getFigureBox } from "../../plateStory.js";

/**
 * What every room is drawn from: the depth planes, the people, the halo and the
 * one lit mark. Every motif under `motifs/` builds from these, which is what
 * makes thirty-one rooms read as one hand (see `ScenePlate.jsx`).
 */

/**
 * The room's cast, as the painter places it. `collectCast` runs one painter
 * and hands back, beside what it drew, every figure's box and the centre of
 * the last halo -- the one lit thing the room is for. The briefing letters its
 * sound from these (`placePlateSound`, src/plateStory.js), so a word is placed
 * against where the people actually stand rather than against a copy of each
 * painter's jitter. A render is synchronous, so one list at a time is enough.
 */
let cast = null;

export function collectCast(paint) {
  const collected = { figures: [], lit: null };
  cast = collected;
  try {
    return [paint(), collected];
  } finally {
    cast = null;
  }
}

function record(box, player) {
  if (cast) cast.figures.push({ box, player });
}
export function round(value) {
  return Math.round(value * 10) / 10;
}

/** Jitter helper: a value in [min, max) from the scene's own generator. */
export function span(random, min, max) {
  return min + random() * (max - min);
}

/** The far plane drifts a few pixels over half a minute against the rest. */
export function far(children) {
  return (
    <g className="gx-plate-far" stroke="var(--plate-far)" fill="none" strokeWidth="1">
      {children}
    </g>
  );
}

export function mid(children) {
  return <g stroke="var(--plate-mid)" fill="none" strokeWidth="1.4">{children}</g>;
}

/** The near plane sways a pixel or two against the far one, so the room has depth. */
export function near(children) {
  return (
    <g className="gx-plate-near" stroke="var(--plate-near)" fill="var(--plate-solid)" strokeWidth="1.6">
      {children}
    </g>
  );
}

/** The ambient light of the building, used for anything lit but not important. */
export function lit(children) {
  return <g fill="var(--plate-ambient)" stroke="none" opacity="0.42">{children}</g>;
}

/** The people in the room, as silhouettes on the near plane. */
export function people(children) {
  return <g fill="var(--plate-figure)" stroke="var(--plate-near)" strokeWidth="1.1">{children}</g>;
}

/**
 * The player's own figure is the one person in the room drawn in the colour of
 * the player's hand, with a heavier outline round it (`.gx-plate-player`,
 * plate.css), so it reads as "you" by its shape as well as its colour. Every
 * painter names exactly one; everyone else is a silhouette as before.
 */
function playerClass(player) {
  return player ? "gx-plate-player" : undefined;
}

/**
 * One standing person. Head, shoulders, a body that tapers -- at 30px tall that
 * is every mark needed for the eye to read "someone is in this room", and the
 * room stops being an architectural drawing.
 */
export function figure(key, x, baseY, height, { player = false } = {}) {
  const head = Math.max(2.4, height * 0.17);
  const shoulder = head * 1.85;
  const waist = head * 1.4;
  const neckY = baseY - height + head * 2;
  record(getFigureBox(x, baseY, height), player);
  return (
    <g key={key} className={playerClass(player)}>
      <circle cx={x} cy={baseY - height + head} r={head} />
      <path
        d={`M${x - waist} ${baseY} L${x - shoulder} ${neckY + head * 0.6} Q${x} ${neckY - head * 0.4} ${x + shoulder} ${neckY + head * 0.6} L${x + waist} ${baseY} Z`}
      />
    </g>
  );
}

/** One person seated at a surface: the same marks, folded at the waist. */
export function seated(key, x, baseY, height, { player = false } = {}) {
  const head = Math.max(2.4, height * 0.2);
  const shoulder = head * 1.8;
  const neckY = baseY - height + head * 2;
  record(getFigureBox(x, baseY, height, { seated: true }), player);
  return (
    <g key={key} className={playerClass(player)}>
      <circle cx={x} cy={baseY - height + head} r={head} />
      <path d={`M${x - shoulder} ${baseY} L${x - shoulder * 0.86} ${neckY} Q${x} ${neckY - head * 0.5} ${x + shoulder * 0.86} ${neckY} L${x + shoulder} ${baseY} Z`} />
    </g>
  );
}

/** A soft halo behind whatever the accent is, so the eye lands there first. */
export function halo(cx, cy, r, paint) {
  if (cast) cast.lit = [cx, cy];
  return <circle className="gx-plate-halo" cx={cx} cy={cy} r={r} fill={paint} />;
}

/** The one lit thing the room is for. Its light is live, so it flickers. */
export function mark(children) {
  return <g className="gx-plate-accent">{children}</g>;
}
