import type { Metadata } from "next";
import Image from "next/image";
import { Award, BookOpenCheck, GraduationCap } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { faculty } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { initials } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "Faculty",
  "Meet the verified faculty at Sir Saqib Tuitions, including qualifications and years of teaching experience.",
  "/faculty",
);

export default function FacultyPage() {
  return (
    <>
      <PageHero title="Our faculty" path="/faculty" description="Verified qualifications and experience across Mathematics, Science, Commerce, Engineering and Computer Science." />
      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <SectionHeading eyebrow="Dedicated instructors" title="Credentials presented without stock portraits." description="Each profile below uses the verified faculty data supplied by the academy." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((member, index) => (
              <article key={member.name} className="group overflow-hidden rounded-md border border-navy-900/10 bg-white shadow-sm">
                <div className="flex items-center justify-between bg-navy-950 p-5 text-white">
                  <span className="flex h-14 w-14 items-center justify-center rounded-sm border border-gold-300/40 bg-navy-900 font-display text-xl font-bold text-gold-300">{initials(member.name)}</span>
                  <span className="font-display text-3xl font-bold text-gold-300">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase text-burgundy-700">{member.field}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-navy-950">{member.name}</h2>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-navy-600">{member.qualification}</p>
                  <div className="mt-5 flex items-center gap-2 border-t border-navy-900/10 pt-4 text-sm font-bold text-navy-900"><Award size={17} className="text-gold-700" />{member.experience} years experience</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="Faculty overview" title="The academy's published instructor roster." description="The original academy poster provides a visual reference for the complete roster shown above." />
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3 border-l-2 border-gold-500 bg-cream-50 p-4"><GraduationCap size={21} className="shrink-0 text-burgundy-700" /><p className="text-sm leading-6 text-navy-600"><strong className="text-navy-950">Qualified faculty</strong><br />Subject-focused academic support.</p></div>
              <div className="flex gap-3 border-l-2 border-gold-500 bg-cream-50 p-4"><BookOpenCheck size={21} className="shrink-0 text-burgundy-700" /><p className="text-sm leading-6 text-navy-600"><strong className="text-navy-950">Focused curriculum</strong><br />Teaching aligned with preparation.</p></div>
            </div>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-navy-900/10 bg-cream-100"><Image src="/assets/posters/faculty-instructors.webp" alt="Published poster listing the Sir Saqib Tuitions faculty" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-contain" /></div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
