"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { faqs } from "@/data/site";
import { cn } from "@/lib/utils";

export function FaqList() {
  const [open, setOpen] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div className="border-y border-cream-deep">
      {faqs.map((faq, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${index}`;
        return (
          <div key={faq.question} className="border-b border-cream-deep last:border-b-0">
            <h3>
              <button type="button" className="flex w-full items-center justify-between gap-5 py-5 text-left font-bold text-ink sm:py-6 sm:text-lg" onClick={() => setOpen(expanded ? -1 : index)} aria-expanded={expanded} aria-controls={panelId}>
                <span className="flex gap-4"><span className="font-display text-gold">0{index + 1}</span>{faq.question}</span>
                <Plus size={19} className={cn("shrink-0 transition-transform", expanded && "rotate-45")} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div id={panelId} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.26 }} className="overflow-hidden">
                  <p className="max-w-2xl pb-6 pl-9 pr-8 text-sm leading-7 text-muted sm:text-base">{faq.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
