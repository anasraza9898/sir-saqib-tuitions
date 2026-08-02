import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, ClipboardCheck, GraduationCap, Handshake, ShieldCheck, UsersRound } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { strengths } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "About",
  "Learn about the academic approach, teaching structure and verified strengths of Sir Saqib Tuitions in Karachi.",
  "/about",
);

const approach = [
  { title: "Teach with focus", text: "Qualified faculty and high-yield notes keep learning connected to the curriculum.", icon: BookOpenCheck },
  { title: "Assess regularly", text: "Monthly assessments, MTS, mid-terms and final-term examinations make progress visible.", icon: ClipboardCheck },
  { title: "Support individually", text: "Individual attention and good study space help students work with consistency.", icon: UsersRound },
  { title: "Partner with parents", text: "Parent meetings connect academic progress with the support students receive at home.", icon: Handshake },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="About the academy" path="/about" description="A disciplined, focused learning environment for students from Grades IV-XII across three Karachi campuses." />
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="Sir Saqib Tuitions" title="Academic structure built around sound preparation." />
            <p className="mt-6 text-base leading-8 text-navy-600">Sir Saqib Tuitions supports foundation, Matric and Intermediate students through focused curriculum coverage, regular assessments and individual attention. Sir Saqib Zaki brings 24 years of experience to an academy supported by qualified faculty.</p>
            <p className="mt-4 text-base leading-8 text-navy-600">The learning model combines strict discipline, high-yield notes, MTS, examinations and parent meetings. Students can study across dedicated Boys, Girls and Hill Park campuses in Karachi.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/faculty" className="btn-primary">Meet the faculty <ArrowRight size={16} /></Link><Link href="/campuses" className="btn-secondary">Explore campuses</Link></div>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-navy-900/10 bg-cream-100 shadow-lg sm:aspect-[4/3] lg:aspect-[3/4]">
            <Image src="/assets/posters/faculty-instructors.webp" alt="Published Sir Saqib Tuitions faculty and campus information poster" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-contain" priority />
          </div>
        </div>
      </section>
      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <SectionHeading eyebrow="Our approach" title="A visible cycle of teaching and progress." description="Each part of the academic process reinforces consistent preparation." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {approach.map((item, index) => { const Icon = item.icon; return <article key={item.title} className="border-t-2 border-gold-500 bg-white p-5"><span className="flex h-10 w-10 items-center justify-center rounded-sm bg-navy-950 text-gold-300"><Icon size={19} /></span><p className="mt-6 text-xs font-bold text-burgundy-700">Step {index + 1}</p><h2 className="mt-2 font-display text-xl font-bold text-navy-950">{item.title}</h2><p className="mt-3 text-sm leading-6 text-navy-600">{item.text}</p></article>; })}
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow="Verified strengths" title="What families can expect." />
          <div className="mt-10 grid gap-px overflow-hidden rounded-md bg-navy-900/10 sm:grid-cols-2">
            {strengths.map((item) => { const Icon = item.icon; return <article key={item.title} className="flex gap-4 bg-white p-6"><Icon size={22} className="mt-1 shrink-0 text-burgundy-700" /><div><h2 className="font-display text-xl font-bold text-navy-950">{item.title}</h2><p className="mt-2 text-sm leading-6 text-navy-600">{item.description}</p></div></article>; })}
            <article className="flex gap-4 bg-white p-6"><ShieldCheck size={22} className="mt-1 shrink-0 text-burgundy-700" /><div><h2 className="font-display text-xl font-bold text-navy-950">Focused environment</h2><p className="mt-2 text-sm leading-6 text-navy-600">Secured learning spaces, discipline and good study space support daily academic work.</p></div></article>
            <article className="flex gap-4 bg-white p-6"><GraduationCap size={22} className="mt-1 shrink-0 text-burgundy-700" /><div><h2 className="font-display text-xl font-bold text-navy-950">Broad academic range</h2><p className="mt-2 text-sm leading-6 text-navy-600">Programs cover Grades IV-XII, multiple streams and formal education support for Huffaz.</p></div></article>
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
