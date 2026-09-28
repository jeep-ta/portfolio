Create a fully functional, single-page Interactive OS / Terminal Desktop portfolio web application. 

### Aesthetic & Visual Tone
- Theme: Sleek retro-modern desktop environment (clean dark-mode terminal mixed with classic window manager aesthetics—think modern NeXTSTEP or a polished sci-fi hacker desktop).
- Monospace-forward typography, crisp subtle borders (1px solid with low-opacity accents), dark slate/charcoal backgrounds, high-contrast text, and subtle glowing highlight colors (e.g., emerald green `#10b981` or cyan `#06b6d4`).

### Core Architecture & State Management
1. Window Manager:
   - Floating window components with title bar, minimize, maximize/expand, and close buttons.
   - Draggable across the desktop bounds (pointer/mouse drag handling).
   - Dynamic Z-Index layering (clicking any window brings it to the top focus layer).
   - Window state management (open, minimized to taskbar/dock, maximized, active/focused).

2. Taskbar / Dock & Status Bar:
   - Top status bar: Displays system brand/logo, real-time live clock (HH:MM:SS), battery/network dummy indicators, and a sound effects toggle.
   - Bottom Dock / Taskbar: App launcher icons with active indicator dots for running windows, plus a quick terminal drawer shortcut.

### Required Apps & Windows
1. `About.txt` (Text Editor view):
   - Bio, technical background, current focus, and core philosophy.
   - Clean, syntax-highlighted or markdown-style text presentation with line numbers.

2. `Projects.app` (Visual Grid / Explorer):
   - Interactive cards for showcase projects.
   - Each project has: Title, stack badges, short problem-solution summary, demo link, and repo link.
   - Filterable by tags (e.g., "Web", "Systems", "All").

3. `Skills.config` (Interactive Config / Diagnostic Inspector):
   - Visualized skill tree or JSON/YAML styled inspector.
   - Categorized by Languages, Frameworks, Architecture, and Tooling.
   - Interactive nodes or progress readouts that react on hover.

4. `Contact.sh` (Interactive Form / Executable Dialog):
   - A mock terminal-driven or form-driven contact mechanism.
   - Copy-to-clipboard buttons for email and social links (GitHub, LinkedIn, X/Twitter) with instantaneous feedback.

5. `Terminal.app` (Full Interactive CLI Drawer / Window):
   - Supports keyboard input with a command history stack (Arrow Up / Arrow Down).
   - Implemented commands:
     - `help`: list available commands
     - `ls` / `dir`: list files (`About.txt`, `Projects.app`, `Skills.config`, `Contact.sh`)
     - `cat <file>`: print file content inline or open the corresponding window
     - `open <app>`: launch that specific window
     - `clear`: clear terminal buffer
     - `theme [dark|retro|matrix]`: dynamically switch theme variables
     - `sudo hire me`: prints a playful success message with email copy
     - `echo <text>`: print text

### Sound & Easter Eggs
- Web Audio API synthesizer for optional retro mechanical audio feedback (short subtle click on clicks/keypresses, subtle chime on opening windows), controlled by a global sound mute toggle in the status bar.
- Functional mini-game window or Easter egg (e.g., a simple Snake or 2D Pong window launched via desktop icon or `snake` command in the terminal).

### Deliverable Requirements
- Deliver clean, modular, modern code (React/TypeScript with Tailwind CSS, or clean vanilla TS/HTML/CSS if single-file).
- Keyboard shortcuts: `Esc` to close active window, `Cmd+K` / `Ctrl+K` or `Ctrl+\`` to summon/focus the terminal.
- Ensure high responsiveness and graceful handling on smaller screens (windows auto-maximize on mobile viewports).