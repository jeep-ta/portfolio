import type { Theme } from '../types';

export interface VisualizerPreset {
  id: string;
  name: string;
  genreTag: string;
  primary: string;
  secondary: string;
  glow: string;
  pillColor: string;
  previewGradient: string;
}

export const VISUALIZER_PRESETS: VisualizerPreset[] = [
  {
    id: 'ncs-yellow',
    name: 'NCS Gold',
    genreTag: 'Classic Trap & House',
    primary: '#FFE600',
    secondary: '#FFAA00',
    glow: 'rgba(255, 230, 0, 1.0)',
    pillColor: '#FFE600',
    previewGradient: 'from-yellow-400 via-amber-400 to-yellow-500',
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    genreTag: 'Electro & Glitch',
    primary: '#00F6FF',
    secondary: '#0080FF',
    glow: 'rgba(0, 246, 255, 1.0)',
    pillColor: '#00F6FF',
    previewGradient: 'from-cyan-300 via-cyan-400 to-blue-500',
  },
  {
    id: 'neon-pink',
    name: 'Neon Pink',
    genreTag: 'Future Bass & Synth',
    primary: '#FF007F',
    secondary: '#FF00E1',
    glow: 'rgba(255, 0, 127, 1.0)',
    pillColor: '#FF007F',
    previewGradient: 'from-pink-500 via-fuchsia-500 to-rose-500',
  },
  {
    id: 'matrix-green',
    name: 'Matrix Green',
    genreTag: 'Dubstep & Bass',
    primary: '#00FF66',
    secondary: '#00CC44',
    glow: 'rgba(0, 255, 102, 1.0)',
    pillColor: '#00FF66',
    previewGradient: 'from-emerald-400 via-green-400 to-emerald-600',
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    genreTag: 'Melodic House',
    primary: '#B026FF',
    secondary: '#7928CA',
    glow: 'rgba(176, 38, 255, 1.0)',
    pillColor: '#B026FF',
    previewGradient: 'from-purple-500 via-violet-500 to-indigo-600',
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    genreTag: 'Drum & Bass',
    primary: '#FF4D00',
    secondary: '#FF8C00',
    glow: 'rgba(255, 77, 0, 1.0)',
    pillColor: '#FF4D00',
    previewGradient: 'from-orange-500 via-amber-500 to-red-500',
  },
  {
    id: 'white-frost',
    name: 'White Frost',
    genreTag: 'Chillstep & Lo-Fi',
    primary: '#FFFFFF',
    secondary: '#99E6FF',
    glow: 'rgba(255, 255, 255, 1.0)',
    pillColor: '#FFFFFF',
    previewGradient: 'from-white via-sky-200 to-slate-300',
  },
  {
    id: 'rainbow',
    name: 'Chroma Rainbow',
    genreTag: 'Hue Spectrum Wheel',
    primary: 'rainbow',
    secondary: 'rainbow',
    glow: 'rainbow',
    pillColor: 'linear-gradient(135deg, #f00, #ff0, #0f0, #00f, #f0f)',
    previewGradient: 'from-pink-500 via-amber-400 to-cyan-400',
  },
  {
    id: 'theme-sync',
    name: 'Theme Match',
    genreTag: 'Adaptive OS Theme',
    primary: 'theme',
    secondary: 'theme',
    glow: 'theme',
    pillColor: 'var(--accent)',
    previewGradient: 'from-[var(--accent)] to-[var(--accent)]/60',
  },
];

export interface ResolvedVisualizerColors {
  primary: string;
  secondary: string;
  glow: string;
  innerFill: string;
}

export function resolveVisualizerColors(
  colorKey: string,
  theme: Theme,
  timeMs: number
): ResolvedVisualizerColors {
  // 1. Rainbow / Spectrum Wheel
  if (colorKey === 'rainbow') {
    const hue = (timeMs * 0.05) % 360;
    const hueSec = (hue + 45) % 360;
    return {
      primary: `hsl(${hue}, 100%, 60%)`,
      secondary: `hsl(${hueSec}, 100%, 70%)`,
      glow: `hsla(${hue}, 100%, 60%, 1.0)`,
      innerFill: `hsla(${hue}, 100%, 50%, 0.25)`,
    };
  }

  // 2. OS Theme Sync
  if (colorKey === 'theme-sync') {
    switch (theme) {
      case 'retro':
        return {
          primary: '#FFB000',
          secondary: '#FFD000',
          glow: 'rgba(255, 176, 0, 1.0)',
          innerFill: 'rgba(255, 176, 0, 0.25)',
        };
      case 'matrix':
        return {
          primary: '#00FF66',
          secondary: '#39FF14',
          glow: 'rgba(0, 255, 102, 1.0)',
          innerFill: 'rgba(0, 255, 102, 0.25)',
        };
      case 'cyber':
        return {
          primary: '#FF007F',
          secondary: '#00F6FF',
          glow: 'rgba(255, 0, 127, 1.0)',
          innerFill: 'rgba(255, 0, 127, 0.25)',
        };
      case 'dark':
      default:
        return {
          primary: '#00FFCC',
          secondary: '#00BFFF',
          glow: 'rgba(0, 255, 204, 1.0)',
          innerFill: 'rgba(0, 255, 204, 0.25)',
        };
    }
  }

  // 3. Known Presets
  const found = VISUALIZER_PRESETS.find((p) => p.id === colorKey);
  if (found && found.primary !== 'rainbow' && found.primary !== 'theme') {
    return {
      primary: found.primary,
      secondary: found.secondary,
      glow: found.glow,
      innerFill: `${found.primary}33`,
    };
  }

  // 4. Custom Hex or Color
  if (colorKey.startsWith('#')) {
    return {
      primary: colorKey,
      secondary: colorKey,
      glow: `${colorKey}ff`,
      innerFill: `${colorKey}33`,
    };
  }

  // Default Fallback: NCS Yellow
  return {
    primary: '#FFE600',
    secondary: '#FFAA00',
    glow: 'rgba(255, 230, 0, 1.0)',
    innerFill: 'rgba(255, 230, 0, 0.25)',
  };
}
