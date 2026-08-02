"use client";

import Image from "next/image";
import { useState } from "react";
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
      <div className="grid overflow-hidden border border-white/10 bg-navy lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-between border-b border-white/10 p-6 text-white lg:border-b-0 lg:border-r lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={selected.id} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }}>
              <p className="text-xs font-bold uppercase text-gold-light">{selected.category}</p>
              <h3 className="mt-4 font-display text-4xl leading-tight">{selected.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/62">{selected.description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center justify-between border-t border-white/12 pt-5 text-xs font-bold text-white/48"><span>Real academy recording</span><span>{selected.duration}</span></div>
        </div>
        <div className="bg-ink p-3 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div key={selected.id} initial={{ opacity: 0, scale: reduced ? 1 : 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.28 }} className="mx-auto max-w-md">
              <PremiumVideo id={`gallery-${selected.id}`} src={selected.src} poster={selected.poster} title={selected.title} duration={selected.duration} label={selected.category} className="aspect-[9/16]" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="scrollbar-none mt-4 flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible">
        {mediaItems.map((item) => (
          <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} aria-pressed={selected.id === item.id} className={cn("group min-w-36 flex-1 border bg-paper p-2 text-left transition", selected.id === item.id ? "border-gold" : "border-cream-deep hover:border-ink")}>
            <span className="relative block aspect-[4/3] overflow-hidden bg-cream"><Image src={item.poster} alt="" fill sizes="160px" className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]" /><span className="absolute inset-0 flex items-center justify-center bg-ink/12"><Play size={17} className="text-white" fill="currentColor" /></span></span>
            <span className="mt-2 block text-[10px] font-bold uppercase text-girls">{item.category}</span>
            <span className="mt-1 block text-xs font-bold text-ink">{item.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
