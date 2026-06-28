"use client";

import { Hotel } from "@/services/destinationService";
import HotelCard from "./HotelCard";

interface HotelGridProps {
  isLoading: boolean;
  hotels: Hotel[];
  favoriteHotels: any[];
  itemsPerPage: number;
}

export default function HotelGrid({
  isLoading,
  hotels,
  favoriteHotels,
  itemsPerPage,
}: HotelGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-card-bg border border-border-subtle rounded-3xl h-[420px] w-full"
          />
        ))}
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-20 text-text-muted font-medium text-sm">
        No luxury properties found matching these parameters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 w-full">
      {hotels.map((hotel) => {
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
  );
}
