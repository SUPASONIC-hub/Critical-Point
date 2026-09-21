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
  // The air gets its own generator, so adding motes never moves a window the
  // room already lit -- and it is still the scene's seed, so the rain on a
  // resumed scene falls where it fell before.
  const air = createPlateRandom((plate.seed ^ 0x9e3779b9) >>> 0);
  const draw = MOTIF_PAINTERS[plate.motif] ?? MOTIF_PAINTERS.desk;
  const accent = `var(--plate-accent-${plate.accent})`;
  // Both copies print on one page, so every paint server is named per copy.
  const id = `plate-${variant}-${plate.seed}`;
  const screens = SCREEN_MOTIFS.has(plate.motif);
  const heat = plate.accent === "heat";
  const className = [
    "gx-plate",
    `gx-plate-${variant}`,
    `gx-plate-${plate.motif}`,
    `gx-plate-tone-${plate.tone}`,
    `gx-plate-${plate.accent}`,
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
        <radialGradient id={`${id}-halo`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        {screens && (
          <>
            <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--plate-ambient)" stopOpacity="0" />
              <stop offset="85%" stopColor="var(--plate-ambient)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--plate-ambient)" stopOpacity="0" />
            </linearGradient>
            <pattern id={`${id}-lines`} width="4" height="3" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="1" fill="var(--plate-ambient)" />
            </pattern>
          </>
        )}
        {plate.flash && (
          <radialGradient id={`${id}-flash`}>
            <stop offset="0%" stopColor="var(--c-paper)" stopOpacity="0.95" />
            <stop offset="35%" stopColor="var(--c-paper)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--c-paper)" stopOpacity="0" />
          </radialGradient>
        )}
        {plate.rays && (
          <linearGradient id={`${id}-ray`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--plate-ambient)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--plate-ambient)" stopOpacity="0" />
          </linearGradient>
        )}
        {/* Film grain: one static noise field over every plate, so the drawing
            reads as a printed frame rather than a vector diagram. */}
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={plate.seed % 97} stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
        </filter>
        {heat && (
          <radialGradient id={`${id}-vignette`} r="0.72">
            <stop offset="45%" stopColor={accent} stopOpacity="0" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.5" />
          </radialGradient>
        )}
      </defs>
      <rect x="0" y="0" width="320" height="132" fill="var(--plate-bg)" />
      {/* Everything that is the room moves as one, so the briefing copy can
          push in slowly without the ground showing at an edge. */}
      <g className="gx-plate-stage">
        {draw(random, accent, `url(#${id}-halo)`)}
        {paintAir(air, plate)}
        {screens && (
          <>
            {/* A room lit by screens refreshes: faint raster lines, and one
                band of light rolling down them every few seconds. */}
            <rect x="0" y="0" width="320" height="132" fill={`url(#${id}-lines)`} opacity="0.07" />
            <rect className="gx-plate-sweep" x="0" y="-26" width="320" height="26" fill={`url(#${id}-sweep)`} />
          </>
        )}
      </g>
      {paintFx(air, plate, id)}
      {/* A pressure beat closes in from the edges. */}
      {heat && <rect className="gx-plate-vignette" x="0" y="0" width="320" height="132" fill={`url(#${id}-vignette)`} />}
      {/* A single sweep of light across the glass, so the plate sits on the same
          surface as every other panel instead of floating as a diagram. */}
      <rect x="0" y="0" width="320" height="132" fill="var(--plate-sheen)" opacity="0.35" />
      <rect className="gx-plate-grain" x="0" y="0" width="320" height="132" filter={`url(#${id}-grain)`} opacity="0.07" />
    </svg>
  );
}

/** Rooms whose light comes off a screen, which get the refresh sweep. */
const SCREEN_MOTIFS = new Set(["control", "archive", "desk", "lobby", "newsroom"]);

/** Rooms with open sky over them, where a night can be raining. */
const OUTDOOR_MOTIFS = new Set(["skyline", "street", "coast"]);

/**
 * Rooms seen through glass with weather on the other side of it. A taxi and a
 * dawn café are interiors -- no rain falls on the player -- but both are mostly
 * window, so the night outside runs down them instead of hanging as dust.
 */
