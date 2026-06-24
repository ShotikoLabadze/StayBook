"use client";

import { TripItineraryDay, tripService } from "@/services/tripService";
import {
  Car,
  Hotel,
  Landmark,
  PieChart,
  Plane,
  Sparkles,
  Trash2,
  Utensils,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddExpenseModal } from "./add-expense-modal";

interface BudgetViewProps {
  tripId: string;
  itinerary: TripItineraryDay[];
  budgetLimit: number;
  currency?: string;
  onTripRefresh?: () => void;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  flight: {
    label: "Flights",
    color: "bg-sky-500",
    icon: <Plane className="h-3.5 w-3.5 text-text-muted" />,
  },
  hotel: {
    label: "Hotels",
    color: "bg-purple-500",
    icon: <Hotel className="h-3.5 w-3.5 text-text-muted" />,
  },
  food: {
    label: "Dining",
    color: "bg-orange-500",
    icon: <Utensils className="h-3.5 w-3.5 text-text-muted" />,
  },
  activity: {
    label: "Activities",
    color: "bg-emerald-500",
    icon: <Sparkles className="h-3.5 w-3.5 text-text-muted" />,
  },
  transport: {
    label: "Transport",
    color: "bg-amber-500",
    icon: <Car className="h-3.5 w-3.5 text-text-muted" />,
  },
  other: {
    label: "Other",
    color: "bg-slate-500",
    icon: <Landmark className="h-3.5 w-3.5 text-text-muted" />,
  },
};

export function BudgetView({
  tripId,
  itinerary = [],
  budgetLimit = 0,
  currency = "USD",
  onTripRefresh,
}: BudgetViewProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const allExpenses = (itinerary || [])
    .flatMap((day, dayIndex) =>
      (day.activities || []).map((act) => ({
        ...act,
        dayIndex,
        dayDate: day.date,
        cost: act.cost || 0,
      })),
    )
    .filter((act) => act.cost > 0);

  const totalSpent = allExpenses.reduce((sum, item) => sum + item.cost, 0);
  const remainingBudget = Math.max(0, budgetLimit - totalSpent);
  const budgetUsedPercent =
    budgetLimit > 0
      ? Math.min(100, Math.round((totalSpent / budgetLimit) * 100))
      : 0;

  const initialBreakdown: Record<string, number> = {
    flight: 0,
    hotel: 0,
    food: 0,
    activity: 0,
    transport: 0,
    other: 0,
  };

  const categoryTotals = allExpenses.reduce(
    (acc, item) => {
      const cat = item.category;
      if (acc[cat] !== undefined) {
        acc[cat] += item.cost;
      } else {
        acc.other += item.cost;
      }
      return acc;
    },
    { ...initialBreakdown },
  );

  const handleAddExpense = async (dayIndex: number, newActivity: any) => {
    try {
      setIsUpdating(true);

      const activityWithId = {
        ...newActivity,
        id:
          newActivity.id ||
          crypto.randomUUID() ||
          Math.random().toString(36).substring(2, 9),
      };

      await tripService.addActivity(tripId, dayIndex, activityWithId);

      if (onTripRefresh) {
        onTripRefresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to add expense to DB:", err);
    } finally {
      setIsUpdating(false);
      setModalOpen(false);
    }
  };

  const handleDeleteExpense = async (dayIndex: number, activityId: string) => {
    try {
      setIsUpdating(true);
      await tripService.deleteActivity(tripId, dayIndex, activityId);

      if (onTripRefresh) {
        onTripRefresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete expense from DB:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`space-y-6 w-full text-left transition-colors duration-300 ${isUpdating ? "opacity-60 pointer-events-none transition-opacity" : ""}`}
    >
      <div className="bg-card-bg border border-border-subtle rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Total Budget
            </p>
            <h2 className="text-3xl font-black text-primary tracking-tight mt-1">
              {formatMoney(budgetLimit)}
            </h2>
            <p className="text-xs text-text-muted mt-1 font-medium">
              <span className="text-primary font-bold">
                {formatMoney(totalSpent)} spent
              </span>{" "}
              · {formatMoney(remainingBudget)} remaining
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-neutral-bg hover:bg-neutral-bg/80 text-primary rounded-xl text-xs font-bold transition-all border border-border-subtle cursor-pointer flex items-center gap-1.5"
          >
            + Add expense
          </button>
        </div>

        <div className="w-full h-3 bg-neutral-bg rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 rounded-full ${budgetUsedPercent > 90 ? "bg-rose-500" : "bg-sky-500"}`}
            style={{ width: `${budgetUsedPercent}%` }}
          />
        </div>
        <p className="text-[10px] font-extrabold text-text-muted uppercase mt-2 tracking-wider">
          {budgetUsedPercent}% of budget used
        </p>
      </div>

      <div className="bg-card-bg border border-border-subtle rounded-3xl p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-primary tracking-tight flex items-center gap-2">
            <PieChart className="h-4 w-4 text-secondary" /> Where it goes
          </h3>
        </div>
        <div className="space-y-4">
          {Object.entries(categoryTotals).map(([key, value]) => {
            const config = CATEGORY_CONFIG[key] || CATEGORY_CONFIG.other;
            const percent =
              totalSpent > 0 ? Math.round((value / totalSpent) * 100) : 0;
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-neutral-bg flex items-center justify-center border border-border-subtle">
                      {config.icon}
                    </span>
                    <span>{config.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{formatMoney(value)}</span>
                    <span className="text-text-muted font-normal w-8 text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-neutral-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full ${config.color} transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card-bg border border-border-subtle rounded-3xl p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-primary tracking-tight flex items-center gap-2">
            <Wallet className="h-4 w-4 text-secondary" /> Expense log
          </h3>
        </div>
        <div className="divide-y divide-border-subtle max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
          {allExpenses.map((expense) => {
            const config =
              CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.other;
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between py-3 group border-b border-border-subtle last:border-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-neutral-bg flex items-center justify-center border border-border-subtle">
                    {config.icon}
                  </span>
                  <div className="min-w-0 text-left">
                    <h4 className="text-xs font-bold text-primary truncate">
                      {expense.title}
                    </h4>
                    <p className="text-[10px] text-text-muted mt-0.5 font-medium">
                      {expense.dayDate
                        ? new Date(expense.dayDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            },
                          )
                        : "Unscheduled"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-extrabold text-primary">
                    {formatMoney(expense.cost)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteExpense(expense.dayIndex, expense.id)
                    }
                    className="text-text-muted hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all border-none bg-transparent cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {allExpenses.length === 0 && (
            <div className="text-center py-8 text-xs text-text-muted italic">
              No expenses tracked yet.
            </div>
          )}

          <AddExpenseModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleAddExpense}
            totalDays={itinerary.length}
          />
        </div>
      </div>
    </div>
  );
}
