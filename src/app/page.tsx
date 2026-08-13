import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { CampusCard } from "@/components/campus-card";
import { FaqList } from "@/components/faq-list";
import { FacultyRoster } from "@/components/faculty-roster";
import { HomeHero } from "@/components/home-hero";
import { MotionReveal, MotionSection, MotionStagger, MotionStaggerItem } from "@/components/motion-system";
import { PremiumVideo } from "@/components/premium-video";
import { SectionHeading } from "@/components/section-heading";
import { campuses, faqs, mediaItems, missionVision, site } from "@/data/site";
import { telHref } from "@/lib/utils";

const ProgramExplorer = dynamic(() => import("@/components/program-explorer").then((module) => module.ProgramExplorer));
const ResultsShowcase = dynamic(() => import("@/components/result-gallery").then((module) => module.ResultsShowcase));
const TimetableExplorer = dynamic(() => import("@/components/timetable-explorer").then((module) => module.TimetableExplorer));
const ContactForm = dynamic(() => import("@/components/contact-form").then((module) => module.ContactForm));

const benefits = [
  { title: "Qualified faculty", text: "Experienced instructors guide subject learning across the academy's offered streams." },
  { title: "Individual attention", text: "Students learn within a focused environment where progress and preparation stay visible.", featured: true },
  { title: "Assessment rhythm", text: "Monthly assessments, MTS, mid-terms and final-term examinations support consistent preparation." },
  { title: "Disciplined support", text: "Strict discipline, good study space and parent meetings create a clear academic structure." },
];

