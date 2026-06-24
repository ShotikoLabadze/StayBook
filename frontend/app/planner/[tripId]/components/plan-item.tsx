"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Car,
  Clock,
  GripVertical,
  Hotel,
  Plane,
  Sparkles,
  Trash2,
  Utensils,
} from "lucide-react";

const ITEM_ICONS: Record<string, any> = {
  flight: Plane,
  hotel: Hotel,
  food: Utensils,
  activity: Sparkles,
  transport: Car,
};

interface PlanItemProps {
  item: {
    id: string;
    title: string;
    time?: string;
    note?: string;
    category: string;
  };
  dayIndex: number;
  isClone?: boolean;
  onDelete?: (dayIndex: number, activityId: string) => void;
}

export function PlanItem({
  item,
  dayIndex,
  isClone = false,
  onDelete,
}: PlanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { dayIndex, type: "plan-item" },
    disabled: isClone,
  });

  const Icon = ITEM_ICONS[item.category] || Sparkles;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.05 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-xl border border-border-subtle bg-card-bg p-3.5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700 w-full group relative transition-colors duration-300"
    >
      <button
        type="button"
        {...(isClone ? {} : attributes)}
        {...(isClone ? {} : listeners)}
        className="mt-1 text-text-muted opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing bg-transparent border-none p-0 outline-none flex shrink-0 transition-opacity"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-bg text-text-muted border border-border-subtle">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1 text-left pr-6">
        <div className="flex items-center gap-1.5">
          {item.time && (
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-bg px-1.5 py-0.5 text-[10px] font-semibold text-text-muted border border-border-subtle">
              <Clock className="h-2.5 w-2.5" />
              {item.time}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs font-bold text-primary">
          {item.title}
        </p>
        {item.note && (
          <p className="mt-1 text-[11px] text-text-muted bg-neutral-bg/50 p-2 rounded-md border border-border-subtle italic">
            {item.note}
          </p>
        )}
      </div>

      {!isClone && onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(dayIndex, item.id);
          }}
          className="absolute right-3 top-3.5 text-text-muted hover:text-rose-500 p-1 rounded-lg hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all border-none bg-transparent cursor-pointer outline-none"
          aria-label="Delete activity"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
