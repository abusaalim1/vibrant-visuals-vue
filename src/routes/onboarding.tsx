import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AmbientBlobs } from "@/components/usora/Blobs";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { useAuth } from "@/lib/auth";
import { supabase, generateInviteCode } from "@/lib/supabase";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Tell us about you — Usora AI" }] }),
});

function Onboarding() {
  const nav = useNavigate();
  const { user, profile, loading, refresh } = useAuth();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [metStory, setMetStory] = useState("");
  const [interests, setInterests] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      nav({ to: "/auth" });
      return;
    }
    if (profile?.full_name) {
      nav({ to: "/home" });
    }
  }, [loading, user, profile, nav]);

  const submit = async () => {
    if (!user?.email || !user?.id) return;
    if (!fullName.trim() || !age || !partnerName.trim() || !startDate) {
      setError("Please fill in the required fields.");
      return;
    }
    const ageNum = Number(age);
    if (!Number.isFinite(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError("Please enter a valid age.");
      return;
    }
    const parsedDate = new Date(startDate);
    if (Number.isNaN(parsedDate.getTime())) {
      setError("Please pick a valid start date.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        email: user.email,
        full_name: fullName.trim(),
        name: fullName.trim(),
        age: ageNum,
        partner_name_label: partnerName.trim(),
        relationship_start_date: parsedDate.toISOString(),
        met_story: metStory.trim() || null,
        interests: interests.trim() || null,
      };

      // Try update; if no row matched, insert one.
      const { data: updated, error: upErr } = await supabase
        .from("users")
        .update(payload)
        .eq("email", user.email)
        .select("id");
      if (upErr) {
        console.error("[onboarding] update users failed:", upErr);
        throw upErr;
      }
      if (!updated || updated.length === 0) {
        const { error: insErr } = await supabase.from("users").insert(payload);
        if (insErr) {
          console.error("[onboarding] insert users failed:", insErr);
          throw insErr;
        }
      }

      // Create couples row with invite code if user doesn't already have one
      const { data: existing, error: exErr } = await supabase
        .from("couples")
        .select("id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .maybeSingle();
      if (exErr) {
        console.error("[onboarding] fetch couple failed:", exErr);
      }
      if (!existing) {
        const code = generateInviteCode();
        const { error: cErr } = await supabase.from("couples").insert({
          invite_code: code,
          user1_id: user.id,
          user2_id: null,
        });
        if (cErr) {
          console.error("[onboarding] insert couple failed:", cErr);
          throw cErr;
        }
      }
      await refresh();
      nav({ to: "/invite" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      console.error("[onboarding] submit failed:", e);
      setError(msg || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PhoneShell>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-hero">
        <AmbientBlobs />
        <div className="relative z-10 flex flex-1 flex-col px-6 pt-10 pb-10">
          <h1 className="font-display text-[36px] leading-[1.05] text-ink">
            A little <span className="text-gradient-primary">about you</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-muted-ink">
            This helps us personalize your space with your partner.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-4 rounded-[24px] border border-[color:var(--hairline)] bg-white/90 p-5 shadow-float backdrop-blur"
          >
            <Field label="Your full name" value={fullName} onChange={setFullName} />
            <Field
              label="Age"
              type="number"
              value={age}
              onChange={setAge}
            />
            <Field
              label="Partner's name"
              value={partnerName}
              onChange={setPartnerName}
            />
            <Field
              label="Relationship start date"
              type="date"
              value={startDate}
              onChange={setStartDate}
            />
            <Field
              label="How you met (optional)"
              value={metStory}
              onChange={setMetStory}
            />
            <Field
              label="Shared interests (comma-separated, optional)"
              value={interests}
              onChange={setInterests}
            />

            {error && (
              <p className="rounded-2xl bg-[color:var(--pink-soft)] px-3 py-2 text-[12.5px] text-[color:var(--primary)]">
                {error}
              </p>
            )}

            <button
              onClick={submit}
              disabled={saving}
              className="btn-primary mt-2 w-full disabled:opacity-60"
            >
              {saving ? "Saving…" : "Continue"}
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </motion.div>
        </div>
      </div>
    </PhoneShell>
  );
}

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
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-ink">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-2xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-[14.5px] text-ink outline-none transition focus:border-[color:var(--primary)]"
      />
    </label>
  );
}
