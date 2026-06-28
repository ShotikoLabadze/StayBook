"use client";

import { useAuth } from "@/context/AuthContext";
import { TripData, tripService } from "@/services/tripService";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useBudgetMetrics } from "./hooks/useBudgetMetrics";

import Footer from "@/components/Footer";
import BudgetSummary from "./components/BudgetSummary";
import CategoryPieChart from "./components/CategoryPieChart";
import SpendingTimeline from "./components/SpendingTimeline";
import TopExpenses from "./components/TopExpenses";
import TripBarChart from "./components/TripBarChart";
import TripProgressList from "./components/TripProgressList";

export default function BudgetPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTrip, setActiveTrip] = useState<string>("All trips");

  useEffect(() => {
    if (user) {
      tripService
        .getAll()
        .then((data) => setTrips(data))
        .catch((err) =>
          console.error("Failed to load global budget data:", err),
        )
        .finally(() => setLoading(false));
    }
  }, [user]);

  const tripFilterList = useMemo(() => {
    return ["All trips", ...trips.map((t) => t.title || "Untitled Trip")];
  }, [trips]);

  const metrics = useBudgetMetrics(trips, activeTrip);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-[calc(100vh-4rem)] gap-2">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-text-muted font-medium tracking-wide">
          Syncing Dynamic Financial Database...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl px-4 md:px-10 py-6 space-y-8 text-left">
      <header>
        <p className="text-xs font-semibold text-sky-500 uppercase tracking-wider">
          Money
        </p>
        <h1 className="mt-1 text-3xl font-bold text-primary md:text-4xl tracking-tight font-headline">
          Budgets & spending
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          See where every dollar is going across your trips. Filter by trip to
          drill in.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-2 select-none">
          {tripFilterList.map((trip, idx) => (
            <button
              key={`${trip}-${idx}`}
              type="button"
              onClick={() => setActiveTrip(trip)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTrip === trip
                  ? "border-navy-950 bg-navy-950 text-white dark:bg-secondary dark:text-neutral-bg dark:border-secondary shadow-xs"
                  : "border-border-subtle bg-card-bg text-text-muted hover:border-slate-300 dark:hover:border-slate-600 hover:text-primary"
              }`}
            >
              {trip}
            </button>
          ))}
        </div>

        <BudgetSummary
          planned={metrics.financialSummary.planned}
          spent={metrics.financialSummary.spent}
          remaining={metrics.financialSummary.remaining}
        />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_3fr]">
          <CategoryPieChart
            data={metrics.categoryChartData}
            totalSpent={metrics.financialSummary.spent}
          />
          <TripBarChart data={metrics.barChartData} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[3fr_2fr]">
          <SpendingTimeline data={metrics.timelineChartData} />
          <TripProgressList trips={metrics.tripProgressList} />
        </section>

        <TopExpenses expenses={metrics.topExpensesList} />
      </div>
      <Footer variant="dashboard" />
    </div>
  );
}
