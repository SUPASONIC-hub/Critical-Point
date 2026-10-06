import { memo } from "react";
import { createPlateRandom, getScenePlate } from "../scenePlate.js";
import { SCREEN_MOTIFS, paintAir } from "./plate/air.jsx";
import { paintFx } from "./plate/fx.jsx";
import { MOTIF_PAINTERS } from "./plate/motifs/index.jsx";

/**
 * The scene's room, drawn.
 *
 * One 320x132 viewBox, four depth planes, three stroke weights. Every motif
 * builds from the same primitives so the set reads as one hand: a far plane at
 * low opacity, a mid plane carrying the structure, a near silhouette the player
 * stands behind, and exactly one accent mark -- the lit window, the pulled
 * drawer, the screen at the end of the table -- that says what the room is for.
 *
 * The first version of this drew empty architecture, and empty architecture is
 * wallpaper: a player could not tell the audit room from the archive at a
 * glance, which is the whole job. Three things fixed that. Rooms have people in
 * them now, placed where the scene's speaker would be standing; the light in
 * each building has its own colour, so 트리거랩 and 강서지점 do not read as the
 * same grey; and the accent carries a glow, so the one thing the room is for is
 * the one thing the eye lands on.
 *
 * Colour still comes from `--plate-*` in play.css, which reads the night-shift
 * tokens. Lime is never used: priority 30 reserves it for the control that
 * records a decision, and a drawing is not that.
 *
 * It is `aria-hidden`. The room and the deadline are already text in the
 * dateline directly above, so announcing them again from a picture is noise.
 */
