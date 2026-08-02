"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { MediaControllerProvider } from "@/components/media-controller";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <MediaControllerProvider>{children}</MediaControllerProvider>
    </MotionConfig>
  );
}
