import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { soundFx } from '../../utils/audio';
import { resolveVisualizerColors } from '../../data/visualizerPresets';
import type { Theme } from '../../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  decay: number;
  color: string;
  glowColor: string;
}

interface BarPrecalc {
  binStart: number;
  binEnd: number;
  tiltFactor: number;
  cosRight: number;
  sinRight: number;
  cosLeft: number;
  sinLeft: number;
}

interface WaveRingPrecalc {
  cos: number;
  sin: number;
  idx: number;
}

// -------------------------------------------------------------
// High-Performance Precalculated Lookup Tables (Computed Once at Module Load)
// Eliminates ~14,400 transcendent math calls per second in the 60 FPS loop
// -------------------------------------------------------------
const createBarPrecalcTable = (halfBars: number): BarPrecalc[] => {
  const fMin = 40;
  const fMax = 6000;
  const binWidth = 86.13;
  const table: BarPrecalc[] = [];

  for (let i = 0; i < halfBars; i++) {
    const fLow = fMin * Math.pow(fMax / fMin, i / halfBars);
    const fHigh = fMin * Math.pow(fMax / fMin, (i + 1) / halfBars);
    const binStart = Math.max(1, Math.floor(fLow / binWidth));
    const binEnd = Math.min(240, Math.max(binStart, Math.ceil(fHigh / binWidth)));

    const progress = i / (halfBars - 1);
    const tiltFactor = 0.45 + Math.pow(progress, 1.15) * 1.15;

    const angleRight = -Math.PI / 2 + (i / halfBars) * Math.PI;
    const angleLeft = -Math.PI / 2 - (i / halfBars) * Math.PI;

    table.push({
      binStart,
      binEnd,
      tiltFactor,
      cosRight: Math.cos(angleRight),
      sinRight: Math.sin(angleRight),
      cosLeft: Math.cos(angleLeft),
      sinLeft: Math.sin(angleLeft),
    });
  }
  return table;
};

const createWaveRingTable = (totalPoints: number): WaveRingPrecalc[] => {
  const half = totalPoints / 2;
  const table: WaveRingPrecalc[] = [];
  for (let i = 0; i <= totalPoints; i++) {
    const idx = Math.min(half - 1, Math.max(0, i < half ? i : half - (i - half)));
    const angle = -Math.PI / 2 + (i / totalPoints) * Math.PI * 2;
    table.push({
      cos: Math.cos(angle),
      sin: Math.sin(angle),
      idx,
    });
  }
  return table;
};

const PRECALC_DESKTOP = createBarPrecalcTable(40);
const PRECALC_MOBILE = createBarPrecalcTable(28);

const WAVE_RING_DESKTOP = createWaveRingTable(80);
const WAVE_RING_MOBILE = createWaveRingTable(56);

const THEME_COLORS: Record<Theme, { primary: string; secondary: string; line: string }> = {
  dark: { primary: '#10b981', secondary: '#06b6d4', line: 'rgba(16, 185, 129, 0.12)' },
  retro: { primary: '#f59e0b', secondary: '#fbbf24', line: 'rgba(245, 158, 11, 0.14)' },
  matrix: { primary: '#22c55e', secondary: '#4ade80', line: 'rgba(34, 197, 94, 0.16)' },
  cyber: { primary: '#ec4899', secondary: '#8b5cf6', line: 'rgba(236, 72, 153, 0.15)' },
  cyan: { primary: '#06b6d4', secondary: '#22d3ee', line: 'rgba(6, 182, 212, 0.14)' },
};

