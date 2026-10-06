import { round, span, far, mid, near, people, figure, seated, halo, mark } from "../primitives.jsx";

/**
 * A trading floor: rows of desks each carrying a bank of screens, a chart wall
 * with a line running across it, and the price board along the ceiling (the
 * effects layer runs it). The accent is the one candle on the chart that fell.
 */
export function paintTrading(random, accent, glow) {
  const screens = [];
  for (let desk = 0; desk < 4; desk += 1) {
    const x = 22 + desk * 72;
    for (let screen = 0; screen < 3; screen += 1) {
      screens.push(<rect key={`scr-${desk}-${screen}`} x={x + screen * 17} y="72" width="15" height="11" />);
    }
    screens.push(<rect key={`desk-${desk}`} x={x - 4} y="84" width="58" height="5" />);
  }
  const points = [];
  let y = span(random, 30, 44);
  for (let step = 0; step <= 12; step += 1) {
    y = Math.max(16, Math.min(52, y + span(random, -7, 7)));
    points.push(`${40 + step * 20},${round(y)}`);
  }
  const dropX = 40 + Math.round(span(random, 4, 10)) * 20;
  return (
    <>
      {far(
        <>
          <line x1="0" y1="10" x2="320" y2="10" />
          <rect x="30" y="12" width="260" height="46" />
        </>,
      )}
      <g fill="none" stroke="var(--plate-ambient)" strokeWidth="1.4" opacity="0.7">
        <polyline points={points.join(" ")} />
      </g>
      {halo(dropX, 40, 18, glow)}
      {mark(<rect x={dropX - 3} y="30" width="6" height="18" fill={accent} stroke="none" />)}
      {mid(screens)}
      {near(<path d="M-4 104 H324 V132 H-4 Z" />)}
      {people(
        <>
          {seated("trader-a", 48, 104, 26)}
          {seated("trader-b", 192, 104, 26)}
          {figure("manager", 270, 106, 36)}
        </>,
      )}
    </>
  );
}
