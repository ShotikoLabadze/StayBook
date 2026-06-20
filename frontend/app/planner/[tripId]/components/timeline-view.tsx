"use client";

import { TimelineDayBlock } from "./timeline-day-block";

interface Day {
  dayNumber: number;
  title: string;
  date: string;
  activities: any[];
}

interface TimelineViewProps {
  itinerary: Day[];
}

export function TimelineView({ itinerary }: TimelineViewProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50 flex-1 flex flex-col gap-6 w-full">
      <div className="text-left border-b border-slate-100 pb-4">
        <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
          Trip Timeline
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Chronological schedule blocks view for streamlined planning.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {itinerary.map((day, idx) => (
          <TimelineDayBlock key={day.dayNumber} day={day} dayIndex={idx} />
        ))}
      </div>
    </div>
  );
}
