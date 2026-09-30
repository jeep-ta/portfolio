export type WindowId = 'about' | 'projects' | 'skills' | 'contact' | 'terminal' | 'snake' | 'taskmgr' | 'resume';

export type Theme = 'dark' | 'retro' | 'matrix' | 'cyber' | 'cyan';

export type SoundProfile = 'mechanical' | 'cyber' | 'minimal' | 'silent';

export type AnimationIntensity = 'reduced' | 'normal' | 'enhanced';

export type VisualizerColorPreset =
  | 'ncs-yellow'
  | 'cyber-cyan'
  | 'neon-pink'
  | 'matrix-green'
  | 'electric-violet'
  | 'sunset-orange'
  | 'white-frost'
  | 'rainbow'
  | 'theme-sync'
  | 'custom';

export type VisualizerStyle = 'ncs-radial' | 'wave-ring' | 'dots-pulse';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  id: WindowId;
  title: string;
  fileName: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: Position;
  size: Size;
  prevPosition?: Position;
  prevSize?: Size;
  minWidth: number;
  minHeight: number;
}

export interface ProjectBenchmark {
  opsSec: string;
  p99Latency: string;
  memoryFootprint: string;
  concurrency: string;
  summary: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Web' | 'Systems' | 'Tools' | 'All';
  description: string;
  problem: string;
  solution: string;
  metrics: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  architectureSteps?: string[];
  benchmark?: ProjectBenchmark;
}

export interface SkillItem {
  name: string;
  level: number; // percentage 0 - 100
  experience: string;
  status: 'Core' | 'Advanced' | 'Proficient';
  tag: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: SkillItem[];
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string | string[];
}

export interface ProcessItem {
  pid: number;
  name: string;
  command: string;
  cpu: number;
  ram: number;
  status: 'running' | 'sleeping' | 'idle' | 'killed';
  threads: number;
}
