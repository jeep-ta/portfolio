# Graph Report - Portfolio  (2026-09-30)

## Corpus Check
- 46 files · ~57,342 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .toml 1, .css 1)

## Summary
- 330 nodes · 569 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `effdfd79`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SoundEffects
- package.json
- DesktopContext.tsx
- Desktop.tsx
- TerminalApp.tsx
- compilerOptions
- InteractiveBackground.tsx
- compilerOptions
- What You Must Do When Invoked
- .oxlintrc.json
- tsconfig.json
- ⚡ Jeptha // Terminal Desktop OS
- graphify reference: extra exports and benchmark
- Workspace Rules & Operating Directives
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- extraction-spec.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `SoundEffects` - 35 edges
2. `react` - 23 edges
3. `useDesktop()` - 21 edges
4. `Desktop()` - 20 edges
5. `compilerOptions` - 18 edges
6. `lucide-react` - 17 edges
7. `soundFx` - 17 edges
8. `compilerOptions` - 15 edges
9. `What You Must Do When Invoked` - 12 edges
10. `/graphify` - 11 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `Desktop()`  [EXTRACTED]
  src/App.tsx → src/components/desktop/Desktop.tsx
- `ProjectSimulatorProps` --references--> `Project`  [EXTRACTED]
  src/components/apps/ProjectSimulator.tsx → src/types/index.ts
- `TerminalApp()` --calls--> `useDesktop()`  [EXTRACTED]
  src/components/apps/TerminalApp.tsx → src/context/DesktopContext.tsx
- `AccentPreset` --references--> `Theme`  [EXTRACTED]
  src/components/desktop/AppearancePopover.tsx → src/types/index.ts
- `DesktopIconProps` --references--> `WindowId`  [EXTRACTED]
  src/components/desktop/DesktopIcon.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (23 total, 6 thin omitted)

### Community 0 - "SoundEffects"
Cohesion: 0.10
Nodes (3): TerminalApp(), MusicPopover(), SoundEffects

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (36): dependencies, lucide-react, react, react-dom, tailwindcss, @tailwindcss/vite, devDependencies, oxlint (+28 more)

### Community 2 - "DesktopContext.tsx"
Cohesion: 0.16
Nodes (22): ACCENT_PRESETS, AccentPreset, AppearancePopoverProps, EQ_COLOR_PRESETS, SOUND_PROFILES, DesktopIconProps, WindowProps, DesktopContext (+14 more)

### Community 3 - "Desktop.tsx"
Cohesion: 0.11
Nodes (30): lucide-react, react, INITIAL_DIR, INITIAL_SNAKE, Point, INITIAL_PROCESSES, AppearancePopover(), ContextMenu() (+22 more)

### Community 5 - "TerminalApp.tsx"
Cohesion: 0.13
Nodes (21): ContactApp(), ProjectsApp(), ProjectSimulator(), ProjectSimulatorProps, ResumeApp(), ALL_COMMANDS, ALL_FILES, INITIAL_OUTPUT (+13 more)

### Community 6 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 7 - "InteractiveBackground.tsx"
Cohesion: 0.11
Nodes (15): BarPrecalc, Particle, PRECALC_DESKTOP, PRECALC_MOBILE, Ripple, Spark, THEME_COLORS, TrailParticle (+7 more)

### Community 8 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 9 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 10 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 14 - "⚡ Jeptha // Terminal Desktop OS"
Cohesion: 0.13
Nodes (14): 🎵 512-Point FFT Audio Equalizer & Visualizer, 📦 Built-In Applications, 🖥️ Desktop Features & Applications, Installation & Development, ⚡ Jeptha // Terminal Desktop OS, ⌨️ Keyboard Shortcuts & Controls, 📄 License, 🌟 Overview (+6 more)

### Community 17 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 18 - "Workspace Rules & Operating Directives"
Cohesion: 0.25
Nodes (7): 1. Identity & Core Workflow, 2. Code Quality & Architecture, 3. Tool & Execution Directives, 4. Testing & Verification, 5. Communication Style, Frontend & React Standards, Workspace Rules & Operating Directives

### Community 19 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 21 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 22 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 23 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **160 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+155 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 190 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SoundEffects` connect `SoundEffects` to `DesktopContext.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `react` connect `Desktop.tsx` to `package.json`, `DesktopContext.tsx`, `TerminalApp.tsx`, `InteractiveBackground.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Desktop.tsx` to `package.json`, `DesktopContext.tsx`, `TerminalApp.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _160 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SoundEffects` be split into smaller, more focused modules?**
  _Cohesion score 0.09841269841269841 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05512820512820513 - nodes in this community are weakly interconnected._
- **Should `Desktop.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11341463414634147 - nodes in this community are weakly interconnected._