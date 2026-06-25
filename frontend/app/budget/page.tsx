"use client";

import { useAuth } from "@/context/AuthContext";
import { TripData, tripService } from "@/services/tripService";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import BudgetSummary from "./components/BudgetSummary";
import CategoryPieChart from "./components/CategoryPieChart";
import SpendingTimeline from "./components/SpendingTimeline";
import TopExpenses from "./components/TopExpenses";
import TripBarChart from "./components/TripBarChart";
import TripProgressList from "./components/TripProgressList";

const categoryColors: Record<string, string> = {
  flight: "#00668a",
  hotel: "#131b2e",
  food: "#f59e0b",
  activity: "#009668",
  transport: "#64748b",
  other: "#76777d",
};

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

  const filteredTrips = useMemo(() => {
    if (activeTrip === "All trips") return trips;
    return trips.filter((t) => t.title === activeTrip);
  }, [trips, activeTrip]);

  const financialSummary = useMemo(() => {
    let planned = 0;
    let spent = 0;
    filteredTrips.forEach((trip) => {
      planned += trip.budget?.totalLimit || 0;
      trip.itinerary?.forEach((day) => {
        day.activities?.forEach((act) => {
          spent += act.cost || 0;
        });
      });
    });
    return { planned, spent, remaining: Math.max(planned - spent, 0) };
  }, [filteredTrips]);

  const categoryChartData = useMemo(() => {
    const map: Record<string, number> = {
      flight: 0,
      hotel: 0,
      food: 0,
      activity: 0,
      other: 0,
    };
    let total = 0;

    filteredTrips.forEach((trip) => {
      trip.itinerary?.forEach((day) => {
        day.activities?.forEach((act) => {
          const cat = act.category?.toLowerCase() || "other";
          const cost = act.cost || 0;
          const targetKey = map[cat] !== undefined ? cat : "other";
          map[targetKey] += cost;
          total += cost;
        });
      });
    });

    if (total === 0) {
      return [
        { name: "flights", value: 0, color: categoryColors.flight },
        { name: "hotels", value: 0, color: categoryColors.hotel },
        { name: "dining", value: 0, color: categoryColors.food },
        { name: "activities", value: 0, color: categoryColors.activity },
        { name: "other", value: 100, color: categoryColors.other },
      ];
    }

    return [
      {
        name: "flights",
        value: Math.round((map.flight / total) * 100),
        color: categoryColors.flight,
      },
      {
        name: "hotels",
        value: Math.round((map.hotel / total) * 100),
        color: categoryColors.hotel,
      },
      {
        name: "dining",
        value: Math.round((map.food / total) * 100),
        color: categoryColors.food,
      },
      {
        name: "activities",
        value: Math.round((map.activity / total) * 100),
        color: categoryColors.activity,
      },
      {
        name: "other",
        value: Math.round((map.other / total) * 100),
        color: categoryColors.other,
      },
    ].filter((item) => item.value > 0);
  }, [filteredTrips]);

  const barChartData = useMemo(() => {
    return filteredTrips.map((trip) => {
      let spent = 0;
      trip.itinerary?.forEach((day) => {
        day.activities?.forEach((act) => {
          spent += act.cost || 0;
        });
      });
      return {
        name: trip.title
          ? trip.title.length > 15
            ? `${trip.title.slice(0, 12)}...`
            : trip.title
          : "Untitled",
        planned: trip.budget?.totalLimit || 0,
        spent,
      };
    });
  }, [filteredTrips]);

  const timelineChartData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    filteredTrips.forEach((trip) => {
      trip.itinerary?.forEach((day) => {
        day.activities?.forEach((act) => {
          if (act.cost) {
            const dateStr = day.date
              ? new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Planned Step";
            dateMap[dateStr] = (dateMap[dateStr] || 0) + act.cost;
          }
        });
      });
    });

    const sortedDates = Object.keys(dateMap);
    let cumulative = 0;
    return sortedDates.map((date) => {
      cumulative += dateMap[date];
      return { date, Cumulative: cumulative, Daily: dateMap[date] };
    });
  }, [filteredTrips]);

  const tripProgressList = useMemo(() => {
    return filteredTrips.map((trip) => {
      let spent = 0;
      const nights = trip.itinerary?.length || 0;
      trip.itinerary?.forEach((day) => {
        day.activities?.forEach((act) => {
          spent += act.cost || 0;
        });
      });

      const planned = trip.budget?.totalLimit || 1;
      const progress = Math.min(Math.round((spent / planned) * 100), 100);

      return {
        id: trip._id,
        name: trip.title || "Untitled Sanctuary",
        status:
          new Date(trip.startDate) > new Date() ? "upcoming" : "completed",
        nights,
        spent,
        planned: trip.budget?.totalLimit || 0,
        progress,
        color:
          progress > 90
            ? "bg-rose-500"
            : progress > 50
              ? "bg-amber-500"
              : "bg-emerald-500",
      };
    });
  }, [filteredTrips]);

  const topExpensesList = useMemo(() => {
    const list: any[] = [];
    filteredTrips.forEach((trip) => {
      trip.itinerary?.forEach((day) => {
        day.activities?.forEach((act) => {
          if (act.cost) {
            list.push({
              title: act.title,
              location: trip.title || "Workspace Route",
              date: day.date
                ? new Date(day.date).toISOString().split("T")[0]
                : "Synced",
              amount: act.cost,
            });
          }
        });
      });
    });
    return list.sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [filteredTrips]);

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
          {tripFilterList.map((trip, idx) => {
            const isActive = activeTrip === trip;
            return (
              <button
                key={`${trip}-${idx}`}
                type="button"
                onClick={() => setActiveTrip(trip)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "border-navy-950 bg-navy-950 text-white dark:bg-secondary dark:text-neutral-bg dark:border-secondary shadow-xs"
                    : "border-border-subtle bg-card-bg text-text-muted hover:border-slate-300 dark:hover:border-slate-600 hover:text-primary"
                }`}
              >
                {trip}
              </button>
            );
          })}
        </div>

        <BudgetSummary
          planned={financialSummary.planned}
          spent={financialSummary.spent}
          remaining={financialSummary.remaining}
        />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_3fr]">
          <CategoryPieChart
            data={categoryChartData}
            totalSpent={financialSummary.spent}
          />
          <TripBarChart data={barChartData} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[3fr_2fr]">
          <SpendingTimeline data={timelineChartData} />
          <TripProgressList trips={tripProgressList} />
        </section>

        <TopExpenses expenses={topExpensesList} />
      </div>
    </div>
  );
}
