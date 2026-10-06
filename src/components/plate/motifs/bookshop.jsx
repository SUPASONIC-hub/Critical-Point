import { span, far, mid, near, lit, people, figure, halo, mark } from "../primitives.jsx";

/**
 * Books stacked the way a second-hand shop stacks them -- spines in uneven
 * columns, a leaning pile on the floor, a stepladder nobody has folded -- with
 * one ledger open on top of the pile under a bare bulb. The archive motif is
 * boxes in perspective and reads as an institution filing things; this is the
 * opposite room, where the record survived because somebody would not throw it
 * away, and 임경수's 4년 of keeping the paper copy is that room.
 */
export function paintBookshop(random, accent, glow) {
  const spines = [];
  for (let column = 0; column < 9; column += 1) {
    const x = 8 + column * 34;
    let y = 96;
    while (y > span(random, 18, 42)) {
      const height = Math.round(span(random, 6, 13));
      const width = Math.round(span(random, 18, 30));
      spines.push(<rect key={`spine-${column}-${y}`} x={x} y={y - height} width={width} height={height} />);
      y -= height + 1;
    }
  }
  const pileX = Math.round(span(random, 206, 244));
  const bulbX = Math.round(span(random, 104, 152));
  return (
    <>
      {far(<line x1="0" y1="14" x2="320" y2="14" />)}
      {mid(spines)}
      {lit(<circle cx={bulbX} cy="22" r="4" />)}
      {mid(<line x1={bulbX} y1="0" x2={bulbX} y2="18" />)}
      {halo(bulbX, 22, 30, glow)}
      {near(
        <>
          {/* The leaning pile, and the ladder left where it was last climbed. */}
          <path d={`M${pileX} 132 V104 L${pileX + 44} 100 V132 Z`} />
          <line x1="44" y1="132" x2="58" y2="96" />
          <line x1="76" y1="132" x2="66" y2="96" />
          {[104, 114, 124].map((rung) => (
            <line key={`rung-${rung}`} x1={50 + (132 - rung) * 0.34} y1={rung} x2={74 - (132 - rung) * 0.24} y2={rung} />
          ))}
        </>,
      )}
      {halo(pileX + 22, 100, 22, glow)}
      {mark(<rect x={pileX + 6} y="94" width="32" height="8" fill={accent} />)}
      {people(figure("keeper", Math.round(span(random, 140, 178)), 126, 44))}
    </>
  );
}
