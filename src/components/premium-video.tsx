"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Expand, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useMediaController } from "@/components/media-controller";
import { cn } from "@/lib/utils";

type PremiumVideoProps = {
  id?: string;
  src: string;
  poster: string;
  title: string;
  duration?: string;
  hero?: boolean;
  className?: string;
  label?: string;
  loop?: boolean;
};

export function PremiumVideo({ id, src, poster, title, duration, hero = false, className, label, loop = false }: PremiumVideoProps) {
  const generatedId = useId();
  const mediaId = id ?? generatedId;
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { activeId, claim, release, soundPreferred, preferSound } = useMediaController();
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(hero);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hero) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = connection?.saveData || connection?.effectiveType === "2g";
    if (desktop && !reduced && !constrained) {
      video.muted = true;
      video.play().then(() => { setStarted(true); setPlaying(true); claim(mediaId); }).catch(() => undefined);
    }
  }, [claim, hero, mediaId, reduced]);

  useEffect(() => {
    if (activeId !== null && activeId !== mediaId && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [activeId, mediaId]);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !video.paused) video.pause();
    }, { threshold: 0.08 });
    observer.observe(frame);
    return () => { observer.disconnect(); video.pause(); release(mediaId); };
  }, [mediaId, release]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      const firstUserPlay = !started;
      if (!hero || firstUserPlay || soundPreferred) {
        video.muted = false;
        setMuted(false);
        preferSound();
      }
      claim(mediaId);
      setStarted(true);
      await video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }

  async function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) {
      preferSound();
      claim(mediaId);
      if (video.paused) await video.play().catch(() => undefined);
    }
  }

  async function fullscreen() {
    const frame = frameRef.current;
    if (frame?.requestFullscreen) await frame.requestFullscreen().catch(() => undefined);
  }

  return (
    <div ref={frameRef} className={cn("premium-video group", hero && "premium-video-hero", className)}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        preload={hero ? "metadata" : "none"}
        playsInline
        muted={muted}
        loop={loop}
        controls={false}
        controlsList="nodownload noplaybackrate"
        aria-label={title}
        onPlay={() => { setPlaying(true); claim(mediaId); }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); release(mediaId); }}
      />
      <noscript><video className="h-full w-full object-cover" src={src} poster={poster} controls preload="metadata" /></noscript>
      <div className="premium-video-shade" aria-hidden="true" />
      {label ? <span className="premium-video-label">{label}</span> : null}
      {!playing ? (
        <button type="button" onClick={togglePlay} className="premium-video-play" aria-label={`Play ${title} with sound`}>
          <Play size={22} fill="currentColor" />
        </button>
      ) : null}
      <div className="premium-video-controls">
        <button type="button" onClick={togglePlay} className="media-control" aria-label={playing ? `Pause ${title}` : `Play ${title}`}>
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <button type="button" onClick={toggleSound} className="media-control media-sound-control" aria-label={muted ? `Turn on sound for ${title}` : `Mute ${title}`}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{muted ? "Tap for sound" : "Sound on"}</span>
        </button>
        <span className="ml-auto text-[11px] font-bold text-white/75">{duration}</span>
        <button type="button" onClick={fullscreen} className="media-control" aria-label={`View ${title} fullscreen`}><Expand size={16} /></button>
      </div>
    </div>
  );
}
