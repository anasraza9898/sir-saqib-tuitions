import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Phone } from "lucide-react";
import { AnimatedUnderline, CounterReveal, MagneticCTA, MediaReveal, MotionHeading, MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion-system";
import { PremiumVideo } from "@/components/premium-video";
import { site } from "@/data/site";
import { telHref } from "@/lib/utils";

export function HomeHero() {
  return (
    <section className="editorial-hero">
      <div className="container-wide relative grid min-h-[calc(100svh-112px)] items-center gap-12 py-14 lg:min-h-[calc(88svh-112px)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-12">
        <div className="relative z-10 max-w-3xl">
          <MotionReveal>
            <p className="eyebrow"><MapPin size={14} /> Admissions Open / Karachi</p>
          </MotionReveal>
          <MotionHeading
            className="mt-6 font-display text-5xl leading-[0.98] text-ink sm:text-6xl lg:text-7xl"
            lines={[<span key="welcome">Welcome to</span>, <span key="name"><span className="text-girls">Sir Saqib Tuitions</span></span>]}
          />
          <AnimatedUnderline className="mt-6 w-36" />
          <MotionReveal delay={0.12}>
            <p className="mt-6 font-display text-2xl leading-tight text-ink sm:text-3xl">Academic Support from Grades I-XII &amp; Huffaz</p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">From strong foundations in Grades I-VIII to focused Matric preparation for Grades IX-X and Intermediate preparation for Grades XI-XII, Sir Saqib Tuitions provides structured academic guidance across Science, General, Pre-Medical, Pre-Engineering and Commerce, alongside a dedicated formal education programme for Huffaz.</p>
            <p className="mt-5 text-sm font-bold text-girls">{site.tagline}</p>
          </MotionReveal>
          <MotionStagger className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MotionStaggerItem><MagneticCTA><Link href="/courses" className="button-ink">Explore Programmes <ArrowRight size={17} /></Link></MagneticCTA></MotionStaggerItem>
            <MotionStaggerItem><Link href="/timetables" className="button-paper"><Clock3 size={17} /> View Timetables</Link></MotionStaggerItem>
            <MotionStaggerItem><a href={telHref(site.admissionsPhone)} className="button-outline"><Phone size={17} /> Contact Admissions</a></MotionStaggerItem>
          </MotionStagger>
          <MotionStagger className="mt-9 grid grid-cols-2 border-y border-ink/12 sm:grid-cols-4">
            <MotionStaggerItem className="border-b border-r border-ink/10 px-3 py-4 sm:border-b-0 sm:first:pl-0"><p className="font-display text-2xl text-ink"><CounterReveal value={24} /></p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Years Experience</p></MotionStaggerItem>
            <MotionStaggerItem className="border-b border-ink/10 px-3 py-4 sm:border-b-0 sm:border-r"><p className="font-display text-2xl text-ink"><CounterReveal value={3} /></p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Campuses</p></MotionStaggerItem>
            <MotionStaggerItem className="border-r border-ink/10 px-3 py-4"><p className="font-display text-2xl text-ink">Qualified</p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Faculty</p></MotionStaggerItem>
            <MotionStaggerItem className="px-3 py-4"><p className="font-display text-2xl text-ink">I-XII</p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Grades</p></MotionStaggerItem>
          </MotionStagger>
        </div>

        <MediaReveal className="relative mx-auto w-full max-w-md lg:mr-0 lg:max-w-[390px]">
          <div className="border border-ink/12 bg-paper p-2 shadow-[0_24px_60px_rgba(8,17,38,0.16)]">
            <div className="flex items-center justify-between px-2 py-2"><div><p className="text-[10px] font-bold uppercase text-girls">Meet Sir Saqib</p><p className="mt-1 text-xs font-bold text-ink">Academy introduction</p></div><span className="text-[10px] font-bold text-muted">0:37</span></div>
            <PremiumVideo id="hero-sir-saqib" hero src="/assets/final/videos/academy-introduction.mp4" title="Sir Saqib academy introduction" duration="HD" label="Academy Introduction" className="aspect-[464/832]" />
            <div className="flex items-center justify-between border-t border-cream-deep px-2 py-3"><p className="text-xs font-bold text-ink">Sir Saqib Zaki</p><p className="text-[10px] text-muted">CAT, B.Com, MBA</p></div>
          </div>
        </MediaReveal>
      </div>
    </section>
  );
}
