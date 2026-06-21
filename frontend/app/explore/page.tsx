"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { destinationService, Hotel } from "@/services/destinationService";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
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

const ITEMS_PER_PAGE = 6;

function ExplorePageContent() {
  const searchParams = useSearchParams();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>(() => {
    return searchParams?.get("search") || "";
  });

  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);

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
    const querySearch = searchParams?.get("search");
    if (querySearch !== null && querySearch !== undefined) {
      setSearchTerm(querySearch);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, currentFilters]);

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

  const totalItems = hotels.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentHotels = hotels.slice(indexOfFirstItem, indexOfLastItem);

  return (
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

        <div className="xl:col-span-8 w-full flex flex-col gap-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[...Array(6)].map((_, i) => (
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {currentHotels.map((hotel) => (
                  <HotelCard
                    key={hotel._id}
                    id={hotel.id || hotel._id}
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

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 pt-10 mt-6 border-t border-slate-100 w-full select-none">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-primary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all cursor-pointer shadow-3xs"
                    aria-label="Previous page"
                  >
                    <svg
                      className="w-4 h-4 stroke-[2.5]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>

                  <span className="text-xs font-bold text-primary font-headline tracking-wide">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-primary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all cursor-pointer shadow-3xs"
                    aria-label="Next page"
                  >
                    <svg
                      className="w-4 h-4 stroke-[2.5]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <ExploreMap hotels={hotels} />
          )}
        </div>
      </div>

      <Footer variant="dashboard" />
    </div>
  );
}

export default function ExplorePage() {
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

        <Suspense
          fallback={
            <div className="p-10 text-center text-xs font-bold text-slate-400 animate-pulse">
              Syncing workspace query filters...
            </div>
          }
        >
          <ExplorePageContent />
        </Suspense>
      </main>
    </div>
  );
}
