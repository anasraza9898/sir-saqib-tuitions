import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { campuses, programs, site } from "@/data/site";
import { telHref } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="bg-ink pb-20 text-white md:pb-0">
      <div className="container-wide border-b border-white/10 py-14 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.7fr_0.9fr_1.35fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/assets/logo/SST_Logo_T.b.png" alt="Sir Saqib Tuitions official logo" width={58} height={58} className="h-14 w-14 object-contain" />
              <span><span className="block font-display text-2xl">{site.name}</span><span className="mt-1 block text-[10px] font-bold uppercase text-gold-light">{site.tagline}</span></span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/62">Focused tuition for Grades I-VIII, Matric and Intermediate, with formal education support for Huffaz.</p>
            <Link href="/contact#enquiry" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold-light hover:text-white">Get admission guidance <ArrowUpRight size={15} /></Link>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase text-gold-light">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/68">
              {[{label:"About",href:"/about"},{label:"Campuses",href:"/campuses"},{label:"Faculty",href:"/faculty"},{label:"Results",href:"/results"},{label:"Media",href:"/media"}].map((item) => <li key={item.href}><Link href={item.href} className="transition hover:text-white">{item.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase text-gold-light">Programs</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/68">
              {programs.slice(0, 6).map((program) => <li key={program.id}><Link href={`/courses#${program.id}`} className="transition hover:text-white">{program.title}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase text-gold-light">Karachi campuses</h2>
            <div className="mt-5 space-y-5">
              {campuses.map((campus) => (
                <div key={campus.id} className="border-l border-gold/45 pl-3">
                  <p className="text-sm font-bold">{campus.name}</p>
                  <p className="mt-1 flex gap-2 text-xs leading-5 text-white/55"><MapPin size={13} className="mt-0.5 shrink-0 text-gold-light" />{campus.address}</p>
                  <a href={telHref(campus.phones[0])} className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-gold-light hover:text-white"><Phone size={13} />{campus.phones.join(" / ")}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container-wide flex flex-col gap-3 py-5 text-xs text-white/48 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Sir Saqib Tuitions. All rights reserved.</p>
        <div className="flex gap-5"><Link href="/privacy" className="hover:text-white">Privacy notice</Link><Link href="/contact" className="hover:text-white">Contact admissions</Link></div>
      </div>
    </footer>
  );
}
