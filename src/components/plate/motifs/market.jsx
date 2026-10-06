import { round, span, far, mid, near, lit, people, figure, seated, halo, mark } from "../primitives.jsx";

/**
 * A rice-cake shop in a covered market: a striped awning, steamers stacked on
 * the counter with trays in front, the owner behind them and a queue in front.
 * The accent is the lamp over the steamers, the warmest light in the season.
 */
export function paintMarket(random, accent, glow) {
  const stacks = [];
  for (let stack = 0; stack < 3; stack += 1) {
    const x = 96 + stack * 44;
    for (let tier = 0; tier < 3; tier += 1) {
      stacks.push(<rect key={`st-${stack}-${tier}`} x={x} y={70 - tier * 9} width="34" height="8" />);
    }
  }
  const trays = [];
  for (let tray = 0; tray < 14; tray += 1) {
    trays.push(<ellipse key={`cake-${tray}`} cx={round(92 + tray * 10.5)} cy="88" rx="3.4" ry="2.2" />);
  }
  const queue = Math.round(span(random, 2, 4));
  const customers = [];
  for (let person = 0; person < queue; person += 1) {
    customers.push(figure(`q-${person}`, 250 + person * 20, 128, 38 - person * 3));
  }
  return (
    <>
      {far(
        <>
          <path d="M0 16 H320" />
          <path d="M20 16 L10 40 M60 16 L50 40 M100 16 L90 40 M140 16 L130 40 M180 16 L170 40 M220 16 L210 40 M260 16 L250 40 M300 16 L290 40" />
          <rect x="18" y="46" width="44" height="30" />
        </>,
      )}
      {halo(146, 38, 50, glow)}
      {mid(
        <>
          <path d="M70 16 Q160 34 250 16" />
          {stacks}
          <line x1="80" y1="92" x2="240" y2="92" />
        </>,
      )}
      {lit(trays)}
      {mark(<circle cx="146" cy="30" r="5" fill={accent} stroke="none" />)}
      {people(seated("owner", 60, 96, 30))}
      {near(<path d="M-4 96 H240 V132 H-4 Z" />)}
      {people(customers)}
    </>
  );
}
