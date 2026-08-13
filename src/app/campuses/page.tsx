import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MotionReveal } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppChooserButton } from "@/components/whatsapp-campus-chooser";
import { campuses } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { mapHref, telHref } from "@/lib/utils";

export const metadata: Metadata = createMetadata("Campuses", "Find the Boys, Girls and Hill Park campuses of Sir Saqib Tuitions in Karachi with direct call, WhatsApp and map actions.", "/campuses");

export default function CampusesPage() {
  return (
    <>
      <PageHero title="Three Karachi campuses, each easy to reach" path="/campuses" description="Compare our Boys, Girls and Hill Park campuses to find the location most relevant to the student, with direct access to campus contact and admission information." tone="paper" index="03">
        <div className="grid gap-5 sm:grid-cols-3 lg:justify-self-center"><div><p className="font-display text-4xl text-boys">01</p><p className="text-xs font-bold text-muted">Boys Campus</p></div><div><p className="font-display text-4xl text-girls">02</p><p className="text-xs font-bold text-muted">Girls Campus</p></div><div><p className="font-display text-4xl text-hill">03</p><p className="text-xs font-bold text-muted">Hill Park Campus</p></div></div>
      </PageHero>
      <section className="bg-paper">
        {campuses.map((campus) => {
          const accent = campus.id === "boys" ? "text-boys bg-[#e8eef8]" : campus.id === "girls" ? "text-girls bg-[#f8efed]" : "text-hill bg-[#eefafa]";
          const posterTone = campus.id === "boys" ? "bg-[#d6e1f2]" : campus.id === "girls" ? "bg-[#efdfdd]" : "bg-[#d8f1f2]";
          return (
            <article key={campus.id} className={`border-b border-cream-deep ${accent}`}>
              <div className="container-wide grid gap-12 py-14 lg:grid-cols-[0.45fr_0.55fr] lg:items-center lg:py-20">
                <MotionReveal className="mx-auto w-full max-w-md">
                  <div className={`relative aspect-[4/5] overflow-hidden border border-current/25 ${posterTone} p-2 shadow-[0_18px_45px_rgba(8,17,38,0.10)]`}>
                    <Image src={campus.poster} alt={`${campus.name} official admissions poster`} fill sizes="(max-width: 1024px) 100vw, 32vw" className="object-contain" />
                  </div>
                </MotionReveal>
                <MotionReveal delay={0.08} className="relative border-l border-current/25 pl-6 sm:pl-10">
                  <h2 className="font-display text-5xl leading-none text-ink sm:text-6xl">{campus.name}</h2>
                  <p className="mt-7 flex max-w-2xl gap-3 text-base leading-8 text-muted"><MapPin size={19} className="mt-1 shrink-0 text-current" />{campus.address}</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">{campus.contacts.map((contact) => <div key={contact.phone}><p className="text-sm font-bold text-ink">{contact.name}</p><a href={telHref(contact.phone)} className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-current"><Phone size={16} className="text-current" />{contact.phone}</a></div>)}</div>
                  <div className="mt-8 flex flex-wrap gap-2"><a href={telHref(campus.phones[0])} className="button-ink"><Phone size={16} /> Call</a><WhatsAppChooserButton campusId={campus.id} message={`Hello, I would like admission guidance for ${campus.name}.`} className="button-paper"><MessageCircle size={16} /> WhatsApp</WhatsAppChooserButton><a href={mapHref(campus.address)} target="_blank" rel="noreferrer" className="button-paper">Open Map <ArrowUpRight size={16} /></a></div>
                </MotionReveal>
              </div>
            </article>
          );
        })}
      </section>
      <section className="section-space bg-paper">
        <div className="container-wide">
          <SectionHeading number="04" eyebrow="Campus comparison" title="The essentials at a glance." description="All three campuses follow the same focused academic approach while providing students with direct access to campus-specific admission support." />
          <div className="mt-10 overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left"><thead><tr className="border-y border-ink/15 text-xs font-bold uppercase text-muted"><th className="px-4 py-4">Campus</th><th className="px-4 py-4">Area</th><th className="px-4 py-4">Direct Contact</th><th className="px-4 py-4">Environment</th></tr></thead><tbody>{campuses.map((campus) => <tr key={campus.id} className="border-b border-cream-deep text-sm"><td className="px-4 py-5 font-bold text-ink">{campus.name}</td><td className="px-4 py-5 text-muted">{campus.area}</td><td className="px-4 py-5 text-muted">{campus.contacts.map((contact) => `${contact.name} - ${contact.phone}`).join(" / ")}</td><td className="px-4 py-5"><span className="inline-flex items-center gap-2 text-muted"><ShieldCheck size={15} className="text-gold" />Secured study space</span></td></tr>)}</tbody></table></div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
