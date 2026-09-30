import { useState, lazy, Suspense } from 'react';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { ContextMenu } from './ContextMenu';
import { InteractiveBackground } from './InteractiveBackground';
import { 
  FileText, 
  FolderGit2, 
  Cpu, 
  Send, 
  Terminal as TerminalIcon, 
  Gamepad2,
  Activity
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

// Code-split applications for lightweight initial bundle and instant page load
const AboutApp = lazy(() => import('../apps/AboutApp').then(m => ({ default: m.AboutApp })));
const ProjectsApp = lazy(() => import('../apps/ProjectsApp').then(m => ({ default: m.ProjectsApp })));
const SkillsApp = lazy(() => import('../apps/SkillsApp').then(m => ({ default: m.SkillsApp })));
const TaskManagerApp = lazy(() => import('../apps/TaskManagerApp').then(m => ({ default: m.TaskManagerApp })));
const ContactApp = lazy(() => import('../apps/ContactApp').then(m => ({ default: m.ContactApp })));
const TerminalApp = lazy(() => import('../apps/TerminalApp').then(m => ({ default: m.TerminalApp })));
const SnakeApp = lazy(() => import('../apps/SnakeApp').then(m => ({ default: m.SnakeApp })));

const AppLoader = () => (
  <div className="h-full w-full flex items-center justify-center font-mono text-xs text-[var(--accent)] bg-[#0d1117]/80 animate-pulse">
    <span>INITIALIZING PROCESS...</span>
  </div>
);

export const Desktop: React.FC = () => {
  const { 
    windows,
    scanlinesEnabled, 
    isCrashed, 
    isRebooting, 
    showShortcutsModal, 
    setShowShortcutsModal 
  } = useDesktop();
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    // Only open context menu when clicking on desktop canvas (exclude windows, dock, topbar, or icons)
    const target = e.target as HTMLElement;
    if (
      target.closest('[role="dialog"]') || 
      target.closest('header') || 
      target.closest('nav') ||
      target.closest('button')
    ) {
      return;
    }
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={`relative w-screen h-screen overflow-hidden bg-[var(--bg-desktop)] bg-grid-pattern flex flex-col select-none ${
        isCrashed ? 'system-glitch' : ''
      }`}
    >
      {/* Authentic Retro CRT Scanlines & Monitor Vignette Overlay */}
      {scanlinesEnabled && (
        <div className="scanlines absolute inset-0 z-30 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Interactive Constellation & Shockwave Wallpaper Canvas */}
      <InteractiveBackground />

      {/* Top Status Bar */}
      <TopBar />

      {/* Desktop Main Workspace Area */}
      <main className="relative flex-1 w-full h-full pt-10 pb-16 px-4 overflow-hidden pointer-events-none">
        {/* Desktop Shortcuts Column - Structured Vertical Rail */}
        <div className="flex flex-col gap-3.5 z-10 w-fit pointer-events-auto select-none">
          <DesktopIcon
            id="about"
            label="About"
            icon={<FileText className="w-6 h-6 text-sky-400" />}
          />
          <DesktopIcon
            id="projects"
            label="Projects"
            icon={<FolderGit2 className="w-6 h-6 text-emerald-400" />}
          />
          <DesktopIcon
            id="skills"
            label="Skills"
            icon={<Cpu className="w-6 h-6 text-purple-400" />}
          />
          <DesktopIcon
            id="taskmgr"
            label="Process Monitor"
            icon={<Activity className="w-6 h-6 text-emerald-400" />}
          />
          <DesktopIcon
            id="contact"
            label="Contact"
            icon={<Send className="w-6 h-6 text-amber-400" />}
          />
          <DesktopIcon
            id="snake"
            label="Arcade"
            icon={<Gamepad2 className="w-6 h-6 text-pink-400" />}
          />
        </div>

        {/* Windows Rendering Layer - Code-Split & Rendered on Demand */}
        {windows.about.isOpen && (
          <Window id="about" icon={<FileText className="w-3.5 h-3.5 text-sky-400" />}>
            <Suspense fallback={<AppLoader />}>
              <AboutApp />
            </Suspense>
          </Window>
        )}

        {windows.projects.isOpen && (
          <Window id="projects" icon={<FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />}>
            <Suspense fallback={<AppLoader />}>
              <ProjectsApp />
            </Suspense>
          </Window>
        )}

        {windows.skills.isOpen && (
          <Window id="skills" icon={<Cpu className="w-3.5 h-3.5 text-purple-400" />}>
            <Suspense fallback={<AppLoader />}>
              <SkillsApp />
            </Suspense>
          </Window>
        )}

        {windows.taskmgr.isOpen && (
          <Window id="taskmgr" icon={<Activity className="w-3.5 h-3.5 text-emerald-400" />}>
            <Suspense fallback={<AppLoader />}>
              <TaskManagerApp />
            </Suspense>
          </Window>
        )}

        {windows.contact.isOpen && (
          <Window id="contact" icon={<Send className="w-3.5 h-3.5 text-amber-400" />}>
            <Suspense fallback={<AppLoader />}>
              <ContactApp />
            </Suspense>
          </Window>
        )}

        {windows.terminal.isOpen && (
          <Window id="terminal" icon={<TerminalIcon className="w-3.5 h-3.5 text-teal-400" />}>
            <Suspense fallback={<AppLoader />}>
              <TerminalApp />
            </Suspense>
          </Window>
        )}

        {windows.snake.isOpen && (
          <Window id="snake" icon={<Gamepad2 className="w-3.5 h-3.5 text-pink-400" />}>
            <Suspense fallback={<AppLoader />}>
              <SnakeApp />
            </Suspense>
          </Window>
        )}
      </main>


      {/* Dock Bar */}
      <Dock />

      {/* Keyboard Shortcuts Cheat-Sheet Modal */}
      {showShortcutsModal && (
        <KeyboardShortcutsModal
          isOpen={showShortcutsModal}
          onClose={() => setShowShortcutsModal(false)}
        />
      )}

      {/* Right-Click Wallpaper Context Menu */}
      {contextMenuPos && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onClose={() => setContextMenuPos(null)}
        />
      )}

      {/* Simulated System Crash / BIOS Reboot Screen */}
      {isRebooting && (
        <div className="fixed inset-0 z-50 bg-black text-emerald-400 font-mono text-xs p-8 flex flex-col justify-start select-none space-y-2 leading-relaxed animate-in fade-in duration-300">
          <div className="text-amber-400 font-bold mb-4">
            *** HARDWARE REBOOT SEQUENCE INITIATED ***
          </div>
          <div>ACPI BIOS Rev 2.4.0 (x86_64-retro-web)</div>
          <div>CPU: 16-Core Virtual Host Processor @ 3.80GHz</div>
          <div>Checking memory integrity: 32,768 MB OK</div>
          <div className="text-cyan-400">Mounting /dev/nvme0n1p2 root filesystem... OK</div>
          <div>Starting eBPF telemetry hooks... OK</div>
          <div>Spawning Raft consensus worker pool... OK</div>
          <div>Restoring pristine virtual desktop state snapshot... OK</div>
          <div className="text-emerald-300 font-bold mt-4 animate-pulse">
            System restored successfully. Returning to workstation...
          </div>
        </div>
      )}
    </div>
  );
};
