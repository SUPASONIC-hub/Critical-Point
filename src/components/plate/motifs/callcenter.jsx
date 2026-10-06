import { round, far, mid, near, people, seated, halo, mark } from "../primitives.jsx";

/**
 * A call centre: rows of low partitions, a headset at every seat, a wall
 * board counting calls waiting. The accent is that counter -- the number the
 * room is run by, and the reason nobody here gets to finish a sentence.
 */
export function paintCallcenter(random, accent, glow) {
  const rows = [];
  const agents = [];
  for (let row = 0; row < 3; row += 1) {
    const y = 76 + row * 16;
    const scale = 1 - row * -0.12;
    rows.push(<line key={`part-${row}`} x1="10" y1={y} x2="310" y2={y} />);
    for (let seat = 0; seat < 6; seat += 1) {
      const x = Math.round(26 + seat * 52 + (row % 2) * 14);
      rows.push(<line key={`div-${row}-${seat}`} x1={x - 22} y1={y - 8} x2={x - 22} y2={y} />);
      if (random() < 0.85) agents.push(seated(`agent-${row}-${seat}`, x, y, round(14 * scale)));
    }
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="10" x2="320" y2="10" />
          <rect x="120" y="16" width="80" height="30" />
        </>,
      )}
      {halo(160, 31, 32, glow)}
      {mark(<rect x="128" y="22" width="64" height="18" fill={accent} opacity="0.55" stroke="none" />)}
      {mid(rows)}
      {people(agents)}
      {near(<path d="M-4 124 H324 V132 H-4 Z" />)}
    </>
  );
}
