# JEPTHA // OS — UI Refactor: Utility Dock & Sidebar Specification

## 1. Overview & Architectural Shift

The interface design separates primary portfolio content navigation from global system utilities:
- **Left Sidebar:** Dedicated strictly to **portfolio content & showcase apps** (About, Projects, Skills, Contact, Task Manager/Snake).
- **Bottom Dock:** Converted into a dedicated **Utility Dock** (`JEPTHA // OS — UTILITY DOCK`), providing persistent system-level tools accessible regardless of the active portfolio view. No duplicated portfolio shortcuts.

---

## 2. Proposed Bottom Dock Utilities

The bottom dock will house three persistent utilities:

```
+-------------------------------------------------------+
|  [ >_ Terminal ]   |   [ ♪ Music ]   |   [ ⚙ Appearance ]  |
+-------------------------------------------------------+
```

### 1. Terminal (`Terminal.app`)
* **Status:** Relocated from left sidebar to bottom dock.
* **Core Functionality:**
  - Preserve existing command palette, navigation shortcuts, and search functionality.
  - Remain accessible from anywhere across the portfolio.
  - Display a clear active indicator (dot or accent glow) when the terminal window is open.
  - Retain existing global keyboard shortcut bindings (e.g., ``Ctrl+` `` or `Cmd+K`).
* **Sidebar Impact:** Frees up an icon slot in the left sidebar for content-focused items.

---

### 2. Music Player
* **Status:** New dock utility popover/panel.
* **Core Functionality:**
  - Clicking the music icon triggers a compact floating player panel/popover.
  - Integrates with the existing background audio engine rather than replacing it.
* **Controls & Features:**
  - Play / Pause toggle.
  - Previous / Next track navigation (if multi-track playlist is active).
  - Volume slider and mute toggle.
  - Current track title and playback progress bar.
* **Visualizer Scope & Constraints:**
  - **Important:** The central music visualizer remains dedicated to visualization. The dock component only manages audio controls.
  - If the top status bar already contains a "Now Playing" track label, retain it; avoid redundant track displays.

---

### 3. Appearance Settings
* **Status:** New dock utility popover/panel.
* **Core Functionality:**
  - Allows visitors to interact with the visual environment and theme tokens directly without adding portfolio bloat.
* **Configuration Controls:**
  - **Glow Intensity:** Slider (0% – 100%, default ~40%) controlling decorative neon bloom and drop-shadow strength.
  - **Particle Density:** Slider (0% – 100%, default ~35%) adjusting canvas/background particle count for performance and visual clarity.
  - **Animation Intensity:** Segmented control (`Reduced` | `Normal` | `Enhanced`).
  - **Accent Color:** Preset palette selector (e.g., `Magenta`, `Cyan`, `Green`, `Amber`).
* **Design Constraints:**
  - Keep scope tight: exclude custom wallpaper uploads, full window theme engines, or multi-page configuration modals.
  - **Visualizer Protection:** Glow adjustments must strictly target decorative bloom CSS/canvas filters—do not alter the audio visualizer's geometry, internal color schemes, or audio-reactive response logic.

---

## 3. Dock Interaction & Window Behavior

| Trigger / State | Expected Behavior |
| :--- | :--- |
| **Click Terminal** | Opens terminal window; brings to focus if minimized or obscured. |
| **Click Music** | Toggles the compact playback popover open or closed. |
| **Click Appearance** | Toggles the appearance settings popover open or closed. |
| **Hover an Icon** | Displays utility tooltip with smooth micro-interaction highlight. |
| **Utility Window Open** | Displays a persistent active indicator dot beneath the respective dock icon. |
| **Click Active Utility** | Focuses existing window/popover rather than spawning duplicate instances. |

* **Animation & Styling:** Consistent popover border radius, short transition durations (~150ms–200ms ease-out), and unified neon glassmorphic design language.

---

## 4. Left Sidebar Reorganization

With utilities moved to the dock, the left sidebar remains cleanly focused on portfolio material:

| Sidebar Item | Purpose / Status |
| :--- | :--- |
| **About** | Bio, personal statement, background |
| **Projects** | Showcase, case studies, live previews |
| **Skills** | Technical competencies and tool stack |
| **Task Manager / Experience** | Career history or interactive task demo |
| **Contact** | Contact details, reach-out form, direct links |
| **Snake Game** | Optional interactive easter egg / portfolio demo |

> **Excluded from Dock & Sidebar:** Standalone links for "Resume," "Socials," and "Quick Access" are omitted to prevent redundancy, as these are already integrated into the sidebar sections and the **Contact** panel.