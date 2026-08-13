"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileImage } from "lucide-react";
import { programs } from "@/data/site";
import { cn } from "@/lib/utils";

const categories = ["Matric", "Intermediate", "Grades I-VIII", "Huffaz"] as const;
type Category = (typeof categories)[number];
type Program = (typeof programs)[number];

function ProgrammePoster({ program, single }: { program: Program; single: boolean }) {
  if ("posterPair" in program) {
    const posters = [
      { campus: "Boys Campus", src: program.posterPair.boys, tone: "text-boys" },
      { campus: "Girls Campus", src: program.posterPair.girls, tone: "text-girls" },
    ] as const;

    return (
      <div className="mt-7 overflow-hidden border border-cream-deep bg-white">
        <div className="grid bg-white md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
          <div className="contents md:hidden">
            {posters.map((poster, index) => (
              <div key={poster.campus} className={cn("bg-white p-3 sm:p-4", index > 0 && "border-t border-cream-deep")}>
                <p className={cn("text-center text-[10px] font-bold uppercase tracking-wide", poster.tone)}>{poster.campus}</p>
                <div className="relative mx-auto mt-3 aspect-[4/5] w-full max-w-60 bg-white">
                  <Image src={poster.src} alt={`${program.title} ${poster.campus} official academy poster`} fill sizes="(max-width: 767px) 82vw" className="object-contain" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden bg-white p-4 md:block">
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-boys">Boys Campus</p>
            <div className="relative mx-auto mt-3 aspect-[4/5] w-full max-w-44 bg-white lg:max-w-48">
              <Image src={program.posterPair.boys} alt={`${program.title} Boys Campus official academy poster`} fill sizes="12rem" className="object-contain" />
            </div>
          </div>
          <div aria-hidden="true" className="hidden bg-cream-deep md:block" />
          <div className="hidden bg-white p-4 md:block">
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-girls">Girls Campus</p>
            <div className="relative mx-auto mt-3 aspect-[4/5] w-full max-w-44 bg-white lg:max-w-48">
              <Image src={program.posterPair.girls} alt={`${program.title} Girls Campus official academy poster`} fill sizes="12rem" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (program.poster) {
    return (
      <div className={cn("mt-7 flex justify-center border border-cream-deep bg-white p-4 sm:p-5", single && "mx-auto w-full max-w-md")}>
        <div className="relative aspect-[4/5] w-full max-w-64 bg-white sm:max-w-72">
          <Image src={program.poster} alt={`${program.title} official academy poster`} fill sizes="(max-width: 768px) 80vw, 18rem" className="object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7 border border-cream-deep bg-white p-5">
      <FileImage size={22} className="mx-auto text-gold" />
      <p className="mt-3 text-xs font-bold uppercase text-girls">Official programme poster slot</p>
      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-muted">The approved poster for this programme will appear through the final asset workflow when supplied.</p>
    </div>
  );
}

export function ProgramExplorer({ sticky = false }: { sticky?: boolean }) {
  const [category, setCategory] = useState<Category>("Matric");
  const reduced = useReducedMotion();
  const visible = programs.filter((program) => program.category === category);
  const single = visible.length === 1;

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
          className={cn("mt-8 grid gap-px overflow-hidden border border-cream-deep bg-cream-deep", single ? "mx-auto max-w-3xl" : "md:grid-cols-2")}
        >
          {visible.map((program, index) => {
            const Icon = program.icon;
            const paired = "posterPair" in program;
            return (
              <article id={program.id} key={program.id} className={cn("group relative scroll-mt-36 bg-paper p-6 sm:p-8", single ? "flex min-h-0 flex-col text-center" : paired ? "grid grid-rows-[auto_auto_auto_auto] md:row-span-4 md:[grid-template-rows:subgrid]" : "flex h-full flex-col")}>
                <div>
                  <div className="flex items-start justify-between gap-5">
                    <span className={cn("flex h-11 w-11 items-center justify-center border border-cream-deep bg-cream text-ink transition group-hover:border-ink group-hover:bg-ink group-hover:text-gold-light", single && "mx-auto")}><Icon size={20} /></span>
                    {!single ? <span className="font-display text-2xl text-gold">{String(index + 1).padStart(2, "0")}</span> : null}
                  </div>
                  <p className="mt-7 text-xs font-bold uppercase text-girls">{program.level}</p>
                  <h3 className="mt-2 font-display text-3xl leading-tight text-ink">{program.title}</h3>
                  <p className={cn("mt-4 max-w-xl text-sm leading-7 text-muted", single && "mx-auto")}>{program.description}</p>
                </div>
                <div className={cn("mt-5 flex flex-wrap gap-2", single && "justify-center")}>
                  {program.subjects.map((subject) => <span key={subject} className="rounded-full border border-cream-deep bg-cream px-2.5 py-1 text-[11px] font-bold text-text">{subject}</span>)}
                </div>
                <ProgrammePoster program={program} single={single} />
                <Link href={`/contact?program=${program.id}#enquiry`} className={cn("inline-flex items-center gap-2 pt-7 text-sm font-bold text-ink hover:text-girls", paired ? "self-end" : "mt-auto")}>Ask about this program <ArrowRight size={15} /></Link>
              </article>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
