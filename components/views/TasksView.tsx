"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { Clock, Tag, ChevronDown } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

const MOCK_TASKS = [
  { id: "1", title: "Implement OAuth flow", duration: 90, priority: "high", list: "Dev", scheduled: false },
  { id: "2", title: "Write API integration tests", duration: 60, priority: "high", list: "Dev", scheduled: false },
  { id: "3", title: "Update project README", duration: 30, priority: "medium", list: "Dev", scheduled: false },
  { id: "4", title: "Review pull requests", duration: 45, priority: "medium", list: "Dev", scheduled: true },
  { id: "5", title: "Email client follow-up", duration: 20, priority: "low", list: "Admin", scheduled: false },
  { id: "6", title: "Prepare weekly report", duration: 40, priority: "medium", list: "Admin", scheduled: false },
  { id: "7", title: "Research competitor features", duration: 60, priority: "low", list: "Research", scheduled: false },
  { id: "8", title: "Fix login page bug", duration: 30, priority: "high", list: "Dev", scheduled: false },
];

const LISTS = ["All", "Dev", "Admin", "Research"];

type Priority = "high" | "medium" | "low";

export default function TasksView() {
  const [activeList, setActiveList] = useState("All");
  const [showScheduled, setShowScheduled] = useState(false);

  const filtered = MOCK_TASKS.filter((t) => {
    if (!showScheduled && t.scheduled) return false;
    if (activeList !== "All" && t.list !== activeList) return false;
    return true;
  });

  const unscheduledCount = MOCK_TASKS.filter((t) => !t.scheduled).length;
  const totalMinutes = filtered
    .filter((t) => !t.scheduled)
    .reduce((acc, t) => acc + t.duration, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="flex flex-col gap-4"
    >
      <GlassPanel variant="sm" className="grid grid-cols-3 divide-x divide-white/[0.06]">
        <StatCell label="Unscheduled" value={String(unscheduledCount)} />
        <StatCell label="Total time" value={formatMinutes(totalMinutes)} />
        <StatCell label="Lists" value={String(LISTS.length - 1)} />
      </GlassPanel>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {LISTS.map((list) => (
          <button
            key={list}
            onClick={() => setActiveList(list)}
            className={clsx(
              "flex-shrink-0 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-all duration-150",
              activeList === list
                ? "border-white/20 text-white/80 bg-white/[0.08]"
                : "border-white/[0.06] text-zinc-600 bg-transparent"
            )}
          >
            {list}
          </button>
        ))}

        <button
          onClick={() => setShowScheduled((v) => !v)}
          className={clsx(
            "flex-shrink-0 flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-all duration-150 ml-auto",
            showScheduled
              ? "border-white/20 text-white/80 bg-white/[0.08]"
              : "border-white/[0.06] text-zinc-600 bg-transparent"
          )}
        >
          <ChevronDown
            size={10}
            className={clsx("transition-transform", showScheduled && "rotate-180")}
          />
          Done
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <GlassPanel variant="sm" className="p-8 flex items-center justify-center">
            <p className="text-zinc-600 text-sm">No tasks in this list</p>
          </GlassPanel>
        ) : (
          filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 28 }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function TaskCard({
  task,
}: {
  task: {
    title: string;
    duration: number;
    priority: string;
    list: string;
    scheduled: boolean;
  };
}) {
  const priorityColor: Record<Priority, string> = {
    high: "bg-red-500/70",
    medium: "bg-yellow-500/70",
    low: "bg-zinc-500/70",
  };

  return (
    <GlassPanel
      variant="sm"
      className={clsx(
        "flex items-center gap-3 p-4",
        task.scheduled && "opacity-40"
      )}
    >
      <span
        className={clsx(
          "w-2 h-2 rounded-full flex-shrink-0",
          priorityColor[task.priority as Priority] ?? "bg-zinc-600"
        )}
      />
      <span
        className={clsx(
          "text-sm flex-1 truncate",
          task.scheduled ? "line-through text-zinc-600" : "text-white/85"
        )}
      >
        {task.title}
      </span>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
          <Clock size={9} />
          {formatMinutes(task.duration)}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-600">
          <Tag size={9} />
          {task.list}
        </span>
      </div>
    </GlassPanel>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 p-3">
      <span className="text-base font-semibold text-metallic">{value}</span>
      <span className="font-mono text-[9px] text-zinc-600 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
