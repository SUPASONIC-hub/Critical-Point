import { round, span } from "./primitives.jsx";

/** Rooms whose light comes off a screen, which get the refresh sweep. */
export const SCREEN_MOTIFS = new Set(["control", "archive", "desk", "lobby", "newsroom", "server", "trading"]);

/** Rooms with open sky over them, where a night can be raining. */
export const OUTDOOR_MOTIFS = new Set(["skyline", "street", "coast"]);

/**
 * Rooms seen through glass with weather on the other side of it. A taxi and a
 * dawn café are interiors -- no rain falls on the player -- but both are mostly
 * window, so the night outside runs down them instead of hanging as dust.
 */
export const GLASS_MOTIFS = new Set(["transit", "cafe"]);

/**
 * What hangs in the room's air. By day it is dust catching the light; after
 * midnight it is rain where there is sky and a few slow specks where there is
 * a ceiling. Every position, speed and phase comes from the scene's own seed,
 * and each element has a resting place and opacity, so with motion off the
 * plate still reads as a finished drawing -- motes suspended, rain mid-fall.
 */
export function paintAir(random, plate) {
  if (plate.snow) {
    // Snow falls slower than rain and wanders; a flake is a dot, not a streak.
    const flakes = [];
    for (let flake = 0; flake < 26; flake += 1) {
      flakes.push(
        <circle
          key={`snow-${flake}`}
          cx={round(span(random, -6, 326))}
          cy={round(span(random, -4, 120))}
          r={round(span(random, 0.6, 1.7))}
          style={{
            animationDuration: `${span(random, 5.5, 10).toFixed(2)}s`,
            animationDelay: `-${span(random, 0, 10).toFixed(2)}s`,
          }}
        />,
      );
    }
    return (
      <g className="gx-plate-air gx-plate-snow" fill="var(--c-paper)" opacity="0.8">
        {flakes}
      </g>
    );
  }
  // The monsoon rains by day as well as by night, harder, and always.
  const rain =
    plate.monsoon ||
    // A fireworks night and the 추석 moon are clear skies, so they never rain.
    (plate.night && !plate.fireworks && !plate.moon && (OUTDOOR_MOTIFS.has(plate.motif) || GLASS_MOTIFS.has(plate.motif)) && random() < 0.7);
  if (rain) {
    const drops = [];
    for (let drop = 0; drop < (plate.monsoon ? 34 : 18); drop += 1) {
      const x = span(random, -8, 334);
      const y = span(random, -6, 118);
      const length = span(random, plate.monsoon ? 10 : 6, plate.monsoon ? 18 : 12);
      const timing = {
        animationDuration: `${span(random, 0.8, 1.4).toFixed(2)}s`,
        animationDelay: `-${span(random, 0, 1.4).toFixed(2)}s`,
      };
      drops.push(
        <line key={`rain-${drop}`} x1={round(x)} y1={round(y)} x2={round(x - length * 0.3)} y2={round(y + length)} style={timing} />,
      );
    }
    // Puddles on the ground, each opening one ring after another.
    const ripples = [];
    if (plate.monsoon) {
      for (let ripple = 0; ripple < 7; ripple += 1) {
        ripples.push(
          <ellipse
            key={`ripple-${ripple}`}
            cx={round(span(random, 16, 304))}
            cy={round(span(random, 116, 128))}
            rx="7"
            ry="1.6"
            style={{ animationDelay: `-${span(random, 0, 1.6).toFixed(2)}s` }}
          />,
        );
      }
    }
    return (
      <>
        <g className="gx-plate-air gx-plate-rain" stroke="var(--plate-mid)" strokeWidth={plate.monsoon ? 0.9 : 0.7} opacity={plate.monsoon ? 0.65 : 0.5}>
          {drops}
        </g>
        {ripples.length > 0 && (
          <g className="gx-plate-air gx-plate-ripples" stroke="var(--plate-mid)" strokeWidth="0.6" fill="none">
            {ripples}
          </g>
        )}
      </>
    );
  }
  if (plate.paper) {
    // A room made of documents keeps a few of them in the air: small sheets,
    // each turning on its own axis, slower than dust and never in a hurry. They
    // are quadrilaterals rather than rectangles so a sheet reads as one seen at
    // an angle, and the resting rotation is the drawing you get with motion off.
    const sheets = [];
    for (let sheet = 0; sheet < 7; sheet += 1) {
      const x = round(span(random, 14, 300));
      const y = round(span(random, 16, 104));
      const width = round(span(random, 4.5, 8));
      const height = round(width * span(random, 1.1, 1.45));
      const lean = round(span(random, -0.9, 0.9));
      sheets.push(
        <polygon
          key={`sheet-${sheet}`}
          points={`${x},${y} ${round(x + width)},${round(y + lean)} ${round(x + width - lean)},${round(y + height)} ${round(x - lean)},${round(y + height - lean)}`}
          transform={`rotate(${round(span(random, -28, 28))} ${x} ${y})`}
          style={{
            animationDuration: `${span(random, 16, 26).toFixed(1)}s`,
            animationDelay: `-${span(random, 0, 26).toFixed(1)}s`,
            transformOrigin: `${x}px ${y}px`,
          }}
        />,
      );
    }
    return (
      <g className="gx-plate-air gx-plate-paper" fill="var(--c-paper)" opacity="0.32">
        {sheets}
      </g>
    );
  }
  const night = plate.night;
  const motes = [];
  for (let mote = 0; mote < (night ? 6 : 12); mote += 1) {
    const timing = {
      animationDuration: `${span(random, night ? 18 : 10, night ? 28 : 18).toFixed(1)}s`,
      animationDelay: `-${span(random, 0, 18).toFixed(1)}s`,
    };
    motes.push(
      <circle
        key={`mote-${mote}`}
        cx={round(span(random, 8, 312))}
        cy={round(span(random, 12, 98))}
        r={round(span(random, 0.5, night ? 1 : 1.35))}
        style={timing}
      />,
    );
  }
  return (
    <g className="gx-plate-air gx-plate-motes" fill={night ? "var(--plate-mid)" : "var(--plate-ambient)"} opacity="0.7">
      {motes}
    </g>
  );
}
