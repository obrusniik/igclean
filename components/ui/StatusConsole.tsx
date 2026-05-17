"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "@/components/ui/GlassPanel";

export interface LogLine {
  status: "idle" | "ok" | "error" | "working";
  text: string;
}

const COLOR: Record<LogLine["status"], string> = {
  idle: "text-zinc-600",
  ok: "text-emerald-500",
  error: "text-red-400",
  working: "text-yellow-400",
};

const PREFIX: Record<LogLine["status"], string> = {
  idle: "—",
  ok: "✓",
  error: "✗",
  working: "⟳",
};

export default function StatusConsole({ lines }: { lines: LogLine[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <GlassPanel variant="sm" className="p-4">
      <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase mb-3">
        Status Console
      </p>
      <div className="space-y-1.5 max-h-32 overflow-y-auto">
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`font-mono text-[11px] flex items-start gap-2 ${COLOR[line.status]}`}
            >
              <span
                className={
                  line.status === "working" ? "animate-spin inline-block" : ""
                }
              >
                {PREFIX[line.status]}
              </span>
              <span>{line.text}</span>
            </motion.p>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </GlassPanel>
  );
}
