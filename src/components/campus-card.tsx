import Image from "next/image";
import { ArrowUpRight, MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import type { campuses } from "@/data/site";
import { cn, mapHref, telHref, whatsappHref } from "@/lib/utils";

type Campus = (typeof campuses)[number];

export function CampusCard({ campus, showPoster = false, index }: { campus: Campus; showPoster?: boolean; index?: string }) {
  const accent = campus.id === "boys" ? "border-boys text-boys" : campus.id === "girls" ? "border-girls text-girls" : "border-gold text-[#8a671d]";
  return (
    <article className={cn("group relative overflow-hidden border bg-paper", accent)}>
      <span className="absolute right-7 top-0 h-full w-px bg-current opacity-10" aria-hidden="true" />
      <span className="absolute right-0 top-24 h-px w-24 bg-current opacity-15" aria-hidden="true" />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase text-current">{index ? `${index} / ` : ""}Karachi</p>
            <h3 className="mt-4 font-display text-3xl leading-none text-ink sm:text-4xl">{campus.name}</h3>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-current/30 bg-current text-white transition-transform group-hover:-translate-y-1"><MapPin size={19} /></span>
        </div>
        <p className="mt-7 min-h-20 max-w-sm text-sm leading-7 text-muted">{campus.address}</p>
        <div className="mt-6 border-t border-cream-deep pt-5">
          {campus.phones.map((phone) => <a key={phone} href={telHref(phone)} className="mr-4 inline-flex items-center gap-2 py-1 text-sm font-bold text-ink hover:text-current"><Phone size={15} className="text-current" />{phone}</a>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <a href={telHref(campus.phones[0])} className="button-outline"><Phone size={15} /> Call</a>
          <a href={whatsappHref(campus.whatsapp, `Hello, I would like admission guidance for ${campus.name}.`)} target="_blank" rel="noreferrer" className="button-outline"><MessageCircle size={15} /> WhatsApp</a>
          <a href={mapHref(campus.address)} target="_blank" rel="noreferrer" className="button-outline">Map <ArrowUpRight size={15} /></a>
        </div>
        {showPoster ? (
          <details className="mt-6 border-t border-cream-deep pt-4">
            <summary className="flex list-none items-center justify-between text-sm font-bold text-ink marker:hidden">Published admissions poster <Plus size={16} /></summary>
            <div className="relative mt-4 aspect-[4/5] overflow-hidden bg-cream"><Image src={campus.poster} alt={`${campus.name} admissions poster`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain" /></div>
          </details>
        ) : null}
      </div>
    </article>
  );
}
