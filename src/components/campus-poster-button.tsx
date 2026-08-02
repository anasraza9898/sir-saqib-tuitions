"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Expand, X } from "lucide-react";
import { Modal } from "@/components/modal";

export function CampusPosterButton({ campusName, poster }: { campusName: string; poster: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="button-paper"><Expand size={16} /> View admissions poster</button>
      <Modal open={open} onClose={close} labelledBy="campus-poster-title" className="max-w-3xl">
        <div className="flex items-center justify-between border-b border-cream-deep px-4 py-3 sm:px-5"><h2 id="campus-poster-title" className="font-display text-xl text-ink">{campusName} Admissions Poster</h2><button type="button" className="icon-control" onClick={close} aria-label="Close campus poster"><X size={19} /></button></div>
        <div className="relative h-[78dvh] min-h-96 bg-cream"><Image src={poster} alt={`${campusName} admissions poster`} fill sizes="100vw" className="object-contain p-3" priority /></div>
      </Modal>
    </>
  );
}
