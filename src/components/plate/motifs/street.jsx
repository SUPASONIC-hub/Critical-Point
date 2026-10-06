import { span, far, mid, near, lit, people, figure, halo, mark } from "../primitives.jsx";

/** Low roofs, one window still on, and the railing you are leaning on. */
export function paintStreet(random, accent, glow) {
  const roofs = [];
  const buildings = [];
  let x = -6;
  while (x < 320) {
    const width = Math.round(span(random, 38, 72));
    const height = Math.round(span(random, 26, 52));
    roofs.push(<rect key={`roof-${x}`} x={x} y={96 - height} width={width} height={height} />);
    buildings.push({ x, width, height });
    x += width + 4;
  }
  const tall = buildings.filter((building) => building.width > 34 && building.height > 30);
  const home = tall[Math.floor(random() * tall.length)] ?? buildings[1] ?? buildings[0];
  const windowX = home.x + 9;
  const windowY = 110 - home.height;
  const lampX = Math.round(span(random, 210, 268));
  return (
    <>
      {far(roofs)}
      {mid(
        <>
          <line x1={lampX} y1="34" x2={lampX} y2="96" />
          <line x1="0" y1="96" x2="320" y2="96" />
        </>,
      )}
      {lit(<circle cx={lampX} cy="32" r="6" />)}
      {halo(lampX, 32, 22, glow)}
      {halo(windowX + 9, windowY + 6, 24, glow)}
      {mark(<rect x={windowX} y={windowY} width="18" height="13" fill={accent} />)}
      {people(
        <>
          {figure("walker", Math.round(span(random, 60, 110)), 116, 32)}
          {figure("waiter", lampX - 14, 118, 30)}
        </>,
      )}
      {near(
        <>
          <line x1="0" y1="120" x2="320" y2="120" />
          <line x1="0" y1="128" x2="320" y2="128" />
        </>,
      )}
    </>
  );
}
