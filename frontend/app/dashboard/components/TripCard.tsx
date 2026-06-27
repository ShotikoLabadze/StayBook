"use client";

import { TripItineraryDay } from "@/services/tripService";
import Link from "next/link";

interface TripCardProps {
  id: string;
  title: string;
  dates: string;
  daysLeft: number;
  image: string;
  itinerary: TripItineraryDay[];
}

export default function TripCard({
  id,
  title,
  dates,
  daysLeft,
  image,
  itinerary = [],
}: TripCardProps) {
  const totalDays = itinerary.length;
  const plannedDays = itinerary.filter(
    (day) => day.activities && day.activities.length > 0,
  ).length;

  const dynamicProgress =
    totalDays > 0 ? Math.round((plannedDays / totalDays) * 100) : 0;

  return (
    <Link
      href={`/planner/${id}`}
      className="block bg-card-bg border border-border-subtle rounded-2xl p-4 space-y-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group cursor-pointer duration-300"
    >
      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-bg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-card-bg/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-primary shadow-sm border border-border-subtle">
          {daysLeft} Days Left
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="font-headline font-semibold text-sm text-primary group-hover:text-secondary transition-colors">
            {title}
          </h3>
          <p className="text-[11px] text-text-muted font-medium">{dates}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-semibold text-text-muted">
            <span>Planning Progress</span>
            <span className="text-primary">{dynamicProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${dynamicProgress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
