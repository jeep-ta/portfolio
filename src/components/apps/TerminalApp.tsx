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
  'eq', 'visualizer', 'music', 'volume', 'vol', 'crt', 'scanlines',
  'resume', 'cv', 'hire', 'challenge', 'quiz', 'trivia'
];

const ALL_FILES = [
  'About.txt', 'Projects.app', 'Skills.config', 'TaskMgr.app', 'Contact.sh', 'Snake.game', 'Resume.pdf'
];

interface InteractiveSession {
  type: 'hire' | 'quiz';
  step: number;
  data: Record<string, string | number>;
}

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
  const [session, setSession] = useState<InteractiveSession | null>(null);

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
    if (session) return;
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

  const handleInteractiveInput = (rawVal: string) => {
    if (!session) return;
    const val = rawVal.trim();

    if (val.toLowerCase() === 'cancel' || val.toLowerCase() === 'exit') {
      soundFx.playClick();
      setSession(null);
      setHistory((prev) => [
        ...prev,
        { id: Math.random().toString(), type: 'input', content: `[CANCEL] > ${val}` },
        { id: Math.random().toString(), type: 'output', content: 'Session aborted. Returned to standard guest shell.' },
      ]);
      return;
    }

    if (session.type === 'hire') {
      const promptText = `[RECRUITER WIZARD: STEP ${session.step}/3] > ${val || '(default)'}`;
      const entry: TerminalEntry = { id: Math.random().toString(), type: 'input', content: promptText };

      if (session.step === 1) {
        let role = 'Junior Full-Stack Developer';
        if (val === '1') role = 'Software Engineering Intern (OJT / Co-op)';
        else if (val === '2') role = 'Junior Full-Stack Developer';
        else if (val === '3') role = 'Junior Backend Developer';
        else if (val === '4') role = 'General Software Engineering / Contract';
        else if (val.length > 2) role = val;

        soundFx.playClick();
        setSession({ type: 'hire', step: 2, data: { role } });
        setHistory((prev) => [
          ...prev,
          entry,
          {
            id: Math.random().toString(),
            type: 'info',
            content: [
              `Target Role Selected: [${role}]`,
              '',
              'STEP 2 OF 3: Select Work Arrangement:',
              '  [1] Remote (Global / Async)',
              '  [2] Hybrid',
              '  [3] On-site (Philippines)',
              '',
              'Enter choice [1-3] or type custom:',
            ],
          },
        ]);
      } else if (session.step === 2) {
        let mode = 'Remote (Global / Async)';
        if (val === '1') mode = 'Remote (Global / Async)';
        else if (val === '2') mode = 'Hybrid';
        else if (val === '3') mode = 'On-site (Philippines)';
        else if (val.length > 2) mode = val;

        soundFx.playClick();
        setSession({ type: 'hire', step: 3, data: { ...session.data, mode } });
        setHistory((prev) => [
          ...prev,
          entry,
          {
            id: Math.random().toString(),
            type: 'info',
            content: [
              `Work Mode Selected: [${mode}]`,
              '',
              'STEP 3 OF 3: Enter your Company Name or Hiring Organization:',
              '  (Press [Enter] to leave as "Prospective Engineering Partner")',
            ],
          },
        ]);
      } else if (session.step === 3) {
        const company = val || 'Prospective Engineering Partner';
        const role = (session.data.role as string) || 'Junior Full-Stack Developer';
        const mode = (session.data.mode as string) || 'Remote';

        soundFx.playFanfare();
        setSession(null);

        const email = PERSONAL_INFO.email;
        const mailSubject = encodeURIComponent(`Engineering Opportunity: ${role} at ${company}`);
        const mailBody = encodeURIComponent(
          `Hi Jeptha,\n\nI reviewed your portfolio operating system and would love to connect regarding an opportunity for a ${role} (${mode}) at ${company}.\n\nLooking forward to discussing further!\n\nBest regards,\n${company}`
        );
        const mailtoUrl = `mailto:${email}?subject=${mailSubject}&body=${mailBody}`;

        try {
          navigator.clipboard.writeText(email);
        } catch {
          // ignore
        }

        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.open(mailtoUrl, '_blank');
          }
        }, 500);

        setHistory((prev) => [
          ...prev,
          entry,
          {
            id: Math.random().toString(),
            type: 'success',
            content: [
              '====================================================================',
              ' OFFICIAL DISPATCH: JEPTHA OS CANDIDATE RECRUITMENT HANDSHAKE       ',
              '====================================================================',
              ` Candidate:   Jeptha Osorio (Batangas State University, BSCS)`,
              ` Target Role: ${role}`,
              ` Work Mode:   ${mode}`,
              ` Recruiter:   ${company}`,
              ` Contact:     ${email} [COPIED TO CLIPBOARD]`,
              ` Status:      DISPATCH GENERATED & PRE-COMPOSED DRAFT OPENED`,
              '====================================================================',
              'Tip: You can also open "Resume.pdf" to print or download an official PDF.',
            ],
          },
        ]);
      }
    } else if (session.type === 'quiz') {
      const promptText = `[CS TRIVIA Q${session.step}/3] > ${val}`;
      const entry: TerminalEntry = { id: Math.random().toString(), type: 'input', content: promptText };

      if (session.step === 1) {
        const isCorrect = val === '2' || val.toLowerCase().includes('n log n');
        const score = isCorrect ? 1 : 0;
        soundFx.playClick();
        setSession({ type: 'quiz', step: 2, data: { score } });
        setHistory((prev) => [
          ...prev,
          entry,
          {
            id: Math.random().toString(),
            type: isCorrect ? 'success' : 'error',
            content: isCorrect
              ? 'CORRECT! QuickSort achieves O(n log n) average time by balanced partitioning.'
              : 'INCORRECT! Average QuickSort complexity is [2] O(n log n). Worst-case is O(n²).',
          },
          {
            id: Math.random().toString(),
            type: 'info',
            content: [
              '',
              'QUESTION 2 OF 3:',
              'Which data structure strictly operates under First-In, First-Out (FIFO) semantics?',
              '  [1] Stack (LIFO)',
              '  [2] Heap (Priority)',
              '  [3] Queue (FIFO)',
              '  [4] Binary Search Tree',
              '',
              'Enter answer [1-4]:',
            ],
          },
        ]);
      } else if (session.step === 2) {
        const isCorrect = val === '3' || val.toLowerCase().includes('queue');
        const currentScore = ((session.data.score as number) || 0) + (isCorrect ? 1 : 0);
        soundFx.playClick();
        setSession({ type: 'quiz', step: 3, data: { score: currentScore } });
        setHistory((prev) => [
          ...prev,
          entry,
          {
            id: Math.random().toString(),
            type: isCorrect ? 'success' : 'error',
            content: isCorrect
              ? 'CORRECT! Queues service items in the order they arrived (FIFO).'
              : 'INCORRECT! [3] Queue is FIFO. Stacks are LIFO (Last-In, First-Out).',
          },
          {
            id: Math.random().toString(),
            type: 'info',
            content: [
              '',
              'QUESTION 3 OF 3:',
              'In modern React 19, which hook is used to mark state updates as non-blocking concurrent transitions?',
              '  [1] useTransition',
              '  [2] useEffect',
              '  [3] useMemo',
              '  [4] useDeferredValue',
              '',
              'Enter answer [1-4]:',
            ],
          },
        ]);
      } else if (session.step === 3) {
        const isCorrect = val === '1' || val.toLowerCase().includes('transition');
        const finalScore = ((session.data.score as number) || 0) + (isCorrect ? 1 : 0);
        soundFx.playFanfare();
        setSession(null);

        const badge =
          finalScore === 3
            ? '🏆 [STAFF ALGORITHM ARCHITECT] — PERFECT 3/3 SCORE!'
            : finalScore === 2
            ? '⭐ [SENIOR SYSTEMS ENGINEER] — 2/3 SCORE!'
            : '📘 [ASSOCIATE ENGINEER] — 1/3 SCORE!';

        setHistory((prev) => [
          ...prev,
          entry,
          {
            id: Math.random().toString(),
            type: isCorrect ? 'success' : 'error',
            content: isCorrect
              ? 'CORRECT! useTransition allows updating state without blocking UI responsiveness.'
              : 'INCORRECT! [1] useTransition is the hook for non-blocking concurrent transitions.',
          },
          {
            id: Math.random().toString(),
            type: 'success',
            content: [
              '====================================================================',
              ' COMPUTER SCIENCE CHALLENGE RESULTS                                 ',
              '====================================================================',
              ` Final Score: ${finalScore} / 3 Correct`,
              ` Awarded Badge: ${badge}`,
              ' Thanks for playing! Type "challenge" to retry anytime.',
              '====================================================================',
            ],
          },
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
      const val = inputVal.trim();
      if (session) {
        handleInteractiveInput(val);
      } else {
        executeCommand(val);
        if (val) {
          setCommandHistory((prev) => [...prev, val]);
        }
      }
      setHistoryIndex(-1);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0 || session) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1 || session) return;
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
            '  sudo hire me / hire   Launch interactive Recruitment Offer Dispatch wizard',
            '  challenge / quiz      Test CS & algorithmic knowledge in 3-round trivia',
            '  echo <text>           Print text to console buffer',
            '  whoami / uname / date System info queries',
            '  music / lofi          Toggle Lo-Fi House audio streaming',
            '  eq / visualizer       NCS background audio equalizer & colors',
            '  volume <0-100>        Adjust master audio volume or mute/unmute',
            '  crt / scanlines       Toggle retro CRT monitor scanlines (default: OFF)',
            '  resume / cv           Open official interactive Resume & PDF export',
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
            '-rw-r--r 2026-09-30 19:40     2480 Resume.pdf',
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

      case 'resume':
      case 'cv': {
        openWindow('resume');
        soundFx.playSuccess();
        responses.push({
          id: Math.random().toString(),
          type: 'success',
          content: [
            'Opening official Resume.pdf application...',
            'Candidate: Jeptha Osorio // BSCS Undergraduate',
            'Tip: Use the in-app "Print / PDF" button to download a standard print-ready PDF.',
          ],
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
              'Core: TypeScript, React 19, Next.js, Node.js, Java, Python, SQL',
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
        } else if (target === 'resume' || target === 'resume.pdf' || target === 'cv') {
          openWindow('resume');
          responses.push({ id: Math.random().toString(), type: 'success', content: 'Launching Resume.pdf...' });
        } else {
          responses.push({
            id: Math.random().toString(),
            type: 'error',
            content: `open: unknown app "${target}". Available: about, projects, skills, taskmgr, contact, snake, resume`,
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
        } else if (fullArgs.includes('hire')) {
          soundFx.playSuccess();
          setSession({ type: 'hire', step: 1, data: {} });
          responses.push({
            id: Math.random().toString(),
            type: 'info',
            content: [
              '====================================================================',
              ' [ROOT AUTHORIZED] RECRUITMENT OFFER DISPATCH WIZARD                ',
              '====================================================================',
              'Welcome! Tailor your recruitment inquiry in 3 rapid steps.',
              '(Type "cancel" anytime to abort session)',
              '',
              'STEP 1 OF 3: Select Candidate Role Focus:',
              '  [1] Software Engineering Intern (OJT / Co-op)',
              '  [2] Junior Full-Stack Developer (React 19, TypeScript, Node.js)',
              '  [3] Junior Backend Developer (Node.js, Express, Java, SQL, REST APIs)',
              '  [4] General Inquiry / Contract Engineering',
              '',
              'Enter choice [1-4] or type your custom role title:',
            ],
          });
        } else {
          responses.push({
            id: Math.random().toString(),
            type: 'output',
            content: `sudo: ${args[0] || 'command'}: Try typing "sudo hire me" or "sudo rm -rf /"`,
          });
        }
        break;
      }

      case 'hire': {
        soundFx.playSuccess();
        setSession({ type: 'hire', step: 1, data: {} });
        responses.push({
          id: Math.random().toString(),
          type: 'info',
          content: [
            '====================================================================',
            ' RECRUITMENT OFFER DISPATCH WIZARD                                  ',
            '====================================================================',
            'Welcome! Tailor your recruitment inquiry in 3 rapid steps.',
            '(Type "cancel" anytime to abort session)',
            '',
            'STEP 1 OF 3: Select Candidate Role Focus:',
            '  [1] Software Engineering Intern (OJT / Co-op)',
            '  [2] Junior Full-Stack Developer (React 19, TypeScript, Node.js)',
            '  [3] Junior Backend Developer (Node.js, Express, Java, SQL, REST APIs)',
            '  [4] General Inquiry / Contract Engineering',
            '',
            'Enter choice [1-4] or type your custom role title:',
          ],
        });
        break;
      }

      case 'challenge':
      case 'quiz':
      case 'trivia': {
        soundFx.playSuccess();
        setSession({ type: 'quiz', step: 1, data: { score: 0 } });
        responses.push({
          id: Math.random().toString(),
          type: 'info',
          content: [
            '====================================================================',
            ' CS & ENGINEERING ARENA // 3-ROUND TRIVIA CHALLENGE                 ',
            '====================================================================',
            'Test your computer science intuition against the Jeptha OS kernel!',
            '(Type "cancel" anytime to abort session)',
            '',
            'QUESTION 1 OF 3:',
            'What is the average-case algorithmic time complexity of QuickSort?',
            '  [1] O(n)',
            '  [2] O(n log n)',
            '  [3] O(n²)',
            '  [4] O(log n)',
            '',
            'Enter choice [1-4]:',
          ],
        });
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
        <span className="text-[var(--accent)] font-bold shrink-0">
          {session
            ? session.type === 'hire'
              ? `[WIZARD ${session.step}/3] >`
              : `[CS QUIZ Q${session.step}/3] >`
            : 'guest@jeptha-os:~$'}
        </span>
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
