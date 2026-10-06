import { round, span } from "./primitives.jsx";

/**
 * Light that happens *to* the room rather than being part of it. Every one of
 * these is a fact the scene already states (see `getScenePlate`): a room the
 * public is watching goes off in camera flashes, open sky by day comes in as
 * slanted rays, and a night under pressure outdoors gets its storm. Positions
 * and timing are seeded, so a scene flashes in the same places every time, and
 * with motion reduced the flashes and the lightning are simply not drawn.
 */
export function paintFx(random, plate, id) {
  const layers = [];
  if (plate.rays) {
    const origin = span(random, 40, 280);
    const rays = [];
    for (let ray = 0; ray < 3; ray += 1) {
      const x = origin + (ray - 1) * span(random, 34, 52);
      const width = span(random, 14, 26);
      rays.push(
        <polygon
          key={`ray-${ray}`}
          points={`${round(x)},0 ${round(x + width)},0 ${round(x + width + 60)},132 ${round(x + 30)},132`}
          style={{ animationDelay: `-${span(random, 0, 9).toFixed(1)}s` }}
        />,
      );
    }
    layers.push(
      <g key="rays" className="gx-plate-rays" fill={`url(#${id}-ray)`}>
        {rays}
      </g>,
    );
  }
  if (plate.flash) {
    const bulbs = [];
    for (let bulb = 0; bulb < 6; bulb += 1) {
      bulbs.push(
        <circle
          key={`flash-${bulb}`}
          cx={round(span(random, 16, 304))}
          cy={round(span(random, 18, 84))}
          r={round(span(random, 9, 18))}
          style={{
            animationDuration: `${span(random, 3.2, 6.4).toFixed(2)}s`,
            animationDelay: `-${span(random, 0, 6).toFixed(2)}s`,
          }}
        />,
      );
    }
    layers.push(
      <g key="flash" className="gx-plate-flashes" fill={`url(#${id}-flash)`}>
        {bulbs}
      </g>,
    );
  }
  if (plate.steam) {
    const wisps = [];
    for (let wisp = 0; wisp < 5; wisp += 1) {
      const x = span(random, 40, 280);
      const y = span(random, 58, 86);
      wisps.push(
        <path
          key={`steam-${wisp}`}
          d={`M${round(x)} ${round(y)} q-6 -10 0 -20 q6 -10 0 -20`}
          style={{
            animationDuration: `${span(random, 3.6, 5.8).toFixed(2)}s`,
            animationDelay: `-${span(random, 0, 5).toFixed(2)}s`,
          }}
        />,
      );
    }
    layers.push(
      <g key="steam" className="gx-plate-steam" stroke="var(--c-paper)" strokeWidth="2.2" fill="none" strokeLinecap="round">
        {wisps}
      </g>,
    );
  }
  if (plate.spot) {
    // Two cones from the rig, swinging slowly across the stage.
    const cones = [];
    for (let cone = 0; cone < 2; cone += 1) {
      const x = cone === 0 ? span(random, 60, 120) : span(random, 200, 260);
      cones.push(
        <polygon
          key={`spot-${cone}`}
          points={`${round(x - 4)},0 ${round(x + 4)},0 ${round(x + 38)},118 ${round(x - 38)},118`}
          style={{ animationDelay: `-${span(random, 0, 12).toFixed(1)}s`, transformOrigin: `${round(x)}px 0px` }}
        />,
      );
    }
    layers.push(
      <g key="spot" className="gx-plate-spots" fill={`url(#${id}-spot)`}>
        {cones}
      </g>,
    );
  }
  if (plate.bokeh) {
    // A city out of focus: lit windows and headlights become soft discs.
    const discs = [];
    for (let disc = 0; disc < 8; disc += 1) {
      discs.push(
        <circle
          key={`bokeh-${disc}`}
          cx={round(span(random, 10, 310))}
          cy={round(span(random, 14, 80))}
          r={round(span(random, 6, 15))}
          style={{
            animationDuration: `${span(random, 6, 11).toFixed(2)}s`,
            animationDelay: `-${span(random, 0, 11).toFixed(2)}s`,
          }}
        />,
      );
    }
    layers.push(
      <g key="bokeh" className="gx-plate-bokeh" fill={`url(#${id}-bokeh)`}>
        {discs}
      </g>,
    );
  }
  if (plate.leds) {
    // Status lights on a seeded rhythm, each on its own clock.
    const leds = [];
    for (let led = 0; led < 16; led += 1) {
      leds.push(
        <rect
          key={`led-${led}`}
          x={round(span(random, 14, 306))}
          y={round(span(random, 10, 96))}
          width="2.2"
          height="1.6"
          style={{
            animationDuration: `${span(random, 0.9, 2.6).toFixed(2)}s`,
            animationDelay: `-${span(random, 0, 2.6).toFixed(2)}s`,
          }}
        />,
      );
    }
    layers.push(
      <g key="leds" className="gx-plate-leds" fill="var(--plate-accent-chip)">
        {leds}
      </g>,
    );
  }
  if (plate.ticker) {
    // A price board running right to left along the top of the floor.
    const cells = [];
    let x = 0;
    while (x < 640) {
      const width = Math.round(span(random, 8, 22));
      cells.push(<rect key={`tick-${x}`} x={x} y="3" width={width} height="3" />);
      x += width + Math.round(span(random, 5, 12));
    }
    layers.push(
      <g key="ticker" className="gx-plate-ticker" fill="var(--plate-ambient)">
        {cells}
      </g>,
    );
  }
  if (plate.petals || plate.leaves) {
    // April blossom and September leaves: the same drift, a different shape
    // and colour. Each piece tumbles on its own clock.
    const pieces = [];
    for (let piece = 0; piece < 16; piece += 1) {
      const x = round(span(random, -4, 320));
      const y = round(span(random, -6, 110));
      const turn = Math.round(span(random, 0, 360));
      pieces.push(
        plate.petals ? (
          <ellipse
            key={`petal-${piece}`}
            cx={x}
            cy={y}
            rx="1.9"
            ry="1.1"
            transform={`rotate(${turn} ${x} ${y})`}
            style={{ animationDuration: `${span(random, 6, 11).toFixed(2)}s`, animationDelay: `-${span(random, 0, 11).toFixed(2)}s` }}
          />
        ) : (
          <path
            key={`leaf-${piece}`}
            d={`M${x} ${y} q2.6 -2.6 5 0 q-2.4 2.6 -5 0 Z`}
            transform={`rotate(${turn} ${x} ${y})`}
            style={{ animationDuration: `${span(random, 7, 12).toFixed(2)}s`, animationDelay: `-${span(random, 0, 12).toFixed(2)}s` }}
          />
        ),
      );
    }
    layers.push(
      <g key="drift" className="gx-plate-drift" fill={plate.petals ? "var(--c-coral)" : "var(--c-amber)"} opacity="0.75">
        {pieces}
      </g>,
    );
  }
  if (plate.haze) {
    // Heat off the ground: three bands of air wavering near the floor line.
    const bands = [];
    for (let band = 0; band < 3; band += 1) {
      bands.push(
        <rect
          key={`haze-${band}`}
          x="-20"
          y={round(84 + band * 11 + span(random, -2, 2))}
          width="360"
          height="5"
          rx="2.5"
          style={{ animationDelay: `-${span(random, 0, 4).toFixed(2)}s` }}
        />,
      );
    }
    layers.push(
      <g key="haze" className="gx-plate-haze" fill="var(--c-paper)">
        {bands}
      </g>,
    );
  }
  if (plate.fireworks) {
    // Three bursts over the water, each a ring of sparks that opens and fades.
    const colours = ["var(--c-amber)", "var(--c-coral)", "var(--c-sky-86)"];
    const bursts = [];
    for (let burst = 0; burst < 3; burst += 1) {
      const cx = round(span(random, 40, 280));
      const cy = round(span(random, 14, 46));
      const sparks = [];
      for (let spark = 0; spark < 12; spark += 1) {
        const angle = (spark / 12) * Math.PI * 2;
        sparks.push(
          <line
            key={`s-${spark}`}
            x1={round(cx + Math.cos(angle) * 4)}
            y1={round(cy + Math.sin(angle) * 4)}
            x2={round(cx + Math.cos(angle) * 13)}
            y2={round(cy + Math.sin(angle) * 13)}
          />,
        );
      }
      bursts.push(
        <g
          key={`burst-${burst}`}
          stroke={colours[burst]}
          style={{ animationDelay: `-${span(random, 0, 4.5).toFixed(2)}s`, transformOrigin: `${cx}px ${cy}px` }}
        >
          {sparks}
        </g>,
      );
    }
    layers.push(
      <g key="fireworks" className="gx-plate-fireworks" strokeWidth="1.2" strokeLinecap="round">
        {bursts}
      </g>,
    );
  }
  if (plate.lightning) {
    layers.push(
      <rect
        key="lightning"
        className="gx-plate-lightning"
        x="0"
        y="0"
        width="320"
        height="132"
        fill="var(--plate-mid)"
        style={{ animationDelay: `-${span(random, 0, 7).toFixed(1)}s` }}
      />,
    );
  }
  return layers;
}
