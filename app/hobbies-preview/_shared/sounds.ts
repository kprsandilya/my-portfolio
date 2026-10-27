// Tiny Web Audio synths so "play violin" and "play piano" make a sound
// without loading any audio files.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

const NOTE: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, "F#4": 369.99, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, "F#5": 739.99, G5: 783.99, A5: 880.0,
};

// Bowed string: sawtooth through a low-pass filter, slow attack, vibrato.
function violinNote(ac: AudioContext, freq: number, at: number, length: number) {
  const osc = ac.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, at);

  const vibrato = ac.createOscillator();
  const vibratoDepth = ac.createGain();
  vibrato.frequency.value = 5.5;
  vibratoDepth.gain.value = freq * 0.006;
  vibrato.connect(vibratoDepth).connect(osc.frequency);

  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2600;
  filter.Q.value = 1.5;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(0.12, at + 0.12);
  gain.gain.setValueAtTime(0.12, at + length - 0.12);
  gain.gain.linearRampToValueAtTime(0, at + length);

  osc.connect(filter).connect(gain).connect(ac.destination);
  osc.start(at);
  vibrato.start(at);
  osc.stop(at + length + 0.05);
  vibrato.stop(at + length + 0.05);
}

// Struck string: triangle plus a quiet octave, fast attack, long decay.
function pianoNote(ac: AudioContext, freq: number, at: number) {
  [1, 2].forEach((mult, i) => {
    const osc = ac.createOscillator();
    osc.type = i === 0 ? "triangle" : "sine";
    osc.frequency.value = freq * mult;
    const gain = ac.createGain();
    const peak = i === 0 ? 0.18 : 0.05;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(peak, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.4);
    osc.connect(gain).connect(ac.destination);
    osc.start(at);
    osc.stop(at + 1.5);
  });
}

export function playViolin() {
  const ac = audio();
  if (!ac) return false;
  const t = ac.currentTime + 0.05;
  // A short D-major phrase.
  (["D5", "F#5", "A5", "F#5", "D5"] as const).forEach((n, i) => violinNote(ac, NOTE[n], t + i * 0.42, 0.45));
  return true;
}

export function playPiano() {
  const ac = audio();
  if (!ac) return false;
  const t = ac.currentTime + 0.05;
  // C-major arpeggio and chord.
  (["C4", "E4", "G4", "C5"] as const).forEach((n, i) => pianoNote(ac, NOTE[n], t + i * 0.22));
  (["C4", "E4", "G4"] as const).forEach((n) => pianoNote(ac, NOTE[n], t + 0.95));
  return true;
}
