import { span, far, mid, near, people, figure, halo, mark } from "../primitives.jsx";

/**
 * A columbarium: a wall of glass niches, one of them lit by a candle, flowers
 * on the ledge and two people standing in front of it -- a parent and a child
 * in a school uniform. The candle is the accent and it is the only warm point
 * in a room the tone keeps cool.
 */
export function paintMemorial(random, accent, glow) {
  const niches = [];
  const litIndex = Math.round(span(random, 5, 9));
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      niches.push(<rect key={`n-${row}-${col}`} x={86 + col * 32} y={14 + row * 26} width="26" height="20" />);
    }
  }
  const litX = 86 + (litIndex % 5) * 32;
  const litY = 14 + Math.floor(litIndex / 5) * 26;
  return (
    <>
      {far(
        <>
          <line x1="0" y1="96" x2="320" y2="96" />
          <rect x="20" y="10" width="40" height="70" />
          <rect x="262" y="10" width="40" height="70" />
        </>,
      )}
      {halo(litX + 13, litY + 10, 32, glow)}
      {mid(
        <>
          {niches}
          <line x1="80" y1="94" x2="252" y2="94" />
          <path d="M112 94 l-4 -10 M116 94 l0 -12 M120 94 l4 -10" />
        </>,
      )}
      {mark(
        <>
          <rect x={litX + 3} y={litY + 3} width="20" height="14" fill={accent} opacity="0.35" stroke="none" />
          <path d={`M${litX + 13} ${litY + 15} q-3 -5 0 -9 q3 4 0 9 Z`} fill={accent} stroke="none" />
        </>,
      )}
      {near(<path d="M-4 112 H324 V132 H-4 Z" />)}
      {people(
        <>
          {figure("parent", 150, 124, 46)}
          {figure("son", 178, 124, 40)}
        </>,
      )}
    </>
  );
}
