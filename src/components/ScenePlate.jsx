import { createPlateRandom, getScenePlate } from "../scenePlate.js";

/**
 * The scene's room, drawn.
 *
 * One 320x132 viewBox, four depth planes, three stroke weights. Every motif
 * builds from the same primitives so the set reads as one hand: a far plane at
 * low opacity, a mid plane carrying the structure, a near silhouette the player
 * stands behind, and exactly one accent mark -- the lit window, the pulled
 * drawer, the screen at the end of the table -- that says what the room is for.
 *
 * The first version of this drew empty architecture, and empty architecture is
 * wallpaper: a player could not tell the audit room from the archive at a
 * glance, which is the whole job. Three things fixed that. Rooms have people in
 * them now, placed where the scene's speaker would be standing; the light in
 * each building has its own colour, so 트리거랩 and 강서지점 do not read as the
 * same grey; and the accent carries a glow, so the one thing the room is for is
 * the one thing the eye lands on.
 *
 * Colour still comes from `--plate-*` in play.css, which reads the night-shift
 * tokens. Lime is never used: priority 30 reserves it for the control that
 * records a decision, and a drawing is not that.
 *
 * It is `aria-hidden`. The room and the deadline are already text in the
 * dateline directly above, so announcing them again from a picture is noise.
 */
