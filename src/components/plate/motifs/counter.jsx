import { span, far, mid, near, lit, people, figure, seated, halo, mark } from "../primitives.jsx";

/** Teller windows, a queue rail, one number lit, someone on each side of it. */
export function paintCounter(random, accent, glow) {
  const windows = [];
  const openWindow = Math.floor(span(random, 0, 4));
  let lamp = null;
  for (let bay = 0; bay < 4; bay += 1) {
    const x = 16 + bay * 74;
    windows.push(<rect key={`w-${bay}`} x={x} y="18" width="58" height="42" />);
    windows.push(<line key={`sill-${bay}`} x1={x} y1="52" x2={x + 58} y2="52" />);
    if (bay === openWindow) lamp = { x: x + 21, y: 24 };
  }
  return (
    <>
      {far(<line x1="0" y1="10" x2="320" y2="10" />)}
      {mid(windows)}
      {lit(<rect x="0" y="62" width="320" height="4" />)}
      {lamp && halo(lamp.x + 8, lamp.y + 5, 26, glow)}
      {lamp && mark(<rect x={lamp.x} y={lamp.y} width="16" height="10" fill={accent} />)}
      {near(
        <>
          <rect x="-4" y="74" width="328" height="16" />
          <line x1="0" y1="106" x2="320" y2="106" />
          {[54, 150, 246].map((post) => (
            <line key={`rail-${post}`} x1={post} y1="106" x2={post} y2="120" />
          ))}
        </>,
      )}
      {people(
        <>
          {seated("teller", lamp ? lamp.x + 8 : 120, 74, 26)}
          {figure("customer", lamp ? lamp.x + 2 : 140, 106, 40)}
        </>,
      )}
    </>
  );
}
