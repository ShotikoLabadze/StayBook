"use client";

import { Calendar, MapPin, Search, Users } from "lucide-react";

export default function SearchHeader() {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
          Find your sanctuary.
        </h1>
        <p className="mt-1 text-sm font-medium text-secondary">
          428 luxury destinations available in Santorini, Greece
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs md:flex-row md:items-center">
        <div className="flex-1 px-3 py-1.5 text-left">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Destination
          </label>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-primary font-semibold">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              defaultValue="Santorini, Greece"
              className="w-full bg-transparent border-none p-0 text-sm font-semibold text-primary focus:outline-none focus:ring-0 placeholder:text-slate-400"
              placeholder="Where to?"
            />
          </div>
        </div>

        <div className="hidden h-10 w-px bg-slate-100 md:block shrink-0" />

        <div className="flex-1 px-3 py-1.5 text-left">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Dates
          </label>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-primary font-semibold">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              defaultValue="Jun 12 – Jun 18, 2026"
              className="w-full bg-transparent border-none p-0 text-sm font-semibold text-primary focus:outline-none focus:ring-0 placeholder:text-slate-400"
              placeholder="When?"
            />
          </div>
        </div>

        <div className="hidden h-10 w-px bg-slate-100 md:block shrink-0" />

        <div className="flex-1 px-3 py-1.5 text-left">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Guests
          </label>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-primary font-semibold">
            <Users className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              defaultValue="2 Adults, 1 Child"
              className="w-full bg-transparent border-none p-0 text-sm font-semibold text-primary focus:outline-none focus:ring-0 placeholder:text-slate-400"
              placeholder="Who is coming?"
            />
          </div>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/95 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/10 transition-all cursor-pointer tracking-wide shrink-0">
          <Search className="h-4 w-4 text-secondary stroke-[2.5]" />
          Search
        </button>
      </div>
    </div>
  );
}
