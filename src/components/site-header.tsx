"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { Modal } from "@/components/modal";
import { navigation, site } from "@/data/site";
import { cn, telHref } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/10 bg-white/95 shadow-[0_1px_12px_rgba(7,22,48,0.05)] supports-[backdrop-filter]:bg-white/90 supports-[backdrop-filter]:backdrop-blur-sm">
      <div className="container-shell flex h-[72px] items-center justify-between gap-5">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label={`${site.name} home`}>
          <Image
            src="/assets/logo/sir-saqib-tuitions-logo.webp"
            alt=""
            width={52}
            height={52}
            priority
            className="h-11 w-11 rounded-sm object-cover ring-1 ring-navy-900/10"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-bold text-navy-950 sm:text-xl">{site.name}</span>
            <span className="hidden text-[10px] font-semibold uppercase text-gold-700 sm:block">Sound success in education</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative px-2.5 py-2 text-[13px] font-semibold text-navy-700 transition-colors hover:text-navy-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-gold-500",
                isActive(item.href) && "text-navy-950 after:absolute after:inset-x-2.5 after:-bottom-[17px] after:h-0.5 after:bg-gold-500",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact#enquiry" className="btn-primary hidden lg:inline-flex">
            Enroll Now <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="icon-button xl:hidden"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <Modal open={menuOpen} onClose={closeMenu} labelledBy="mobile-menu-title" className="ml-auto h-dvh max-h-dvh max-w-sm rounded-none sm:rounded-none">
        <div id="mobile-navigation" className="flex min-h-full flex-col bg-cream-50">
          <div className="flex items-center justify-between border-b border-navy-900/10 px-5 py-4">
            <div>
              <p id="mobile-menu-title" className="font-display text-xl font-bold text-navy-950">Navigate</p>
              <p className="text-xs text-navy-600">Sir Saqib Tuitions</p>
            </div>
            <button type="button" className="icon-button" onClick={closeMenu} aria-label="Close navigation menu">
              <X size={21} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-5" aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between border-b border-navy-900/10 px-2 py-3.5 text-base font-semibold text-navy-800",
                  isActive(item.href) && "text-burgundy-700",
                )}
              >
                <span><span className="mr-3 text-xs font-bold text-gold-700">{String(index + 1).padStart(2, "0")}</span>{item.label}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-2 border-t border-navy-900/10 p-4">
            <a href={telHref(site.admissionsPhone)} className="btn-secondary justify-center"><Phone size={16} /> Call</a>
            <Link href="/contact#enquiry" onClick={closeMenu} className="btn-primary justify-center">Enroll <ArrowRight size={16} /></Link>
          </div>
        </div>
      </Modal>
    </header>
  );
}
