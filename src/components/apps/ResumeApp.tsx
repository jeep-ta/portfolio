import React, { useState } from 'react';
import { PERSONAL_INFO, PROJECTS } from '../../data/portfolioData';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  GraduationCap,
  Code2,
  FolderGit2,
  Target
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { soundFx } from '../../utils/audio';

const RESUME_MARKDOWN = `# JEPTHA OSORIO
Computer Science Student & Aspiring Software Engineer
Location: Philippines (UTC+8) • Remote Worldwide
Email: ${PERSONAL_INFO.email}
GitHub: ${PERSONAL_INFO.github}
LinkedIn: ${PERSONAL_INFO.linkedin}

--------------------------------------------------------------------------------
1. OBJECTIVE & TARGET ROLES
--------------------------------------------------------------------------------
* Software Engineering Intern / OJT Student Trainee
* Junior Full-Stack Developer (React, Next.js, Node.js, TypeScript)
* Junior Backend / API Developer (Node.js, Express, PostgreSQL/MySQL)

Motivated Computer Science student (BSCS) with a solid foundation in modern reactive web
architectures, relational database modeling, and desktop system utilities. Actively seeking
internship and junior software engineering roles to contribute clean, reliable code.

--------------------------------------------------------------------------------
2. EDUCATION
--------------------------------------------------------------------------------
Bachelor of Science in Computer Science (BSCS)
Location: Philippines
Key Coursework:
* Data Structures & Algorithms, Object-Oriented Programming (Java, C#)
* Database Management Systems (PostgreSQL, MySQL, Schema Normalization)
* Full-Stack Web Development, Modern Frontend Frameworks, RESTful API Design
* Systems Architecture, Software Engineering Lifecycle & Methodologies

--------------------------------------------------------------------------------
3. TECHNICAL COMPETENCIES
--------------------------------------------------------------------------------
* Languages: TypeScript, JavaScript (ES2024), Python, Java, C#, SQL, HTML5, CSS3
* Frontend & Frameworks: React 19, Next.js, Tailwind CSS, Vite, JavaFX / Swing
* Backend & Databases: Node.js, Express, PostgreSQL, MySQL, REST APIs, JWT Auth
* Developer Tooling: Git, GitHub, Linux / Bash Terminal, Postman, CI/CD Actions

--------------------------------------------------------------------------------
4. KEY PROJECTS
--------------------------------------------------------------------------------
* CITSC Student Payment System (Java, MySQL, JDBC)
  - Developed full-featured student payment and fee clearance ledger for student council.
  - Automated clearance verification and eliminated paper receipt discrepancy.
  - Repo: https://github.com/jeep-ta/citsc-student-payment

* Smart Lost and Found System (Java, JavaFX, Algorithms)
  - Built campus recovery desktop application featuring tokenized similarity matching.
  - Enabled rapid attribute searching and automated item claim validation.
  - Repo: https://github.com/jeep-ta/Smart-Lost-and-Found-System

* Birb Conservation & Edu Portal (JavaScript, HTML5, Modern CSS)
  - Designed responsive avian biodiversity platform with dynamic dark mode and 100/100 Lighthouse.
  - Repo: https://github.com/jeep-ta/Birb

* umaWeb Chrome Extension (JavaScript, Manifest V3, Web Audio)
  - Created Chromium extension featuring 60fps DOM sprite physics loop and volume controls.
  - Repo: https://github.com/jeep-ta/umaWeb

* NASA Space Apps Challenge Explorer (TypeScript, React)
  - Hackathon submission visualizing open planetary observation datasets through interactive charts.
  - Repo: https://github.com/jeep-ta/NASA-Challenge

* Doomscroll Guard - Skyrim Edition (Python, OpenCV, MediaPipe)
  - Engineered computer vision engagement monitor deterrence tool tracking focus decay.
  - Repo: https://github.com/jeep-ta/Doomscroll-Skyrim-Edition
`;

