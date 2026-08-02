"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/site";
import { cn } from "@/lib/utils";

export function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-navy-900/10 border-y border-navy-900/10">
      {faqs.map((faq, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${index}`;
        return (
          <div key={faq.question}>
            <h3>
              <button type="button" className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-bold text-navy-950 sm:text-lg" onClick={() => setOpen(expanded ? -1 : index)} aria-expanded={expanded} aria-controls={panelId}>
                {faq.question}
                <ChevronDown size={20} className={cn("shrink-0 text-gold-700 transition-transform", expanded && "rotate-180")} />
              </button>
            </h3>
            <div id={panelId} hidden={!expanded} className="pb-5 pr-10 text-sm leading-7 text-navy-600 sm:text-base">
              {faq.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
