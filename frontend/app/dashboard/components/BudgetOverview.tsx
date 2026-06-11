"use client";

import { MoreHorizontal } from "lucide-react";

export default function BudgetOverview() {
  const budgetData = [
    { cat: "Flights", amt: "$4,200", color: "bg-primary" },
    { cat: "Hotels", amt: "$2,800", color: "bg-secondary" },
    { cat: "Dining", amt: "$1,150", color: "bg-slate-300" },
  ];

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
              strokeDasharray="70 100"
            />
          </svg>
          <div className="absolute text-center">
            <span className="font-headline text-xl font-bold text-primary">
              70%
            </span>
          </div>
        </div>

        <div className="space-y-3 w-full sm:w-auto">
          {budgetData.map((b, i) => (
            <div
              key={i}
              className="flex items-center justify-between sm:gap-16 text-xs font-medium"
            >
              <div className="flex items-center gap-2 text-slate-500">
                <span className={`w-2 h-2 rounded-full ${b.color}`} />
                {b.cat}
              </div>
              <span className="text-primary font-semibold">{b.amt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
