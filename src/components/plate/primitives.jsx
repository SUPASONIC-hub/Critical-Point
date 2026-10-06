/**
 * What every room is drawn from: the depth planes, the people, the halo and the
 * one lit mark. Every motif under `motifs/` builds from these, which is what
 * makes thirty-one rooms read as one hand (see `ScenePlate.jsx`).
 */
export function round(value) {
  return Math.round(value * 10) / 10;
}

/** Jitter helper: a value in [min, max) from the scene's own generator. */
export function span(random, min, max) {
  return min + random() * (max - min);
}

/** The far plane drifts a few pixels over half a minute against the rest. */
export function far(children) {
  return (
    <g className="gx-plate-far" stroke="var(--plate-far)" fill="none" strokeWidth="1">
      {children}
    </g>
  );
}

export function mid(children) {
  return <g stroke="var(--plate-mid)" fill="none" strokeWidth="1.4">{children}</g>;
}

/** The near plane sways a pixel or two against the far one, so the room has depth. */
export function near(children) {
  return (
    <g className="gx-plate-near" stroke="var(--plate-near)" fill="var(--plate-solid)" strokeWidth="1.6">
      {children}
    </g>
  );
}

/** The ambient light of the building, used for anything lit but not important. */
export function lit(children) {
  return <g fill="var(--plate-ambient)" stroke="none" opacity="0.42">{children}</g>;
}

/** The people in the room, as silhouettes on the near plane. */
export function people(children) {
  return <g fill="var(--plate-figure)" stroke="var(--plate-near)" strokeWidth="1.1">{children}</g>;
}

/**
 * One standing person. Head, shoulders, a body that tapers -- at 30px tall that
 * is every mark needed for the eye to read "someone is in this room", and the
 * room stops being an architectural drawing.
 */
export function figure(key, x, baseY, height) {
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
export function seated(key, x, baseY, height) {
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
export function halo(cx, cy, r, paint) {
  return <circle className="gx-plate-halo" cx={cx} cy={cy} r={r} fill={paint} />;
}

/** The one lit thing the room is for. Its light is live, so it flickers. */
export function mark(children) {
  return <g className="gx-plate-accent">{children}</g>;
}
