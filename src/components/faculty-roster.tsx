import Image from "next/image";
import { Beaker, BookOpen, Dna, Landmark, Laptop, Pill, Sigma } from "lucide-react";
import { faculty } from "@/data/site";

const fieldIcons = {
  "Engineering": Beaker,
  "Mathematics": Sigma,
  "Biomedical Science": Dna,
  "Commerce": Landmark,
  "Biological Sciences": Dna,
  "Life Sciences": Pill,
  "Computer Science": Laptop,
  "Leadership & Commerce": Landmark,
} as const;

export function FacultyRoster({ compact = false }: { compact?: boolean }) {
  const members = faculty;
  return (
    <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
      <article className={compact ? "relative overflow-hidden bg-white lg:self-start" : "relative overflow-hidden bg-white"}>
        <div className="relative aspect-[4/5] overflow-hidden bg-white sm:aspect-[4/5]">
          <Image src="/assets/posters/faculty-instructors.webp" alt="Official Sir Saqib Tuitions faculty poster" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-contain" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-gold" aria-hidden="true" />
        </div>
      </article>

      <div>
        <div className="border-y border-cream-deep">
          {members.map((member, index) => {
            const Icon = fieldIcons[member.field as keyof typeof fieldIcons] ?? BookOpen;
            return (
              <article key={member.name} tabIndex={0} className="group grid gap-4 border-b border-cream-deep bg-paper px-2 py-6 transition-colors last:border-b-0 hover:bg-cream focus:bg-cream sm:grid-cols-[3.25rem_minmax(0,1fr)_6.5rem] sm:items-center sm:px-4">
                <span className="font-display text-2xl text-gold">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-xl text-ink">{member.name}</h3><span className="inline-flex items-center gap-1 rounded-full border border-cream-deep px-2 py-1 text-[10px] font-bold text-girls"><Icon size={12} />{member.field}</span></div>
                  <p className="mt-1.5 text-xs leading-5 text-muted">{member.qualification}</p>
                </div>
                <p className="self-center text-left text-sm font-extrabold text-ink sm:text-center">{member.experience} years</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
