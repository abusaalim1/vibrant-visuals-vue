import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { AmbientBlobs } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";
import { PhoneShell } from "@/components/usora/PhoneShell";

export const Route = createFileRoute("/invite")({ component: Invite });

const CODE = "LV-8H2K";

function Invite() {
  const [copied, setCopied] = useState(false);
  const [partnerCode, setPartnerCode] = useState("");
  const nav = useNavigate();

  const doCopy = async () => {
    await navigator.clipboard?.writeText(CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <PhoneShell>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-hero">
        <AmbientBlobs />

        <header className="relative z-10 flex items-center justify-between px-6 pt-8">
          <Link to="/" className="text-[13px] text-muted-ink">← Back</Link>
          <span className="text-[12px] uppercase tracking-[0.18em] text-muted-ink">
            Step 1 of 2
          </span>
        </header>

        <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-6">
          <h1 className="font-display text-center text-[36px] leading-tight text-ink">
            Invite your <span className="text-gradient-primary">other half</span>
          </h1>
          <p className="mt-2 max-w-xs text-center text-[14px] text-muted-ink">
            Share this code with your partner — you'll be connected the moment
            they enter it.
          </p>

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="card-soft mt-8 w-full rounded-[28px] p-7 text-center"
          >
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-ink">
              Your invite code
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="font-display text-[52px] tracking-[0.08em] text-ink">
                {CODE}
              </span>
            </div>
            <button
              onClick={doCopy}
              className="btn-secondary mx-auto mt-6"
              aria-label="Copy code"
            >
              {copied ? (
                <><Check className="h-4 w-4" /> Copied</>
              ) : (
                <><Copy className="h-4 w-4" /> Copy code</>
              )}
            </button>

            {/* Pulse: waiting for partner */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--primary)] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--primary)]" />
              </span>
              <span className="text-[13px] text-muted-ink">
                Waiting for your partner to join…
              </span>
            </div>
          </motion.div>

          <div className="my-6 flex w-full items-center gap-3 text-[11px] uppercase tracking-widest text-muted-ink">
            <span className="h-px flex-1 bg-[color:var(--hairline)]" />
            or
            <span className="h-px flex-1 bg-[color:var(--hairline)]" />
          </div>

          <div className="card-soft w-full rounded-[24px] p-5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-ink">
              Enter partner's code
            </label>
            <div className="mt-3 flex items-center gap-2">
              <input
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                placeholder="e.g. LV-8H2K"
                className="flex-1 rounded-full border border-[color:var(--hairline)] bg-white px-4 py-3 text-[15px] tracking-widest text-ink outline-none transition focus:border-[color:var(--primary)]"
              />
              <button
                onClick={() => nav({ to: "/home" })}
                className="btn-primary !px-5 !py-3"
                aria-label="Join"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex w-full items-end justify-between">
            <Mascot variant="left" size={72} />
            <button
              onClick={() => nav({ to: "/home" })}
              className="btn-ghost"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
