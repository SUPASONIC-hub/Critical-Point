import { span, far, mid, near, lit, people, seated, halo, mark } from "../primitives.jsx";

/**
 * A newsroom at night: a wall of monitors with the breaking-news ticker running
 * under it, two rows of desks with their own screens, reporters bent over them,
 * and the office cat asleep on the nearest keyboard. The ticker is the accent:
 * it is what the room exists to put out.
 */
export function paintNewsroom(random, accent, glow) {
  const screens = [];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      screens.push(<rect key={`wall-${row}-${col}`} x={88 + col * 37} y={10 + row * 20} width="33" height="17" />);
    }
  }
  const desks = [];
  const reporters = [];
  for (let desk = 0; desk < 4; desk += 1) {
    const x = Math.round(30 + desk * 72 + span(random, -6, 6));
    desks.push(<rect key={`desk-${desk}`} x={x} y="84" width="46" height="6" />);
    desks.push(<rect key={`mon-${desk}`} x={x + 12} y="70" width="20" height="13" />);
    if (desk !== 2 || random() < 0.5) reporters.push(seated(`r-${desk}`, x + 22, 88, 20));
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="56" x2="320" y2="56" />
          <rect x="8" y="12" width="60" height="36" />
          <rect x="252" y="12" width="60" height="36" />
        </>,
      )}
      {halo(160, 54, 70, glow)}
      {mid(
        <>
          {screens}
          {desks}
        </>,
      )}
      {lit(
        <>
          <rect x="92" y="14" width="25" height="9" />
          <rect x="166" y="34" width="25" height="9" />
        </>,
      )}
      {mark(<rect x="84" y="51" width="156" height="7" fill={accent} stroke="none" />)}
      {people(reporters)}
      {near(
        <>
          <path d="M-4 108 H324 V132 H-4 Z" />
          {/* The office cat, asleep on the front desk. */}
          <path d="M248 108 q0 -9 11 -9 q10 0 11 9 Z" />
          <path d="M252 101 l2 -5 l3 4 M262 100 l3 -4 l2 5" />
        </>,
      )}
    </>
  );
}
