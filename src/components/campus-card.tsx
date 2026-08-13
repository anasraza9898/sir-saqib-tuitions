import Image from "next/image";
import { ArrowUpRight, MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import { WhatsAppChooserButton } from "@/components/whatsapp-campus-chooser";
import type { campuses } from "@/data/site";
import { cn, mapHref, telHref } from "@/lib/utils";

type Campus = (typeof campuses)[number];

export function CampusCard({ campus, showPoster = false, index }: { campus: Campus; showPoster?: boolean; index?: string }) {
  const accent = campus.id === "boys" ? "border-boys text-boys" : campus.id === "girls" ? "border-girls text-girls" : "border-hill text-hill";
  return (
    <article className={cn("group relative flex h-full overflow-hidden border bg-paper", accent)}>
      <div className="relative flex w-full flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="font-display text-2xl text-current">{index}</p>
            <h3 className="mt-3 font-display text-3xl leading-none text-ink sm:text-4xl">{campus.name}</h3>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-current/30 bg-current text-white transition-transform group-hover:-translate-y-1"><MapPin size={19} /></span>
        </div>
        <p className="mt-7 min-h-20 max-w-sm text-sm leading-7 text-muted">{campus.address}</p>
        <div className="mt-6 min-h-[8.5rem] border-t border-cream-deep pt-5">
          <p className="mb-2 text-xs font-bold uppercase text-muted">Campus Head</p>
          <p className="mb-3 text-sm font-bold text-ink">{campus.contacts.map((contact) => contact.name).join(" / ")}</p>
          {campus.phones.map((phone) => <a key={phone} href={telHref(phone)} className="mr-4 inline-flex items-center gap-2 py-1 text-sm font-bold text-ink hover:text-current"><Phone size={15} className="text-current" />{phone}</a>)}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <a href={telHref(campus.phones[0])} className="button-outline"><Phone size={15} /> Call</a>
          <WhatsAppChooserButton campusId={campus.id} message={`Hello, I would like admission guidance for ${campus.name}.`} className="button-outline"><MessageCircle size={15} /> WhatsApp</WhatsAppChooserButton>
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
