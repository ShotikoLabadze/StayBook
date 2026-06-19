"use client";

import { CalendarDays } from "lucide-react";
import { PlanItem } from "./plan-item";

interface DayScheduleProps {
  dayNumber: number;
  date: string;
  title: string;
  activities: any[];
}

export function DaySchedule({
  dayNumber,
  date,
  title,
  activities,
}: DayScheduleProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
      <header className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
            {String(dayNumber).padStart(2, "0")}
          </span>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">{title}</p>
            <p className="text-xs text-slate-400">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" />
          {activities.length} {activities.length === 1 ? "item" : "items"}
        </span>
      </header>

      <div className="flex flex-col gap-3">
        {activities.map((activity) => (
          <PlanItem key={activity.id} item={activity} />
        ))}

        {activities.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-xs font-medium text-slate-400">
            No activities planned
          </div>
        )}
      </div>
    </section>
  );
}
