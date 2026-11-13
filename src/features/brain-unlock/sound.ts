// Small success sounds for Brain Unlock, made with Web Audio (no files to
// download) and a light vibration. Soft and short; never on a wrong answer.
// Mute is remembered for this browser (a convenience only).

const MUTE_KEY = "bu_muted";
let ctx: AudioContext | null = null;

export function loadMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveMuted(muted: boolean): void {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    // not remembered — fine
  }
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (Ctor === undefined) return null;
    ctx ??= new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  duration: number,
  volume: number,
): void {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, c.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, c.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    c.currentTime + start + duration,
  );
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration + 0.05);
}

/** "tap" = a tiny tick for a right tap; "win" = a short rising chime for an unlock. */
export function playSfx(kind: "tap" | "win", muted: boolean): void {
  if (muted) return;
  const c = audio();
  if (c === null) return;
  if (kind === "tap") tone(c, 880, 0, 0.08, 0.05);
  else
    [523, 659, 784, 1047].forEach((f, i) => tone(c, f, i * 0.09, 0.28, 0.08));
  try {
    if (kind === "win") navigator.vibrate?.(40);
  } catch {
    // no vibration — fine
  }
}
