import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AmbientBlobs } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";
import { PhoneShell } from "@/components/usora/PhoneShell";
import bearPandaHug from "@/assets/bear-panda-hug.png";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

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
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const nav = useNavigate();
  const { user, profile, loading, refresh } = useAuth();

  // If already logged in, jump to the right place.
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (!profile?.full_name) nav({ to: "/onboarding" });
    else nav({ to: "/home" });
  }, [loading, user, profile, nav]);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !pw) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your name.");
          setBusy(false);
          return;
        }
        const { data, error: sErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: pw,
          options: {
            emailRedirectTo:
              typeof window !== "undefined" ? window.location.origin : undefined,
            data: { name: name.trim() || null },
          },
        });
        if (sErr) throw sErr;
        // Create users row keyed by email
        if (data.user) {
          const { error: insErr } = await supabase.from("users").insert({
            email: email.trim(),
            name: name.trim() || null,
          });
          if (insErr && !`${insErr.message}`.toLowerCase().includes("duplicate")) {
            console.error("[auth] insert users failed:", insErr);
          }
        }
        // If Supabase requires email confirmation, there's no session yet.
        if (!data.session) {
          setPendingVerifyEmail(email.trim());
          return;
        }
        await refresh();
        nav({ to: "/onboarding" });
      } else {
        const { error: sErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pw,
        });
        if (sErr) throw sErr;
        await refresh();
        // Redirect handled by effect above once profile hydrates.
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to continue.";
      console.error("[auth] submit failed:", e);
      setError(prettifyAuthError(msg));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!pendingVerifyEmail) return;
    setResendMsg(null);
    try {
      const { error: rErr } = await supabase.auth.resend({
        type: "signup",
        email: pendingVerifyEmail,
      });
      if (rErr) throw rErr;
      setResendMsg("Verification email sent again.");
    } catch (e) {
      console.error("[auth] resend failed:", e);
      setResendMsg(e instanceof Error ? e.message : "Couldn't resend right now.");
    }
  };

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
            {pendingVerifyEmail ? (
              <>
                <h1 className="font-display text-[34px] leading-[1.05] text-ink">
                  Check your <span className="text-gradient-primary">email</span>
                </h1>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-ink">
                  We sent a verification link to{" "}
                  <span className="font-semibold text-ink">{pendingVerifyEmail}</span>.
                  Please tap it, then come back here — we'll take you into your space
                  automatically.
                </p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative mx-auto mt-6 flex h-32 w-full items-center justify-center"
                >
                  <div
                    className="absolute inset-0 mx-auto h-32 w-32 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 55%, rgba(255,150,180,0.45) 0%, rgba(255,180,200,0.18) 45%, transparent 72%)",
                      filter: "blur(6px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                  <img
                    src={bearPandaHug}
                    alt=""
                    className="relative z-10 h-32 w-auto animate-float-bob object-contain drop-shadow-[0_10px_20px_rgba(255,120,160,0.35)]"
                    draggable={false}
                  />
                </motion.div>

                {resendMsg && (
                  <p className="mt-4 rounded-2xl bg-[color:var(--pink-soft)] px-3 py-2 text-[12.5px] text-[color:var(--primary)]">
                    {resendMsg}
                  </p>
                )}

                <button onClick={resend} className="btn-secondary mt-6 w-full">
                  Resend verification email
                </button>
                <button
                  onClick={() => {
                    setPendingVerifyEmail(null);
                    setResendMsg(null);
                    setMode("signin");
                  }}
                  className="mt-3 w-full text-center text-[13px] text-muted-ink"
                >
                  Use a different email
                </button>
              </>
            ) : (
              <>
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

                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                  className="relative mx-auto mt-5 flex h-40 w-full items-center justify-center"
                >
                  <div
                    className="absolute inset-0 mx-auto h-40 w-40 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 55%, rgba(255,150,180,0.45) 0%, rgba(255,180,200,0.18) 45%, transparent 72%)",
                      filter: "blur(6px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                  <img
                    src={bearPandaHug}
                    alt="Bear and panda hugging"
                    className="relative z-10 h-40 w-auto animate-float-bob object-contain drop-shadow-[0_10px_20px_rgba(255,120,160,0.35)]"
                    draggable={false}
                  />
                </motion.div>

                <div className="mt-6 space-y-2">
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

                {error && (
                  <p className="mt-4 rounded-2xl bg-[color:var(--pink-soft)] px-3 py-2 text-[12.5px] text-[color:var(--primary)]">
                    {error}
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={busy}
                  className="btn-primary mt-6 w-full disabled:opacity-60"
                >
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </button>

                <p className="mt-6 text-center text-[13px] text-muted-ink">
                  {mode === "signin" ? "New to Usora?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setError(null);
                      setMode(mode === "signin" ? "signup" : "signin");
                    }}
                    className="font-semibold text-[color:var(--primary)]"
                  >
                    {mode === "signin" ? "Create account" : "Sign in"}
                  </button>
                </p>
              </>
            )}
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

function prettifyAuthError(m: string): string {
  const low = m.toLowerCase();
  if (low.includes("invalid login")) return "Wrong email or password.";
  if (low.includes("already registered") || low.includes("already exists"))
    return "This email is already registered. Try signing in.";
  if (low.includes("password") && low.includes("6"))
    return "Password must be at least 6 characters.";
  if (low.includes("weak")) return "That password is too weak.";
  return m;
}
