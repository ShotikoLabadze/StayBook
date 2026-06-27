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
  id?: string;
  onAddActivity: (dayIndex: number, newAct: any) => void;
  onDeleteActivity: (dayIndex: number, activityId: string) => void;
}

export function DaySchedule({
  dayNumber,
  date,
  title,
  activities,
  dayIndex,
  id,
  onAddActivity,
  onDeleteActivity,
}: DayScheduleProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const droppableId = id || `day-${dayIndex}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: { dayIndex, type: "day" },
  });

  return (
    <section
      ref={setNodeRef}
      className={`flex flex-col gap-4 rounded-2xl border p-4 lg:p-5 shadow-xs transition-colors h-full min-h-[500px] transition-colors duration-300 ${
        isOver
          ? "bg-slate-500/10 border-secondary/40"
          : "bg-card-bg border-border-subtle"
      }`}
    >
      <header className="flex items-center justify-between border-b border-border-subtle pb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary dark:bg-secondary text-xs font-bold text-white dark:text-neutral-bg shadow-sm shrink-0">
            {String(dayNumber).padStart(2, "0")}
          </span>
          {/* min-w-0 აქ კრიტიკულია, რომ შიგნით truncate-მა სწორად იმუშაოს */}
          <div className="text-left min-w-0 flex-1">
            <p className="text-xs font-bold text-primary truncate leading-tight">
              {title}
            </p>
            <p className="text-[11px] text-text-muted truncate mt-0.5">
              {date}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted shrink-0 bg-neutral-bg/60 px-1.5 py-0.5 rounded-md border border-border-subtle">
          <CalendarDays className="h-3 w-3 opacity-85" />
          {activities.length} {activities.length === 1 ? "item" : "items"}
        </span>
      </header>

      <SortableContext
        items={activities.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-1 justify-start min-h-[150px] min-w-0 w-full overflow-hidden">
          {activities.map((activity) => (
            <PlanItem
              key={activity.id}
              item={activity}
              dayIndex={dayIndex}
              onDelete={onDeleteActivity}
            />
          ))}
          {activities.length === 0 && (
            <div className="text-center py-10 text-xs text-text-muted italic border border-dashed border-border-subtle rounded-xl bg-neutral-bg/30">
              No active tasks
            </div>
          )}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mt-2 border border-dashed border-border-subtle hover:border-secondary/50 w-full py-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-neutral-bg/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold bg-transparent outline-none active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" />
        Add Activity
      </button>

      <AddActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        dayTitle={title}
        onSave={(newAct) => onAddActivity(dayIndex, newAct)}
      />
    </section>
  );
}
