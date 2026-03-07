import { Slider } from "@/components/ui/slider";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  characterName: string;
  textColor?: string;
  accentColor?: string;
  autoPlay?: boolean;
  compact?: boolean;
}

export default function AudioPlayer({
  src,
  characterName,
  textColor,
  accentColor,
  autoPlay = false,
  compact = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (autoPlay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const handleSeek = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = val[0];
    setCurrentTime(val[0]);
  };

  const handleVolume = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const v = val[0];
    audio.volume = v;
    setVolume(v);
    if (v === 0) setMuted(true);
    else setMuted(false);
  };

  const formatTime = (t: number) => {
    if (Number.isNaN(t) || !Number.isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const tc = textColor ?? "rgba(255,255,255,0.9)";
  const ac = accentColor ?? "#c9a84c";

  const padding = compact ? "p-2" : "p-4";
  const playBtnSize = compact ? "w-7 h-7" : "w-9 h-9";
  const iconSize = compact ? 13 : 16;
  const volumeSliderWidth = compact ? "w-12" : "w-16";

  return (
    <div
      className={`rounded-lg ${padding} border border-white/10 backdrop-blur-sm`}
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      {/* biome-ignore lint/a11y/useMediaCaption: audio player for character theme music, captions not applicable */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Title bar — hidden in compact mode */}
      {!compact && (
        <div className="flex items-center gap-2 mb-3">
          <Music size={14} style={{ color: ac }} className="shrink-0" />
          <span
            className="text-xs font-medium truncate uppercase tracking-widest"
            style={{ color: ac }}
          >
            {characterName} — Theme
          </span>
        </div>
      )}

      {/* Controls row */}
      <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
        <button
          type="button"
          onClick={togglePlay}
          className={`${playBtnSize} rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110 active:scale-95`}
          style={{ background: ac, color: "#000" }}
        >
          {isPlaying ? (
            <Pause size={iconSize} />
          ) : (
            <Play size={iconSize} className="ml-0.5" />
          )}
        </button>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <Slider
            min={0}
            max={duration || 1}
            step={0.1}
            value={[currentTime]}
            onValueChange={handleSeek}
            className="w-full h-1"
            style={{ "--slider-color": ac } as React.CSSProperties}
          />
          <div
            className="flex justify-between tabular-nums"
            style={{ color: `${tc}80`, fontSize: compact ? "9px" : "12px" }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div
          className={`flex items-center ${compact ? "gap-1" : "gap-1.5"} shrink-0`}
        >
          <button
            type="button"
            onClick={toggleMute}
            className="opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: tc }}
          >
            {muted || volume === 0 ? (
              <VolumeX size={compact ? 12 : 14} />
            ) : (
              <Volume2 size={compact ? 12 : 14} />
            )}
          </button>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={[muted ? 0 : volume]}
            onValueChange={handleVolume}
            className={`${volumeSliderWidth} h-1`}
          />
        </div>
      </div>
    </div>
  );
}
