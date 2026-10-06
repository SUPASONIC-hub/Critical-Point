import { round, span, far, mid, people, figure, halo, mark } from "../primitives.jsx";

/**
 * A server room: two rows of racks running away to a vanishing point, cable
 * trays overhead, the cold aisle between them. One rack's status panel is the
 * accent -- in a room with no one in it, that panel is who is talking.
 */
export function paintServer(random, accent, glow) {
  const vanish = Math.round(span(random, 146, 176));
  const racks = [];
  for (let rack = 0; rack < 5; rack += 1) {
    const depth = rack / 5.5;
    const leftX = Math.round(10 + (vanish - 40 - 10) * depth);
    const rightX = Math.round(310 - (310 - vanish - 40) * depth);
    const top = Math.round(12 + 34 * depth);
    const bottom = Math.round(122 - 40 * depth);
    const width = Math.round(34 * (1 - depth * 0.7));
    racks.push(<rect key={`lr-${rack}`} x={leftX} y={top} width={width} height={bottom - top} />);
    racks.push(<rect key={`rr-${rack}`} x={rightX - width} y={top} width={width} height={bottom - top} />);
    for (let slot = 1; slot < 5; slot += 1) {
      const y = round(top + ((bottom - top) / 5) * slot);
      racks.push(<line key={`ls-${rack}-${slot}`} x1={leftX} y1={y} x2={leftX + width} y2={y} />);
      racks.push(<line key={`rs-${rack}-${slot}`} x1={rightX - width} y1={y} x2={rightX} y2={y} />);
    }
  }
  const panelX = Math.round(span(random, 20, 40));
  return (
    <>
      {far(
        <>
          <line x1="0" y1="6" x2="320" y2="6" />
          <line x1="0" y1="12" x2={vanish} y2="46" />
          <line x1="320" y1="12" x2={vanish} y2="46" />
          <line x1="0" y1="132" x2={vanish} y2="84" />
          <line x1="320" y1="132" x2={vanish} y2="84" />
        </>,
      )}
      {mid(racks)}
      {halo(panelX + 7, 40, 22, glow)}
      {mark(<rect x={panelX} y="34" width="14" height="10" fill={accent} stroke="none" />)}
      {people(figure("admin", vanish + Math.round(span(random, 6, 22)), 104, 34))}
    </>
  );
}
