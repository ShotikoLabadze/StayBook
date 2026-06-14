"use client";

import Sidebar from "@/components/Sidebar";
import {
  Destination,
  destinationService,
  Hotel,
} from "@/services/destinationService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BookingCard from "./components/BookingCard";
import HotelDescription from "./components/HotelDescription";
import HotelHero from "./components/HotelHero";

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

export default function HotelDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        setIsLoading(true);

        const allHotels =
          await destinationService.getHotelsByDestination("all");
        const foundHotel = allHotels.find((h) => h._id === id || h.id === id);

        if (!foundHotel) {
          setError("Sanctuary not found in our database.");
          setIsLoading(false);
          return;
        }

        setHotel(foundHotel);

        const allDestinations = await destinationService.getAll();
        const matchedDest = allDestinations.find(
          (d) =>
            d.slug === foundHotel.destinationId ||
            d.id === foundHotel.destinationId,
        );

        if (matchedDest) {
          setDestination(matchedDest);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Error syncing with luxury database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center font-body">
        <div className="text-sm font-bold text-slate-400 animate-pulse">
          Opening sanctuary doors...
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-neutral-bg flex flex-col items-center justify-center font-body space-y-4">
        <div className="text-sm font-semibold text-red-500">{error}</div>
        <button
          onClick={() => router.push("/explore")}
          className="text-xs font-bold text-primary bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs cursor-pointer hover:bg-slate-50 transition-all"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg font-body flex antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
        <HotelHero hotel={hotel} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          <div className="lg:col-span-8 space-y-8">
            <HotelDescription hotel={hotel} />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-[30px] z-20">
            <BookingCard hotel={hotel} />
          </div>
        </div>
      </main>
    </div>
  );
}
