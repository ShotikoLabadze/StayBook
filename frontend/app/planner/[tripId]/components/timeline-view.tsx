"use client";

import { Briefcase } from "lucide-react";
import { TimelineDayBlock } from "./timeline-day-block";

interface TimelineViewProps {
  trips: any[];
}

export function TimelineView({ trips }: TimelineViewProps) {
  const safeTrips = trips || [];

  const formattedTripsAsBlocks = safeTrips.map((trip, idx) => {
    const flatActivities = (trip.itinerary || [])
      .flatMap((d: any) => d.activities || [])
      .map((act: any) => ({
        ...act,
        id: act.id || act._id,
      }));

    return {
      dayNumber: idx + 1,
      title: trip.title || "Curated Sanctuary Escape",
      date: trip.destination || "Luxury Destination",
      activities: flatActivities,
      _id: trip._id,
    };
  });

  return (
    <div className="w-full max-w-3xl mx-auto bg-card-bg border border-border-subtle rounded-3xl p-6 md:p-8 shadow-xl flex-1 flex flex-col gap-6 transition-colors duration-300">
      <div className="text-left border-b border-border-subtle pb-4">
        <h2 className="font-headline text-lg font-bold text-primary tracking-tight flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-text-muted" /> Global Workspace
          Timeline
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Chronological overview of all active bespoke travel packages and
          itineraries.
        </p>
      </div>

      <div className="flex flex-col gap-8 relative pl-4 border-l border-border-subtle text-left">
        {formattedTripsAsBlocks.map((tripAsDayBlock, idx) => (
          <div key={tripAsDayBlock._id || idx} className="relative group">
            <div className="absolute -left-[21px] top-6 w-2 h-2 rounded-full bg-border-subtle group-hover:bg-primary dark:group-hover:bg-secondary transition-colors border-2 border-card-bg" />
            <TimelineDayBlock day={tripAsDayBlock} dayIndex={idx} />
          </div>
        ))}

        {safeTrips.length === 0 && (
          <div className="text-center py-12 text-xs text-text-muted italic bg-neutral-bg/30 border border-dashed border-border-subtle rounded-2xl">
            No active trips on the timeline.
          </div>
        )}
      </div>
    </div>
  );
}
