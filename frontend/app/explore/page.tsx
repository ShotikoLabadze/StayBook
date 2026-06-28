"use client";

import { SlidersHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import Footer from "@/components/Footer";
import FilterSidebar from "./components/FilterSidebar";
import HotelGrid from "./components/HotelGrid";
import Pagination from "./components/Pagination";
import SearchHeader from "./components/SearchHeader";

import { useExploreHotels } from "./hooks/useExploreHotels";

const ExploreMap = dynamic(() => import("./components/ExploreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] bg-neutral-bg border border-border-subtle animate-pulse rounded-3xl flex items-center justify-center text-xs font-bold text-text-muted">
      Loading luxury interactive map...
    </div>
  ),
});

const ITEMS_PER_PAGE = 6;

function ExplorePageContent() {
  const {
    hotels,
    isLoading,
    error,
    isFilterOpen,
    setIsFilterOpen,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    setCurrentFilters,
    favoriteHotels,
  } = useExploreHotels();

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

      <div className="flex lg:hidden justify-start">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-start flex-1 w-full">
        <div className="lg:col-span-4 w-full">
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={setCurrentFilters}
          />
        </div>

        <div className="lg:col-span-8 w-full flex flex-col gap-8">
          {viewMode === "grid" ? (
            <>
              <HotelGrid
                isLoading={isLoading}
                hotels={currentHotels}
                favoriteHotels={favoriteHotels}
                itemsPerPage={ITEMS_PER_PAGE}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                onNextPage={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
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