const GLASS_MOTIFS = new Set(["transit", "cafe"]);

/**
 * What hangs in the room's air. By day it is dust catching the light; after
 * midnight it is rain where there is sky and a few slow specks where there is
 * a ceiling. Every position, speed and phase comes from the scene's own seed,
 * and each element has a resting place and opacity, so with motion off the
 * plate still reads as a finished drawing -- motes suspended, rain mid-fall.
 */
function paintAir(random, plate) {
  const rain =
    plate.night && (OUTDOOR_MOTIFS.has(plate.motif) || GLASS_MOTIFS.has(plate.motif)) && random() < 0.7;
  if (rain) {
    const drops = [];
    for (let drop = 0; drop < 18; drop += 1) {
      const x = span(random, -8, 334);
      const y = span(random, -6, 118);
      const length = span(random, 6, 12);
      const timing = {
        animationDuration: `${span(random, 0.8, 1.4).toFixed(2)}s`,
        animationDelay: `-${span(random, 0, 1.4).toFixed(2)}s`,
      };
      drops.push(
        <line key={`rain-${drop}`} x1={round(x)} y1={round(y)} x2={round(x - length * 0.3)} y2={round(y + length)} style={timing} />,
      );
    }
    return (
      <g className="gx-plate-air gx-plate-rain" stroke="var(--plate-mid)" strokeWidth="0.7" opacity="0.5">
        {drops}
      </g>
    );
  }
  const night = plate.night;
  const motes = [];
  for (let mote = 0; mote < (night ? 6 : 12); mote += 1) {
    const timing = {
      animationDuration: `${span(random, night ? 18 : 10, night ? 28 : 18).toFixed(1)}s`,
      animationDelay: `-${span(random, 0, 18).toFixed(1)}s`,
    };
    motes.push(
      <circle
        key={`mote-${mote}`}
        cx={round(span(random, 8, 312))}
        cy={round(span(random, 12, 98))}
        r={round(span(random, 0.5, night ? 1 : 1.35))}
        style={timing}
      />,
    );
  }
  return (
    <g className="gx-plate-air gx-plate-motes" fill={night ? "var(--plate-mid)" : "var(--plate-ambient)"} opacity="0.7">
      {motes}
    </g>
  );
}

function round(value) {
  return Math.round(value * 10) / 10;
}

/** Jitter helper: a value in [min, max) from the scene's own generator. */
function span(random, min, max) {
  return min + random() * (max - min);
}

/** The far plane drifts a few pixels over half a minute against the rest. */
function far(children) {
  return (
    <g className="gx-plate-far" stroke="var(--plate-far)" fill="none" strokeWidth="1">
      {children}
    </g>
  );
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
  return <circle className="gx-plate-halo" cx={cx} cy={cy} r={r} fill={paint} />;
}

