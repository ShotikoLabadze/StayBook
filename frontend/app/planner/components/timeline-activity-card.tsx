"use client";

import { Clock, GripVertical, MessageSquare, Paperclip } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  time?: string;
  note?: string;
  category: string;
  status?: "confirmed" | "pending" | "cancelled" | string;
}

interface TimelineActivityCardProps {
  activity: Activity;
}

export function TimelineActivityCard({ activity }: TimelineActivityCardProps) {
  const isConfirmed =
    activity.status === "confirmed" ||
    activity.category === "flight" ||
    activity.category === "hotel";

  return (
    <div className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center gap-1.5 mt-1 shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors">
        <GripVertical className="h-3.5 w-3.5 cursor-grab active:cursor-grabbing" />
        <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xs">
          {activity.category === "flight"
            ? "✈️"
            : activity.category === "hotel"
              ? "🏨"
              : "📍"}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1 text-left">
        <div className="flex items-center gap-2 flex-wrap">
          {activity.time && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-100">
              <Clock className="h-2.5 w-2.5 text-slate-400" />
              {activity.time}
            </span>
          )}
          <span
            className={`rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
              isConfirmed
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-amber-50 text-amber-600 border-amber-100"
            }`}
          >
            {isConfirmed ? "Confirmed" : "Pending"}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight">
            {activity.title}
          </h4>
          {activity.note && (
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              {activity.note}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1 text-slate-400 text-[10px] font-bold">
          <div className="flex items-center gap-1 hover:text-slate-600 transition-colors cursor-pointer">
            <MessageSquare className="h-3 w-3 text-slate-300" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1 hover:text-slate-600 transition-colors cursor-pointer">
            <Paperclip className="h-3 w-3 text-slate-300" />
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
