"use client";

import { Grid, Map, Search } from "lucide-react";

interface SearchHeaderProps {
  resultsCount: number;
}

export default function SearchHeader({ resultsCount }: SearchHeaderProps) {
  return (
    <div className="space-y-5 text-left w-full">
      <div>
        <span className="text-xs font-bold text-secondary uppercase tracking-widest font-headline block mb-1">
          Explore
        </span>
        <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
          Find your next escape
        </h1>
        <p className="mt-1 text-xs font-medium text-slate-400">
          Browse hand-picked destinations and refine by climate, budget, and the
          kind of trip you have in mind.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="relative w-full sm:w-[450px]">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search destinations, countries, vibes..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200/70 rounded-xl text-sm font-semibold focus:outline-none focus:border-secondary transition-all text-primary placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-4 ml-auto w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-500 shadow-2xs border border-slate-200/20">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary rounded-lg shadow-2xs cursor-pointer">
              <Grid className="w-3.5 h-3.5 text-primary" /> Grid
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:text-primary transition-colors cursor-pointer">
              <Map className="w-3.5 h-3.5" /> Map
            </button>
          </div>

          <span className="text-xs font-bold text-primary shrink-0">
            {resultsCount} results
          </span>

          <select className="bg-white border border-slate-200/70 px-4 py-2 rounded-xl text-xs font-bold text-primary focus:outline-none shadow-2xs cursor-pointer h-[38px]">
            <option>Most popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Top Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
