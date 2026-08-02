import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function PageHero({ title, description, path, children }: { title: string; description: string; path: string; children?: ReactNode }) {
  return (
    <section className="border-b border-gold-400/30 bg-navy-950 text-white">
      <div className="container-shell py-12 sm:py-16 lg:py-20">
        <Breadcrumbs current={title} path={path} />
        <div className="mt-7 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-cream-100/80 sm:text-lg">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
