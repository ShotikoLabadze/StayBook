"use client";

import { Destination } from "@/services/destinationService";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";

interface CuratedDestinationsProps {
  destinations: Destination[];
  isLoading: boolean;
  error: string | null;
}

export function CuratedDestinations({
  destinations,
  isLoading,
  error,
}: CuratedDestinationsProps) {
  return (
    <section className="py-20 px-6 lg:px-16 max-w-6xl mx-auto space-y-12">
      <div className="space-y-2 text-left">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Curated Destinations
        </h2>
        <p className="text-sm text-slate-500 max-w-md">
          Our team of travel experts handselects every luxury experience to
          ensure your journey is perfect.
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm font-medium text-left">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[4/5] w-full rounded-2xl bg-slate-200" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
              </div>
            ))
          : destinations.map((dest) => {
              const destinationId = dest.id || dest._id;

              return (
                <Link
                  key={dest._id}
                  href={`/explore/${destinationId}`}
                  className="group cursor-pointer space-y-4 text-left block"
                >
                  <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide text-primary shadow-sm">
                      ${dest.pricePerNight}/night
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline font-semibold text-lg text-primary group-hover:text-secondary transition-colors">
                      {dest.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {dest.region},{" "}
                        {dest.country}
                      </p>
                      <span className="text-xs font-semibold text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" /> {dest.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
