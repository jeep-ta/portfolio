import React, { useEffect } from 'react';
import { Keyboard, X, Terminal, Monitor, Music, Shield } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={onClose}
      role="dialog"
      aria-label="Keyboard Shortcuts Cheat Sheet"
    >
      <div 
        className="w-full max-w-lg rounded-2xl bg-[#0c121e]/95 border border-white/15 p-5 shadow-2xl font-mono text-xs text-gray-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-4 h-4 text-[var(--accent)]" />
            <span className="font-bold text-white text-sm tracking-wide">
              KEYBOARD SHORTCUTS
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              v2.5
            </span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts Groups */}
        <div className="space-y-4">
          {/* Group 1: Global & CLI */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-[10px] text-teal-400 font-bold uppercase tracking-wider mb-2.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>System & CLI Navigation</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Launch Terminal.app (CLI)</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">Ctrl</kbd>
                  <span className="text-gray-500">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">K</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Alternative CLI Toggle</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">Ctrl</kbd>
                  <span className="text-gray-500">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">`</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Close Window / Popover</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Group 2: Window & Canvas Orchestration */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-2.5">
              <Monitor className="w-3.5 h-3.5" />
              <span>Workspace & Window Orchestration</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Show Desktop (Peek / Restore)</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">Ctrl</kbd>
                  <span className="text-gray-500">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">D</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Aero Snap Half / Full</span>
                <span className="text-gray-400 font-sans text-[11px]">Drag to Edge / Top</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Aero Shake (Minimize Others)</span>
                <span className="text-gray-400 font-sans text-[11px]">Shake Title Bar</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Desktop Actions Context Menu</span>
                <span className="text-gray-400 font-sans text-[11px]">Right-Click Canvas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Quick Launch Portfolio Apps</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">Alt</kbd>
                  <span className="text-gray-500">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono text-[10px]">1..6</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Reposition Floating Panel</span>
                <span className="text-gray-400 font-sans text-[11px]">Drag Window Header</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Marquee Canvas Selection</span>
                <span className="text-gray-400 font-sans text-[11px]">Click & Drag Desktop</span>
              </div>
            </div>
          </div>

          {/* Group 3: Audio & Visualizer */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-[10px] text-pink-400 font-bold uppercase tracking-wider mb-2.5">
              <Music className="w-3.5 h-3.5" />
              <span>Audio & Music Experience</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Play / Pause Lo-Fi Stream</span>
                <span className="text-gray-400 font-sans text-[11px]">Click Central "LO-FI"</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Audio Utility & Chapters</span>
                <span className="text-gray-400 font-mono text-[11px] flex items-center gap-1.5">
                  Dock → <Music className="w-3 h-3 text-pink-400" /> Music
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400">HOTKEYS ACTIVE</span>
          </div>
          <span>Press [Esc] to return</span>
        </div>
      </div>
    </div>
  );
};
