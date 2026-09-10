let context;
let voices = [];
let cursor = 0;

function getPool() {
  if (typeof window === "undefined" || !window.AudioContext) return null;
  if (context) return { context, voices };
  context = new window.AudioContext();
  voices = Array.from({ length: 6 }, () => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    gain.gain.value = 0;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    return { oscillator, gain };
  });
  return { context, voices };
}

export function playJuiceCue(kind, stress = 0) {
  const pool = getPool();
  if (!pool) return;
  const now = pool.context.currentTime;
  if (pool.context.state === "suspended") pool.context.resume().catch(() => {});
  const voice = pool.voices[cursor++ % pool.voices.length];
  const base = kind === "threshold" ? 360 : kind === "click" ? 240 : 180;
  const pitch = base + stress * 2.2;
  voice.oscillator.type = kind === "threshold" ? "triangle" : "sine";
  voice.oscillator.frequency.cancelScheduledValues(now);
  voice.oscillator.frequency.setValueAtTime(pitch, now);
  voice.oscillator.frequency.linearRampToValueAtTime(pitch + (kind === "threshold" ? 150 : 35), now + 0.08);
  voice.gain.gain.cancelScheduledValues(now);
  voice.gain.gain.setValueAtTime(0.0001, now);
  voice.gain.gain.exponentialRampToValueAtTime(kind === "threshold" ? 0.045 : 0.025, now + 0.008);
  voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "threshold" ? 0.24 : 0.1));
}
