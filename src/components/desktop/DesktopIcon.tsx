import type { ReactNode } from 'react';
import type { WindowId } from '../../types';
import { useDesktop } from '../../context/DesktopContext';
import { soundFx } from '../../utils/audio';

interface DesktopIconProps {
  id: WindowId;
  label: string;
  icon: ReactNode;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, label, icon }) => {
  const { openWindow, focusWindow, windows, activeWindowId } = useDesktop();

  const win = windows[id];
  const isOpen = win?.isOpen ?? false;
  const isFocused = activeWindowId === id && isOpen && !win.isMinimized;

  const handleClick = () => {
    soundFx.playClick();
    if (!isOpen) {
      openWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <button
      onDoubleClick={handleClick}
      onClick={handleClick}
      aria-label={`${label} (${isOpen ? (isFocused ? 'Active' : 'Running') : 'Closed'})`}
      className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border text-center w-20 sm:w-24 select-none focus:outline-none transition-all duration-150 ${
        isFocused
          ? 'bg-[var(--accent)]/15 border-[var(--accent)]/50 shadow-md shadow-[var(--accent)]/20 text-white'
          : isOpen
          ? 'bg-white/[0.06] border-white/20 text-gray-200'
          : 'bg-transparent border-transparent hover:bg-white/[0.06] hover:border-white/15 text-gray-300'
      }`}
      title={`Open ${label}`}
    >
      {/* Icon frame */}
      <div
        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all duration-150 ${
          isFocused
            ? 'bg-[var(--accent)]/20 border-[var(--accent)] shadow-sm shadow-[var(--accent)]/30'
            : isOpen
            ? 'bg-black/60 border-white/20'
            : 'bg-black/40 border-white/10 group-hover:border-white/25 group-hover:bg-black/50'
        }`}
      >
        <div className={`transition-opacity duration-150 ${isFocused ? 'opacity-100' : isOpen ? 'opacity-90' : 'opacity-80 group-hover:opacity-100'}`}>
          {icon}
        </div>

        {/* Active/Running status dot */}
        {isOpen && (
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black transition-all ${
              isFocused
                ? 'bg-[var(--accent)] ring-2 ring-[var(--accent)]/40'
                : 'bg-gray-400'
            }`}
          />
        )}
      </div>

      {/* Label */}
      <span
        className={`mt-1.5 text-[11px] font-mono px-1.5 py-0.5 rounded truncate max-w-full transition-colors duration-150 ${
          isFocused
            ? 'bg-[var(--accent)]/20 text-white font-semibold'
            : isOpen
            ? 'bg-black/60 text-white'
            : 'text-gray-300 group-hover:text-white group-hover:bg-black/60'
        }`}
      >
        {label}
      </span>
    </button>
  );
};

