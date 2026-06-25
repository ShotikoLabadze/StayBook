"use client";

import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { destinationService, Hotel } from "@/services/destinationService";
import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import FilterSidebar from "./components/FilterSidebar";
import HotelCard from "./components/HotelCard";
import SearchHeader from "./components/SearchHeader";

const ExploreMap = dynamic(() => import("./components/ExploreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] bg-neutral-bg border border-border-subtle animate-pulse rounded-3xl flex items-center justify-center text-xs font-bold text-text-muted">
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
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const userId = user?.id || user?._id;

  const { data: favoriteHotels = [] } = useQuery({
    queryKey: ["user-favorites", userId],
    queryFn: () => userService.getFavorites(userId),
    enabled: !!userId,
  });

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(
    () => searchParams?.get("search") || "",
  );
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
    const fetchFilteredData = () => {
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
        if (currentFilters.propertyTypes.length > 0)
          queryParams.propertyTypes = currentFilters.propertyTypes.join(",");

        destinationService
          .getHotelsByDestination("all", queryParams)
          .then((data) => setHotels(data))
          .catch((err) => {
            console.error("Failed to load filtered hotels:", err);
            setError("Unable to sync with luxury database right now.");
          })
          .finally(() => setIsLoading(false));
      } catch (err) {
        console.error("Failed to load filtered hotels:", err);
        setError("Unable to sync with luxury database right now.");
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
    <div className="p-6 md:p-10 space-y-6 md:space-y-8 max-w-7xl w-full mx-auto flex-1 flex flex-col transition-colors duration-300">
      <SearchHeader
        resultsCount={hotels.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="flex xl:hidden justify-start">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-card-bg border border-border-subtle hover:bg-neutral-bg text-primary text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted" />
          <span>Filters</span>
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-xs font-semibold text-left">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-10 items-start flex-1 w-full">
        <div className="xl:col-span-4">
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={setCurrentFilters}
          />
        </div>

        <div className="xl:col-span-8 w-full flex flex-col gap-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-card-bg border border-border-subtle rounded-3xl h-[420px] w-full"
                />
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-20 text-text-muted font-medium text-sm">
              No luxury properties found matching these parameters.
            </div>
          ) : viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {currentHotels.map((hotel) => {
                  const targetHotelId = hotel._id || hotel.id;
                  const isFavorited =
                    Array.isArray(favoriteHotels) &&
                    favoriteHotels.some(
                      (fav: any) =>
                        (fav._id || fav.id || fav).toString() ===
                        targetHotelId?.toString(),
                    );

                  return (
                    <HotelCard
                      key={targetHotelId}
                      id={targetHotelId}
                      title={hotel.name}
                      location={hotel.neighborhood}
                      rating={hotel.rating}
                      reviews={hotel.reviewCount}
                      price={hotel.pricePerNight}
                      image={hotel.image}
                      features={hotel.tags}
                      initiallyFavorited={isFavorited}
                    />
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 pt-10 mt-6 border-t border-border-subtle w-full select-none">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle bg-card-bg text-text-muted hover:bg-neutral-bg hover:text-primary disabled:opacity-30 disabled:hover:bg-card-bg disabled:hover:text-text-muted transition-all cursor-pointer shadow-3xs"
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
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle bg-card-bg text-text-muted hover:bg-neutral-bg hover:text-primary disabled:opacity-30 disabled:hover:bg-card-bg disabled:hover:text-text-muted transition-all cursor-pointer shadow-3xs"
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
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs font-bold text-text-muted animate-pulse">
          Syncing workspace query filters...
        </div>
      }
    >
      <ExplorePageContent />
    </Suspense>
  );
}
