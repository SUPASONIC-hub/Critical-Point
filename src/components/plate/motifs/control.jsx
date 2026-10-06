import { span, far, mid, near, lit, people, seated, halo, mark } from "../primitives.jsx";

/** A wall of monitors with one live, and two people watching it. */
export function paintControl(random, accent, glow) {
  const frames = [];
  const glowing = [];
  const columns = 6;
  const rows = 3;
  const liveIndex = Math.floor(random() * columns * rows);
  let live = null;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const x = 18 + column * 47;
      const y = 10 + row * 24;
      frames.push(<rect key={`screen-${index}`} x={x} y={y} width="38" height="18" />);
      if (index === liveIndex) {
        live = { x, y };
        continue;
      }
      if (random() > 0.55) glowing.push(<rect key={`on-${index}`} x={x + 3} y={y + 3} width="32" height="12" />);
      else frames.push(<line key={`trace-${index}`} x1={x + 4} y1={y + 12} x2={x + 34} y2={y + 5 + Math.round(span(random, 0, 7))} />);
    }
  }
  return (
    <>
      {far(<line x1="0" y1="6" x2="320" y2="6" />)}
      {mid(frames)}
      {lit(glowing)}
      {live && halo(live.x + 19, live.y + 9, 34, glow)}
      {live && mark(<rect x={live.x + 3} y={live.y + 3} width="32" height="12" fill={accent} />)}
      {near(
        <>
          <path d="M-4 132 L40 106 H280 L324 132 Z" />
          {[70, 126, 182, 238].map((knob) => (
            <circle key={`knob-${knob}`} cx={knob} cy="118" r="2.6" />
          ))}
        </>,
      )}
      {people(
        <>
          {seated("watch-a", 96, 112, 30)}
          {seated("watch-b", 206, 112, 28)}
        </>,
      )}
    </>
  );
}
