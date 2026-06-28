import { TripData } from "@/services/tripService";
import { DollarSign, Leaf, Plane } from "lucide-react";
import { useMemo } from "react";

const categoryColors: Record<string, string> = {
  flight: "bg-primary",
  hotel: "bg-secondary",
  food: "bg-rose-400",
  activity: "bg-emerald-400",
  transport: "bg-slate-400",
};

export function useDashboardMetrics(trips: TripData[], user: any) {
  return useMemo(() => {
    let totalSpent = 0;
    let totalLimit = 0;
    const budgetMap: Record<string, number> = {};

    trips.forEach((trip) => {
      totalLimit += trip.budget?.totalLimit || 0;
      trip.itinerary?.forEach((day) => {
        day.activities?.forEach((act) => {
          const cost = act.cost || 0;
          totalSpent += cost;
          const catKey = act.category || "activity";
          budgetMap[catKey] = (budgetMap[catKey] || 0) + cost;
        });
      });
    });

    const dynamicBudgetData = Object.keys(budgetMap).map((key) => ({
      cat: key.charAt(0).toUpperCase() + key.slice(1),
      amt: `$${budgetMap[key].toLocaleString()}`,
      color: categoryColors[key] || "bg-slate-300",
    }));

    const analyticsData = [
      {
        label: "Total Spent",
        val: `$${totalSpent.toLocaleString()}`,
        icon: DollarSign,
        bg: "bg-blue-500/10 text-blue-500",
      },
      {
        label: "Miles Flown",
        val:
          trips.length > 0
            ? `${(trips.length * 3420).toLocaleString()} km`
            : "0 km",
        icon: Plane,
        bg: "bg-cyan-500/10 text-cyan-500",
      },
      {
        label: "Carbon Footprint",
        val:
          trips.length > 0
            ? `${(trips.length * 0.8).toFixed(1)} tCO2`
            : "0 tCO2",
        icon: Leaf,
        bg: "bg-emerald-500/10 text-emerald-500",
      },
    ];

    const dynamicActivities = trips
      .flatMap((trip) =>
        (trip.itinerary || []).flatMap((day) =>
          (day.activities || []).map((act) => ({
            id: act.id,
            title: `${user?.name || "Member"} registered an action`,
            desc: `${act.title} - ${trip.title || "Trip Planning"}`,
            time: "Synced",
            category: act.category,
          })),
        ),
      )
      .slice(0, 5);

    return {
      totalSpent,
      totalLimit,
      dynamicBudgetData,
      analyticsData,
      dynamicActivities,
    };
  }, [trips, user]);
}
