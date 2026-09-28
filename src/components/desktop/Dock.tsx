import React, { useState, useEffect, useRef } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { 
  Terminal as TerminalIcon, 
  Music as MusicIcon, 
  SlidersHorizontal 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { MusicPopover } from './MusicPopover';
import { AppearancePopover } from './AppearancePopover';

export const Dock: React.FC = () => {
  const { 
    windows, 
    activeWindowId, 
    openWindow, 
    focusWindow, 
    minimizeWindow, 
    ambientPlaying 
  } = useDesktop();

  const [activePopover, setActivePopover] = useState<'music' | 'appearance' | null>(null);
  const dockRef = useRef<HTMLElement | null>(null);

  const isTerminalOpen = windows.terminal?.isOpen;
  const isTerminalFocused = isTerminalOpen && activeWindowId === 'terminal' && !windows.terminal?.isMinimized;

  // Handle outside click to dismiss popovers
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };

    if (activePopover) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activePopover]);

  const handleTerminalClick = () => {
    soundFx.playClick();
    setActivePopover(null);

    if (!isTerminalOpen) {
      openWindow('terminal');
    } else if (windows.terminal.isMinimized) {
      focusWindow('terminal');
    } else if (isTerminalFocused) {
      minimizeWindow('terminal');
    } else {
      focusWindow('terminal');
    }
  };

  const handleMusicClick = () => {
    soundFx.playClick();
    setActivePopover((prev) => (prev === 'music' ? null : 'music'));
  };

  const handleAppearanceClick = () => {
    soundFx.playClick();
    setActivePopover((prev) => (prev === 'appearance' ? null : 'appearance'));
  };

  return (
    <nav
      ref={dockRef}
      aria-label="JEPTHA // OS — UTILITY DOCK"
      className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto"
    >
      {/* Popovers Layer */}
      {activePopover === 'music' && (
        <MusicPopover onClose={() => setActivePopover(null)} />
      )}

      {activePopover === 'appearance' && (
        <AppearancePopover onClose={() => setActivePopover(null)} />
      )}

      {/* Dock Bar Shell */}
      <div className="relative flex items-center px-3 py-1.5 rounded-2xl bg-[#0c121e]/90 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/90">
        {/* Terminal Utility Item */}
        <button
          onClick={handleTerminalClick}
          className={`group flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-150 relative focus:outline-none ${
            isTerminalFocused
              ? 'bg-teal-500/15 border border-teal-500/30 text-white'
              : isTerminalOpen
              ? 'bg-white/[0.06] border border-white/10 text-teal-300'
              : 'hover:bg-white/[0.08] border border-transparent text-gray-400 hover:text-white'
          }`}
          title="Terminal.app (CLI & Workspace Commands) [Ctrl+K]"
        >
          <div className="flex items-center gap-1.5">
            <TerminalIcon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
              isTerminalOpen ? 'text-teal-400' : 'text-teal-400/80 group-hover:text-teal-300'
            }`} />
            <span className="font-mono text-xs font-semibold">Terminal</span>
          </div>
          {/* Active Status Indicator Dot */}
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 mt-1 ${
              isTerminalOpen
                ? 'bg-teal-400 opacity-100 shadow-sm shadow-teal-400/50'
                : 'bg-transparent opacity-0'
            }`}
          />
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* Music Player Utility Item */}
        <button
          onClick={handleMusicClick}
          className={`group flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-150 relative focus:outline-none ${
            activePopover === 'music'
              ? 'bg-pink-500/15 border border-pink-500/30 text-white'
              : ambientPlaying
              ? 'bg-white/[0.06] border border-white/10 text-pink-300'
              : 'hover:bg-white/[0.08] border border-transparent text-gray-400 hover:text-white'
          }`}
          title="Lo-Fi Music Player (Playback & Audio Stream)"
        >
          <div className="flex items-center gap-1.5">
            <MusicIcon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
              ambientPlaying ? 'text-pink-400' : 'text-pink-400/80 group-hover:text-pink-300'
            }`} />
            <span className="font-mono text-xs font-semibold">Music</span>
          </div>
          {/* Active Status Indicator Dot */}
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 mt-1 ${
              ambientPlaying || activePopover === 'music'
                ? 'bg-pink-400 opacity-100 shadow-sm shadow-pink-400/50'
                : 'bg-transparent opacity-0'
            }`}
          />
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* Appearance Settings Utility Item */}
        <button
          onClick={handleAppearanceClick}
          className={`group flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-150 relative focus:outline-none ${
            activePopover === 'appearance'
              ? 'bg-amber-500/15 border border-amber-500/30 text-white'
              : 'hover:bg-white/[0.08] border border-transparent text-gray-400 hover:text-white'
          }`}
          title="Appearance Settings (Glow, Particles, Animations, Accents)"
        >
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-amber-400/80 transition-transform group-hover:scale-110 group-hover:text-amber-300" />
            <span className="font-mono text-xs font-semibold">Appearance</span>
          </div>
          {/* Active Status Indicator Dot */}
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 mt-1 ${
              activePopover === 'appearance'
                ? 'bg-amber-400 opacity-100 shadow-sm shadow-amber-400/50'
                : 'bg-transparent opacity-0'
            }`}
          />
        </button>
      </div>
    </nav>
  );
};
