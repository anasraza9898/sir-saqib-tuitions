"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, Images, X, ZoomIn, ZoomOut } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Modal } from "@/components/modal";
import { results2025, results2026 } from "@/data/site";
import { cn } from "@/lib/utils";

type Year = "2026" | "2025";

export function ResultsShowcase({ initialYear = "2026", showYearToggle = true, initialCount = 3 }: { initialYear?: Year; showYearToggle?: boolean; initialCount?: number }) {
  const [year, setYear] = useState<Year>(initialYear);
  const [count, setCount] = useState(initialCount);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const reduced = useReducedMotion();
  const items = useMemo(() => year === "2026" ? results2026 : results2025, [year]);
  const active = selected === null ? null : items[selected];
  const close = useCallback(() => { setSelected(null); setZoomed(false); }, []);
  const previous = useCallback(() => setSelected((current) => current === null ? null : (current - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setSelected((current) => current === null ? null : (current + 1) % items.length), [items.length]);

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [next, previous, selected]);

  function chooseYear(value: Year) {
    setYear(value);
    setCount(initialCount);
    close();
  }

  return (
    <>
      {showYearToggle ? (
        <div className="mb-7 flex items-center justify-between gap-4 border-y border-cream-deep py-3">
          <div className="flex gap-2" role="group" aria-label="Results year">
            {(["2026", "2025"] as const).map((value) => <button key={value} type="button" onClick={() => chooseYear(value)} aria-pressed={year === value} className={cn("tab-button", year === value && "tab-button-active")}>{value}</button>)}
          </div>
          <p className="hidden text-xs font-bold uppercase text-muted sm:block">{year === "2026" ? "Latest results" : "Previous academic highlights"}</p>
        </div>
      ) : null}
      <AnimatePresence mode="wait">
        <motion.div key={year} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.28 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
          {items.slice(0, count).map((item, index) => (
            <article key={item.src} className={cn("group overflow-hidden border border-cream-deep bg-paper", index === 0 ? "lg:col-span-6" : "lg:col-span-3")}>
              <button type="button" className={cn("relative block w-full overflow-hidden bg-cream", index === 0 ? "aspect-[4/5] sm:aspect-square" : "aspect-[4/5]")} onClick={() => setSelected(index)} aria-label={`Open ${item.title} result poster`}>
                <Image src={item.src} alt={item.alt} fill sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"} className="object-contain transition-transform duration-300 group-hover:scale-[1.025]" loading="lazy" />
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-ink/88 text-white"><Expand size={16} /></span>
              </button>
              <div className="border-t border-cream-deep p-4">
                <p className="text-[10px] font-bold uppercase text-girls">{year} / Academic result</p>
                <h3 className="mt-2 font-display text-xl leading-tight text-ink">{item.title}</h3>
              </div>
            </article>
          ))}
        </motion.div>
      </AnimatePresence>
      {count < items.length ? <div className="mt-7 text-center"><button type="button" className="button-paper" onClick={() => setCount(items.length)}><Images size={16} /> Load remaining poster</button></div> : null}

      <Modal open={active !== null} onClose={close} labelledBy="result-dialog-title" className="max-w-5xl">
        {active ? (
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-cream-deep px-4 py-3 sm:px-5">
              <div><p className="text-[10px] font-bold uppercase text-girls">{year} result</p><h2 id="result-dialog-title" className="mt-1 font-display text-lg text-ink sm:text-xl">{active.title}</h2></div>
              <div className="flex gap-1"><button type="button" className="icon-control" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? "Zoom out result poster" : "Zoom in result poster"}>{zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}</button><button type="button" className="icon-control" onClick={close} aria-label="Close result poster"><X size={19} /></button></div>
            </div>
            <div className="relative h-[72dvh] min-h-96 overflow-auto bg-cream">
              <div className={cn("relative h-full min-h-96 w-full transition-transform", zoomed && "scale-[1.35]")}><Image src={active.src} alt={active.alt} fill sizes="100vw" className="object-contain p-4" priority /></div>
            </div>
            <div className="flex items-center justify-between border-t border-cream-deep p-3"><button type="button" className="button-outline" onClick={previous}><ArrowLeft size={16} /> Previous</button><span className="text-xs font-bold text-muted">{selected! + 1} / {items.length}</span><button type="button" className="button-outline" onClick={next}>Next <ArrowRight size={16} /></button></div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

export function ResultGallery({ items: _items, initialCount = 3 }: { items: readonly { src: string; alt: string; title: string }[]; initialCount?: number }) {
  const initialYear: Year = _items[0]?.src.includes("2025") ? "2025" : "2026";
  return <ResultsShowcase initialYear={initialYear} showYearToggle={false} initialCount={initialCount} />;
}
