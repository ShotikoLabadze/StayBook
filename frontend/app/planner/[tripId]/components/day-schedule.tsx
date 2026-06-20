"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CalendarDays, Plus } from "lucide-react";
import { useState } from "react";
import { AddActivityModal } from "./add-activity-modal";
import { PlanItem } from "./plan-item";

interface DayScheduleProps {
  dayNumber: number;
  date: string;
  title: string;
  activities: any[];
  dayIndex: number;
  onAddActivity: (dayIndex: number, newAct: any) => void;
  onDeleteActivity: (dayIndex: number, activityId: string) => void;
}

export function DaySchedule({
  dayNumber,
  date,
  title,
  activities,
  dayIndex,
  onAddActivity,
  onDeleteActivity,
}: DayScheduleProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${dayIndex}`,
    data: { dayIndex, type: "day" },
  });

  return (
    <section
      ref={setNodeRef}
      className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-xs transition-colors h-full ${
        isOver
          ? "bg-slate-50/80 border-primary/30"
          : "bg-white border-slate-100"
      }`}
    >
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

      <SortableContext
        items={activities.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-1 justify-start">
          {activities.map((activity) => (
            <PlanItem
              key={activity.id}
              item={activity}
              dayIndex={dayIndex}
              onDelete={onDeleteActivity}
            />
          ))}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mt-2 border border-dashed border-slate-200 hover:border-primary/40 w-full py-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold bg-transparent outline-none"
      >
        <Plus className="h-4 w-4" />
        Add Activity
      </button>

      <AddActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        dayTitle={`Day ${dayNumber} - ${title}`}
        onSave={(newAct) => onAddActivity(dayIndex, newAct)}
      />
    </section>
  );
}
