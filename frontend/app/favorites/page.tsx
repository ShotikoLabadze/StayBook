"use client";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { HeartCrack, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import HotelCard from "../explore/components/HotelCard";

interface FavoriteHotel {
  _id: string;
  id?: string;
  name: string;
  neighborhood?: string;
  location?: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  image: string;
  tags?: string[];
  features?: string[];
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favoriteHotels, setFavoriteHotels] = useState<FavoriteHotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const currentUserId = user?._id || user?.id;

    if (currentUserId) {
      userService
        .getFavorites(currentUserId.toString())
        .then((data) => {
          setFavoriteHotels(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Failed to fetch favorite hotels:", err))
        .finally(() => setLoading(false));
    } else if (!user) {
      setLoading(false);
    }
  }, [user]);

  const handleFavoriteToggle = async (hotelId: string) => {
    const currentUserId = user?._id || user?.id;
    if (!currentUserId) return;

    try {
      await userService.toggleFavorite(currentUserId.toString(), hotelId);

      setFavoriteHotels((prev) =>
        prev.filter((hotel) => {
          const id = hotel._id || hotel.id;
          return id?.toString() !== hotelId.toString();
        }),
      );
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-[calc(100vh-5rem)] gap-2">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-text-muted font-medium tracking-wide">
          Syncing your favorite sanctuaries...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-6 md:space-y-8 max-w-7xl w-full mx-auto flex-1 flex flex-col text-left">
      <header>
        <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
          Sanctuaries
        </p>
        <h1 className="mt-1 text-3xl font-bold text-primary md:text-4xl tracking-tight font-headline">
          Favorite Places
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Your curated collection of luxury hotels and destinations.
        </p>
      </header>

      {favoriteHotels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border-subtle rounded-3xl bg-card-bg/20 gap-4">
          <div className="p-4 bg-rose-500/5 text-rose-500 rounded-full">
            <HeartCrack className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-sm font-semibold text-primary">
              No favorites yet
            </p>
            <p className="text-xs text-text-muted max-w-xs px-4">
              Tap the heart icon on any luxury property while exploring to save
              it here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {favoriteHotels.map((hotel) => {
            const hotelId = hotel._id || hotel.id;
            if (!hotelId) return null;

            return (
              <HotelCard
                key={hotelId}
                id={hotelId}
                title={hotel.name}
                location={
                  hotel.neighborhood || hotel.location || "Luxury Destination"
                }
                rating={hotel.rating}
                reviews={hotel.reviewCount}
                price={hotel.pricePerNight}
                image={hotel.image}
                features={hotel.tags || hotel.features || []}
                initiallyFavorited={true}
                onFavoriteToggle={() => handleFavoriteToggle(hotelId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