export const InteractiveBackground: React.FC = () => {
  const {
    theme,
    visualizerColor,
    visualizerEnabled,
    visualizerStyle,
    ambientPlaying,
    toggleAmbientMusic,
    particleDensity,
    animationIntensity,
    particlesEnabled
  } = useDesktop();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Equalizer hover interaction state
  const [isHoveringEq, setIsHoveringEq] = useState(false);
  const isHoveringEqRef = useRef(false);

  // Pointer & Interaction state
  const mousePos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const isPointerDraggingRef = useRef(false);
  const lastDragPosRef = useRef<{ x: number; y: number } | null>(null);

  // Particle Collections
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const trailParticlesRef = useRef<TrailParticle[]>([]);

  // Zero-allocation reusable typed array buffers for 60 FPS visualizer calculations
  const barValuesRef = useRef(new Float32Array(40));
  const prevBarsRef = useRef(new Float32Array(40));

  // Smoothed bass and audio levels for jitter-free animation
  const smoothedBassRef = useRef<number>(0);
  const lastSparkTimeRef = useRef<number>(0);

  // Initialize Constellation Particles
  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const baseCount = isMobile ? 18 : 34;
    // Scale count proportionally with particleDensity (0 - 100%, 35% is standard default)
    const count = Math.max(0, Math.round(baseCount * (particleDensity / 35)));
    const particles: Particle[] = [];

    const speedMultiplier = animationIntensity === 'reduced' ? 0.35 : animationIntensity === 'enhanced' ? 1.5 : 1.0;

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 2 + 1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6 * speedMultiplier,
        vy: (Math.random() - 0.5) * 0.6 * speedMultiplier,
        radius,
        baseRadius: radius,
      });
    }
    particlesRef.current = particles;
  }, [particleDensity, animationIntensity]);

  // Spawn trail particle helper
  const spawnTrailParticle = useCallback((x: number, y: number, colors: { primary: string; secondary: string; glow: string }) => {
    const trail = trailParticlesRef.current;
    if (trail.length > 400) {
      trail.shift();
    }

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 1.5;
    const size = 3.2 + Math.random() * 3.8;

    const color =
      visualizerColor === 'rainbow'
        ? `hsl(${(performance.now() * 0.15 + trail.length * 6) % 360}, 100%, 65%)`
        : Math.random() > 0.35
        ? colors.primary
        : colors.secondary;

    trail.push({
      x: x + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 5,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.12,
      size,
      maxSize: size,
      alpha: 1.0,
      decay: 0.012 + Math.random() * 0.009, // Extends lifespan by ~500ms (total ~1,000ms duration at 60 FPS)
      color,
      glowColor: colors.glow,
    });
  }, [visualizerColor]);

  // Main Canvas render & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    initParticles(width, height);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles(width, height);
    };

    window.addEventListener('resize', handleResize);

    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      const themeCol = THEME_COLORS[theme] || THEME_COLORS.dark;
      const particles = particlesRef.current;
      const mouse = mousePos.current;

      // Resolve dynamic visualizer color palette (supports custom hex, presets, rainbow, theme-sync)
      const eqColors = resolveVisualizerColors(visualizerColor, theme, timestamp);

      // ==========================================
      // 1. NCS Circular Audio Equalizer Visualizer
      // ==========================================
      if (visualizerEnabled) {
        const isMobile = width < 768;
        const centerX = width / 2;
        const centerY = (height - 40) / 2; // subtle offset above dock

        const precalc = isMobile ? PRECALC_MOBILE : PRECALC_DESKTOP;
        const halfBars = precalc.length;
        const barValues = barValuesRef.current;
        const prevBars = prevBarsRef.current;

        // Read real-time frequency data from audio engine (512-point FFT -> 256 frequency bins)
        const freqArray = soundFx.getFrequencyData();
        const isAudioActive = ambientPlaying && freqArray !== null;

        let rawBass = 0;

        if (isAudioActive && freqArray) {
          // Helper: compute average power in an FFT bin range (normalized to 0.0 - 1.0)
          const getBandPower = (startBin: number, endBin: number) => {
            let sum = 0;
            let count = 0;
            for (let b = startBin; b <= endBin && b < freqArray.length; b++) {
              sum += freqArray[b] || 0;
              count++;
            }
            return count > 0 ? (sum / (count * 255)) : 0;
          };

          // Sub-Bass & Punchy Bass: bins 1 to 3 for central pulse & blast sparks
          const bassNorm = getBandPower(1, 3);
          rawBass = Math.min(1.0, Math.pow(bassNorm * 0.52, 1.5) * 1.35);

          // Fast single-pass loop utilizing precomputed frequency bin intervals & tilt curves
          for (let i = 0; i < halfBars; i++) {
            const pre = precalc[i];
            const rawNormalized = getBandPower(pre.binStart, pre.binEnd);
            const tilted = rawNormalized * pre.tiltFactor;
            const target = Math.min(1.0, Math.pow(tilted, 1.45) * 1.25);

            // Ballistics: Instant Attack & Smooth Exponential Decay
            if (target > prevBars[i]) {
              prevBars[i] = target;
            } else {
              prevBars[i] = prevBars[i] * 0.85 + target * 0.15;
            }
            barValues[i] = prevBars[i];
          }
        } else {
          // Ambient breathing idle mode when paused or awaiting audio initiation
          const idleWave = Math.sin(timestamp * 0.0025);
          rawBass = 0.10 + Math.max(0, idleWave * 0.06);

          for (let i = 0; i < halfBars; i++) {
            const undulating = Math.sin(timestamp * 0.0035 + (i / halfBars) * Math.PI * 4);
            barValues[i] = 0.12 + Math.max(0, undulating * 0.16);
          }
        }

        // Smooth bass dampening for organic pulsing
        smoothedBassRef.current += (rawBass - smoothedBassRef.current) * 0.25;
        const bassPulse = smoothedBassRef.current;

        // Base circle radius and dynamic pulsing bounce
        const baseRadius = isMobile ? Math.min(width, height) * 0.22 : 155;
        const currentRadius = baseRadius * (1 + bassPulse * 0.35);

        // --- Spawn NCS Beat-Drop Blast Sparks on Bass Kicks ---
        if (bassPulse > 0.25 && timestamp - lastSparkTimeRef.current > 75) {
          lastSparkTimeRef.current = timestamp;
          const sparkCount = Math.floor(6 + bassPulse * 12);
          for (let s = 0; s < sparkCount; s++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (3.5 + Math.random() * 6.5) * (1 + bassPulse * 1.0);
            const sparkDist = currentRadius + 8;
            sparksRef.current.push({
              x: centerX + Math.cos(angle) * sparkDist,
              y: centerY + Math.sin(angle) * sparkDist,
              vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5,
              vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 1.5,
              size: Math.random() * 2.8 + 1.4,
              alpha: 1.0,
              maxAlpha: 1.0,
              decay: 0.015 + Math.random() * 0.02,
              color: eqColors.primary,
            });
          }
        }

        // Render and update blast sparks with in-place O(1) swap-and-pop deletion
        const sparks = sparksRef.current;
        for (let i = sparks.length - 1; i >= 0; i--) {
          const sp = sparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= sp.decay;

          if (sp.alpha <= 0) {
            sparks[i] = sparks[sparks.length - 1];
            sparks.pop();
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fillStyle = sp.color === 'rainbow' ? `hsl(${(timestamp * 0.1) % 360}, 100%, 65%)` : sp.color;
          ctx.globalAlpha = Math.max(0, sp.alpha);
          ctx.shadowColor = eqColors.glow;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();
        }

        // --- Draw Central Glowing Aura & Radial Core ---
        ctx.save();
        // 1. Dark glassmorphic backdrop inside circle for high contrast
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(7, 10, 19, 0.88)';
        ctx.fill();

        // 2. Soft, less-vivid inner visualizer color wash (ambient nebula)
        const innerColorGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          currentRadius
        );
        innerColorGrad.addColorStop(0, eqColors.primary);
        innerColorGrad.addColorStop(0.55, eqColors.secondary);
        innerColorGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.40)');
        innerColorGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = innerColorGrad;
        ctx.globalAlpha = 0.22 + bassPulse * 0.08;
        ctx.fill();

        // Outer soft glow aura behind visualizer bars
        const auraGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          currentRadius * 0.8,
          centerX,
          centerY,
          currentRadius * 1.35
        );
        auraGrad.addColorStop(0, eqColors.innerFill);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius * 1.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // --- Draw NCS Symmetrical Radial Frequency Bars or Wave Ring ---
        ctx.save();
        const maxBarLength = isMobile ? 120 : 210;

        if (visualizerStyle === 'wave-ring') {
          const waveTable = isMobile ? WAVE_RING_MOBILE : WAVE_RING_DESKTOP;
          const totalPoints = waveTable.length - 1;
          
          // Pass 1: Wide luminous halo
          ctx.beginPath();
          for (let i = 0; i <= totalPoints; i++) {
            const pt = waveTable[i];
            const val = barValues[pt.idx] || 0;
            const r = currentRadius + val * maxBarLength;
            const x = centerX + pt.cos * r;
            const y = centerY + pt.sin * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = eqColors.primary;
          ctx.lineWidth = isMobile ? 6 : 9;
          ctx.shadowColor = eqColors.glow;
          ctx.shadowBlur = 24;
          ctx.globalAlpha = 0.32;
          ctx.stroke();

          // Pass 2: Vivid core wave
          ctx.beginPath();
          for (let i = 0; i <= totalPoints; i++) {
            const pt = waveTable[i];
            const val = barValues[pt.idx] || 0;
            const r = currentRadius + val * maxBarLength;
            const x = centerX + pt.cos * r;
            const y = centerY + pt.sin * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = isMobile ? 2.5 : 3.5;
          ctx.shadowColor = eqColors.glow;
          ctx.shadowBlur = 12;
          ctx.globalAlpha = 0.85;
          ctx.stroke();
        } else {
          // Classic NCS Radial Frequency Bars with Zero-Trig Lookup & Triple-Pass Neon Core
          for (let i = 0; i < halfBars; i++) {
            const pre = precalc[i];
            const val = barValues[i];
            const barLen = Math.max(10, val * maxBarLength);

            // Rainbow per-bar hue calculation
            const strokeColorRight =
              visualizerColor === 'rainbow'
                ? `hsl(${((i / halfBars) * 180 + timestamp * 0.08) % 360}, 100%, 60%)`
                : eqColors.primary;
            const strokeColorLeft =
              visualizerColor === 'rainbow'
                ? `hsl(${(360 - (i / halfBars) * 180 + timestamp * 0.08) % 360}, 100%, 60%)`
                : eqColors.primary;

            const drawNcsBar = (cos: number, sin: number, color: string) => {
              // Inward tooth characteristic of NCS visualizers
              const innerRebound = val * 12;
              const startX = centerX + cos * (currentRadius - innerRebound);
              const startY = centerY + sin * (currentRadius - innerRebound);
              const endX = centerX + cos * (currentRadius + barLen);
              const endY = centerY + sin * (currentRadius + barLen);

              // Pass 1: Wide neon aura / bloom
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.strokeStyle = color;
              ctx.lineWidth = isMobile ? 6 : 8.5;
              ctx.lineCap = 'round';
              ctx.shadowColor = eqColors.glow;
              ctx.shadowBlur = 22 + val * 16;
              ctx.globalAlpha = 0.30;
              ctx.stroke();

              // Pass 2: Intense saturated neon core
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.strokeStyle = color;
              ctx.lineWidth = isMobile ? 3.2 : 4.4;
              ctx.lineCap = 'round';
              ctx.shadowColor = eqColors.glow;
              ctx.shadowBlur = 12;
              ctx.globalAlpha = 0.95;
              ctx.stroke();

              // Pass 3: White-hot electrified plasma inner flare
              if (val > 0.12) {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = isMobile ? 1.2 : 1.8;
                ctx.lineCap = 'round';
                ctx.shadowColor = '#FFFFFF';
                ctx.shadowBlur = 6;
                ctx.globalAlpha = 0.80 + val * 0.15;
                ctx.stroke();
              }

              // Pass 4: Radiant glowing tip beads
              ctx.beginPath();
              ctx.arc(endX + cos * 3, endY + sin * 3, isMobile ? 2.2 : 3.0, 0, Math.PI * 2);
              ctx.fillStyle = color;
              ctx.shadowColor = eqColors.glow;
              ctx.shadowBlur = 10;
              ctx.globalAlpha = 0.95;
              ctx.fill();

              // White center dot inside the tip bead for high-energy look
              ctx.beginPath();
              ctx.arc(endX + cos * 3, endY + sin * 3, isMobile ? 1.2 : 1.8, 0, Math.PI * 2);
              ctx.fillStyle = '#FFFFFF';
              ctx.fill();
            };

            drawNcsBar(pre.cosRight, pre.sinRight, strokeColorRight);
            drawNcsBar(pre.cosLeft, pre.sinLeft, strokeColorLeft);
          }
        }
        ctx.restore();

        // --- Draw Concentric Neon Boundary Rings ---
        ctx.save();
        // 1. Primary outer ring (with double-stroke crisp neon)
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = eqColors.primary;
        ctx.lineWidth = isMobile ? 2.6 : 3.4;
        ctx.shadowColor = eqColors.glow;
        ctx.shadowBlur = 16 + bassPulse * 14;
        ctx.stroke();

        // White-hot hairline on top of outer ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.85;
        ctx.stroke();

        // 2. Secondary inner tech ring (less vivid, soft tech aesthetic)
        const innerRingRadius = currentRadius * 0.78;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = eqColors.secondary;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([6, 8]);
        ctx.lineDashOffset = -timestamp * 0.025;
        ctx.globalAlpha = 0.35;
        ctx.shadowColor = eqColors.glow;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.setLineDash([]);

        // Delicate tertiary inner ring bringing visualizer primary color inside
        const tertiaryRingRadius = currentRadius * 0.58;
        ctx.beginPath();
        ctx.arc(centerX, centerY, tertiaryRingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = eqColors.primary;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([3, 6]);
        ctx.lineDashOffset = timestamp * 0.015;
        ctx.globalAlpha = 0.22;
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. Dynamic bass shockwave expansion ring
        if (bassPulse > 0.17) {
          const expansionRadius = currentRadius + bassPulse * 38;
          ctx.beginPath();
          ctx.arc(centerX, centerY, expansionRadius, 0, Math.PI * 2);
          ctx.strokeStyle = eqColors.primary;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = Math.max(0, (1 - bassPulse * 1.5)) * 0.75;
          ctx.stroke();
        }

        ctx.restore();

        // --- Center Big Stylized "LO-FI" Text & Minimal State Indicator ---
        ctx.save();
        ctx.translate(centerX, centerY);

        const isHovered = isHoveringEqRef.current;
        const textScale = (1 + bassPulse * 0.05) * (isHovered ? 1.06 : 1.0);
        ctx.scale(textScale, textScale);

        const loFiFontSize = isMobile ? 40 : 54;
        ctx.font = `900 ${loFiFontSize}px "Outfit", "Inter", "Cabinet Grotesk", "JetBrains Mono", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = isMobile ? '6px' : '10px';
        }

        // Two-tone stylized gradient using visualizer colors
        const textGrad = ctx.createLinearGradient(-60, -20, 60, 20);
        textGrad.addColorStop(0, '#FFFFFF');
        textGrad.addColorStop(0.35, eqColors.primary);
        textGrad.addColorStop(1, eqColors.secondary);

        // Pass 1: Soft atmospheric neon glow
        ctx.fillStyle = textGrad;
        ctx.shadowColor = eqColors.glow;
        ctx.shadowBlur = isHovered ? 18 : 10;
        ctx.globalAlpha = 0.92;
        ctx.fillText('LO-FI', 0, isHovered ? -4 : 0);

        // Pass 2: White-hot luminous core highlight
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.28;
        ctx.shadowBlur = 0;
        ctx.fillText('LO-FI', 0, isHovered ? -4 : 0);

        // Minimal hover play/pause glyph indicator below "LO-FI"
        if (isHovered) {
          ctx.globalAlpha = 0.90;
          ctx.fillStyle = eqColors.primary;
          ctx.shadowColor = eqColors.glow;
          ctx.shadowBlur = 12;
          if (isAudioActive) {
            // Sleek mini pause bars
            ctx.fillRect(-5, 23, 3.5, 9);
            ctx.fillRect(2, 23, 3.5, 9);
          } else {
            // Sleek mini play triangle
            ctx.beginPath();
            ctx.moveTo(-4, 22);
            ctx.lineTo(6, 27.5);
            ctx.lineTo(-4, 33);
            ctx.closePath();
            ctx.fill();
          }
        }

        ctx.restore();
      }

      // ==========================================
      // 2. Interactive Shockwave Ripples (Click)
      // ==========================================
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 3.5;
        r.alpha -= 0.018;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples[i] = ripples[ripples.length - 1];
          ripples.pop();
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = eqColors.primary;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner glowing ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius * 0.7), 0, Math.PI * 2);
        ctx.strokeStyle = eqColors.secondary;
        ctx.globalAlpha = Math.max(0, r.alpha * 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 3. Mouse Click-Drag Particle Trail
      // ==========================================
      const trail = trailParticlesRef.current;
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          trail[i] = trail[trail.length - 1];
          trail.pop();
          continue;
        }

        const currentSize = p.maxSize * (0.35 + p.alpha * 0.65);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.9, currentSize), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = Math.min(1.0, p.alpha * 1.05);
        ctx.fill();

        // White-hot luminous core for particles
        if (p.alpha > 0.35 && currentSize > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = p.alpha * 0.9;
          ctx.shadowBlur = 6;
          ctx.fill();
        }
        ctx.restore();
      }

      // ==========================================
      // 4. Constellation Particles & Mouse Gravity
      // ==========================================
      if (particlesEnabled) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            // Fast square distance check (105^2 = 11025) avoids expensive Math.sqrt for 95% of pairs
            if (distSq < 11025) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              const lineOpacity = (1 - dist / 105) * 0.18;
              ctx.strokeStyle = themeCol.line;
              ctx.globalAlpha = lineOpacity;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }

          // Connect particle to mouse if nearby (140^2 = 19600)
          const dxMouse = particles[i].x - mouse.x;
          const dyMouse = particles[i].y - mouse.y;
          const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

          if (distMouseSq < 19600) {
            const distMouse = Math.sqrt(distMouseSq);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const mouseLineOpacity = (1 - distMouse / 140) * 0.22;
            ctx.strokeStyle = eqColors.primary;
            ctx.globalAlpha = mouseLineOpacity;
            ctx.lineWidth = 1.0;
            ctx.stroke();

            // Mouse gentle repel
            const force = (1 - distMouse / 140) * 1.2;
            particles[i].x += (dxMouse / distMouse) * force;
            particles[i].y += (dyMouse / distMouse) * force;
          }

          // Particle position update
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off canvas boundaries
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = distMouseSq < 19600 ? eqColors.primary : themeCol.secondary;
          ctx.globalAlpha = distMouseSq < 19600 ? 0.60 : 0.20;
          ctx.shadowColor = eqColors.primary;
          ctx.shadowBlur = distMouseSq < 19600 ? 5 : 1;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, visualizerColor, visualizerEnabled, visualizerStyle, ambientPlaying, initParticles, particlesEnabled]);

  // Pointer movement on desktop
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    mousePos.current = { x: e.clientX, y: e.clientY };

    // Check if hovering near the central visualizer circle
    if (visualizerEnabled) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = (height - 40) / 2;
      const isMobile = width < 768;
      const baseRadius = isMobile ? Math.min(width, height) * 0.22 : 155;
      const hitRadius = baseRadius + 45;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distSq = dx * dx + dy * dy;
      const hovering = distSq <= hitRadius * hitRadius;

      if (hovering !== isHoveringEqRef.current) {
        isHoveringEqRef.current = hovering;
        setIsHoveringEq(hovering);
      }
    } else if (isHoveringEqRef.current) {
      isHoveringEqRef.current = false;
      setIsHoveringEq(false);
    }

    // Emit particle trail when dragging with mouse button down
    if (isPointerDraggingRef.current && lastDragPosRef.current) {
      const lastX = lastDragPosRef.current.x;
      const lastY = lastDragPosRef.current.y;
      const currentX = e.clientX;
      const currentY = e.clientY;

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const eqColors = resolveVisualizerColors(visualizerColor, theme, performance.now());

      // Interpolate along the stroke path for a smooth, unbroken trail
      const step = 7;
      const steps = Math.min(16, Math.max(1, Math.floor(dist / step)));

      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const px = lastX + dx * t;
        const py = lastY + dy * t;
        spawnTrailParticle(px, py, eqColors);
      }

      lastDragPosRef.current = { x: currentX, y: currentY };
    }
  };

  const handlePointerLeave = () => {
    mousePos.current = { x: -1000, y: -1000 };
    if (isHoveringEqRef.current) {
      isHoveringEqRef.current = false;
      setIsHoveringEq(false);
    }
    if (isPointerDraggingRef.current) {
      isPointerDraggingRef.current = false;
      lastDragPosRef.current = null;
    }
  };

  // Central Equalizer click-to-play / click-to-pause trigger
  const triggerEqToggle = useCallback(() => {
    soundFx.playClick();
    toggleAmbientMusic();

    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = (height - 40) / 2;
    const isMobile = width < 768;
    const baseRadius = isMobile ? Math.min(width, height) * 0.22 : 155;

    // Spawn central shockwave ripple from the equalizer
    ripplesRef.current.push({
      x: centerX,
      y: centerY,
      radius: baseRadius * 0.8,
      maxRadius: baseRadius + 230,
      alpha: 1.0,
    });

    // Spawn an explosive burst of sparkling blast particles from the circle
    const eqColors = resolveVisualizerColors(visualizerColor, theme, performance.now());
    for (let s = 0; s < 36; s++) {
      const angle = (Math.PI * 2 * s) / 36 + (Math.random() - 0.5) * 0.2;
      const speed = 4.5 + Math.random() * 6.5;
      sparksRef.current.push({
        x: centerX + Math.cos(angle) * (baseRadius + 8),
        y: centerY + Math.sin(angle) * (baseRadius + 8),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.0 + 1.5,
        alpha: 1.0,
        maxAlpha: 1.0,
        decay: 0.014 + Math.random() * 0.018,
        color: eqColors.primary,
      });
    }
  }, [toggleAmbientMusic, visualizerColor, theme]);

  // Pointer Down: Start ripple & mouse drag particle trailing
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent particle trailing or ripple when pointer is over the central equalizer
    if (visualizerEnabled && e.button === 0) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = (height - 40) / 2;
      const isMobile = width < 768;
      const baseRadius = isMobile ? Math.min(width, height) * 0.22 : 155;
      const hitRadius = baseRadius + 45;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distSq = dx * dx + dy * dy;

      if (distSq <= hitRadius * hitRadius) {
        // Equalizer click will be cleanly handled by onClick
        return;
      }
    }

    // Only trigger if clicking directly on wallpaper background (not windows, dock, or topbar)
    if (
      (e.target as HTMLElement).closest('[role="dialog"]') ||
      (e.target as HTMLElement).closest('header') ||
      (e.target as HTMLElement).closest('nav') ||
      (e.target as HTMLElement).closest('button')
    ) {
      return;
    }

    // Spawn interactive shockwave ripple
    ripplesRef.current.push({
      x: e.clientX,
      y: e.clientY,
      radius: 6,
      maxRadius: 135,
      alpha: 0.7,
    });

    // Start mouse drag particle trailing
    if (e.button === 0) {
      isPointerDraggingRef.current = true;
      lastDragPosRef.current = { x: e.clientX, y: e.clientY };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      const eqColors = resolveVisualizerColors(visualizerColor, theme, performance.now());
      for (let k = 0; k < 4; k++) {
        spawnTrailParticle(e.clientX, e.clientY, eqColors);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPointerDraggingRef.current) {
      isPointerDraggingRef.current = false;
      lastDragPosRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visualizerEnabled || e.button !== 0) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = (height - 40) / 2;
    const isMobile = width < 768;
    const baseRadius = isMobile ? Math.min(width, height) * 0.22 : 155;
    const hitRadius = baseRadius + 45;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distSq = dx * dx + dy * dy;

    if (distSq <= hitRadius * hitRadius) {
      triggerEqToggle();
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-auto ${isHoveringEq ? 'cursor-pointer' : 'cursor-default'
        }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* Dedicated Interactive Click Target for Background Equalizer */}
      {visualizerEnabled && (
        <div
          role="button"
          tabIndex={0}
          aria-label={ambientPlaying ? 'Pause Lo-Fi Music' : 'Play Lo-Fi Music'}
          title={ambientPlaying ? 'Click to Pause Lo-Fi House music' : 'Click to Play Lo-Fi House music'}
          onClick={(e) => {
            e.stopPropagation();
            triggerEqToggle();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerEqToggle();
            }
          }}
          onMouseEnter={() => {
            isHoveringEqRef.current = true;
            setIsHoveringEq(true);
          }}
          onMouseLeave={() => {
            isHoveringEqRef.current = false;
            setIsHoveringEq(false);
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: 'calc(50% - 20px)',
            transform: 'translate(-50%, -50%)',
            width: '340px',
            height: '340px',
            borderRadius: '9999px',
          }}
          className="cursor-pointer z-10 select-none bg-transparent hover:bg-white/[0.015] focus:outline-none active:scale-95 transition-transform"
        />
      )}
    </div>
  );
};
