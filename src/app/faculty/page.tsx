import type { Metadata } from "next";
import { Award, BookOpen, FlaskConical, Sigma } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { FacultyRoster } from "@/components/faculty-roster";
import { MotionReveal } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
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
      <PageHero title="Experienced educators. Focused academic guidance." path="/faculty" description="Our faculty brings together experienced educators across Science, Mathematics, Commerce and Computing, with a shared focus on clear instruction and consistent academic progress." tone="cream" index="04">
        <div className="border-l border-gold pl-5"><p className="font-display text-5xl text-ink">24</p><p className="mt-1 text-xs font-bold uppercase text-muted">Years of leadership</p></div>
      </PageHero>

      <section className="section-space bg-paper">
        <div className="container-wide">
          <SectionHeading eyebrow="Academic leadership" title="Experienced educators. Focused academic guidance." description="Our faculty brings together experienced educators across Science, Mathematics, Commerce and Computing, with a shared focus on clear instruction and consistent academic progress." />
          <div className="mt-14"><FacultyRoster /></div>
        </div>
      </section>

      <section className="border-y border-cream-deep bg-cream">
        <div className="container-wide grid lg:grid-cols-[0.72fr_1.28fr]">
          <MotionReveal className="border-b border-cream-deep py-14 lg:border-b-0 lg:border-r lg:py-20 lg:pr-12">
            <p className="eyebrow text-girls">Subject structure</p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-ink sm:text-5xl">The right academic lens for each pathway.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">Faculty specialisms support the academy&apos;s Mathematics, Science, Commerce, Engineering and computing pathways.</p>
          </MotionReveal>
          <div className="py-8 lg:py-14 lg:pl-12">
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

      <AdmissionsCta />
    </>
  );
}
