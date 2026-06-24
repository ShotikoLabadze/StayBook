"use client";

import { Grid, Map, Search } from "lucide-react";

interface SearchHeaderProps {
  resultsCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "map";
  onViewModeChange: (view: "grid" | "map") => void;
}

export default function SearchHeader({
  resultsCount,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: SearchHeaderProps) {
  return (
    <div className="space-y-5 text-left w-full transition-colors duration-300">
      <div>
        <span className="text-xs font-bold text-secondary uppercase tracking-widest font-headline block mb-1">
          Explore
        </span>
        <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
          Find your next escape
        </h1>
        <p className="mt-1 text-xs font-medium text-text-muted">
          Browse hand-picked destinations and refine by climate, budget, and the
          kind of trip you have in mind.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="relative w-full sm:w-[450px]">
          <Search className="w-4.5 h-4.5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search destinations, countries, vibes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card-bg border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-secondary transition-all text-primary placeholder:text-text-muted shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-4 ml-auto w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-neutral-bg p-1 rounded-xl text-xs font-bold text-text-muted border border-border-subtle shadow-2xs">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-card-bg text-primary shadow-2xs"
                  : "text-text-muted hover:text-primary"
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "map"
                  ? "bg-card-bg text-primary shadow-2xs"
                  : "text-text-muted hover:text-primary"
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Map
            </button>
          </div>

          <span className="text-xs font-bold text-primary shrink-0">
            {resultsCount} results
          </span>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-card-bg border border-border-subtle px-4 py-2 rounded-xl text-xs font-bold text-primary focus:outline-none shadow-2xs cursor-pointer h-[38px] dark:text-primary"
          >
            <option value="popular">Most popular</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
