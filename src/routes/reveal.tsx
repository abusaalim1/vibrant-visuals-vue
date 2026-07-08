import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Sparkles, Bookmark, ArrowRight } from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";

export const Route = createFileRoute("/reveal")({ component: Reveal });

const TARGET = 87;

function Reveal() {
  const nav = useNavigate();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  const circumference = 2 * Math.PI * 88;
  const [dash, setDash] = useState(circumference);

  useEffect(() => {
    const c = animate(count, TARGET, { duration: 1.8, ease: [0.2, 0.9, 0.2, 1] });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    // ring
    const t = setTimeout(() => {
      setDash(circumference - (TARGET / 100) * circumference);
    }, 60);
    return () => {
      c.stop();
      unsub();
      clearTimeout(t);
    };
  }, [count, rounded, circumference]);

  return (
    <PhoneShell>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-hero px-6 pt-10">
        {/* Floating hearts */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Heart
            key={i}
            className="pointer-events-none absolute animate-float-up text-[color:var(--primary)]"
            style={{
              left: `${15 + i * 15}%`,
              bottom: 100,
              width: 14 + (i % 3) * 4,
              height: 14 + (i % 3) * 4,
              animationDelay: `${i * 0.6}s`,
              opacity: 0.6,
            }}
            strokeWidth={1.75}
            fill="rgba(255,77,121,0.15)"
          />
        ))}

        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-ink">
          Today's compatibility
        </p>

        {/* Ring */}
        <div className="relative mx-auto mt-6 h-[220px] w-[220px]">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff7ca3" />
                <stop offset="100%" stopColor="#ff4470" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="88" stroke="var(--hairline)" strokeWidth="12" fill="none" />
            <motion.circle
              cx="100"
              cy="100"
              r="88"
              stroke="url(#ringGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dash }}
              transition={{ duration: 1.8, ease: [0.2, 0.9, 0.2, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[64px] leading-none text-ink">
              {display}
              <span className="text-[28px] text-muted-ink">%</span>
            </span>
            <span className="mt-1 flex items-center gap-1 text-[12px] font-medium uppercase tracking-widest text-[color:var(--primary)]">
              <Sparkles className="h-3 w-3" /> in sync
            </span>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mx-auto mt-6 max-w-xs text-center text-[14.5px] leading-relaxed text-muted-ink"
        >
          You both value the same quiet gestures — a shared cup of tea, a message
          on a hard day. That's rare.
        </motion.p>

        {/* Side-by-side answers */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-6 grid grid-cols-2 gap-3"
        >
          {[
            { name: "Aria", color: "#ffd8e2", text: "When you made me chai without asking on Tuesday." },
            { name: "Kai", color: "#ffb0c6", text: "The little note you left on my laptop before my meeting." },
          ].map((p) => (
            <div key={p.name} className="card-soft rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-6 w-6 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="text-[12px] font-semibold text-ink">{p.name}</span>
              </div>
              <p className="mt-2 text-[13px] leading-snug text-ink/85">"{p.text}"</p>
            </div>
          ))}
        </motion.div>

        {/* Conversation starter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-4 rounded-[22px] border border-[color:var(--primary)]/25 bg-white p-5"
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[color:var(--primary)]">
            <Sparkles className="h-3.5 w-3.5" /> Conversation starter
          </div>
          <p className="font-display mt-2 text-[19px] leading-snug text-ink">
            "What's a tiny ritual we could make just ours?"
          </p>
        </motion.div>

        <div className="mt-auto flex gap-3 py-6">
          <button
            onClick={() => nav({ to: "/memories" })}
            className="btn-secondary flex-1"
          >
            <Bookmark className="h-4 w-4" /> Save
          </button>
          <Link to="/home" className="btn-primary flex-1">
            Continue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
