import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  withNav?: boolean;
  className?: string;
};

export function PhoneShell({ children, withNav, className = "" }: Props) {
  return (
    <div className="min-h-[100dvh] w-full bg-background">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className={`relative mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col ${
          withNav ? "pb-28" : ""
        } ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
