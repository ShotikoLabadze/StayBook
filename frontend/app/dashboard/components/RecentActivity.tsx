"use client";

import {
  Car,
  HelpCircle,
  Pencil,
  Plane,
  UserPlus,
  Utensils,
} from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  category: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const iconMap: Record<string, any> = {
  hotel: Pencil,
  flight: Plane,
  transport: Car,
  food: Utensils,
  activity: UserPlus,
};

const bgMap: Record<string, string> = {
  hotel: "bg-blue-500/10 text-blue-500",
  flight: "bg-cyan-500/10 text-cyan-500",
  transport: "bg-amber-500/10 text-amber-500",
  food: "bg-rose-500/10 text-rose-500",
  activity: "bg-slate-500/10 text-slate-500 dark:text-slate-400",
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-card-bg border border-border-subtle rounded-2xl p-6 space-y-6 shadow-sm transition-colors duration-300">
      <h3 className="font-headline font-bold text-sm text-primary">
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <p className="text-xs text-text-muted text-center py-4">
          No recent itinerary changes.
        </p>
      ) : (
        <div className="relative border-l border-border-subtle pl-6 space-y-6 ml-3">
          {activities.map((act) => {
            const Icon = iconMap[act.category] || HelpCircle;
            const bgClass =
              bgMap[act.category] || "bg-neutral-bg text-text-muted";

            return (
              <div key={act.id} className="relative space-y-1 pl-4">
                <span className="absolute -left-[38px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-4 border-card-bg ring-1 ring-border-subtle bg-card-bg shadow-xs">
                  <div className={`p-1 rounded-md ${bgClass}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                </span>
                <h4 className="text-xs font-semibold text-primary">
                  {act.title}
                </h4>
                <p className="text-[11px] text-text-muted font-medium">
                  {act.desc}
                </p>
                <span className="block text-[10px] text-text-muted opacity-80 font-medium">
                  {act.time}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
