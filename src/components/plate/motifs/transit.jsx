import { round, span, far, mid, near, lit, people, figure, halo, mark } from "../primitives.jsx";

/**
 * The back of a car. Two headrests fill the bottom of the frame, the windscreen
 * runs away to a road whose lights are drawn as streaks rather than lamps, and
 * the fare meter on the dash is the one lit thing -- which is the right accent,
 * because in this season a taxi is always somebody paying to leave a building
 * faster than they are allowed to.
 */
export function paintTransit(random, accent, glow) {
  const streaks = [];
  for (let streak = 0; streak < 9; streak += 1) {
    const y = span(random, 16, 52);
    const x = span(random, 30, 250);
    const length = span(random, 14, 44);
    streaks.push(<line key={`streak-${streak}`} x1={round(x)} y1={round(y)} x2={round(x + length)} y2={round(y + length * 0.12)} />);
  }
  const meterX = Math.round(span(random, 176, 214));
  return (
    <>
      {far(
        <>
          <line x1="0" y1="58" x2="320" y2="58" />
          <path d="M40 14 H280 L262 58 H58 Z" />
        </>,
      )}
      {lit(streaks)}
      {mid(
        <>
          {/* The dash, and the mirror the driver watches the passenger in. */}
          <path d="M28 62 H292 L282 78 H38 Z" />
          <rect x="138" y="20" width="44" height="11" />
          <line x1="160" y1="31" x2="160" y2="38" />
        </>,
      )}
      {halo(meterX + 9, 68, 22, glow)}
      {mark(<rect x={meterX} y="64" width="18" height="9" fill={accent} />)}
      {near(
        <>
          {/* Two headrests: the driver, and the seat the analyst is not in. */}
          <path d="M-4 132 V96 Q-4 84 22 84 H82 Q108 84 108 96 V132 Z" />
          <path d="M196 132 V92 Q196 80 222 80 H286 Q312 80 312 92 V132 Z" />
          <line x1="150" y1="78" x2="150" y2="132" />
        </>,
      )}
      {people(figure("driver", 54, 92, 26))}
    </>
  );
}
