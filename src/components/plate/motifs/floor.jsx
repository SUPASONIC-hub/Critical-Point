import { span, far, mid, near, people, figure, halo, mark } from "../primitives.jsx";

/** Warehouse racking, pallets, and the night shift standing between them. */
export function paintFloor(random, accent, glow) {
  const bays = [];
  const litBay = Math.floor(random() * 5);
  let crate = null;
  for (let bay = 0; bay < 5; bay += 1) {
    const x = 16 + bay * 62;
    const top = Math.round(span(random, 16, 28));
    bays.push(<rect key={`bay-${bay}`} x={x} y={top} width="46" height={84 - top} />);
    for (let shelf = 1; shelf < 4; shelf += 1) {
      bays.push(<line key={`shelf-${bay}-${shelf}`} x1={x} y1={top + shelf * 18} x2={x + 46} y2={top + shelf * 18} />);
    }
    if (bay === litBay) crate = { x: x + 8, y: top + 21 };
  }
  return (
    <>
      {far(<line x1="0" y1="84" x2="320" y2="84" />)}
      {mid(bays)}
      {crate && halo(crate.x + 7, crate.y + 6, 24, glow)}
      {crate && mark(<rect x={crate.x} y={crate.y} width="14" height="12" fill={accent} />)}
      {near(
        <>
          <line x1="0" y1="100" x2="320" y2="100" />
          <rect x="18" y="112" width="52" height="16" />
          <rect x="232" y="112" width="52" height="16" />
        </>,
      )}
      {people(
        <>
          {figure("shift-a", 108, 110, 36)}
          {figure("shift-b", 134, 112, 32)}
        </>,
      )}
    </>
  );
}