/** The one lit thing the room is for. Its light is live, so it flickers. */
function mark(children) {
  return <g className="gx-plate-accent">{children}</g>;
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
      {accentAt && mark(<rect x={accentAt.x - 8} y={accentAt.y - 3} width="16" height="7" fill={accent} />)}
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
      {mark(<rect x={windowX} y={windowY} width="18" height="13" fill={accent} />)}
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
      {crate && mark(<rect x={crate.x} y={crate.y} width="14" height="12" fill={accent} />)}
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
      {live && mark(<rect x={live.x + 3} y={live.y + 3} width="32" height="12" fill={accent} />)}
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
      {mark(<rect x={vanish - 16} y={drawerY} width="32" height="8" fill={accent} />)}
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
      {open && mark(<rect x={open.x} y={open.y} width={open.w} height={open.h} fill={accent} />)}
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
      {mark(<rect x={vanish - 34} y="20" width="68" height="20" fill={accent} />)}
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
      {lamp && mark(<rect x={lamp.x} y={lamp.y} width="16" height="10" fill={accent} />)}
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

/**
 * The horizon, the sea running up to a railing, a pension with its lights on
 * and a lighthouse at the end of the breakwater -- and someone on the deck
 * looking out. The lit window in the pension is the accent; the boats on the
 * horizon are only ambient.
 */
function paintCoast(random, accent, glow) {
  const pensionX = Math.round(span(random, 14, 64));
  const lighthouseX = Math.round(span(random, 238, 284));
  const boats = [];
  const boatCount = Math.round(span(random, 3, 6));
  for (let boat = 0; boat < boatCount; boat += 1) {
    boats.push(<rect key={`boat-${boat}`} x={Math.round(span(random, 110, 226))} y="55.5" width="3" height="1.6" />);
  }
  const sea = [];
  for (let row = 0; row < 5; row += 1) {
    const y = 64 + row * 8;
    const dash = 10 + row * 7;
    let x = -Math.round(span(random, 0, dash));
    while (x < 320) {
      sea.push(<line key={`sea-${row}-${x}`} x1={x} y1={y} x2={x + dash} y2={y} />);
      x += dash + Math.round(span(random, 8, 22) + row * 4);
    }
  }
  const windows = [];
  const litIndex = Math.floor(random() * 6);
  let accentAt = null;
  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const index = row * 3 + column;
      const x = pensionX + 8 + column * 20;
      const y = 50 + row * 17;
      if (index === litIndex) accentAt = { x, y };
      else if (random() > 0.4) windows.push(<rect key={`pw-${index}`} x={x} y={y} width="12" height="9" />);
    }
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="58" x2="320" y2="58" />
          <path d={`M${lighthouseX - 90} 58 Q${lighthouseX - 50} 44 ${lighthouseX - 12} 50 T320 52`} />
        </>,
      )}
      {lit(boats)}
      {mid(
        <>
          {sea}
          <path d={`M${lighthouseX - 46} 84 L${lighthouseX - 8} 78 H324`} />
          <path d={`M${lighthouseX - 6} 78 L${lighthouseX - 3} 42 H${lighthouseX + 3} L${lighthouseX + 6} 78 Z`} fill="var(--plate-solid)" />
          <rect x={lighthouseX - 4} y="34" width="8" height="8" />
          <path d={`M${lighthouseX - 5} 34 L${lighthouseX} 29 L${lighthouseX + 5} 34`} />
          <rect x={pensionX} y="42" width="76" height="50" fill="var(--plate-solid)" />
          <path d={`M${pensionX - 6} 43 L${pensionX + 38} 24 L${pensionX + 82} 43`} />
        </>,
      )}
      {lit(
        <>
          <rect x={lighthouseX - 3} y="35" width="6" height="6" />
          <path d={`M${lighthouseX - 3} 37 L${lighthouseX - 58} 30 L${lighthouseX - 58} 44 Z`} opacity="0.4" />
          {windows}
        </>,
      )}
      {accentAt && halo(accentAt.x + 6, accentAt.y + 4, 24, glow)}
      {accentAt && mark(<rect x={accentAt.x} y={accentAt.y} width="12" height="9" fill={accent} />)}
      {near(
        <>
          <rect x="-4" y="106" width="328" height="30" />
          <line x1="0" y1="96" x2="320" y2="96" />
          {[24, 104, 184, 264].map((post) => (
            <line key={`post-${post}`} x1={post} y1="96" x2={post} y2="106" />
          ))}
        </>,
      )}
      {people(figure("shore", Math.round(span(random, 146, 206)), 108, 42))}
    </>
  );
}

/**
 * A white wall of framed canvases under track lights, one of them lit hotter
 * than the rest, and someone standing in front of it. The lit canvas is the
 * accent; the other spots only wash the wall.
 */