export const ResumeApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<'document' | 'raw'>('document');
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(RESUME_MARKDOWN);
    setCopied(true);
    soundFx.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    soundFx.playClick();
    const blob = new Blob([RESUME_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Jeptha_Osorio_Resume.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    soundFx.playSuccess();
  };

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <>
      {/* =========================================================================
          1. INTERACTIVE DESKTOP OS APPLICATION (Displayed on screen; hidden on print)
          ========================================================================= */}
      <div className="h-full flex flex-col bg-[#0b0f19] text-gray-200 select-text font-sans text-xs print:hidden">
        {/* Top Application Ribbon */}
        <div className="resume-top-ribbon p-2.5 sm:p-3 bg-[#111728] border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5 select-none">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs font-mono flex items-center gap-2">
                <span>Resume.pdf</span>
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  A4 Standard Format
                </span>
              </div>
              <div className="text-[10px] text-gray-400 font-mono">Jeptha Osorio // BSCS Candidate</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-[11px] font-mono">
              <button
                onClick={() => {
                  setViewMode('document');
                  soundFx.playClick();
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'document'
                    ? 'bg-[var(--accent)] text-black font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Document View
              </button>
              <button
                onClick={() => {
                  setViewMode('raw');
                  soundFx.playClick();
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-[var(--accent)] text-black font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Raw Markdown
              </button>
            </div>

            {/* Print / Save as PDF */}
            <button
              onClick={handlePrint}
              title="Print or Save as PDF"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-white transition-all text-[11px] font-mono shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Download Markdown */}
            <button
              onClick={handleDownloadMarkdown}
              title="Download Clean Markdown Resume"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-[11px] font-mono active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Download .md</span>
            </button>

            {/* Copy Markdown */}
            <button
              onClick={handleCopyMarkdown}
              title="Copy Resume Content"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-[11px] font-mono active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {viewMode === 'raw' ? (
          <div className="flex-1 overflow-auto p-4 bg-[#0a0d14] font-mono text-xs leading-relaxed text-gray-300">
            <pre className="whitespace-pre-wrap selection:bg-rose-500/30">{RESUME_MARKDOWN}</pre>
          </div>
        ) : (
          /* Formatted Desktop A4 Paper Preview */
          <div className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center bg-[#07090f]/70">
            <div className="w-full max-w-3xl bg-[#0f1422] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl text-gray-200">
              
              {/* Header Identity & Contact */}
              <div className="border-b border-white/10 pb-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                      JEPTHA OSORIO
                    </h1>
                    <p className="text-sm text-[var(--accent)] font-mono font-medium mt-1">
                      Computer Science Student & Aspiring Software Engineer
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Philippines (UTC+8) • Remote Worldwide • Open for Opportunities
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 font-mono text-xs text-gray-300">
                    <a 
                      href={`mailto:${PERSONAL_INFO.email}`} 
                      className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{PERSONAL_INFO.email}</span>
                    </a>
                    <a 
                      href={PERSONAL_INFO.github} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-sky-400 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-sky-400" />
                      <span>github.com/jeep-ta</span>
                    </a>
                    <a 
                      href={PERSONAL_INFO.linkedin} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>linkedin.com/in/jepthaosorio</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Target Career Roles / Objective */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                  <Target className="w-4 h-4" />
                  <span>Target Roles & Availability</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white">
                    Software Engineering Intern / OJT Student Trainee
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white">
                    Junior Full-Stack Developer (React / Node / TS)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white">
                    Junior Backend / API Developer (Node / Express / SQL)
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed pt-1">
                  Passionate Computer Science student with practical experience building responsive web systems, relational database models, and algorithmic desktop applications. Dedicated to writing clean, maintainable, and type-safe software that solves concrete problems.
                </p>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </div>
                <div className="p-3.5 rounded-lg bg-black/30 border border-white/5 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                    <span className="font-bold text-white font-mono">Bachelor of Science in Computer Science (BSCS)</span>
                    <span className="text-xs text-emerald-400 font-mono">Undergraduate Candidate</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Focus: Data Structures, Object-Oriented Systems, Web Architectures, Database Schema Normalization & Software Engineering Lifecycle.
                  </div>
                </div>
              </div>

              {/* Technical Skills Matrix */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                  <Code2 className="w-4 h-4" />
                  <span>Technical Skills & Core Stack</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <span className="font-mono font-semibold text-white">Languages</span>
                    <p className="text-gray-300">TypeScript, JavaScript (ES2024), Python, Java, C#, SQL, HTML5, CSS3</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <span className="font-mono font-semibold text-white">Frontend & UI</span>
                    <p className="text-gray-300">React 19, Next.js, Tailwind CSS, Vite, Responsive Design, Web Audio API</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <span className="font-mono font-semibold text-white">Backend & Databases</span>
                    <p className="text-gray-300">Node.js, Express, PostgreSQL, MySQL, RESTful API Design, JWT Authentication</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <span className="font-mono font-semibold text-white">Developer Tooling</span>
                    <p className="text-gray-300">Git / GitHub (@jeep-ta), Linux / POSIX Shell, Postman API Testing, VS Code</p>
                  </div>
                </div>
              </div>

              {/* Featured Academic & Personal Projects */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  <FolderGit2 className="w-4 h-4" />
                  <span>Featured Engineering Projects</span>
                </div>
                <div className="space-y-3">
                  {PROJECTS.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-lg bg-black/30 border border-white/5 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="font-mono font-bold text-white text-xs flex items-center gap-2">
                          <span>{p.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 font-normal">
                            {p.category}
                          </span>
                        </div>
                        {p.repoUrl && (
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
                          >
                            <span>Repository</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-300">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.techStack.map((tech) => (
                          <span key={tech} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. DEDICATED EXECUTIVE PRINT DOCUMENT (Rendered ONLY in window.print() / PDF)
          Pristine A4 typography, zero dark box borders, zero clipped margins.
          ========================================================================= */}
      <div className="hidden print:block resume-print-document font-sans text-slate-900 bg-white">
        {/* Header: Name, Title, and Direct Contact Row */}
        <header className="border-b-2 border-slate-900 pb-3 mb-3">
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              {PERSONAL_INFO.name}
            </h1>
            <span className="text-xs font-semibold text-emerald-800">
              {PERSONAL_INFO.degree}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-700 mt-0.5">
            {PERSONAL_INFO.role}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2 font-mono">
            <span>{PERSONAL_INFO.email}</span>
            <span>•</span>
            <span>{PERSONAL_INFO.location}</span>
            <span>•</span>
            <span className="font-semibold text-slate-800">github.com/jeep-ta</span>
            <span>•</span>
            <span className="font-semibold text-slate-800">linkedin.com/in/jepthaosorio</span>
          </div>
        </header>

        {/* Section: Objective & Target Roles */}
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Target Roles & Objective
          </h2>
          <div className="text-[11px] text-slate-800 mb-1">
            <span className="font-bold text-slate-900">Seeking: </span>
            Software Engineering Intern / OJT Trainee • Junior Full-Stack Developer • Junior Backend / API Developer
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            Computer Science student (BSCS) with practical experience building reactive web systems, normalized relational databases, and algorithmic desktop tools. Dedicated to writing clean, maintainable, and type-safe software that delivers reliable performance.
          </p>
        </section>

        {/* Section: Education */}
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
            <span>Bachelor of Science in Computer Science (BSCS)</span>
            <span className="text-[11px] font-normal text-slate-600">Philippines • Undergraduate Candidate</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5">
            <span className="font-semibold text-slate-800">Key Coursework: </span>
            Data Structures & Algorithms, Object-Oriented Programming (Java, C#), Database Management Systems (PostgreSQL, MySQL), Full-Stack Web Development, RESTful API Design, Systems Architecture & Software Engineering Lifecycle.
          </p>
        </section>

        {/* Section: Technical Competencies */}
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Technical Skills & Core Stack
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
            <div>
              <span className="font-bold text-slate-900">Languages: </span>
              <span className="text-slate-700">TypeScript, JavaScript (ES2024), Python, Java, C#, SQL, HTML5, CSS3</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Frontend & UI: </span>
              <span className="text-slate-700">React 19, Next.js, Tailwind CSS, Vite, Responsive Web Design, Web Audio API</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Backend & Databases: </span>
              <span className="text-slate-700">Node.js, Express, PostgreSQL, MySQL, RESTful APIs, JWT Auth</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Developer Tooling: </span>
              <span className="text-slate-700">Git, GitHub (@jeep-ta), Linux / POSIX Bash Shell, Postman, CI/CD</span>
            </div>
          </div>
        </section>

        {/* Section: Featured Engineering Projects */}
        <section className="mb-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Featured Engineering Projects
          </h2>

          <div className="space-y-2.5">
            {PROJECTS.map((p) => (
              <div key={p.id} className="print-avoid-break pb-2 border-b border-slate-100 last:border-0">
                <div className="flex justify-between items-baseline text-xs mb-0.5">
                  <div>
                    <span className="font-bold text-slate-900">{p.title}</span>
                    <span className="text-slate-500 text-[10px] ml-2 font-mono">[{p.category}]</span>
                  </div>
                  {p.repoUrl && (
                    <span className="text-[10px] font-mono text-slate-600">
                      {p.repoUrl.replace('https://', '')}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-700 leading-snug">
                  {p.description}
                </p>

                {p.metrics && (
                  <p className="text-[10.5px] text-emerald-800 font-medium mt-0.5">
                    Impact: {p.metrics}
                  </p>
                )}

                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Stack: {p.techStack.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
