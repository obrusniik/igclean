"use client";

import { motion } from "framer-motion";
import { Zap, CalendarDays, ListTodo, Settings } from "lucide-react";
import { clsx } from "clsx";

export type AppView = "prompt" | "week" | "tasks" | "settings";

const TABS: { id: AppView; label: string; icon: React.ReactNode }[] = [
  { id: "prompt", label: "Pilot", icon: <Zap size={18} /> },
  { id: "week", label: "Week", icon: <CalendarDays size={18} /> },
  { id: "tasks", label: "Tasks", icon: <ListTodo size={18} /> },
  { id: "settings", label: "Setup", icon: <Settings size={18} /> },
];

interface BottomNavProps {
  active: AppView;
  onChange: (view: AppView) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="w-full max-w-[430px] px-4 pb-4">
        <div className="glass flex items-center justify-around px-2 py-2 rounded-2xl">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
                aria-label={tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={clsx(
                    "relative z-10 transition-all duration-200",
                    isActive ? "text-metallic" : "text-zinc-500"
                  )}
                  style={
                    isActive
                      ? { filter: "drop-shadow(0 0 6px rgba(255,255,255,0.25))" }
                      : {}
                  }
                >
                  {tab.icon}
                </span>
                <span
                  className={clsx(
                    "relative z-10 font-mono text-[9px] tracking-widest uppercase transition-colors duration-200",
                    isActive ? "text-white/70" : "text-zinc-600"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
