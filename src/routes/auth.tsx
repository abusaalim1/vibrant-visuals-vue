import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AmbientBlobs } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";
import { PhoneShell } from "@/components/usora/PhoneShell";

export const Route = createFileRoute("/auth")({
  component: Auth,
  head: () => ({ meta: [{ title: "Sign in — Usora AI" }] }),
});

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focus, setFocus] = useState(false);
  const active = focus || value.length > 0;
  return (
    <label className="relative block">
      <span
        className="pointer-events-none absolute left-0 origin-left transition-all duration-200"
        style={{
          top: active ? 0 : 22,
          fontSize: active ? 11 : 15,
          color: focus ? "var(--primary)" : "var(--muted-ink)",
          letterSpacing: active ? "0.04em" : "0",
          textTransform: active ? "uppercase" : "none",
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => onChange(e.target.value)}
        className="field-underline"
      />
    </label>
  );
}

function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const nav = useNavigate();

  return (
    <PhoneShell>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <AmbientBlobs />

        <Mascot
          variant="right"
          size={78}
          className="absolute right-4 top-6 z-10 opacity-90"
        />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-sm rounded-[28px] border border-[color:var(--hairline)] bg-white/85 p-7 shadow-float backdrop-blur-2xl"
          >
            <h1 className="font-display text-[38px] leading-[1.05] text-ink">
              {mode === "signin" ? (
                <>Welcome back <span className="text-gradient-primary">to us</span></>
              ) : (
                <>Begin your <span className="text-gradient-primary">shared story</span></>
              )}
            </h1>
            <p className="mt-2 text-[13.5px] text-muted-ink">
              {mode === "signin"
                ? "Sign in to continue where you left off."
                : "Create an account — invite your partner in a moment."}
            </p>

            <div className="mt-8 space-y-2">
              <AnimatePresence mode="popLayout">
                {mode === "signup" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 56 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Field label="Your name" value={name} onChange={setName} />
                  </motion.div>
                )}
              </AnimatePresence>
              <Field label="Email" type="email" value={email} onChange={setEmail} />
              <Field label="Password" type="password" value={pw} onChange={setPw} />
            </div>

            <button
              onClick={() => nav({ to: "/invite" })}
              className="btn-primary mt-8 w-full"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </button>

            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-ink">
              <span className="h-px flex-1 bg-[color:var(--hairline)]" />
              or
              <span className="h-px flex-1 bg-[color:var(--hairline)]" />
            </div>

            <button className="btn-secondary w-full">
              <GoogleIcon /> Continue with Google
            </button>

            <p className="mt-6 text-center text-[13px] text-muted-ink">
              {mode === "signin" ? "New to Usora?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-semibold text-[color:var(--primary)]"
              >
                {mode === "signin" ? "Create account" : "Sign in"}
              </button>
            </p>
          </motion.div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-[13px] text-muted-ink">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.7 2.7 30.2.5 24 .5 14.8.5 6.9 5.8 3.1 13.4l7.9 6.1C12.8 13.5 17.9 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.2 7.1-17.6z"/>
      <path fill="#FBBC05" d="M11 28.5c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-7.9-6.1C1.5 16.7.5 20.2.5 24s1 7.3 2.6 10.6l7.9-6.1z"/>
      <path fill="#34A853" d="M24 47.5c6.2 0 11.4-2 15.2-5.5l-7.6-5.9c-2.1 1.4-4.8 2.3-7.6 2.3-6.1 0-11.2-4-13-9.5l-7.9 6.1C6.9 42.2 14.8 47.5 24 47.5z"/>
    </svg>
  );
}
