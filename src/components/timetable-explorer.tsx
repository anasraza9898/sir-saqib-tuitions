"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Download, MessageCircle, Minus, Plus } from "lucide-react";
import { site, timetables, type Timetable } from "@/data/site";
import { cn, whatsappHref } from "@/lib/utils";

export function TimetableExplorer({ compact = false }: { compact?: boolean }) {
  return <Suspense fallback={<div className="min-h-[520px] animate-pulse bg-cream motion-reduce:animate-none" aria-label="Loading timetable finder" />}><TimetableExplorerInner compact={compact} /></Suspense>;
}

function TimetableExplorerInner({ compact }: { compact: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const queryMatch = timetables.find((item) =>
    item.campus === searchParams.get("campus") &&
    item.classLevel === searchParams.get("class") &&
    item.stream.toLowerCase() === searchParams.get("stream")?.toLowerCase() &&
    (!searchParams.get("batch") || item.id === searchParams.get("batch")),
  );
  const [selectedId, setSelectedId] = useState(queryMatch?.id ?? "b10sa");
  const [zoom, setZoom] = useState(1);
  const selected = timetables.find((item) => item.id === selectedId) ?? timetables[0];
  const campusItems = useMemo(() => timetables.filter((item) => item.campus === selected.campus), [selected.campus]);
  const classes = [...new Set(campusItems.map((item) => item.classLevel))];
  const classItems = campusItems.filter((item) => item.classLevel === selected.classLevel);
  const streams = [...new Set(classItems.map((item) => item.stream))];
  const batches = classItems.filter((item) => item.stream === selected.stream);
  const campusIndex = campusItems.findIndex((item) => item.id === selected.id);

  function choose(item: Timetable) {
    setSelectedId(item.id);
    setZoom(1);
    const params = new URLSearchParams();
    params.set("campus", item.campus);
    params.set("class", item.classLevel);
    params.set("stream", item.stream.toLowerCase());
    params.set("batch", item.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function chooseCampus(campus: Timetable["campus"]) {
    choose(timetables.find((item) => item.campus === campus && item.classLevel === selected.classLevel && item.stream === selected.stream) ?? timetables.find((item) => item.campus === campus && item.classLevel === selected.classLevel) ?? timetables.find((item) => item.campus === campus)!);
  }

  function move(direction: -1 | 1) {
    const nextIndex = (campusIndex + direction + campusItems.length) % campusItems.length;
    choose(campusItems[nextIndex]);
  }

  return (
    <div className="border border-cream-deep bg-paper">
      <div className="grid border-b border-cream-deep bg-cream lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="border-b border-cream-deep p-5 lg:sticky lg:top-20 lg:self-start lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase text-girls">Find a timetable</p><h3 className="mt-2 font-display text-2xl text-ink">Filters</h3></div><CalendarDays size={22} className="text-gold" /></div>
          <fieldset className="mt-6"><legend className="form-label">Campus</legend><div className="mt-2 grid grid-cols-2 gap-1 rounded-sm border border-ink/12 bg-paper p-1">{(["boys", "girls"] as const).map((campus) => <button key={campus} type="button" onClick={() => chooseCampus(campus)} aria-pressed={selected.campus === campus} className={cn("min-h-9 rounded-sm text-xs font-bold capitalize text-muted", selected.campus === campus && (campus === "boys" ? "bg-boys text-white" : "bg-girls text-white"))}>{campus}</button>)}</div></fieldset>
          <label className="mt-5 block"><span className="form-label">Class</span><select className="form-control mt-2" value={selected.classLevel} onChange={(event) => choose(campusItems.find((item) => item.classLevel === event.target.value) ?? selected)}>{classes.map((value) => <option key={value} value={value}>Class {value}</option>)}</select></label>
          <label className="mt-5 block"><span className="form-label">Stream / group</span><select className="form-control mt-2" value={selected.stream} onChange={(event) => choose(classItems.find((item) => item.stream === event.target.value) ?? selected)}>{streams.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
          <label className="mt-5 block"><span className="form-label">Batch</span><select className="form-control mt-2" value={selected.id} onChange={(event) => choose(timetables.find((item) => item.id === event.target.value) ?? selected)}>{batches.map((item) => <option key={item.id} value={item.id}>{item.variant}</option>)}</select></label>
        </div>

        <div className={cn("min-w-0 p-4 sm:p-6", compact && "lg:p-5")}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase text-girls">Selected schedule</p><h3 className="mt-1 font-display text-2xl text-ink">Class {selected.classLevel} {selected.stream}</h3><p className="mt-1 text-xs text-muted">{selected.campus === "boys" ? "Boys Campus" : "Girls Campus"} / {selected.variant}</p></div>
            <div className="flex items-center gap-1" aria-label="Timetable zoom controls"><button type="button" className="icon-control" onClick={() => setZoom((value) => Math.max(1, value - 0.2))} disabled={zoom <= 1} aria-label="Zoom timetable out"><Minus size={17} /></button><span className="min-w-12 text-center text-xs font-bold text-muted">{Math.round(zoom * 100)}%</span><button type="button" className="icon-control" onClick={() => setZoom((value) => Math.min(1.8, value + 0.2))} disabled={zoom >= 1.8} aria-label="Zoom timetable in"><Plus size={17} /></button></div>
          </div>
          <div className="overflow-auto border border-cream-deep bg-white">
            <AnimatePresence mode="wait">
              <motion.div key={selected.src} className="relative aspect-[1.45/1] min-w-full origin-top-left" style={{ scale: zoom }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.24 }}>
                <Image src={selected.src} alt={`${selected.campus === "boys" ? "Boys" : "Girls"} Campus Class ${selected.classLevel} ${selected.stream} ${selected.variant} timetable poster`} fill sizes="(max-width: 1024px) 100vw, 68vw" className="object-contain" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2"><button type="button" className="button-outline" onClick={() => move(-1)}><ArrowLeft size={16} /> Previous</button><button type="button" className="button-outline" onClick={() => move(1)}>Next <ArrowRight size={16} /></button></div>
            <div className="flex flex-wrap gap-2"><a href={selected.src} download className="button-paper"><Download size={16} /> Download</a><a href={whatsappHref(site.whatsapp, `Hello, I would like to confirm the ${selected.campus} Campus Class ${selected.classLevel} ${selected.stream} ${selected.variant} timetable.`)} target="_blank" rel="noreferrer" className="button-ink"><MessageCircle size={16} /> Confirm</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}
