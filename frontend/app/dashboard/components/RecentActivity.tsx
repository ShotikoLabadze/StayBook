"use client";

import { Pencil, Plane, UserPlus } from "lucide-react";

const recentActivities = [
  {
    id: 1,
    title: "Trip Edit: Santorini",
    desc: 'Added "Villa Katikies" to Itinerary',
    time: "2 hours ago",
    icon: Pencil,
    iconBg: "bg-blue-50 text-blue-500",
  },
  {
    id: 2,
    title: "Booking Confirmed",
    desc: "Flight UA-294 confirmed by Sarah",
    time: "Yesterday, 4:30 PM",
    icon: Plane,
    iconBg: "bg-cyan-50 text-cyan-500",
  },
  {
    id: 3,
    title: "New Contributor",
    desc: 'Mark joined "Yosemite 2026"',
    time: "May 24, 2026",
    icon: UserPlus,
    iconBg: "bg-slate-100 text-slate-600",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6 shadow-sm">
      <h3 className="font-headline font-bold text-sm text-primary">
        Recent Activity
      </h3>
      <div className="relative border-l border-slate-100 pl-6 space-y-6 ml-3">
        {recentActivities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="relative space-y-1 pl-4">
              <span className="absolute -left-[38px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white ring-1 ring-slate-100 bg-white shadow-xs">
                <div className={`p-1 rounded-md ${act.iconBg}`}>
                  <Icon className="w-3 h-3" />
                </div>
              </span>
              <h4 className="text-xs font-semibold text-primary">
                {act.title}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">
                {act.desc}
              </p>
              <span className="block text-[10px] text-slate-400/80 font-medium">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
