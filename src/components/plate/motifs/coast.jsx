import { span, far, mid, near, lit, people, figure, halo, mark } from "../primitives.jsx";

/**
 * The horizon, the sea running up to a railing, a pension with its lights on
 * and a lighthouse at the end of the breakwater -- and someone on the deck
 * looking out. The lit window in the pension is the accent; the boats on the
 * horizon are only ambient.
 */
export function paintCoast(random, accent, glow) {
  const pensionX = Math.round(span(random, 14, 64));
  const lighthouseX = Math.round(span(random, 238, 284));
  const boats = [];
  const boatCount = Math.round(span(random, 3, 6));
  for (let boat = 0; boat < boatCount; boat += 1) {
    boats.push(<rect key={`boat-${boat}`} x={Math.round(span(random, 110, 226))} y="55.5" width="3" height="1.6" />);
  }
  const sea = [];
  for (let row = 0; row < 5; row += 1) {
    const y = 64 + row * 8;
    const dash = 10 + row * 7;
    let x = -Math.round(span(random, 0, dash));
    while (x < 320) {
      sea.push(<line key={`sea-${row}-${x}`} x1={x} y1={y} x2={x + dash} y2={y} />);
      x += dash + Math.round(span(random, 8, 22) + row * 4);
    }
  }
  const windows = [];
  const litIndex = Math.floor(random() * 6);
  let accentAt = null;
  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const index = row * 3 + column;
      const x = pensionX + 8 + column * 20;
      const y = 50 + row * 17;
      if (index === litIndex) accentAt = { x, y };
      else if (random() > 0.4) windows.push(<rect key={`pw-${index}`} x={x} y={y} width="12" height="9" />);
    }
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="58" x2="320" y2="58" />
          <path d={`M${lighthouseX - 90} 58 Q${lighthouseX - 50} 44 ${lighthouseX - 12} 50 T320 52`} />
        </>,
      )}
      {lit(boats)}
      {mid(
        <>
          {sea}
          <path d={`M${lighthouseX - 46} 84 L${lighthouseX - 8} 78 H324`} />
          <path d={`M${lighthouseX - 6} 78 L${lighthouseX - 3} 42 H${lighthouseX + 3} L${lighthouseX + 6} 78 Z`} fill="var(--plate-solid)" />
          <rect x={lighthouseX - 4} y="34" width="8" height="8" />
          <path d={`M${lighthouseX - 5} 34 L${lighthouseX} 29 L${lighthouseX + 5} 34`} />
          <rect x={pensionX} y="42" width="76" height="50" fill="var(--plate-solid)" />
          <path d={`M${pensionX - 6} 43 L${pensionX + 38} 24 L${pensionX + 82} 43`} />
        </>,
      )}
      {lit(
        <>
          <rect x={lighthouseX - 3} y="35" width="6" height="6" />
          <path d={`M${lighthouseX - 3} 37 L${lighthouseX - 58} 30 L${lighthouseX - 58} 44 Z`} opacity="0.4" />
          {windows}
        </>,
      )}
      {accentAt && halo(accentAt.x + 6, accentAt.y + 4, 24, glow)}
      {accentAt && mark(<rect x={accentAt.x} y={accentAt.y} width="12" height="9" fill={accent} />)}
      {near(
        <>
          <rect x="-4" y="106" width="328" height="30" />
          <line x1="0" y1="96" x2="320" y2="96" />
          {[24, 104, 184, 264].map((post) => (
            <line key={`post-${post}`} x1={post} y1="96" x2={post} y2="106" />
          ))}
        </>,
      )}
      {people(figure("shore", Math.round(span(random, 146, 206)), 108, 42))}
    </>
  );
}
