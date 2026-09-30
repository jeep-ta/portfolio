import type { SoundProfile } from '../types';

// Web Audio API Synthesizer for Retro Mechanical OS Sound Effects

export interface AudioTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  startTime: number;
  duration: number;
}

export const AUDIO_PLAYLIST: AudioTrack[] = [
  { id: 1, title: 'Midnight Terminal (Lo-Fi House)', artist: 'Jeptha // OS Sound', album: 'Workstation Sessions Vol. 1', startTime: 0, duration: 195 },
  { id: 2, title: 'Cyber Sunset // Neon Dreams', artist: 'Jeptha // OS Sound', album: 'Workstation Sessions Vol. 1', startTime: 195, duration: 210 },
  { id: 3, title: 'Subsurface Echoes (Chill Mix)', artist: 'Jeptha // OS Sound', album: 'Workstation Sessions Vol. 1', startTime: 405, duration: 215 },
  { id: 4, title: 'Kernel Space Reverie', artist: 'Jeptha // OS Sound', album: 'Workstation Sessions Vol. 1', startTime: 620, duration: 220 },
  { id: 5, title: 'Zero-Day Chillout (Deep Beats)', artist: 'Jeptha // OS Sound', album: 'Workstation Sessions Vol. 1', startTime: 840, duration: 240 },
];

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private soundProfile: SoundProfile = 'mechanical';

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_sound_profile') as SoundProfile | null;
      if (saved && ['mechanical', 'cyber', 'minimal', 'silent'].includes(saved)) {
        this.soundProfile = saved;
      }
    }
  }

  public setSoundProfile(profile: SoundProfile) {
    this.soundProfile = profile;
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_sound_profile', profile);
    }
    if (profile !== 'silent') {
      this.playClick();
    }
  }

  public getSoundProfile(): SoundProfile {
    return this.soundProfile;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private audioEl: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private musicGain: GainNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;
  private volume: number = 0.70;

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    if (this.musicGain && this.ctx) {
      try {
        this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audioEl) {
      this.audioEl.muted = muted;
    }
    if (this.musicGain && this.ctx) {
      try {
        this.musicGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Mouse click sound synthesized per active profile
  public playClick() {
    if (this.isMuted || this.soundProfile === 'silent') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.soundProfile === 'cyber') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, this.ctx.currentTime + 0.03);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
        filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
      } else if (this.soundProfile === 'minimal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.02);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.02);
      } else {
        // 'mechanical' (Crisp Cherry MX click)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.025);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.025);
      }
    } catch {
      // AudioContext could fail gracefully
    }
  }

  // Keypress tick synthesized per active profile
  public playKeypress() {
    if (this.isMuted || this.soundProfile === 'silent') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.soundProfile === 'cyber') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200 + Math.random() * 200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.015);
        gain.gain.setValueAtTime(0.018, this.ctx.currentTime);
      } else if (this.soundProfile === 'minimal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500 + Math.random() * 100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.012);
        gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.015);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      }

      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.015);
    } catch {
      // ignore
    }
  }

  // Chime on opening window
  public playWindowOpen() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [587.33, 880]; // D5, A5
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.07, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.23);
      });
    } catch {
      // ignore
    }
  }

  // Soft descending blip for close
  public playWindowClose() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  // Success chime (hire me command, message sent, copy action)
  public playSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.26);
      });
    } catch {
      // ignore
    }
  }

  // Error buzz
  public playError() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // ignore
    }
  }

  // Snake food sound
  public playFood() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  // Celebratory fanfare for Konami Code / VIP achievements
  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // C4 to C6 arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.09, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  // Crash alarm sound (for sudo rm -rf /)
  public playAlarm() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now + i * 0.12);
        osc.frequency.linearRampToValueAtTime(300, now + i * 0.12 + 0.1);

        gain.gain.setValueAtTime(0.08, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.11);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.11);
      }
    } catch {
      // ignore
    }
  }

  // Lo-Fi House Audio Stream Player
  private ambientPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private timeUpdateListeners: Set<(currentTime: number, duration: number, track: AudioTrack) => void> = new Set();

  private initAudioElement() {
    if (!this.audioEl && typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.crossOrigin = 'anonymous';
      this.audioEl.src = '/lofi-track.mp3';
      this.audioEl.loop = true;
      this.audioEl.volume = this.volume;
      this.audioEl.muted = this.isMuted;

      this.audioEl.addEventListener('play', () => {
        this.ambientPlaying = true;
      });
      this.audioEl.addEventListener('pause', () => {
        this.ambientPlaying = false;
      });
      this.audioEl.addEventListener('ended', () => {
        this.ambientPlaying = false;
      });

      this.audioEl.addEventListener('timeupdate', () => {
        if (!this.audioEl) return;
        const curTime = this.audioEl.currentTime;
        let matchedIndex = 0;
        for (let i = AUDIO_PLAYLIST.length - 1; i >= 0; i--) {
          if (curTime >= AUDIO_PLAYLIST[i].startTime) {
            matchedIndex = i;
            break;
          }
        }
        if (matchedIndex !== this.currentTrackIndex) {
          this.currentTrackIndex = matchedIndex;
        }
        const currentTrack = AUDIO_PLAYLIST[this.currentTrackIndex];
        const trackElapsed = Math.max(0, curTime - currentTrack.startTime);
        this.timeUpdateListeners.forEach((listener) => {
          try {
            listener(trackElapsed, currentTrack.duration, currentTrack);
          } catch {
            // ignore
          }
        });
      });
    }
  }

  private setupAudioAnalyser() {
    if (!this.ctx || !this.audioEl || this.mediaSource) return;
    try {
      this.mediaSource = this.ctx.createMediaElementSource(this.audioEl);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512; // 256 high-resolution frequency bins
      this.analyser.smoothingTimeConstant = 0.76;
      this.analyser.minDecibels = -85;
      this.analyser.maxDecibels = -15;

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.mediaSource.connect(this.analyser);
      this.analyser.connect(this.musicGain);
      this.musicGain.connect(this.ctx.destination);
    } catch {
      // In case MediaElementSource already connected or unsupported
    }
  }

  public isAmbientPlaying(): boolean {
    if (this.audioEl) {
      return !this.audioEl.paused;
    }
    return this.ambientPlaying;
  }

  public toggleAmbient(onStateChange?: (playing: boolean) => void) {
    this.initAudioElement();
    const currentlyPlaying = this.isAmbientPlaying();
    if (currentlyPlaying) {
      this.stopAmbient();
      onStateChange?.(false);
    } else {
      this.startAmbient();
      onStateChange?.(true);
    }
  }

  public startAmbient() {
    this.initCtx();
    this.initAudioElement();
    this.setupAudioAnalyser();
    this.ambientPlaying = true;

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.audioEl) {
      this.audioEl.play().then(() => {
        this.ambientPlaying = true;
      }).catch(() => {
        // Autoplay policy or user interaction needed
      });
    }
  }

  public stopAmbient() {
    this.ambientPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
  }

  // Returns current 128-bin audio frequency byte array (0 - 255)
  public getFrequencyData(): Uint8Array<ArrayBuffer> | null {
    if (!this.ambientPlaying) {
      return null;
    }
    if (this.analyser) {
      if (!this.freqData || this.freqData.length !== this.analyser.frequencyBinCount) {
        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      }
      this.analyser.getByteFrequencyData(this.freqData);
      return this.freqData;
    }
    return null;
  }

  // Playlist & Track Management
  public getCurrentTrack(): AudioTrack {
    return AUDIO_PLAYLIST[this.currentTrackIndex] || AUDIO_PLAYLIST[0];
  }

  public getTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public getPlaylist(): AudioTrack[] {
    return AUDIO_PLAYLIST;
  }

  public selectTrack(index: number, autoPlay: boolean = true) {
    const idx = Math.max(0, Math.min(AUDIO_PLAYLIST.length - 1, index));
    this.currentTrackIndex = idx;
    this.initAudioElement();
    if (this.audioEl) {
      this.audioEl.currentTime = AUDIO_PLAYLIST[idx].startTime;
      if (autoPlay || this.ambientPlaying) {
        this.startAmbient();
      }
    }
  }

  public nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % AUDIO_PLAYLIST.length;
    this.selectTrack(nextIdx, true);
  }

  public prevTrack() {
    this.initAudioElement();
    const currentTrack = AUDIO_PLAYLIST[this.currentTrackIndex];
    if (this.audioEl && (this.audioEl.currentTime - currentTrack.startTime) > 3) {
      this.audioEl.currentTime = currentTrack.startTime;
    } else {
      const prevIdx = (this.currentTrackIndex - 1 + AUDIO_PLAYLIST.length) % AUDIO_PLAYLIST.length;
      this.selectTrack(prevIdx, true);
    }
  }

  public seekTrack(secondsFromTrackStart: number) {
    this.initAudioElement();
    if (this.audioEl) {
      const currentTrack = AUDIO_PLAYLIST[this.currentTrackIndex];
      const targetTime = Math.max(0, Math.min(currentTrack.duration, secondsFromTrackStart));
      this.audioEl.currentTime = currentTrack.startTime + targetTime;
    }
  }

  public getCurrentTrackTime(): { currentTime: number; duration: number } {
    const currentTrack = AUDIO_PLAYLIST[this.currentTrackIndex];
    if (!this.audioEl) {
      return { currentTime: 0, duration: currentTrack.duration };
    }
    const elapsed = Math.max(0, this.audioEl.currentTime - currentTrack.startTime);
    return { currentTime: elapsed, duration: currentTrack.duration };
  }

  public subscribeTimeUpdate(callback: (currentTime: number, duration: number, track: AudioTrack) => void): () => void {
    this.timeUpdateListeners.add(callback);
    return () => {
      this.timeUpdateListeners.delete(callback);
    };
  }
}

export const soundFx = new SoundEffects();


