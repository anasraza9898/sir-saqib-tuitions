"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Expand, Images, X } from "lucide-react";
import { Modal } from "@/components/modal";

type ResultItem = { src: string; alt: string; title: string };

export function ResultGallery({ items, initialCount = 3 }: { items: readonly ResultItem[]; initialCount?: number }) {
  const [count, setCount] = useState(Math.min(initialCount, items.length));
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const active = selected === null ? null : items[selected];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, count).map((item, index) => (
          <article key={item.src} className="result-card group">
            <button type="button" className="relative block aspect-[4/5] w-full overflow-hidden bg-cream-100 text-left" onClick={() => setSelected(index)} aria-label={`Open ${item.title} result poster`}>
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain transition duration-300 group-hover:scale-[1.02]" />
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-sm bg-navy-950/90 text-white shadow-md"><Expand size={17} aria-hidden="true" /></span>
            </button>
            <div className="border-t border-navy-900/10 p-4">
              <p className="text-xs font-bold uppercase text-gold-700">Academic result</p>
              <h3 className="mt-1 font-semibold text-navy-950">{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
      {count < items.length ? (
        <div className="mt-7 text-center">
          <button type="button" className="btn-secondary" onClick={() => setCount(items.length)}><Images size={17} /> Load more results</button>
        </div>
      ) : null}

      <Modal open={active !== null} onClose={close} labelledBy="result-dialog-title" className="max-w-4xl bg-cream-50">
        {active ? (
          <div>
            <div className="flex items-center justify-between border-b border-navy-900/10 px-4 py-3 sm:px-5">
              <h2 id="result-dialog-title" className="font-display text-lg font-bold text-navy-950">{active.title}</h2>
              <button type="button" className="icon-button" onClick={close} aria-label="Close result poster"><X size={20} /></button>
            </div>
            <div className="relative h-[75dvh] min-h-[360px] w-full">
              <Image src={active.src} alt={active.alt} fill sizes="100vw" className="object-contain p-3" priority />
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
