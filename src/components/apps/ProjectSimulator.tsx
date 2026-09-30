import React, { useState, useEffect } from 'react';
import type { Project } from '../../types';
import { 
  ExternalLink, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  ShieldAlert, 
  Globe
} from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface ProjectSimulatorProps {
  project: Project;
}

export const ProjectSimulator: React.FC<ProjectSimulatorProps> = ({ project }) => {
  // 1. Birb Simulator State
  const [birbViewport, setBirbViewport] = useState<'desktop' | 'mobile'>('desktop');

  // 2. Smart Lost and Found Simulator State
  const [lostQuery, setLostQuery] = useState('Blue Hydro Flask water bottle with stickers');
  const [similarityThreshold, setSimilarityThreshold] = useState(65);

  const MOCK_FOUND_ITEMS = [
    {
      id: 'F-104',
      title: 'Hydro Flask 32oz Tumbler (Navy Blue)',
      location: 'CIT Science Building Room 302',
      date: '2026-09-28',
      keywords: ['hydro', 'flask', 'blue', 'bottle', 'stickers', 'tumbler'],
      claimed: false,
    },
    {
      id: 'F-108',
      title: 'Casio Scientific Calculator FX-991ES Plus',
      location: 'CIT Library 2nd Floor Study Nook',
      date: '2026-09-27',
      keywords: ['casio', 'calculator', 'scientific', 'fx991es'],
      claimed: false,
    },
    {
      id: 'F-112',
      title: 'Navy Blue ID Lanyard with RFID Pass',
      location: 'Student Activity Center Canteen',
      date: '2026-09-29',
      keywords: ['lanyard', 'id', 'blue', 'rfid', 'pass'],
      claimed: true,
    },
    {
      id: 'F-119',
      title: 'Logitech Wireless Mouse (Dark Gray)',
      location: 'Computer Laboratory 4 (CIT)',
      date: '2026-09-30',
      keywords: ['logitech', 'mouse', 'wireless', 'usb'],
      claimed: false,
    }
  ];

  // Token-based Jaccard similarity scorer
  const calculateMatch = (query: string, itemKeywords: string[]) => {
    const queryTokens = query.toLowerCase().split(/\W+/).filter(Boolean);
    if (queryTokens.length === 0) return 0;
    let matchCount = 0;
    queryTokens.forEach((token) => {
      if (itemKeywords.some((k) => k.includes(token) || token.includes(k))) {
        matchCount++;
      }
    });
    return Math.min(98, Math.round((matchCount / Math.max(queryTokens.length, 3)) * 100));
  };

  // 3. CITSC Payment System State
  const MOCK_STUDENTS = [
    {
      id: '2024-10492',
      name: 'Jeptha Osorio',
      course: '4th Year BSCS',
      fees: [
        { name: 'CITSC Student Council Fee', amount: 350, status: 'Paid' },
        { name: 'College Organizational Shirt', amount: 550, status: 'Paid' },
        { name: 'Departmental Lab Insurance', amount: 300, status: 'Paid' },
      ],
      totalDue: 1200,
      totalPaid: 1200,
      clearanceStatus: 'VALIDATED_CLEAR',
      hash: '0x8f2a9c14de09e2',
    },
    {
      id: '2025-08192',
      name: 'Maria Santos',
      course: '3rd Year BSIT',
      fees: [
        { name: 'CITSC Student Council Fee', amount: 350, status: 'Paid' },
        { name: 'College Organizational Shirt', amount: 550, status: 'Pending' },
        { name: 'Departmental Lab Insurance', amount: 300, status: 'Pending' },
      ],
      totalDue: 1200,
      totalPaid: 350,
      clearanceStatus: 'PENDING_FEES',
      hash: '0x3c71a09d41b5f6',
    },
    {
      id: '2026-00412',
      name: 'Kenji Ramos',
      course: '1st Year BSCS',
      fees: [
        { name: 'CITSC Student Council Fee', amount: 350, status: 'Paid' },
        { name: 'College Organizational Shirt', amount: 550, status: 'Paid' },
        { name: 'Departmental Lab Insurance', amount: 300, status: 'Paid' },
      ],
      totalDue: 1200,
      totalPaid: 1200,
      clearanceStatus: 'VALIDATED_CLEAR',
      hash: '0x99e4b01fa288c1',
    }
  ];
  const [selectedStudentId, setSelectedStudentId] = useState('2024-10492');
  const activeStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId) || MOCK_STUDENTS[0];

  // 4. umaWeb State
  const [spriteSpeed, setSpriteSpeed] = useState(2);
  const [chibiCount, setChibiCount] = useState(3);
  const [spriteWalkX, setSpriteWalkX] = useState(20);

  useEffect(() => {
    if (project.id !== 'umaweb-extension') return;
    const interval = setInterval(() => {
      setSpriteWalkX((prev) => (prev > 90 ? 5 : prev + spriteSpeed * 1.5));
    }, 100);
    return () => clearInterval(interval);
  }, [project.id, spriteSpeed]);

  // 5. Doomscroll Guard State
  const [attentionLevel, setAttentionLevel] = useState(88);
  const [distractionTriggered, setDistractionTriggered] = useState(false);

  const handleSimulateDistraction = () => {
    soundFx.playError();
    setAttentionLevel(22);
    setDistractionTriggered(true);
    setTimeout(() => {
      setDistractionTriggered(false);
      setAttentionLevel(88);
    }, 3500);
  };

  // 6. NASA Space Apps State
  const [planetaryTarget, setPlanetaryTarget] = useState<'Earth' | 'Mars' | 'ISS'>('Earth');

  // Render Project-Specific Simulators
  switch (project.id) {
    case 'birb-portal':
      return (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Live Web Portal Sandbox</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-black/60 p-0.5 rounded border border-white/10 text-[10px]">
                <button
                  onClick={() => setBirbViewport('desktop')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded ${birbViewport === 'desktop' ? 'bg-[var(--accent)] text-black font-semibold' : 'text-gray-400'}`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setBirbViewport('mobile')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded ${birbViewport === 'mobile' ? 'bg-[var(--accent)] text-black font-semibold' : 'text-gray-400'}`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>

              <a
                href="https://jeep-ta.github.io/Birb/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-sky-400 hover:text-white transition-all"
              >
                <span>Full Window</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex justify-center bg-black/80 p-2 rounded-xl border border-white/10 overflow-hidden">
            <div 
              style={{ width: birbViewport === 'mobile' ? '375px' : '100%', height: '360px' }}
              className="rounded-lg overflow-hidden border border-white/10 bg-white transition-all duration-300 relative shadow-inner"
            >
              <iframe
                src="https://jeep-ta.github.io/Birb/"
                title="Birb Conservation Platform Live View"
                className="w-full h-full border-none"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      );

    case 'smart-lost-and-found':
      return (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Algorithmic String Similarity Search Engine
              </span>
              <span className="text-[10px] text-gray-400">Jaccard Token Model</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={lostQuery}
                onChange={(e) => setLostQuery(e.target.value)}
                placeholder="Describe lost item (e.g. Blue Hydro Flask tumbler with stickers)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/70 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-gray-400">Presets:</span>
              {[
                'Blue Hydro Flask with stickers',
                'Casio FX-991ES calculator',
                'Navy ID lanyard RFID pass',
                'Logitech USB mouse'
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setLostQuery(preset);
                    soundFx.playClick();
                  }}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <span>Similarity Match Threshold: {similarityThreshold}%</span>
              <input
                type="range"
                min="30"
                max="90"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                className="w-28 accent-[var(--accent)] cursor-pointer"
              />
            </div>
          </div>

          {/* Results Match List */}
          <div className="space-y-2">
            <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
              Live Database Candidates ({MOCK_FOUND_ITEMS.length} indexed records)
            </div>
            {MOCK_FOUND_ITEMS.map((item) => {
              const score = calculateMatch(lostQuery, item.keywords);
              const isMatch = score >= similarityThreshold;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isMatch
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-black/30 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-xs">{item.title}</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        score > 75 ? 'bg-emerald-500/20 text-emerald-400' : score > 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {score}% MATCH
                      </span>
                      {isMatch && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          <span>Candidate</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 flex items-center justify-between">
                    <span>Found at: {item.location}</span>
                    <span>Logged: {item.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'citsc-student-payment':
      return (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                CITSC Student Clearance & Fee Ledger Simulator
              </span>
              <span className="text-[10px] text-gray-400">MySQL / JDBC Backend</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-gray-400 text-xs">Select Test Student:</span>
              <div className="flex gap-1.5">
                {MOCK_STUDENTS.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStudentId(st.id);
                      soundFx.playClick();
                    }}
                    className={`px-2 py-1 rounded text-[11px] border transition-all ${
                      selectedStudentId === st.id
                        ? 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {st.name} ({st.id})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student Ledger Card */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <div className="text-white font-bold text-sm">{activeStudent.name}</div>
                <div className="text-[11px] text-gray-400 font-mono">{activeStudent.course} • ID #{activeStudent.id}</div>
              </div>
              <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                activeStudent.clearanceStatus === 'VALIDATED_CLEAR'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {activeStudent.clearanceStatus === 'VALIDATED_CLEAR' ? 'CLEARANCE APPROVED' : 'BALANCE PENDING'}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] text-gray-400 font-semibold">Academic Department Fee Breakdown:</div>
              {activeStudent.fees.map((fee, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-black/40 text-xs text-gray-300">
                  <span>{fee.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono">₱{fee.amount.toFixed(2)}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                      fee.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {fee.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-bold">
              <span className="text-gray-400">Total Balance Paid:</span>
              <span className={activeStudent.totalPaid === activeStudent.totalDue ? 'text-emerald-400' : 'text-amber-400'}>
                ₱{activeStudent.totalPaid.toFixed(2)} / ₱{activeStudent.totalDue.toFixed(2)}
              </span>
            </div>

            <div className="text-[10px] font-mono text-gray-500 truncate pt-1">
              Audit Hash Verification: {activeStudent.hash} (SHA-256 Validated)
            </div>
          </div>
        </div>
      );

    case 'umaweb-extension':
      return (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <span className="text-pink-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Chromium Extension Physics & Audio Sandbox
            </span>
            <p className="text-[11px] text-gray-400">
              Interactive physics loop controlling sprite speed, density, and sound effects across host DOM viewports.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] text-gray-400">Sprite Movement Speed ({spriteSpeed}x)</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={spriteSpeed}
                  onChange={(e) => setSpriteSpeed(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400">Chibi Population ({chibiCount} units)</label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={chibiCount}
                  onChange={(e) => setChibiCount(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Interactive Walking Sprite Canvas Simulation */}
          <div className="h-32 rounded-xl bg-black/70 border border-white/10 relative overflow-hidden flex flex-col justify-end p-3">
            <div className="absolute top-2 left-3 text-[10px] text-gray-500 font-mono">
              Simulated Host Viewport Bottom Rail
            </div>
            
            {/* Animated Chibi Sprites Container */}
            <div className="relative w-full h-12 border-b border-pink-500/30">
              {Array.from({ length: chibiCount }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    left: `${Math.min(92, Math.max(2, (spriteWalkX + idx * 18) % 100))}%`,
                    transition: 'left 0.1s linear',
                  }}
                  className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/60 flex items-center justify-center text-xs shadow-md shadow-pink-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                  </div>
                  <span className="text-[9px] text-pink-300 font-bold">Chibi-{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'doomscroll-guard':
      return (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Computer Vision Engagement Guardian (OpenCV Simulator)
            </span>
            <p className="text-[11px] text-gray-400">
              Active webcam tracking pipeline monitoring eye gaze and head pose engagement. Intercepts study distraction with instant meme alerts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/70 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Live Engagement Score:</span>
              <span className={`font-bold font-mono text-sm ${attentionLevel > 60 ? 'text-emerald-400' : 'text-red-400'}`}>
                {attentionLevel}% {attentionLevel > 60 ? 'FOCUSED' : 'DISTRACTED'}
              </span>
            </div>

            {/* Gauge Bar */}
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${attentionLevel}%` }}
                className={`h-full transition-all duration-300 ${attentionLevel > 60 ? 'bg-emerald-400' : 'bg-red-500'}`}
              />
            </div>

            {distractionTriggered ? (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 font-bold flex items-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>[SHIELD RAISED] Focus drift detected! Playing Skyrim Skeleton Shield deterrence sound!</span>
              </div>
            ) : (
              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-gray-400">Webcam tracking active (30 FPS simulated)</span>
                <button
                  onClick={handleSimulateDistraction}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 hover:text-white transition-all text-xs font-bold"
                >
                  Simulate Focus Loss
                </button>
              </div>
            )}
          </div>
        </div>
      );

    case 'nasa-space-apps':
      return (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <span className="text-sky-400 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Planetary Telemetry & Open Data Visualizer
            </span>
            <div className="flex gap-2 pt-1">
              {(['Earth', 'Mars', 'ISS'] as const).map((target) => (
                <button
                  key={target}
                  onClick={() => {
                    setPlanetaryTarget(target);
                    soundFx.playClick();
                  }}
                  className={`px-3 py-1 rounded text-xs border transition-all ${
                    planetaryTarget === target
                      ? 'bg-sky-500 text-black font-bold border-sky-400'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {target} Observation Feed
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-black/60 border border-white/10">
              <div className="text-[10px] text-gray-400">Surface Temperature</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {planetaryTarget === 'Earth' ? '+15.4 °C' : planetaryTarget === 'Mars' ? '-62.8 °C' : '+24.1 °C (Cabin)'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/60 border border-white/10">
              <div className="text-[10px] text-gray-400">Spectral Bandwidth</div>
              <div className="text-lg font-bold text-sky-400 mt-0.5">
                {planetaryTarget === 'Earth' ? '0.45 - 2.35 μm' : planetaryTarget === 'Mars' ? '1.02 - 3.89 μm' : 'Telemetry Sync'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/60 border border-white/10">
              <div className="text-[10px] text-gray-400">Atmospheric Density</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {planetaryTarget === 'Earth' ? '101.3 kPa' : planetaryTarget === 'Mars' ? '0.636 kPa' : 'Vacuum Orbit'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/60 border border-white/10">
              <div className="text-[10px] text-gray-400">Data Stream Status</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                100% ONLINE
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
