"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Download, Eye, MessageCircle, X } from "lucide-react";
import { Modal } from "@/components/modal";
import { WhatsAppChooserButton } from "@/components/whatsapp-campus-chooser";
import { timetables, type Timetable } from "@/data/site";
import { cn } from "@/lib/utils";

const gradeOrder: Timetable["grade"][] = ["IX", "X", "XI", "XII"];

export function TimetableExplorer({ compact = false }: { compact?: boolean }) {
  return (
    <Suspense fallback={<div className="min-h-[520px] animate-pulse bg-cream motion-reduce:animate-none" aria-label="Loading timetable finder" />}>
      <TimetableExplorerInner compact={compact} />
    </Suspense>
  );
}

function normalizeClassParam(value: string | null): Timetable["classLevel"] | "" {
  const romanToNumber: Record<string, Timetable["classLevel"]> = { IX: "9", X: "10", XI: "11", XII: "12" };
  if (!value) return "";
  const normalized = value.trim().toUpperCase();
  if (normalized === "9" || normalized === "10" || normalized === "11" || normalized === "12") return normalized;
  return romanToNumber[normalized] ?? "";
}

function TimetableExplorerInner({ compact }: { compact: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);

  const queryMatch = useMemo(() => {
    const classLevel = normalizeClassParam(searchParams.get("class"));
    const stream = searchParams.get("stream")?.toLowerCase();
    const batch = searchParams.get("batch");
    if (batch) {
      const exact = timetables.find((item) => item.id === batch);
      if (exact) return exact;
    }
    return timetables.find((item) =>
      (!classLevel || item.classLevel === classLevel) &&
      (!stream || item.stream.toLowerCase() === stream),
    );
  }, [searchParams]);

  const [selectedId, setSelectedId] = useState(queryMatch?.id ?? timetables[0].id);
  const selected = timetables.find((item) => item.id === selectedId) ?? timetables[0];
  const gradeItems = timetables.filter((item) => item.grade === selected.grade);
  const streams = [...new Set(gradeItems.map((item) => item.stream))];
  const selectedIndex = timetables.findIndex((item) => item.id === selected.id);

  function choose(item: Timetable) {
    setSelectedId(item.id);
    setModalOpen(false);
    const params = new URLSearchParams();
    params.set("class", item.classLevel);
    params.set("stream", item.stream.toLowerCase());
    params.set("batch", item.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function chooseGrade(grade: Timetable["grade"]) {
    choose(timetables.find((item) => item.grade === grade) ?? selected);
  }

  function chooseStream(stream: Timetable["stream"]) {
    choose(gradeItems.find((item) => item.stream === stream) ?? selected);
  }

  return (
    <div className="border border-cream-deep bg-paper">
      <div className="grid min-w-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-b border-cream-deep bg-cream p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-girls">Step 1</p>
              <h3 className="mt-2 font-display text-2xl text-ink">Select grade</h3>
            </div>
            <CalendarDays size={22} className="shrink-0 text-gold" />
          </div>

          <div className="mt-5 grid grid-cols-4 gap-1 rounded-sm border border-ink/12 bg-paper p-1 lg:grid-cols-2">
            {gradeOrder.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => chooseGrade(grade)}
                aria-pressed={selected.grade === grade}
                className={cn(
                  "min-h-10 rounded-sm px-2 text-sm font-bold text-muted transition-colors",
                  selected.grade === grade && "bg-ink text-white",
                )}
              >
                {grade}
              </button>
            ))}
          </div>

          <div className="mt-7">
            <p className="text-xs font-bold uppercase text-girls">Step 2</p>
            <h4 className="mt-2 font-display text-xl text-ink">Choose programme</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {streams.map((stream) => (
                <button
                  key={stream}
                  type="button"
                  onClick={() => chooseStream(stream)}
                  aria-pressed={selected.stream === stream}
                  className={cn(
                    "min-h-10 rounded-sm border px-3 text-xs font-bold transition-colors",
                    selected.stream === stream
                      ? "border-ink bg-ink text-white hover:border-ink hover:text-white"
                      : "border-ink/12 bg-paper text-muted hover:border-gold hover:text-ink",
                  )}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <p className="text-xs font-bold uppercase text-girls">Step 3</p>
            <h4 className="mt-2 font-display text-xl text-ink">Available timetables</h4>
            <div className="mt-4 grid auto-rows-fr gap-2">
              {streams.map((stream) => (
                <section key={stream} className="min-w-0">
                  <p className="mb-2 text-[10px] font-bold uppercase text-muted">{stream}</p>
                  <div className="grid auto-rows-fr gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    {gradeItems.filter((item) => item.stream === stream).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => choose(item)}
                        aria-pressed={selected.id === item.id}
                        className={cn(
                          "flex min-h-[4.9rem] w-full flex-col justify-between border border-cream-deep bg-paper p-3 text-left transition-colors hover:border-gold",
                          selected.id === item.id && "border-gold bg-white",
                        )}
                      >
                        <span className="text-sm font-extrabold leading-5 text-ink">{item.variant}</span>
                        <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase text-muted">
                          <Eye size={13} className="text-gold" /> View timetable
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </aside>

        <div className={cn("min-w-0 p-4 sm:p-6", compact && "lg:p-5")}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-girls">Selected timetable</p>
              <h3 id="selected-timetable-title" className="mt-1 font-display text-2xl leading-tight text-ink sm:text-3xl">{selected.label}</h3>
              <p className="mt-1 text-sm text-muted">{selected.stream} / {selected.variant}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="button-ink" onClick={() => setModalOpen(true)}>
                <Eye size={16} /> View timetable
              </button>
              <a href={selected.src} download className="button-paper">
                <Download size={16} /> Download
              </a>
            </div>
          </div>

          <div className="overflow-hidden border border-cream-deep bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.src}
                className="relative aspect-[4/3] w-full min-w-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                <Image
                  src={selected.src}
                  alt={selected.alt}
                  fill
                  priority={selectedIndex === 0}
                  sizes="(max-width: 1024px) calc(100vw - 2rem), 58rem"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-l-2 border-gold bg-cream p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-muted">Select a grade and programme to view the latest timetable provided by Sir Saqib Tuitions.</p>
            <WhatsAppChooserButton message={`Hello, I would like to confirm the ${selected.label} timetable.`} className="button-outline shrink-0">
              <MessageCircle size={16} /> Confirm
            </WhatsAppChooserButton>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} labelledBy="timetable-modal-title" className="bg-paper sm:max-w-[min(96vw,78rem)]">
        <div className="flex items-center justify-between gap-4 border-b border-cream-deep bg-paper px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h3 id="timetable-modal-title" className="truncate font-display text-2xl text-ink">{selected.label}</h3>
            <p className="text-xs font-bold uppercase text-muted">{selected.stream} / {selected.variant}</p>
          </div>
          <button type="button" className="icon-control shrink-0" onClick={() => setModalOpen(false)} aria-label="Close timetable preview">
            <X size={18} />
          </button>
        </div>
        <div className="bg-white p-2 sm:p-4">
          <div className="relative h-[min(78dvh,48rem)] min-h-[22rem] w-full bg-white">
            <Image
              src={selected.src}
              alt={selected.alt}
              fill
              sizes="96vw"
              className="object-contain"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
