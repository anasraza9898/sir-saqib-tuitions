import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
} from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { CampusCard } from "@/components/campus-card";
import { ContactForm } from "@/components/contact-form";
import { CourseGrid } from "@/components/course-grid";
import { FaqList } from "@/components/faq-list";
import { MediaPlayer } from "@/components/media-player";
import { ResultGallery } from "@/components/result-gallery";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TimetableExplorer } from "@/components/timetable-explorer";
import { campuses, faculty, faqs, results2026, site, strengths, trustItems } from "@/data/site";
import { initials, telHref } from "@/lib/utils";

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <section className="overflow-hidden border-b border-navy-900/10 bg-cream-50">
        <div className="container-shell grid min-h-[calc(100svh-108px)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-100 px-3 py-2 text-xs font-bold text-navy-900">
              <span className="h-2 w-2 rounded-full bg-burgundy-600" aria-hidden="true" /> Admissions Open
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-navy-950 sm:text-6xl lg:text-7xl">
              A Path to <span className="text-burgundy-700">Sound Success</span> in Education
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-navy-600 sm:text-lg">{site.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/courses" className="btn-primary">Explore Courses <ArrowRight size={17} /></Link>
              <Link href="/timetables" className="btn-secondary"><Clock3 size={17} /> View Timetables</Link>
            </div>
            <a href={telHref(site.admissionsPhone)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy-800 transition hover:text-burgundy-700"><Phone size={16} className="text-gold-700" /> Contact Admissions · {site.admissionsPhone}</a>

            <dl className="mt-9 grid grid-cols-2 border-y border-navy-900/10 sm:grid-cols-4">
              {trustItems.map((item) => (
                <div key={item.label} className="border-navy-900/10 px-3 py-4 first:pl-0 sm:border-r sm:last:border-r-0">
                  <dt className="text-[11px] font-bold uppercase text-navy-500">{item.label}</dt>
                  <dd className="mt-1 font-display text-xl font-bold text-navy-950">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mr-0">
            <div className="absolute -left-3 top-8 z-10 hidden rounded-sm border border-white/15 bg-navy-950 px-4 py-3 text-white shadow-xl sm:block">
              <p className="text-xs text-cream-100/65">Academic leadership</p>
              <p className="mt-1 font-display text-xl font-bold text-gold-300">24 years</p>
            </div>
            <div className="relative overflow-hidden rounded-md border-4 border-white bg-navy-950 p-2 shadow-[0_22px_60px_rgba(7,22,48,0.2)]">
              <div className="flex items-center justify-between px-2 pb-2 pt-1 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-gold-400" /> Inside the academy</div>
                <span className="text-[10px] uppercase text-cream-100/55">Real academy media</span>
              </div>
              <MediaPlayer
                hero
                muted
                src="/assets/videos/hero/intro-results-admissions.mp4"
                poster="/assets/posters/hero-video-poster.webp"
                title="Sir Saqib Tuitions introduction and admissions video"
                className="aspect-[4/5] rounded-sm sm:aspect-[5/4] lg:aspect-[4/5]"
              />
            </div>
            <div className="absolute -bottom-4 right-4 z-10 hidden items-center gap-3 rounded-sm border border-navy-900/10 bg-white px-4 py-3 shadow-xl sm:flex">
              <Building2 size={19} className="text-burgundy-700" />
              <div><p className="text-xs text-navy-500">Across Karachi</p><p className="font-bold text-navy-950">3 campuses</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-shell">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <SectionHeading eyebrow="Why choose us" title="The structure serious study needs." description="A focused academy environment built around teaching quality, progress checks and individual attention." />
              <p className="border-l-2 border-gold-500 pl-5 text-sm leading-7 text-navy-600">High-yield notes, a focused curriculum, compulsory-subject preparation and parent meetings keep academic work visible and accountable.</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="border-t-2 border-navy-950 bg-cream-50 p-5">
                  <div className="flex items-center justify-between"><Icon size={22} className="text-burgundy-700" /><span className="font-display text-sm font-bold text-gold-700">0{index + 1}</span></div>
                  <h3 className="mt-6 font-display text-xl font-bold text-navy-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-navy-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-navy-900/10 bg-cream-50" id="programs">
        <div className="container-shell">
          <Reveal><SectionHeading eyebrow="Programs" title="Clear academic pathways, focused preparation." description="Explore tuition options from foundation grades through Matric, Intermediate and the formal education programme for Huffaz." /></Reveal>
          <div className="mt-10"><CourseGrid compact /></div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Three campuses" title="A campus within reach in Karachi." description="Call, message or open the verified address in Google Maps search." />
            <Link href="/campuses" className="btn-secondary shrink-0">Explore campuses <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">{campuses.map((campus) => <CampusCard key={campus.id} campus={campus} />)}</div>
        </div>
      </section>

      <section className="section-pad bg-navy-950 text-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <SectionHeading eyebrow="Faculty" title="Experienced educators, visible credentials." description="Verified qualifications and experience across Mathematics, Science, Commerce and Computer Science." inverse />
            <div className="mt-8 rounded-sm border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3"><Award size={22} className="text-gold-300" /><p className="font-display text-xl font-bold">Led by Sir Saqib Zaki</p></div>
              <p className="mt-3 text-sm leading-6 text-cream-100/65">CAT, B.Com, MBA with 24 years of experience.</p>
            </div>
            <Link href="/faculty" className="btn-gold mt-6">Meet the complete faculty <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-px overflow-hidden rounded-md bg-white/10 sm:grid-cols-2">
            {faculty.slice(0, 6).map((member) => (
              <article key={member.name} className="flex min-h-36 gap-4 bg-navy-900 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-gold-300/35 bg-navy-950 font-display font-bold text-gold-300">{initials(member.name)}</span>
                <div><h3 className="font-display text-lg font-bold">{member.name}</h3><p className="mt-1 text-xs leading-5 text-cream-100/60">{member.qualification}</p><p className="mt-3 text-xs font-bold text-gold-300">{member.experience} years experience</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Latest results" title="2026 academic results." description="View the latest published Matric result highlights from the real academy result assets." />
            <Link href="/results" className="btn-secondary shrink-0">All results <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-10"><ResultGallery items={results2026} /></div>
        </div>
      </section>

      <section className="section-pad border-y border-navy-900/10 bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow="Timetable preview" title="Find the right published timetable." description="Filter the real timetable posters by campus, class, stream and batch. Poster details are shown exactly as supplied." />
          <div className="mt-10"><TimetableExplorer compact /></div>
        </div>
      </section>

      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <SectionHeading eyebrow="Learning environment" title="See real teaching, not stock imagery." description="A direct view of the academy's classroom and campus learning environment." />
              <div className="mt-7 space-y-3">
                {["Focused classroom instruction", "Good study space", "Strict discipline", "Individual attention"].map((item) => <p key={item} className="flex items-center gap-2 text-sm font-semibold text-navy-800"><CheckCircle2 size={16} className="text-burgundy-700" />{item}</p>)}
              </div>
              <Link href="/media" className="btn-secondary mt-7">Explore academy media <ArrowRight size={16} /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <MediaPlayer src="/assets/videos/classroom/classroom-teaching-student-learning.mp4" poster="/assets/posters/current-facebook-poster.webp" title="Classroom teaching and student learning" className="aspect-[4/5] rounded-md" />
              <MediaPlayer src="/assets/videos/campus/boys-classroom.mp4" poster="/assets/posters/admission-boys-campus.webp" title="Boys campus classroom learning" className="aspect-[4/5] rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="overflow-hidden rounded-md border border-navy-900/10 bg-navy-950 p-2 shadow-lg">
            <MediaPlayer src="/assets/videos/testimonials/student-testimonials.mp4" poster="/assets/posters/faculty-instructors.webp" title="Student testimonial video" className="aspect-video rounded-sm" />
          </div>
          <div>
            <p className="section-eyebrow">Student testimonials</p>
            <h2 className="section-title">Hear the original student recording.</h2>
            <p className="mt-4 text-base leading-7 text-navy-600">This is the academy&apos;s real testimonial video. No quotation has been added because a verified transcript is not available.</p>
            <div className="mt-6 border-l-2 border-gold-500 bg-cream-50 p-4 text-sm leading-6 text-navy-600">
              <strong className="text-navy-950">Transcript status:</strong> Not currently available. Play the recording to hear the student&apos;s own words.
            </div>
          </div>
        </div>
      </section>

      <AdmissionsCta />

      <section className="section-pad bg-cream-50">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div><SectionHeading eyebrow="Questions" title="Verified answers for parents." description="For information that changes, admissions will confirm the current details directly." /></div>
          <FaqList />
        </div>
      </section>

      <section className="section-pad border-t border-navy-900/10 bg-white" id="contact">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="section-eyebrow">Contact</p>
            <h2 className="section-title">Talk to the right campus.</h2>
            <p className="mt-4 text-base leading-7 text-navy-600">Use the enquiry form or contact a campus directly. Van service is available where offered; confirm availability with admissions.</p>
            <div className="mt-7 divide-y divide-navy-900/10 border-y border-navy-900/10">
              {campuses.map((campus) => (
                <div key={campus.id} className="py-4">
                  <p className="flex items-center gap-2 font-bold text-navy-950"><MapPin size={16} className="text-gold-700" />{campus.name}</p>
                  <a href={telHref(campus.phones[0])} className="mt-2 inline-flex items-center gap-2 text-sm text-navy-600 hover:text-burgundy-700"><Phone size={14} />{campus.phones.join(" · ")}</a>
                </div>
              ))}
            </div>
          </div>
          <div id="enquiry" className="scroll-mt-28"><ContactForm /></div>
        </div>
      </section>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
    </>
  );
}
