import React, { useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { WindowId } from '../../types';
import { useDesktop } from '../../context/DesktopContext';
import { Minus, Square, Copy, X } from 'lucide-react';

interface WindowProps {
  id: WindowId;
  children: ReactNode;
  icon?: ReactNode;
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export const Window: React.FC<WindowProps> = ({ id, children, icon }) => {
  const {
    windows,
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    snapWindow,
    minimizeOthers,
    updatePosition,
    updateSize,
  } = useDesktop();

  const win = windows[id];
  const isActive = activeWindowId === id;

  const [isDragging, setIsDragging] = useState(false);
  const [snapCandidate, setSnapCandidate] = useState<'top' | 'left' | 'right' | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const shakeHistoryRef = useRef<{ time: number; x: number; dir: number }[]>([]);

  const [resizingDir, setResizingDir] = useState<ResizeDirection | null>(null);
  const resizeStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;

    focusWindow(id);
    setIsDragging(true);
    setSnapCandidate(null);
    shakeHistoryRef.current = [];
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: win.position.x,
      startY: win.position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging && dragStartRef.current && !win.isMaximized) {
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      const newX = Math.max(0, Math.min(window.innerWidth - 100, dragStartRef.current.startX + deltaX));
      const newY = Math.max(38, Math.min(window.innerHeight - 80, dragStartRef.current.startY + deltaY));

      updatePosition(id, { x: newX, y: newY });

      // Aero Snap boundary detection
      if (e.clientY <= 45) {
        setSnapCandidate('top');
      } else if (e.clientX <= 25) {
        setSnapCandidate('left');
      } else if (e.clientX >= window.innerWidth - 25) {
        setSnapCandidate('right');
      } else {
        setSnapCandidate(null);
      }

      // Aero Shake detection (shaking active window minimizes all background windows)
      const now = performance.now();
      const history = shakeHistoryRef.current;
      const lastEntry = history[history.length - 1];
      if (lastEntry) {
        const dx = e.clientX - lastEntry.x;
        if (Math.abs(dx) > 35) {
          const currentDir = dx > 0 ? 1 : -1;
          if (currentDir !== lastEntry.dir) {
            history.push({ time: now, x: e.clientX, dir: currentDir });
          }
        }
      } else {
        history.push({ time: now, x: e.clientX, dir: 1 });
      }

      const recentReversals = history.filter((h) => now - h.time < 700);
      shakeHistoryRef.current = recentReversals;
      if (recentReversals.length >= 4) {
        minimizeOthers(id);
        shakeHistoryRef.current = [];
      }
    } else if (resizingDir && resizeStartRef.current && !win.isMaximized) {
      const deltaX = e.clientX - resizeStartRef.current.mouseX;
      const deltaY = e.clientY - resizeStartRef.current.mouseY;
      const { startX, startY, startWidth, startHeight } = resizeStartRef.current;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startX;
      let newY = startY;

      // Horizontal resize
      if (resizingDir.includes('e')) {
        newWidth = Math.max(win.minWidth, Math.min(window.innerWidth - startX - 10, startWidth + deltaX));
      }
      if (resizingDir.includes('w')) {
        const potentialWidth = startWidth - deltaX;
        if (potentialWidth >= win.minWidth) {
          newWidth = potentialWidth;
          newX = Math.max(0, startX + deltaX);
        }
      }

      // Vertical resize
      if (resizingDir.includes('s')) {
        newHeight = Math.max(win.minHeight, Math.min(window.innerHeight - startY - 60, startHeight + deltaY));
      }
      if (resizingDir.includes('n')) {
        const potentialHeight = startHeight - deltaY;
        if (potentialHeight >= win.minHeight && startY + deltaY >= 38) {
          newHeight = potentialHeight;
          newY = startY + deltaY;
        }
      }

      updatePosition(id, { x: newX, y: newY });
      updateSize(id, { width: newWidth, height: newHeight });
    }
  }, [isDragging, resizingDir, win.isMaximized, win.minWidth, win.minHeight, id, updatePosition, updateSize]);

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      shakeHistoryRef.current = [];

      if (snapCandidate === 'top') {
        maximizeWindow(id);
      } else if (snapCandidate === 'left') {
        snapWindow(id, 'left');
      } else if (snapCandidate === 'right') {
        snapWindow(id, 'right');
      }
      setSnapCandidate(null);

      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    if (resizingDir) {
      setResizingDir(null);
      resizeStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Handle Resize Grab
  const handleResizeStart = (e: React.PointerEvent<HTMLDivElement>, direction: ResizeDirection) => {
    e.stopPropagation();
    if (win.isMaximized) return;
    focusWindow(id);
    setResizingDir(direction);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: win.position.x,
      startY: win.position.y,
      startWidth: win.size.width,
      startHeight: win.size.height,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  return (
    <>
      {/* Aero Snap Blueprint Guide */}
      {isDragging && snapCandidate && (
        <div
          className="fixed pointer-events-none z-[999] rounded-xl border-2 border-[var(--accent)] bg-[var(--accent)]/15 backdrop-blur-[2px] transition-all duration-150 animate-pulse shadow-[0_0_35px_var(--accent-glow)]"
          style={{
            top: '40px',
            left: snapCandidate === 'right' ? 'calc(50% + 4px)' : '8px',
            width: snapCandidate === 'top' ? 'calc(100vw - 16px)' : 'calc(50vw - 12px)',
            height: 'calc(100vh - 40px - 68px)',
          }}
        >
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-[var(--accent)]/40 font-mono text-[10px] text-[var(--accent)] flex items-center gap-1.5 uppercase tracking-wider shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
            <span>
              AERO SNAP: {snapCandidate === 'top' ? 'MAXIMIZE (FULLSCREEN)' : `${snapCandidate.toUpperCase()} SPLIT (50%)`}
            </span>
          </div>
        </div>
      )}

      <div
        role="dialog"
      aria-label={win.title}
      tabIndex={-1}
      onClick={() => focusWindow(id)}
      style={{
        position: 'fixed',
        left: `${win.position.x}px`,
        top: `${win.position.y}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
      }}
      className={`window-container ${id === 'resume' ? 'window-resume' : 'print:hidden'} pointer-events-auto flex flex-col rounded-lg overflow-hidden border transition-shadow duration-150 backdrop-blur-md ${
        isActive
          ? 'border-[var(--border-highlight)] window-active-glow shadow-2xl'
          : 'border-[var(--border-color)] shadow-lg opacity-95'
      } bg-[var(--bg-window)] text-[var(--text-primary)]`}
    >
      {/* Title Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={() => maximizeWindow(id)}
        className={`window-titlebar print:hidden flex items-center justify-between px-3 py-2 border-b select-none cursor-move text-xs font-mono transition-colors ${
          isActive
            ? 'bg-[var(--bg-window-header)] border-[var(--border-highlight)] text-white'
            : 'bg-black/40 border-[var(--border-color)] text-[var(--text-muted)]'
        }`}
      >
        {/* Left: Title & Semantic Identity */}
        <div className="flex items-center gap-2 font-mono font-medium tracking-wider truncate text-xs">
          {icon && <span className="opacity-80 shrink-0">{icon}</span>}
          <span className="uppercase text-[var(--accent)] font-semibold">{id}</span>
          <span className="text-white/20 hidden sm:inline">//</span>
          <span className="truncate text-white/90">{win.title}</span>
        </div>

        {/* Right: Window TTY, Status & TUI Window Controls */}
        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
          <span className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-gray-400">
            TTY{Object.keys(windows).indexOf(id) + 1}
          </span>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mr-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isActive ? 'bg-[var(--accent)] shadow-sm shadow-[var(--accent)]/50' : 'bg-gray-600'
              }`}
            />
            <span>{isActive ? 'ACTIVE' : 'IDLE'}</span>
          </div>

          <div className="w-[1px] h-3.5 bg-white/10 hidden sm:block mx-0.5" />

          {/* TUI Window Chrome Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(id);
              }}
              title="Minimize window"
              className="w-5 h-5 flex items-center justify-center rounded bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(id);
              }}
              title={win.isMaximized ? 'Restore window' : 'Maximize window'}
              className="w-5 h-5 flex items-center justify-center rounded bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              {win.isMaximized ? (
                <Copy className="w-2.5 h-2.5 stroke-[2.5]" />
              ) : (
                <Square className="w-2.5 h-2.5 stroke-[2.5]" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(id);
              }}
              title="Close window (Esc)"
              className="w-5 h-5 flex items-center justify-center rounded bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 border border-white/10 text-gray-400 hover:text-red-300 transition-colors"
            >
              <X className="w-2.5 h-2.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="window-content flex-1 overflow-auto relative font-sans text-sm selection:bg-[var(--accent)] selection:text-black pointer-events-auto print:overflow-visible print:h-auto print:static">
        {children}
      </div>

      {/* Multi-Directional Resize Handles (Only when not maximized) */}
      {!win.isMaximized && (
        <div className="window-resize-handle print:hidden">
          {/* North */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'n')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-ns-resize hover:bg-[var(--accent)]/40 transition-colors z-30"
          />
          {/* South */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 's')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize hover:bg-[var(--accent)]/40 transition-colors z-30"
          />
          {/* West */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'w')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute top-2 bottom-2 left-0 w-1.5 cursor-ew-resize hover:bg-[var(--accent)]/40 transition-colors z-30"
          />
          {/* East */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'e')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute top-2 bottom-2 right-0 w-1.5 cursor-ew-resize hover:bg-[var(--accent)]/40 transition-colors z-30"
          />
          {/* North-West */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'nw')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize hover:bg-[var(--accent)] z-40"
          />
          {/* North-East */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'ne')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize hover:bg-[var(--accent)] z-40"
          />
          {/* South-West */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'sw')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize hover:bg-[var(--accent)] z-40"
          />
          {/* South-East */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'se')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize hover:bg-[var(--accent)] z-40"
          />
        </div>
      )}
    </div>
    </>
  );
};
