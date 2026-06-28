import { TripData } from "@/services/tripService";
import { useMemo } from "react";

const categoryColors: Record<string, string> = {
  flight: "#00668a",
  hotel: "#131b2e",
  food: "#f59e0b",
  activity: "#009668",
  transport: "#64748b",
  other: "#76777d",
};

export function useBudgetMetrics(trips: TripData[], activeTrip: string) {
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

  return {
    financialSummary,
    categoryChartData,
    barChartData,
    timelineChartData,
    tripProgressList,
    topExpensesList,
  };
}
