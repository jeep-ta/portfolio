# JEPTHA // OS — Desktop Right-Click Context Menu Refactor

## 1. Executive Summary & Philosophy

In a windowed operating system paradigm, the desktop canvas context menu (right-click) should govern **workspace, window orchestration, and global canvas state**—not serve as a redundant launcher. 

Currently, the `DESKTOP ACTIONS` menu replicates nearly every item distributed across:
- **Left Sidebar:** Primary content launchers (About, Projects, Skills).
- **Bottom Utility Dock:** Persistent utilities (Terminal, Music, Appearance).
- **Top Bar:** System indicators and playback statuses.

This specification strips navigation and configuration bloat out of the context menu, transforming it into a high-utility, desktop-centric command surface.

---

## 2. Redundancy Audit & Migration Matrix

| Current Item in Context Menu | Issue / Redundancy | Planned Action | Target Location |
| :--- | :--- | :--- | :--- |
| `View Projects` | Duplicates left sidebar navigation | **Remove** | Left Sidebar (`Projects.dir`) |
| `View About.txt` | Duplicates left sidebar navigation | **Remove** | Left Sidebar (`About.txt`) |
| `View Skills.conf` | Duplicates left sidebar navigation | **Remove** | Left Sidebar (`Skills.conf`) |
| `Open Terminal (CLI)` | Duplicates bottom dock utility | **Remove** | Bottom Dock (`Terminal.app`) / `Ctrl+K` |
| `Lo-Fi House Track [PLAYING]` | Duplicates top bar status and music controls | **Move** | Bottom Dock → `Music` Popover |
| `NCS Equalizer Color` (8-swatch grid) | Clutters menu; belongs with audio/visualizer styling | **Move** | Bottom Dock → `Appearance` or `Music` Popover |
| `Theme Presets` (Dark, Retro, Matrix, etc.) | Redundant with appearance customization | **Move** | Bottom Dock → `Appearance` Popover |
| `Show Desktop (Minimize)` | Valid desktop canvas command | **Retain & Promote** | Context Menu (Top Group) |
| `Tile Active Windows` | Valid desktop canvas command | **Retain & Promote** | Context Menu (Top Group) |
| `CRT Scanlines [ON/OFF]` | Lightweight visual shader toggle | **Retain** | Context Menu (Canvas Display Group) |
| `Inspect Source Code` | Developer-oriented shortcut / easter egg | **Retain** | Context Menu (Footer Group) |

---

## 3. Refactored Menu Architecture

### Visual Concept
```text
┌──────────────────────────────────────────────┐
│ DESKTOP ACTIONS                         v2.5 │
├──────────────────────────────────────────────┤
│  🗔  Show Desktop (Minimize All)             │
│  ⊞  Tile Active Windows                      │
│  ⟲  Cascade / Reset Windows                  │
├──────────────────────────────────────────────┤
│  📺 CRT Scanlines                       [ON] │
│  ✦  Canvas Particles                    [ON] │
├──────────────────────────────────────────────┤
│  ⌨  Keyboard Shortcuts                  [?]  │
│  ⌥  Inspect Source Code                      │
└──────────────────────────────────────────────┘
```

### Section Breakdown

#### Section 1: Window & Workspace Orchestration
- **`Show Desktop (Minimize All)`**: Minimizes all open application windows to focus on the central visualizer/desktop.
- **`Tile Active Windows`**: Automatically arranges open windows side-by-side or in an adaptive grid.
- **`Cascade / Reset Windows`** *(New)*: Resets all window positions and sizes back to default offsets if dragged out of viewport boundaries.

#### Section 2: Quick Display Shaders (Binary Toggles)
- **`CRT Scanlines [ON / OFF]`**: Immediate toggle without opening the appearance panel.
- **`Canvas Particles [ON / OFF]`** *(New)*: Quick low-power / distraction-free switch that halts background canvas particle rendering.

#### Section 3: Developer & Help Commands
- **`Keyboard Shortcuts [?]`** *(New)*: Triggers a lightweight cheat-sheet overlay displaying hotkeys (`Ctrl+K` for CLI, `Esc` to close popovers, window cycle keys, etc.).
- **`Inspect Source Code`**: Direct external link to the portfolio's GitHub repository.

---

## 4. UI/UX Interaction Guidelines

1. **Positioning & Bounds Detection:**
   - The menu spawns at the cursor coordinates `(clientX, clientY)`.
   - Implement edge detection: if `clientX + menuWidth > window.innerWidth`, anchor the menu to the left of the cursor. Apply equivalent logic for viewport height.
2. **Context Exclusion:**
   - Right-clicking directly on active floating windows, the left sidebar, or the bottom dock should **not** open the desktop action menu; trigger standard element context or swallow the event.
3. **Closing Triggers:**
   - Left-clicking anywhere outside the menu boundaries.
   - Pressing the `Escape` key.
   - Triggering any action item within the menu.
4. **Visual Language:**
   - Preserve glassmorphic backdrop filter (`backdrop-filter: blur(12px)`).
   - Maintain the monospaced terminal styling, retro neon accent glow, and compact item padding.