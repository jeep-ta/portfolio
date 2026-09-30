import React, { useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { WindowId } from '../../types';
import { useDesktop } from '../../context/DesktopContext';

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
    updatePosition,
    updateSize,
  } = useDesktop();

  const win = windows[id];
  const isActive = activeWindowId === id;

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

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
      className={`pointer-events-auto flex flex-col rounded-lg overflow-hidden border transition-shadow duration-150 backdrop-blur-md ${
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
        className={`flex items-center justify-between px-3 py-2 border-b select-none cursor-move text-xs font-mono transition-colors ${
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
              <span>—</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(id);
              }}
              title={win.isMaximized ? 'Restore window' : 'Maximize window'}
              className="w-5 h-5 flex items-center justify-center rounded bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition-colors text-[10px]"
            >
              <span>{win.isMaximized ? '❐' : '□'}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(id);
              }}
              title="Close window (Esc)"
              className="w-5 h-5 flex items-center justify-center rounded bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 border border-white/10 text-gray-400 hover:text-red-300 transition-colors"
            >
              <span>✕</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto relative font-sans text-sm selection:bg-[var(--accent)] selection:text-black pointer-events-auto">
        {children}
      </div>

      {/* Multi-Directional Resize Handles (Only when not maximized) */}
      {!win.isMaximized && (
        <>
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
        </>
      )}
    </div>
  );
};
