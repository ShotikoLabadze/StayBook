"use client";

import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface BudgetCategory {
  cat: string;
  amt: string;
  color: string;
}

interface BudgetOverviewProps {
  tripId: string;
  data: BudgetCategory[];
  totalLimit: number;
  totalSpent: number;
}

export default function BudgetOverview({
  tripId,
  data,
  totalLimit,
  totalSpent,
}: BudgetOverviewProps) {
  const router = useRouter();

  const percentage =
    totalLimit > 0
      ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100)
      : 0;
  const strokeDash = `${percentage} 100`;

  const handleGoToBudget = () => {
    if (tripId) {
      router.push(`/planner/${tripId}?tab=budget`);
    }
  };

  return (
    <div className="bg-card-bg border border-border-subtle rounded-2xl p-6 space-y-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-bold text-sm text-primary">
          Budget Overview
        </h3>

        <button
          onClick={handleGoToBudget}
          className="text-text-muted hover:text-primary p-1 rounded-lg hover:bg-neutral-bg transition-colors cursor-pointer"
          aria-label="View detailed budget"
        >
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
              className="stroke-neutral-bg"
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              className="stroke-primary"
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
            <p className="text-xs text-text-muted">No expenses recorded.</p>
          ) : (
            data.map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-8 text-xs font-medium"
              >
                <div className="flex items-center gap-2 text-text-muted">
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
