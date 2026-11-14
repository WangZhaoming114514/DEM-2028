class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private tone(freq: number, duration: number, type: OscillatorType = 'sine', gainPeak = 0.08, delay = 0) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick() {
    this.tone(540, 0.06, 'triangle', 0.05);
  }

  public playTweetSend() {
    this.tone(587.33, 0.09, 'triangle', 0.07, 0);
    this.tone(880, 0.14, 'sine', 0.07, 0.06);
  }

  public playViralHit() {
    this.tone(440, 0.08, 'sawtooth', 0.05, 0);
    this.tone(659.25, 0.12, 'triangle', 0.07, 0.05);
    this.tone(987.77, 0.2, 'sine', 0.08, 0.11);
  }

  public playBreakingNews() {
    this.tone(220, 0.12, 'square', 0.04, 0);
    this.tone(220, 0.12, 'square', 0.04, 0.14);
    this.tone(330, 0.22, 'sawtooth', 0.05, 0.28);
  }

  public playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.tone(n, 0.24, 'triangle', 0.08, idx * 0.1);
    });
  }

  public playDefeat() {
    const notes = [392.0, 369.99, 349.23, 293.66];
    notes.forEach((n, idx) => {
      this.tone(n, 0.28, 'sawtooth', 0.05, idx * 0.14);
    });
  }
}

export const soundEngine = new SoundEngine();
