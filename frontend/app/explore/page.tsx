"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { destinationService, Hotel } from "@/services/destinationService";
import { useEffect, useState } from "react";
import FilterSidebar from "./components/FilterSidebar";
import HotelCard from "./components/HotelCard";
import SearchHeader from "./components/SearchHeader";

export default function ExplorePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);

        const data =
          await destinationService.getHotelsByDestination("santorini-greece");
        setHotels(data);
      } catch (err) {
        console.error("Failed to load hotels:", err);
        setError(
          "Unable to find luxury sanctuaries right now. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

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
          <SearchHeader />

          {error && (
            <div className="text-red-500 text-xs font-semibold text-left bg-red-50 p-4 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start flex-1 w-full">
            <div className="xl:col-span-4">
              <FilterSidebar />
            </div>

            <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-white border border-slate-100 rounded-3xl h-[420px] w-full"
                    />
                  ))
                : hotels.map((hotel) => (
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
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
