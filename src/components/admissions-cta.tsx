import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/utils";

export function AdmissionsCta() {
  return (
    <section className="bg-navy-950 text-white">
      <div className="container-shell grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-16">
        <div>
          <p className="section-eyebrow text-gold-300">Admissions open</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">Choose the campus and program that fits your next academic step.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-cream-100/70 sm:text-base">Speak directly with admissions for fees, exact timings, documents and current seat availability.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <a href={telHref(site.admissionsPhone)} className="btn-gold"><Phone size={17} /> Call Admissions</a>
          <a href={whatsappHref(site.whatsapp, "Hello, I would like information about admissions at Sir Saqib Tuitions.")} target="_blank" rel="noreferrer" className="btn-light"><MessageCircle size={17} /> WhatsApp</a>
          <Link href="/campuses" className="btn-outline-light">Campuses <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
