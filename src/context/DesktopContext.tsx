import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { WindowId, WindowState, Theme, Position, Size, VisualizerStyle, AnimationIntensity } from '../types';
import { soundFx, type AudioTrack } from '../utils/audio';

interface DesktopContextType {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  theme: Theme;
  soundEnabled: boolean;
  scanlinesEnabled: boolean;
  isCrashed: boolean;
  isRebooting: boolean;
  ambientPlaying: boolean;
  visualizerColor: string;
  setVisualizerColor: (color: string) => void;
  visualizerEnabled: boolean;
  setVisualizerEnabled: (enabled: boolean) => void;
  visualizerStyle: VisualizerStyle;
  setVisualizerStyle: (style: VisualizerStyle) => void;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  toggleWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, position: Position) => void;
  updateSize: (id: WindowId, size: Size) => void;
  setTheme: (theme: Theme) => void;
  toggleSound: () => void;
  toggleScanlines: () => void;
  minimizeAll: () => void;
  tileWindows: () => void;
  toggleAmbientMusic: () => void;
  triggerSystemCrash: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  glowIntensity: number;
  setGlowIntensity: (val: number) => void;
  particleDensity: number;
  setParticleDensity: (val: number) => void;
  animationIntensity: AnimationIntensity;
  setAnimationIntensity: (intensity: AnimationIntensity) => void;
  resetAppearance: () => void;
  currentTrack: AudioTrack;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  seekTrack: (seconds: number) => void;
  particlesEnabled: boolean;
  toggleParticles: () => void;
  resetWindows: () => void;
  showShortcutsModal: boolean;
  setShowShortcutsModal: (show: boolean) => void;
  toggleShortcutsModal: () => void;
}

