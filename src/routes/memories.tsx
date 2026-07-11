import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Heart } from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { BottomNav } from "@/components/usora/BottomNav";
import { AmbientBackdrop } from "@/components/usora/Blobs";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/memories")({ component: Memories });

const filters = ["All", "Favorite"] as const;

type AnswerRow = {
  id: number;
  created_at: string;
  question_id: string | number;
  user_id: string;
  answer_text: string;
};

function Memories() {
  const [filter, setFilter] = useState<string>("All");
  const { couple, user } = useAuth();
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!couple) {
        setAnswers([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await supabase
          .from("answers")
          .select("*")
          .eq("couple_id", couple.id as unknown as string)
          .order("created_at", { ascending: false });
        const rows = (data ?? []) as AnswerRow[];
        setAnswers(rows);
        const qIds = Array.from(new Set(rows.map((r) => r.question_id))).filter(
          Boolean,
        );
        if (qIds.length) {
          const { data: qs } = await supabase
            .from("questions")
            .select("id, text")
            .in("id", qIds as never);
          const map: Record<string, string> = {};
          for (const q of (qs ?? []) as { id: number | string; text: string }[])
            map[String(q.id)] = q.text;
          setQuestionsMap(map);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [couple]);

  // group by relative date
  const grouped = groupByRelative(answers);

  return (
    <PhoneShell withNav>
      <AmbientBackdrop />
      <header className="relative px-6 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-ink">
          Your story
        </p>
        <h1 className="font-display mt-1 text-[34px] leading-tight text-ink">
          Memories
        </h1>
      </header>

      <div className="relative mt-5 px-6">
        <div className="flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white px-4 py-3 shadow-card">
          <Search className="h-4 w-4 text-muted-ink" />
          <input
            placeholder="Search a moment…"
            className="flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-muted-ink"
          />
        </div>
      </div>

      <div
        className="relative mt-4"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 88%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, black 0%, black 88%, transparent 100%)",
        }}
      >
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-6 pb-1">
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
          <div className="w-6 shrink-0" />
        </div>
      </div>

      <div className="relative mt-6 space-y-6 px-6">
        {loading ? (
          <p className="text-center text-[13px] text-muted-ink">Loading…</p>
        ) : answers.length === 0 ? (
          <div className="card-soft rounded-[22px] p-8 text-center">
            <p className="font-display text-[20px] text-ink">
              No memories yet
            </p>
            <p className="mt-2 text-[13px] text-muted-ink">
              Start answering questions together to build your story.
            </p>
          </div>
        ) : (
          grouped.map((g) => (
            <section key={g.label}>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-ink">
                {g.label}
              </h3>
              <div className="space-y-3">
                {g.items.map((m, idx) => {
                  const mine = m.user_id === user?.id;
                  return (
                    <motion.article
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="card-soft relative overflow-hidden rounded-[22px] p-5 pl-6"
                      style={{ borderLeft: `4px solid #ff6f95` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--primary)]">
                              {new Date(m.created_at).toLocaleDateString()}
                            </span>
                            <Heart className="h-4 w-4 text-[color:var(--primary)]/40" />
                          </div>
                          <p className="font-display mt-2 text-[19px] leading-snug text-ink">
                            "{questionsMap[String(m.question_id)] ?? "A shared moment"}"
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-2xl bg-[color:var(--surface)] p-3">
                        <p className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-ink">
                          {mine ? "You" : "Partner"}
                        </p>
                        <p className="mt-1 text-[12.5px] leading-snug text-ink/85">
                          {m.answer_text}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      <BottomNav />
    </PhoneShell>
  );
}

function groupByRelative(rows: AnswerRow[]) {
  const today = new Date().toISOString().slice(0, 10);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = y.toISOString().slice(0, 10);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const buckets: { label: string; items: AnswerRow[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "This week", items: [] },
    { label: "Earlier", items: [] },
  ];
  for (const r of rows) {
    const d = r.created_at.slice(0, 10);
    if (d === today) buckets[0].items.push(r);
    else if (d === yesterday) buckets[1].items.push(r);
    else if (new Date(r.created_at) >= weekAgo) buckets[2].items.push(r);
    else buckets[3].items.push(r);
  }
  return buckets.filter((b) => b.items.length);
}
