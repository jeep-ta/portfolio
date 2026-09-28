import React, { useEffect, useRef } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { 
  EyeOff, 
  LayoutGrid, 
  RotateCcw, 
  Tv, 
  Sparkles, 
  Keyboard, 
  Code2
} from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const { 
    minimizeAll, 
    tileWindows, 
    resetWindows,
    toggleScanlines, 
    scanlinesEnabled,
    particlesEnabled,
    toggleParticles,
    toggleShortcutsModal
  } = useDesktop();

  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('pointerdown', handleOutsideClick);
    return () => window.removeEventListener('pointerdown', handleOutsideClick);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Viewport bounds & edge detection
  const menuWidth = 240;
  const menuHeight = 230;
  const adjustedX = x + menuWidth > window.innerWidth ? Math.max(8, x - menuWidth) : Math.max(8, x);
  const adjustedY = y + menuHeight > window.innerHeight ? Math.max(8, y - menuHeight) : Math.max(8, y);

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Desktop Actions Context Menu"
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
      className="fixed z-50 w-60 rounded-xl bg-[#0c121e]/95 backdrop-blur-xl border border-white/15 shadow-2xl p-1.5 font-mono text-xs text-gray-200 select-none animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Menu Header */}
      <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-gray-400 border-b border-white/10 flex items-center justify-between mb-1">
        <span>Desktop Actions</span>
        <span className="text-[var(--accent)] font-semibold">v2.5</span>
      </div>

      {/* Section 1: Window & Workspace Orchestration */}
      <div className="space-y-0.5">
        <button
          onClick={() => {
            soundFx.playClick();
            minimizeAll();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-gray-200 hover:text-white"
        >
          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Show Desktop (Minimize)</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            tileWindows();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-gray-200 hover:text-white"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
          <span>Tile Active Windows</span>
        </button>

        <button
          onClick={() => {
            resetWindows();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-gray-200 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cascade / Reset Windows</span>
        </button>
      </div>

      <div className="my-1 border-t border-white/10" />

      {/* Section 2: Quick Display Shaders (Binary Toggles) */}
      <div className="space-y-0.5">
        <button
          onClick={() => {
            toggleScanlines();
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-gray-200 hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <Tv className="w-3.5 h-3.5 text-purple-400" />
            <span>CRT Scanlines</span>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
            scanlinesEnabled 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
              : 'bg-white/5 text-gray-500 border-white/10'
          }`}>
            {scanlinesEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={() => {
            toggleParticles();
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-gray-200 hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Canvas Particles</span>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
            particlesEnabled 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
              : 'bg-white/5 text-gray-500 border-white/10'
          }`}>
            {particlesEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      <div className="my-1 border-t border-white/10" />

      {/* Section 3: Developer & Help Commands */}
      <div className="space-y-0.5">
        <button
          onClick={() => {
            toggleShortcutsModal();
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-gray-200 hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-3.5 h-3.5 text-teal-400" />
            <span>Keyboard Shortcuts</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/5 text-teal-400 border border-white/10">
            ?
          </span>
        </button>

        <a
          href="https://github.com/jeptha"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-gray-400 hover:text-white"
        >
          <Code2 className="w-3.5 h-3.5 text-pink-400" />
          <span>Inspect Source Code</span>
        </a>
      </div>
    </div>
  );
};
