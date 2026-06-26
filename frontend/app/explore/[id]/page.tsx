"use client";

import Footer from "@/components/Footer";
import {
  Destination,
  destinationService,
  Hotel,
} from "@/services/destinationService";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BookingCard from "./components/BookingCard";
import HotelAmenities from "./components/HotelAmenities";
import HotelDescription from "./components/HotelDescription";
import HotelHero from "./components/HotelHero";
import HotelReviews from "./components/HotelReviews";

const HotelMap = dynamic(() => import("./components/HotelMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-card-bg border border-border-subtle rounded-3xl animate-pulse flex items-center justify-center text-xs text-text-muted font-bold">
      Opening sanctuary gates...
    </div>
  ),
});

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HotelDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id;

  const router = useRouter();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        setIsLoading(true);

        const allHotels =
          await destinationService.getHotelsByDestination("all");

        const foundHotel = allHotels.find(
          (h) => h._id === id || h.id === id || h.destinationId === id,
        );

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
            d.id === foundHotel.destinationId ||
            d._id === foundHotel.destinationId,
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
      <div className="flex items-center justify-center flex-1 h-[calc(100vh-4rem)] transition-colors duration-300">
        <div className="text-sm font-bold text-text-muted animate-pulse">
          Opening sanctuary doors...
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-[calc(100vh-4rem)] space-y-4 transition-colors duration-300">
        <div className="text-sm font-semibold text-red-500">{error}</div>
        <button
          onClick={() => router.push("/explore")}
          className="text-xs font-bold text-primary bg-card-bg border border-border-subtle px-4 py-2 rounded-xl shadow-xs cursor-pointer hover:bg-neutral-bg transition-all"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <main className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-left">
      <HotelHero hotel={hotel} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        <div className="lg:col-span-8 space-y-8">
          <HotelDescription hotel={hotel} />

          <HotelAmenities hotel={hotel} />

          <HotelMap hotel={hotel} />

          <HotelReviews hotel={hotel} />
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-24 z-20">
          <BookingCard hotel={hotel} />
        </div>
      </div>
      <Footer variant="dashboard" />
    </main>
  );
}