export function ScenePlate({ node, nodeId, variant = "panel" }) {
  const plate = getScenePlate(node, nodeId);
  const random = createPlateRandom(plate.seed);
  const draw = MOTIF_PAINTERS[plate.motif] ?? MOTIF_PAINTERS.desk;
  const accent = `var(--plate-accent-${plate.accent})`;
  const className = [
    "gx-plate",
    `gx-plate-${variant}`,
    `gx-plate-${plate.motif}`,
    `gx-plate-tone-${plate.tone}`,
    plate.night ? "gx-plate-night" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={className}
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
      <defs>
        <radialGradient id={`plate-halo-${plate.seed}`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="132" fill="var(--plate-bg)" />
      {draw(random, accent, `url(#plate-halo-${plate.seed})`)}
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

/** The ambient light of the building, used for anything lit but not important. */
function lit(children) {
  return <g fill="var(--plate-ambient)" stroke="none" opacity="0.42">{children}</g>;
}

/** The people in the room, as silhouettes on the near plane. */
function people(children) {
  return <g fill="var(--plate-figure)" stroke="var(--plate-near)" strokeWidth="1.1">{children}</g>;
}

/**
 * One standing person. Head, shoulders, a body that tapers -- at 30px tall that
 * is every mark needed for the eye to read "someone is in this room", and the
 * room stops being an architectural drawing.
 */
function figure(key, x, baseY, height) {
  const head = Math.max(2.4, height * 0.17);
  const shoulder = head * 1.85;
  const waist = head * 1.4;
  const neckY = baseY - height + head * 2;
  return (
    <g key={key}>
      <circle cx={x} cy={baseY - height + head} r={head} />
      <path
        d={`M${x - waist} ${baseY} L${x - shoulder} ${neckY + head * 0.6} Q${x} ${neckY - head * 0.4} ${x + shoulder} ${neckY + head * 0.6} L${x + waist} ${baseY} Z`}
      />
    </g>
  );
}

/** One person seated at a surface: the same marks, folded at the waist. */
function seated(key, x, baseY, height) {
  const head = Math.max(2.4, height * 0.2);
  const shoulder = head * 1.8;
  const neckY = baseY - height + head * 2;
  return (
    <g key={key}>
      <circle cx={x} cy={baseY - height + head} r={head} />
      <path d={`M${x - shoulder} ${baseY} L${x - shoulder * 0.86} ${neckY} Q${x} ${neckY - head * 0.5} ${x + shoulder * 0.86} ${neckY} L${x + shoulder} ${baseY} Z`} />
    </g>
  );
}

/** A soft halo behind whatever the accent is, so the eye lands there first. */
function halo(cx, cy, r, paint) {
  return <circle cx={cx} cy={cy} r={r} fill={paint} />;
}

/** Windows at night from outside, and the ledge the analyst stands behind. */
function paintSkyline(random, accent, glow) {
  const columns = Math.round(span(random, 7, 10));
  const litIndex = Math.floor(random() * columns * 4);
  const towers = [];
  const windows = [];
  let accentAt = null;
  for (let column = 0; column < columns; column += 1) {
    const height = Math.round(span(random, 44, 92));
    const x = 14 + column * 34;
    towers.push(<rect key={`tower-${column}`} x={x} y={100 - height} width="26" height={height} />);
    for (let row = 0; row < 4; row += 1) {
      const y = 100 - height + 7 + row * 15;
      if (y > 92) continue;
      const index = column * 4 + row;
      if (index !== litIndex && random() > 0.55) continue;
      if (index === litIndex) accentAt = { x: x + 13, y: y + 3 };
      windows.push(<rect key={`lit-${column}-${row}`} x={x + 5} y={y} width="16" height="7" />);
    }
  }
  return (
    <>
      {far(<line x1="0" y1="100" x2="320" y2="100" />)}
      {mid(towers)}
      {lit(windows)}
      {accentAt && halo(accentAt.x, accentAt.y, 26, glow)}
      {accentAt && <rect x={accentAt.x - 8} y={accentAt.y - 3} width="16" height="7" fill={accent} />}
      {near(
        <>
          <rect x="-4" y="108" width="328" height="28" />
          <line x1="0" y1="108" x2="320" y2="108" />
        </>,
      )}
      {people(figure("exec", Math.round(span(random, 210, 268)), 112, 44))}
    </>
  );
}

/** Low roofs, one window still on, and the railing you are leaning on. */
function paintStreet(random, accent, glow) {
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
  const tall = buildings.filter((building) => building.width > 34 && building.height > 30);
  const home = tall[Math.floor(random() * tall.length)] ?? buildings[1] ?? buildings[0];
  const windowX = home.x + 9;
  const windowY = 110 - home.height;
  const lampX = Math.round(span(random, 210, 268));
  return (
    <>
      {far(roofs)}
      {mid(
        <>
          <line x1={lampX} y1="34" x2={lampX} y2="96" />
          <line x1="0" y1="96" x2="320" y2="96" />
        </>,
      )}
      {lit(<circle cx={lampX} cy="32" r="6" />)}
      {halo(lampX, 32, 22, glow)}
      {halo(windowX + 9, windowY + 6, 24, glow)}
      <rect x={windowX} y={windowY} width="18" height="13" fill={accent} />
      {people(
        <>
          {figure("walker", Math.round(span(random, 60, 110)), 116, 32)}
          {figure("waiter", lampX - 14, 118, 30)}
        </>,
      )}
      {near(
        <>
          <line x1="0" y1="120" x2="320" y2="120" />
          <line x1="0" y1="128" x2="320" y2="128" />
        </>,
      )}
    </>
  );
}

/** Warehouse racking, pallets, and the night shift standing between them. */
function paintFloor(random, accent, glow) {
  const bays = [];
  const litBay = Math.floor(random() * 5);
  let crate = null;
  for (let bay = 0; bay < 5; bay += 1) {
    const x = 16 + bay * 62;
    const top = Math.round(span(random, 16, 28));
    bays.push(<rect key={`bay-${bay}`} x={x} y={top} width="46" height={84 - top} />);
    for (let shelf = 1; shelf < 4; shelf += 1) {
      bays.push(<line key={`shelf-${bay}-${shelf}`} x1={x} y1={top + shelf * 18} x2={x + 46} y2={top + shelf * 18} />);
    }
    if (bay === litBay) crate = { x: x + 8, y: top + 21 };
  }
  return (
    <>
      {far(<line x1="0" y1="84" x2="320" y2="84" />)}
      {mid(bays)}
      {crate && halo(crate.x + 7, crate.y + 6, 24, glow)}
      {crate && <rect x={crate.x} y={crate.y} width="14" height="12" fill={accent} />}
      {near(
        <>
          <line x1="0" y1="100" x2="320" y2="100" />
          <rect x="18" y="112" width="52" height="16" />
          <rect x="232" y="112" width="52" height="16" />
        </>,
      )}
      {people(
        <>
          {figure("shift-a", 108, 110, 36)}
          {figure("shift-b", 134, 112, 32)}
        </>,
      )}
    </>
  );
}

/** A wall of monitors with one live, and two people watching it. */
function paintControl(random, accent, glow) {
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
      {live && <rect x={live.x + 3} y={live.y + 3} width="32" height="12" fill={accent} />}
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

/** Shelving in perspective, one drawer pulled, someone standing in the aisle. */
function paintArchive(random, accent, glow) {
  const vanish = Math.round(span(random, 140, 186));
  const openRow = Math.floor(span(random, 1, 4));
  const shelves = [];
  for (let row = 0; row < 6; row += 1) {
    const y = 14 + row * 17;
    shelves.push(<line key={`left-${row}`} x1="0" y1={y - 8} x2={vanish - 26} y2={y + 14} />);
    shelves.push(<line key={`right-${row}`} x1="320" y1={y - 8} x2={vanish + 26} y2={y + 14} />);
  }
  const boxes = [];
  for (let box = 0; box < 7; box += 1) {
    const x = 6 + box * 20;
    boxes.push(<rect key={`box-${box}`} x={x} y={40 + box * 4} width="15" height="11" />);
    boxes.push(<rect key={`box-r-${box}`} x={299 - box * 20} y={40 + box * 4} width="15" height="11" />);
  }
  const drawerY = 54 + openRow * 9;
  return (
    <>
      {far(shelves)}
      {mid(
        <>
          {boxes}
          <rect x={vanish - 22} y="44" width="44" height="46" />
        </>,
      )}
      {halo(vanish, drawerY + 4, 28, glow)}
      <rect x={vanish - 16} y={drawerY} width="32" height="8" fill={accent} />
      {near(<path d="M-4 132 L30 96 H290 L324 132 Z" />)}
      {people(figure("reader", vanish - 42, 104, 40))}
    </>
  );
}

/** Converging floor and ceiling, one doorway lit, someone in the corridor. */
function paintCorridor(random, accent, glow) {
  const vanish = Math.round(span(random, 128, 196));
  const openDoor = Math.floor(span(random, 0, 4));
  const frames = [];
  let open = null;
  for (let door = 0; door < 4; door += 1) {
    const depth = door / 4.6;
    const leftX = Math.round(12 + (vanish - 12) * depth);
    const rightX = Math.round(308 - (308 - vanish) * depth);
    const top = Math.round(18 + (58 - 18) * depth);
    const bottom = Math.round(120 - (120 - 72) * depth);
    const width = Math.round(26 * (1 - depth));
    frames.push(<rect key={`ld-${door}`} x={leftX} y={top} width={width} height={bottom - top} />);
    frames.push(<rect key={`rd-${door}`} x={rightX - width} y={top} width={width} height={bottom - top} />);
    if (door === openDoor) open = { x: leftX + 2, y: top + 3, w: Math.max(width - 4, 3), h: bottom - top - 6 };
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
      {open && halo(open.x + open.w / 2, open.y + open.h / 2, open.h * 0.9, glow)}
      {open && <rect x={open.x} y={open.y} width={open.w} height={open.h} fill={accent} />}
      {mid(<rect x={vanish - 18} y="58" width="36" height="16" />)}
      {people(figure("walker", vanish + Math.round(span(random, 26, 54)), 112, 46))}
    </>
  );
}

/** A long table running away toward a lit screen, with the room seated at it. */
function paintHall(random, accent, glow) {
  const vanish = Math.round(span(random, 146, 176));
  const seats = Math.round(span(random, 4, 6));
  const chairs = [];
  const sitters = [];
  for (let seat = 0; seat < seats; seat += 1) {
    const depth = seat / (seats + 1.1);
    const y = Math.round(116 - 56 * depth);
    const inset = Math.round(28 + 90 * depth);
    const size = Math.round(15 * (1 - depth * 0.68));
    chairs.push(<rect key={`lc-${seat}`} x={inset} y={y - size} width={size} height={size} />);
    chairs.push(<rect key={`rc-${seat}`} x={320 - inset - size} y={y - size} width={size} height={size} />);
    if (seat % 2 === 0) {
      sitters.push(seated(`sl-${seat}`, inset + size / 2, y - size, size * 1.5));
      sitters.push(seated(`sr-${seat}`, 320 - inset - size / 2, y - size, size * 1.5));
    }
  }
  return (
    <>
      {far(
        <>
          <rect x={vanish - 42} y="14" width="84" height="32" />
          <line x1="0" y1="54" x2="320" y2="54" />
        </>,
      )}
      {halo(vanish, 30, 44, glow)}
      <rect x={vanish - 34} y="20" width="68" height="20" fill={accent} />
      {mid(chairs)}
      {near(<path d={`M18 132 L${vanish - 30} 58 H${vanish + 30} L302 132 Z`} />)}
      {people(sitters)}
    </>
  );
}

/** Teller windows, a queue rail, one number lit, someone on each side of it. */
function paintCounter(random, accent, glow) {
  const windows = [];
  const openWindow = Math.floor(span(random, 0, 4));
  let lamp = null;
  for (let bay = 0; bay < 4; bay += 1) {
    const x = 16 + bay * 74;
    windows.push(<rect key={`w-${bay}`} x={x} y="18" width="58" height="42" />);
    windows.push(<line key={`sill-${bay}`} x1={x} y1="52" x2={x + 58} y2="52" />);
    if (bay === openWindow) lamp = { x: x + 21, y: 24 };
  }
  return (
    <>
      {far(<line x1="0" y1="10" x2="320" y2="10" />)}
      {mid(windows)}
      {lit(<rect x="0" y="62" width="320" height="4" />)}
      {lamp && halo(lamp.x + 8, lamp.y + 5, 26, glow)}
      {lamp && <rect x={lamp.x} y={lamp.y} width="16" height="10" fill={accent} />}
      {near(
        <>
          <rect x="-4" y="74" width="328" height="16" />
          <line x1="0" y1="106" x2="320" y2="106" />
          {[54, 150, 246].map((post) => (
            <line key={`rail-${post}`} x1={post} y1="106" x2={post} y2="120" />
          ))}
        </>,
      )}
      {people(
        <>
          {seated("teller", lamp ? lamp.x + 8 : 120, 74, 26)}
          {figure("customer", lamp ? lamp.x + 2 : 140, 106, 40)}
        </>,
      )}
    </>
  );
}

/** A monitor, paper, a lamp, a mug -- and whoever is sitting in front of it. */
function paintDesk(random, accent, glow) {
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
          <rect x={monitorX + 4} y="18" width="88" height="52" fill={accent} opacity="0.2" stroke="none" />
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

const MOTIF_PAINTERS = {
  skyline: paintSkyline,
  street: paintStreet,
  floor: paintFloor,
  control: paintControl,
  archive: paintArchive,
  corridor: paintCorridor,
  hall: paintHall,
  counter: paintCounter,
  desk: paintDesk,
};
