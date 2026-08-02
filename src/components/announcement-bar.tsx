"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

const announcements = [
  "Admissions Open",
  "Grades IX-XII",
  "Science / General / Commerce",
  "Boys / Girls / Hill Park Campuses",
  "Grades I-VIII Foundation Tuition",
  "Huffaz Formal Education Programme",
];

function AnnouncementCopy({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className="marquee-copy" aria-hidden={duplicate || undefined}>
      {announcements.map((item) => (
        <li className="marquee-item" key={item}>
          <span className="marquee-dot" aria-hidden="true" />{item}
        </li>
      ))}
    </ul>
  );
}

export function AnnouncementBar() {
  const [paused, setPaused] = useState(false);
  return (
    <aside className="marquee-shell" aria-label="Academy announcements">
      <div className="mx-auto flex min-h-9 max-w-[1600px] items-center">
        <div className="min-w-0 flex-1 overflow-hidden motion-reduce:overflow-visible">
          <div className="marquee-track" data-paused={paused}>
            <AnnouncementCopy />
            <AnnouncementCopy duplicate />
          </div>
        </div>
        <button
          type="button"
          className="mr-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-gold-light transition hover:bg-white/10 hover:text-white focus-visible:outline-gold"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? "Play announcements" : "Pause announcements"}
        >
          {paused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
        </button>
      </div>
    </aside>
  );
}
