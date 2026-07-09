import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Lock,
  Send,
  Gift,
  Mic,
  Smile,
  Sparkles,
  X,
  Plus,
  Check,
} from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { BottomNav } from "@/components/usora/BottomNav";
import { AmbientBackdrop } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";

export const Route = createFileRoute("/question")({ component: Question });

const QUESTION = {
  tag: "Intimacy",
  day: 42,
  text: "What small thing did I do this week that made you feel most loved?",
};

const GIFTS = [
  { name: "Rose", price: "Free", emoji: "🌹" },
  { name: "Love Letter", price: "₹19", emoji: "💌" },
  { name: "Playlist Card", price: "₹29", emoji: "🎵" },
  { name: "Voice Note", price: "₹39", emoji: "🎙️" },
  { name: "Surprise Box", price: "₹49", emoji: "🎁" },
  { name: "More coming soon", price: "", emoji: "✨", disabled: true },
];

const REACTIONS = [
  { label: "Happy", emoji: "😊" },
  { label: "Love", emoji: "🥰" },
  { label: "Laugh", emoji: "😂" },
  { label: "Surprised", emoji: "😮" },
];

function Question() {
  const nav = useNavigate();
  const [answer, setAnswer] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const send = () => {
    if (!answer.trim() && !selectedGift) return;
    setLocked(true);
    setTimeout(() => nav({ to: "/reveal" }), 2000);
  };

  return (
    <PhoneShell withNav>
      <AmbientBackdrop />

      <header className="relative px-6 pt-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--pink-soft)] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
          Today's Question · {QUESTION.tag}
        </span>
        <p className="mt-2 text-[12px] font-medium text-muted-ink">Day {QUESTION.day}</p>
      </header>

      <main className="relative flex-1 px-6 pb-6">
        {/* Mascots */}
        <div className="relative mt-4 flex items-end justify-center">
          <div
            aria-hidden
            className="absolute inset-x-6 top-6 h-24 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 50%, rgba(255,150,180,0.35), transparent 70%)",
              filter: "blur(24px)",
            }}
          />
          <div className="relative -mr-3">
            <Mascot variant="left" size={96} />
          </div>
          <div className="relative -ml-3">
            <Mascot variant="right" size={96} />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          {!locked && (
            <motion.h2
              key="q"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display mx-auto mt-5 max-w-[340px] text-center text-[28px] leading-[1.18] text-ink"
            >
              "{QUESTION.text}"
            </motion.h2>
          )}
        </AnimatePresence>

        {/* Locked / Waiting */}
        <AnimatePresence mode="wait">
          {locked ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex flex-col items-center gap-4 rounded-[28px] border border-[color:var(--hairline)] bg-white p-8 text-center shadow-card"
            >
              <div className="relative">
                <span className="absolute inset-0 animate-breathe rounded-full bg-[color:var(--pink-soft)]" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-cta">
                  <Lock className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <p className="font-display text-[22px] text-ink">Answer locked</p>
              <p className="text-[13px] leading-relaxed text-muted-ink">
                Waiting for <span className="text-ink font-medium">Kai</span> to answer…
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                    className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-7"
            >
              {/* Textarea */}
              <div className="rounded-[24px] border border-[color:var(--hairline)] bg-white p-4 shadow-card">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={4}
                  placeholder="Your answer here… (no character limit)"
                  className="w-full resize-none border-0 bg-transparent text-[14.5px] leading-relaxed text-ink outline-none placeholder:text-muted-ink"
                />

                {/* Selected gift chip */}
                <AnimatePresence>
                  {selectedGift && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 flex items-center justify-between rounded-2xl bg-[color:var(--pink-soft)] px-3 py-2"
                    >
                      <span className="text-[12.5px] font-medium text-ink">
                        Attached: <span className="text-[color:var(--primary)]">{selectedGift}</span>
                      </span>
                      <button onClick={() => setSelectedGift(null)}>
                        <X className="h-3.5 w-3.5 text-muted-ink" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Custom message drawer */}
              <AnimatePresence>
                {showCustom && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-[22px] border border-[color:var(--hairline)] bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-ink">
                        Add a reaction
                      </p>
                      <div className="mt-2 flex gap-2">
                        {REACTIONS.map((r) => (
                          <button
                            key={r.label}
                            onClick={() =>
                              setSelectedReaction(
                                selectedReaction === r.label ? null : r.label
                              )
                            }
                            className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-2 transition ${
                              selectedReaction === r.label
                                ? "border-[color:var(--primary)] bg-[color:var(--pink-soft)]"
                                : "border-[color:var(--hairline)] bg-white"
                            }`}
                          >
                            <span className="text-[20px]">{r.emoji}</span>
                            <span className="text-[10px] text-muted-ink">{r.label}</span>
                          </button>
                        ))}
                      </div>
                      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[color:var(--primary)]/50 bg-white py-3 text-[13px] font-semibold text-[color:var(--primary)] transition active:scale-[0.98]">
                        <Mic className="h-4 w-4" /> Record voice message
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action row */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={send}
                  disabled={!answer.trim()}
                  className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[color:var(--hairline)] bg-white px-2 py-3 text-[11.5px] font-semibold text-ink shadow-card transition active:scale-[0.97] disabled:opacity-50"
                >
                  <Send className="h-4 w-4 text-[color:var(--primary)]" strokeWidth={2} />
                  Send as text
                </button>
                <button
                  onClick={() => setShowCustom((v) => !v)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl border bg-white px-2 py-3 text-[11.5px] font-semibold text-ink shadow-card transition active:scale-[0.97] ${
                    showCustom
                      ? "border-[color:var(--primary)]"
                      : "border-[color:var(--hairline)]"
                  }`}
                >
                  <Smile className="h-4 w-4 text-[color:var(--primary)]" strokeWidth={2} />
                  Custom
                </button>
                <button
                  onClick={() => setShowGifts(true)}
                  className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-primary px-2 py-3 text-[11.5px] font-semibold text-white shadow-cta transition active:scale-[0.97]"
                >
                  <Gift className="h-4 w-4" strokeWidth={2} />
                  Gift & Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Gift picker overlay */}
      <AnimatePresence>
        {showGifts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGifts(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#241B24]/40 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[340px] rounded-[28px] border border-[color:var(--hairline)] bg-white p-5 shadow-float"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
                    <Sparkles className="mr-1 inline h-3 w-3" /> Gift picker
                  </p>
                  <h3 className="font-display mt-1 text-[22px] text-ink">
                    A little something
                  </h3>
                </div>
                <button
                  onClick={() => setShowGifts(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--hairline)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {GIFTS.map((g) => {
                  const active = selectedGift === g.name;
                  return (
                    <button
                      key={g.name}
                      disabled={g.disabled}
                      onClick={() => setSelectedGift(active ? null : g.name)}
                      className={`relative flex flex-col items-center gap-1 rounded-2xl border p-3 transition active:scale-[0.96] ${
                        active
                          ? "border-[color:var(--primary)] bg-[color:var(--pink-soft)]"
                          : "border-[color:var(--hairline)] bg-white"
                      } ${g.disabled ? "opacity-50" : ""}`}
                    >
                      {active && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-primary">
                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </span>
                      )}
                      <span className="text-[24px]">{g.emoji}</span>
                      <span className="text-[10.5px] font-semibold text-ink leading-tight text-center">
                        {g.name}
                      </span>
                      {g.price && (
                        <span className="text-[10px] text-[color:var(--primary)]">
                          {g.price}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <Link
                to="/gifts"
                className="mt-3 flex items-center justify-center gap-1 text-[11.5px] font-medium text-muted-ink"
              >
                <Plus className="h-3 w-3" /> View all gifts
              </Link>

              <button
                onClick={() => {
                  setShowGifts(false);
                  send();
                }}
                disabled={!selectedGift}
                className="btn-primary mt-4 w-full disabled:opacity-50"
              >
                <Gift className="h-4 w-4" /> Send with gift
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </PhoneShell>
  );
}
