import { span, far, mid, near, people, figure, halo, mark } from "../primitives.jsx";

/**
 * A white wall of framed canvases under track lights, one of them lit hotter
 * than the rest, and someone standing in front of it. The lit canvas is the
 * accent; the other spots only wash the wall.
 */
export function paintGallery(random, accent, glow) {
  const count = Math.round(span(random, 3, 4.99));
  const litFrame = Math.floor(random() * count);
  const slot = 300 / count;
  const frames = [];
  const art = [];
  const spots = [];
  let hung = null;
  for (let index = 0; index < count; index += 1) {
    const width = Math.round(span(random, 40, Math.min(66, slot - 14)));
    const height = Math.round(span(random, 32, 50));
    const x = Math.round(10 + slot * index + (slot - width) / 2);
    const y = Math.round(58 - height / 2 - 2);
    const cx = x + width / 2;
    frames.push(<rect key={`frame-${index}`} x={x} y={y} width={width} height={height} />);
    frames.push(<rect key={`mat-${index}`} x={x + 4} y={y + 4} width={width - 8} height={height - 8} />);
    spots.push(<path key={`spot-${index}`} d={`M${cx - 3} 14 L${cx - width * 0.62} ${y + height + 8} H${cx + width * 0.62} L${cx + 3} 14 Z`} />);
    if (index === litFrame) {
      hung = { x: x + 4, y: y + 4, w: width - 8, h: height - 8 };
      continue;
    }
    // Something on each canvas, in the far weight, so a frame is a painting
    // rather than an empty box.
    if (random() > 0.5) art.push(<circle key={`art-${index}`} cx={cx} cy={y + height / 2} r={Math.min(width, height) * 0.2} />);
    else art.push(<path key={`art-${index}`} d={`M${x + 8} ${y + height - 10} L${cx} ${y + 12} L${x + width - 8} ${y + height - 10}`} />);
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="10" x2="320" y2="10" />
          <line x1="0" y1="96" x2="320" y2="96" />
          {art}
        </>,
      )}
      <g fill="var(--plate-ambient)" stroke="none" opacity="0.12">
        {spots}
      </g>
      {mid(
        <>
          <line x1="6" y1="14" x2="314" y2="14" />
          {frames}
        </>,
      )}
      {hung && halo(hung.x + hung.w / 2, hung.y + hung.h / 2, Math.max(hung.w, hung.h) * 0.9, glow)}
      {hung && mark(<rect x={hung.x} y={hung.y} width={hung.w} height={hung.h} fill={accent} opacity="0.55" />)}
      {near(
        <>
          <path d="M-4 132 L22 104 H298 L324 132 Z" />
          <rect x="118" y="112" width="84" height="7" />
        </>,
      )}
      {people(
        <>
          {figure("viewer", hung ? Math.round(hung.x + hung.w / 2 + span(random, -8, 8)) : 160, 110, 42)}
          {random() > 0.45 && figure("guest", Math.round(span(random, 24, 60)), 104, 30)}
        </>,
      )}
    </>
  );
}
