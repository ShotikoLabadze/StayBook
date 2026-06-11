"use client";

import { Pencil } from "lucide-react";

interface TripHeroBannerProps {
  title: string;
  dates: string;
  image: string;
}

export default function TripHeroBanner({
  title,
  dates,
  image,
}: TripHeroBannerProps) {
  return (
    <div className="relative h-64 w-full rounded-3xl overflow-hidden bg-slate-900 shadow-sm group">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-101"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

      <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full transition-all cursor-pointer">
        <Pencil className="w-3.5 h-3.5" />
      </button>

      <div className="absolute bottom-6 left-8 text-white space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-secondary/90 text-primary font-bold tracking-widest text-[9px] px-2 py-0.5 rounded-md uppercase">
            Featured
          </span>
          <span className="text-xs font-medium text-slate-200">{dates}</span>
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}
