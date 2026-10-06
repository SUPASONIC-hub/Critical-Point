import { span, far, mid, near, people, seated, halo, mark } from "../primitives.jsx";

/**
 * A 국정감사 room: the members' dais curving across the back wall with a
 * nameplate at every seat, cameras on tripods at both sides, and the witness
 * table in front. The accent is the chair nobody sat in -- the one the season
 * has been walking toward -- lit where the witness should be.
 */
export function paintChamber(random, accent, glow) {
  const seats = Math.round(span(random, 7, 9));
  const members = [];
  const plates = [];
  for (let seat = 0; seat < seats; seat += 1) {
    const t = seat / (seats - 1);
    const x = Math.round(44 + t * 232);
    const y = Math.round(48 - Math.sin(t * Math.PI) * 12);
    plates.push(<rect key={`np-${seat}`} x={x - 6} y={y + 2} width="12" height="4" />);
    if (random() < 0.8) members.push(seated(`m-${seat}`, x, y, 13));
  }
  const emptyX = Math.round(span(random, 214, 240));
  return (
    <>
      {far(
        <>
          <circle cx="160" cy="18" r="9" />
          <circle cx="160" cy="18" r="5" />
          <path d="M28 58 Q160 22 292 58" />
          <line x1="0" y1="64" x2="320" y2="64" />
        </>,
      )}
      {mid(
        <>
          {plates}
          <path d="M24 64 Q160 30 296 64" />
          {/* Cameras on tripods, left and right. */}
          <path d="M18 104 L26 80 L34 104 M26 80 V70" />
          <rect x="18" y="62" width="18" height="10" />
          <path d="M286 104 L294 80 L302 104 M294 80 V70" />
          <rect x="284" y="62" width="18" height="10" />
          <line x1="160" y1="64" x2="100" y2="132" />
          <line x1="160" y1="64" x2="220" y2="132" />
        </>,
      )}
      {people(members)}
      {halo(emptyX + 9, 92, 30, glow)}
      {near(
        <>
          <rect x="96" y="100" width="112" height="14" />
          <path d="M140 100 V90 l6 -4" />
          <rect x={emptyX} y="84" width="18" height="24" />
        </>,
      )}
      {mark(<rect x={emptyX + 3} y="87" width="12" height="10" fill={accent} opacity="0.85" stroke="none" />)}
      {people(seated("witness", 152, 102, 26))}
    </>
  );
}
