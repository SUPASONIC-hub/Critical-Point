import { createPlateRandom, getScenePlate } from "../scenePlate.js";

/**
 * The scene's room, drawn.
 *
 * One 320x132 viewBox, four depth planes, and three stroke weights. Every motif
 * builds from the same primitives so the set reads as one hand: a far plane at
 * low opacity, a mid plane carrying the structure, a near silhouette the player
 * is standing behind, and exactly one accent mark -- the lit window, the pulled
 * drawer, the screen at the end of the table -- that says what this room is for.
 *
 * Colour comes from `--plate-*` in play.css, which reads the night-shift tokens,
 * so the plate follows the UI rather than carrying a palette of its own. Lime is
 * never used: priority 30 reserves it for the control that records a decision,
 * and a decorative drawing is not that.
 *
 * It is `aria-hidden`. The room and the deadline are already text in the
 * dateline directly above, so announcing them again from a picture is noise.
 */
export function ScenePlate({ node, nodeId, variant = "panel" }) {
  const plate = getScenePlate(node, nodeId);
  const random = createPlateRandom(plate.seed);
  const draw = MOTIF_PAINTERS[plate.motif] ?? MOTIF_PAINTERS.desk;
  const accent = `var(--plate-accent-${plate.accent})`;

  return (
    <svg
      className={`gx-plate gx-plate-${variant} gx-plate-${plate.motif}${plate.night ? " gx-plate-night" : ""}`}
      // The briefing shows the whole drawing. The header is a short wide band,
      // so it crops -- but to the middle of the frame rather than the edges: the
      // top is ceiling and the bottom is the near silhouette, which on a dark
      // ground is a filled shape with nothing in it. What is left is the wall of
      // screens, the shelving, the monitor: the marks that name the room.
      viewBox={variant === "backdrop" ? "0 6 320 96" : "0 0 320 132"}
      preserveAspectRatio={variant === "backdrop" ? "xMidYMid slice" : "xMidYMid meet"}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0" y="0" width="320" height="132" fill="var(--plate-bg)" />
      {draw(random, accent)}
      {/* A single sweep of light across the glass, so the plate sits on the same
          surface as every other panel instead of floating as a diagram. */}
      <rect x="0" y="0" width="320" height="132" fill="var(--plate-sheen)" opacity="0.35" />
    </svg>
  );
}

/** Jitter helper: a value in [min, max) from the scene's own generator. */
function span(random, min, max) {
  return min + random() * (max - min);
}

function far(children) {
  return <g stroke="var(--plate-far)" fill="none" strokeWidth="1">{children}</g>;
}

function mid(children) {
  return <g stroke="var(--plate-mid)" fill="none" strokeWidth="1.4">{children}</g>;
}

function near(children) {
  return <g stroke="var(--plate-near)" fill="var(--plate-solid)" strokeWidth="1.6">{children}</g>;
}

/**
 * A wall of office windows seen from outside, and the desk edge the analyst is
 * standing behind. Used by the roof and by floor 33, which is the only room in
 * the season the player does not work in.
 */
function paintSkyline(random, accent) {
  const columns = Math.round(span(random, 7, 10));
  const litIndex = Math.floor(random() * columns * 4);
  const windows = [];
  for (let column = 0; column < columns; column += 1) {
    const height = Math.round(span(random, 44, 92));
    const x = 14 + column * 34;
    windows.push(<rect key={`tower-${column}`} x={x} y={100 - height} width="26" height={height} />);
    for (let row = 0; row < 4; row += 1) {
      const y = 100 - height + 7 + row * 15;
      if (y > 92) continue;
      const index = column * 4 + row;
      if (random() > 0.55) continue;
      windows.push(
        <rect
          key={`lit-${column}-${row}`}
          x={x + 5}
          y={y}
          width="16"
          height="7"
          fill={index === litIndex ? accent : "var(--plate-glow)"}
          stroke="none"
        />,
      );
    }
  }
  return (
    <>
      {far(<line x1="0" y1="100" x2="320" y2="100" />)}
      {mid(windows)}
      {near(
        <>
          <rect x="-4" y="108" width="328" height="28" />
          <line x1="0" y1="108" x2="320" y2="108" />
        </>,
      )}
    </>
  );
}