export default function HomePage() {
  const classroomMedia = mediaItems.find((item) => item.id === "classroom-learning");
  const boysCampusMedia = mediaItems.find((item) => item.id === "boys-campus");
  const testimonialsMedia = mediaItems.find((item) => item.id === "student-voices");
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  return (
    <>
      <HomeHero />

      <MotionSection className="border-b border-cream-deep bg-paper py-12">
        <div className="container-wide grid gap-4 lg:grid-cols-2">
          <MotionReveal className="border-l border-gold bg-cream px-5 py-6">
            <p className="eyebrow text-girls">Our Mission</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink">{missionVision.mission.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{missionVision.mission.body}</p>
            <Link href="/about/mission" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-girls">Read mission <ArrowRight size={15} /></Link>
          </MotionReveal>
          <MotionReveal delay={0.08} className="border-l border-gold bg-ink px-5 py-6 text-white">
            <p className="eyebrow text-gold-light">Our Vision</p>
            <h2 className="mt-4 font-display text-3xl leading-tight">{missionVision.vision.title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/64">{missionVision.vision.body}</p>
            <Link href="/about/vision" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold-light">Read vision <ArrowRight size={15} /></Link>
          </MotionReveal>
        </div>
      </MotionSection>

      <MotionSection className="section-space bg-paper">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading number="01" eyebrow="Why choose us" title="Serious study needs more than a timetable." description="It needs clear teaching, a visible assessment rhythm and an environment where students can stay focused." />
            <div className="mt-8 border-l border-gold pl-5"><p className="font-display text-2xl leading-snug text-ink">High-yield notes. Focused curriculum. Individual attention.</p></div>
          </div>
          <MotionStagger className="border-y border-cream-deep">
            {benefits.map((item, index) => (
              <MotionStaggerItem key={item.title} className={`grid gap-4 border-b border-cream-deep px-3 py-6 last:border-b-0 sm:grid-cols-[4rem_minmax(0,1fr)] sm:items-start sm:px-5 ${item.featured ? "bg-cream" : "bg-paper"}`}>
                <span className="font-display text-3xl text-gold">0{index + 1}</span>
                <div><div className="flex items-center gap-3"><h3 className="font-display text-2xl text-ink">{item.title}</h3>{item.featured ? <span className="rounded-full bg-girls px-2 py-1 text-[9px] font-bold uppercase text-white">Core focus</span> : null}</div><p className="mt-3 max-w-xl text-sm leading-7 text-muted">{item.text}</p></div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </div>
      </MotionSection>

      <section className="section-space border-y border-cream-deep bg-cream" id="programs">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
            <SectionHeading number="02" eyebrow="Academic pathways" title="Find the right stage, then the right stream." />
            <p className="body-lead max-w-2xl lg:justify-self-end">Move from foundation learning through Matric and Intermediate preparation, or explore formal education support for Huffaz.</p>
          </div>
          <div className="mt-10"><ProgramExplorer /></div>
          <div className="mt-7 text-right"><Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-girls">Explore every program <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      <section className="section-space bg-paper">
        <div className="container-wide">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><SectionHeading number="03" eyebrow="Our locations" title="Three locations, one focused standard." description="Choose the campus most convenient for the student, then connect directly through call, WhatsApp or map for admission guidance." /><Link href="/campuses" className="button-paper shrink-0">Compare campuses <ArrowRight size={16} /></Link></div>
          <MotionStagger className="mt-10 grid auto-rows-fr items-stretch gap-4 lg:grid-cols-3">{campuses.map((campus, index) => <MotionStaggerItem key={campus.id} className="h-full"><CampusCard campus={campus} index={`0${index + 1}`} /></MotionStaggerItem>)}</MotionStagger>
        </div>
      </section>

      <section className="section-space bg-cream">
        <div className="container-wide">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><SectionHeading number="04" eyebrow="Faculty" title="Leadership first. Subject expertise throughout." description="Meet the experienced educators guiding students across Mathematics, Science, Commerce and Computing with focused subject expertise and consistent academic support." /><Link href="/faculty" className="button-ink shrink-0">Complete faculty <ArrowRight size={16} /></Link></div>
          <div className="mt-10"><FacultyRoster compact /></div>
        </div>
      </section>

      <section className="section-space bg-paper">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><SectionHeading number="05" eyebrow="2026 latest results" title="Achievement, shown in the academy's own result posters." /><p className="body-lead max-w-2xl lg:justify-self-end">Switch between the latest 2026 results and previous 2025 academic highlights. Every year remains clearly labelled.</p></div>
          <div className="mt-10"><ResultsShowcase /></div>
          <div className="mt-7 text-right"><Link href="/results" className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-girls">Open the complete results page <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      <section className="section-space border-y border-cream-deep bg-cream">
        <div className="container-wide">
          <SectionHeading number="06" eyebrow="Timetable finder" title="Find your class timetable." description="Select a grade and programme to view the latest approved timetable poster." />
          <div className="mt-10"><TimetableExplorer compact /></div>
        </div>
      </section>

      <section className="section-space bg-paper">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <SectionHeading number="07" eyebrow="Learning environment" title="See the focus inside the classroom." description="Explore authentic classroom moments that reflect focused teaching, disciplined learning and an environment designed for student progress." />
            <ul className="mt-8 space-y-3">{["Focused classroom instruction", "Good study space", "Strict discipline", "Individual attention"].map((item) => <li key={item} className="flex items-center gap-3 text-sm font-bold text-text"><Check size={16} className="text-girls" />{item}</li>)}</ul>
            <Link href="/media" className="button-paper mt-7">Explore all media <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
            <MotionReveal><PremiumVideo id="home-classroom" src={classroomMedia?.src} poster={classroomMedia?.poster} title="Classroom teaching and student learning" duration={classroomMedia?.duration} label="Classroom Learning" className="aspect-[9/14]" /></MotionReveal>
            <MotionReveal delay={0.1}><PremiumVideo id="home-boys-campus" src={boysCampusMedia?.src} poster={boysCampusMedia?.poster} title="Boys Campus learning environment" duration={boysCampusMedia?.duration} label="Boys Campus" className="aspect-[9/14]" /></MotionReveal>
          </div>
        </div>
      </section>

      <section className="section-space bg-navy text-white">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <MotionReveal className="mx-auto w-full max-w-xl border border-white/12 bg-ink p-2"><PremiumVideo id="home-testimonial" src={testimonialsMedia?.src} poster={testimonialsMedia?.poster} title="Student testimonial recording" duration={testimonialsMedia?.duration} label="Student Voices" className="aspect-[9/14] max-h-[680px]" /></MotionReveal>
          <div>
            <SectionHeading number="08" eyebrow="Student voices" title="Hear the original experience, in the student's own words." description="Play the academy's real testimonial recording with sound." inverse />
            <div className="mt-8 grid gap-px bg-white/12 sm:grid-cols-2"><div className="bg-ink p-5"><p className="font-display text-3xl text-gold-light">24 years</p><p className="mt-2 text-xs font-bold uppercase text-white/50">Academic leadership</p></div><div className="bg-ink p-5"><p className="font-display text-3xl text-gold-light">3 campuses</p><p className="mt-2 text-xs font-bold uppercase text-white/50">Across Karachi</p></div></div>
          </div>
        </div>
      </section>

      <AdmissionsCta />

      <section className="section-space bg-cream">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div><SectionHeading number="09" eyebrow="Parents questions" title="Clear answers before you contact admissions." description="Start with the essentials, then speak directly with the campus for current guidance." /></div>
          <FaqList />
        </div>
      </section>

      <section className="section-space bg-paper" id="contact">
        <div className="container-wide">
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><SectionHeading number="10" eyebrow="Contact preview" title="Build your admissions message." /><div className="flex flex-wrap gap-4 text-sm text-muted lg:justify-end"><a href={telHref(site.admissionsPhone)} className="inline-flex items-center gap-2 font-bold text-ink"><Phone size={15} className="text-gold" />{site.admissionsPhone}</a><span className="inline-flex items-center gap-2"><MapPin size={15} className="text-gold" />Boys / Girls / Hill Park</span></div></div>
          <div id="enquiry" className="scroll-mt-28"><ContactForm /></div>
        </div>
      </section>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
    </>
  );
}
