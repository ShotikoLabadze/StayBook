"use client";

import { Hotel } from "@/services/destinationService";
import {
  Car,
  Coffee,
  Dumbbell,
  Shield,
  Sparkles,
  Tv,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";

interface HotelAmenitiesProps {
  hotel: Hotel;
}

const getAmenityIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet"))
    return <Wifi className="w-4 h-4" />;
  if (lower.includes("pool") || lower.includes("swim"))
    return <Waves className="w-4 h-4" />;
  if (
    lower.includes("gym") ||
    lower.includes("fitness") ||
    lower.includes("workout")
  )
    return <Dumbbell className="w-4 h-4" />;
  if (
    lower.includes("spa") ||
    lower.includes("massage") ||
    lower.includes("sauna")
  )
    return <Sparkles className="w-4 h-4" />;
  if (lower.includes("breakfast") || lower.includes("coffee"))
    return <Coffee className="w-4 h-4" />;
  if (lower.includes("restaurant") || lower.includes("dining"))
    return <Utensils className="w-4 h-4" />;
  if (lower.includes("tv") || lower.includes("screen"))
    return <Tv className="w-4 h-4" />;
  if (lower.includes("parking") || lower.includes("car"))
    return <Car className="w-4 h-4" />;
  return <Shield className="w-4 h-4" />;
};

export default function HotelAmenities({ hotel }: HotelAmenitiesProps) {
  const amenitiesList =
    hotel.amenities && hotel.amenities.length > 0
      ? hotel.amenities
      : [
          "High-Speed Wi-Fi",
          "Infinity Pool",
          "Wellness Spa & Sauna",
          "State-of-the-art Gym",
          "Fine Dining Restaurant",
          "Bespoke Room Service",
        ];

  return (
    <div className="bg-card-bg border border-border-subtle p-7 rounded-3xl shadow-2xs space-y-5 text-left transition-colors duration-300">
      <div className="space-y-1">
        <h3 className="font-headline text-lg font-bold text-primary tracking-tight">
          What this sanctuary offers
        </h3>
        <p className="text-xs font-medium text-text-muted">
          Hand-picked premium amenities included in your luxury stay.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {amenitiesList.map((amenity, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-bg border border-border-subtle rounded-xl text-xs font-semibold text-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200"
          >
            <div className="text-secondary">{getAmenityIcon(amenity)}</div>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
