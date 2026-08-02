import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { campuses, navigation, programs, site } from "@/data/site";
import { telHref } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 pb-20 text-cream-100 md:pb-0">
      <div className="container-shell grid gap-10 border-b border-white/10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.9fr_1.4fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/assets/logo/sir-saqib-tuitions-logo.webp" alt="" width={56} height={56} className="h-14 w-14 rounded-sm object-cover" />
            <span className="font-display text-xl font-bold text-white">{site.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-cream-100/70">{site.tagline}. Focused learning for Grades IV-XII across three Karachi campuses.</p>
        </div>
        <div>
          <h2 className="footer-title">Navigate</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navigation.slice(1, 7).map((item) => <li key={item.href}><Link href={item.href} className="footer-link">{item.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Programs</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {programs.slice(0, 5).map((program) => <li key={program.id}><Link href={`/courses#${program.id}`} className="footer-link">{program.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Karachi Campuses</h2>
          <div className="mt-4 space-y-4">
            {campuses.map((campus) => (
              <div key={campus.id} className="border-l border-gold-400/40 pl-3">
                <p className="text-sm font-semibold text-white">{campus.name}</p>
                <p className="mt-1 flex gap-2 text-xs leading-5 text-cream-100/65"><MapPin size={14} className="mt-0.5 shrink-0 text-gold-300" />{campus.address}</p>
                <a href={telHref(campus.phones[0])} className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-200 hover:text-white"><Phone size={13} />{campus.phones.join(" · ")}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container-shell flex flex-col gap-3 py-5 text-xs text-cream-100/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Sir Saqib Tuitions. All rights reserved.</p>
        <Link href="/privacy" className="inline-flex items-center gap-1 transition hover:text-white">Privacy notice <ArrowUpRight size={13} /></Link>
      </div>
    </footer>
  );
}
