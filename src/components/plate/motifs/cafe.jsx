import { span, far, mid, near, people, seated, halo, mark } from "../primitives.jsx";

/**
 * A café before it is properly open: a window wall with the street still dark
 * behind it, two small round tables, and the machine behind the counter already
 * lit. 사건 09 writes its ledger here at dawn, so the room has to read as the
 * one place in the season where two people sit down without a building around
 * them -- small furniture, a lot of glass, and nobody else in yet.
 */
export function paintCafe(random, accent, glow) {
  const mullions = [];
  for (let bay = 1; bay < 5; bay += 1) {
    mullions.push(<line key={`mullion-${bay}`} x1={bay * 64} y1="8" x2={bay * 64} y2="74" />);
  }
  const tableX = Math.round(span(random, 168, 206));
  const machineX = Math.round(span(random, 22, 48));
  return (
    <>
      {far(
        <>
          <line x1="0" y1="8" x2="320" y2="8" />
          <line x1="0" y1="74" x2="320" y2="74" />
          {mullions}
        </>,
      )}
      {mid(
        <>
          {/* The counter, and the shelf of cups behind it. */}
          <path d="M-4 96 H92 V74 H-4 Z" />
          <rect x={machineX} y="56" width="26" height="18" />
          {/* Two tables: one the scene sits at, one nobody is at yet. */}
          <line x1={tableX} y1="112" x2={tableX} y2="94" />
          <ellipse cx={tableX} cy="92" rx="26" ry="6" />
          <line x1="128" y1="104" x2="128" y2="90" />
          <ellipse cx="128" cy="88" rx="18" ry="4.5" />
        </>,
      )}
      {halo(machineX + 13, 62, 26, glow)}
      {mark(<rect x={machineX + 4} y="58" width="18" height="8" fill={accent} />)}
      {near(
        <>
          <line x1="0" y1="118" x2="320" y2="118" />
          <path d="M-4 118 H324 V132 H-4 Z" />
        </>,
      )}
      {people(
        <>
          {seated("ledger-a", tableX - 24, 100, 30)}
          {seated("ledger-b", tableX + 24, 100, 30)}
        </>,
      )}
    </>
  );
}
