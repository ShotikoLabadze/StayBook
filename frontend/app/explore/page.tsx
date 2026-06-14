"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import {
  Destination,
  destinationService,
  Hotel,
} from "@/services/destinationService";
import { useEffect, useState } from "react";
import FilterSidebar from "./components/FilterSidebar";
import HotelCard from "./components/HotelCard";
import SearchHeader from "./components/SearchHeader";

export default function ExplorePage() {
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [hotelsData, destsData] = await Promise.all([
          destinationService.getHotelsByDestination("all"),
          destinationService.getAll(),
        ]);
        setAllHotels(hotelsData);
        setAllDestinations(destsData);
        setFilteredHotels(hotelsData);
      } catch (err) {
        console.error("Failed to load initial explore data:", err);
        setError("Unable to find luxury sanctuaries right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleFilterChange = (filters: {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    rating: number | null;
    weather: string[];
    durations: string[];
    activities: string[];
    propertyTypes: string[];
  }) => {
    let result = [...allHotels];

    result = result.filter(
      (hotel) =>
        hotel.pricePerNight >= filters.minPrice &&
        hotel.pricePerNight <= filters.maxPrice,
    );

    if (filters.rating !== null) {
      result = result.filter((hotel) => hotel.rating >= filters.rating!);
    }

    if (filters.propertyTypes.length > 0) {
      result = result.filter((hotel) =>
        filters.propertyTypes.includes(hotel.propertyType),
      );
    }

    if (
      filters.categories.length > 0 ||
      filters.weather.length > 0 ||
      filters.durations.length > 0 ||
      filters.activities.length > 0
    ) {
      result = result.filter((hotel) => {
        const matchedDest = allDestinations.find(
          (d) => d.slug === hotel.destinationId || d.id === hotel.destinationId,
        );
        if (!matchedDest) return false;

        const matchesCategory =
          filters.categories.length === 0 ||
          filters.categories.includes(matchedDest.category);

        const matchesWeather =
          filters.weather.length === 0 ||
          filters.weather.includes((matchedDest as any).weather?.condition);

        const matchesDuration =
          filters.durations.length === 0 ||
          filters.durations.includes((matchedDest as any).duration);

        const matchesActivities =
          filters.activities.length === 0 ||
          (matchedDest as any).activities?.some((act: string) =>
            filters.activities.includes(act),
          );

        return (
          matchesCategory &&
          matchesWeather &&
          matchesDuration &&
          matchesActivities
        );
      });
    }

    setFilteredHotels(result);
  };

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
          <SearchHeader resultsCount={filteredHotels.length} />

          {error && (
            <div className="text-red-500 text-xs font-semibold text-left">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start flex-1 w-full">
            <div className="xl:col-span-4">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>

            <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white border border-slate-100 rounded-3xl h-[420px] w-full"
                  />
                ))
              ) : filteredHotels.length === 0 ? (
                <div className="col-span-2 text-center py-20 text-slate-400 font-medium text-sm">
                  No luxury properties match your selected filters.
                </div>
              ) : (
                filteredHotels.map((hotel) => (
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
                ))
              )}
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
