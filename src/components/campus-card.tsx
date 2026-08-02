import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import type { campuses } from "@/data/site";
import { cn, mapHref, telHref, whatsappHref } from "@/lib/utils";

type Campus = (typeof campuses)[number];

export function CampusCard({ campus }: { campus: Campus }) {
  return (
    <article className="campus-card group">
      <div className={cn("h-1 w-16", campus.accent === "burgundy" ? "bg-burgundy-600" : campus.accent === "gold" ? "bg-gold-500" : "bg-navy-800")} />
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-gold-700">Karachi</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-navy-950">{campus.name}</h3>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-navy-950 text-gold-300 transition-transform group-hover:-translate-y-0.5">
            <MapPin size={20} aria-hidden="true" />
          </span>
        </div>
        <p className="mt-5 min-h-[72px] text-sm leading-6 text-navy-600">{campus.address}</p>
        <div className="mt-5 space-y-2 border-t border-navy-900/10 pt-5">
          {campus.phones.map((phone) => (
            <a key={phone} href={telHref(phone)} className="flex items-center gap-2 text-sm font-semibold text-navy-900 transition hover:text-burgundy-700">
              <Phone size={15} className="text-gold-700" /> {phone}
            </a>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <a href={telHref(campus.phones[0])} className="card-action" aria-label={`Call ${campus.name}`}><Phone size={16} /><span>Call</span></a>
          <a href={whatsappHref(campus.whatsapp, `Hello, I would like admissions information for ${campus.name}.`)} target="_blank" rel="noreferrer" className="card-action" aria-label={`WhatsApp ${campus.name}`}><MessageCircle size={16} /><span>WhatsApp</span></a>
          <a href={mapHref(campus.address)} target="_blank" rel="noreferrer" className="card-action" aria-label={`Find ${campus.name} on Google Maps`}><ArrowUpRight size={16} /><span>Map</span></a>
        </div>
      </div>
    </article>
  );
}
