"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { WhatsAppChooserButton } from "@/components/whatsapp-campus-chooser";
import { campuses } from "@/data/site";
import { cn, mapHref, telHref } from "@/lib/utils";

export function CampusContactSelector() {
  const [selectedId, setSelectedId] = useState<(typeof campuses)[number]["id"]>(campuses[0].id);
  const reduced = useReducedMotion();
  const campus = campuses.find((item) => item.id === selectedId) ?? campuses[0];
  const accent = campus.id === "boys" ? "text-boys" : campus.id === "girls" ? "text-girls" : "text-hill";

  return (
    <div className="border border-cream-deep bg-paper">
      <div className="scrollbar-none flex overflow-x-auto border-b border-cream-deep p-2" role="tablist" aria-label="Select a campus">
        {campuses.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={item.id === selectedId} aria-controls="campus-contact-panel" onClick={() => setSelectedId(item.id)} className={cn("tab-button min-w-max flex-1", item.id === selectedId && "tab-button-active")}>{item.shortName}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div id="campus-contact-panel" role="tabpanel" key={campus.id} initial={{ opacity: 0, x: reduced ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">{campus.name}</h2>
            <p className="mt-5 flex max-w-2xl gap-3 text-sm leading-7 text-muted"><MapPin size={18} className={cn("mt-1 shrink-0", accent)} />{campus.address}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {campus.contacts.map((contact) => (
                <div key={contact.phone} className="border-l border-cream-deep pl-4">
                  <p className="text-sm font-bold text-ink">{contact.name}</p>
                  <a href={telHref(contact.phone)} className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-girls"><Phone size={15} />{contact.phone}</a>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:max-w-52 lg:justify-end">
            <a href={telHref(campus.phones[0])} className="button-ink"><Phone size={15} /> Call</a>
            <WhatsAppChooserButton campusId={campus.id} message={`Hello, I would like admission guidance for ${campus.name}.`} className="button-outline"><MessageCircle size={15} /> WhatsApp</WhatsAppChooserButton>
            <a href={mapHref(campus.address)} target="_blank" rel="noreferrer" className="button-outline">Map <ArrowUpRight size={15} /></a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
