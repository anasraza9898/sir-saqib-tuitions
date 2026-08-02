import type { Metadata } from "next";
import { Award, BookOpen, FlaskConical, Sigma } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { FacultyRoster } from "@/components/faculty-roster";
import { MotionReveal } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { faculty } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Faculty",
  "Meet the qualified Sir Saqib Tuitions faculty across Mathematics, Science, Commerce, Engineering and Computer Science in Karachi.",
  "/faculty",
);

const subjectGroups = [
  { title: "Mathematics", names: "Sir Muhammad Armash / Sir Shahid Punal", icon: Sigma },
  { title: "Science & Health", names: "Sir Hanzala Nauman / Miss Javeria / Sir Hassan Haroon", icon: FlaskConical },
  { title: "Commerce & Leadership", names: "Sir Saqib Zaki / Sir Ashhad Sohail", icon: Award },
  { title: "Engineering & Computing", names: "Eng. Babar Ashraf / Sir Hasan", icon: BookOpen },
] as const;

export default function FacultyPage() {
  return (
    <>
      <PageHero title="Teaching depth, clearly presented" path="/faculty" description="A qualified faculty roster spanning Mathematics, Science, Commerce, Engineering and Computer Science." tone="cream" index="04">
        <div className="border-l border-gold pl-5"><p className="font-display text-5xl text-ink">24</p><p className="mt-1 text-xs font-bold uppercase text-muted">Years of leadership</p></div>
      </PageHero>

      <section className="section-pad bg-paper">
        <div className="container-wide">
          <SectionHeading eyebrow="Academic leadership" title="Experience at the front. Subject depth throughout." description="Sir Saqib Zaki leads a structured faculty roster with qualifications and experience shown directly." />
          <div className="mt-10"><FacultyRoster /></div>
        </div>
      </section>

      <section className="border-y border-cream-deep bg-cream">
        <div className="container-wide grid lg:grid-cols-[0.72fr_1.28fr]">
          <MotionReveal className="border-b border-cream-deep py-12 lg:border-b-0 lg:border-r lg:py-16 lg:pr-12">
            <p className="eyebrow text-girls">Subject structure</p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-ink sm:text-5xl">The right academic lens for each pathway.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">Faculty specialisms support the academy&apos;s Mathematics, Science, Commerce, Engineering and computing pathways.</p>
          </MotionReveal>
          <div className="py-6 lg:py-10 lg:pl-12">
            {subjectGroups.map(({ title, names, icon: Icon }, index) => (
              <article key={title} className="grid gap-4 border-b border-ink/10 py-6 last:border-0 sm:grid-cols-[3rem_0.7fr_1.3fr] sm:items-center">
                <span className="font-display text-xl text-gold">0{index + 1}</span>
                <div className="flex items-center gap-3"><Icon size={18} className="text-girls" /><h3 className="font-display text-xl text-ink">{title}</h3></div>
                <p className="text-sm leading-6 text-muted">{names}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-paper">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.58fr_1.42fr] lg:items-start">
          <SectionHeading eyebrow="Experience" title="A roster with range." description="Experience markers are based on the faculty information provided by the academy." />
          <div className="space-y-5">
            {faculty.map((member) => (
              <div key={member.name} className="grid gap-2 sm:grid-cols-[13rem_1fr_4rem] sm:items-center">
                <p className="text-sm font-bold text-ink">{member.name}</p>
                <div className="h-1.5 overflow-hidden bg-cream-deep" aria-hidden="true"><span className="block h-full bg-gold" style={{ width: `${Math.max(12, (member.experience / 24) * 100)}%` }} /></div>
                <p className="text-xs font-bold text-muted sm:text-right">{member.experience} yrs</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
