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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTrips.map((trip) => (
          <div
            key={trip._id}
            onClick={() => onTripSelect(trip._id)}
            className="p-5 bg-card-bg border border-border-subtle rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1.5 max-w-[80%]">
              <h3 className="text-sm font-bold text-primary transition-colors truncate">
                {trip.title}
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{" "}
                  {trip.destination || "Luxury Sanctuary"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {trip.itinerary?.length || 0}{" "}
                  Days
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary dark:group-hover:text-secondary group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}
