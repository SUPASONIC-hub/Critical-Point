// A7 draft: a transparent peak limiter at the very end of the music path,
// master (mode volume x preset, mute) -> limiter -> destination. Cues that go
// straight to `destination` (the opening accent, the table's sounds) stay off
// it, as #388 laid out. At normal levels it does nothing: the threshold sits
// near full scale, so it only catches peaks. No gain is ever set here.
export const MUSIC_LIMITER_ON = true;

export const LIMITER_SETTINGS = Object.freeze({
  threshold: -3,
  knee: 3,
  ratio: 20,
  attack: 0.001,
  release: 0.1,
});

/** Builds the limiter and returns the node `master` should connect to. */
export function createMusicLimiter(context) {
  const limiter = context.createDynamicsCompressor();
  for (const [name, value] of Object.entries(LIMITER_SETTINGS)) limiter[name].value = value;
  limiter.connect(context.destination);
  return limiter;
}

/** Routes `master` through `limiter` when `on`, else straight to destination. */
export function routeMaster(context, master, limiter, on) {
  try {
    master.disconnect();
  } catch {
    /* not connected yet */
  }
  master.connect(on && limiter ? limiter : context.destination);
}
