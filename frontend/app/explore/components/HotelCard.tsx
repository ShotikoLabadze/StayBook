"use client";

import { Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";

export interface HotelCardProps {
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  priceNote?: string;
  image: string;
  features?: string[];
  initiallyFavorited?: boolean;
}

export default function HotelCard({
  title,
  location,
  rating,
  reviews,
  price,
  priceNote = "Includes taxes & fees",
  image,
  features = [],
  initiallyFavorited = false,
}: HotelCardProps) {
  const [favorited, setFavorited] = useState(initiallyFavorited);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white text-left shadow-xs transition-all hover:-translate-y-1 hover:shadow-md w-full">
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
        />

        <button
          type="button"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          onClick={() => setFavorited((v) => !v)}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-xs transition hover:scale-105 cursor-pointer z-10"
        >
          <Heart
            className={
              "h-4 w-4 transition-colors " +
              (favorited ? "fill-red-500 text-red-500" : "text-slate-600")
            }
          />
        </button>

        {features.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 z-10">
            {features.map((f) => (
              <span
                key={f}
                className="rounded-lg border border-slate-100 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-500 shadow-2xs backdrop-blur-xs"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate font-headline text-lg font-bold text-primary tracking-tight">
              {title}
            </h3>
            <p className="flex items-center gap-1 text-xs font-semibold text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-slate-300" />
              {location}
            </p>
          </div>

          <div className="shrink-0 text-right space-y-0.5">
            <div className="flex items-center justify-end gap-1 text-xs font-bold text-primary">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              {rating.toFixed(2)}
            </div>
            <p className="text-[10px] font-medium text-slate-400">
              {reviews} reviews
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
          <div className="space-y-0.5">
            <p>
              <span className="font-headline text-xl font-bold text-primary">
                ${price.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {" "}
                / night
              </span>
            </p>
            <p className="text-[10px] font-medium text-slate-400">
              {priceNote}
            </p>
          </div>
          <button
            type="button"
            className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold text-primary transition hover:bg-secondary/20 cursor-pointer tracking-wide"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
