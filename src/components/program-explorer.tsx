"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { programs } from "@/data/site";
import { cn } from "@/lib/utils";

const categories = ["Matric", "Intermediate", "Foundation", "Huffaz"] as const;
type Category = (typeof categories)[number];

export function ProgramExplorer({ sticky = false }: { sticky?: boolean }) {
  const [category, setCategory] = useState<Category>("Matric");
  const reduced = useReducedMotion();
  const visible = programs.filter((program) => program.category === category);

  return (
    <div>
      <div className={cn("scrollbar-none flex gap-2 overflow-x-auto pb-2", sticky && "top-20 z-20 bg-cream/96 py-3 lg:sticky")} role="tablist" aria-label="Academic pathway">
        {categories.map((item, index) => (
          <button key={item} id={`program-tab-${item}`} type="button" role="tab" aria-selected={category === item} aria-controls="program-panel" onClick={() => setCategory(item)} className={cn("tab-button", category === item && "tab-button-active")}>
            <span className="mr-2 font-display text-sm">0{index + 1}</span>{item}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          id="program-panel"
          role="tabpanel"
          aria-labelledby={`program-tab-${category}`}
          key={category}
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -8 }}
          transition={{ duration: reduced ? 0 : 0.28 }}
          className="mt-7 grid gap-px overflow-hidden border border-cream-deep bg-cream-deep md:grid-cols-2"
        >
          {visible.map((program, index) => {
            const Icon = program.icon;
            return (
              <article id={program.id} key={program.id} className="group relative min-h-72 scroll-mt-36 bg-paper p-6 sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <span className="flex h-11 w-11 items-center justify-center border border-cream-deep bg-cream text-ink transition group-hover:border-ink group-hover:bg-ink group-hover:text-gold-light"><Icon size={20} /></span>
                  <span className="font-display text-2xl text-gold">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-7 text-xs font-bold uppercase text-girls">{program.level}</p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-ink">{program.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-muted">{program.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {program.subjects.map((subject) => <span key={subject} className="rounded-full border border-cream-deep bg-cream px-2.5 py-1 text-[11px] font-bold text-text">{subject}</span>)}
                </div>
                <Link href={`/contact?program=${program.id}#enquiry`} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-girls">Ask about this program <ArrowRight size={15} /></Link>
              </article>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
