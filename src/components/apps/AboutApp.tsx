import React, { useState } from 'react';
import { ABOUT_FILE_CONTENT, PERSONAL_INFO } from '../../data/portfolioData';
import { Copy, Check, FileCode, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const AboutApp: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'rendered'>('editor');

  const lines = ABOUT_FILE_CONTENT.trim().split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(ABOUT_FILE_CONTENT);
    setCopied(true);
    soundFx.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1117] text-gray-200 font-mono text-xs select-text">
      {/* Editor Sub-toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-mono text-gray-400">
            SYSTEM // BIO_DATA
          </span>
          <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
            SYNCED
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab buttons */}
          <div className="flex bg-black/40 p-0.5 rounded border border-white/10 text-[10px]">
            <button
              onClick={() => {
                setActiveTab('editor');
                soundFx.playClick();
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'editor' ? 'bg-[var(--accent)] text-black font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Raw Text
            </button>
            <button
              onClick={() => {
                setActiveTab('rendered');
                soundFx.playClick();
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'rendered' ? 'bg-[var(--accent)] text-black font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Profile View
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95"
            title="Copy file content"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === 'editor' ? (
        <div className="flex-1 overflow-auto p-3 flex font-mono text-[13px] leading-relaxed">
          {/* Line Numbers Gutter */}
          <div className="select-none text-right pr-3 mr-3 border-r border-white/10 text-gray-600 font-mono">
            {lines.map((_, i) => (
              <div key={i} className="leading-relaxed">
                {String(i + 1).padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Code Text Content */}
          <div className="flex-1 whitespace-pre-wrap text-gray-300">
            {lines.map((line, i) => {
              // Syntax colorizing logic for clean markdown feel
              let lineClass = 'text-gray-300';
              if (line.startsWith('# ')) {
                lineClass = 'text-emerald-400 font-bold text-[14px]';
              } else if (line.startsWith('Role:') || line.startsWith('Specialization:') || line.startsWith('Location:')) {
                lineClass = 'text-cyan-300 font-medium';
              } else if (line.match(/^[0-9]\./)) {
                lineClass = 'text-sky-400 font-bold';
              } else if (line.startsWith('---') || line.startsWith('===')) {
                lineClass = 'text-gray-600';
              } else if (line.includes('[x]') || line.includes('[ONLINE]')) {
                lineClass = 'text-emerald-400 font-semibold';
              } else if (line.startsWith('* 20')) {
                lineClass = 'text-amber-400 font-semibold';
              } else if (line.startsWith('"') && line.endsWith('"')) {
                lineClass = 'text-teal-300 italic';
              }

              return (
                <div key={i} className={`${lineClass} leading-relaxed hover:bg-white/[0.03]`}>
                  {line || '\u00A0'}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Formatted Bio Card View */
        <div className="flex-1 overflow-auto p-6 space-y-6 font-sans text-sm">
          {/* Header profile banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-4">
              {/* Profile Avatar Frame */}
              <div className="relative shrink-0 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20 bg-black/60">
                  <img
                    src={PERSONAL_INFO.avatar}
                    alt={PERSONAL_INFO.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Online pulse indicator */}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0b0e14] shadow-sm shadow-emerald-400/50" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-mono text-white">{PERSONAL_INFO.name}</h1>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Open for opportunities
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1 font-mono">{PERSONAL_INFO.role}</p>
                <p className="text-cyan-400/90 text-xs font-mono">{PERSONAL_INFO.degree}</p>
                <p className="text-gray-500 text-xs mt-0.5">{PERSONAL_INFO.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-gray-400 bg-black/40 px-3 py-2 rounded-lg border border-white/5 shrink-0">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span>{PERSONAL_INFO.status}</span>
            </div>
          </div>

          {/* Philosophy */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent border border-emerald-500/20">
            <h3 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold mb-1">
              Core Philosophy
            </h3>
            <p className="text-gray-200 italic font-serif text-sm">"{PERSONAL_INFO.philosophy}"</p>
          </div>

          {/* Technical Bio */}
          <div>
            <h3 className="text-xs uppercase font-mono tracking-wider text-sky-400 font-bold mb-2">
              Background & Architectural Focus
            </h3>
            <div className="text-gray-300 leading-relaxed space-y-2 text-sm">
              <p>{PERSONAL_INFO.bio}</p>
              <p>
                Experienced in developing responsive web apps, student clearance & ledger portals, desktop utilities in Java/JavaFX, and modern frontend interfaces with clean, maintainable component design.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#161b22] border-t border-white/10 text-[10px] text-gray-500 select-none">
        <div className="flex items-center gap-3">
          <span>LF</span>
          <span>UTF-8</span>
          <span>Markdown</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Lines: {lines.length}</span>
          <span className="text-emerald-400 font-mono">100% CLEAN</span>
        </div>
      </div>
    </div>
  );
};
