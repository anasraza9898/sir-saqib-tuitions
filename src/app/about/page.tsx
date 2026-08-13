import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, ClipboardCheck, Handshake, ShieldCheck, Target, Telescope, UsersRound } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { PremiumVideo } from "@/components/premium-video";
import { SectionHeading } from "@/components/section-heading";
import { missionVision } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("About", "Discover the teaching philosophy, assessment structure and 24-year academic leadership behind Sir Saqib Tuitions in Karachi.", "/about");

const timeline = [
  { title: "Focused teaching", text: "Qualified faculty and high-yield notes keep lessons connected to the curriculum.", icon: BookOpenCheck },
  { title: "Regular assessment", text: "Monthly assessments, MTS, mid-terms and final-term examinations make progress visible.", icon: ClipboardCheck },
  { title: "Individual support", text: "Attention, discipline and good study space help students work consistently.", icon: UsersRound },
  { title: "Parent partnership", text: "Parent meetings connect classroom progress with support at home.", icon: Handshake },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="An academy built around focused progress" path="/about" description="For Grades I-VIII, Matric, Intermediate and Huffaz, serious preparation means clear teaching, regular assessment and an environment designed for attention." tone="ink" index="01">
        <div className="border-l border-gold/50 pl-5 text-white"><p className="font-display text-5xl text-gold-light">24</p><p className="mt-1 text-xs font-bold uppercase text-white/50">Years of leadership</p></div>
      </PageHero>

      <section className="section-space bg-paper">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <MotionReveal className="order-2 lg:order-1"><PremiumVideo id="about-sir-saqib" src="/assets/final/videos/academy-introduction.mp4" title="Sir Saqib academy introduction" duration="HD" label="Academy Philosophy" className="mx-auto aspect-[464/832] max-w-md" /></MotionReveal>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="Academy philosophy" title="Structure gives effort somewhere to go." description="Sir Saqib Tuitions brings curriculum, assessment and individual support into one clear learning rhythm." />
            <p className="mt-7 text-base leading-8 text-muted">Sir Saqib Zaki brings 24 years of experience to an academy supported by qualified faculty. Students study across dedicated Boys, Girls and Hill Park campuses in Karachi.</p>
            <blockquote className="mt-8 border-l-2 border-gold bg-cream p-5 font-display text-2xl leading-snug text-ink">&ldquo;A Path to Sound Success in Education&rdquo;</blockquote>
            <Link href="/faculty" className="button-ink mt-7">Meet the faculty <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-cream-deep bg-cream">
        <div className="container-wide grid gap-px bg-cream-deep sm:grid-cols-2">
          <Link href="/about/mission" className="group bg-paper p-6 transition-colors hover:bg-cream sm:p-7">
            <Target size={21} className="text-girls" />
            <h2 className="mt-5 font-display text-3xl leading-tight text-ink">Our Mission</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{missionVision.mission.title}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ink group-hover:text-girls">Read mission <ArrowRight size={15} /></span>
          </Link>
          <Link href="/about/vision" className="group bg-ink p-6 text-white transition-colors hover:bg-navy sm:p-7">
            <Telescope size={21} className="text-gold-light" />
            <h2 className="mt-5 font-display text-3xl leading-tight">Our Vision</h2>
            <p className="mt-3 text-sm leading-7 text-white/64">{missionVision.vision.title}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-light">Read vision <ArrowRight size={15} /></span>
          </Link>
        </div>
      </section>

      <section className="section-space border-y border-cream-deep bg-cream">
        <div className="container-wide">
          <SectionHeading number="02" eyebrow="Teaching to progress" title="A learning cycle families can follow." description="Each stage supports the next, from the first lesson to the conversation with parents." />
          <MotionStagger className="relative mt-12 grid gap-0 border-y border-ink/12 lg:grid-cols-4">
            {timeline.map((item, index) => { const Icon = item.icon; return <MotionStaggerItem key={item.title} className="relative border-b border-ink/12 px-5 py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"><span className="absolute right-4 top-4 font-display text-4xl text-gold/35">0{index + 1}</span><Icon size={22} className="text-girls" /><h2 className="mt-10 font-display text-2xl text-ink">{item.title}</h2><p className="mt-3 text-sm leading-7 text-muted">{item.text}</p></MotionStaggerItem>; })}
          </MotionStagger>
        </div>
      </section>

      <section className="section-space bg-paper">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div><SectionHeading number="03" eyebrow="The environment" title="Attention, discipline and room to study." /><div className="mt-8 flex items-center gap-4 border-y border-cream-deep py-5"><ShieldCheck size={24} className="text-gold" /><p className="text-sm leading-7 text-muted">A secured environment, strict discipline and good study space support consistent academic work.</p></div></div>
          <div className="grid gap-px bg-cream-deep sm:grid-cols-2"><div className="bg-cream p-7"><p className="font-display text-4xl text-ink">3 campuses</p><p className="mt-3 text-sm text-muted">Boys, Girls and Hill Park locations in Karachi.</p></div><div className="bg-ink p-7 text-white"><p className="font-display text-4xl text-gold-light">Grades I-VIII</p><p className="mt-3 text-sm text-white/58">Foundation tuition alongside Matric and Intermediate pathways.</p></div></div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
