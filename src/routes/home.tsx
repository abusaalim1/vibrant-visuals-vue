import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Flame, Check, ArrowRight, Gift, Trophy } from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { BottomNav } from "@/components/usora/BottomNav";
import { AmbientBackdrop } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";

export const Route = createFileRoute("/home")({ component: Home });

const streakDays = [true, true, true, true, true, true, false];
const dayLetters = ["M", "T", "W", "T", "F", "S", "S"];

function Home() {
  return (
    <PhoneShell withNav>
      <AmbientBackdrop />
      <header className="relative flex items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <Mascot variant="left" size={52} />
          <div>
            <p className="text-[13px] text-muted-ink">Good morning</p>
            <h1 className="font-display text-[30px] leading-tight text-ink">
              Aria <span className="text-muted-ink">&</span> Kai
            </h1>
          </div>
        </div>

        <button
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white"
        >
          <Bell className="h-5 w-5 text-ink" strokeWidth={1.75} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[color:var(--primary)]" />
        </button>
      </header>

      <main className="mt-6 flex-1 space-y-4 px-6">
        {/* Streak card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="card-soft overflow-hidden rounded-[24px] p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-ink">
                Current streak
              </p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-[46px] leading-none text-ink">42</span>
                <span className="text-[15px] text-muted-ink">days</span>
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-cta">
              <Flame className="h-5 w-5 text-white" strokeWidth={2} fill="white" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            {streakDays.map((done, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    done
                      ? "bg-gradient-primary text-white"
                      : "border border-dashed border-[color:var(--hairline)] text-muted-ink"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : ""}
                </div>
                <span className="text-[10px] text-muted-ink">{dayLetters[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Today's question preview */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="relative overflow-hidden rounded-[26px] border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6"
        >
          <div
            aria-hidden
            className="ambient-blob"
            style={{
              width: 220,
              height: 220,
              top: -80,
              right: -60,
              background: "radial-gradient(circle, #ffb3c8, transparent 70%)",
              opacity: 0.5,
            }}
          />
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[color:var(--primary)] shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
            Today · Intimacy
          </span>
          <p className="font-display relative mt-4 text-[26px] leading-[1.2] text-ink">
            "What small thing did I do this week that made you feel most loved?"
          </p>
          <Link to="/question" className="btn-primary relative mt-6 w-full">
            Answer now <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Quick access */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/achievements"
            className="card-soft rounded-[22px] p-4 transition active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--pink-soft)]">
              <Trophy className="h-5 w-5 text-[color:var(--primary)]" strokeWidth={1.9} />
            </div>
            <p className="mt-3 text-[15px] font-semibold text-ink">Achievements</p>
            <p className="text-[12px] text-muted-ink">4 of 12 unlocked</p>
          </Link>
          <Link
            to="/gifts"
            className="card-soft rounded-[22px] p-4 transition active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--pink-soft)]">
              <Gift className="h-5 w-5 text-[color:var(--primary)]" strokeWidth={1.9} />
            </div>
            <p className="mt-3 text-[15px] font-semibold text-ink">Gift shop</p>
            <p className="text-[12px] text-muted-ink">Send a rose today</p>
          </Link>
        </div>
      </main>

      <BottomNav />
    </PhoneShell>
  );
}
