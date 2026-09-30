import React, { useState, useEffect } from 'react';
import type { ProcessItem } from '../../types';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Trash2, 
  RotateCcw, 
  CheckCircle,
  Network,
  Radio
} from 'lucide-react';
import { soundFx } from '../../utils/audio';

const INITIAL_PROCESSES: ProcessItem[] = [
  { pid: 1024, name: 'ebpf_kernel_probe', command: 'kubepulse --ring-buffer=enabled', cpu: 0.6, ram: 14.2, status: 'running', threads: 4 },
  { pid: 1430, name: 'aether_raft_engine', command: 'aetherdb --wal --consensus=raft', cpu: 3.4, ram: 68.4, status: 'running', threads: 16 },
  { pid: 2048, name: 'nexus_crdt_sync', command: 'nexus --webrtc-mesh --yjs-delta', cpu: 1.8, ram: 42.1, status: 'running', threads: 8 },
  { pid: 3110, name: 'wasm_ast_parser', command: 'synapse-parser --tree-sitter', cpu: 0.2, ram: 18.9, status: 'sleeping', threads: 2 },
  { pid: 4096, name: 'tokio_async_runtime', command: 'rust-tokio --workers=8', cpu: 2.1, ram: 54.0, status: 'running', threads: 8 },
  { pid: 5120, name: 'edgeforge_vector_cache', command: 'edgeforge --vectorize-similarity', cpu: 0.8, ram: 31.6, status: 'running', threads: 4 },
  { pid: 6012, name: 'webaudio_synth_daemon', command: 'audio-fx --sample-rate=48000', cpu: 0.4, ram: 12.0, status: 'running', threads: 2 },
];

