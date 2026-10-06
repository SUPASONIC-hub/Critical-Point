import { span, far, mid, near, people, seated, halo, mark } from "../primitives.jsx";

/** A monitor, paper, a lamp, a mug -- and whoever is sitting in front of it. */
export function paintDesk(random, accent, glow) {
  const monitorX = Math.round(span(random, 92, 128));
  const lines = [];
  for (let line = 0; line < 5; line += 1) {
    lines.push(
      <line
        key={`text-${line}`}
        x1={monitorX + 9}
        y1={24 + line * 8}
        x2={monitorX + 9 + Math.round(span(random, 26, 78))}
        y2={24 + line * 8}
      />,
    );
  }
  const papers = [];
  for (let sheet = 0; sheet < 4; sheet += 1) {
    papers.push(<rect key={`sheet-${sheet}`} x={20 + sheet * 3} y={92 - sheet * 4} width="56" height="9" />);
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="70" x2="320" y2="70" />
          <rect x="232" y="12" width="62" height="46" />
          <circle cx="298" cy="22" r="7" />
        </>,
      )}
      {halo(monitorX + 48, 44, 52, glow)}
      {mid(
        <>
          <rect x={monitorX} y="14" width="96" height="60" />
          {mark(<rect x={monitorX + 4} y="18" width="88" height="52" fill={accent} opacity="0.2" stroke="none" />)}
          {lines}
          <path d={`M${monitorX + 40} 74 v8 h16 v-8`} />
          {papers}
          <circle cx="258" cy="90" r="8" />
        </>,
      )}
      {near(
        <>
          <line x1="0" y1="102" x2="320" y2="102" />
          <path d="M-4 102 H324 V132 H-4 Z" />
        </>,
      )}
      {people(seated("analyst", monitorX + 48, 104, 34))}
    </>
  );
}
