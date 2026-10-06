import { span, far, mid, near, people, seated, halo, mark } from "../primitives.jsx";

/** A long table running away toward a lit screen, with the room seated at it. */
export function paintHall(random, accent, glow) {
  const vanish = Math.round(span(random, 146, 176));
  const seats = Math.round(span(random, 4, 6));
  const chairs = [];
  const sitters = [];
  for (let seat = 0; seat < seats; seat += 1) {
    const depth = seat / (seats + 1.1);
    const y = Math.round(116 - 56 * depth);
    const inset = Math.round(28 + 90 * depth);
    const size = Math.round(15 * (1 - depth * 0.68));
    chairs.push(<rect key={`lc-${seat}`} x={inset} y={y - size} width={size} height={size} />);
    chairs.push(<rect key={`rc-${seat}`} x={320 - inset - size} y={y - size} width={size} height={size} />);
    if (seat % 2 === 0) {
      sitters.push(seated(`sl-${seat}`, inset + size / 2, y - size, size * 1.5));
      sitters.push(seated(`sr-${seat}`, 320 - inset - size / 2, y - size, size * 1.5));
    }
  }
  return (
    <>
      {far(
        <>
          <rect x={vanish - 42} y="14" width="84" height="32" />
          <line x1="0" y1="54" x2="320" y2="54" />
        </>,
      )}
      {halo(vanish, 30, 44, glow)}
      {mark(<rect x={vanish - 34} y="20" width="68" height="20" fill={accent} />)}
      {mid(chairs)}
      {near(<path d={`M18 132 L${vanish - 30} 58 H${vanish + 30} L302 132 Z`} />)}
      {people(sitters)}
    </>
  );
}