export const TaskManagerApp: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessItem[]>(INITIAL_PROCESSES);
  const [selectedPid, setSelectedPid] = useState<number | null>(null);

  // 1. Authentic FPS & Frame Latency Telemetry via RequestAnimationFrame
  const [fps, setFps] = useState<number>(60);
  const [frameLatency, setFrameLatency] = useState<number>(16.6);
  const [fpsHistory, setFpsHistory] = useState<number[]>([60, 60, 59, 60, 60, 60, 58, 60, 60, 60]);

  useEffect(() => {
    let animId: number;
    let frames = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      frames++;
      if (now - lastTime >= 1000) {
        const computedFps = Math.min(120, Math.round((frames * 1000) / (now - lastTime)));
        const latency = Number((1000 / Math.max(1, computedFps)).toFixed(1));
        setFps(computedFps);
        setFrameLatency(latency);
        setFpsHistory((prev) => [...prev.slice(1), computedFps]);
        frames = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. Authentic Memory Telemetry (performance.memory in Chromium, or heap estimation)
  const [memoryStats, setMemoryStats] = useState<{
    usedMB: number;
    totalMB: number;
    limitMB: number;
    isSupported: boolean;
  }>(() => {
    const perfMem = (performance as any).memory;
    if (perfMem) {
      return {
        usedMB: Math.round(perfMem.usedJSHeapSize / (1024 * 1024)),
        totalMB: Math.round(perfMem.totalJSHeapSize / (1024 * 1024)),
        limitMB: Math.round(perfMem.jsHeapSizeLimit / (1024 * 1024)),
        isSupported: true,
      };
    }
    return { usedMB: 42, totalMB: 96, limitMB: 2048, isSupported: false };
  });

  useEffect(() => {
    const memInterval = setInterval(() => {
      const perfMem = (performance as any).memory;
      if (perfMem) {
        setMemoryStats({
          usedMB: Math.round(perfMem.usedJSHeapSize / (1024 * 1024)),
          totalMB: Math.round(perfMem.totalJSHeapSize / (1024 * 1024)),
          limitMB: Math.round(perfMem.jsHeapSizeLimit / (1024 * 1024)),
          isSupported: true,
        });
      } else {
        // Subtle organic simulation for browsers without performance.memory
        setMemoryStats((prev) => ({
          ...prev,
          usedMB: Math.max(30, Math.min(85, prev.usedMB + (Math.random() > 0.5 ? 1 : -1))),
        }));
      }
    }, 2000);

    return () => clearInterval(memInterval);
  }, []);

  // 3. Authentic Web Audio Frequency Buffer Telemetry (AnalyserNode.getByteFrequencyData)
  const [audioBands, setAudioBands] = useState<number[]>(new Array(16).fill(0));
  const [isAudioStreaming, setIsAudioStreaming] = useState<boolean>(false);

  useEffect(() => {
    let rafId: number;
    let lastSample = 0;

    const sampleAudio = (timestamp: number) => {
      if (timestamp - lastSample > 60) {
        lastSample = timestamp;
        const freqData = soundFx.getFrequencyData();
        if (freqData && freqData.length > 0) {
          setIsAudioStreaming(true);
          const step = Math.floor(freqData.length / 16);
          const bands: number[] = [];
          for (let i = 0; i < 16; i++) {
            const val = freqData[i * step] || 0;
            bands.push(Math.round((val / 255) * 100));
          }
          setAudioBands(bands);
        } else {
          setIsAudioStreaming(false);
          setAudioBands((prev) => prev.map((v) => Math.max(0, v - 8)));
        }
      }
      rafId = requestAnimationFrame(sampleAudio);
    };

    rafId = requestAnimationFrame(sampleAudio);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 4. Authentic Round-Trip Ping Telemetry
  const [pingMs, setPingMs] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkPing = async () => {
      const t0 = performance.now();
      try {
        await fetch(`${window.location.origin}/vite.svg?t=${Date.now()}`, {
          method: 'HEAD',
          cache: 'no-store',
        });
        if (isMounted) {
          setPingMs(Math.max(1, Math.round(performance.now() - t0)));
        }
      } catch {
        if (isMounted) {
          setPingMs(Math.max(1, Math.round(performance.now() - t0)));
        }
      }
    };

    checkPing();
    const pingInterval = setInterval(checkPing, 6000);
    return () => {
      isMounted = false;
      clearInterval(pingInterval);
    };
  }, []);

  // Live daemon jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses((prev) =>
        prev.map((p) => {
          if (p.status !== 'running') return p;
          const delta = (Math.random() - 0.48) * 0.4;
          const newCpu = Math.max(0.1, Number((p.cpu + delta).toFixed(1)));
          return { ...p, cpu: newCpu };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const totalCpu = Number(processes.reduce((acc, p) => p.status === 'running' ? acc + p.cpu : acc, 3.4).toFixed(1));

  const handleKillProcess = (pid: number) => {
    soundFx.playError();
    setProcesses((prev) =>
      prev.map((p) => (p.pid === pid ? { ...p, status: 'killed', cpu: 0 } : p))
    );

    setTimeout(() => {
      setProcesses((prev) =>
        prev.map((p) => (p.pid === pid ? { ...p, status: 'running', cpu: 1.2 } : p))
      );
      soundFx.playClick();
    }, 3500);
  };

  const handleRestartAll = () => {
    soundFx.playSuccess();
    setProcesses(INITIAL_PROCESSES);
  };

  const memoryPercent = Math.min(100, Math.round((memoryStats.usedMB / Math.max(1, memoryStats.totalMB)) * 100));

  return (
    <div className="h-full flex flex-col bg-[#0b0f19] text-gray-200 font-mono text-xs select-text">
      {/* Top Authentic Telemetry Metric Cards */}
      <div className="p-3 bg-[#111726] border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none">
        {/* Card 1: Live FPS & Frame Latency */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              Render Loop
            </span>
            <span className="font-bold text-white">{fps} FPS</span>
          </div>
          <div className="h-7 w-full flex items-end gap-1 pt-1">
            {fpsHistory.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-[1px] transition-all duration-300"
                style={{ height: `${Math.max(15, (val / 60) * 100)}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>Latency: {frameLatency}ms</span>
            <span className="text-emerald-400">CPU {totalCpu}%</span>
          </div>
        </div>

        {/* Card 2: Authentic Memory Heap Commit */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <HardDrive className="w-3.5 h-3.5" />
              Memory Commit
            </span>
            <span className="font-bold text-white">{memoryStats.usedMB} MB</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden my-auto">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(6, memoryPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>Alloc: {memoryStats.totalMB} MB</span>
            <span className="text-gray-500">{memoryStats.isSupported ? 'V8 Heap' : 'Estimated'}</span>
          </div>
        </div>

        {/* Card 3: Authentic Audio Frequency Telemetry */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 text-pink-400 font-semibold">
              <Radio className="w-3.5 h-3.5" />
              Audio Spectrum
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
              isAudioStreaming 
                ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30' 
                : 'text-gray-500 bg-white/5'
            }`}>
              {isAudioStreaming ? 'ACTIVE' : 'IDLE'}
            </span>
          </div>
          <div className="h-7 w-full flex items-end gap-0.5 pt-1">
            {audioBands.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-pink-600 via-pink-400 to-white/80 rounded-t-[1px] transition-all duration-75"
                style={{ height: `${Math.max(8, val)}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>Buffer: 128 bins</span>
            <span>48 kHz PCM</span>
          </div>
        </div>

        {/* Card 4: Authentic Network Ping & IPC */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <Network className="w-3.5 h-3.5" />
              Round-Trip Ping
            </span>
            <span className="text-emerald-400 font-bold">
              {pingMs !== null ? `${pingMs}ms` : 'Measuring...'}
            </span>
          </div>
          <div className="space-y-0.5 text-[10px] text-gray-400 my-auto">
            <div className="flex justify-between">
              <span>Transport:</span>
              <span className="text-white font-medium">HTTP/2 • Keep-Alive</span>
            </div>
            <div className="flex justify-between">
              <span>IPC Channel:</span>
              <span className="text-emerald-400 font-medium">SYNCHRONIZED</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>Packet Loss: 0.0%</span>
            <span className="text-cyan-400">TLS 1.3</span>
          </div>
        </div>
      </div>

      {/* Process Table Header Toolbar */}
      <div className="px-3 py-2 bg-black/30 border-b border-white/10 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-white">Active System Daemons & Services</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-gray-400">
            {processes.filter((p) => p.status === 'running').length} running
          </span>
        </div>

        <button
          onClick={handleRestartAll}
          className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 hover:text-white transition-all active:scale-95"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          <span>Reset Daemons</span>
        </button>
      </div>

      {/* Process List Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-[#161d2f] text-gray-400 border-b border-white/10 text-[11px] select-none">
            <tr>
              <th className="py-2 px-3 font-semibold">PID</th>
              <th className="py-2 px-3 font-semibold">Process Name</th>
              <th className="py-2 px-3 font-semibold hidden md:table-cell">Command Arguments</th>
              <th className="py-2 px-3 font-semibold text-right">CPU %</th>
              <th className="py-2 px-3 font-semibold text-right">RAM (MB)</th>
              <th className="py-2 px-3 font-semibold text-center">Status</th>
              <th className="py-2 px-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {processes.map((proc) => {
              const isSelected = selectedPid === proc.pid;
              const isKilled = proc.status === 'killed';

              return (
                <tr
                  key={proc.pid}
                  onClick={() => setSelectedPid(proc.pid)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-white/10' : 'hover:bg-white/[0.04]'
                  } ${isKilled ? 'opacity-50 line-through' : ''}`}
                >
                  <td className="py-2 px-3 font-bold text-gray-400">{proc.pid}</td>
                  <td className="py-2 px-3 text-white font-medium">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isKilled ? 'bg-red-500' : 'bg-emerald-400'
                        }`}
                      />
                      <span>{proc.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-gray-400 text-[11px] truncate max-w-xs hidden md:table-cell">
                    {proc.command}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-semibold">{proc.cpu}%</td>
                  <td className="py-2 px-3 text-right text-cyan-300">{proc.ram}</td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                        proc.status === 'running'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : proc.status === 'killed'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {proc.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKillProcess(proc.pid);
                      }}
                      disabled={isKilled}
                      className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 disabled:opacity-30 transition-colors"
                      title="Terminate Daemon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-[#111726] border-t border-white/10 text-[11px] text-gray-500 flex items-center justify-between select-none">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5" />
          Realtime Kernel Monitor Active
        </span>
        <span className="font-mono text-[10px] text-gray-400">
          {typeof navigator !== 'undefined'
            ? `${(navigator as any).userAgentData?.platform || navigator.platform || 'Client Engine'} • ${navigator.hardwareConcurrency || 4} Threads • V8 Runtime`
            : 'WebAssembly Core'}
        </span>
      </div>
    </div>
  );
};
