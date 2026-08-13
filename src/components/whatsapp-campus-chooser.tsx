"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { Modal } from "@/components/modal";
import { campuses } from "@/data/site";
import { cn, telHref, whatsappHref } from "@/lib/utils";

type CampusId = (typeof campuses)[number]["id"];
type ChooserOptions = {
  campusId?: CampusId;
  message?: string;
};

type WhatsAppChooserContextValue = {
  openChooser: (options?: ChooserOptions) => void;
};

const WhatsAppChooserContext = createContext<WhatsAppChooserContextValue | null>(null);

export function useWhatsAppChooser() {
  const context = useContext(WhatsAppChooserContext);
  if (!context) throw new Error("useWhatsAppChooser must be used within WhatsAppChooserProvider");
  return context;
}

export function WhatsAppChooserProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ChooserOptions>({});
  const message = options.message ?? "Hello, I would like admission guidance from Sir Saqib Tuitions.";

  const openChooser = useCallback((nextOptions: ChooserOptions = {}) => {
    setOptions(nextOptions);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openChooser }), [openChooser]);

  return (
    <WhatsAppChooserContext.Provider value={value}>
      {children}
      <Modal open={open} onClose={close} labelledBy="whatsapp-campus-title" className="max-w-3xl rounded-t-2xl sm:rounded-sm">
        <div className="bg-paper">
          <div className="flex items-start justify-between gap-4 border-b border-cream-deep bg-ink px-5 py-5 text-white sm:px-7">
            <div>
              <p className="text-xs font-bold uppercase text-gold-light">WhatsApp admissions</p>
              <h2 id="whatsapp-campus-title" className="mt-2 font-display text-3xl leading-tight">Choose a campus contact.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/62">Select the campus most relevant to the student. Hill Park includes both confirmed admissions contacts.</p>
            </div>
            <button type="button" onClick={close} className="icon-control shrink-0 border-white/20 bg-white/5 text-white hover:bg-white/10" aria-label="Close WhatsApp campus chooser"><X size={20} /></button>
          </div>
          <div className="grid gap-3 p-4 sm:p-6 lg:grid-cols-3">
            {campuses.map((campus, index) => {
              const selected = campus.id === options.campusId;
              const accent = campus.id === "boys" ? "text-boys border-boys" : campus.id === "girls" ? "text-girls border-girls" : "text-hill border-hill";
              return (
                <section key={campus.id} className={cn("border bg-paper p-4", selected ? accent : "border-cream-deep")}>
                  <p className={cn("font-display text-2xl", campus.id === "hill-park" ? "text-hill" : campus.id === "boys" ? "text-boys" : "text-girls")}>{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-display text-2xl text-ink">{campus.name}</h3>
                  <div className="mt-4 space-y-3">
                    {campus.contacts.map((contact) => (
                      <div key={contact.phone} className="border-t border-cream-deep pt-3">
                        <p className="text-sm font-bold text-ink">{contact.name}</p>
                        <p className="mt-1 text-sm text-muted">{contact.phone}</p>
                        <div className="mt-3 flex gap-2">
                          <a href={whatsappHref(contact.whatsapp, message)} target="_blank" rel="noreferrer" className="button-ink min-h-10 flex-1 px-3 text-xs" onClick={close}><MessageCircle size={15} /> WhatsApp</a>
                          <a href={telHref(contact.phone)} className="icon-control h-10 w-10 shrink-0" aria-label={`Call ${contact.name}`}><Phone size={15} /></a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </Modal>
    </WhatsAppChooserContext.Provider>
  );
}

export function WhatsAppChooserButton({
  children,
  campusId,
  message,
  className,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  campusId?: CampusId;
  message?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const { openChooser } = useWhatsAppChooser();
  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={() => openChooser({ campusId, message })}>
      {children}
    </button>
  );
}