function paintGallery(random, accent, glow) {
  const count = Math.round(span(random, 3, 4.99));
  const litFrame = Math.floor(random() * count);
  const slot = 300 / count;
  const frames = [];
  const art = [];
  const spots = [];
  let hung = null;
  for (let index = 0; index < count; index += 1) {
    const width = Math.round(span(random, 40, Math.min(66, slot - 14)));
    const height = Math.round(span(random, 32, 50));
    const x = Math.round(10 + slot * index + (slot - width) / 2);
    const y = Math.round(58 - height / 2 - 2);
    const cx = x + width / 2;
    frames.push(<rect key={`frame-${index}`} x={x} y={y} width={width} height={height} />);
    frames.push(<rect key={`mat-${index}`} x={x + 4} y={y + 4} width={width - 8} height={height - 8} />);
    spots.push(<path key={`spot-${index}`} d={`M${cx - 3} 14 L${cx - width * 0.62} ${y + height + 8} H${cx + width * 0.62} L${cx + 3} 14 Z`} />);
    if (index === litFrame) {
      hung = { x: x + 4, y: y + 4, w: width - 8, h: height - 8 };
      continue;
    }
    // Something on each canvas, in the far weight, so a frame is a painting
    // rather than an empty box.
    if (random() > 0.5) art.push(<circle key={`art-${index}`} cx={cx} cy={y + height / 2} r={Math.min(width, height) * 0.2} />);
    else art.push(<path key={`art-${index}`} d={`M${x + 8} ${y + height - 10} L${cx} ${y + 12} L${x + width - 8} ${y + height - 10}`} />);
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="10" x2="320" y2="10" />
          <line x1="0" y1="96" x2="320" y2="96" />
          {art}
        </>,
      )}
      <g fill="var(--plate-ambient)" stroke="none" opacity="0.12">
        {spots}
      </g>
      {mid(
        <>
          <line x1="6" y1="14" x2="314" y2="14" />
          {frames}
        </>,
      )}
      {hung && halo(hung.x + hung.w / 2, hung.y + hung.h / 2, Math.max(hung.w, hung.h) * 0.9, glow)}
      {hung && mark(<rect x={hung.x} y={hung.y} width={hung.w} height={hung.h} fill={accent} opacity="0.55" />)}
      {near(
        <>
          <path d="M-4 132 L22 104 H298 L324 132 Z" />
          <rect x="118" y="112" width="84" height="7" />
        </>,
      )}
      {people(
        <>
          {figure("viewer", hung ? Math.round(hung.x + hung.w / 2 + span(random, -8, 8)) : 160, 110, 42)}
          {random() > 0.45 && figure("guest", Math.round(span(random, 24, 60)), 104, 30)}
        </>,
      )}
    </>
  );
}

/**
 * The back of a car. Two headrests fill the bottom of the frame, the windscreen
 * runs away to a road whose lights are drawn as streaks rather than lamps, and
 * the fare meter on the dash is the one lit thing -- which is the right accent,
 * because in this season a taxi is always somebody paying to leave a building
 * faster than they are allowed to.
 */
function paintTransit(random, accent, glow) {
  const streaks = [];
  for (let streak = 0; streak < 9; streak += 1) {
    const y = span(random, 16, 52);
    const x = span(random, 30, 250);
    const length = span(random, 14, 44);
    streaks.push(<line key={`streak-${streak}`} x1={round(x)} y1={round(y)} x2={round(x + length)} y2={round(y + length * 0.12)} />);
  }
  const meterX = Math.round(span(random, 176, 214));
  return (
    <>
      {far(
        <>
          <line x1="0" y1="58" x2="320" y2="58" />
          <path d="M40 14 H280 L262 58 H58 Z" />
        </>,
      )}
      {lit(streaks)}
      {mid(
        <>
          {/* The dash, and the mirror the driver watches the passenger in. */}
          <path d="M28 62 H292 L282 78 H38 Z" />
          <rect x="138" y="20" width="44" height="11" />
          <line x1="160" y1="31" x2="160" y2="38" />
        </>,
      )}
      {halo(meterX + 9, 68, 22, glow)}
      {mark(<rect x={meterX} y="64" width="18" height="9" fill={accent} />)}
      {near(
        <>
          {/* Two headrests: the driver, and the seat the analyst is not in. */}
          <path d="M-4 132 V96 Q-4 84 22 84 H82 Q108 84 108 96 V132 Z" />
          <path d="M196 132 V92 Q196 80 222 80 H286 Q312 80 312 92 V132 Z" />
          <line x1="150" y1="78" x2="150" y2="132" />
        </>,
      )}
      {people(figure("driver", 54, 92, 26))}
    </>
  );
}

