"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav, { type AppView } from "@/components/layout/BottomNav";
import PromptView from "@/components/views/PromptView";
import WeekView from "@/components/views/WeekView";
import TasksView from "@/components/views/TasksView";
import SettingsView from "@/components/views/SettingsView";

type AuthStatus = "idle" | "connecting" | "connected";

interface ConnectionState {
  google: AuthStatus;
  ticktick: AuthStatus;
}

const VIEW_TITLES: Record<AppView, string> = {
  prompt: "Auto-Pilot",
  week: "This Week",
  tasks: "Tasks",
  settings: "Setup",
};

const VIEW_SUBTITLES: Record<AppView, string> = {
  prompt: "AI Scheduler",
  week: "7-day view",
  tasks: "TickTick queue",
  settings: "Configuration",
};

export default function HomePage() {
  const [activeView, setActiveView] = useState<AppView>("prompt");
  const [connections, setConnections] = useState<ConnectionState>({
    google: "idle",
    ticktick: "idle",
  });

  const handleConnect = (service: keyof ConnectionState) => {
    setConnections((prev) => ({ ...prev, [service]: "connecting" }));
    setTimeout(() => {
      setConnections((prev) => ({ ...prev, [service]: "connected" }));
    }, 1200);
  };

  const handleDisconnect = (service: keyof ConnectionState) => {
    setConnections((prev) => ({ ...prev, [service]: "idle" }));
  };

  return (
    <div className="flex flex-col min-h-dvh max-w-[430px] mx-auto w-full">
      <header className="flex-shrink-0 flex items-end justify-between px-5 pt-safe pt-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            <h1 className="text-lg font-semibold tracking-tight text-metallic">
              {VIEW_TITLES[activeView]}
            </h1>
            <p className="text-[11px] text-zinc-500 font-mono tracking-wider uppercase">
              {VIEW_SUBTITLES[activeView]}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-1.5">
          <ConnectionDot status={connections.google} label="G" />
          <ConnectionDot status={connections.ticktick} label="T" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === "prompt" && (
              <PromptView
                connections={connections}
                onConnect={handleConnect}
              />
            )}
            {activeView === "week" && <WeekView />}
            {activeView === "tasks" && <TasksView />}
            {activeView === "settings" && (
              <SettingsView
                connections={connections}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav active={activeView} onChange={setActiveView} />
    </div>
  );
}

function ConnectionDot({
  status,
  label,
}: {
  status: AuthStatus;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 glass-sm px-2 py-1.5 rounded-lg">
      <span className="font-mono text-[9px] text-zinc-600 uppercase">{label}</span>
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
          status === "connected"
            ? "bg-emerald-400"
            : status === "connecting"
            ? "bg-yellow-400 animate-pulse"
            : "bg-zinc-700"
        }`}
      />
    </div>
  );
}
