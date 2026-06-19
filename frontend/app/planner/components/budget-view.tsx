"use client";

import { PieChart, Trash2, Wallet } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  time?: string;
  note?: string;
  category: "flight" | "hotel" | "food" | "activity" | "transport" | string;
  cost?: number;
  date?: string;
}

interface Day {
  dayNumber: number;
  title: string;
  date: string;
  activities: Activity[];
}

interface BudgetViewProps {
  itinerary: Day[];
  budgetLimit?: number;
  currency?: string;
  onDeleteExpense?: (dayIndex: number, activityId: string) => void;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  flight: { label: "Flights", color: "bg-sky-500", icon: "✈️" },
  hotel: { label: "Hotels", color: "bg-purple-500", icon: "🏨" },
  food: { label: "Dining", color: "bg-orange-500", icon: "🍽️" },
  activity: { label: "Activities", color: "bg-emerald-500", icon: "✨" },
  transport: { label: "Transport", color: "bg-amber-500", icon: "🚗" },
  other: { label: "Other", color: "bg-slate-500", icon: "📍" },
};

export function BudgetView({
  itinerary,
  budgetLimit = 12450,
  currency = "USD",
  onDeleteExpense,
}: BudgetViewProps) {
  const allExpenses = itinerary
    .flatMap((day, dayIndex) =>
      day.activities.map((act) => ({
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
      const cat = item.category === "dining" ? "food" : item.category;
      if (acc[cat] !== undefined) {
        acc[cat] += item.cost;
      } else {
        acc.other += item.cost;
      }
      return acc;
    },
    { ...initialBreakdown },
  );

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 w-full text-left">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Budget
            </p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-1">
              {formatMoney(budgetLimit)}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              <span className="text-slate-700 font-bold">
                {formatMoney(totalSpent)} spent
              </span>{" "}
              · {formatMoney(remainingBudget)} remaining
            </p>
          </div>
          <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-100 cursor-pointer">
            + Add expense
          </button>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 rounded-full ${budgetUsedPercent > 90 ? "bg-rose-500" : "bg-sky-500"}`}
            style={{ width: `${budgetUsedPercent}%` }}
          />
        </div>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase mt-2 tracking-wider">
          {budgetUsedPercent}% of budget used
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" /> Where it goes
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(categoryTotals).map(([key, value]) => {
            const config = CATEGORY_CONFIG[key] || CATEGORY_CONFIG.other;
            const percent =
              totalSpent > 0 ? Math.round((value / totalSpent) * 100) : 0;

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-3xs text-[11px]">
                      {config.icon}
                    </span>
                    <span>{config.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-800">{formatMoney(value)}</span>
                    <span className="text-slate-400 font-normal w-8 text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
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

      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" /> Expense log
          </h3>
        </div>

        <div className="divide-y divide-slate-50 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
          {allExpenses.map((expense) => {
            const config =
              CATEGORY_CONFIG[
                expense.category === "dining" ? "food" : expense.category
              ] || CATEGORY_CONFIG.other;
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between py-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-3xs text-sm shrink-0">
                    {config.icon}
                  </span>
                  <div className="min-w-0 text-left">
                    <h4 className="text-xs font-bold text-slate-800 truncate tracking-tight">
                      {expense.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      {new Date(expense.dayDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-extrabold text-slate-800">
                    {formatMoney(expense.cost)}
                  </span>
                  {onDeleteExpense && (
                    <button
                      onClick={() =>
                        onDeleteExpense(expense.dayIndex, expense.id)
                      }
                      className="text-slate-300 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all border-none bg-transparent cursor-pointer outline-none"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {allExpenses.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400 italic">
              No expenses tracked yet. Add costs to your activities to populate
              the log.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
