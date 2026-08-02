import type { Metadata } from "next";
import { MessageSquareText, Video } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MediaPlayer } from "@/components/media-player";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { VideoShowcase } from "@/components/video-showcase";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Media",
  "Watch real Sir Saqib Tuitions academy, campus, classroom, results and testimonial videos on demand.",
  "/media",
);

export default function MediaPage() {
  return (
    <>
      <PageHero title="Academy media" path="/media" description="Real academy, classroom, campus and results media. Videos load on demand to protect mobile performance." />
      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <div className="flex items-start gap-4 border-l-2 border-gold-500 bg-white p-5"><Video size={22} className="shrink-0 text-burgundy-700" /><p className="text-sm leading-6 text-navy-600">Every item on this page comes from the supplied optimized academy media. No stock campus, teacher or student imagery has been introduced.</p></div>
          <div className="mt-12"><SectionHeading eyebrow="Real environment" title="Inside Sir Saqib Tuitions." description="Select a video to play it. Other videos remain idle and use lightweight poster fallbacks." /></div>
          <div className="mt-10"><VideoShowcase /></div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="overflow-hidden rounded-md border border-navy-900/10 bg-navy-950 p-2"><MediaPlayer src="/assets/videos/testimonials/student-testimonials.mp4" poster="/assets/posters/faculty-instructors.webp" title="Student testimonial recording" className="aspect-video rounded-sm" /></div>
          <div>
            <MessageSquareText size={27} className="text-gold-700" />
            <SectionHeading eyebrow="Testimonial recording" title="The student's own voice." description="No written quote is shown because a verified transcript was not supplied." />
            <p className="mt-5 border-l-2 border-gold-500 bg-cream-50 p-4 text-sm leading-6 text-navy-600"><strong className="text-navy-950">Transcript placeholder:</strong> A verified transcript is not currently available. Play the original recording for the student&apos;s words.</p>
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
