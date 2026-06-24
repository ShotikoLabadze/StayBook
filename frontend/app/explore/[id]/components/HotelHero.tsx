"use client";

import { Hotel } from "@/services/destinationService";
import { ArrowLeft, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HotelHeroProps {
  hotel: Hotel;
}

export default function HotelHero({ hotel }: HotelHeroProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <section className="relative w-full h-[480px] rounded-3xl overflow-hidden shadow-xs bg-neutral-bg transition-colors duration-300">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-10">
        <Link
          href="/explore"
          className="flex items-center gap-2 px-4 py-2 bg-card-bg/80 dark:bg-card-bg/90 backdrop-blur-md border border-border-subtle text-primary rounded-xl text-xs font-bold shadow-xs hover:bg-card-bg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
          Back to explore
        </Link>

        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="p-2.5 bg-card-bg/80 dark:bg-card-bg/90 backdrop-blur-md border border-border-subtle rounded-xl shadow-xs hover:bg-card-bg transition-all cursor-pointer group"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-text-muted group-hover:text-red-500"
            }`}
          />
        </button>
      </div>

      <div className="absolute bottom-6 left-8 right-8 text-left text-white space-y-2 z-10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary dark:text-neutral-bg bg-secondary/20 dark:bg-secondary backdrop-blur-xs px-2.5 py-1 rounded-md inline-block">
          {hotel.propertyType}
        </span>

        <h1 className="font-headline text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl text-white">
          {hotel.name}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
          <p className="text-xs font-medium text-slate-200 flex items-center gap-1">
            {hotel.neighborhood}
          </p>
          <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
          <div className="flex items-center gap-1.5 bg-white/10 dark:bg-slate-800/40 border border-white/10 dark:border-slate-700/30 backdrop-blur-xs px-2.5 py-1 rounded-lg w-fit">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-white">
              {hotel.rating.toFixed(2)}
            </span>
            <span className="text-[11px] font-medium text-slate-300 dark:text-slate-400">
              ({hotel.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
