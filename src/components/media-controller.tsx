"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type MediaControllerValue = {
  activeId: string | null;
  claim: (id: string) => void;
  release: (id: string) => void;
  soundPreferred: boolean;
  preferSound: () => void;
};

const MediaControllerContext = createContext<MediaControllerValue | null>(null);

export function MediaControllerProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [soundPreferred, setSoundPreferred] = useState(false);
  const claim = useCallback((id: string) => setActiveId(id), []);
  const release = useCallback((id: string) => setActiveId((current) => current === id ? null : current), []);
  const preferSound = useCallback(() => setSoundPreferred(true), []);
  const value = useMemo<MediaControllerValue>(() => ({
    activeId,
    claim,
    release,
    soundPreferred,
    preferSound,
  }), [activeId, claim, preferSound, release, soundPreferred]);

  return <MediaControllerContext.Provider value={value}>{children}</MediaControllerContext.Provider>;
}

export function useMediaController() {
  const value = useContext(MediaControllerContext);
  if (!value) throw new Error("useMediaController must be used inside MediaControllerProvider");
  return value;
}
