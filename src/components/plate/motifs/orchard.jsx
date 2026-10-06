import { round, span, far, mid, near, people, figure, halo, mark } from "../primitives.jsx";

/**
 * A 제주 orchard in winter: basalt walls, rounded trees heavy with fruit, an
 * oreum on the horizon, a storehouse with its door open. The accent is the lit
 * storehouse door -- where the season's people end up sitting after the picking.
 * The fruit is amber on purpose: the one warm crop in a cold month.
 */
export function paintOrchard(random, accent, glow) {
  const trees = [];
  const fruit = [];
  for (let tree = 0; tree < 6; tree += 1) {
    const x = Math.round(24 + tree * 46 + span(random, -6, 6));
    const y = Math.round(78 + (tree % 2) * 6);
    const r = Math.round(span(random, 15, 20));
    trees.push(<circle key={`tree-${tree}`} cx={x} cy={y} r={r} />);
    trees.push(<line key={`trunk-${tree}`} x1={x} y1={y + r} x2={x} y2={y + r + 8} />);
    for (let orange = 0; orange < 5; orange += 1) {
      fruit.push(
        <circle
          key={`o-${tree}-${orange}`}
          cx={round(x + span(random, -r * 0.7, r * 0.7))}
          cy={round(y + span(random, -r * 0.6, r * 0.6))}
          r="1.8"
        />,
      );
    }
  }
  const houseX = Math.round(span(random, 238, 262));
  return (
    <>
      {far(
        <>
          <path d="M0 54 Q60 30 120 50 Q170 62 220 44 Q270 30 320 48" />
          <line x1="0" y1="58" x2="320" y2="58" />
        </>,
      )}
      {mid(
        <>
          {trees}
          <rect x={houseX} y="36" width="56" height="30" fill="var(--plate-solid)" />
          <path d={`M${houseX - 4} 38 L${houseX + 28} 26 L${houseX + 60} 38`} />
        </>,
      )}
      <g fill="var(--c-amber)" stroke="none" opacity="0.85">
        {fruit}
      </g>
      {halo(houseX + 14, 54, 20, glow)}
      {mark(<rect x={houseX + 8} y="46" width="12" height="18" fill={accent} stroke="none" opacity="0.8" />)}
      {near(
        <>
          {/* The basalt wall, stones drawn as a lumpy line. */}
          <path d="M-4 112 Q10 104 24 110 Q38 102 52 110 Q66 104 80 110 Q94 102 108 110 Q122 104 136 110 Q150 102 164 110 Q178 104 192 110 Q206 102 220 110 Q234 104 248 110 Q262 102 276 110 Q290 104 304 110 Q318 102 324 110 V132 H-4 Z" />
          <rect x="30" y="100" width="22" height="12" />
          <rect x="34" y="90" width="22" height="10" />
        </>,
      )}
      {people(
        <>
          {figure("picker", Math.round(span(random, 120, 170)), 108, 34)}
          {figure("helper", Math.round(span(random, 190, 220)), 110, 30)}
        </>,
      )}
    </>
  );
}
