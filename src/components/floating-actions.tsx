"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { whatsappHref } from "@/lib/utils";

const AdmissionAssistant = dynamic(() => import("@/components/admission-assistant").then((module) => module.AdmissionAssistant), { loading: () => null });

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [dockHidden, setDockHidden] = useState(false);
  const lastScroll = useRef(0);
  const close = useCallback(() => setOpen(false), []);
  const whatsapp = whatsappHref(site.whatsapp, "Hello, I would like admission guidance from Sir Saqib Tuitions.");

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = window.scrollY;
        const nearBottom = window.innerHeight + current >= document.documentElement.scrollHeight - 140;
        setDockHidden(!nearBottom && current > lastScroll.current + 10 && current > 180);
        if (Math.abs(current - lastScroll.current) > 10) lastScroll.current = current;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <>
      <motion.div className="fixed bottom-6 right-5 z-40 hidden flex-col gap-2 md:flex" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open AI Admission Assistant" className="ai-pulse group relative flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-[0_8px_24px_rgba(8,17,38,0.18)] focus-visible:outline-gold">
          <Bot size={20} /><span className="pointer-events-none absolute right-14 min-w-max rounded-sm bg-ink px-2.5 py-1.5 text-xs font-bold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Ask AI</span>
        </button>
        <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Open WhatsApp admissions chat" className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#176b50] text-white shadow-[0_8px_24px_rgba(8,17,38,0.16)]">
          <MessageCircle size={20} /><span className="pointer-events-none absolute right-14 min-w-max rounded-sm bg-ink px-2.5 py-1.5 text-xs font-bold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">WhatsApp</span>
        </a>
      </motion.div>
      <div className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-1 border-t border-ink/10 bg-paper/96 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(8,17,38,0.08)] transition-transform duration-300 md:hidden ${dockHidden ? "translate-y-full" : "translate-y-0"}`}>
        <button type="button" onClick={() => setOpen(true)} className="flex h-12 items-center justify-center gap-2 rounded-sm bg-ink text-sm font-bold text-white"><Bot size={18} /> Ask AI</button>
        <a href={whatsapp} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-sm bg-[#176b50] text-sm font-bold text-white"><MessageCircle size={18} /> WhatsApp</a>
      </div>
      <AdmissionAssistant open={open} onClose={close} />
    </>
  );
}
