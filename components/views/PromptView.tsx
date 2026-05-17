"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, Calendar, CheckSquare } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import MetallicButton from "@/components/ui/MetallicButton";
import StatusConsole, { type LogLine } from "@/components/ui/StatusConsole";

const PLACEHOLDER_PROMPTS = [
  "Keep mornings light. Front-load deep work to Tuesday and Wednesday. No tasks after 5 PM on Friday.",
  "Block 2 hours daily for focus work. Cluster meetings on Monday. Keep Thursday afternoon free.",
  "Prioritize coding tasks first. Spread admin tasks across the week. No work before 9 AM.",
];

type AuthStatus = "idle" | "connecting" | "connected";

interface ConnectionState {
  google: AuthStatus;
  ticktick: AuthStatus;
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 28 },
  },
};

interface PromptViewProps {
  connections: ConnectionState;
  onConnect: (service: keyof ConnectionState) => void;
}

export default function PromptView({ connections, onConnect }: PromptViewProps) {
  const [prompt, setPrompt] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([
    { status: "idle", text: "Waiting for connections..." },
  ]);

  const allConnected =
    connections.google === "connected" && connections.ticktick === "connected";

  const addLog = (line: LogLine) =>
    setLogs((prev) => [...prev.slice(-6), line]);

  const handleSchedule = async () => {
    if (!prompt.trim() || !allConnected) return;
    setIsScheduling(true);
    setLogs([]);
    addLog({ status: "working", text: "Fetching Google Calendar events..." });
    await delay(900);
    addLog({ status: "ok", text: "Found 14 existing events this week" });
    addLog({ status: "working", text: "Pulling tasks from TickTick..." });
    await delay(800);
    addLog({ status: "ok", text: "Loaded 11 unscheduled tasks" });
    addLog({ status: "working", text: "Sending to Claude AI engine..." });
    await delay(1400);
    addLog({ status: "ok", text: "Schedule generated — 11 blocks planned" });
    addLog({ status: "working", text: "Pushing to Google Calendar..." });
    await delay(900);
    addLog({ status: "ok", text: "Done! Check your Week view." });
    setIsScheduling(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
      className="flex flex-col gap-4"
    >
      <AnimatePresence>
        {!allConnected && (
          <motion.div
            key="auth"
            variants={ITEM_VARIANTS}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            className="flex flex-col gap-3"
          >
            <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase px-1">
              Connect your tools
            </p>
            <AuthCard
              icon={<Calendar size={16} />}
              label="Google Calendar"
              description="Read events & create time blocks"
              status={connections.google}
              onConnect={() => onConnect("google")}
            />
            <AuthCard
              icon={<CheckSquare size={16} />}
              label="TickTick"
              description="Pull unscheduled tasks"
              status={connections.ticktick}
              onConnect={() => onConnect("ticktick")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={ITEM_VARIANTS}>
        <GlassPanel variant="bordered" className="p-1 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} className="text-zinc-400" />
              <span className="text-[11px] font-mono text-zinc-400 tracking-widest uppercase">
                Prompt Room
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={PLACEHOLDER_PROMPTS[0]}
              rows={5}
              className="w-full bg-transparent text-white/90 text-sm leading-relaxed resize-none outline-none placeholder:text-zinc-600 font-sans"
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
              <span className="font-mono text-[10px] text-zinc-600">
                {prompt.length} chars
              </span>
              <MetallicButton
                size="sm"
                onClick={handleSchedule}
                disabled={!prompt.trim() || !allConnected}
                isLoading={isScheduling}
              >
                {isScheduling ? "Scheduling" : "Run Auto-Pilot"}
                {!isScheduling && <ChevronRight size={14} />}
              </MetallicButton>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div variants={ITEM_VARIANTS}>
        <StatusConsole lines={logs} />
      </motion.div>
    </motion.div>
  );
}

function AuthCard({
  icon,
  label,
  description,
  status,
  onConnect,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  status: AuthStatus;
  onConnect: () => void;
}) {
  const isConnected = status === "connected";
  return (
    <GlassPanel variant="sm" className="flex items-center gap-4 p-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.06] border border-white/[0.08] text-zinc-300 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90 truncate">{label}</p>
        <p className="text-[11px] text-zinc-500 truncate">{description}</p>
      </div>
      <MetallicButton
        variant={isConnected ? "ghost" : "primary"}
        size="sm"
        onClick={onConnect}
        disabled={isConnected}
        isLoading={status === "connecting"}
        className="flex-shrink-0"
      >
        {isConnected ? "Connected" : "Connect"}
      </MetallicButton>
    </GlassPanel>
  );
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
