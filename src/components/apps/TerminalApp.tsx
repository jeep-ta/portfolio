import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { ABOUT_FILE_CONTENT, PERSONAL_INFO, PROJECTS } from '../../data/portfolioData';
import type { Theme, TerminalEntry } from '../../types';
import { soundFx } from '../../utils/audio';

const ALL_COMMANDS = [
  'help', 'ls', 'dir', 'cat', 'open', 'theme', 'sudo', 'echo', 
  'whoami', 'date', 'uname', 'snake', 'neofetch', 'matrix', 
  'top', 'htop', 'pwd', 'cd', 'clear', 'exit', 'quit',
  'eq', 'visualizer', 'music', 'volume', 'vol', 'crt', 'scanlines'
];

const ALL_FILES = [
  'About.txt', 'Projects.app', 'Skills.config', 'TaskMgr.app', 'Contact.sh', 'Snake.game'
];

const INITIAL_OUTPUT: TerminalEntry[] = [
  {
    id: 'welcome-1',
    type: 'info',
    content: [
      '====================================================================',
      ' JEPTHA OS Terminal Environment [Version 2.5.0-release]',
      ' (c) 2026 Jeptha. All rights reserved. Type "help" or "neofetch".',
      ' Tip: Press [Tab] to auto-complete commands and filenames.',
      '====================================================================',
    ],
  },
  {
    id: 'welcome-2',
    type: 'success',
    content: 'System ready. Type "ls" to view files, or "open <app>" to launch.',
  },
];

