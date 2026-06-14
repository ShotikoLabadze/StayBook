"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { destinationService, Hotel } from "@/services/destinationService";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import FilterSidebar from "./components/FilterSidebar";
import HotelCard from "./components/HotelCard";
import SearchHeader from "./components/SearchHeader";

const ExploreMap = dynamic(() => import("./components/ExploreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center text-xs font-bold text-slate-400">
      Loading luxury interactive map...
    </div>
  ),
});

interface ActiveFilters {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  weather: string[];
  durations: string[];
  activities: string[];
  propertyTypes: string[];
}

export default function ExplorePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const [currentFilters, setCurrentFilters] = useState<ActiveFilters>({
    categories: [],
    minPrice: 480,
    maxPrice: 2450,
    rating: null,
    weather: [],
    durations: [],
    activities: [],
    propertyTypes: [],
  });

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setIsLoading(true);

        const queryParams: any = {
          search: searchTerm,
          sortBy: sortBy,
          minPrice: currentFilters.minPrice,
          maxPrice: currentFilters.maxPrice,
        };

        if (currentFilters.rating) queryParams.rating = currentFilters.rating;

        if (currentFilters.categories.length > 0)
          queryParams.categories = currentFilters.categories.join(",");
        if (currentFilters.weather.length > 0)
          queryParams.weather = currentFilters.weather.join(",");
        if (currentFilters.durations.length > 0)
          queryParams.durations = currentFilters.durations.join(",");
        if (currentFilters.activities.length > 0)
          queryParams.activities = currentFilters.activities.join(",");
        if (currentFilters.propertyTypes.length > 0) {
          queryParams.propertyTypes = currentFilters.propertyTypes.join(",");
        }

        const data = await destinationService.getHotelsByDestination(
          "all",
          queryParams,
        );
        setHotels(data);
      } catch (err) {
        console.error("Failed to load filtered hotels:", err);
        setError("Unable to sync with luxury database right now.");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, sortBy, currentFilters]);

  return (
    <div className="min-h-screen bg-neutral-bg font-body flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 px-10 py-5 flex items-center justify-end sticky top-0 z-40 h-[65px]">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100 shadow-sm cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <div className="p-10 space-y-8 max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <SearchHeader
            resultsCount={hotels.length}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {error && (
            <div className="text-red-500 text-xs font-semibold text-left">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start flex-1 w-full">
            <div className="xl:col-span-4">
              <FilterSidebar onFilterChange={setCurrentFilters} />
            </div>

            <div className="xl:col-span-8 w-full">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-white border border-slate-100 rounded-3xl h-[420px] w-full"
                    />
                  ))}
                </div>
              ) : hotels.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium text-sm">
                  No luxury properties found matching these parameters.
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {hotels.map((hotel) => (
                    <HotelCard
                      key={hotel._id}
                      title={hotel.name}
                      location={hotel.neighborhood}
                      rating={hotel.rating}
                      reviews={hotel.reviewCount}
                      price={hotel.pricePerNight}
                      image={hotel.image}
                      features={hotel.tags}
                    />
                  ))}
                </div>
              ) : (
                <ExploreMap hotels={hotels} />
              )}
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
