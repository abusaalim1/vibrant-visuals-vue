import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase, type Notification } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) {
      console.warn("[notifications] load failed:", error.message);
      return;
    }
    setItems((data ?? []) as Notification[]);
  };

  useEffect(() => {
    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const unread = items.filter((n) => !n.read).length;

  const markRead = async (n: Notification) => {
    if (n.read) return;
    setItems((prev) =>
      prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)),
    );
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", n.id);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white"
      >
        <Bell className="h-5 w-5 text-ink" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--primary)] px-1 text-[9.5px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="card-soft absolute right-0 top-12 z-50 w-[300px] rounded-[22px] p-3"
          >
            <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-ink">
              Notifications
            </div>
            <div className="max-h-[360px] space-y-1 overflow-y-auto">
              {items.length === 0 && (
                <p className="px-2 py-6 text-center text-[13px] text-muted-ink">
                  You're all caught up ✨
                </p>
              )}
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n)}
                  className={`flex w-full items-start gap-2 rounded-2xl px-3 py-2.5 text-left transition ${
                    n.read ? "" : "bg-[color:var(--pink-soft)]"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                      n.read ? "bg-transparent" : "bg-[color:var(--primary)]"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[13.5px] leading-snug text-ink ${
                        n.read ? "font-medium" : "font-semibold"
                      }`}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted-ink">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10.5px] text-muted-ink">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
