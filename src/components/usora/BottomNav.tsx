import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, BookHeart, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/achievements", label: "Questions", icon: Sparkles },
  { to: "/memories", label: "Memories", icon: BookHeart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
      <div className="mx-auto flex max-w-[440px] items-center justify-around rounded-full border border-[color:var(--hairline)] bg-white/90 px-2 py-2 shadow-float backdrop-blur-xl">
        {tabs.map((t) => {
          const active = path === t.to || path.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="group relative flex flex-1 flex-col items-center gap-0.5 py-1.5"
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-x-3 inset-y-0 rounded-full bg-[color:var(--pink-soft)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                className="relative z-10 h-[22px] w-[22px] transition-colors"
                strokeWidth={active ? 2.2 : 1.75}
                style={{ color: active ? "var(--primary)" : "var(--muted-ink)" }}
                fill={active ? "rgba(255,77,121,0.14)" : "none"}
              />
              <span
                className="relative z-10 text-[10.5px] font-medium tracking-tight"
                style={{ color: active ? "var(--primary)" : "var(--muted-ink)" }}
              >
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
