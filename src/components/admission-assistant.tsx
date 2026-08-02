"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, MessageCircle, X } from "lucide-react";
import { Modal } from "@/components/modal";
import { assistantAnswers, site } from "@/data/site";
import { whatsappHref } from "@/lib/utils";

type Topic = keyof typeof assistantAnswers;

export function AdmissionAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const close = useCallback(() => {
    setTopic(null);
    onClose();
  }, [onClose]);

  return (
    <Modal open={open} onClose={close} labelledBy="assistant-title" className="overflow-hidden">
      <div className="bg-navy-950 px-5 py-5 text-white sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-gold-400 text-navy-950"><Bot size={22} /></span>
            <div>
              <p className="text-xs font-bold uppercase text-gold-300">Phase 1 preview</p>
              <h2 id="assistant-title" className="font-display text-xl font-bold">Admission Assistant</h2>
            </div>
          </div>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-sm text-cream-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-gold-300" onClick={close} aria-label="Close admission assistant"><X size={20} /></button>
        </div>
        <p className="mt-4 text-sm leading-6 text-cream-100/70">Quick answers use verified academy information only. No lead data is captured or saved.</p>
      </div>
      <div className="bg-cream-50 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase text-navy-600">What can I help with?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(assistantAnswers) as Topic[]).map((item) => (
            <button key={item} type="button" className={`filter-button bg-white ${topic === item ? "filter-button-active" : ""}`} aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>
          ))}
        </div>
        <div className="mt-5 min-h-32 rounded-sm border border-navy-900/10 bg-white p-4" aria-live="polite">
          {topic ? (
            <>
              <div className="flex items-center gap-2 text-sm font-bold text-navy-950"><Bot size={16} className="text-gold-700" /> {topic}</div>
              <p className="mt-3 text-sm leading-6 text-navy-600">{assistantAnswers[topic]}</p>
            </>
          ) : (
            <p className="text-sm leading-6 text-navy-500">Choose a topic to view a verified answer.</p>
          )}
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link href="/contact#enquiry" onClick={close} className="btn-primary justify-center">Contact admissions <ArrowRight size={16} /></Link>
          <a href={whatsappHref(site.whatsapp, "Hello, I need admissions help for Sir Saqib Tuitions.")} target="_blank" rel="noreferrer" className="btn-secondary justify-center"><MessageCircle size={16} /> WhatsApp</a>
        </div>
      </div>
    </Modal>
  );
}
