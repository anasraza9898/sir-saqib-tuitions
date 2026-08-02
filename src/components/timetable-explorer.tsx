"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalendarDays, Download, Info } from "lucide-react";
import { timetables, type Timetable } from "@/data/site";

export function TimetableExplorer({ compact = false }: { compact?: boolean }) {
  const [campus, setCampus] = useState<"boys" | "girls">("boys");
  const [classLevel, setClassLevel] = useState("10");
  const [stream, setStream] = useState<Timetable["stream"]>("Science");
  const [variantId, setVariantId] = useState("");

  const options = useMemo(() => timetables.filter((item) => item.campus === campus), [campus]);
  const classes = useMemo(() => [...new Set(options.map((item) => item.classLevel))], [options]);
  const classItems = options.filter((item) => item.classLevel === classLevel);
  const streams = [...new Set(classItems.map((item) => item.stream))];
  const streamValue = streams.includes(stream) ? stream : streams[0] ?? "";
  const matches = classItems.filter((item) => item.stream === streamValue);
  const selected = matches.find((item) => item.id === variantId) ?? matches[0];

  function changeCampus(value: "boys" | "girls") {
    const first =
      timetables.find((item) => item.campus === value && item.classLevel === classLevel && item.stream === stream) ??
      timetables.find((item) => item.campus === value && item.classLevel === classLevel) ??
      timetables.find((item) => item.campus === value);
    setCampus(value);
    setClassLevel(first?.classLevel ?? "9");
    setStream(first?.stream ?? "Science");
    setVariantId("");
  }

  return (
    <div className="overflow-hidden rounded-md border border-navy-900/10 bg-white shadow-sm">
      <div className="grid gap-5 border-b border-navy-900/10 bg-cream-50 p-4 sm:p-6 lg:grid-cols-[auto_1fr_1fr_1fr] lg:items-end">
        <fieldset>
          <legend className="control-label">Campus</legend>
          <div className="mt-2 inline-flex rounded-sm border border-navy-900/15 bg-white p-1">
            {(["boys", "girls"] as const).map((value) => (
              <button key={value} type="button" onClick={() => changeCampus(value)} aria-pressed={campus === value} className={`segment-button ${campus === value ? "segment-button-active" : ""}`}>
                {value === "boys" ? "Boys" : "Girls"}
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          <span className="control-label">Class</span>
          <select className="form-control mt-2" value={classLevel} onChange={(event) => {
            const nextClass = event.target.value;
            const firstForClass = options.find((item) => item.classLevel === nextClass);
            setClassLevel(nextClass);
            setStream(firstForClass?.stream ?? "Science");
            setVariantId("");
          }}>
            {classes.map((value) => <option key={value} value={value}>Class {value}</option>)}
          </select>
        </label>
        <label>
          <span className="control-label">Group / stream</span>
          <select className="form-control mt-2" value={streamValue} onChange={(event) => { setStream(event.target.value as Timetable["stream"]); setVariantId(""); }}>
            {streams.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label>
          <span className="control-label">Batch</span>
          <select className="form-control mt-2" value={selected?.id ?? ""} onChange={(event) => setVariantId(event.target.value)}>
            {matches.map((item) => <option key={item.id} value={item.id}>{item.variant}</option>)}
          </select>
        </label>
      </div>

      {selected ? (
        <div className={`grid gap-6 p-4 sm:p-6 ${compact ? "lg:grid-cols-[0.72fr_0.28fr]" : "lg:grid-cols-[minmax(0,1fr)_280px]"}`}>
          <div className="relative aspect-[1.45/1] overflow-hidden rounded-sm border border-navy-900/10 bg-white">
            <Image
              key={selected.src}
              src={selected.src}
              alt={`${campus === "boys" ? "Boys" : "Girls"} campus Class ${selected.classLevel} ${selected.stream} ${selected.variant} timetable poster`}
              fill
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-contain"
            />
          </div>
          <aside className="flex flex-col justify-between rounded-sm bg-navy-950 p-5 text-white">
            <div>
              <CalendarDays className="text-gold-300" size={24} aria-hidden="true" />
              <p className="mt-5 text-xs font-bold uppercase text-gold-300">Selected timetable</p>
              <h3 className="mt-2 font-display text-2xl font-bold">Class {selected.classLevel} {selected.stream}</h3>
              <p className="mt-2 text-sm text-cream-100/75">{campus === "boys" ? "Boys Campus" : "Girls Campus"} · {selected.variant}</p>
            </div>
            <div className="mt-8">
              <p className="flex gap-2 text-xs leading-5 text-cream-100/65"><Info size={14} className="mt-0.5 shrink-0" />Use the poster as published. Confirm last-minute changes with the campus.</p>
              <a href={selected.src} download className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold-200 hover:text-white"><Download size={16} /> Download poster</a>
            </div>
          </aside>
        </div>
      ) : <p className="p-8 text-center text-navy-600">No timetable poster matches this selection.</p>}
    </div>
  );
}
