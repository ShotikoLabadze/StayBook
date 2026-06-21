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
      <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-xl flex-1 flex items-center justify-center">
        <div className="text-xs text-slate-400 animate-pulse py-10">
          Loading itineraries...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50 flex-1 flex flex-col text-left">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
          Your Travel Workspace
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Select an active itinerary to switch between your curated plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTrips.map((trip) => (
          <div
            key={trip._id}
            onClick={() => onTripSelect(trip._id)}
            className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1.5 max-w-[80%]">
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                {trip.title}
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
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
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}
