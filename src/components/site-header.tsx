"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Modal } from "@/components/modal";
import { WhatsAppChooserButton } from "@/components/whatsapp-campus-chooser";
import { site } from "@/data/site";
import { cn, telHref } from "@/lib/utils";

const about = [
  { label: "About", href: "/about", note: "Academy information" },
  { label: "Our Mission", href: "/about/mission", note: "Purpose and academic support" },
  { label: "Our Vision", href: "/about/vision", note: "Long-term student progress" },
];

const academics = [
  { label: "Courses", href: "/courses", note: "Programs and pathways" },
  { label: "Faculty", href: "/faculty", note: "Qualifications and experience" },
  { label: "Timetables", href: "/timetables", note: "Find your class schedule" },
];

const explore = [
  { label: "Campuses", href: "/campuses", note: "Three Karachi locations" },
  { label: "Results", href: "/results", note: "2026 and previous highlights" },
  { label: "Media", href: "/media", note: "Real academy recordings" },
];

const mobileItems = [
  { label: "Home", href: "/" },
  ...about.map(({ label, href }) => ({ label, href })),
  ...academics.map(({ label, href }) => ({ label, href })),
  ...explore.map(({ label, href }) => ({ label, href })),
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<"about" | "academics" | "explore" | null>(null);
  const closeMobile = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 48));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); };
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpenGroup(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenGroup(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, []);

  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const lightText = scrolled;

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-white/10 bg-ink/95 text-white shadow-[0_8px_24px_rgba(8,17,38,0.12)] supports-[backdrop-filter]:backdrop-blur-sm"
          : "border-cream-deep bg-paper/95 text-ink",
      )}
    >
      <div className={cn("container-wide flex items-center justify-between gap-6 transition-[height] duration-300", scrolled ? "h-16" : "h-[76px]")}>
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label={`${site.name} home`}>
          <Image src="/assets/logo/SST_Logo_T.b.png" alt="Sir Saqib Tuitions official logo" width={52} height={52} priority className={cn("object-contain transition-[width,height] duration-300", scrolled ? "h-10 w-10" : "h-12 w-12")} />
          <span className="min-w-0">
            <span className="block truncate font-display text-xl text-current sm:text-2xl">{site.name}</span>
            <span className={cn("hidden text-[10px] font-bold uppercase transition-colors sm:block", lightText ? "text-gold-light" : "text-girls")}>Sound success in education</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          <DirectLink href="/" label="Home" isActive={active("/")} light={lightText} />
          <NavGroup label="About" items={about} open={openGroup === "about"} active={about.some((item) => active(item.href))} light={lightText} onToggle={() => setOpenGroup((current) => current === "about" ? null : "about")} onClose={() => setOpenGroup(null)} />
          <NavGroup label="Academics" items={academics} open={openGroup === "academics"} active={academics.some((item) => active(item.href))} light={lightText} onToggle={() => setOpenGroup((current) => current === "academics" ? null : "academics")} onClose={() => setOpenGroup(null)} />
          <NavGroup label="Explore" items={explore} open={openGroup === "explore"} active={explore.some((item) => active(item.href))} light={lightText} onToggle={() => setOpenGroup((current) => current === "explore" ? null : "explore")} onClose={() => setOpenGroup(null)} />
          <DirectLink href="/contact" label="Contact" isActive={active("/contact")} light={lightText} />
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact#enquiry" className={cn("hidden xl:inline-flex", scrolled ? "button-gold" : "button-ink")}>
            Get Admission Guidance <ArrowRight size={16} />
          </Link>
          <button type="button" className={cn("icon-control lg:hidden", scrolled && "border-white/20 bg-white/5 text-white")} onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Open navigation menu">
            <Menu size={21} />
          </button>
        </div>
      </div>

      <Modal open={menuOpen} onClose={closeMobile} labelledBy="mobile-menu-title" className="ml-auto h-dvh max-h-dvh max-w-md rounded-none sm:rounded-none">
        <div id="mobile-navigation" className="flex min-h-full flex-col bg-cream">
          <div className="flex items-center justify-between border-b border-cream-deep px-5 py-4">
            <div className="flex items-center gap-3">
              <Image src="/assets/logo/SST_Logo_T.b.png" alt="Sir Saqib Tuitions official logo" width={44} height={44} className="h-11 w-11 object-contain" />
              <div><p id="mobile-menu-title" className="font-display text-2xl text-ink">Explore</p><p className="text-xs text-muted">Sir Saqib Tuitions</p></div>
            </div>
            <button type="button" className="icon-control" onClick={closeMobile} aria-label="Close navigation menu"><X size={20} /></button>
          </div>
          <motion.nav className="flex-1 px-5 py-4" aria-label="Mobile navigation" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.045 } } }}>
            {mobileItems.map((item, index) => (
              <motion.div key={item.href} variants={{ hidden: { opacity: 0, x: 12 }, visible: { opacity: 1, x: 0 } }}>
                <Link href={item.href} onClick={closeMobile} aria-current={active(item.href) ? "page" : undefined} className={cn("flex items-center justify-between border-b border-ink/10 px-1 py-3.5 text-base font-bold text-ink", active(item.href) && "text-girls")}>
                  <span><span className="mr-3 font-display text-sm text-gold">{String(index + 1).padStart(2, "0")}</span>{item.label}</span><ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </motion.nav>
          <div className="border-t border-cream-deep bg-paper p-4">
            <p className="mb-3 text-xs font-bold uppercase text-muted">Admissions</p>
            <div className="grid grid-cols-2 gap-2">
              <a href={telHref(site.admissionsPhone)} className="button-outline"><Phone size={16} /> Call</a>
              <WhatsAppChooserButton className="button-ink"><MessageCircle size={16} /> WhatsApp</WhatsAppChooserButton>
            </div>
          </div>
        </div>
      </Modal>
    </header>
  );
}

function DirectLink({ href, label, isActive, light }: { href: string; label: string; isActive: boolean; light: boolean }) {
  return <Link href={href} aria-current={isActive ? "page" : undefined} className={cn("relative px-3 py-2 text-sm font-bold transition-colors after:absolute after:inset-x-3 after:-bottom-1 after:h-px after:origin-left after:bg-gold after:transition-transform", light ? "text-white/78 hover:text-white" : "text-text hover:text-ink", isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100")}>{label}</Link>;
}

function NavGroup({ label, items, open, active, light, onToggle, onClose }: { label: string; items: readonly { label: string; href: string; note: string }[]; open: boolean; active: boolean; light: boolean; onToggle: () => void; onClose: () => void }) {
  return (
    <div className="relative">
      <button type="button" onClick={onToggle} aria-expanded={open} className={cn("relative flex items-center gap-1 px-3 py-2 text-sm font-bold transition-colors after:absolute after:inset-x-3 after:-bottom-1 after:h-px after:bg-gold", light ? "text-white/78 hover:text-white" : "text-text hover:text-ink", active ? "after:scale-x-100" : "after:scale-x-0")}>
        {label}<ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.18 }} className="absolute left-0 top-full mt-3 w-72 border border-cream-deep bg-paper p-2 text-ink shadow-[0_18px_45px_rgba(8,17,38,0.14)]">
            {items.map((item) => <Link key={item.href} href={item.href} onClick={onClose} className="group flex items-center justify-between gap-4 border-b border-cream-deep px-3 py-3 last:border-0 hover:bg-cream"><span><span className="block text-sm font-bold">{item.label}</span><span className="mt-1 block text-xs text-muted">{item.note}</span></span><ArrowRight size={15} className="text-gold transition-transform group-hover:translate-x-0.5" /></Link>)}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
