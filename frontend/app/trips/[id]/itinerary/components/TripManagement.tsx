"use client";

import { CloudSun, Compass, DollarSign } from "lucide-react";

export default function TripManagement() {
  const tools = [
    { label: "Route Optimization", icon: Compass, color: "text-blue-500" },
    { label: "Budget Breakdown", icon: DollarSign, color: "text-cyan-500" },
    { label: "Weather Forecast", icon: CloudSun, color: "text-amber-500" },
  ];

  return (
    <div className="bg-white border border-slate-100/80 rounded-3xl p-5 shadow-xs space-y-4">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        Trip Management
      </h3>
      <div className="space-y-2">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <button
              key={idx}
              className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-bg hover:bg-slate-100/70 rounded-xl text-xs font-semibold text-primary transition-all text-left cursor-pointer group"
            >
              <Icon
                className={`w-4 h-4 ${tool.color} group-hover:scale-105 transition-transform`}
              />
              {tool.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
