import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Lock, ArrowLeft, Check } from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";

export const Route = createFileRoute("/question")({ component: Question });

const QUESTIONS = [
  {
    tag: "Intimacy",
    text: "What small thing did I do this week that made you feel most loved?",
  },
  { tag: "Future", text: "Where do you picture us five years from today?" },
  { tag: "Humor", text: "What memory of us still makes you laugh out loud?" },
];

function Question() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [locked, setLocked] = useState(false);
  const q = QUESTIONS[step];

  const onLock = () => {
    if (!answer.trim()) return;
    setLocked(true);
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
        setAnswer("");
        setLocked(false);
      } else {
        nav({ to: "/reveal" });
      }
    }, 1700);
  };

  return (
    <PhoneShell>
      <header className="flex items-center justify-between px-6 pt-8">
        <button
          onClick={() => nav({ to: "/home" })}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white"
        >
          <ArrowLeft className="h-4 w-4 text-ink" />
        </button>
        <div className="flex items-center gap-1.5">
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step
                  ? "w-8 bg-gradient-primary"
                  : i < step
                  ? "w-4 bg-[color:var(--primary)]/70"
                  : "w-4 bg-[color:var(--hairline)]"
              }`}
            />
          ))}
        </div>
        <span className="w-10 text-right text-[12px] text-muted-ink">
          {step + 1}/{QUESTIONS.length}
        </span>
      </header>

      <main className="flex flex-1 flex-col px-6 pt-8">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[color:var(--pink-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[color:var(--primary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
          {q.tag}
        </span>

        <AnimatePresence mode="wait">
          <motion.h2
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="font-display mt-6 text-[32px] leading-[1.18] text-ink"
          >
            "{q.text}"
          </motion.h2>
        </AnimatePresence>

        {/* Answer input / locked state */}
        <div className="mt-8 flex-1">
          <AnimatePresence mode="wait">
            {!locked ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[24px] border border-[color:var(--hairline)] bg-white p-5"
              >
                <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-ink">
                  Your answer
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  placeholder="Take your time. Nothing shows until you're both ready."
                  className="mt-2 w-full resize-none border-0 bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted-ink"
                />
              </motion.div>
            ) : (
              <motion.div
                key="locked"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3 rounded-[24px] border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-cta">
                  <Lock className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <p className="font-display text-[22px] text-ink">
                  Answer locked
                </p>
                <p className="text-[13px] text-muted-ink">
                  Held safely until Kai is ready.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Partner status */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[color:var(--hairline)] bg-white p-4">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#ffd8e2] to-[#ff9ab6]" />
              {!locked && (
                <span className="absolute inset-0 animate-breathe rounded-full ring-2 ring-[color:var(--primary)]/40" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-ink">Kai</p>
              <p className="text-[12px] text-muted-ink">
                {locked ? "Also thinking…" : "Waiting…"}
              </p>
            </div>
            {locked ? (
              <Check className="h-4 w-4 text-[color:var(--primary)]" strokeWidth={2.5} />
            ) : (
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-ink">
                Live
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onLock}
          disabled={locked || !answer.trim()}
          className="btn-primary mb-8 mt-6 w-full disabled:opacity-50"
        >
          <Lock className="h-4 w-4" strokeWidth={2.2} />
          Lock my answer
        </button>
      </main>
    </PhoneShell>
  );
}
