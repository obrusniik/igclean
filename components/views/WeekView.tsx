"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import GlassPanel from "@/components/ui/GlassPanel";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_EVENTS: Record<
  string,
  { time: string; title: string; type: "gcal" | "ai" | "busy" }[]
> = {
  Mon: [
    { time: "09:00", title: "Team standup", type: "gcal" },
    { time: "10:30", title: "[AI] Deep work: API integration", type: "ai" },
    { time: "14:00", title: "[AI] Code review prep", type: "ai" },
  ],
  Tue: [
    { time: "09:00", title: "[AI] Focus: Auth flow", type: "ai" },
    { time: "11:00", title: "[AI] Focus: UI components", type: "ai" },
    { time: "15:00", title: "1:1 with mentor", type: "gcal" },
  ],
  Wed: [
    { time: "10:00", title: "Design review", type: "gcal" },
    { time: "13:00", title: "[AI] Write tests", type: "ai" },
  ],
  Thu: [
    { time: "09:30", title: "[AI] Documentation", type: "ai" },
    { time: "14:00", title: "Sprint planning", type: "gcal" },
  ],
  Fri: [
    { time: "10:00", title: "[AI] Bug fixes", type: "ai" },
    { time: "12:00", title: "Lunch break", type: "busy" },
  ],
  Sat: [],
  Sun: [],
};

const today = new Date();
const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

export default function WeekView() {
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const selectedDayName = DAYS[selectedDay];
  const events = MOCK_EVENTS[selectedDayName] ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="flex flex-col gap-4"
    >
      <GlassPanel variant="sm" className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day, i) => {
            const isToday = i === todayIndex;
            const isSelected = i === selectedDay;
            const hasEvents = (MOCK_EVENTS[day] ?? []).length > 0;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(i)}
                className="flex flex-col items-center gap-1.5 py-2 rounded-xl relative transition-colors"
              >
                {isSelected && (
                  <motion.div
                    layoutId="day-selector"
                    className="absolute inset-0 rounded-xl bg-white/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={clsx(
                    "relative z-10 font-mono text-[9px] tracking-widest uppercase",
                    isSelected ? "text-white/70" : "text-zinc-600"
                  )}
                >
                  {day}
                </span>
                <span
                  className={clsx(
                    "relative z-10 text-sm font-semibold",
                    isSelected
                      ? "text-metallic"
                      : isToday
                      ? "text-white/60"
                      : "text-zinc-500"
                  )}
                >
                  {getDayNumber(i)}
                </span>
                <span
                  className={clsx(
                    "relative z-10 w-1 h-1 rounded-full",
                    hasEvents ? "bg-zinc-400" : "bg-transparent"
                  )}
                />
              </button>
            );
          })}
        </div>
      </GlassPanel>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-semibold text-white/90">
          {selectedDayName === DAYS[todayIndex] ? "Today" : selectedDayName}
        </h2>
        <span className="font-mono text-[10px] text-zinc-500 tracking-widest">
          {events.length} BLOCKS
        </span>
      </div>

      {events.length === 0 ? (
        <GlassPanel variant="sm" className="p-8 flex flex-col items-center gap-2">
          <p className="text-zinc-600 text-sm">No events scheduled</p>
          <p className="text-zinc-700 text-[11px]">Run Auto-Pilot to fill this day</p>
        </GlassPanel>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 28 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 px-1 pt-2">
        <LegendItem color="bg-blue-500/60" label="Google Calendar" />
        <LegendItem color="bg-metallic" label="AI Scheduled" />
        <LegendItem color="bg-zinc-600" label="Busy / Block" />
      </div>
    </motion.div>
  );
}

function EventCard({
  event,
}: {
  event: { time: string; title: string; type: "gcal" | "ai" | "busy" };
}) {
  const accent = {
    gcal: "border-l-blue-500/60",
    ai: "border-l-white/40",
    busy: "border-l-zinc-600",
  }[event.type];

  const badge = {
    gcal: { label: "GCal", cls: "text-blue-400 bg-blue-500/10" },
    ai: { label: "AI", cls: "text-white/60 bg-white/[0.06]" },
    busy: { label: "Busy", cls: "text-zinc-500 bg-zinc-800" },
  }[event.type];

  return (
    <GlassPanel
      variant="sm"
      className={clsx("flex items-center gap-4 p-4 border-l-2", accent)}
    >
      <span className="font-mono text-xs text-zinc-500 w-10 flex-shrink-0">
        {event.time}
      </span>
      <span className="text-sm text-white/85 flex-1 truncate">{event.title}</span>
      <span
        className={clsx(
          "font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-md",
          badge.cls
        )}
      >
        {badge.label}
      </span>
    </GlassPanel>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={clsx("w-2 h-2 rounded-sm", color)} />
      <span className="font-mono text-[9px] text-zinc-600 tracking-wider">
        {label}
      </span>
    </div>
  );
}

function getDayNumber(dayIndex: number): string {
  const d = new Date();
  const currentDayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
  d.setDate(d.getDate() + (dayIndex - currentDayIndex));
  return String(d.getDate());
}
