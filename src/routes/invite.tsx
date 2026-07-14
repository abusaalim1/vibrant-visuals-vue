import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { AmbientBlobs } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { useAuth } from "@/lib/auth";
import { supabase, generateInviteCode } from "@/lib/supabase";

export const Route = createFileRoute("/invite")({ component: Invite });

const PENDING_KEY = "usora.pendingInvite";

function readQueryCode(): string | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const c = (p.get("code") || p.get("invite") || "").trim().toUpperCase();
  return c || null;
}

function Invite() {
  const [copied, setCopied] = useState(false);
  const [partnerCode, setPartnerCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [localCode, setLocalCode] = useState<string | null>(null);
  const nav = useNavigate();
  const { user, profile, couple, loading, refresh } = useAuth();

  // If a code is present in the URL, persist it and route unauthenticated
  // users to sign-in before letting them join.
  useEffect(() => {
    if (loading) return;
    const urlCode = readQueryCode();
    if (urlCode && typeof window !== "undefined") {
      window.localStorage.setItem(PENDING_KEY, urlCode);
    }
    if (!user) {
      nav({ to: "/auth" });
      return;
    }
    if (!profile?.full_name) {
      nav({ to: "/onboarding" });
      return;
    }
    // Autofill any pending code so the user just taps join.
    const pending =
      typeof window !== "undefined"
        ? window.localStorage.getItem(PENDING_KEY)
        : null;
    if (pending && !partnerCode) setPartnerCode(pending);
  }, [loading, user, profile, nav, partnerCode]);

  useEffect(() => {
    if (couple?.connected_at) {
      if (typeof window !== "undefined")
        window.localStorage.removeItem(PENDING_KEY);
      nav({ to: "/home" });
    }
  }, [couple, nav]);

  // Ensure a couples row exists for this user. If none, create one with a
  // freshly generated invite code so the user can share immediately.
  useEffect(() => {
    if (loading || !user || !profile?.full_name) return;
    if (couple) {
      console.log("[invite] existing couple from auth:", couple);
      return;
    }
    let cancelled = false;
    setCreating(true);
    (async () => {
      console.log("[invite] current auth user.id:", user.id);
      const { data: existing, error: exErr } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .maybeSingle();
      console.log("[invite] existing couples lookup:", { existing, exErr });
      if (cancelled) return;
      if (exErr) {
        setCreateError(exErr.message);
        setCreating(false);
        return;
      }
      if (existing) {
        await refresh();
        setCreating(false);
        return;
      }
      let lastErr: string | null = null;
      for (let i = 0; i < 5; i++) {
        const code = generateInviteCode();
        const { data: dupe } = await supabase
          .from("couples")
          .select("id")
          .eq("invite_code", code)
          .maybeSingle();
        if (dupe) continue;
        const { data: inserted, error: insErr } = await supabase
          .from("couples")
          .insert({
            invite_code: code,
            user1_id: user.id,
            user2_id: null,
          })
          .select()
          .maybeSingle();
        console.log("[invite] insert couples result:", { inserted, insErr, code });
        if (!insErr) {
          lastErr = null;
          setLocalCode(code);
          break;
        }
        lastErr = insErr.message;
        if (!/duplicate|unique/i.test(insErr.message)) {
          console.error("[invite] auto-create couple failed:", insErr);
          break;
        }
      }
      if (!cancelled) {
        if (lastErr) setCreateError(lastErr);
        await refresh();
        setCreating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, user, profile, couple, refresh]);

  // Live update when partner joins: subscribe to couples row and refresh.
  useEffect(() => {
    if (!couple?.id) return;
    const ch = supabase
      .channel(`couples:${couple.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "couples",
          filter: `id=eq.${couple.id}`,
        },
        () => {
          refresh();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [couple?.id, refresh]);


  const code = couple?.invite_code ?? localCode ?? "";
  console.log("[invite] rendering code:", code, "couple:", couple?.id, "localCode:", localCode);

  const doCopy = async () => {
    if (!code) {
      console.warn("[invite] copy attempted with empty code");
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error("[invite] copy failed:", e);
    }
  };

  const join = async () => {
    setError(null);
    const c = partnerCode.trim().toUpperCase();
    if (!c) return;
    if (!user) return;
    if (couple && c === couple.invite_code) {
      setError("You can't use your own code.");
      return;
    }
    setJoining(true);
    try {
      const { data: match, error: qErr } = await supabase
        .from("couples")
        .select("*")
        .eq("invite_code", c)
        .maybeSingle();
      if (qErr) throw qErr;
      if (!match) {
        setError("Invalid code, please check and try again.");
        return;
      }
      if (match.user1_id === user.id) {
        setError("You can't use your own code.");
        return;
      }
      if (match.user2_id) {
        setError("This code has already been used.");
        return;
      }
      const { error: uErr } = await supabase
        .from("couples")
        .update({ user2_id: user.id, connected_at: new Date().toISOString() })
        .eq("id", match.id);
      if (uErr) throw uErr;

      // Notify the code-sharer (user1) that their partner joined.
      try {
        const joinerName =
          profile?.full_name || profile?.name || "Your partner";
        await supabase.from("notifications").insert({
          user_id: match.user1_id,
          type: "partner_joined",
          title: "You're connected!",
          message: `${joinerName} joined using your invite code`,
          related_user_name: joinerName,
          read: false,
        });
      } catch (nErr) {
        console.warn("[invite] notification insert failed:", nErr);
      }

      if (typeof window !== "undefined")
        window.localStorage.removeItem(PENDING_KEY);
      await refresh();
      nav({ to: "/home" });
    } catch (e) {
      console.error("[invite] join failed:", e);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <PhoneShell>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-hero">
        <AmbientBlobs />

        <header className="relative z-10 flex items-center justify-between px-6 pt-8">
          <Link to="/" className="text-[13px] text-muted-ink">← Back</Link>
          <span className="text-[12px] uppercase tracking-[0.18em] text-muted-ink">
            Step 2 of 2
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
                {code
                  ? code
                  : creating
                    ? "…"
                    : "······"}
              </span>
            </div>
            {createError && (
              <p className="mt-3 rounded-2xl bg-[color:var(--pink-soft)] px-3 py-2 text-[12px] text-[color:var(--primary)]">
                Couldn't generate a code: {createError}
              </p>
            )}
            <button
              onClick={doCopy}
              disabled={!code}
              className="btn-secondary mx-auto mt-6 disabled:opacity-50"
              aria-label="Copy code"
            >
              {copied ? (
                <><Check className="h-4 w-4" /> Copied</>
              ) : (
                <><Copy className="h-4 w-4" /> Copy code</>
              )}
            </button>

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
                placeholder="e.g. AB12CD"
                className="flex-1 rounded-full border border-[color:var(--hairline)] bg-white px-4 py-3 text-[15px] tracking-widest text-ink outline-none transition focus:border-[color:var(--primary)]"
              />
              <button
                onClick={join}
                disabled={joining}
                className="btn-primary !px-5 !py-3 disabled:opacity-60"
                aria-label="Join"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {error && (
              <p className="mt-3 rounded-2xl bg-[color:var(--pink-soft)] px-3 py-2 text-[12.5px] text-[color:var(--primary)]">
                {error}
              </p>
            )}
          </div>

          <div className="mt-8 flex w-full items-end justify-between">
            <Mascot variant="left" size={72} />
            <button onClick={() => nav({ to: "/home" })} className="btn-ghost">
              Skip for now →
            </button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
