"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { ArrowRight, MessageCircle, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "@/components/modal";
import { assistantAnswers, site } from "@/data/site";
import { whatsappHref } from "@/lib/utils";

type Topic = keyof typeof assistantAnswers;

export function AdmissionAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const close = useCallback(() => { setTopic(null); onClose(); }, [onClose]);

  return (
    <Modal open={open} onClose={close} labelledBy="assistant-title" className="overflow-hidden sm:max-w-2xl">
      <div className="relative overflow-hidden bg-ink px-5 py-6 text-white sm:px-7">
        <span className="absolute right-8 top-0 h-full w-px bg-gold/25" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo/sir-saqib-tuitions-logo.webp" alt="" width={48} height={48} className="h-12 w-12 rounded-sm object-cover ring-1 ring-gold/30" />
            <div><p className="text-[10px] font-bold uppercase text-gold-light">Admission guidance preview</p><h2 id="assistant-title" className="mt-1 font-display text-2xl">Ask Sir Saqib Tuitions</h2></div>
          </div>
          <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-white/75 hover:bg-white/10 hover:text-white" onClick={close} aria-label="Close admission assistant"><X size={20} /></button>
        </div>
        <p className="relative mt-5 max-w-lg text-sm leading-6 text-white/65">Welcome. Choose a topic for a quick answer based on current academy information.</p>
      </div>
      <div className="bg-cream p-5 sm:p-7">
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(assistantAnswers) as Topic[]).map((item) => (
            <button key={item} type="button" className={`flex min-h-12 items-center justify-between border px-3 text-left text-sm font-bold transition ${topic === item ? "border-ink bg-ink text-white" : "border-cream-deep bg-paper text-ink hover:border-gold"}`} onClick={() => setTopic(item)} aria-pressed={topic === item}>
              {item}<ArrowRight size={15} />
            </button>
          ))}
        </div>
        <div className="mt-5 min-h-36 border-l-2 border-gold bg-paper p-5" aria-live="polite">
          <AnimatePresence mode="wait">
            {topic ? (
              <motion.div key={topic} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="flex items-center gap-2 text-xs font-bold uppercase text-girls"><Sparkles size={15} />{topic}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{assistantAnswers[topic]}</p>
              </motion.div>
            ) : <p className="text-sm leading-7 text-muted">Select a question above to begin.</p>}
          </AnimatePresence>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link href="/contact#enquiry" onClick={close} className="button-ink">Contact admissions <ArrowRight size={16} /></Link>
          <a href={whatsappHref(site.whatsapp, "Hello, I would like admission guidance from Sir Saqib Tuitions.")} target="_blank" rel="noreferrer" className="button-paper"><MessageCircle size={16} /> WhatsApp</a>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">This preview uses local information only. AI and lead capture will be connected securely in a future phase.</p>
      </div>
    </Modal>
  );
}
