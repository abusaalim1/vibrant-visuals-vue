import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AmbientBlobs } from "@/components/usora/Blobs";
import { PhoneShell } from "@/components/usora/PhoneShell";
import bearPandaWelcome from "@/assets/bear-panda-welcome.png";

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
          <div className="relative mb-10 h-64 w-full flex items-center justify-center">
            <motion.div
              aria-hidden
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute h-56 w-56 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,180,200,0.55) 0%, rgba(255,200,215,0.25) 45%, transparent 72%)",
                filter: "blur(6px)",
              }}
            />
            <motion.img
              src={bearPandaWelcome}
              alt="Bear and panda waving hello"
              draggable={false}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative z-10 h-64 w-auto animate-float-bob object-contain drop-shadow-[0_12px_24px_rgba(255,120,160,0.35)]"
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
