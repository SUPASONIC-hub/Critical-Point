import { span, far, mid, near, people, figure, seated, halo, mark } from "../primitives.jsx";

/**
 * The ground floor of a building you are being let into or kept out of: glass
 * front, a long reception desk, a row of gates, and the company's name lit on
 * the wall behind it. The lit sign is the accent because a lobby is the one room
 * in this season whose entire function is to state whose building this is.
 */
export function paintLobby(random, accent, glow) {
  const gates = [];
  for (let gate = 0; gate < 4; gate += 1) {
    const x = 26 + gate * 42;
    gates.push(<path key={`gate-${gate}`} d={`M${x} 118 V96 H${x + 22} V118`} />);
  }
  const signX = Math.round(span(random, 186, 214));
  const columns = [];
  for (let column = 1; column < 4; column += 1) {
    columns.push(<line key={`col-${column}`} x1={column * 80} y1="4" x2={column * 80} y2="62" />);
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="4" x2="320" y2="4" />
          <line x1="0" y1="62" x2="320" y2="62" />
          {columns}
        </>,
      )}
      {mid(
        <>
          {/* The wall the name hangs on, and the desk in front of it. */}
          <rect x={signX - 34} y="20" width="104" height="34" />
          <path d="M184 96 H320 V74 H184 Z" />
          {gates}
        </>,
      )}
      {halo(signX + 18, 37, 40, glow)}
      {mark(<rect x={signX - 26} y="28" width="88" height="18" fill={accent} opacity="0.5" />)}
      {near(
        <>
          <line x1="0" y1="118" x2="320" y2="118" />
          <path d="M-4 118 H324 V132 H-4 Z" />
        </>,
      )}
      {people(
        <>
          {seated("reception", 250, 74, 24)}
          {figure("arriving", Math.round(span(random, 54, 108)), 116, 42)}
        </>,
      )}
    </>
  );
}
