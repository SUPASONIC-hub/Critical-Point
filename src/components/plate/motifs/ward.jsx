import { span, far, mid, near, lit, people, seated, halo, mark } from "../primitives.jsx";

/**
 * One bed, its rail up, a drip stand, a chair pulled close, and a window with
 * the afternoon in it. Everything is low and horizontal: no perspective running
 * away, no wall of screens, nothing converging. The season's other rooms are
 * built to make a decision feel urgent, and this one is built so that it cannot
 * -- which is the point of the room where the bill for all that urgency is paid.
 */
export function paintWard(random, accent, glow) {
  const windowX = Math.round(span(random, 196, 232));
  const blinds = [];
  for (let slat = 0; slat < 7; slat += 1) {
    blinds.push(<line key={`slat-${slat}`} x1={windowX} y1={22 + slat * 7} x2={windowX + 84} y2={22 + slat * 7} />);
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="72" x2="320" y2="72" />
          <rect x={windowX} y="18" width="84" height="54" />
        </>,
      )}
      {lit(<rect x={windowX + 2} y="20" width="80" height="50" />)}
      {far(blinds)}
      {mid(
        <>
          {/* The bed, side on, with the rail raised. */}
          <path d="M22 108 H176 V92 H22 Z" />
          <path d="M22 92 V70 H34 V92" />
          <line x1="46" y1="92" x2="46" y2="80" />
          <line x1="166" y1="92" x2="166" y2="82" />
          {[62, 82, 102, 122, 142].map((post) => (
            <line key={`rail-${post}`} x1={post} y1="92" x2={post} y2="82" />
          ))}
          <line x1="46" y1="82" x2="166" y2="82" />
          {/* The drip stand, and the chair somebody has been sitting in. */}
          <line x1="190" y1="108" x2="190" y2="44" />
          <path d="M182 108 H198" />
          <path d="M196 116 H228 V100 H196 Z" />
        </>,
      )}
      {halo(190, 50, 20, glow)}
      {mark(<rect x="184" y="44" width="12" height="14" fill={accent} opacity="0.7" />)}
      {near(
        <>
          <line x1="0" y1="118" x2="320" y2="118" />
          <path d="M-4 118 H324 V132 H-4 Z" />
        </>,
      )}
      {people(seated("visitor", 212, 100, 26))}
    </>
  );
}