/**
 * Books stacked the way a second-hand shop stacks them -- spines in uneven
 * columns, a leaning pile on the floor, a stepladder nobody has folded -- with
 * one ledger open on top of the pile under a bare bulb. The archive motif is
 * boxes in perspective and reads as an institution filing things; this is the
 * opposite room, where the record survived because somebody would not throw it
 * away, and 임경수's 4년 of keeping the paper copy is that room.
 */
function paintBookshop(random, accent, glow) {
  const spines = [];
  for (let column = 0; column < 9; column += 1) {
    const x = 8 + column * 34;
    let y = 96;
    while (y > span(random, 18, 42)) {
      const height = Math.round(span(random, 6, 13));
      const width = Math.round(span(random, 18, 30));
      spines.push(<rect key={`spine-${column}-${y}`} x={x} y={y - height} width={width} height={height} />);
      y -= height + 1;
    }
  }
  const pileX = Math.round(span(random, 206, 244));
  const bulbX = Math.round(span(random, 104, 152));
  return (
    <>
      {far(<line x1="0" y1="14" x2="320" y2="14" />)}
      {mid(spines)}
      {lit(<circle cx={bulbX} cy="22" r="4" />)}
      {mid(<line x1={bulbX} y1="0" x2={bulbX} y2="18" />)}
      {halo(bulbX, 22, 30, glow)}
      {near(
        <>
          {/* The leaning pile, and the ladder left where it was last climbed. */}
          <path d={`M${pileX} 132 V104 L${pileX + 44} 100 V132 Z`} />
          <line x1="44" y1="132" x2="58" y2="96" />
          <line x1="76" y1="132" x2="66" y2="96" />
          {[104, 114, 124].map((rung) => (
            <line key={`rung-${rung}`} x1={50 + (132 - rung) * 0.34} y1={rung} x2={74 - (132 - rung) * 0.24} y2={rung} />
          ))}
        </>,
      )}
      {halo(pileX + 22, 100, 22, glow)}
      {mark(<rect x={pileX + 6} y="94" width="32" height="8" fill={accent} />)}
      {people(figure("keeper", Math.round(span(random, 140, 178)), 126, 44))}
    </>
  );
}

/**
 * A café before it is properly open: a window wall with the street still dark
 * behind it, two small round tables, and the machine behind the counter already
 * lit. 사건 09 writes its ledger here at dawn, so the room has to read as the
 * one place in the season where two people sit down without a building around
 * them -- small furniture, a lot of glass, and nobody else in yet.
 */
function paintCafe(random, accent, glow) {
  const mullions = [];
  for (let bay = 1; bay < 5; bay += 1) {
    mullions.push(<line key={`mullion-${bay}`} x1={bay * 64} y1="8" x2={bay * 64} y2="74" />);
  }
  const tableX = Math.round(span(random, 168, 206));
  const machineX = Math.round(span(random, 22, 48));
  return (
    <>
      {far(
        <>
          <line x1="0" y1="8" x2="320" y2="8" />
          <line x1="0" y1="74" x2="320" y2="74" />
          {mullions}
        </>,
      )}
      {mid(
        <>
          {/* The counter, and the shelf of cups behind it. */}
          <path d="M-4 96 H92 V74 H-4 Z" />
          <rect x={machineX} y="56" width="26" height="18" />
          {/* Two tables: one the scene sits at, one nobody is at yet. */}
          <line x1={tableX} y1="112" x2={tableX} y2="94" />
          <ellipse cx={tableX} cy="92" rx="26" ry="6" />
          <line x1="128" y1="104" x2="128" y2="90" />
          <ellipse cx="128" cy="88" rx="18" ry="4.5" />
        </>,
      )}
      {halo(machineX + 13, 62, 26, glow)}
      {mark(<rect x={machineX + 4} y="58" width="18" height="8" fill={accent} />)}
      {near(
        <>
          <line x1="0" y1="118" x2="320" y2="118" />
          <path d="M-4 118 H324 V132 H-4 Z" />
        </>,
      )}
      {people(
        <>
          {seated("ledger-a", tableX - 24, 100, 30)}
          {seated("ledger-b", tableX + 24, 100, 30)}
        </>,
      )}
    </>
  );
}

