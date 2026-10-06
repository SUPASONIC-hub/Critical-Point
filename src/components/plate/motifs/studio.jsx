import { span, far, mid, near, lit, people, figure, halo, mark } from "../primitives.jsx";

/**
 * An advertising set: a curved cyclorama wall, two lights on stands with their
 * softboxes, the camera on its tripod, the director's chair, and one person on
 * the tape mark. The accent is the red tally lamp -- the room exists to be
 * recorded, and that lamp says whether it is.
 */
export function paintStudio(random, accent, glow) {
  const markX = Math.round(span(random, 138, 176));
  const cameraX = Math.round(span(random, 236, 262));
  return (
    <>
      {far(
        <>
          <path d="M18 8 H302 V70 Q302 94 278 96 H42 Q18 94 18 70 Z" />
          <line x1="0" y1="100" x2="320" y2="100" />
        </>,
      )}
      {lit(<path d="M26 14 H294 V68 Q294 88 274 90 H46 Q26 88 26 68 Z" opacity="0.28" />)}
      {mid(
        <>
          {/* Two lights on stands, softboxes angled at the mark. */}
          <path d="M48 110 L60 50 L72 110 M60 50 V40" />
          <path d="M44 22 L78 30 L74 44 L40 36 Z" fill="var(--plate-solid)" />
          <path d="M270 110 L282 54 L294 110 M282 54 V44" />
          <path d="M264 26 L298 22 L300 38 L266 42 Z" fill="var(--plate-solid)" />
          {/* The tape mark on the floor. */}
          <path d={`M${markX - 10} 106 h20 M${markX} 101 v10`} />
        </>,
      )}
      {halo(cameraX + 12, 58, 20, glow)}
      {near(
        <>
          {/* Camera on its tripod, and the chair nobody is sitting in. */}
          <path d={`M${cameraX - 8} 132 L${cameraX + 6} 78 L${cameraX + 20} 132 M${cameraX + 6} 78 V70`} />
          <rect x={cameraX - 6} y="56" width="26" height="14" />
          <rect x={cameraX + 20} y="59" width="8" height="8" />
          <path d="M150 132 V118 H182 V132 M146 110 H186" />
        </>,
      )}
      {mark(<circle cx={cameraX + 12} cy="59" r="2.4" fill={accent} stroke="none" />)}
      {people(figure("talent", markX, 104, 44))}
    </>
  );
}
