import React, { useState, useEffect } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  X,
  ListMusic
} from 'lucide-react';
import { soundFx, AUDIO_PLAYLIST } from '../../utils/audio';

interface MusicPopoverProps {
  onClose: () => void;
}

export const MusicPopover: React.FC<MusicPopoverProps> = ({ onClose }) => {
  const { 
    ambientPlaying, 
    toggleAmbientMusic, 
    volume, 
    setVolume, 
    soundEnabled, 
    toggleSound,
    currentTrack,
    nextTrack,
    prevTrack,
    selectTrack,
    seekTrack
  } = useDesktop();

  const [trackProgress, setTrackProgress] = useState<{ currentTime: number; duration: number }>(() => 
    soundFx.getCurrentTrackTime()
  );
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  // Subscribe to real-time audio time updates
  useEffect(() => {
    const unsubscribe = soundFx.subscribeTimeUpdate((currentTime, duration) => {
      if (!isScrubbing) {
        setTrackProgress({ currentTime, duration });
      }
    });
    return unsubscribe;
  }, [isScrubbing]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const currentDuration = trackProgress.duration || currentTrack.duration || 195;
  const currentElapsed = isScrubbing ? scrubValue : trackProgress.currentTime;
  const progressPercent = Math.min(100, Math.max(0, (currentElapsed / currentDuration) * 100));

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScrubValue(val);
  };

  const handleSeekCommit = () => {
    seekTrack(scrubValue);
    setIsScrubbing(false);
  };

  return (
    <div 
      role="dialog"
      aria-label="Lo-Fi Music Player Utility"
      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-80 sm:w-88 rounded-2xl bg-[#0b101d]/95 backdrop-blur-2xl border border-white/15 p-4 shadow-2xl text-gray-200 font-mono text-xs select-none z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-pink-400" />
          <span className="font-bold text-white text-[11px] tracking-wide">
            JEPTHA // AUDIO DAEMON
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
            {ambientPlaying ? 'STREAMING' : 'IDLE'}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            title="Close Music Utility"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Now Playing Info */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/10 mb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-pink-400/90 uppercase tracking-wider font-semibold">
              Now Playing
            </div>
            <div className="text-white font-bold text-xs truncate mt-0.5" title={currentTrack.title}>
              {currentTrack.title}
            </div>
            <div className="text-gray-400 text-[10px] truncate mt-0.5">
              {currentTrack.artist}
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              setShowPlaylist((prev) => !prev);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              showPlaylist 
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Chapter Playlist"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar & Seek Scrubbing */}
        <div className="mt-3">
          <div className="relative w-full h-1.5 bg-white/10 rounded-full cursor-pointer group">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-pink-500 to-purple-400 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <input
              type="range"
              min={0}
              max={currentDuration}
              step={0.5}
              value={currentElapsed}
              onMouseDown={() => setIsScrubbing(true)}
              onTouchStart={() => setIsScrubbing(true)}
              onChange={handleSeekChange}
              onMouseUp={handleSeekCommit}
              onTouchEnd={handleSeekCommit}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Seek track"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1 font-mono">
            <span>{formatTime(currentElapsed)}</span>
            <span>{formatTime(currentDuration)}</span>
          </div>
        </div>
      </div>

      {/* Chapter Playlist Drawer */}
      {showPlaylist && (
        <div className="mb-3 p-2 rounded-xl bg-black/60 border border-white/10 max-h-36 overflow-y-auto space-y-1">
          <div className="text-[10px] text-gray-400 font-semibold px-2 py-0.5 uppercase tracking-wider">
            Station Chapters
          </div>
          {AUDIO_PLAYLIST.map((track, idx) => {
            const isSelected = track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => {
                  soundFx.playClick();
                  selectTrack(idx);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-[11px] transition-colors ${
                  isSelected
                    ? 'bg-pink-500/20 text-white font-semibold border border-pink-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="truncate pr-2">{track.title}</span>
                <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                  {formatTime(track.duration)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Playback Transport Controls */}
      <div className="flex items-center justify-center gap-4 my-2">
        <button
          onClick={() => {
            soundFx.playClick();
            prevTrack();
          }}
          className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all active:scale-95 focus:outline-none"
          title="Previous Track"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            toggleAmbientMusic();
          }}
          className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25 hover:opacity-90 active:scale-95 transition-all focus:outline-none"
          title={ambientPlaying ? 'Pause Playback' : 'Start Playback'}
        >
          {ambientPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            nextTrack();
          }}
          className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all active:scale-95 focus:outline-none"
          title="Next Track"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Volume & Audio Controls Row */}
      <div className="pt-3 mt-2 border-t border-white/10 flex items-center gap-2.5">
        <button
          onClick={() => {
            soundFx.playClick();
            toggleSound();
          }}
          className="p-1 rounded text-gray-400 hover:text-white transition-colors focus:outline-none"
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled && volume > 0 ? (
            <Volume2 className="w-3.5 h-3.5 text-pink-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-red-400" />
          )}
        </button>

        <div className="flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={soundEnabled ? volume : 0}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer h-1.5 bg-white/10 rounded-full"
            title="Volume Slider"
          />
        </div>

        <span className="text-[10px] text-gray-400 w-8 text-right font-mono">
          {soundEnabled ? Math.round(volume * 100) : 0}%
        </span>
      </div>
    </div>
  );
};
