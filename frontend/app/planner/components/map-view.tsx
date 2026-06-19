"use client";

import { MapPin, Navigation } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  time?: string;
  category: string;
}

interface Day {
  dayNumber: number;
  title: string;
  date: string;
  activities: Activity[];
}

interface MapViewProps {
  itinerary: Day[];
}

export function MapView({ itinerary }: MapViewProps) {
  const allLocations = itinerary.flatMap((d) => d.activities);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50 flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px] w-full">
      <div className="w-full lg:w-80 flex flex-col gap-4 border-r border-slate-100 pr-0 lg:pr-6">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" /> Route Itinerary
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Map viewpoints organized by day blocks.
          </p>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-1 no-scrollbar">
          {itinerary.map((day) => (
            <div key={day.dayNumber} className="space-y-2">
              <div className="flex items-center gap-2 text-left bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                  {day.dayNumber}
                </span>
                <span className="text-[11px] font-bold text-slate-700 truncate">
                  {day.title}
                </span>
              </div>

              <div className="pl-3 border-l-2 border-slate-100 space-y-1.5 text-left">
                {day.activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                  >
                    <MapPin className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="text-[11px] text-slate-600 font-medium truncate">
                      {act.title}
                    </span>
                  </div>
                ))}
                {day.activities.length === 0 && (
                  <p className="text-[10px] text-slate-400 italic pl-5">
                    No stops pinned.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center text-center p-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="space-y-2 z-10">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-lg font-bold shadow-2xs">
            🗺️
          </div>
          <h4 className="text-xs font-bold text-slate-800">
            Interactive Map Workspace
          </h4>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Ready for Leaflet integrations with {allLocations.length} active
            waypoint coordinates.
          </p>
        </div>
      </div>
    </div>
  );
}
