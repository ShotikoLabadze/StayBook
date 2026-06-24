"use client";

import { LucideIcon } from "lucide-react";

export interface AnalyticItem {
  label: string;
  val: string;
  icon: LucideIcon;
  bg: string;
}

interface AnalyticsWidgetProps {
  items: AnalyticItem[];
}

export default function AnalyticsWidget({ items }: AnalyticsWidgetProps) {
  return (
    <div className="space-y-4 transition-colors duration-300">
      {items.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-card-bg border border-border-subtle rounded-2xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="font-headline text-xl font-bold text-primary">
                {stat.val}
              </p>
            </div>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} shadow-xs`}
            >
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
