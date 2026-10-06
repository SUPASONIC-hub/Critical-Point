import { span, far, mid, near, lit, people, figure, halo, mark } from "../primitives.jsx";

/** Windows at night from outside, and the ledge the analyst stands behind. */
export function paintSkyline(random, accent, glow) {
  const columns = Math.round(span(random, 7, 10));
  const litIndex = Math.floor(random() * columns * 4);
  const towers = [];
  const windows = [];
  let accentAt = null;
  for (let column = 0; column < columns; column += 1) {
    const height = Math.round(span(random, 44, 92));
    const x = 14 + column * 34;
    towers.push(<rect key={`tower-${column}`} x={x} y={100 - height} width="26" height={height} />);
    for (let row = 0; row < 4; row += 1) {
      const y = 100 - height + 7 + row * 15;
      if (y > 92) continue;
      const index = column * 4 + row;
      if (index !== litIndex && random() > 0.55) continue;
      if (index === litIndex) accentAt = { x: x + 13, y: y + 3 };
      windows.push(<rect key={`lit-${column}-${row}`} x={x + 5} y={y} width="16" height="7" />);
    }
  }
  return (
    <>
      {far(<line x1="0" y1="100" x2="320" y2="100" />)}
      {mid(towers)}
      {lit(windows)}
      {accentAt && halo(accentAt.x, accentAt.y, 26, glow)}
      {accentAt && mark(<rect x={accentAt.x - 8} y={accentAt.y - 3} width="16" height="7" fill={accent} />)}
      {near(
        <>
          <rect x="-4" y="108" width="328" height="28" />
          <line x1="0" y1="108" x2="320" y2="108" />
        </>,
      )}
      {people(figure("exec", Math.round(span(random, 210, 268)), 112, 44))}
    </>
  );
}
