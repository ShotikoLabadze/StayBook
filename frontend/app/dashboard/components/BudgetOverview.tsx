"use client";

import { MoreHorizontal } from "lucide-react";

interface BudgetCategory {
  cat: string;
  amt: string;
  color: string;
}

interface BudgetOverviewProps {
  data: BudgetCategory[];
  totalLimit: number;
  totalSpent: number;
}

export default function BudgetOverview({
  data,
  totalLimit,
  totalSpent,
}: BudgetOverviewProps) {
  const percentage =
    totalLimit > 0
      ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100)
      : 0;
  const strokeDash = `${percentage} 100`;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-bold text-sm text-primary">
          Budget Overview
        </h3>
        <button className="text-slate-400 hover:text-primary transition-colors cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeDasharray={strokeDash}
            />
          </svg>
          <div className="absolute text-center">
            <span className="font-headline text-xl font-bold text-primary">
              {percentage}%
            </span>
          </div>
        </div>

        <div className="space-y-3 w-full sm:w-auto min-w-[150px]">
          {data.length === 0 ? (
            <p className="text-xs text-slate-400">No expenses recorded.</p>
          ) : (
            data.map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-8 text-xs font-medium"
              >
                <div className="flex items-center gap-2 text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${b.color}`} />
                  {b.cat}
                </div>
                <span className="text-primary font-semibold">{b.amt}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
