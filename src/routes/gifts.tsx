import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Flower2, Mail, Music, Mic, Heart, Gift, Star, Cake, Coffee, Camera, Sparkles } from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { AmbientBackdrop } from "@/components/usora/Blobs";

export const Route = createFileRoute("/gifts")({ component: Gifts });

const gifts = [
  { name: "Rose", price: "Free", icon: Flower2 },
  { name: "Love Letter", price: "₹19", icon: Mail },
  { name: "Playlist Card", price: "₹29", icon: Music },
  { name: "Voice Note", price: "₹39", icon: Mic },
  { name: "Surprise Box", price: "₹49", icon: Gift },
  { name: "Chai Date", price: "₹59", icon: Coffee },
  { name: "Star Wish", price: "₹69", icon: Star },
  { name: "Sweet Cake", price: "₹79", icon: Cake },
  { name: "Photo Frame", price: "₹89", icon: Camera },
  { name: "Sparkle Note", price: "₹99", icon: Sparkles },
  { name: "More soon", price: "Coming", icon: Heart, disabled: true },
  { name: "More soon", price: "Coming", icon: Heart, disabled: true },
];

function Gifts() {
  const nav = useNavigate();
  const [sent, setSent] = useState<string | null>(null);

  return (
    <PhoneShell>
      <AmbientBackdrop />
      <header className="flex items-center justify-between px-6 pt-8">
        <button
          onClick={() => nav({ to: "/home" })}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-[15px] font-semibold text-ink">Gift shop</h1>
        <span className="text-[12px] text-muted-ink">240 ✦</span>
      </header>

      <div className="px-6 pt-6">
        <h2 className="font-display text-[30px] leading-tight text-ink">
          A little something <span className="text-gradient-primary">for Kai</span>
        </h2>
        <p className="mt-2 text-[13.5px] text-muted-ink">
          Small surprises that land in their memories forever.
        </p>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3 px-6 pb-10">
        {gifts.map((g, i) => {
          const Icon = g.icon;
          return (
            <motion.button
              key={g.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSent(g.name);
                setTimeout(() => setSent(null), 1800);
              }}
              className="card-soft group rounded-[22px] p-4 text-left transition-shadow hover:shadow-float"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--pink-soft)]">
                <Icon className="h-6 w-6 text-[color:var(--primary)]" strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-ink">{g.name}</p>
              <span className="mt-1 inline-flex rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[color:var(--primary)] ring-1 ring-[color:var(--hairline)]">
                {g.price}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Sent confirmation */}
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-3 rounded-[28px] bg-white p-8 shadow-float"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.15, 1] }}
                transition={{ duration: 0.6 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-cta"
              >
                <Heart className="h-7 w-7 text-white" fill="white" />
              </motion.div>
              <p className="font-display text-[22px] text-ink">Sent with love</p>
              <p className="text-[13px] text-muted-ink">{sent} is on its way to Kai</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneShell>
  );
}
