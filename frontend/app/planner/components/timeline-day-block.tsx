"use client";

import { CalendarDays } from "lucide-react";
import { TimelineActivityCard } from "./timeline-activity-card";

interface Day {
  dayNumber: number;
  title: string;
  date: string;
  activities: any[];
}

interface TimelineDayBlockProps {
  day: Day;
}

export function TimelineDayBlock({ day }: TimelineDayBlockProps) {
  return (
    <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 space-y-4 shadow-2xs">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-xs shrink-0">
            {day.dayNumber}
          </div>
          <div className="text-left">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              {day.title}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{day.date}</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-3xs">
          <CalendarDays className="h-3 w-3" />
          {day.activities.length}{" "}
          {day.activities.length === 1 ? "item" : "items"}
        </span>
      </header>

      <div className="flex flex-col gap-2.5">
        {day.activities.map((activity) => (
          <TimelineActivityCard key={activity.id} activity={activity} />
        ))}

        {day.activities.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400 italic bg-white border border-dashed border-slate-100 rounded-xl">
            No activities scheduled for this day.
          </div>
        )}
      </div>
    </div>
  );
}
