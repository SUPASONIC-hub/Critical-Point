import { span, far, mid, near, people, figure, halo, mark } from "../primitives.jsx";

/**
 * A building that stopped at its concrete frame: floor slabs and columns with
 * nothing between them, a tower crane over it with its hook hanging, a site
 * office box at the fence. The accent is the one lamp in the crane cab --
 * somebody is still up there.
 */
export function paintConstruction(random, accent, glow) {
  const floors = Math.round(span(random, 5, 7));
  const slabs = [];
  for (let floor = 0; floor < floors; floor += 1) {
    const y = 104 - floor * 13;
    slabs.push(<line key={`slab-${floor}`} x1="40" y1={y} x2="178" y2={y} />);
  }
  const columns = [];
  for (let column = 0; column < 5; column += 1) {
    const x = 44 + column * 33;
    columns.push(<line key={`col-${column}`} x1={x} y1={104 - (floors - 1) * 13} x2={x} y2="104" />);
  }
  const mastX = Math.round(span(random, 212, 236));
  return (
    <>
      {far(<line x1="0" y1="104" x2="320" y2="104" />)}
      {mid(
        <>
          {slabs}
          {columns}
          {/* The crane: mast, jib, counter-jib, the hook line. */}
          <line x1={mastX} y1="104" x2={mastX} y2="10" />
          <line x1={mastX - 6} y1="104" x2={mastX - 6} y2="10" />
          <line x1={mastX - 96} y1="12" x2={mastX + 40} y2="12" />
          <line x1={mastX - 70} y1="12" x2={mastX - 70} y2="46" />
          <rect x={mastX - 74} y="46" width="8" height="5" />
          <rect x={mastX + 26} y="13" width="14" height="8" fill="var(--plate-solid)" />
        </>,
      )}
      {halo(mastX - 3, 18, 18, glow)}
      {mark(<rect x={mastX - 9} y="14" width="9" height="7" fill={accent} stroke="none" />)}
      {near(
        <>
          <rect x="250" y="94" width="56" height="26" />
          <line x1="-4" y1="120" x2="324" y2="120" />
          {[20, 70, 120, 170, 220].map((post) => (
            <line key={`fence-${post}`} x1={post} y1="108" x2={post} y2="120" />
          ))}
          <line x1="0" y1="108" x2="240" y2="108" />
        </>,
      )}
      {people(
        <>
          {figure("foreman", 132, 118, 30)}
          {figure("buyer", 160, 120, 28)}
        </>,
      )}
    </>
  );
}
