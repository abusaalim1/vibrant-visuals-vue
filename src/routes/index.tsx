import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AmbientBlobs } from "@/components/usora/Blobs";
import { PhoneShell } from "@/components/usora/PhoneShell";
import bearPandaWelcome from "@/assets/bear-panda-welcome.png";

function Heart({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7.5-4.6-9.6-9.1C.9 8.2 3.2 4 7.1 4c2 0 3.6 1.1 4.9 3 1.3-1.9 2.9-3 4.9-3 3.9 0 6.2 4.2 4.7 7.9C19.5 16.4 12 21 12 21z"
        fill="url(#hg)"
      />
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff9ab6" />
          <stop offset="100%" stopColor="#ff5f89" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Sparkle({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l1.8 6.4L20 10l-6.2 1.6L12 18l-1.8-6.4L4 10l6.2-1.6L12 2z" fill="#fff" opacity="0.95" />
    </svg>
  );
}

export const Route = createFileRoute("/")({
  component: Welcome,
});


function Welcome() {
  return (
    <PhoneShell>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-hero">
        <AmbientBlobs />

        {/* Hero visual: bear & panda welcoming */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pt-16">
          <div
            className="relative mb-10 h-80 w-full flex items-center justify-center"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
            }}
          >
            <motion.div
              aria-hidden
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute h-72 w-72 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,150,180,0.55) 0%, rgba(255,200,215,0.25) 45%, transparent 72%)",
                filter: "blur(8px)",
              }}
            />

            {/* Floating side hearts */}
            {[
              { side: "left", top: "8%", size: 22, delay: 0.2, x: -6 },
              { side: "left", top: "60%", size: 16, delay: 0.9, x: -10 },
              { side: "right", top: "14%", size: 20, delay: 0.5, x: 6 },
              { side: "right", top: "55%", size: 26, delay: 1.1, x: 10 },
            ].map((h, i) => (
              <motion.div
                key={i}
                aria-hidden
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 0.9, 0], y: [-4, -22, -34, -48], scale: [0.6, 1, 1, 0.8] }}
                transition={{ duration: 3.6, delay: h.delay, repeat: Infinity, ease: "easeOut" }}
                className="absolute"
                style={{
                  top: h.top,
                  [h.side]: "6%",
                  transform: `translateX(${h.x}px)`,
                }}
              >
                <Heart size={h.size} />
              </motion.div>
            ))}

            <motion.img
              src={bearPandaWelcome}
              alt="Bear and panda waving hello"
              draggable={false}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative z-10 h-80 w-auto animate-float-bob object-contain drop-shadow-[0_18px_28px_rgba(255,120,160,0.4)]"
            />
          </div>



          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="font-display text-center text-[44px] leading-[1.02] text-ink"
          >
            Answer together.
            <br />
            <span className="text-gradient-primary">Discover together.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-5 max-w-[300px] text-center text-[15px] leading-relaxed text-muted-ink"
          >
            A quiet, private space for the two of you — one gentle question a
            day, one closer conversation.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative z-10 flex flex-col items-center gap-3 px-8 pb-10"
        >
          <Link to="/auth" className="btn-primary w-full">
            Create your space <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
          <Link to="/invite" className="btn-ghost">
            Already have a code? Enter it here
          </Link>
        </motion.div>
      </div>
    </PhoneShell>
  );
}
