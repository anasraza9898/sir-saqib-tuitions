import Link from "next/link";
import { ArrowLeft, BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-cream-50 py-16">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <div className="flex aspect-square max-w-sm items-center justify-center rounded-md bg-navy-950 text-gold-300 shadow-xl">
          <div className="text-center"><BookOpen size={54} className="mx-auto" /><p className="mt-5 font-display text-7xl font-bold">404</p></div>
        </div>
        <div>
          <p className="section-eyebrow">Page not found</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy-950 sm:text-5xl">This page is not on the timetable.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-navy-600">The address may have changed or the link may be incomplete. Return home or continue to the course overview.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/" className="btn-primary"><Home size={17} /> Home</Link><Link href="/courses" className="btn-secondary">Explore courses <ArrowLeft className="rotate-180" size={16} /></Link></div>
        </div>
      </div>
    </section>
  );
}
