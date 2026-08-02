import Image from "next/image";
import { Beaker, BookOpen, Dna, Landmark, Laptop, Pill, Sigma } from "lucide-react";
import { FacultyPosterButton } from "@/components/faculty-poster-button";
import { faculty } from "@/data/site";
import { initials } from "@/lib/utils";

const fieldIcons = {
  "Engineering": Beaker,
  "Mathematics": Sigma,
  "Biomedical Science": Dna,
  "Commerce": Landmark,
  "Biological Sciences": Dna,
  "Life Sciences": Pill,
  "Computer Science": Laptop,
} as const;

export function FacultyRoster({ compact = false }: { compact?: boolean }) {
  const leader = faculty[0];
  const members = compact ? faculty.slice(1, 6) : faculty.slice(1);
  return (
    <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
      <article className="relative overflow-hidden bg-ink text-white">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 sm:aspect-[16/10] lg:aspect-[4/3]">
          <Image src="/assets/posters/video/sir-saqib-introduction.webp" alt="Sir Saqib Zaki speaking in the academy introduction video" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover object-top" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-gold" aria-hidden="true" />
        </div>
        <div className="p-6 sm:p-8">
          <p className="eyebrow text-gold-light">Academic leadership</p>
          <h3 className="mt-5 font-display text-4xl">{leader.name}</h3>
          <p className="mt-3 text-sm text-white/62">{leader.qualification}</p>
          <div className="mt-7 flex items-end justify-between border-t border-white/12 pt-5">
            <p className="text-sm font-bold text-gold-light">{leader.experience} years experience</p>
            <span className="font-display text-4xl text-white/14">SST</span>
          </div>
        </div>
      </article>

      <div>
        <div className="border-y border-cream-deep">
          {members.map((member, index) => {
            const Icon = fieldIcons[member.field as keyof typeof fieldIcons] ?? BookOpen;
            return (
              <article key={member.name} tabIndex={0} className="group grid gap-4 border-b border-cream-deep bg-paper px-2 py-5 transition-colors last:border-b-0 hover:bg-cream focus:bg-cream sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center sm:px-4">
                <span className="flex h-11 w-11 items-center justify-center border border-cream-deep bg-cream font-display text-lg text-ink group-hover:border-gold">{initials(member.name)}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-xl text-ink">{member.name}</h3><span className="inline-flex items-center gap-1 rounded-full border border-cream-deep px-2 py-1 text-[10px] font-bold text-girls"><Icon size={12} />{member.field}</span></div>
                  <p className="mt-1.5 text-xs leading-5 text-muted">{member.qualification}</p>
                </div>
                <div className="flex items-center gap-2 sm:block sm:text-right"><span className="font-display text-2xl text-gold">{String(index + 2).padStart(2, "0")}</span><p className="text-[11px] font-bold text-text">{member.experience} years</p></div>
              </article>
            );
          })}
        </div>
        <FacultyPosterButton />
      </div>
    </div>
  );
}
