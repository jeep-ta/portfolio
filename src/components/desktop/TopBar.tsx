import { useState, useEffect } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { 
  Volume2, 
  Volume1,
  VolumeX, 
  Wifi, 
  BatteryMedium, 
  Sparkles,
  Command,
  Music,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    soundEnabled, 
    toggleSound, 
    ambientPlaying,
    toggleAmbientMusic,
    volume,
    setShowShortcutsModal,
  } = useDesktop();

  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-9 w-full bg-black/60 backdrop-blur-md border-b border-[var(--border-color)] px-3 flex items-center justify-between text-xs text-[var(--text-primary)] z-50 fixed top-0 left-0 select-none">
      {/* Left: Brand Logo & Minimal Three-Bar Equalizer Status */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 font-mono font-bold tracking-wider text-[var(--accent)] hover:opacity-80 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="hidden sm:inline">JEPTHA // OS</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 font-normal">
            v2.5
          </span>
        </div>

        <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

        {/* Animated Three-Bar Equalizer Glyph & Audio Status Button */}
        <button
          onClick={toggleAmbientMusic}
          title={ambientPlaying ? 'Pause Audio Stream (Click to toggle)' : 'Resume Audio Stream (Click to toggle)'}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
            ambientPlaying
              ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 shadow-sm'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
          }`}
        >
          {ambientPlaying ? (
            <div className="flex items-end gap-0.5 h-3 px-0.5">
              <span className="w-0.5 bg-pink-400 h-2.5 animate-bounce" />
              <span className="w-0.5 bg-pink-400 h-1.5 animate-bounce delay-75" />
              <span className="w-0.5 bg-pink-400 h-3 animate-bounce delay-150" />
            </div>
          ) : (
            <Music className="w-3 h-3 text-gray-400" />
          )}
          <span className="text-[10px] font-mono tracking-wider">
            {ambientPlaying ? 'STREAMING' : 'AUDIO IDLE'}
          </span>
        </button>
      </div>

      {/* Center: Quick Actions Command Badge & System telemetry */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowShortcutsModal(true)}
          title="Open Quick Actions & Shortcuts (Ctrl+K)"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300 hover:text-white transition-all shadow-sm active:scale-95"
        >
          <Command className="w-3 h-3 text-[var(--accent)]" />
          <span>Ctrl+K Quick Actions</span>
        </button>

        <div className="hidden xl:flex items-center gap-2 font-mono text-[10px] text-white/30 tracking-wider">
          <span>•</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
          <span>KERNEL: OK</span>
          <span>•</span>
          <span>eBPF: ACTIVE</span>
        </div>
      </div>

      {/* Right: Quick Mute Toggle, Network, Battery, Live Clock */}
      <div className="flex items-center gap-3">
        {/* Master Volume Quick Mute/Unmute Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? `Master Volume: ${Math.round(volume * 100)}% (Click to Mute)` : 'System Muted (Click to Unmute)'}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${
            !soundEnabled || volume === 0
              ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25'
              : volume < 0.5
              ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10'
              : 'bg-white/5 border-white/10 text-[var(--accent)] hover:bg-white/10'
          }`}
        >
          {!soundEnabled || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : volume < 0.5 ? (
            <Volume1 className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
          <span className="text-[10px] font-mono hidden md:inline">
            {soundEnabled ? `${Math.round(volume * 100)}%` : 'MUTED'}
          </span>
        </button>

        {/* Network indicator */}
        <div className="hidden sm:flex items-center gap-1 text-[var(--text-secondary)]" title="Wi-Fi Signal 100%">
          <Wifi className="w-3.5 h-3.5 text-[var(--accent)]" />
        </div>

        {/* Battery indicator */}
        <div className="hidden sm:flex items-center gap-1 text-[var(--text-secondary)]" title="Battery 100% (Plugged in)">
          <BatteryMedium className="w-3.5 h-3.5" />
          <span className="text-[10px]">100%</span>
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10 font-mono text-[11px] text-[var(--text-primary)] font-medium">
          <span className="hidden md:inline text-[var(--text-muted)]">{dateStr}</span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5 tracking-wider">
            {timeStr || '00:00:00'}
          </span>
        </div>
      </div>
    </header>
  );
};
