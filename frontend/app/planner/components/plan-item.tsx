"use client";

import {
  Car,
  Clock,
  GripVertical,
  Hotel,
  Plane,
  Sparkles,
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
}

export function PlanItem({ item }: PlanItemProps) {
  const Icon = ITEM_ICONS[item.category] || Sparkles;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs transition-all hover:border-slate-200">
      <button
        type="button"
        className="mt-1 text-slate-300 hover:text-slate-400 cursor-grab bg-transparent border-none p-0 outline-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-100/50">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5">
          {item.time && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 border border-slate-100">
              <Clock className="h-2.5 w-2.5" />
              {item.time}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs font-bold text-slate-800">
          {item.title}
        </p>
        {item.note && (
          <p className="mt-1 text-[11px] text-slate-400 bg-slate-50/50 p-2 rounded-md border border-slate-100/80 italic">
            {item.note}
          </p>
        )}
      </div>
    </div>
  );
}
