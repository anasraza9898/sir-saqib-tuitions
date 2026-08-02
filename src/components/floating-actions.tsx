"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Bot, MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { whatsappHref } from "@/lib/utils";

const AdmissionAssistant = dynamic(
  () => import("@/components/admission-assistant").then((module) => module.AdmissionAssistant),
  { loading: () => null },
);

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const whatsapp = whatsappHref(site.whatsapp, "Hello, I would like admissions information for Sir Saqib Tuitions.");

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-2 rounded-sm bg-navy-950 px-4 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 md:flex">
        <Bot size={18} /> Ask AI
      </button>
      <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Open WhatsApp admissions chat" className="group fixed bottom-6 left-5 z-40 hidden h-12 w-12 items-center justify-center rounded-full bg-[#166b4f] text-white shadow-xl transition hover:bg-[#10543e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 md:flex">
        <MessageCircle size={20} />
        <span className="pointer-events-none absolute left-14 rounded-sm bg-navy-950 px-2.5 py-1.5 text-xs font-bold opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">WhatsApp</span>
      </a>
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-navy-900/10 bg-navy-900/10 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden">
        <button type="button" onClick={() => setOpen(true)} className="flex h-12 items-center justify-center gap-2 rounded-sm bg-navy-950 text-sm font-bold text-white"><Bot size={18} /> Ask AI</button>
        <a href={whatsapp} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-sm bg-[#166b4f] text-sm font-bold text-white"><MessageCircle size={18} /> WhatsApp</a>
      </div>
      <AdmissionAssistant open={open} onClose={close} />
    </>
  );
}