function ScenePlateDrawing({ node, nodeId, variant = "panel" }) {
  const plate = getScenePlate(node, nodeId);
  const random = createPlateRandom(plate.seed);
  // The air gets its own generator, so adding motes never moves a window the
  // room already lit -- and it is still the scene's seed, so the rain on a
  // resumed scene falls where it fell before.
  const air = createPlateRandom((plate.seed ^ 0x9e3779b9) >>> 0);
  const draw = MOTIF_PAINTERS[plate.motif] ?? MOTIF_PAINTERS.desk;
  const accent = `var(--plate-accent-${plate.accent})`;
  // Both copies print on one page, so every paint server is named per copy.
  const id = `plate-${variant}-${plate.seed}`;
  const screens = SCREEN_MOTIFS.has(plate.motif);
  const heat = plate.accent === "heat";
  const className = [
    "gx-plate",
    `gx-plate-${variant}`,
    `gx-plate-${plate.motif}`,
    `gx-plate-tone-${plate.tone}`,
    `gx-plate-${plate.accent}`,
    plate.night ? "gx-plate-night" : "",
    plate.dusk ? "gx-plate-dusk" : "",
    plate.pressure ? "gx-plate-closing" : "",
    plate.snow ? "gx-plate-winter" : "",
    plate.mood !== "none" ? `gx-plate-mood-${plate.mood}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={className}
      // The briefing shows the whole drawing. The header is a short wide band,
      // so it crops -- but to the middle of the frame rather than the edges: the
      // top is ceiling and the bottom is the near silhouette, which on a dark
      // ground is a filled shape with nothing in it. What is left is the wall of
      // screens, the shelving, the monitor: the marks that name the room.
      viewBox={variant === "backdrop" ? "0 6 320 96" : "0 0 320 132"}
      preserveAspectRatio={variant === "backdrop" ? "xMidYMid slice" : "xMidYMid meet"}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        {screens && (
          <>
            <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--plate-ambient)" stopOpacity="0" />
              <stop offset="85%" stopColor="var(--plate-ambient)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--plate-ambient)" stopOpacity="0" />
            </linearGradient>
            <pattern id={`${id}-lines`} width="4" height="3" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="1" fill="var(--plate-ambient)" />
            </pattern>
          </>
        )}
        {plate.flash && (
          <radialGradient id={`${id}-flash`}>
            <stop offset="0%" stopColor="var(--c-paper)" stopOpacity="0.95" />
            <stop offset="35%" stopColor="var(--c-paper)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--c-paper)" stopOpacity="0" />
          </radialGradient>
        )}
        {plate.rays && (
          <linearGradient id={`${id}-ray`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--plate-ambient)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--plate-ambient)" stopOpacity="0" />
          </linearGradient>
        )}
        {/* Film grain: one static noise field over every plate, so the drawing
            reads as a printed frame rather than a vector diagram. */}
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={plate.seed % 97} stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
        </filter>
        {plate.spot && (
          <linearGradient id={`${id}-spot`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--c-paper)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--c-paper)" stopOpacity="0" />
          </linearGradient>
        )}
        {plate.bokeh && (
          <radialGradient id={`${id}-bokeh`}>
            <stop offset="0%" stopColor="var(--plate-ambient)" stopOpacity="0.55" />
            <stop offset="70%" stopColor="var(--plate-ambient)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--plate-ambient)" stopOpacity="0" />
          </radialGradient>
        )}
        {plate.mood !== "none" && (
          <linearGradient id={`${id}-grade`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--plate-grade)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="var(--plate-grade)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--plate-grade)" stopOpacity="0" />
          </linearGradient>
        )}
        {variant === "panel" && (
          <linearGradient id={`${id}-leak`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--plate-ambient)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--plate-ambient)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--plate-ambient)" stopOpacity="0" />
          </linearGradient>
        )}
        {plate.dusk && (
          /* The last of the day, coming in low from one side of the room. */
          <linearGradient id={`${id}-dusk`} x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0%" stopColor="var(--c-amber)" stopOpacity="0.34" />
            <stop offset="42%" stopColor="var(--c-coral)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--c-violet)" stopOpacity="0.1" />
          </linearGradient>
        )}
        {heat && (
          <radialGradient id={`${id}-vignette`} r="0.72">
            <stop offset="45%" stopColor={accent} stopOpacity="0" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.5" />
          </radialGradient>
        )}
      </defs>
      <rect x="0" y="0" width="320" height="132" fill="var(--plate-bg)" />
      {/* Everything that is the room moves as one, so the briefing copy can
          push in slowly without the ground showing at an edge. */}
      <g className="gx-plate-stage">
        {/* The 추석 moon hangs behind the room, so the buildings stand in front
            of it. Placed from the seed without drawing on either generator, so
            no existing plate moves. */}
        {plate.moon && (
          <g className="gx-plate-moon">
            <circle cx={40 + (plate.seed % 240)} cy="20" r="17" fill="var(--c-cream)" opacity="0.14" />
            <circle cx={40 + (plate.seed % 240)} cy="20" r="9" fill="var(--c-cream)" opacity="0.9" />
          </g>
        )}
        {draw(random, accent, `url(#${id}-halo)`)}
        {paintAir(air, plate)}
        {screens && (
          <>
            {/* A room lit by screens refreshes: faint raster lines, and one
                band of light rolling down them every few seconds. */}
            <rect x="0" y="0" width="320" height="132" fill={`url(#${id}-lines)`} opacity="0.07" />
            <rect className="gx-plate-sweep" x="0" y="-26" width="320" height="26" fill={`url(#${id}-sweep)`} />
          </>
        )}
      </g>
      {paintFx(air, plate, id)}
      {/* The sun on its way out, laid across the room before the mood grade so
          the hour reads under the feeling rather than over it. */}
      {plate.dusk && <rect className="gx-plate-sundown" x="0" y="0" width="320" height="132" fill={`url(#${id}-dusk)`} />}
      {/* The feeling the scene runs on, as a grade from the top-left corner. */}
      {plate.mood !== "none" && <rect className="gx-plate-grade" x="0" y="0" width="320" height="132" fill={`url(#${id}-grade)`} />}
      {/* The readable copy in the briefing catches a slow light leak across the
          frame, the way a printed page catches a window. */}
      {variant === "panel" && <rect className="gx-plate-leak" x="-120" y="0" width="120" height="132" fill={`url(#${id}-leak)`} />}
      {/* A pressure beat closes in from the edges. */}
      {heat && <rect className="gx-plate-vignette" x="0" y="0" width="320" height="132" fill={`url(#${id}-vignette)`} />}
      {/* A single sweep of light across the glass, so the plate sits on the same
          surface as every other panel instead of floating as a diagram. */}
      <rect x="0" y="0" width="320" height="132" fill="var(--plate-sheen)" opacity="0.35" />
      <rect className="gx-plate-grain" x="0" y="0" width="320" height="132" filter={`url(#${id}-grain)`} opacity="0.07" />
    </svg>
  );
}

/**
 * The drawing is a pure function of the scene and the variant, and it is the
 * most expensive thing on the table: a few hundred SVG nodes built from a
 * seeded generator. The stage re-renders ten times a second while its clock
 * runs, so the plate only redraws when the scene it draws changes. `node` is
 * the graph's own object, so identity is the right comparison for it.
 */
export const ScenePlate = memo(
  ScenePlateDrawing,
  (previous, next) => previous.node === next.node && previous.nodeId === next.nodeId && previous.variant === next.variant,
);
