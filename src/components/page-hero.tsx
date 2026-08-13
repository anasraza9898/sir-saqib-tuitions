import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AnimatedUnderline, MotionReveal } from "@/components/motion-system";
import { cn } from "@/lib/utils";

type Tone = "ink" | "cream" | "paper";

export function PageHero({ title, description, path, children, tone = "ink", index = "01" }: { title: string; description: string; path: string; children?: ReactNode; tone?: Tone; index?: string }) {
  const inverse = tone === "ink";
  return (
    <section className={cn("relative overflow-hidden border-b", inverse ? "border-white/10 bg-ink text-white" : tone === "cream" ? "border-cream-deep bg-cream text-ink" : "border-cream-deep bg-paper text-ink")}>
      <div className="container-wide relative py-12 sm:py-16 lg:py-20">
        <Breadcrumbs current={title} path={path} inverse={inverse} />
        <div className="mt-9 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <MotionReveal className="max-w-4xl">
            {index ? <div className="flex items-center gap-3"><span className={cn("font-display text-lg", inverse ? "text-gold-light" : "text-gold")}>{index}</span><span className={cn("h-px w-12", inverse ? "bg-white/25" : "bg-ink/20")} /></div> : null}
            <h1 className="mt-5 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">{title}</h1>
            <AnimatedUnderline className="mt-6 w-28" />
            <p className={cn("mt-6 max-w-2xl text-base leading-8 sm:text-lg", inverse ? "text-white/64" : "text-muted")}>{description}</p>
          </MotionReveal>
          {children}
        </div>
      </div>
    </section>
  );
}
