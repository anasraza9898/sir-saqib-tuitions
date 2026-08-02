"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

const announcements = [
  "Admissions Open",
  "Grades IX-XII",
  "Science · General · Commerce",
  "Boys · Girls · Hill Park Campuses",
];

export function AnnouncementBar() {
  const [paused, setPaused] = useState(false);
  const items = [...announcements, ...announcements];

  return (
    <div className="relative overflow-hidden border-b border-gold-300/25 bg-navy-950 text-cream-50">
      <div className="mx-auto flex min-h-9 max-w-[1600px] items-center">
        <div className="min-w-0 flex-1 overflow-hidden" aria-label="Academy announcements">
          <div className="marquee-track" data-paused={paused}>
            {items.map((item, index) => (
              <span className="marquee-item" key={`${item}-${index}`} aria-hidden={index >= announcements.length}>
                <span className="h-1 w-1 rounded-full bg-gold-400" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="mr-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-gold-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play announcements" : "Pause announcements"}
        >
          {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
}
