import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
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
  Copy,
} from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { BottomNav } from "@/components/usora/BottomNav";
import { AmbientBackdrop } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/question")({ component: Question });

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

type Q = { id: number | string; text: string; category: string | null };

function Question() {
  const nav = useNavigate();
  const { user, couple, profile, loading } = useAuth();
  const [answer, setAnswer] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [q, setQ] = useState<Q | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("questions")
        .select("id, text, category")
        .order("id", { ascending: true })
        .limit(1);
      if (data && data[0]) setQ(data[0] as Q);
    })();
  }, []);

  const connected = !!couple?.connected_at;

  const copyCode = async () => {
    if (!couple?.invite_code) return;
    await navigator.clipboard?.writeText(couple.invite_code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const send = async () => {
    if (!answer.trim() && !selectedGift) return;
    if (!user || !couple || !q) return;
    setSaveError(null);
    setLocked(true);
    try {
      const { error } = await supabase.from("answers").insert({
        question_id: q.id as unknown as string,
        user_id: user.id,
        couple_id: couple.id as unknown as string,
        answer_text: answer.trim() || `Sent a ${selectedGift ?? "gift"} 💝`,
      });
      if (error) throw error;
      setTimeout(() => nav({ to: "/reveal" }), 1600);
    } catch (e) {
      setLocked(false);
      setSaveError(e instanceof Error ? e.message : "Couldn't save your answer.");
    }
  };

  // Not connected → gate the flow
  if (!loading && user && !connected) {
    return (
      <PhoneShell withNav>
        <AmbientBackdrop />
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
          <div className="flex items-end">
            <Mascot variant="left" size={88} />
            <Mascot variant="right" size={88} />
          </div>
          <h2 className="font-display mt-4 text-[26px] leading-tight text-ink">
            Waiting for your partner to join
          </h2>
          <p className="mt-2 max-w-[300px] text-[13.5px] text-muted-ink">
            Share your invite code so you can start answering questions together.
          </p>
          {couple?.invite_code && (
            <div className="mt-6 rounded-[24px] border border-[color:var(--hairline)] bg-white px-8 py-5 shadow-card">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-ink">
                Your code
              </p>
              <p className="font-display mt-2 text-[38px] tracking-[0.1em] text-ink">
                {couple.invite_code}
              </p>
              <button onClick={copyCode} className="btn-secondary mt-3 mx-auto">
                {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
              </button>
            </div>
          )}
          <Link to="/invite" className="btn-primary mt-6">
            Open invite screen
          </Link>
        </main>
        <BottomNav />
      </PhoneShell>
    );
  }

  return (
    <PhoneShell withNav>
      <AmbientBackdrop />

      <header className="relative px-6 pt-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--pink-soft)] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
          Today's Question · {q?.category ?? "For you"}
        </span>
        <p className="mt-2 text-[12px] font-medium text-muted-ink">
          {profile?.full_name?.split(" ")[0] ?? "You"} & {profile?.partner_name_label ?? "Partner"}
        </p>
      </header>

      <main className="relative flex-1 px-6 pb-6">
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
              "{q?.text ?? "Loading question…"}"
            </motion.h2>
          )}
        </AnimatePresence>

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
                Waiting for <span className="text-ink font-medium">{profile?.partner_name_label ?? "your partner"}</span> to answer…
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-7"
            >
              <div className="rounded-[24px] border border-[color:var(--hairline)] bg-white p-4 shadow-card">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={4}
                  placeholder="Your answer here… (no character limit)"
                  className="w-full resize-none border-0 bg-transparent text-[14.5px] leading-relaxed text-ink outline-none placeholder:text-muted-ink"
                />
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
                                selectedReaction === r.label ? null : r.label,
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

              {saveError && (
                <p className="mt-3 rounded-2xl bg-[color:var(--pink-soft)] px-3 py-2 text-[12.5px] text-[color:var(--primary)]">
                  {saveError}
                </p>
              )}

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
