"use client";

import { motion } from "framer-motion";
import { Calendar, CheckSquare, Brain, ChevronRight, LogOut } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { clsx } from "clsx";

type AuthStatus = "idle" | "connecting" | "connected";

interface SettingsViewProps {
  connections: { google: AuthStatus; ticktick: AuthStatus };
  onConnect: (service: "google" | "ticktick") => void;
  onDisconnect: (service: "google" | "ticktick") => void;
}

export default function SettingsView({
  connections,
  onConnect,
  onDisconnect,
}: SettingsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="flex flex-col gap-5"
    >
      <Section label="Connections">
        <SettingRow
          icon={<Calendar size={15} />}
          label="Google Calendar"
          description={
            connections.google === "connected" ? "Connected" : "Not connected"
          }
          status={connections.google}
          action={
            connections.google === "connected" ? (
              <button
                onClick={() => onDisconnect("google")}
                className="flex items-center gap-1 font-mono text-[10px] text-red-400/70 hover:text-red-400 tracking-widest uppercase transition-colors"
              >
                <LogOut size={10} />
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => onConnect("google")}
                className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 hover:text-white tracking-widest uppercase transition-colors"
              >
                Connect
                <ChevronRight size={10} />
              </button>
            )
          }
        />
        <SettingRow
          icon={<CheckSquare size={15} />}
          label="TickTick"
          description={
            connections.ticktick === "connected" ? "Connected" : "Not connected"
          }
          status={connections.ticktick}
          action={
            connections.ticktick === "connected" ? (
              <button
                onClick={() => onDisconnect("ticktick")}
                className="flex items-center gap-1 font-mono text-[10px] text-red-400/70 hover:text-red-400 tracking-widest uppercase transition-colors"
              >
                <LogOut size={10} />
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => onConnect("ticktick")}
                className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 hover:text-white tracking-widest uppercase transition-colors"
              >
                Connect
                <ChevronRight size={10} />
              </button>
            )
          }
        />
      </Section>

      <Section label="AI Engine">
        <SettingRow
          icon={<Brain size={15} />}
          label="Model"
          description="Claude 3.5 Sonnet"
          action={
            <span className="font-mono text-[10px] text-zinc-500 bg-white/[0.04] px-2 py-1 rounded-md">
              Anthropic
            </span>
          }
        />
      </Section>

      <Section label="Scheduling Defaults">
        <PreferenceRow label="Work day start" value="09:00" />
        <PreferenceRow label="Work day end" value="18:00" />
        <PreferenceRow label="Min block length" value="25 min" />
        <PreferenceRow label="Buffer between tasks" value="10 min" />
      </Section>

      <p className="font-mono text-[10px] text-zinc-700 text-center tracking-widest">
        AUTO-PILOT WEEK · v0.1.0
      </p>
    </motion.div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase px-1">
        {label}
      </p>
      <GlassPanel variant="sm" className="divide-y divide-white/[0.05]">
        {children}
      </GlassPanel>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  description,
  status,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  status?: AuthStatus;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] text-zinc-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/85">{label}</p>
        <div className="flex items-center gap-1.5">
          {status !== undefined && (
            <span
              className={clsx(
                "w-1.5 h-1.5 rounded-full",
                status === "connected"
                  ? "bg-emerald-400"
                  : status === "connecting"
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-zinc-600"
              )}
            />
          )}
          <p className="text-[11px] text-zinc-500 truncate">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function PreferenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="font-mono text-xs text-white/60 bg-white/[0.04] px-2.5 py-1 rounded-lg">
        {value}
      </span>
    </div>
  );
}
