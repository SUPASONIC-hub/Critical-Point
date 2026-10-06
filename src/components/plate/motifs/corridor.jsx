import { span, far, mid, people, figure, halo, mark } from "../primitives.jsx";

/** Converging floor and ceiling, one doorway lit, someone in the corridor. */
export function paintCorridor(random, accent, glow) {
  const vanish = Math.round(span(random, 128, 196));
  const openDoor = Math.floor(span(random, 0, 4));
  const frames = [];
  let open = null;
  for (let door = 0; door < 4; door += 1) {
    const depth = door / 4.6;
    const leftX = Math.round(12 + (vanish - 12) * depth);
    const rightX = Math.round(308 - (308 - vanish) * depth);
    const top = Math.round(18 + (58 - 18) * depth);
    const bottom = Math.round(120 - (120 - 72) * depth);
    const width = Math.round(26 * (1 - depth));
    frames.push(<rect key={`ld-${door}`} x={leftX} y={top} width={width} height={bottom - top} />);
    frames.push(<rect key={`rd-${door}`} x={rightX - width} y={top} width={width} height={bottom - top} />);
    if (door === openDoor) open = { x: leftX + 2, y: top + 3, w: Math.max(width - 4, 3), h: bottom - top - 6 };
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="4" x2={vanish} y2="62" />
          <line x1="320" y1="4" x2={vanish} y2="62" />
          <line x1="0" y1="132" x2={vanish} y2="70" />
          <line x1="320" y1="132" x2={vanish} y2="70" />
        </>,
      )}
      {mid(frames)}
      {open && halo(open.x + open.w / 2, open.y + open.h / 2, open.h * 0.9, glow)}
      {open && mark(<rect x={open.x} y={open.y} width={open.w} height={open.h} fill={accent} />)}
      {mid(<rect x={vanish - 18} y="58" width="36" height="16" />)}
      {people(figure("walker", vanish + Math.round(span(random, 26, 54)), 112, 46))}
    </>
  );
}
