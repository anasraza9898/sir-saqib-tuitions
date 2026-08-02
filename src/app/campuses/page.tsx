import type { Metadata } from "next";
import { ArrowUpRight, Bus, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { CampusPosterButton } from "@/components/campus-poster-button";
import { MotionReveal } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { campuses } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { mapHref, telHref, whatsappHref } from "@/lib/utils";

export const metadata: Metadata = createMetadata("Campuses", "Find the Boys, Girls and Hill Park campuses of Sir Saqib Tuitions in Karachi with direct call, WhatsApp and map actions.", "/campuses");

export default function CampusesPage() {
  return (
    <>
      <PageHero title="Three Karachi campuses, each easy to reach" path="/campuses" description="Compare the Boys, Girls and Hill Park locations, then contact the campus that works for your family." tone="paper" index="03">
        <div className="flex gap-8"><div><p className="font-display text-4xl text-boys">01</p><p className="text-xs font-bold text-muted">Boys</p></div><div><p className="font-display text-4xl text-girls">02</p><p className="text-xs font-bold text-muted">Girls</p></div><div><p className="font-display text-4xl text-gold">03</p><p className="text-xs font-bold text-muted">Hill Park</p></div></div>
      </PageHero>
      <section className="bg-paper">
        {campuses.map((campus, index) => {
          const accent = campus.id === "boys" ? "text-boys bg-[#edf3fb]" : campus.id === "girls" ? "text-girls bg-[#f8efed]" : "text-[#8a671d] bg-cream";
          return (
            <article key={campus.id} className={`border-b border-cream-deep ${accent}`}>
              <div className="container-wide grid min-h-[34rem] gap-10 py-14 lg:grid-cols-[0.34fr_0.66fr] lg:items-center lg:py-20">
                <MotionReveal><p className="font-display text-8xl text-current/18">0{index + 1}</p><p className="mt-3 text-xs font-bold uppercase text-current">Karachi location</p></MotionReveal>
                <MotionReveal delay={0.08} className="relative border-l border-current/25 pl-6 sm:pl-10">
                  <span className="absolute left-0 top-16 h-px w-24 bg-current/25" aria-hidden="true" />
                  <h2 className="font-display text-5xl leading-none text-ink sm:text-6xl">{campus.name}</h2>
                  <p className="mt-7 flex max-w-2xl gap-3 text-base leading-8 text-muted"><MapPin size={19} className="mt-1 shrink-0 text-current" />{campus.address}</p>
                  <div className="mt-7 flex flex-wrap gap-4">{campus.phones.map((phone) => <a key={phone} href={telHref(phone)} className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-current"><Phone size={16} className="text-current" />{phone}</a>)}</div>
                  <div className="mt-8 flex flex-wrap gap-2"><a href={telHref(campus.phones[0])} className="button-ink"><Phone size={16} /> Call</a><a href={whatsappHref(campus.whatsapp, `Hello, I would like admission guidance for ${campus.name}.`)} target="_blank" rel="noreferrer" className="button-paper"><MessageCircle size={16} /> WhatsApp</a><a href={mapHref(campus.address)} target="_blank" rel="noreferrer" className="button-paper">Open Map <ArrowUpRight size={16} /></a><CampusPosterButton campusName={campus.name} poster={campus.poster} /></div>
                </MotionReveal>
              </div>
            </article>
          );
        })}
      </section>
      <section className="section-space bg-paper">
        <div className="container-wide">
          <SectionHeading number="04" eyebrow="Campus comparison" title="The essentials at a glance." description="All three locations connect families with the same academic focus and direct admissions support." />
          <div className="mt-10 overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left"><thead><tr className="border-y border-ink/15 text-xs font-bold uppercase text-muted"><th className="px-4 py-4">Campus</th><th className="px-4 py-4">Area</th><th className="px-4 py-4">Direct contact</th><th className="px-4 py-4">Environment</th><th className="px-4 py-4">Transport</th></tr></thead><tbody>{campuses.map((campus) => <tr key={campus.id} className="border-b border-cream-deep text-sm"><td className="px-4 py-5 font-bold text-ink">{campus.name}</td><td className="px-4 py-5 text-muted">{campus.id === "hill-park" ? "K.M.C.H.S / Hill Park" : "K.A.E.C.H.S"}</td><td className="px-4 py-5 text-muted">{campus.phones[0]}</td><td className="px-4 py-5"><span className="inline-flex items-center gap-2 text-muted"><ShieldCheck size={15} className="text-gold" />Secured study space</span></td><td className="px-4 py-5"><span className="inline-flex items-center gap-2 text-muted"><Bus size={15} className="text-gold" />Where available</span></td></tr>)}</tbody></table></div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
