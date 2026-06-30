"use client";

import { tripService } from "@/services/tripService";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface TripsViewProps {
  onTripSelect: (tripId: string) => void;
}

export function TripsView({ onTripSelect }: TripsViewProps) {
  const [allTrips, setAllTrips] = useState<any[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  useEffect(() => {
    tripService
      .getAll()
      .then((data) => setAllTrips(data))
      .catch((err) =>
        console.error("Failed to fetch trips inside component:", err),
      )
      .finally(() => setTripsLoading(false));
  }, []);

  if (tripsLoading) {
    return (
      <div className="bg-card-bg/70 backdrop-blur-xl border border-border-subtle rounded-3xl p-8 shadow-xl flex-1 flex items-center justify-center">
        <div className="text-xs text-text-muted animate-pulse py-10">
          Loading itineraries...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-bg/70 backdrop-blur-xl border border-border-subtle rounded-3xl p-8 shadow-xl flex-1 flex flex-col text-left transition-colors duration-300">
      <div className="mb-6 border-b border-border-subtle pb-4">
        <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
          Your Travel Workspace
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Select an active itinerary to switch between your curated plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full mx-auto">
        {allTrips.map((trip) => {
          let hotelImage: string | undefined;
          trip.itinerary?.forEach((day: any) => {
            day.activities?.forEach((activity: any) => {
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
            <div
              key={trip._id}
              onClick={() => onTripSelect(trip._id)}
              className="p-5 bg-card-bg border border-border-subtle rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-5 group cursor-pointer w-full max-w-lg mx-auto"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-bg shrink-0 border border-border-subtle shadow-2xs">
                <img
                  src={imageFallback}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-2 min-w-0 flex-1 py-1">
                <h3 className="text-sm font-bold text-primary transition-colors group-hover:text-secondary line-clamp-2 leading-snug">
                  {trip.title}
                </h3>
                <div className="flex flex-col gap-1.5 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                    {trip.destination || "Luxury Sanctuary"}
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    {trip.itinerary?.length || 0} Days
                  </span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary dark:group-hover:text-secondary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
