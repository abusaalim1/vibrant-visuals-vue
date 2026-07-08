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
      <div className="mt-6 px-6">
        <div className="relative overflow-hidden rounded-[28px] border border-[color:var(--hairline)] bg-gradient-hero p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-32">
              <div
                className="absolute left-0 top-1 h-16 w-16 rounded-full border-4 border-white"
                style={{ background: "linear-gradient(135deg,#ffd8e2,#ff9ab6)" }}
              />
              <div
                className="absolute right-0 top-3 h-16 w-16 rounded-full border-4 border-white"
                style={{ background: "linear-gradient(135deg,#ffc3d4,#ff6f95)" }}
              />
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
      <div className="mt-4 grid grid-cols-4 gap-2 px-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[color:var(--hairline)] bg-white p-3 text-center"
          >
            <p className="font-display text-[22px] leading-none text-ink">{s.value}</p>
            <p className="mt-1 text-[10.5px] font-medium text-muted-ink">{s.label}</p>
          </div>
        ))}
      </div>

      {/* About us */}
      <div className="mt-5 px-6">
        <div className="rounded-[24px] border border-[color:var(--hairline)] bg-white p-5">
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

      {/* Menu */}
      <div className="mt-4 space-y-2 px-6">
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
