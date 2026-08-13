"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { MediaControllerProvider } from "@/components/media-controller";
import { WhatsAppChooserProvider } from "@/components/whatsapp-campus-chooser";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <MediaControllerProvider>
        <WhatsAppChooserProvider>{children}</WhatsAppChooserProvider>
      </MediaControllerProvider>
    </MotionConfig>
  );
}
