import { span, far, mid, near, people, figure, halo, mark } from "../primitives.jsx";

/** Shelving in perspective, one drawer pulled, someone standing in the aisle. */
export function paintArchive(random, accent, glow) {
  const vanish = Math.round(span(random, 140, 186));
  const openRow = Math.floor(span(random, 1, 4));
  const shelves = [];
  for (let row = 0; row < 6; row += 1) {
    const y = 14 + row * 17;
    shelves.push(<line key={`left-${row}`} x1="0" y1={y - 8} x2={vanish - 26} y2={y + 14} />);
    shelves.push(<line key={`right-${row}`} x1="320" y1={y - 8} x2={vanish + 26} y2={y + 14} />);
  }
  const boxes = [];
  for (let box = 0; box < 7; box += 1) {
    const x = 6 + box * 20;
    boxes.push(<rect key={`box-${box}`} x={x} y={40 + box * 4} width="15" height="11" />);
    boxes.push(<rect key={`box-r-${box}`} x={299 - box * 20} y={40 + box * 4} width="15" height="11" />);
  }
  const drawerY = 54 + openRow * 9;
  return (
    <>
      {far(shelves)}
      {mid(
        <>
          {boxes}
          <rect x={vanish - 22} y="44" width="44" height="46" />
        </>,
      )}
      {halo(vanish, drawerY + 4, 28, glow)}
      {mark(<rect x={vanish - 16} y={drawerY} width="32" height="8" fill={accent} />)}
      {near(<path d="M-4 132 L30 96 H290 L324 132 Z" />)}
      {people(figure("reader", vanish - 42, 104, 40))}
    </>
  );
}
