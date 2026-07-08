import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AmbientBlobs } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";
import { PhoneShell } from "@/components/usora/PhoneShell";

export const Route = createFileRoute("/")({
  component: Welcome,
});

function Welcome() {
  return (
    <PhoneShell>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-hero">
        <AmbientBlobs />

        {/* Hero visual: two overlapping soft circles */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pt-16">
          <div className="relative mb-10 h-64 w-64">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute left-0 top-6 h-40 w-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #ffd8e2, #ff98b6 90%)",
                boxShadow: "0 20px 40px -20px rgba(255,68,112,0.5)",
              }}
            />
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute right-0 top-16 h-40 w-40 rounded-full mix-blend-multiply"
              style={{
                background:
                  "radial-gradient(circle at 70% 30%, #ffc3d4, #ff6f95 90%)",
                boxShadow: "0 20px 40px -20px rgba(255,68,112,0.5)",
              }}
            />
            <Mascot
              variant="left"
              size={72}
              className="absolute -bottom-2 left-6"
            />
            <Mascot
              variant="right"
              size={72}
              className="absolute -bottom-2 right-6"
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