/** Low roofs, one warm window, and the railing you are leaning on. */
function paintStreet(random, accent) {
  const roofs = [];
  const buildings = [];
  let x = -6;
  while (x < 320) {
    const width = Math.round(span(random, 38, 72));
    const height = Math.round(span(random, 26, 52));
    roofs.push(<rect key={`roof-${x}`} x={x} y={96 - height} width={width} height={height} />);
    buildings.push({ x, width, height });
    x += width + 4;
  }
  // The one window still on belongs to a building rather than floating between
  // two of them, so pick a roof wide enough to hold it and sit the light inside.
  const lit = buildings.filter((building) => building.width > 34 && building.height > 30);
  const home = lit[Math.floor(random() * lit.length)] ?? buildings[1] ?? buildings[0];
  const lampX = Math.round(span(random, 210, 268));
  return (
    <>
      {far(roofs)}
      {mid(
        <>
          <rect x={home.x + 9} y={110 - home.height} width="18" height="13" fill={accent} stroke="none" />
          <line x1={lampX} y1="34" x2={lampX} y2="96" />
          <circle cx={lampX} cy="32" r="5" fill="var(--plate-glow)" stroke="none" />
          <line x1="0" y1="96" x2="320" y2="96" />
        </>,
      )}
      {near(
        <>
          <line x1="0" y1="112" x2="320" y2="112" />
          <line x1="0" y1="122" x2="320" y2="122" />
          {[40, 120, 200, 280].map((post) => (
            <line key={`post-${post}`} x1={post} y1="108" x2={post} y2="132" />
          ))}
        </>,
      )}
    </>
  );
}

/** Warehouse racking, a conveyor line, and pallets at the player's feet. */
function paintFloor(random, accent) {
  const bays = [];
  const litBay = Math.floor(random() * 5);
  for (let bay = 0; bay < 5; bay += 1) {
    const x = 16 + bay * 62;
    const top = Math.round(span(random, 16, 28));
    bays.push(<rect key={`bay-${bay}`} x={x} y={top} width="46" height={84 - top} />);
    for (let shelf = 1; shelf < 4; shelf += 1) {
      bays.push(<line key={`shelf-${bay}-${shelf}`} x1={x} y1={top + shelf * 18} x2={x + 46} y2={top + shelf * 18} />);
    }
    if (bay === litBay) {
      bays.push(<rect key="crate" x={x + 8} y={top + 21} width="14" height="12" fill={accent} stroke="none" />);
    }
  }
  return (
    <>
      {far(<line x1="0" y1="84" x2="320" y2="84" />)}
      {mid(bays)}
      {near(
        <>
          <line x1="0" y1="102" x2="320" y2="102" />
          <rect x="24" y="104" width="52" height="18" />
          <rect x="96" y="104" width="52" height="18" />
          <rect x="204" y="104" width="52" height="18" />
        </>,
      )}
    </>
  );
}

/** A wall of monitors with one raised, and the console it is watched from. */
function paintControl(random, accent) {
  const screens = [];
  const columns = 6;
  const rows = 3;
  const liveIndex = Math.floor(random() * columns * rows);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const x = 18 + column * 47;
      const y = 12 + row * 26;
      screens.push(<rect key={`screen-${index}`} x={x} y={y} width="38" height="20" />);
      if (index === liveIndex) {
        screens.push(<rect key="live" x={x + 3} y={y + 3} width="32" height="14" fill={accent} stroke="none" />);
      } else if (random() > 0.62) {
        screens.push(
          <line key={`trace-${index}`} x1={x + 4} y1={y + 13} x2={x + 34} y2={y + 6 + Math.round(span(random, 0, 8))} />,
        );
      }
    }
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="96" x2="320" y2="96" />
          <line x1="0" y1="8" x2="320" y2="8" />
        </>,
      )}
      {mid(screens)}
      {near(
        <>
          <path d="M-4 132 L44 104 H276 L324 132 Z" />
          {[76, 128, 180, 232].map((knob) => (
            <circle key={`knob-${knob}`} cx={knob} cy="116" r="3" />
          ))}
        </>,
      )}
    </>
  );
}

/** Shelving in one-point perspective with a single drawer pulled out. */
function paintArchive(random, accent) {
  const vanish = Math.round(span(random, 140, 186));
  const openRow = Math.floor(span(random, 1, 5));
  const shelves = [];
  for (let row = 0; row < 6; row += 1) {
    const y = 16 + row * 18;
    shelves.push(<line key={`left-${row}`} x1="0" y1={y - 8} x2={vanish - 26} y2={y + 14} />);
    shelves.push(<line key={`right-${row}`} x1="320" y1={y - 8} x2={vanish + 26} y2={y + 14} />);
  }
  const boxes = [];
  for (let box = 0; box < 7; box += 1) {
    const x = 6 + box * 20;
    boxes.push(<rect key={`box-${box}`} x={x} y={44 + box * 4} width="15" height="11" />);
    boxes.push(<rect key={`box-r-${box}`} x={299 - box * 20} y={44 + box * 4} width="15" height="11" />);
  }
  return (
    <>
      {far(shelves)}
      {mid(
        <>
          {boxes}
          <rect x={vanish - 22} y="52" width="44" height="46" />
        </>,
      )}
      {near(
        <>
          <rect x={vanish - 16} y={58 + openRow * 9} width="32" height="8" fill={accent} stroke="none" />
          <path d="M-4 132 L36 96 H284 L324 132 Z" fill="var(--plate-solid)" />
        </>,
      )}
    </>
  );
}

