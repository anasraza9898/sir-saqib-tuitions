"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaPlayerProps = {
  src: string;
  poster: string;
  title: string;
  className?: string;
  hero?: boolean;
  muted?: boolean;
};

export function MediaPlayer({ src, poster, title, className, hero = false, muted = false }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);

  useEffect(() => {
    if (!hero || !videoRef.current) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = connection?.saveData || connection?.effectiveType === "2g";

    if (!motionQuery.matches && desktopQuery.matches && !constrained) {
      videoRef.current.play().then(() => {
        setStarted(true);
        setPlaying(true);
      }).catch(() => undefined);
    }
  }, [hero]);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setStarted(true);
      await video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }

  function toggleMuted() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  return (
    <div className={cn("group relative isolate overflow-hidden bg-navy-950", className)}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={poster}
        preload={hero ? "metadata" : "none"}
        muted={isMuted}
        playsInline
        loop={hero}
        controls={!hero && started}
        aria-label={title}
        onCanPlay={() => setReady(true)}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support HTML video.
      </video>
      {!ready && started ? (
        <span className="absolute inset-0 flex items-center justify-center bg-navy-950/35 text-white" aria-label="Loading video">
          <LoaderCircle className="animate-spin motion-reduce:animate-none" size={28} />
        </span>
      ) : null}
      {hero || !started ? (
        <div className="absolute inset-0 bg-navy-950/15 transition group-hover:bg-navy-950/5" aria-hidden="true" />
      ) : null}
      <button
        type="button"
        onClick={togglePlayback}
        className={cn(
          "absolute flex items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
          hero ? "bottom-4 left-4 h-11 w-11" : "left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2",
          !hero && started && "pointer-events-none opacity-0",
        )}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
      >
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
      </button>
      {hero ? (
        <button type="button" onClick={toggleMuted} className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/75 text-white transition hover:bg-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label={isMuted ? "Unmute hero video" : "Mute hero video"}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      ) : null}
    </div>
  );
}
