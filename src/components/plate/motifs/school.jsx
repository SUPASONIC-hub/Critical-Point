import { span, far, mid, near, lit, people, figure, halo, mark } from "../primitives.jsx";

/**
 * A school gate on exam morning: two pillars and the gate between them, the
 * building behind with its clock, a crowd along the fence holding signs. The
 * accent is the clock face -- the whole morning is counted on it.
 */
export function paintSchool(random, accent, glow) {
  const windows = [];
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      if (column === 3 || column === 4) continue;
      windows.push(<rect key={`sw-${row}-${column}`} x={60 + column * 26} y={22 + row * 14} width="16" height="8" />);
    }
  }
  const fans = [];
  const signs = [];
  const count = Math.round(span(random, 3, 5));
  for (let sign = 0; sign < count; sign += 1) {
    const x = Math.round(span(random, 16, 100) + (sign % 2) * 190);
    fans.push(figure(`fan-${sign}`, x, 126, 30));
    signs.push(<rect key={`sign-${sign}`} x={x - 9} y="88" width="18" height="10" />);
  }
  return (
    <>
      {far(
        <>
          <rect x="52" y="14" width="216" height="52" />
          <line x1="0" y1="70" x2="320" y2="70" />
        </>,
      )}
      {lit(windows)}
      {halo(160, 30, 20, glow)}
      {mark(<circle cx="160" cy="30" r="7" fill={accent} stroke="none" opacity="0.85" />)}
      {mid(
        <>
          <rect x="112" y="60" width="14" height="48" fill="var(--plate-solid)" />
          <rect x="194" y="60" width="14" height="48" fill="var(--plate-solid)" />
          <line x1="126" y1="104" x2="194" y2="104" />
          <line x1="0" y1="96" x2="112" y2="96" />
          <line x1="208" y1="96" x2="320" y2="96" />
        </>,
      )}
      {people(fans)}
      {mid(<g fill="var(--plate-solid)">{signs}</g>)}
      {near(<path d="M-4 126 H324 V132 H-4 Z" />)}
    </>
  );
}
