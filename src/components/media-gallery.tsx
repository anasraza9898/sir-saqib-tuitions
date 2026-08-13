"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { PremiumVideo } from "@/components/premium-video";
import { mediaItems } from "@/data/site";
import { cn } from "@/lib/utils";

export function MediaGallery() {
  const [selectedId, setSelectedId] = useState(mediaItems[0].id);
  const reduced = useReducedMotion();
  const selected = mediaItems.find((item) => item.id === selectedId) ?? mediaItems[0];

  return (
    <div>
      <div className="mx-auto max-w-3xl overflow-hidden border border-white/10 bg-ink p-3 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div key={selected.id} initial={{ opacity: 0, scale: reduced ? 1 : 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.28 }} className="mx-auto max-w-md">
            <PremiumVideo id={`gallery-${selected.id}`} src={selected.src} poster={selected.poster} title={selected.title} duration={selected.duration} label={selected.category} className="aspect-[9/16]" />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-7 text-muted">Select a video from the collection below to explore the academy. Audio begins when you choose to play a video.</p>
      <div className="scrollbar-none mt-9 flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible">
        {mediaItems.map((item) => (
          <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} aria-pressed={selected.id === item.id} className={cn("group min-w-36 flex-1 border bg-paper p-3 text-left transition", selected.id === item.id ? "border-gold" : "border-cream-deep hover:border-ink")}>
            <span className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-cream text-girls">
              {item.poster ? <Image src={item.poster} alt={`${item.category} video poster`} fill sizes="160px" className="object-cover" /> : null}
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-girls shadow-sm"><Play size={16} fill="currentColor" /></span>
            </span>
            <span className="mt-2 block text-[10px] font-bold uppercase text-girls">{item.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
