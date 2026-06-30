"use client";

import { useAuth } from "@/context/AuthContext";
import { TripData, tripService } from "@/services/tripService";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDashboardMetrics } from "./hooks/useDashboardMetrics";

import Footer from "@/components/Footer";
import AnalyticsWidget from "./components/AnalyticsWidget";
import BudgetOverview from "./components/BudgetOverview";
import RecentActivity from "./components/RecentActivity";
import TripCard from "./components/TripCard";
import WelcomeBanner from "./components/WelcomeBanner";

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      tripService
        .getAll()
        .then((data) => setTrips(data))
        .catch((err) => console.error("Failed to load user trips:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const metrics = useDashboardMetrics(trips, user);

  return (
    <div className="p-10 space-y-10 max-w-7xl w-full mx-auto flex-1">
      <WelcomeBanner userName={user?.name} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-sm font-bold text-primary tracking-tight">
              Upcoming Trips
            </h2>
            <Link
              href="/planner?tab=trips"
              className="text-xs font-semibold text-secondary hover:underline cursor-pointer decoration-none"
            >
              View all
            </Link>
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
                const daysLeft = Math.ceil(
                  (start.getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                const dateString = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

                let hotelImage: string | undefined;
                trip.itinerary?.forEach((day) => {
                  day.activities?.forEach((activity) => {
                    if (activity.category === "hotel" && activity.image) {
                      hotelImage = activity.image;
                    }
                  });
                });

                const searchableText =
                  `${trip.title || ""} ${trip.destination || ""}`.toLowerCase();

                const imageFallback =
                  hotelImage ||
                  (searchableText.includes("paris")
                    ? "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop"
                    : searchableText.includes("kyoto")
                      ? "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop"
                      : searchableText.includes("amalfi")
                        ? "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=600&auto=format&fit=crop"
                        : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop");

                return (
                  <TripCard
                    key={trip._id}
                    id={trip._id}
                    title={trip.title || "Untitled Trip"}
                    dates={dateString}
                    itinerary={trip.itinerary || []}
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
          <AnalyticsWidget items={metrics.analyticsData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <BudgetOverview
            tripId={trips[0]?._id || ""}
            data={metrics.dynamicBudgetData}
            totalLimit={metrics.totalLimit}
            totalSpent={metrics.totalSpent}
          />
        </div>
        <div className="lg:col-span-6">
          <RecentActivity activities={metrics.dynamicActivities} />
        </div>
      </div>
      <Footer variant="dashboard" />
    </div>
  );
}