const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
  about: {
    id: 'about',
    title: 'About.txt',
    fileName: 'About.txt',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 100, y: 70 },
    size: { width: 620, height: 480 },
    minWidth: 380,
    minHeight: 280,
  },
  projects: {
    id: 'projects',
    title: 'Projects.app',
    fileName: 'Projects.app',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 140, y: 75 },
    size: { width: 780, height: 530 },
    minWidth: 420,
    minHeight: 320,
  },
  skills: {
    id: 'skills',
    title: 'Skills.conf',
    fileName: 'Skills.conf',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 180, y: 85 },
    size: { width: 680, height: 490 },
    minWidth: 380,
    minHeight: 300,
  },
  taskmgr: {
    id: 'taskmgr',
    title: 'TaskMgr.app',
    fileName: 'TaskMgr.app',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 210, y: 95 },
    size: { width: 660, height: 470 },
    minWidth: 400,
    minHeight: 300,
  },
  contact: {
    id: 'contact',
    title: 'Contact.sh',
    fileName: 'Contact.sh',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 240, y: 105 },
    size: { width: 580, height: 470 },
    minWidth: 360,
    minHeight: 280,
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal.app',
    fileName: 'Terminal.app',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 120, y: 90 },
    size: { width: 700, height: 460 },
    minWidth: 380,
    minHeight: 260,
  },
  snake: {
    id: 'snake',
    title: 'Snake.game',
    fileName: 'Snake.game',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 260, y: 70 },
    size: { width: 480, height: 500 },
    minWidth: 340,
    minHeight: 380,
  },
};

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const DesktopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      const copy = { ...INITIAL_WINDOWS };
      Object.keys(copy).forEach((key) => {
        const id = key as WindowId;
        copy[id] = {
          ...copy[id],
          isMaximized: true,
          position: { x: 0, y: 40 },
          size: { width: window.innerWidth, height: window.innerHeight - 90 },
        };
      });
      return copy;
    }
    return INITIAL_WINDOWS;
  });

  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('about');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [ambientPlaying, setAmbientPlaying] = useState<boolean>(false);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);
  const [isRebooting, setIsRebooting] = useState<boolean>(false);

  // Equalizer Visualizer state
  const [visualizerColor, setVisualizerColorState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio_eq_color') || 'ncs-yellow';
    }
    return 'ncs-yellow';
  });
  const [visualizerEnabled, setVisualizerEnabled] = useState<boolean>(true);
  const [visualizerStyle, setVisualizerStyle] = useState<VisualizerStyle>('ncs-radial');

  const setVisualizerColor = useCallback((color: string) => {
    setVisualizerColorState(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_eq_color', color);
    }
    soundFx.playClick();
  }, []);

  // System Master Volume State (0.0 to 1.0)
  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_volume');
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          soundFx.setVolume(parsed);
          return parsed;
        }
      }
    }
    return 0.70;
  });

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    soundFx.setVolume(clamped);
    if (clamped > 0 && !soundEnabled) {
      setSoundEnabled(true);
      soundFx.setMuted(false);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_volume', clamped.toString());
    }
  }, [soundEnabled]);

  // Glow Intensity (0 - 100%, default 40%)
  const [glowIntensity, setGlowIntensityState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_glow_intensity');
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 0 && val <= 100) return val;
      }
    }
    return 40;
  });

  const setGlowIntensity = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)));
    setGlowIntensityState(clamped);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--glow-intensity', (clamped / 100).toString());
      document.documentElement.style.setProperty('--bloom-spread', `${(clamped / 100) * 24}px`);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_glow_intensity', clamped.toString());
    }
  }, []);

  // Particle Density (0 - 100%, default 35%)
  const [particleDensity, setParticleDensityState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_particle_density');
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 0 && val <= 100) return val;
      }
    }
    return 35;
  });

  const setParticleDensity = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)));
    setParticleDensityState(clamped);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_particle_density', clamped.toString());
    }
  }, []);

  // Animation Intensity ('reduced' | 'normal' | 'enhanced', default 'normal')
  const [animationIntensity, setAnimationIntensityState] = useState<AnimationIntensity>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_anim_intensity') as AnimationIntensity;
      if (saved === 'reduced' || saved === 'normal' || saved === 'enhanced') return saved;
    }
    return 'normal';
  });

  const setAnimationIntensity = useCallback((intensity: AnimationIntensity) => {
    setAnimationIntensityState(intensity);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-animation', intensity);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_anim_intensity', intensity);
    }
    soundFx.playClick();
  }, []);

  // Audio Track State
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(() => soundFx.getCurrentTrack());

  useEffect(() => {
    const unsubscribe = soundFx.subscribeTimeUpdate((_, __, track) => {
      setCurrentTrack(track);
    });
    return unsubscribe;
  }, []);

  const nextTrack = useCallback(() => {
    soundFx.nextTrack();
    setCurrentTrack(soundFx.getCurrentTrack());
    setAmbientPlaying(soundFx.isAmbientPlaying());
  }, []);

  const prevTrack = useCallback(() => {
    soundFx.prevTrack();
    setCurrentTrack(soundFx.getCurrentTrack());
    setAmbientPlaying(soundFx.isAmbientPlaying());
  }, []);

  const selectTrack = useCallback((index: number) => {
    soundFx.selectTrack(index, true);
    setCurrentTrack(soundFx.getCurrentTrack());
    setAmbientPlaying(true);
  }, []);

  const seekTrack = useCallback((seconds: number) => {
    soundFx.seekTrack(seconds);
  }, []);

  // Canvas Particles Toggle (Quick Display Shader)
  const [particlesEnabled, setParticlesEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_particles_enabled');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const toggleParticles = useCallback(() => {
    setParticlesEnabledState((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_particles_enabled', next.toString());
      }
      soundFx.playClick();
      return next;
    });
  }, []);

  // Cascade / Reset Windows (Section 1 of Context Menu)
  const resetWindows = useCallback(() => {
    soundFx.playSuccess();
    setWindows((prev) => {
      const updated = { ...prev };
      let offset = 0;
      (Object.keys(updated) as WindowId[]).forEach((id) => {
        const init = INITIAL_WINDOWS[id];
        updated[id] = {
          ...updated[id],
          isMaximized: false,
          isMinimized: false,
          position: {
            x: init.position.x + offset,
            y: init.position.y + offset,
          },
          size: { ...init.size },
        };
        if (updated[id].isOpen) {
          offset = (offset + 25) % 120;
        }
      });
      return updated;
    });
  }, []);

  // Keyboard Shortcuts Modal State
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  const toggleShortcutsModal = useCallback(() => {
    soundFx.playClick();
    setShowShortcutsModal((prev) => !prev);
  }, []);

  // Apply theme to document element
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    soundFx.playClick();
  }, []);

  const resetAppearance = useCallback(() => {
    setGlowIntensity(40);
    setParticleDensity(35);
    setAnimationIntensity('normal');
    setTheme('dark');
    soundFx.playSuccess();
  }, [setGlowIntensity, setParticleDensity, setAnimationIntensity, setTheme]);

  // Sync initial css variables on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--glow-intensity', (glowIntensity / 100).toString());
      document.documentElement.style.setProperty('--bloom-spread', `${(glowIntensity / 100) * 24}px`);
      document.documentElement.setAttribute('data-animation', animationIntensity);
    }
  }, [glowIntensity, animationIntensity]);

  const zIndexRef = useRef<number>(20);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundFx.setMuted(!next);
      if (next) {
        soundFx.playSuccess();
      }
      return next;
    });
  }, []);

  const toggleScanlines = useCallback(() => {
    soundFx.playClick();
    setScanlinesEnabled((prev) => !prev);
  }, []);

  const toggleAmbientMusic = useCallback(() => {
    soundFx.toggleAmbient((playing) => {
      setAmbientPlaying(playing);
    });
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setActiveWindowId(id);
    zIndexRef.current += 1;
    const nextZ = zIndexRef.current;
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    soundFx.playWindowOpen();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    zIndexRef.current += 1;
    const nextZ = zIndexRef.current;

    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        isMaximized: isMobile ? true : prev[id].isMaximized,
        zIndex: nextZ,
        position: isMobile
          ? { x: 0, y: 40 }
          : {
              x: Math.min(prev[id].position.x, Math.max(20, window.innerWidth - prev[id].size.width - 20)),
              y: Math.min(prev[id].position.y, Math.max(45, window.innerHeight - prev[id].size.height - 70)),
            },
      },
    }));
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    soundFx.playWindowClose();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
    setActiveWindowId((prevActive) => {
      if (prevActive === id) {
        const openWins = Object.values(windows).filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
        if (openWins.length > 0) {
          openWins.sort((a, b) => b.zIndex - a.zIndex);
          return openWins[0].id;
        }
        return null;
      }
      return prevActive;
    });
  }, [windows]);

  const minimizeWindow = useCallback((id: WindowId) => {
    soundFx.playClick();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));
    setActiveWindowId((prevActive) => {
      if (prevActive === id) {
        const openWins = Object.values(windows).filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
        if (openWins.length > 0) {
          openWins.sort((a, b) => b.zIndex - a.zIndex);
          return openWins[0].id;
        }
        return null;
      }
      return prevActive;
    });
  }, [windows]);

  const maximizeWindow = useCallback((id: WindowId) => {
    soundFx.playClick();
    setWindows((prev) => {
      const win = prev[id];
      if (win.isMaximized) {
        return {
          ...prev,
          [id]: {
            ...win,
            isMaximized: false,
            position: win.prevPosition || win.position,
            size: win.prevSize || win.size,
          },
        };
      } else {
        return {
          ...prev,
          [id]: {
            ...win,
            isMaximized: true,
            prevPosition: win.position,
            prevSize: win.size,
            position: { x: 0, y: 38 },
            size: {
              width: window.innerWidth,
              height: window.innerHeight - 38 - 64,
            },
          },
        };
      }
    });
  }, []);

  const toggleWindow = useCallback((id: WindowId) => {
    const win = windows[id];
    if (!win.isOpen) {
      openWindow(id);
    } else if (win.isMinimized) {
      focusWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }, [windows, activeWindowId, openWindow, focusWindow, minimizeWindow]);

  const updatePosition = useCallback((id: WindowId, position: Position) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position,
      },
    }));
  }, []);

  const updateSize = useCallback((id: WindowId, size: Size) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
      },
    }));
  }, []);

  const minimizeAll = useCallback(() => {
    soundFx.playClick();
    setWindows((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        const id = k as WindowId;
        if (copy[id].isOpen) {
          copy[id] = { ...copy[id], isMinimized: true };
        }
      });
      return copy;
    });
    setActiveWindowId(null);
  }, []);

  const tileWindows = useCallback(() => {
    soundFx.playClick();
    const openWins = Object.values(windows).filter((w) => w.isOpen);
    if (openWins.length === 0) return;

    const topOffset = 42;
    const bottomOffset = 70;
    const availWidth = window.innerWidth;
    const availHeight = window.innerHeight - topOffset - bottomOffset;

    setWindows((prev) => {
      const copy = { ...prev };
      const count = openWins.length;
      openWins.forEach((w, idx) => {
        const id = w.id;
        if (count === 1) {
          copy[id] = {
            ...copy[id],
            isMinimized: false,
            isMaximized: false,
            position: { x: 40, y: topOffset + 20 },
            size: { width: availWidth - 80, height: availHeight - 40 },
          };
        } else if (count === 2) {
          const colWidth = Math.floor(availWidth / 2) - 15;
          copy[id] = {
            ...copy[id],
            isMinimized: false,
            isMaximized: false,
            position: { x: 10 + idx * (colWidth + 10), y: topOffset + 10 },
            size: { width: colWidth, height: availHeight - 20 },
          };
        } else {
          const cols = 2;
          const rows = Math.ceil(count / 2);
          const colWidth = Math.floor(availWidth / cols) - 20;
          const rowHeight = Math.floor(availHeight / rows) - 20;
          const c = idx % cols;
          const r = Math.floor(idx / cols);

          copy[id] = {
            ...copy[id],
            isMinimized: false,
            isMaximized: false,
            position: { x: 10 + c * (colWidth + 15), y: topOffset + 10 + r * (rowHeight + 15) },
            size: { width: colWidth, height: rowHeight },
          };
        }
      });
      return copy;
    });
  }, [windows]);

  // Simulated System Crash Easter Egg (sudo rm -rf /)
  const triggerSystemCrash = useCallback(() => {
    soundFx.playAlarm();
    setIsCrashed(true);

    setTimeout(() => {
      setIsRebooting(true);
    }, 2800);

    setTimeout(() => {
      setIsCrashed(false);
      setIsRebooting(false);
      soundFx.playSuccess();
      setWindows(INITIAL_WINDOWS);
      setActiveWindowId('terminal');
    }, 6200);
  }, []);

  // Global Keyboard Shortcuts
  // Esc: Close active window
  // Cmd+K / Ctrl+K / Ctrl+`: Toggle/Focus Terminal
  // Konami Code: Up, Up, Down, Down, Left, Right, Left, Right, B, A
  useEffect(() => {
    const konamiSequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'KeyB',
      'KeyA',
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Konami Code
      if (e.code === konamiSequence[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          soundFx.playFanfare();
          setTheme('cyber');
          openWindow('terminal');
        }
      } else {
        konamiIndex = 0;
      }

      // Escape
      if (e.key === 'Escape' && activeWindowId) {
        closeWindow(activeWindowId);
      }

      // Ctrl+K or Cmd+K or Ctrl+`
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.key === '`')) {
        e.preventDefault();
        const term = windows['terminal'];
        if (!term.isOpen || term.isMinimized) {
          openWindow('terminal');
        } else {
          toggleWindow('terminal');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, windows, closeWindow, openWindow, toggleWindow, setTheme]);

  // Handle window resizing (mobile responsiveness)
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setWindows((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((k) => {
            const id = k as WindowId;
            if (updated[id].isOpen) {
              updated[id] = {
                ...updated[id],
                isMaximized: true,
                position: { x: 0, y: 38 },
                size: { width: window.innerWidth, height: window.innerHeight - 90 },
              };
            }
          });
          return updated;
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DesktopContext.Provider
      value={{
        windows,
        activeWindowId,
        theme,
        soundEnabled,
        scanlinesEnabled,
        isCrashed,
        isRebooting,
        ambientPlaying,
        visualizerColor,
        setVisualizerColor,
        visualizerEnabled,
        setVisualizerEnabled,
        visualizerStyle,
        setVisualizerStyle,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        toggleWindow,
        focusWindow,
        updatePosition,
        updateSize,
        setTheme,
        toggleSound,
        toggleScanlines,
        minimizeAll,
        tileWindows,
        toggleAmbientMusic,
        triggerSystemCrash,
        volume,
        setVolume,
        glowIntensity,
        setGlowIntensity,
        particleDensity,
        setParticleDensity,
        animationIntensity,
        setAnimationIntensity,
        resetAppearance,
        currentTrack,
        nextTrack,
        prevTrack,
        selectTrack,
        seekTrack,
        particlesEnabled,
        toggleParticles,
        resetWindows,
        showShortcutsModal,
        setShowShortcutsModal,
        toggleShortcutsModal,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};
