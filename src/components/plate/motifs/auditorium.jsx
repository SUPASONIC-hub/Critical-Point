import { round, far, mid, lit, people, figure, seated, halo, mark } from "../primitives.jsx";

/**
 * A hall facing a stage: a screen over a lectern, the rows seen from the back
 * as heads and shoulders, the aisle running down the middle. The accent is the
 * lamp on the lectern -- whoever stands there has the room, for as long as the
 * chair lets them.
 */
export function paintAuditorium(random, accent, glow) {
  const rows = [];
  for (let row = 0; row < 4; row += 1) {
    const y = 88 + row * 12;
    const count = 7 + row;
    const step = 300 / count;
    for (let seat = 0; seat < count; seat += 1) {
      const x = 10 + step * seat + step / 2;
      if (Math.abs(x - 160) < 12) continue;
      if (random() < 0.2) continue;
      rows.push(seated(`seat-${row}-${seat}`, Math.round(x), y + 10, round(11 + row * 2.6)));
    }
  }
  return (
    <>
      {far(
        <>
          <rect x="84" y="10" width="152" height="48" />
          <line x1="0" y1="72" x2="320" y2="72" />
          <path d="M20 72 L40 60 H280 L300 72" />
        </>,
      )}
      {lit(<rect x="88" y="14" width="144" height="40" opacity="0.5" />)}
      {halo(160, 58, 30, glow)}
      {mid(
        <>
          <path d="M148 72 V62 H172 V72" />
          <line x1="160" y1="62" x2="160" y2="54" />
        </>,
      )}
      {mark(<rect x="152" y="63" width="16" height="3" fill={accent} stroke="none" />)}
      {people(
        <>
          {figure("speaker", 176, 72, 20)}
          {rows}
        </>,
      )}
    </>
  );
}
