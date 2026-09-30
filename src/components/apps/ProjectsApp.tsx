import { useState } from 'react';
import { PROJECTS } from '../../data/portfolioData';
import type { Project } from '../../types';
import { 
  FolderGit2, 
  ExternalLink, 
  Search, 
  Layers, 
  Zap, 
  AlertCircle,
  CheckCircle2,
  Cpu,
  Play,
  Copy,
  Check,
  X,
  Workflow,
  Sparkles
} from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { soundFx } from '../../utils/audio';
import { ProjectSimulator } from './ProjectSimulator';

export const ProjectsApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [modalTab, setModalTab] = useState<'simulator' | 'architecture' | 'benchmark'>('simulator');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkLogs, setBenchmarkLogs] = useState<string[]>([]);
  const [copiedClone, setCopiedClone] = useState(false);

  const categories = ['All', 'Systems', 'Web', 'Tools'];

  const filteredProjects = PROJECTS.filter((project) => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenDeepDive = (project: Project) => {
    soundFx.playClick();
    setActiveModalProject(project);
    setModalTab('simulator');
    setBenchmarkLogs([]);
    setIsBenchmarking(false);
  };

  const handleRunBenchmark = (project: Project) => {
    soundFx.playClick();
    setIsBenchmarking(true);
    setBenchmarkLogs([
      `[WARMUP] Initializing benchmark worker pool for ${project.title}...`,
    ]);

    setTimeout(() => {
      setBenchmarkLogs((prev) => [
        ...prev,
        `[SPAWN] 512 synthetic concurrent workload clients connected.`,
      ]);
    }, 400);

    setTimeout(() => {
      setBenchmarkLogs((prev) => [
        ...prev,
        `[STRESS] Ingesting 1,000,000 synthetic operations...`,
      ]);
    }, 900);

    setTimeout(() => {
      const bench = project.benchmark;
      setBenchmarkLogs((prev) => [
        ...prev,
        `=============================================================`,
        `BENCHMARK COMPLETED: Code 0 (Success)`,
        `Throughput:      ${bench?.opsSec || '120,400 ops/sec'}`,
        `Latency (p99):   ${bench?.p99Latency || '1.18 ms'}`,
        `Resident Memory: ${bench?.memoryFootprint || '38.4 MB'}`,
        `Summary:         ${bench?.summary || 'Verification passed.'}`,
        `=============================================================`,
      ]);
      setIsBenchmarking(false);
      soundFx.playSuccess();
    }, 1600);
  };

  const handleCopyClone = (repoUrl: string) => {
    navigator.clipboard.writeText(`git clone ${repoUrl}.git`);
    setCopiedClone(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0f17] text-gray-200 select-text relative">
      {/* Explorer Top Toolbar */}
      <div className="p-3 bg-[#111726] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Layers className="w-4 h-4 text-emerald-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                soundFx.playClick();
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[var(--accent)] text-black font-semibold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, stack (Rust, React...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-black/40 border border-white/10 rounded-md text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between rounded-xl bg-[#131b2e]/80 border border-white/10 hover:border-[var(--accent)]/60 transition-all duration-200 p-4 shadow-lg hover:shadow-xl hover:shadow-[var(--accent)]/5 cursor-pointer"
              onClick={() => handleOpenDeepDive(project)}
            >
              <div>
                {/* Header: Title + Category Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold font-mono text-white group-hover:text-[var(--accent)] transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--accent)] font-mono mt-0.5">{project.tagline}</p>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                    {project.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  {project.description}
                </p>

                {/* Problem & Solution Callouts */}
                <div className="space-y-1.5 mb-3 text-[11px] font-sans">
                  <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 flex items-start gap-1.5 text-gray-300">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-red-300 font-mono">Problem: </span>
                      {project.problem}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-1.5 text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-emerald-300 font-mono">Solution: </span>
                      {project.solution}
                    </div>
                  </div>
                </div>

                {/* Impact / Performance Metric */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300/90 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 mb-3">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{project.metrics}</span>
                </div>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-3">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                      }}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[var(--accent)] hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                      }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live / Demo</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeepDive(project);
                  }}
                  className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Workflow className="w-3 h-3" />
                  <span>Architecture Deep Dive &rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400 font-mono text-xs">
            <FolderGit2 className="w-8 h-8 text-gray-600 mb-2" />
            <p>No projects match your filter query.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 text-[var(--accent)] underline hover:opacity-80"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Explorer Footer Status */}
      <div className="px-4 py-1.5 bg-[#111726] border-t border-white/10 text-[11px] font-mono text-gray-500 flex items-center justify-between select-none">
        <span>Showing {filteredProjects.length} of {PROJECTS.length} repositories</span>
        <span className="text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Click any card for Architecture Flow & Live Benchmarks
        </span>
      </div>

      {/* Deep-Dive Architecture & Benchmark Modal */}
      {activeModalProject && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-full overflow-auto rounded-2xl bg-[#0e1424] border border-white/15 p-5 shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-mono text-white">
                    {activeModalProject.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                    {activeModalProject.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 font-mono">{activeModalProject.tagline}</p>
              </div>

              <button
                onClick={() => setActiveModalProject(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Selection Ribbon */}
            <div className="flex flex-wrap bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs font-mono">
              <button
                onClick={() => {
                  setModalTab('simulator');
                  soundFx.playClick();
                }}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  modalTab === 'simulator'
                    ? 'bg-[var(--accent)] text-black font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Simulator & Demo</span>
              </button>
              <button
                onClick={() => {
                  setModalTab('architecture');
                  soundFx.playClick();
                }}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  modalTab === 'architecture'
                    ? 'bg-[var(--accent)] text-black font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Architecture Pipeline</span>
              </button>
              <button
                onClick={() => {
                  setModalTab('benchmark');
                  soundFx.playClick();
                }}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  modalTab === 'benchmark'
                    ? 'bg-[var(--accent)] text-black font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Stress Benchmark</span>
              </button>
            </div>

            {/* Tab 1: Interactive Live Simulator */}
            {modalTab === 'simulator' && (
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10">
                <ProjectSimulator project={activeModalProject} />
              </div>
            )}

            {/* Tab 2: Architecture Steps Sequence */}
            {modalTab === 'architecture' && activeModalProject.architectureSteps && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5" />
                  <span>Execution Pipeline & Data Flow</span>
                </h4>
                <div className="space-y-1.5">
                  {activeModalProject.architectureSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-start gap-2.5 text-xs text-gray-300"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] flex items-center justify-center font-mono text-cyan-300 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Benchmark Simulator Section */}
            {modalTab === 'benchmark' && (
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Live Workload Benchmark Simulator
                  </span>

                  <button
                    onClick={() => handleRunBenchmark(activeModalProject)}
                    disabled={isBenchmarking}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all active:scale-95"
                  >
                    <Play className="w-3 h-3" />
                    <span>{isBenchmarking ? 'Simulating...' : 'Run Benchmark'}</span>
                  </button>
                </div>

                {benchmarkLogs.length > 0 ? (
                  <div className="p-2.5 rounded-lg bg-black/80 border border-white/10 font-mono text-[11px] text-emerald-400 space-y-1">
                    {benchmarkLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-black/40 border border-white/5 text-center text-xs text-gray-400 font-mono">
                    Click "Run Benchmark" to execute synthetic workload analysis against {activeModalProject.title}.
                  </div>
                )}
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopyClone(activeModalProject.repoUrl || 'https://github.com/jeptha')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
              >
                {copiedClone ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Command Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy `git clone`</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
