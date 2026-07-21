// Real-time acoustic synthesis of S.T. Dupont style lighter sounds using browser Web Audio API
// This allows zero-dependency, lag-free premium sound effects that match each metal's unique physics!

let audioCtx: AudioContext | null = null;
let isMuted = typeof window !== "undefined" ? localStorage.getItem("flint_audio_muted") === "true" : false;

export function getMuteState(): boolean {
  return isMuted;
}

export function setMuteState(muted: boolean) {
  isMuted = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("flint_audio_muted", String(muted));
  }
}

function getAudioContext() {
  if (isMuted) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playLidSound(finishId: "gold" | "obsidian" | "silver" | "emerald" | "damascus", action: "open" | "close") {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (action === "close") {
      // Satisfying heavy latch metallic thud/click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      // Add a higher click overtone
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = "triangle";
      clickOsc.frequency.setValueAtTime(1200, now);
      clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

      clickGain.gain.setValueAtTime(0.15, now);
      clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
      clickOsc.start(now);
      clickOsc.stop(now + 0.06);
      return;
    }

    // Action is "OPEN" - The legendary resonant "PING" or click
    // Adjust sound physics based on the selected material finish!
    let baseFreq = 1420; // Classic gold resonant freq
    let decayTime = 2.2;  // Long resonant ring
    let harmonicVolume = 0.08;
    let clickIntensity = 0.2;

    switch (finishId) {
      case "gold":
        baseFreq = 1420;
        decayTime = 2.4;
        harmonicVolume = 0.12;
        clickIntensity = 0.25;
        break;
      case "silver":
        baseFreq = 1550; // Sterling silver rings slightly higher pitch
        decayTime = 1.9;
        harmonicVolume = 0.10;
        clickIntensity = 0.22;
        break;
      case "emerald":
        // Urushi lacquer dampens resonance slightly, yielding a deeper, warmer tone
        baseFreq = 1100;
        decayTime = 0.8;
        harmonicVolume = 0.04;
        clickIntensity = 0.15;
        break;
      case "damascus":
        baseFreq = 1250;
        decayTime = 1.2;
        harmonicVolume = 0.06;
        clickIntensity = 0.18;
        break;
      case "obsidian":
        // Titanium is highly dampened/matte, creating a fast modern click rather than a singing ring
        baseFreq = 1050;
        decayTime = 0.18;
        harmonicVolume = 0.01;
        clickIntensity = 0.3;
        break;
    }

    // 1. Primary Resonator (Sine wave representing pure resonance)
    const primaryOsc = ctx.createOscillator();
    const primaryGain = ctx.createGain();
    primaryOsc.type = "sine";
    primaryOsc.frequency.setValueAtTime(baseFreq, now);

    primaryGain.gain.setValueAtTime(0.001, now);
    // Instant attack
    primaryGain.gain.exponentialRampToValueAtTime(0.35, now + 0.005);
    // Long exponential decay
    primaryGain.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

    // 2. High Metallic Latch Overtone (creating that clear crystalline shimmer)
    const harmonicOsc = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonicOsc.type = "sine";
    harmonicOsc.frequency.setValueAtTime(baseFreq * 1.58, now); // Non-harmonic metallics

    harmonicGain.gain.setValueAtTime(0.001, now);
    harmonicGain.gain.exponentialRampToValueAtTime(harmonicVolume, now + 0.005);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + (decayTime * 0.4));

    // 3. The initial friction strike (noise-like transient)
    const strikeOsc = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strikeOsc.type = "triangle";
    strikeOsc.frequency.setValueAtTime(3200, now);
    strikeOsc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

    strikeGain.gain.setValueAtTime(clickIntensity, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    // Connecting modules
    primaryOsc.connect(primaryGain);
    primaryGain.connect(ctx.destination);

    harmonicOsc.connect(harmonicGain);
    harmonicGain.connect(ctx.destination);

    strikeOsc.connect(strikeGain);
    strikeGain.connect(ctx.destination);

    // Start schedules
    primaryOsc.start(now);
    primaryOsc.stop(now + decayTime + 0.1);

    harmonicOsc.start(now);
    harmonicOsc.stop(now + decayTime + 0.1);

    strikeOsc.start(now);
    strikeOsc.stop(now + 0.1);
  } catch (err) {
    console.warn("Web Audio API is suspended or blocked by user gesture:", err);
  }
}

export function playSparkSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Synthesize the sudden, abrasive friction-wheel spark sound "Sshh-chik"
    const bufferSize = ctx.sampleRate * 0.08; // 80ms of friction noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Populate with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Apply high-pass filter to make it sound like a tight hiss
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(3000, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start(now);
    noiseNode.stop(now + 0.08);

    // Adding a small bass thud representing the roller tension release
    const lowOsc = ctx.createOscillator();
    const lowGain = ctx.createGain();
    lowOsc.type = "sine";
    lowOsc.frequency.setValueAtTime(150, now);
    lowOsc.frequency.exponentialRampToValueAtTime(30, now + 0.04);
    lowGain.gain.setValueAtTime(0.12, now);
    lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    lowOsc.connect(lowGain);
    lowGain.connect(ctx.destination);
    
    lowOsc.start(now);
    lowOsc.stop(now + 0.05);
  } catch (err) {
    console.warn("Audio Context unavailable:", err);
  }
}

export function playFlameSound(isLit: boolean) {
  // Can play a continuous low ambient rumble, but to keep performance pristine we can leave it silent,
  // or trigger a subtle 'whoosh' on ignition.
  if (!isLit || isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.3);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {}
}
