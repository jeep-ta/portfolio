import { useState, useEffect } from 'react';
import type { ProcessItem } from '../../types';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Trash2, 
  RotateCcw, 
  CheckCircle,
  Network
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
  const [cpuHistory, setCpuHistory] = useState<number[]>([12, 16, 14, 22, 18, 25, 20, 15, 28, 19, 24]);
  const [selectedPid, setSelectedPid] = useState<number | null>(null);

  // Live fluctuating telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate current total CPU from running processes
      setProcesses((prev) =>
        prev.map((p) => {
          if (p.status !== 'running') return p;
          // small natural jitter
          const delta = (Math.random() - 0.48) * 0.4;
          const newCpu = Math.max(0.1, Number((p.cpu + delta).toFixed(1)));
          return { ...p, cpu: newCpu };
        })
      );

      setCpuHistory((prev) => {
        const activeCpu = prev[prev.length - 1] + (Math.random() - 0.48) * 4;
        const clamped = Math.max(8, Math.min(65, Number(activeCpu.toFixed(1))));
        return [...prev.slice(1), clamped];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const totalCpu = Number(processes.reduce((acc, p) => p.status === 'running' ? acc + p.cpu : acc, 5.2).toFixed(1));
  const totalRam = Number(processes.reduce((acc, p) => p.status === 'running' ? acc + p.ram : acc, 240).toFixed(0));

  const handleKillProcess = (pid: number) => {
    soundFx.playError();
    setProcesses((prev) =>
      prev.map((p) => (p.pid === pid ? { ...p, status: 'killed', cpu: 0 } : p))
    );

    // Auto-restart daemon after 3.5s for realism
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

  return (
    <div className="h-full flex flex-col bg-[#0b0f19] text-gray-200 font-mono text-xs select-text">
      {/* Top Telemetry Metric Bars */}
      <div className="p-3 bg-[#111726] border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 select-none">
        {/* CPU Telemetry */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              CPU Utilization
            </span>
            <span className="font-bold text-white">{totalCpu}%</span>
          </div>
          {/* Mini Sparkline Canvas/SVG */}
          <div className="h-8 w-full flex items-end gap-1 pt-1">
            {cpuHistory.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-[1px] transition-all duration-300"
                style={{ height: `${(val / 70) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* RAM Telemetry */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <HardDrive className="w-3.5 h-3.5" />
              Memory Commit
            </span>
            <span className="font-bold text-white">{totalRam} MB / 16 GB</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(totalRam / 16384) * 100 * 6}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1.5">
            <span>Cache: 480 MB</span>
            <span>Swap: 0 MB</span>
          </div>
        </div>

        {/* Network & Threads */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <Network className="w-3.5 h-3.5" />
              Kernel IPC
            </span>
            <span className="text-emerald-400 font-bold">STABLE</span>
          </div>
          <div className="space-y-0.5 text-[10px] text-gray-400 mt-1">
            <div className="flex justify-between">
              <span>Active Threads:</span>
              <span className="text-white font-medium">44</span>
            </div>
            <div className="flex justify-between">
              <span>eBPF Ring Buffer:</span>
              <span className="text-white font-medium">100% Flow</span>
            </div>
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
        <span>Linux 6.8.0-zen-arch</span>
      </div>
    </div>
  );
};
