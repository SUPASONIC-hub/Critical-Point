import { span, far, mid, near, lit, people, figure, seated, halo, mark } from "../primitives.jsx";

/**
 * An airport departure hall: the glass wall with a plane on the apron behind
 * it, the departures board, a row of seats, a traveller with a suitcase. The
 * board is the accent: in this season a flight is always somebody leaving
 * before a question reaches them.
 */
export function paintAirport(random, accent, glow) {
  const rows = [];
  for (let row = 0; row < 4; row += 1) {
    rows.push(<line key={`dep-${row}`} x1="212" y1={22 + row * 6} x2={212 + Math.round(span(random, 40, 76))} y2={22 + row * 6} />);
  }
  const planeX = Math.round(span(random, 40, 110));
  return (
    <>
      {far(
        <>
          <line x1="0" y1="8" x2="320" y2="8" />
          <line x1="0" y1="70" x2="320" y2="70" />
          {[64, 128, 192, 256].map((x) => (
            <line key={`glass-${x}`} x1={x} y1="8" x2={x} y2="70" />
          ))}
          {/* The plane on the apron, side on. */}
          <path d={`M${planeX} 56 H${planeX + 78} Q${planeX + 88} 56 ${planeX + 88} 60 Q${planeX + 88} 62 ${planeX + 78} 62 H${planeX} Z`} />
          <path d={`M${planeX + 34} 58 L${planeX + 22} 48 H${planeX + 30} L${planeX + 48} 58`} />
          <path d={`M${planeX + 4} 56 L${planeX} 44 H${planeX + 8} L${planeX + 16} 56`} />
        </>,
      )}
      {mid(<rect x="206" y="16" width="92" height="30" fill="var(--plate-solid)" />)}
      {lit(rows)}
      {halo(252, 31, 34, glow)}
      {mark(<rect x="210" y="19" width="30" height="4" fill={accent} stroke="none" />)}
      {near(
        <>
          <path d="M-4 104 H324 V132 H-4 Z" />
          {[40, 62, 84, 106].map((x) => (
            <rect key={`seat-${x}`} x={x} y="94" width="18" height="10" />
          ))}
        </>,
      )}
      {people(
        <>
          {figure("traveller", Math.round(span(random, 160, 196)), 104, 40)}
          {seated("waiting", 71, 94, 18)}
        </>,
      )}
      {mid(<rect x={Math.round(span(random, 200, 214))} y="88" width="12" height="16" />)}
    </>
  );
}
