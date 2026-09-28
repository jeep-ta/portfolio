import { useState } from 'react';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import type { SkillItem } from '../../types';
import { 
  Cpu, 
  Check, 
  Copy, 
  Activity, 
  HardDrive, 
  Server,
  Zap
} from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const SkillsApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<'visual' | 'config'>('visual');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('languages');
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const activeCategory = SKILL_CATEGORIES.find((c) => c.id === activeCategoryId) || SKILL_CATEGORIES[0];

  const configJson = JSON.stringify(
    {
      system: 'JepthaOS Architecture & Skill Matrix',
      version: '2026.4',
      specification: 'High-Throughput Engineering',
      categories: SKILL_CATEGORIES,
    },
    null,
    2
  );

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(configJson);
    setCopiedConfig(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0c101c] text-gray-200 select-text font-mono text-xs">
      {/* Top Header / Mode Switcher */}
      <div className="p-3 bg-[#13192b] border-b border-white/10 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-white text-xs">Skills.conf</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Inspector Mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-black/40 p-0.5 rounded border border-white/10 text-[11px]">
            <button
              onClick={() => {
                setViewMode('visual');
                soundFx.playClick();
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'visual'
                  ? 'bg-[var(--accent)] text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Visual Diagnostics
            </button>
            <button
              onClick={() => {
                setViewMode('config');
                soundFx.playClick();
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'config'
                  ? 'bg-[var(--accent)] text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              JSON Config
            </button>
          </div>

          {viewMode === 'config' && (
            <button
              onClick={handleCopyConfig}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-[11px]"
              title="Copy JSON Config"
            >
              {copiedConfig ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {viewMode === 'visual' ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Category Sidebar */}
          <div className="w-full md:w-56 p-3 bg-black/30 border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col gap-1.5 overflow-x-auto select-none">
            <div className="hidden md:block text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1 px-2">
              Diagnostic Trees
            </div>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  soundFx.playClick();
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                  activeCategoryId === cat.id
                    ? 'bg-white/10 text-white font-semibold border border-white/10 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-gray-400 ml-2">
                  {cat.skills.length}
                </span>
              </button>
            ))}

            {/* Live System Diagnostics summary */}
            <div className="hidden md:block mt-auto pt-3 border-t border-white/10 space-y-2 text-[10px] text-gray-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Telemetry
                </span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-cyan-400" />
                  Stack Depth
                </span>
                <span>Full Tier</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Server className="w-3 h-3 text-purple-400" />
                  Concurrency
                </span>
                <span>Async / Lock-Free</span>
              </div>
            </div>
          </div>

          {/* Right Skills Grid & Interactive Inspector */}
          <div className="flex-1 flex flex-col overflow-auto p-4 sm:p-5">
            {/* Category Banner */}
            <div className="mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{activeCategory.name}</span>
                <span className="text-xs font-normal text-gray-400">
                  // {activeCategory.skills.length} inspected modules
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-sans">{activeCategory.description}</p>
            </div>

            {/* Skills Readout Bars / Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {activeCategory.skills.map((skill) => (
                <div
                  key={skill.name}
                  onMouseEnter={() => {
                    setHoveredSkill(skill);
                    soundFx.playKeypress();
                  }}
                  className="p-3 rounded-lg bg-black/30 border border-white/10 hover:border-[var(--accent)] transition-all cursor-crosshair group relative"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                      {skill.status}
                    </span>
                  </div>

                  {/* Progress Bar Gauge */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 via-[var(--accent)] to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span className="text-gray-500 font-sans">{skill.tag}</span>
                    <span className="font-mono text-emerald-400 font-medium">{skill.experience}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hovered Skill Inspector Telemetry Box */}
            <div className="mt-auto p-3.5 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-gray-400">Active Node: </span>
                  <span className="text-white font-bold">
                    {hoveredSkill ? hoveredSkill.name : 'Hover over a skill node'}
                  </span>
                </div>
              </div>
              {hoveredSkill && (
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-gray-400">
                    Proficiency: <span className="text-emerald-400 font-bold">{hoveredSkill.level}%</span>
                  </span>
                  <span className="text-gray-400">
                    Exp: <span className="text-cyan-400">{hoveredSkill.experience}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Raw JSON Config View */
        <div className="flex-1 overflow-auto p-4 bg-black/60 font-mono text-[12px] leading-relaxed">
          <pre className="text-emerald-400/90 whitespace-pre-wrap">{configJson}</pre>
        </div>
      )}

      {/* Footer Status Bar */}
      <div className="px-3 py-1 bg-[#13192b] border-t border-white/10 text-[10px] text-gray-500 flex items-center justify-between select-none">
        <span>SCHEMA: POSIX_DIAG_v2</span>
        <span className="text-emerald-400">SYNTAX VALID</span>
      </div>
    </div>
  );
};
