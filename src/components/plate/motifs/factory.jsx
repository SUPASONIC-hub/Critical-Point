import { far, mid, near, people, figure, halo, mark } from "../primitives.jsx";

/**
 * A machine floor stopped for a year: lathes under dust sheets, high windows
 * the light comes in through, a calendar on the wall stuck on the month it
 * stopped. One machine is uncovered and its work lamp is on -- the accent,
 * and the only thing in the room that has moved.
 */
export function paintFactory(random, accent, glow) {
  const sheets = [];
  for (let machine = 0; machine < 4; machine += 1) {
    const x = 24 + machine * 58;
    if (machine === 2) continue;
    sheets.push(<path key={`sheet-${machine}`} d={`M${x} 104 Q${x + 4} 74 ${x + 22} 72 Q${x + 42} 74 ${x + 46} 104 Z`} />);
  }
  return (
    <>
      {far(
        <>
          <rect x="30" y="8" width="40" height="18" />
          <rect x="140" y="8" width="40" height="18" />
          <rect x="250" y="8" width="40" height="18" />
          <line x1="0" y1="44" x2="320" y2="44" />
          <rect x="276" y="52" width="24" height="26" />
        </>,
      )}
      {mid(
        <>
          {sheets}
          <rect x="140" y="82" width="48" height="22" />
          <line x1="150" y1="82" x2="150" y2="68" />
          <circle cx="176" cy="92" r="6" />
        </>,
      )}
      {halo(150, 66, 34, glow)}
      {mark(<path d="M144 62 H158 L154 68 H148 Z" fill={accent} stroke="none" />)}
      {near(<path d="M-4 104 H324 V132 H-4 Z" />)}
      {people(
        <>
          {figure("worker", 262, 124, 44)}
          {figure("foreman", 292, 124, 40)}
        </>,
      )}
    </>
  );
}