/**
 * One bed, its rail up, a drip stand, a chair pulled close, and a window with
 * the afternoon in it. Everything is low and horizontal: no perspective running
 * away, no wall of screens, nothing converging. The season's other rooms are
 * built to make a decision feel urgent, and this one is built so that it cannot
 * -- which is the point of the room where the bill for all that urgency is paid.
 */
function paintWard(random, accent, glow) {
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

/**
 * The ground floor of a building you are being let into or kept out of: glass
 * front, a long reception desk, a row of gates, and the company's name lit on
 * the wall behind it. The lit sign is the accent because a lobby is the one room
 * in this season whose entire function is to state whose building this is.
 */
function paintLobby(random, accent, glow) {
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


/**
 * Light that happens *to* the room rather than being part of it. Every one of
 * these is a fact the scene already states (see `getScenePlate`): a room the
 * public is watching goes off in camera flashes, open sky by day comes in as
 * slanted rays, and a night under pressure outdoors gets its storm. Positions
 * and timing are seeded, so a scene flashes in the same places every time, and
 * with motion reduced the flashes and the lightning are simply not drawn.
 */
function paintFx(random, plate, id) {
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

/**
 * A 국정감사 room: the members' dais curving across the back wall with a
 * nameplate at every seat, cameras on tripods at both sides, and the witness
 * table in front. The accent is the chair nobody sat in -- the one the season
 * has been walking toward -- lit where the witness should be.
 */
function paintChamber(random, accent, glow) {
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

/**
 * A newsroom at night: a wall of monitors with the breaking-news ticker running
 * under it, two rows of desks with their own screens, reporters bent over them,
 * and the office cat asleep on the nearest keyboard. The ticker is the accent:
 * it is what the room exists to put out.
 */
function paintNewsroom(random, accent, glow) {
  const screens = [];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      screens.push(<rect key={`wall-${row}-${col}`} x={88 + col * 37} y={10 + row * 20} width="33" height="17" />);
    }
  }
  const desks = [];
  const reporters = [];
  for (let desk = 0; desk < 4; desk += 1) {
    const x = Math.round(30 + desk * 72 + span(random, -6, 6));
    desks.push(<rect key={`desk-${desk}`} x={x} y="84" width="46" height="6" />);
    desks.push(<rect key={`mon-${desk}`} x={x + 12} y="70" width="20" height="13" />);
    if (desk !== 2 || random() < 0.5) reporters.push(seated(`r-${desk}`, x + 22, 88, 20));
  }
  return (
    <>
      {far(
        <>
          <line x1="0" y1="56" x2="320" y2="56" />
          <rect x="8" y="12" width="60" height="36" />
          <rect x="252" y="12" width="60" height="36" />
        </>,
      )}
      {halo(160, 54, 70, glow)}
      {mid(
        <>
          {screens}
          {desks}
        </>,
      )}
      {lit(
        <>
          <rect x="92" y="14" width="25" height="9" />
          <rect x="166" y="34" width="25" height="9" />
        </>,
      )}
      {mark(<rect x="84" y="51" width="156" height="7" fill={accent} stroke="none" />)}
      {people(reporters)}
      {near(
        <>
          <path d="M-4 108 H324 V132 H-4 Z" />
          {/* The office cat, asleep on the front desk. */}
          <path d="M248 108 q0 -9 11 -9 q10 0 11 9 Z" />
          <path d="M252 101 l2 -5 l3 4 M262 100 l3 -4 l2 5" />
        </>,
      )}
    </>
  );
}

const MOTIF_PAINTERS = {
  transit: paintTransit,
  bookshop: paintBookshop,
  cafe: paintCafe,
  ward: paintWard,
  lobby: paintLobby,
  coast: paintCoast,
  gallery: paintGallery,
  skyline: paintSkyline,
  street: paintStreet,
  floor: paintFloor,
  control: paintControl,
  archive: paintArchive,
  corridor: paintCorridor,
  hall: paintHall,
  chamber: paintChamber,
  newsroom: paintNewsroom,
  counter: paintCounter,
  desk: paintDesk,
};
