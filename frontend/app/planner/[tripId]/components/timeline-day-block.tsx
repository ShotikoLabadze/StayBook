"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CalendarDays } from "lucide-react";
import { TimelineActivityCard } from "./timeline-activity-card";

interface Day {
  dayNumber: number;
  title: string;
  date: string;
  activities: any[];
  _id?: string;
}

interface TimelineDayBlockProps {
  day: Day;
  dayIndex: number;
}

export function TimelineDayBlock({ day, dayIndex }: TimelineDayBlockProps) {
  const droppableId = day._id ? `trip-${day._id}` : `day-${dayIndex}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border rounded-2xl p-5 space-y-4 shadow-2xs transition-colors text-left transition-colors duration-300 ${
        isOver
          ? "bg-slate-500/10 border-secondary/40"
          : "bg-neutral-bg border-border-subtle"
      }`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border-subtle pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:text-secondary dark:bg-secondary/10 flex items-center justify-center font-extrabold text-xs shrink-0">
            {day.dayNumber}
          </div>
          <div className="text-left">
            <h3 className="text-xs font-bold text-primary tracking-tight">
              {day.title}
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5">{day.date}</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-text-muted bg-card-bg px-2 py-1 rounded-lg border border-border-subtle shadow-3xs">
          <CalendarDays className="h-3 w-3" />
          {day.activities.length}{" "}
          {day.activities.length === 1 ? "item" : "items"}
        </span>
      </header>

      <SortableContext
        items={day.activities.map((a) => a.id || a._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2.5 min-h-[60px]">
          {day.activities.map((activity) => (
            <TimelineActivityCard
              key={activity.id || activity._id}
              activity={activity}
            />
          ))}

          {day.activities.length === 0 && (
            <div className="text-center py-8 text-xs text-text-muted italic bg-card-bg border border-dashed border-border-subtle rounded-xl">
              Drop activities here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
