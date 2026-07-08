import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Compass,
  Gift,
  Crown,
  CalendarHeart,
  Lock,
} from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { BottomNav } from "@/components/usora/BottomNav";
import { AmbientBackdrop } from "@/components/usora/Blobs";

export const Route = createFileRoute("/achievements")({ component: Achievements });

type A = {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  unlocked: boolean;
  progress?: number;
};

const items: A[] = [
  { title: "First Connection", desc: "You both said hello", icon: Sparkles, unlocked: true },
  { title: "7 Day Streak", desc: "A full week together", icon: Flame, unlocked: true },
  { title: "Deep Divers", desc: "50 questions answered", icon: Compass, unlocked: true, progress: 100 },
  { title: "Gift Giver", desc: "Send your first gift", icon: Gift, unlocked: true },
  { title: "Love Experts", desc: "200 questions", icon: Crown, unlocked: false, progress: 62 },
  { title: "One Year Strong", desc: "365 day streak", icon: CalendarHeart, unlocked: false, progress: 11 },
];

function Achievements() {
  const unlockedCount = items.filter((i) => i.unlocked).length;

  return (
    <PhoneShell withNav>
      <AmbientBackdrop />
      <header className="relative px-6 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-ink">
          Milestones
        </p>
        <h1 className="font-display mt-1 text-[34px] leading-tight text-ink">
          Every step, <span className="text-gradient-primary">celebrated</span>
        </h1>
        <div className="mt-3 flex items-center justify-between text-[13px] text-muted-ink">
          <span>
            <span className="font-semibold text-ink">{unlockedCount}</span> of{" "}
            {items.length} unlocked
          </span>
          <span className="text-[color:var(--primary)] font-semibold">
            +{items.length - unlockedCount} to go
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--pink-soft)]">
          <div
            className="h-full rounded-full bg-gradient-primary"
            style={{ width: `${(unlockedCount / items.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="relative mt-6 grid grid-cols-2 gap-3 px-6">
        {items.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-[22px] p-4 ${
                a.unlocked
                  ? "border border-[color:var(--primary)]/25 bg-white shadow-card"
                  : "border border-dashed border-[color:var(--hairline)] bg-[color:var(--surface)]"
              }`}
            >
              <div
                aria-hidden
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full"
                style={{
                  background: a.unlocked
                    ? "radial-gradient(circle, rgba(255,124,163,0.55), transparent 70%)"
                    : "radial-gradient(circle, rgba(255,180,200,0.35), transparent 70%)",
                }}
              />

              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${
                  a.unlocked ? "bg-gradient-primary" : "bg-[color:var(--pink-soft)]"
                }`}
              >
                {a.unlocked ? (
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                ) : (
                  <Lock
                    className="h-4 w-4 text-muted-ink"
                    strokeWidth={2}
                  />
                )}
              </div>
              <p className="relative mt-3 text-[14px] font-semibold text-ink">
                {a.title}
              </p>
              <p className="relative text-[11.5px] leading-snug text-muted-ink">
                {a.desc}
              </p>
              {!a.unlocked && a.progress !== undefined && (
                <div className="relative mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--hairline)]">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] font-medium text-muted-ink">
                    {a.progress}%
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </PhoneShell>
  );
}
