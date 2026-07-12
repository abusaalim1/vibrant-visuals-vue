import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Bell, Palette, Shield, Check } from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { AmbientBackdrop } from "@/components/usora/Blobs";

export const Route = createFileRoute("/settings")({ component: Settings });

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifs", label: "Alerts", icon: Bell },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "privacy", label: "Privacy", icon: Shield },
] as const;

const THEMES = [
  { name: "Blush", colors: ["#FFF5F8", "#FF7CA3", "#FF4470"] },
  { name: "Peach", colors: ["#FFF3EC", "#FFAD87", "#FF6B4A"] },
  { name: "Lavender", colors: ["#F5F0FA", "#C9A0DC", "#9B72CF"] },
  { name: "Sage", colors: ["#F0F5EF", "#A8C0A0", "#5F8A6A"] },
];

function Settings() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");
  const [theme, setTheme] = useState("Blush");
  const [notifs, setNotifs] = useState({ daily: true, gift: true, streak: false });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);


  return (
    <PhoneShell>
      <AmbientBackdrop />
      <header className="relative flex items-center justify-between px-6 pt-8">
        <button
          onClick={() => nav({ to: "/profile" })}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-[13px] font-semibold text-ink">Settings</span>
        <span className="w-10" />
      </header>

      <div className="relative px-6 pt-6">
        <h1 className="font-display text-[32px] leading-tight text-ink">
          Make it <span className="text-gradient-primary">yours</span>
        </h1>
      </div>

      {/* Tabs */}
      <div className="relative mt-5 px-6">
        <div className="flex gap-1 rounded-full border border-[color:var(--hairline)] bg-white p-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative flex flex-1 items-center justify-center gap-1 py-2 text-[11.5px] font-semibold"
              >
                {active && (
                  <motion.span
                    layoutId="settings-tab"
                    className="absolute inset-0 rounded-full bg-gradient-primary shadow-cta"
                  />
                )}
                <Icon
                  className="relative z-10 h-3.5 w-3.5"
                  style={{ color: active ? "#fff" : "var(--muted-ink)" }}
                />
                <span
                  className="relative z-10"
                  style={{ color: active ? "#fff" : "var(--muted-ink)" }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="relative flex-1 px-6 pb-10 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "profile" && (
              <div className="space-y-3">
                {["Display name", "Email", "Anniversary"].map((label, i) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[color:var(--hairline)] bg-white p-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-ink">
                      {label}
                    </p>
                    <p className="mt-1 text-[15px] text-ink">
                      {["Aria Kapoor", "aria@usora.love", "12 May 2022"][i]}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {tab === "notifs" && (
              <div className="space-y-3">
                {[
                  { key: "daily", label: "Daily question reminder" },
                  { key: "gift", label: "When Kai sends a gift" },
                  { key: "streak", label: "Streak warnings" },
                ].map((n) => (
                  <div
                    key={n.key}
                    className="flex items-center justify-between rounded-2xl border border-[color:var(--hairline)] bg-white p-4"
                  >
                    <span className="text-[14px] text-ink">{n.label}</span>
                    <button
                      onClick={() =>
                        setNotifs((s) => ({ ...s, [n.key]: !s[n.key as keyof typeof s] }))
                      }
                      className={`relative h-6 w-11 rounded-full transition ${
                        notifs[n.key as keyof typeof notifs]
                          ? "bg-gradient-primary"
                          : "bg-[color:var(--hairline)]"
                      }`}
                    >
                      <motion.span
                        animate={{
                          x: notifs[n.key as keyof typeof notifs] ? 22 : 2,
                        }}
                        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {tab === "theme" && (
              <div>
                <p className="text-[13px] text-muted-ink">Pick a colour vibe. Applies across the app.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTheme(t.name)}
                      className={`relative rounded-[22px] border p-4 text-left transition active:scale-[0.97] ${
                        theme === t.name
                          ? "border-[color:var(--primary)] shadow-card"
                          : "border-[color:var(--hairline)] bg-white"
                      }`}
                    >
                      {theme === t.name && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                      )}
                      <div className="flex gap-1.5">
                        {t.colors.map((c) => (
                          <span
                            key={c}
                            className="h-8 w-8 rounded-full border border-white shadow-card"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-[14px] font-semibold text-ink">{t.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {tab === "privacy" && (
              <div className="space-y-3">
                {[
                  "Change password",
                  "Two-factor authentication",
                  "Download your data",
                  "Delete account",
                ].map((label) => (
                  <button
                    key={label}
                    className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--hairline)] bg-white p-4 text-left transition active:scale-[0.99]"
                  >
                    <span className="text-[14px] text-ink">{label}</span>
                    <span className="text-[color:var(--primary)]">→</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </PhoneShell>
  );
}
