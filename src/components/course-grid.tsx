"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { programs } from "@/data/site";
import { cn } from "@/lib/utils";

const filters = ["All", "Matric", "Intermediate", "Foundation", "Huffaz"] as const;

export function CourseGrid({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const filtered = useMemo(
    () => programs.filter((program) => filter === "All" || program.level.includes(filter) || program.stream === filter),
    [filter],
  );
  const displayed = compact && filter === "All" ? filtered.slice(0, 6) : filtered;

  return (
    <div>
      <div className="scrollbar-none mb-8 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter courses by level">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={cn("filter-button", filter === item && "filter-button-active")}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((program) => {
          const Icon = program.icon;
          return (
            <article id={program.id} key={program.id} className="course-card group scroll-mt-28">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-cream-100 text-navy-900 ring-1 ring-navy-900/10 transition-colors group-hover:bg-navy-950 group-hover:text-gold-300">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <span className="text-[11px] font-bold uppercase text-burgundy-700">{program.level}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-navy-950">{program.title}</h3>
              <p className="mt-3 text-sm leading-6 text-navy-600">{program.description}</p>
              <Link href={`/contact?program=${program.id}#enquiry`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy-900 transition hover:text-burgundy-700">
                Ask admissions <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
      {compact ? (
        <div className="mt-8 text-center">
          <Link href="/courses" className="btn-secondary">View all programs <ArrowRight size={16} /></Link>
        </div>
      ) : null}
    </div>
  );
}