export const TerminalApp: React.FC = () => {
  const { 
    openWindow, 
    closeWindow, 
    setTheme, 
    triggerSystemCrash,
    visualizerColor,
    setVisualizerColor,
    visualizerEnabled,
    setVisualizerEnabled,
    toggleAmbientMusic,
    ambientPlaying,
    activeWindowId,
    volume,
    setVolume,
    soundEnabled,
    toggleSound,
    scanlinesEnabled,
    toggleScanlines
  } = useDesktop();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>(INITIAL_OUTPUT);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when history updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isMatrixActive]);

  // Automatically focus input when terminal window is opened or activated
  useEffect(() => {
    if (activeWindowId === 'terminal') {
      inputRef.current?.focus();
    }
  }, [activeWindowId]);

  // Focus input on click anywhere in terminal (unless user is highlighting text)
  const handleTerminalClick = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.toString().length === 0) {
      inputRef.current?.focus();
    }
  };

  // Tab Autocompletion handler
  const handleTabComplete = () => {
    soundFx.playKeypress();
    const trimmed = inputVal.trimStart();
    const parts = trimmed.split(' ');

    if (parts.length <= 1) {
      const token = parts[0].toLowerCase();
      const matches = ALL_COMMANDS.filter((c) => c.startsWith(token));
      if (matches.length === 1) {
        setInputVal(matches[0] + ' ');
      } else if (matches.length > 1) {
        setHistory((prev) => [
          ...prev,
          { id: Math.random().toString(), type: 'input', content: `guest@jeptha-os:~$ ${inputVal}` },
          { id: Math.random().toString(), type: 'info', content: matches.join('   ') },
        ]);
      }
    } else {
      // Second argument (file or app name)
      const token = parts[parts.length - 1].toLowerCase();
      const matches = ALL_FILES.filter((f) => f.toLowerCase().startsWith(token));
      if (matches.length === 1) {
        const prefix = parts.slice(0, -1).join(' ') + ' ';
        setInputVal(prefix + matches[0]);
      } else if (matches.length > 1) {
        setHistory((prev) => [
          ...prev,
          { id: Math.random().toString(), type: 'input', content: `guest@jeptha-os:~$ ${inputVal}` },
          { id: Math.random().toString(), type: 'info', content: matches.join('   ') },
        ]);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
      return;
    }

    soundFx.playKeypress();

    if (e.key === 'Enter') {
      executeCommand(inputVal.trim());
      if (inputVal.trim()) {
        setCommandHistory((prev) => [...prev, inputVal.trim()]);
      }
      setHistoryIndex(-1);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    }
  };

  const executeCommand = (fullCmd: string) => {
    if (!fullCmd) {
      setHistory((prev) => [
        ...prev,
        { id: Math.random().toString(), type: 'input', content: `guest@jeptha-os:~$ ` },
      ]);
      return;
    }

    const promptEntry: TerminalEntry = {
      id: Math.random().toString(),
      type: 'input',
      content: `guest@jeptha-os:~$ ${fullCmd}`,
    };

    const parts = fullCmd.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const responses: TerminalEntry[] = [promptEntry];

    switch (cmd) {
      case 'help': {
        responses.push({
          id: Math.random().toString(),
          type: 'info',
          content: [
            'AVAILABLE COMMANDS:',
            '  ls / dir              List files on the desktop',
            '  cat <file>            Display file content (e.g. cat About.txt)',
            '  open <app>            Launch window (About.txt, Projects.app, Skills.config, TaskMgr.app, snake)',
            '  neofetch              Display system specs and ASCII architecture badge',
            '  matrix                Launch Cyberpunk digital matrix glyph stream',
            '  top / htop            Open real-time Kernel Task Manager',
            '  theme <theme_name>    Switch desktop theme (dark, retro, matrix, cyber)',
            '  pwd / cd              Inspect virtual directories',
            '  sudo hire me          Execute VIP recruitment sequence',
            '  echo <text>           Print text to console buffer',
            '  whoami / uname / date System info queries',
            '  music / lofi          Toggle Lo-Fi House audio streaming',
            '  eq / visualizer       NCS background audio equalizer & colors',
            '  volume <0-100>        Adjust master audio volume or mute/unmute',
            '  crt / scanlines       Toggle retro CRT monitor scanlines (default: OFF)',
            '  snake                 Launch arcade snake Easter egg',
            '  exit / quit           Close terminal window',
            '  clear                 Clear terminal scrollback',
          ],
        });
        break;
      }

      case 'exit':
      case 'quit': {
        closeWindow('terminal');
        return;
      }

      case 'ls':
      case 'dir': {
        responses.push({
          id: Math.random().toString(),
          type: 'output',
          content: [
            'Mode     LastWriteTime       Length Name',
            '----     -------------       ------ ----',
            '-r--r--r 2026-09-28 11:42     1842 About.txt',
            '-rwxr-xr 2026-09-28 11:43     8920 Projects.app',
            '-rw-r--r 2026-09-28 11:44     4120 Skills.config',
            '-rwxr-xr 2026-09-28 11:45     5200 TaskMgr.app',
            '-rwxr-xr 2026-09-28 11:45     3210 Contact.sh',
            '-rwxr-xr 2026-09-28 11:46     6400 Snake.game',
            'drwxr-xr 2026-09-28 11:47     4096 secrets/',
          ],
        });
        break;
      }

      case 'neofetch':
      case 'fastfetch': {
        soundFx.playSuccess();
        responses.push({
          id: Math.random().toString(),
          type: 'info',
          content: [
            '      /\\_/\\          jeptha@workstation',
            '     ( o.o )         ------------------',
            '      > ^ <          OS: JepthaOS 2.5.0 (x86_64-retro-web)',
            '                     Host: Computer Science Student Workstation (@jeep-ta)',
            '                     Degree: Bachelor of Science in Computer Science (BSCS)',
            '                     Kernel: Linux 6.8.0-zen-arch (Vite React Engine)',
            '                     Uptime: 99.98% (High Availability)',
            '                     Packages: 6 projects, 6 daemons, 24 skills',
            '                     Shell: zsh 5.9 (Interactive POSIX)',
            '                     Resolution: 1920x1080 (Responsive Retina)',
            '                     WM: Jeptha Window Manager v2.5 (Draggable/Aero)',
            '                     Memory: 1,420MiB / 16,384MiB (8.6%)',
            '                     Status: Seeking Internships (OJT) & Junior Dev Roles',
            '                     Palette: [■ #10b981] [■ #06b6d4] [■ #f59e0b] [■ #ec4899]',
          ],
        });
        break;
      }

      case 'crt':
      case 'scanlines': {
        toggleScanlines();
        const nextState = !scanlinesEnabled;
        responses.push({
          id: Math.random().toString(),
          type: 'success',
          content: `CRT Scanline overlay switched to: ${nextState ? 'ON' : 'OFF'}`,
        });
        break;
      }

      case 'matrix':
      case 'cmatrix': {
        soundFx.playSuccess();
        setIsMatrixActive(true);
        setTimeout(() => setIsMatrixActive(false), 5000);
        responses.push({
          id: Math.random().toString(),
          type: 'success',
          content: 'Initializing Neural Matrix streaming protocol (5 seconds active)...',
        });
        break;
      }

      case 'pwd': {
        responses.push({
          id: Math.random().toString(),
          type: 'output',
          content: '/home/guest/desktop',
        });
        break;
      }

      case 'cd': {
        const target = args[0];
        if (!target || target === '~' || target === '/home/guest') {
          responses.push({ id: Math.random().toString(), type: 'output', content: '/home/guest' });
        } else if (target === 'secrets' || target === 'secrets/') {
          responses.push({
            id: Math.random().toString(),
            type: 'success',
            content: [
              'Entered /home/guest/secrets/',
              'Found files: [id_rsa.pub] [candidate_referral.jwt] [easter_egg.txt]',
              'Tip: run "cat secrets/easter_egg.txt"',
            ],
          });
        } else {
          responses.push({
            id: Math.random().toString(),
            type: 'error',
            content: `bash: cd: ${target}: Permission restricted to guest sandbox.`,
          });
        }
        break;
      }

      case 'top':
      case 'htop': {
        openWindow('taskmgr');
        responses.push({
          id: Math.random().toString(),
          type: 'success',
          content: 'Launching Kernel Task Manager (TaskMgr.app)...',
        });
        break;
      }

      case 'cat': {
        const file = args[0]?.toLowerCase();
        if (!file) {
          responses.push({
            id: Math.random().toString(),
            type: 'error',
            content: 'cat: missing file operand. Example: cat About.txt',
          });
        } else if (file === 'about.txt' || file === 'about') {
          responses.push({
            id: Math.random().toString(),
            type: 'output',
            content: ABOUT_FILE_CONTENT.split('\n'),
          });
        } else if (file === 'projects.app' || file === 'projects') {
          responses.push({
            id: Math.random().toString(),
            type: 'output',
            content: PROJECTS.map((p) => `* [${p.category}] ${p.title} - ${p.tagline}`),
          });
        } else if (file === 'skills.config' || file === 'skills') {
          responses.push({
            id: Math.random().toString(),
            type: 'output',
            content: [
              '// Skills Overview:',
              'Core: TypeScript, Rust, Go, React 19, Distributed Systems, eBPF',
              'Type "open skills" for full interactive diagnostic tree.',
            ],
          });
        } else if (file.includes('easter_egg') || file.includes('secrets')) {
          responses.push({
            id: Math.random().toString(),
            type: 'success',
            content: [
              '==================================================================',
              ' SECRET EASTER EGG REVEALED:                                     ',
              ' Try entering the Konami Code on your keyboard anytime:           ',
              '   [Up] [Up] [Down] [Down] [Left] [Right] [Left] [Right] [B] [A] ',
              ' To unlock the secret Cyber Neon 2077 god-mode theme!             ',
              '==================================================================',
            ],
          });
        } else {
          responses.push({
            id: Math.random().toString(),
            type: 'error',
            content: `cat: ${file}: No such file or directory`,
          });
        }
        break;
      }

      case 'open': {
        const target = args[0]?.toLowerCase();
        if (!target) {
          responses.push({
            id: Math.random().toString(),
            type: 'error',
            content: 'open: please specify an app. Options: about, projects, skills, taskmgr, contact, snake',
          });
        } else if (target === 'about' || target === 'about.txt') {
          openWindow('about');
          responses.push({ id: Math.random().toString(), type: 'success', content: 'Launching About.txt...' });
        } else if (target === 'projects' || target === 'projects.app') {
          openWindow('projects');
          responses.push({ id: Math.random().toString(), type: 'success', content: 'Launching Projects.app...' });
        } else if (target === 'skills' || target === 'skills.config') {
          openWindow('skills');
          responses.push({ id: Math.random().toString(), type: 'success', content: 'Launching Skills.config...' });
        } else if (target === 'taskmgr' || target === 'taskmgr.app' || target === 'top') {
          openWindow('taskmgr');
          responses.push({ id: Math.random().toString(), type: 'success', content: 'Launching TaskMgr.app...' });
        } else if (target === 'contact' || target === 'contact.sh') {
          openWindow('contact');
          responses.push({ id: Math.random().toString(), type: 'success', content: 'Launching Contact.sh...' });
        } else if (target === 'snake' || target === 'snake.game') {
          openWindow('snake');
          responses.push({ id: Math.random().toString(), type: 'success', content: 'Launching Snake.game...' });
        } else {
          responses.push({
            id: Math.random().toString(),
            type: 'error',
            content: `open: unknown app "${target}". Available: about, projects, skills, taskmgr, contact, snake`,
          });
        }
        break;
      }

      case 'sudo': {
        const fullArgs = args.join(' ').toLowerCase();
        if (fullArgs.includes('rm -rf') || fullArgs.includes('rm -r /') || fullArgs === 'rm') {
          responses.push({
            id: Math.random().toString(),
            type: 'error',
            content: [
              'CRITICAL ALERT: RECURSIVE FILE SYSTEM REMOVAL INITIATED BY ROOT...',
              'UNRECOVERABLE I/O FAULT IN KERNEL SPACE!',
              'TRIGGERING HARDWARE REBOOT SEQUENCE...',
            ],
          });
          triggerSystemCrash();
        } else if (fullArgs === 'hire me' || fullArgs === 'hire jeptha' || fullArgs === 'hire') {
          soundFx.playSuccess();
          responses.push({
            id: Math.random().toString(),
            type: 'success',
            content: [
              '==================================================================',
              ' [ROOT AUTHORIZED] YOU UNLOCKED THE VIP RECRUITMENT PROTOCOL!     ',
              '==================================================================',
              'Congratulations! Excellent engineering judgment confirmed.',
              `Direct candidate dispatch: ${PERSONAL_INFO.email}`,
              'Email copied to clipboard automatically!',
              'Looking forward to architecting exceptional systems together.',
            ],
          });
          navigator.clipboard.writeText(PERSONAL_INFO.email);
        } else {
          responses.push({
            id: Math.random().toString(),
            type: 'output',
            content: `sudo: ${args[0] || 'command'}: Try typing "sudo hire me" or "sudo rm -rf /"`,
          });
        }
        break;
      }

      case 'theme': {
        const themeChoice = args[0]?.toLowerCase() as Theme;
        if (['dark', 'retro', 'matrix', 'cyber'].includes(themeChoice)) {
          setTheme(themeChoice);
          responses.push({
            id: Math.random().toString(),
            type: 'success',
            content: `Desktop theme successfully changed to: [${themeChoice.toUpperCase()}]`,
          });
        } else {
          responses.push({
            id: Math.random().toString(),
            type: 'error',
            content: 'theme: invalid theme. Valid options: dark | retro | matrix | cyber',
          });
        }
        break;
      }

      case 'echo': {
        responses.push({
          id: Math.random().toString(),
          type: 'output',
          content: args.join(' '),
        });
        break;
      }

      case 'whoami': {
        responses.push({
          id: Math.random().toString(),
          type: 'output',
          content: 'guest@jeptha-os (Terminal Visitor with Interactive Shell Rights)',
        });
        break;
      }

      case 'date': {
        responses.push({
          id: Math.random().toString(),
          type: 'output',
          content: new Date().toString(),
        });
        break;
      }

      case 'uname': {
        responses.push({
          id: Math.random().toString(),
          type: 'output',
          content: 'Linux jeptha-os 6.8.0-zen-arch x86_64 GNU/Linux (WebAssembly Subsystem)',
        });
        break;
      }

      case 'snake': {
        openWindow('snake');
        responses.push({
          id: Math.random().toString(),
          type: 'success',
          content: 'Starting retro arcade Snake game window...',
        });
        break;
      }

      case 'music':
      case 'lofi': {
        toggleAmbientMusic();
        responses.push({
          id: Math.random().toString(),
          type: 'success',
          content: ambientPlaying
            ? 'Lo-Fi House audio stream paused.'
            : 'Streaming "lofi house vol.1 // chill music to vibe to" via Web Audio Analyser.',
        });
        break;
      }

      case 'eq':
      case 'visualizer': {
        const sub = args[0]?.toLowerCase();
        const param = args[1]?.toLowerCase();

        if (!sub) {
          responses.push({
            id: Math.random().toString(),
            type: 'info',
            content: [
              'NCS Background Audio Equalizer Configuration:',
              `  Status: ${visualizerEnabled ? 'ENABLED' : 'HIDDEN'}`,
              `  Current Color: ${visualizerColor}`,
              `  Audio Engine: ${ambientPlaying ? 'ACTIVE (FFT Streaming)' : 'STANDBY (Idle Breathing)'}`,
              '',
              'Usage:',
              '  eq on | off                  Toggle visualizer visibility',
              '  eq color <preset|hex>        Set visualizer color',
              'Available presets: yellow, cyan, pink, green, violet, orange, frost, rainbow, theme',
              'Example: eq color cyan | eq color #ff0077',
            ],
          });
        } else if (sub === 'on') {
          setVisualizerEnabled(true);
          responses.push({ id: Math.random().toString(), type: 'success', content: 'NCS Equalizer visualizer enabled on desktop background.' });
        } else if (sub === 'off') {
          setVisualizerEnabled(false);
          responses.push({ id: Math.random().toString(), type: 'success', content: 'NCS Equalizer visualizer hidden.' });
        } else if (sub === 'color' || sub === 'set') {
          const colorChoice = param || args[0];
          const colorMap: Record<string, string> = {
            yellow: 'ncs-yellow',
            gold: 'ncs-yellow',
            cyan: 'cyber-cyan',
            blue: 'cyber-cyan',
            pink: 'neon-pink',
            magenta: 'neon-pink',
            green: 'matrix-green',
            violet: 'electric-violet',
            purple: 'electric-violet',
            orange: 'sunset-orange',
            frost: 'white-frost',
            white: 'white-frost',
            rainbow: 'rainbow',
            theme: 'theme-sync',
          };
          const targetColor = colorMap[colorChoice] || (colorChoice?.startsWith('#') ? colorChoice : null);
          if (targetColor) {
            setVisualizerColor(targetColor);
            responses.push({
              id: Math.random().toString(),
              type: 'success',
              content: `Visualizer color updated to: [${targetColor}]`,
            });
          } else {
            responses.push({
              id: Math.random().toString(),
              type: 'error',
              content: `Unknown color "${colorChoice}". Choose: yellow, cyan, pink, green, violet, orange, frost, rainbow, theme, or #hex`,
            });
          }
        } else if (['yellow', 'cyan', 'pink', 'green', 'violet', 'orange', 'frost', 'rainbow', 'theme'].includes(sub) || sub.startsWith('#')) {
          const colorMap: Record<string, string> = {
            yellow: 'ncs-yellow',
            gold: 'ncs-yellow',
            cyan: 'cyber-cyan',
            pink: 'neon-pink',
            green: 'matrix-green',
            violet: 'electric-violet',
            orange: 'sunset-orange',
            frost: 'white-frost',
            rainbow: 'rainbow',
            theme: 'theme-sync',
          };
          const targetColor = colorMap[sub] || sub;
          setVisualizerColor(targetColor);
          responses.push({
            id: Math.random().toString(),
            type: 'success',
            content: `Visualizer color set to: [${targetColor}]`,
          });
        }
        break;
      }

      case 'volume':
      case 'vol': {
        const arg = args[0]?.toLowerCase();
        if (!arg) {
          const pct = Math.round((soundEnabled ? volume : 0) * 100);
          const filled = Math.round(pct / 10);
          const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
          responses.push({
            id: Math.random().toString(),
            type: 'info',
            content: `Master Volume: [${bar}] ${pct}% (${soundEnabled ? 'ACTIVE' : 'MUTED'})`,
          });
        } else if (arg === 'mute') {
          if (soundEnabled) toggleSound();
          responses.push({
            id: Math.random().toString(),
            type: 'info',
            content: 'Audio muted.',
          });
        } else if (arg === 'unmute') {
          if (!soundEnabled) toggleSound();
          responses.push({
            id: Math.random().toString(),
            type: 'success',
            content: `Audio unmuted. Current volume: ${Math.round(volume * 100)}%`,
          });
        } else {
          const num = parseInt(arg, 10);
          if (isNaN(num) || num < 0 || num > 100) {
            responses.push({
              id: Math.random().toString(),
              type: 'error',
              content: 'Usage: volume <0-100> | volume mute | volume unmute',
            });
          } else {
            setVolume(num / 100);
            const filled = Math.round(num / 10);
            const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
            soundFx.playSuccess();
            responses.push({
              id: Math.random().toString(),
              type: 'success',
              content: `Volume set to ${num}% [${bar}]`,
            });
          }
        }
        break;
      }

      case 'clear': {
        setHistory([]);
        return;
      }

      default: {
        soundFx.playError();
        responses.push({
          id: Math.random().toString(),
          type: 'error',
          content: `bash: ${cmd}: command not found. Type "help" for a list of valid commands.`,
        });
        break;
      }
    }

    setHistory((prev) => [...prev, ...responses]);
  };

  return (
    <div
      onClick={handleTerminalClick}
      className="h-full flex flex-col bg-[#050811] text-gray-200 font-mono text-xs p-3 overflow-hidden select-text cursor-text relative pointer-events-auto"
    >
      {/* Matrix Glyphs Streaming Overlay */}
      {isMatrixActive && (
        <div className="absolute inset-0 bg-black/95 z-20 p-4 font-mono text-emerald-400 text-xs overflow-hidden select-none pointer-events-none flex flex-col justify-around leading-none opacity-90 animate-pulse">
          {Array.from({ length: 18 }).map((_, r) => (
            <div key={r} className="truncate tracking-widest text-[11px] text-emerald-400 font-mono">
              {Array.from({ length: 60 })
                .map(() => String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96)))
                .join(' ')}
            </div>
          ))}
        </div>
      )}

      {/* Scrollable Output Buffer */}
      <div className="flex-1 overflow-auto space-y-1 pr-1 font-mono pointer-events-auto select-text">
        {history.map((entry) => {
          if (Array.isArray(entry.content)) {
            return (
              <div key={entry.id} className="space-y-0.5">
                {entry.content.map((line, i) => (
                  <div
                    key={i}
                    className={`leading-relaxed whitespace-pre-wrap ${
                      entry.type === 'error'
                        ? 'text-red-400'
                        : entry.type === 'success'
                        ? 'text-emerald-400'
                        : entry.type === 'info'
                        ? 'text-cyan-400'
                        : 'text-gray-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            );
          }

          let colorClass = 'text-gray-300';
          if (entry.type === 'input') colorClass = 'text-white font-semibold';
          if (entry.type === 'error') colorClass = 'text-red-400 font-medium';
          if (entry.type === 'success') colorClass = 'text-emerald-400 font-bold';
          if (entry.type === 'info') colorClass = 'text-cyan-400';

          return (
            <div key={entry.id} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
              {entry.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Input Line */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="flex items-center gap-2 pt-2 border-t border-white/10 select-none cursor-text pointer-events-auto"
      >
        <span className="text-[var(--accent)] font-bold shrink-0">guest@jeptha-os:~$</span>
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent border-none outline-none text-white font-mono text-xs focus:ring-0 p-0 m-0 pointer-events-auto cursor-text"
          />
        </div>
      </div>
    </div>
  );
};
