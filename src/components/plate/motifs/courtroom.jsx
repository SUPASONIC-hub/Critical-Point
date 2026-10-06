import { far, mid, near, people, figure, seated, halo, mark } from "../primitives.jsx";

/**
 * A courtroom: the bench raised across the back with three judges' chairs,
 * the national emblem over it, counsel tables left and right, the public
 * benches in front of the player. The accent is the lamp on the bench -- the
 * one place in the season where the last word is not anyone's in the story.
 */
export function paintCourtroom(random, accent, glow) {
  const benches = [];
  for (let row = 0; row < 2; row += 1) {
    for (let seat = 0; seat < 6; seat += 1) {
      if (random() < 0.3) continue;
      benches.push(seated(`pub-${row}-${seat}`, 28 + seat * 52 + row * 10, 124 + row * 6, 14 + row * 2));
    }
  }
  return (
    <>
      {far(
        <>
          <circle cx="160" cy="14" r="7" />
          <line x1="0" y1="54" x2="320" y2="54" />
        </>,
      )}
      {mid(
        <>
          <rect x="70" y="30" width="180" height="24" fill="var(--plate-solid)" />
          {[120, 160, 200].map((x) => (
            <rect key={`judge-${x}`} x={x - 7} y="18" width="14" height="12" />
          ))}
          <rect x="24" y="72" width="70" height="10" />
          <rect x="226" y="72" width="70" height="10" />
          <rect x="146" y="66" width="28" height="18" />
        </>,
      )}
      {people(
        <>
          {seated("judge", 160, 30, 16)}
          {seated("counsel-a", 58, 72, 18)}
          {seated("counsel-b", 262, 72, 18)}
          {figure("witness", 160, 84, 22)}
        </>,
      )}
      {halo(160, 34, 26, glow)}
      {mark(<rect x="150" y="32" width="20" height="4" fill={accent} stroke="none" />)}
      {near(<path d="M-4 112 H324 V132 H-4 Z" />)}
      {people(benches)}
    </>
  );
}
