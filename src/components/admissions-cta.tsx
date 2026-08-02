import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { MotionReveal } from "@/components/motion-system";
import { site } from "@/data/site";
import { whatsappHref } from "@/lib/utils";

export function AdmissionsCta() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <span className="absolute left-[12%] top-0 h-full w-px bg-gold/22" aria-hidden="true" />
      <span className="absolute right-[18%] top-0 h-full w-px bg-gold/14" aria-hidden="true" />
      <span className="absolute right-0 top-1/2 h-px w-1/3 bg-gold/22" aria-hidden="true" />
      <div className="container-wide relative grid gap-9 py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-20">
        <MotionReveal>
          <p className="eyebrow text-gold-light">Admission guidance</p>
          <h2 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] sm:text-5xl">Ready to choose the right class and campus?</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">Speak with admissions about current programs, timings and the campus that fits your family.</p>
        </MotionReveal>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Link href="/contact#enquiry" className="button-gold">Contact Admissions <ArrowRight size={17} /></Link>
          <a href={whatsappHref(site.whatsapp, "Hello, I would like admission guidance from Sir Saqib Tuitions.")} target="_blank" rel="noreferrer" className="button-light"><MessageCircle size={17} /> WhatsApp</a>
          <Link href="/campuses" className="button-light">Compare Campuses <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
