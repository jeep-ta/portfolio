import React from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  X, 
  Sparkles, 
  Activity,
  Palette, 
  Check
} from 'lucide-react';
import type { Theme, AnimationIntensity } from '../../types';

interface AppearancePopoverProps {
  onClose: () => void;
}

interface AccentPreset {
  id: Theme;
  name: string;
  color: string;
  glow: string;
}

const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'cyber', name: 'Magenta', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
  { id: 'cyan', name: 'Cyan', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  { id: 'dark', name: 'Green', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'retro', name: 'Amber', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
];

const EQ_COLOR_PRESETS = [
  { id: 'ncs-yellow', label: 'Gold', color: '#FFD700' },
  { id: 'cyber-cyan', label: 'Cyan', color: '#00F2FE' },
  { id: 'neon-pink', label: 'Pink', color: '#FF2A85' },
  { id: 'matrix-green', label: 'Green', color: '#10B981' },
  { id: 'electric-violet', label: 'Violet', color: '#A855F7' },
  { id: 'sunset-orange', label: 'Orange', color: '#FF5E3A' },
  { id: 'rainbow', label: 'Rainbow', color: 'linear-gradient(135deg, #f00, #ff0, #00f)' },
  { id: 'theme-sync', label: 'Sync', color: 'var(--accent)' },
];

export const AppearancePopover: React.FC<AppearancePopoverProps> = ({ onClose }) => {
  const {
    theme,
    setTheme,
    glowIntensity,
    setGlowIntensity,
    particleDensity,
    setParticleDensity,
    animationIntensity,
    setAnimationIntensity,
    resetAppearance,
    visualizerColor,
    setVisualizerColor
  } = useDesktop();

  return (
    <div
      role="dialog"
      aria-label="Appearance Settings Utility"
      className="absolute bottom-full mb-3.5 left-1/2 -translate-x-1/2 w-80 sm:w-88 rounded-[12px] bg-[#0e121b]/95 backdrop-blur-[20px] border border-white/10 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.7)] text-gray-200 font-mono text-xs select-none z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Anchored Pointer Caret pointing towards Appearance dock icon */}
      <div 
        className="absolute -bottom-1.5 left-[calc(50%+82px)] -translate-x-1/2 w-3 h-3 bg-[#0e121b] border-r border-b border-white/10 rotate-45 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-white text-[11px] tracking-wide">
            SYSTEM // APPEARANCE
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => resetAppearance()}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-[10px]"
            title="Reset to default settings"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none ml-1"
            title="Close Appearance Utility"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* Glow Intensity Slider */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-white font-medium text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Glow & Bloom Intensity</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              {glowIntensity}%
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mb-2 font-sans">
            Controls decorative neon bloom and drop-shadow strength.
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={glowIntensity}
            onChange={(e) => setGlowIntensity(parseInt(e.target.value, 10))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-full"
            title="Glow Intensity Slider"
          />
        </div>

        {/* Particle Density Slider */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-white font-medium text-[11px]">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Background Particle Density</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              {particleDensity}%
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mb-2 font-sans">
            Adjusts constellation particle count for clarity and performance.
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={particleDensity}
            onChange={(e) => setParticleDensity(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-full"
            title="Particle Density Slider"
          />
        </div>

        {/* Animation Intensity Segmented Control */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-medium text-[11px]">
              Animation Intensity
            </span>
            <span className="text-[10px] text-gray-400 uppercase">
              {animationIntensity}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mb-2 font-sans">
            Configures particle velocity and interface transitions.
          </p>
          <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
            {(['reduced', 'normal', 'enhanced'] as AnimationIntensity[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setAnimationIntensity(mode)}
                className={`py-1 text-center rounded text-[10px] font-semibold capitalize transition-all ${
                  animationIntensity === mode
                    ? 'bg-white/20 text-white shadow-sm border border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color Preset Selector */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center gap-1.5 text-white font-medium text-[11px] mb-1">
            <Palette className="w-3 h-3 text-[var(--accent)]" />
            <span>Accent Color Preset</span>
          </div>
          <p className="text-[10px] text-gray-400 mb-2 font-sans">
            Select system identity color palette.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {ACCENT_PRESETS.map((preset) => {
              const isActive = theme === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setTheme(preset.id);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-white/10 border-white/30 shadow-md'
                      : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                  title={`Select ${preset.name} accent`}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center transition-transform"
                    style={{ 
                      backgroundColor: preset.color, 
                      boxShadow: isActive ? `0 0 10px ${preset.glow}` : 'none' 
                    }}
                  >
                    {isActive && <Check className="w-3 h-3 text-black stroke-[3]" />}
                  </div>
                  <span className={`text-[10px] ${isActive ? 'text-white font-bold' : 'text-gray-400'}`}>
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* NCS Equalizer Visualizer Color Presets */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-medium text-[11px]">
              NCS Equalizer Color
            </span>
            <span className="text-[10px] text-gray-400 capitalize">
              {EQ_COLOR_PRESETS.find((p) => p.id === visualizerColor)?.label || 'Custom'}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mb-2 font-sans">
            Controls central visualizer spectrum hue.
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {EQ_COLOR_PRESETS.map((c) => {
              const isActive = visualizerColor === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setVisualizerColor(c.id)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] transition-all ${
                    isActive
                      ? 'bg-white/15 border-white/40 text-white font-semibold shadow-sm'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/5 text-gray-400'
                  }`}
                  title={`Visualizer color: ${c.label}`}
                >
                  <span
                    style={{ background: c.color }}
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  />
                  <span className="truncate">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety / Scope Note */}
      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-gray-500">
        <span>CORE: VISUALIZER PROTECTED</span>
        <span>TOKEN: ACTIVE</span>
      </div>
    </div>
  );
};
