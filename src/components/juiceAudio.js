import { acquireCueRuntime } from "./AdaptiveMusic.jsx";

/**
 * The decision window's short cues: the heartbeat, the threshold sting, and the
 * two touch sounds on anything carrying `data-juice`.
 *
 * These used to run on a private `AudioContext` and a pool of six oscillators
 * left running for the life of the page, which cost them both correctness and
 * fidelity. Correctness, because nothing here read the mute toggle or the volume
 * preset -- `배경음 끄기` stopped the score and the heartbeat kept going. And
 * fidelity, because a pooled oscillator can only be re-pitched, never re-voiced:
 * every cue was the same sine with a different ramp on it, and a heartbeat that
 * is one sine is a beep.
 *
 * The mixer below keeps a tiny pool of reusable voice lanes per AudioContext.
 * Oscillators are still one-shot nodes, because Web Audio does not allow a
 * stopped oscillator to be restarted, but every cue lands in a recycled gain /
 * filter lane with its own busy clock. That gives rapid clicks, hovers and
 * threshold hits somewhere stable to mix without opening another context or
 * allocating a fresh bus for each gesture.
 */

const PEAK_GAIN = { heartbeat: 0.055, threshold: 0.045, click: 0.025, hover: 0.018 };
const POOL_SIZE = 12;
const cuePools = new WeakMap();

/**
 * Stress raises pitch and bite, never level. The loudness of the window is the
 * player's setting; what rising pressure is allowed to change is the colour, so
 * a tense run sounds tighter rather than simply louder.
 */
function stressTuning(stress) {
  const normalized = Math.min(1, Math.max(0, stress / 100));
  return { normalized, pitch: 1 + normalized * 0.52, bite: 0.4 + normalized * 0.75 };
}

function getCuePool(runtime) {
  const { context, destination } = runtime;
  let pool = cuePools.get(context);
  if (pool?.destination === destination) return pool;

  pool = {
    cursor: 0,
    destination,
    lanes: Array.from({ length: POOL_SIZE }, () => {
      const laneGain = context.createGain();
      laneGain.gain.value = 1;
      laneGain.connect(destination);
      return { busyUntil: 0, input: laneGain };
    }),
  };
  cuePools.set(context, pool);
  return pool;
}

function acquireLane(runtime, duration = 0.2) {
  const { context } = runtime;
  const pool = getCuePool(runtime);
  const now = context.currentTime;
  let lane = pool.lanes.find((candidate) => candidate.busyUntil <= now);
  if (!lane) {
    lane = pool.lanes[pool.cursor % pool.lanes.length];
    pool.cursor += 1;
  }
  lane.busyUntil = now + duration;
  return lane.input;
}

function playHeartbeat(runtime, stress) {
  const { context, multiplier } = runtime;
  const destination = acquireLane(runtime, 0.42);
  const { normalized, pitch } = stressTuning(stress);
  const now = context.currentTime;
  const peak = PEAK_GAIN.heartbeat * multiplier;

  // Lub-dub: two transients, the second quieter and a fifth of a second behind.
  // One thump is a kick drum; the gap is the part the ear reads as a pulse.
  for (const [index, [offset, level]] of [
    [0, 1],
    [0.19 - normalized * 0.05, 0.62],
  ].entries()) {
    const start = now + offset;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const body = context.createBiquadFilter();

    body.type = "lowpass";
    body.frequency.setValueAtTime(220 + normalized * 180, start);
    oscillator.type = "sine";
    // The pitch falls through the hit. A steady tone reads as a note; a tone
    // that drops an octave in eighty milliseconds reads as something struck.
    oscillator.frequency.setValueAtTime(96 * pitch, start);
    oscillator.frequency.exponentialRampToValueAtTime(38 * pitch, start + 0.08 + index * 0.01);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak * level, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

    oscillator.connect(body);
    body.connect(gain);
    gain.connect(destination);
    oscillator.start(start);
    oscillator.stop(start + 0.18);
  }
}

function playThreshold(runtime, stress) {
  const { context, multiplier } = runtime;
  const destination = acquireLane(runtime, 0.48);
  const { normalized, pitch, bite } = stressTuning(stress);
  const now = context.currentTime;
  const peak = PEAK_GAIN.threshold * multiplier;

  // Two detuned saws through a sweeping bandpass: the crossing of a threshold
  // should sound like something narrowing, not like a chime.
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.setValueAtTime(6 + bite * 8, now);
  filter.frequency.setValueAtTime(420 * pitch, now);
  filter.frequency.exponentialRampToValueAtTime((1650 + normalized * 720) * pitch, now + 0.22);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.014);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

  filter.connect(gain);
  gain.connect(destination);

  for (const detune of [-7, 7]) {
    const oscillator = context.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(174.61 * pitch, now);
    oscillator.detune.setValueAtTime(detune, now);
    oscillator.connect(filter);
    oscillator.start(now);
    oscillator.stop(now + 0.32);
  }
}

function playTouch(runtime, kind, stress) {
  const { context, multiplier } = runtime;
  const destination = acquireLane(runtime, kind === "click" ? 0.18 : 0.12);
  const { pitch, bite } = stressTuning(stress);
  const now = context.currentTime;
  const peak = PEAK_GAIN[kind] * multiplier;
  const isClick = kind === "click";

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  filter.type = isClick ? "lowpass" : "highpass";
  filter.frequency.setValueAtTime(isClick ? 900 + bite * 700 : 1400, now);

  oscillator.type = isClick ? "square" : "sine";
  oscillator.frequency.setValueAtTime((isClick ? 220 : 880) * pitch, now);
  oscillator.frequency.exponentialRampToValueAtTime((isClick ? 110 : 1180) * pitch, now + (isClick ? 0.07 : 0.05));

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (isClick ? 0.11 : 0.07));

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  oscillator.start(now);
  oscillator.stop(now + 0.13);
}

/**
 * `kind` is one of heartbeat, threshold, click, hover. `stress` is the reducer's
 * published pressure, 0-100, and only ever changes the voicing -- see
 * `stressTuning`.
 */
export function playJuiceCue(kind, stress = 0) {
  const runtime = acquireCueRuntime();
  if (!runtime) return;
  try {
    if (kind === "heartbeat") playHeartbeat(runtime, stress);
    else if (kind === "threshold") playThreshold(runtime, stress);
    else playTouch(runtime, kind === "click" ? "click" : "hover", stress);
  } catch {
    // Audio is an enhancement; browsers may reject it during a gesture.
  }
}
