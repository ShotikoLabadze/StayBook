"use client";

import { Briefcase } from "lucide-react";
import { TimelineDayBlock } from "./timeline-day-block";

interface TimelineViewProps {
  trips: any[];
}

export function TimelineView({ trips }: TimelineViewProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50 flex-1 flex flex-col gap-6 w-full">
      <div className="text-left border-b border-slate-100 pb-4">
        <h2 className="font-headline text-lg font-bold text-primary tracking-tight flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-slate-700" /> Global Workspace
          Timeline
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Chronological overview of all active bespoke travel packages and
          itineraries.
        </p>
      </div>

      <div className="flex flex-col gap-8 relative pl-4 border-l border-slate-100">
        {trips.map((trip, idx) => {
          const flatActivities =
            trip.itinerary?.flatMap((d: any) => d.activities || []) || [];

          const tripAsDayBlock = {
            dayNumber: idx + 1,
            title: trip.title || "Curated Sanctuary Escape",
            date: trip.destination || "Luxury Destination",
            activities: flatActivities,
          };

          return (
            <div key={trip._id} className="relative group">
              <div className="absolute -left-[21px] top-6 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-primary transition-colors border-2 border-white" />

              <TimelineDayBlock day={tripAsDayBlock} dayIndex={idx} />
            </div>
          );
        })}

        {trips.length === 0 && (
          <div className="text-center py-12 text-xs text-slate-400 italic">
            No active trips on the timeline.
          </div>
        )}
      </div>
    </div>
  );
}