/** Converging floor and ceiling, doorframes either side, one doorway lit. */
function paintCorridor(random, accent) {
  const vanish = Math.round(span(random, 128, 196));
  const openDoor = Math.floor(span(random, 0, 4));
  const frames = [];
  for (let door = 0; door < 4; door += 1) {
    const depth = door / 4.6;
    const leftX = Math.round(12 + (vanish - 12) * depth);
    const rightX = Math.round(308 - (308 - vanish) * depth);
    const top = Math.round(18 + (58 - 18) * depth);
    const bottom = Math.round(120 - (120 - 72) * depth);
    const width = Math.round(26 * (1 - depth));
    frames.push(<rect key={`ld-${door}`} x={leftX} y={top} width={width} height={bottom - top} />);
    frames.push(<rect key={`rd-${door}`} x={rightX - width} y={top} width={width} height={bottom - top} />);
    if (door === openDoor) {
      frames.push(
        <rect key="open" x={leftX + 2} y={top + 3} width={Math.max(width - 4, 3)} height={bottom - top - 6} fill={accent} stroke="none" />,
      );
    }
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="4" x2={vanish} y2="62" />
          <line x1="320" y1="4" x2={vanish} y2="62" />
          <line x1="0" y1="132" x2={vanish} y2="70" />
          <line x1="320" y1="132" x2={vanish} y2="70" />
        </>,
      )}
      {mid(frames)}
      {near(<rect x={vanish - 18} y="58" width="36" height="16" />)}
    </>
  );
}

/** A long table running away from the viewer toward a lit screen. */
function paintHall(random, accent) {
  const vanish = Math.round(span(random, 146, 176));
  const seats = Math.round(span(random, 4, 6));
  const chairs = [];
  for (let seat = 0; seat < seats; seat += 1) {
    const depth = seat / (seats + 1.1);
    const y = Math.round(118 - 58 * depth);
    const inset = Math.round(30 + 88 * depth);
    const size = Math.round(15 * (1 - depth * 0.68));
    chairs.push(<rect key={`lc-${seat}`} x={inset} y={y - size} width={size} height={size} />);
    chairs.push(<rect key={`rc-${seat}`} x={320 - inset - size} y={y - size} width={size} height={size} />);
  }
  return (
    <>
      {far(
        <>
          <rect x={vanish - 42} y="16" width="84" height="34" />
          <line x1="0" y1="58" x2="320" y2="58" />
        </>,
      )}
      {mid(
        <>
          <rect x={vanish - 34} y="22" width="68" height="22" fill={accent} stroke="none" />
          {chairs}
        </>,
      )}
      {near(<path d={`M24 132 L${vanish - 30} 60 H${vanish + 30} L296 132 Z`} />)}
    </>
  );
}

/** A monitor, a stack of paper, a lamp cone, a mug. Most of the lab. */
function paintDesk(random, accent) {
  const monitorX = Math.round(span(random, 96, 132));
  const lines = [];
  for (let line = 0; line < 5; line += 1) {
    lines.push(
      <line
        key={`text-${line}`}
        x1={monitorX + 9}
        y1={26 + line * 8}
        x2={monitorX + 9 + Math.round(span(random, 26, 78))}
        y2={26 + line * 8}
      />,
    );
  }
  const papers = [];
  for (let sheet = 0; sheet < 4; sheet += 1) {
    papers.push(<rect key={`sheet-${sheet}`} x={22 + sheet * 3} y={96 - sheet * 4} width="56" height="9" />);
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="72" x2="320" y2="72" />
          <rect x="228" y="14" width="66" height="52" />
        </>,
      )}
      {mid(
        <>
          <rect x={monitorX} y="16" width="96" height="62" />
          <rect x={monitorX + 4} y="20" width="88" height="54" fill={accent} stroke="none" opacity="0.22" />
          {lines}
          <path d={`M${monitorX + 40} 78 v8 h16 v-8`} />
          {papers}
          <circle cx="262" cy="94" r="8" />
        </>,
      )}
      {near(
        <>
          <line x1="0" y1="104" x2="320" y2="104" />
          <path d="M-4 104 H324 V132 H-4 Z" />
        </>,
      )}
    </>
  );
}

const MOTIF_PAINTERS = {
  skyline: paintSkyline,
  street: paintStreet,
  floor: paintFloor,
  control: paintControl,
  archive: paintArchive,
  corridor: paintCorridor,
  hall: paintHall,
  desk: paintDesk,
};
