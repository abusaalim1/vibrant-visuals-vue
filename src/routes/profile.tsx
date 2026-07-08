import { createFileRoute, Link } from "@tanstack/react-router";
import { Menu, Bell, Settings, ChevronRight, LogOut, Music2, Palette } from "lucide-react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { BottomNav } from "@/components/usora/BottomNav";
import { AmbientBackdrop } from "@/components/usora/Blobs";
import { Mascot } from "@/components/usora/Mascot";


export const Route = createFileRoute("/profile")({ component: Profile });

const stats = [
  { label: "Questions", value: "128" },
  { label: "Day streak", value: "42" },
  { label: "Memories", value: "96" },
  { label: "Milestones", value: "4" },
];

function Profile() {
  return (
    <PhoneShell withNav>
      <AmbientBackdrop />
      <header className="relative flex items-center justify-between px-6 pt-8">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white">

          <Menu className="h-4 w-4" />
        </button>
        <span className="font-display text-[20px] text-ink">Usora</span>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[color:var(--primary)]" />
        </button>
      </header>

      {/* Couple hero */}
      <div className="relative mt-6 px-6">
        <div className="relative overflow-hidden rounded-[28px] border border-[color:var(--hairline)] bg-gradient-hero p-6 shadow-card">
          {/* subtle banner texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, rgba(255,150,180,0.35), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,200,215,0.4), transparent 50%), radial-gradient(circle at 70% 10%, rgba(255,255,255,0.6), transparent 40%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 2px, transparent 2px 8px)",
            }}
          />
          <div className="relative flex items-center gap-4">
            <div className="relative flex h-20 w-32 items-center">
              <div className="absolute left-0 top-0 rounded-full border-4 border-white shadow-card">
                <Mascot variant="left" size={64} />
              </div>
              <div className="absolute right-0 top-2 rounded-full border-4 border-white shadow-card">
                <Mascot variant="right" size={64} />
              </div>
            </div>
            <div>
              <p className="font-display text-[26px] leading-tight text-ink">
                Aria & Kai
              </p>
              <p className="text-[12.5px] text-muted-ink">Together since Feb 14, 2023</p>
              <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[color:var(--primary)] ring-1 ring-[color:var(--hairline)]">
                1,240 days together
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mt-4 grid grid-cols-4 gap-2 px-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[color:var(--hairline)] bg-white p-3 text-center shadow-card"
          >
            <p className="font-display text-[22px] leading-none text-ink">{s.value}</p>
            <p className="mt-1 text-[10.5px] font-medium text-muted-ink">{s.label}</p>
          </div>
        ))}
      </div>

      {/* About us */}
      <div className="relative mt-5 px-6">
        <div className="rounded-[24px] border border-[color:var(--hairline)] bg-white p-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-ink">
            About us
          </p>
          <div className="mt-3 space-y-3">
            <EditableRow label="Aria" value="Aria Mehra" />
            <EditableRow label="Kai" value="Kai Sharma" />
            <EditableRow
              label="Our tagline"
              value="Two quiet people, one loud love."
              italic
            />
          </div>
        </div>
      </div>

      {/* Your theme + song */}
      <div className="relative mt-4 grid grid-cols-2 gap-3 px-6">
        <div className="rounded-[22px] border border-[color:var(--hairline)] bg-white p-4 shadow-card">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-[color:var(--primary)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-ink">
              Your theme
            </p>
          </div>
          <p className="mt-2 text-[14px] font-semibold text-ink">Rose Petal</p>
          <div className="mt-3 flex gap-1.5">
            {["#ff4d79", "#ff9ab6", "#ffd0dc", "#fff5f8"].map((c) => (
              <span
                key={c}
                className="h-5 w-5 rounded-full ring-2 ring-white"
                style={{ background: c, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-[22px] border border-[color:var(--hairline)] bg-white p-4 shadow-card">
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-[color:var(--primary)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-ink">
              Your song
            </p>
          </div>
          <p className="mt-2 text-[14px] font-semibold text-ink leading-tight">Sunflower</p>
          <p className="text-[11.5px] text-muted-ink">Post Malone · Swae Lee</p>
          <div className="mt-2 flex items-end gap-0.5">
            {[6, 10, 14, 8, 12, 16, 9, 11, 7].map((h, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-gradient-primary"
                style={{ height: h }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="relative mt-4 space-y-2 px-6">
        <MenuLink icon={Settings} label="Settings & theme" />

        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl border border-[color:var(--hairline)] bg-white p-4 text-[14px] font-medium text-ink transition active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4 text-[color:var(--primary)]" />
          Sign out
          <ChevronRight className="ml-auto h-4 w-4 text-muted-ink" />
        </Link>
      </div>

      <BottomNav />
    </PhoneShell>
  );
}

function EditableRow({
  label,
  value,
  italic,
}: {
  label: string;
  value: string;
  italic?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[color:var(--hairline)] pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-ink">
          {label}
        </p>
        <p
          className={`mt-0.5 text-[14px] text-ink ${italic ? "font-display text-[16px]" : ""}`}
        >
          {value}
        </p>
      </div>
      <button className="text-[12px] font-semibold text-[color:var(--primary)]">
        Edit
      </button>
    </div>
  );
}

function MenuLink({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-[color:var(--hairline)] bg-white p-4 text-[14px] font-medium text-ink transition active:scale-[0.98]">
      <Icon className="h-4 w-4 text-[color:var(--primary)]" />
      {label}
      <ChevronRight className="ml-auto h-4 w-4 text-muted-ink" />
    </button>
  );
}
