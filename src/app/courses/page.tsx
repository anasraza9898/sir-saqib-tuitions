import type { Metadata } from "next";
import Image from "next/image";
import { BookOpenCheck, CheckCircle2, ClipboardCheck, FileText, UsersRound } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { CourseGrid } from "@/components/course-grid";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Courses",
  "Explore Grades IV-XII, Science, General, Commerce, Computer Science, Pre-Engineering and Huffaz programmes at Sir Saqib Tuitions Karachi.",
  "/courses",
);

const studySupport = [
  { title: "Focused curriculum", icon: BookOpenCheck },
  { title: "High-yield notes", icon: FileText },
  { title: "Monthly assessments", icon: ClipboardCheck },
  { title: "Individual attention", icon: UsersRound },
];

export default function CoursesPage() {
  return (
    <>
      <PageHero title="Courses & programs" path="/courses" description="Academic pathways for foundation, Matric and Intermediate students, plus formal education support for Huffaz." />
      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <SectionHeading eyebrow="Program finder" title="Choose a level and stream." description="Use the filters to review each verified program, then contact admissions for current fees and exact class timings." />
          <div className="mt-10"><CourseGrid /></div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-navy-900/10 bg-cream-100 sm:aspect-[4/3] lg:aspect-[4/5]">
            <Image src="/assets/posters/admission-hafiz-program.webp" alt="Sir Saqib Tuitions Hafiz to Formal Education Programme admissions poster" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-contain" />
          </div>
          <div>
            <SectionHeading eyebrow="Huffaz programme" title="A structured path into formal education." description="The Hafiz to Formal Education Programme and Crash Course for Huffaz support the transition into focused academic study." />
            <ul className="mt-7 space-y-3">
              {["Preparation of compulsory subjects", "Focused curriculum", "Qualified faculty", "Regular assessments"].map((item) => <li key={item} className="flex items-center gap-3 text-sm font-semibold text-navy-800"><CheckCircle2 size={17} className="text-burgundy-700" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="border-y border-navy-900/10 bg-cream-50 py-10">
        <div className="container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studySupport.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 bg-white p-4"><Icon size={20} className="text-gold-700" /><p className="text-sm font-bold text-navy-950">{item.title}</p></div>; })}
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
