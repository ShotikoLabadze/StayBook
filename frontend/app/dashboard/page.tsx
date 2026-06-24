"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { DollarSign, Leaf, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import AnalyticsWidget, { AnalyticItem } from "./components/AnalyticsWidget";
import BudgetOverview from "./components/BudgetOverview";
import DashboardHeader from "./components/DashboardHeader";
import RecentActivity from "./components/RecentActivity";
import TripCard from "./components/TripCard";
import WelcomeBanner from "./components/WelcomeBanner";

import { TripData, tripService } from "@/services/tripService";

const categoryColors: Record<string, string> = {
  flight: "bg-primary",
  hotel: "bg-secondary",
  food: "bg-rose-400",
  activity: "bg-emerald-400",
  transport: "bg-slate-400",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const data = await tripService.getAll();
        setTrips(data);
      } catch (err) {
        console.error("Failed to load user trips:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTrips();
    }
  }, [user]);

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

  const analyticsData: AnalyticItem[] = [
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
        trips.length > 0 ? `${(trips.length * 0.8).toFixed(1)} tCO2` : "0 tCO2",
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

  return (
    <div className="min-h-screen bg-neutral-bg font-body flex transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userAvatar={user?.avatar} />

        <div className="p-10 space-y-10 max-w-7xl w-full mx-auto flex-1">
          <WelcomeBanner userName={user?.name} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-sm font-bold text-primary tracking-tight">
                  Upcoming Trips
                </h2>
                <button className="text-xs font-semibold text-secondary hover:underline cursor-pointer">
                  View all
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-card-bg border border-border-subtle p-4 h-64 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : trips.length === 0 ? (
                <div className="bg-card-bg border border-border-subtle rounded-2xl p-8 text-center text-sm text-text-muted font-medium">
                  No upcoming trips found. Start planning your next adventure!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {trips.slice(0, 2).map((trip) => {
                    const start = new Date(trip.startDate);
                    const today = new Date();
                    const diffTime = start.getTime() - today.getTime();
                    const daysLeft = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24),
                    );

                    const dateString = `${new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

                    const imageFallback = trip.title
                      ?.toLowerCase()
                      .includes("amalfi")
                      ? "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=600&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop";

                    return (
                      <TripCard
                        key={trip._id}
                        id={trip._id}
                        title={trip.title || "Untitled Trip"}
                        dates={dateString}
                        progress={
                          trip.title?.toLowerCase().includes("amalfi") ? 75 : 35
                        }
                        daysLeft={daysLeft > 0 ? daysLeft : 0}
                        image={imageFallback}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-headline text-sm font-bold text-primary tracking-tight">
                Analytics
              </h2>
              <AnalyticsWidget items={analyticsData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <BudgetOverview
                data={dynamicBudgetData}
                totalLimit={totalLimit}
                totalSpent={totalSpent}
              />
            </div>
            <div className="lg:col-span-6">
              <RecentActivity activities={dynamicActivities} />
            </div>
          </div>

          <Footer variant="dashboard" />
        </div>
      </main>
    </div>
  );
}
