import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Heart } from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { BottomNav } from "@/components/usora/BottomNav";
import { AmbientBackdrop } from "@/components/usora/Blobs";

export const Route = createFileRoute("/memories")({ component: Memories });

const filters = ["All", "Favorite", "Romantic", "Funny", "Deep"] as const;

const tagAccent: Record<string, { border: string; thumb: string }> = {
  Romantic: {
    border: "#ff6f95",
    thumb: "linear-gradient(135deg,#ffd0dc,#ff8fb1)",
  },
  Funny: {
    border: "#f4c86a",
    thumb: "linear-gradient(135deg,#fff0c8,#f7c86b)",
  },
  Deep: {
    border: "#8aa0d8",
    thumb: "linear-gradient(135deg,#d8e1f7,#8aa0d8)",
  },
  Favorite: {
    border: "#ff4d79",
    thumb: "linear-gradient(135deg,#ffc3d4,#ff4d79)",
  },
};


const groups = [
  {
    label: "Today",
    items: [
      {
        day: 42,
        q: "What small thing did I do this week that made you feel most loved?",
        aria: "When you made me chai without asking on Tuesday.",
        kai: "The little note you left on my laptop before my meeting.",
        tags: ["Romantic", "Favorite"],
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        day: 41,
        q: "What's a song that reminds you of us?",
        aria: "'Sunflower' — the drive to Lonavala.",
        kai: "'Fix You' — 2AM after your rough Friday.",
        tags: ["Romantic"],
      },
    ],
  },
  {
    label: "This week",
    items: [
      {
        day: 40,
        q: "The most ridiculous thing we've ever done together?",
        aria: "Karaoke in Bangalore. Terrible. Perfect.",
        kai: "That 'shortcut' that added 2 hours to the drive.",
        tags: ["Funny"],
      },
      {
        day: 39,
        q: "One dream you haven't told me yet?",
        aria: "Opening a tiny bookstore café.",
        kai: "A year traveling with no plans.",
        tags: ["Deep", "Favorite"],
      },
    ],
  },
];

function Memories() {
  const [filter, setFilter] = useState<string>("All");

  return (
    <PhoneShell withNav>
      <header className="px-6 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-ink">
          Your story
        </p>
        <h1 className="font-display mt-1 text-[34px] leading-tight text-ink">
          Memories
        </h1>
      </header>

      <div className="mt-5 px-6">
        <div className="flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white px-4 py-3">
          <Search className="h-4 w-4 text-muted-ink" />
          <input
            placeholder="Search a moment…"
            className="flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-muted-ink"
          />
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-6">
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition ${
                active
                  ? "bg-gradient-primary text-white shadow-cta"
                  : "border border-[color:var(--hairline)] bg-white text-muted-ink"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-6 px-6">
        {groups.map((g) => (
          <section key={g.label}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-ink">
              {g.label}
            </h3>
            <div className="space-y-3">
              {g.items
                .filter(
                  (m) =>
                    filter === "All" ||
                    m.tags.includes(filter as (typeof m.tags)[number]),
                )
                .map((m, idx) => (
                  <motion.article
                    key={m.day}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card-soft rounded-[22px] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--primary)]">
                        Day {m.day}
                      </span>
                      {m.tags.includes("Favorite") && (
                        <Heart
                          className="h-4 w-4 text-[color:var(--primary)]"
                          fill="currentColor"
                        />
                      )}
                    </div>
                    <p className="font-display mt-2 text-[19px] leading-snug text-ink">
                      "{m.q}"
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-[color:var(--surface)] p-3">
                        <p className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-ink">
                          Aria
                        </p>
                        <p className="mt-1 text-[12.5px] leading-snug text-ink/85">
                          {m.aria}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[color:var(--surface)] p-3">
                        <p className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-ink">
                          Kai
                        </p>
                        <p className="mt-1 text-[12.5px] leading-snug text-ink/85">
                          {m.kai}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-[color:var(--pink-soft)] px-2.5 py-0.5 text-[10.5px] font-semibold text-[color:var(--primary)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                ))}
            </div>
          </section>
        ))}
      </div>

      <BottomNav />
    </PhoneShell>
  );
}
