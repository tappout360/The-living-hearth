import type { AudioAtmosphereProfile } from '../types';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscNodes: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private isRunning: boolean = false;
  private targetVolume: number = 0.35;
  private currentProfile: AudioAtmosphereProfile = 'contemplative';

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.targetVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start(profile: AudioAtmosphereProfile = 'contemplative', volume: number = 0.35) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.targetVolume = volume;
    this.currentProfile = profile;
    this.stopNodes();

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 2.5); // Gentle fade-in

    // Filter for all tones to keep sounds soft, warm, and low-frequency
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(profile === 'study' ? 650 : 380, now);
    this.filterNode.Q.setValueAtTime(1.2, now);
    this.filterNode.connect(this.masterGain);

    if (profile === 'nature') {
      this.buildNatureAmbience(now);
    } else {
      this.buildHarmonicDrone(profile, now);
    }

    this.isRunning = true;
  }

  private buildHarmonicDrone(profile: AudioAtmosphereProfile, now: number) {
    if (!this.ctx || !this.filterNode) return;

    // Sacred geometric tuning frequencies (based on contemplative 108Hz / 136.1Hz Om / 216Hz)
    let baseFreq = 108; // Deep contemplative fundamental
    let secondFreq = 162; // Perfect fifth
    let thirdFreq = 216; // Octave

    if (profile === 'study') {
      baseFreq = 144;
      secondFreq = 216;
      thirdFreq = 288;
    } else if (profile === 'luminous') {
      baseFreq = 120;
      secondFreq = 180;
      thirdFreq = 240;
    } else if (profile === 'interfaith') {
      baseFreq = 112;
      secondFreq = 168;
      thirdFreq = 224;
    }

    const freqs = [baseFreq, secondFreq, thirdFreq];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.filterNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      // Subtle detune for breath-like natural chorus
      osc.frequency.setValueAtTime(freq + (idx * 0.35), now);

      const amp = idx === 0 ? 0.35 : 0.18 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);

      this.oscNodes.push(osc);
      this.gainNodes.push(gain);
    });
  }

  private buildNatureAmbience(now: number) {
    if (!this.ctx || !this.filterNode) return;

    // Generate 3 seconds of pink noise buffer for soft rustling wind / distant rain texture
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);

    noiseSource.connect(noiseGain);
    noiseGain.connect(this.filterNode);
    noiseSource.start(now);

    this.noiseNode = noiseSource;
    this.gainNodes.push(noiseGain);

    // Warm underlying drone
    this.buildHarmonicDrone('contemplative', now);
  }

  public setVolume(volume: number) {
    this.targetVolume = volume;
    if (this.ctx && this.masterGain && this.isRunning) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(volume, now + 0.3);
    }
  }

  public fadeForInteraction(isDucking: boolean) {
    if (!this.ctx || !this.masterGain || !this.isRunning) return;
    const now = this.ctx.currentTime;
    const currentTarget = isDucking ? this.targetVolume * 0.25 : this.targetVolume;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(currentTarget, now + 0.6);
  }

  public switchProfile(profile: AudioAtmosphereProfile) {
    if (this.isRunning) {
      this.start(profile, this.targetVolume);
    } else {
      this.currentProfile = profile;
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 1.2);

    setTimeout(() => {
      this.stopNodes();
      this.isRunning = false;
    }, 1300);
  }

  private stopNodes() {
    this.oscNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.oscNodes = [];

    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }

    this.gainNodes.forEach((node) => {
      try {
        node.disconnect();
      } catch (e) {}
    });
    this.gainNodes = [];
  }

  public getStatus() {
    return {
      isPlaying: this.isRunning,
      currentProfile: this.currentProfile,
      volume: this.targetVolume,
    };
  }
}

export const ambientAudio = new AmbientAudioEngine();
