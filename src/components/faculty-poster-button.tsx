"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Expand, X } from "lucide-react";
import { Modal } from "@/components/modal";

export function FacultyPosterButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-girls"><Expand size={16} /> View published faculty roster</button>
      <Modal open={open} onClose={close} labelledBy="faculty-poster-title" className="max-w-3xl">
        <div className="flex items-center justify-between border-b border-cream-deep px-4 py-3 sm:px-5"><h2 id="faculty-poster-title" className="font-display text-xl text-ink">Published Faculty Roster</h2><button type="button" className="icon-control" onClick={close} aria-label="Close faculty poster"><X size={19} /></button></div>
        <div className="relative h-[78dvh] min-h-96 bg-cream"><Image src="/assets/posters/faculty-instructors.webp" alt="Published Sir Saqib Tuitions faculty roster poster" fill sizes="100vw" className="object-contain p-3" priority /></div>
      </Modal>
    </>
  );
}
