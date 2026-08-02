import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[74svh] items-center overflow-hidden bg-cream py-16">
      <span className="absolute left-[12%] top-0 h-full w-px bg-gold/25" aria-hidden="true" />
      <span className="absolute right-0 top-1/3 h-px w-1/3 bg-gold/30" aria-hidden="true" />
      <div className="container-wide relative grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden border border-cream-deep bg-ink p-8 text-white">
          <Image src="/assets/logo/sir-saqib-tuitions-logo.webp" alt="" width={72} height={72} className="h-16 w-16 object-contain" />
          <p className="mt-14 font-display text-8xl text-gold-light">404</p>
          <p className="absolute bottom-8 left-8 right-8 border-t border-white/15 pt-5 text-xs font-bold uppercase text-white/58">Sir Saqib Tuitions / Karachi</p>
        </div>
        <div>
          <p className="eyebrow text-girls">Page not found</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.03] text-ink sm:text-6xl">This page is not on the timetable.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted">The address may have changed or the link may be incomplete. Continue with courses, admissions guidance, or return home.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="button-ink"><Home size={17} /> Home</Link>
            <Link href="/courses" className="button-outline">Explore courses <ArrowRight size={16} /></Link>
            <Link href="/contact" className="button-outline"><MessageCircle size={16} /> Contact</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
