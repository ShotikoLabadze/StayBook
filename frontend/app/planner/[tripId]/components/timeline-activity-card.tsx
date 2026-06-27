"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Clock,
  GripVertical,
  Hotel,
  MapPin,
  MessageSquare,
  Paperclip,
  Plane,
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  time?: string;
  note?: string;
  category: string;
  status?: string;
}

interface TimelineActivityCardProps {
  activity: Activity;
}

export function TimelineActivityCard({ activity }: TimelineActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: activity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const isConfirmed =
    activity.category === "flight" || activity.category === "hotel";

  const renderCategoryIcon = () => {
    switch (activity.category) {
      case "flight":
        return (
          <div className="h-6 w-6 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 shrink-0">
            <Plane className="h-3 w-3 stroke-[2.5]" />
          </div>
        );
      case "hotel":
        return (
          <div className="h-6 w-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
            <Hotel className="h-3 w-3 stroke-[2.5]" />
          </div>
        );
      default:
        return (
          <div className="h-6 w-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <MapPin className="h-3 w-3 stroke-[2.5]" />
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-start gap-2.5 rounded-xl border border-border-subtle bg-card-bg p-3 shadow-2xs hover:shadow-xs transition-all touch-none transition-colors duration-300"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-1 mt-0.5 shrink-0 text-text-muted opacity-60 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-3 w-3" />
        {renderCategoryIcon()}
      </div>

      <div className="flex-1 min-w-0 space-y-1 text-left">
        <div className="flex items-center gap-1.5 flex-wrap">
          {activity.time && (
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-bg px-1.5 py-0.5 text-[9px] font-bold text-text-muted border border-border-subtle">
              <Clock className="h-2.5 w-2.5 opacity-70" />
              {activity.time}
            </span>
          )}
          <span
            className={`rounded-md border px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${
              isConfirmed
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            {isConfirmed ? "Confirmed" : "Pending"}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-primary tracking-tight leading-snug break-words">
            {activity.title}
          </h4>
          {activity.note && (
            <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
              {activity.note}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 pt-0.5 text-text-muted text-[9px] font-bold">
          <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
            <MessageSquare className="h-2.5 w-2.5 opacity-70" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
            <Paperclip className="h-2.5 w-2.5 opacity-70" />
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
