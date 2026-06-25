"use client";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface HotelCardProps {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  priceNote?: string;
  image: string;
  features?: string[];
  initiallyFavorited?: boolean;
}

export default function HotelCard({
  id,
  title,
  location,
  rating,
  reviews,
  price,
  priceNote = "Includes taxes & fees",
  image,
  features = [],
  initiallyFavorited = false,
}: HotelCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [favorited, setFavorited] = useState(initiallyFavorited);

  useEffect(() => {
    setFavorited(initiallyFavorited);
  }, [initiallyFavorited]);

  const favoriteMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Authentication required");

      const userId = user.id || user._id;
      if (!userId) throw new Error("Authentication required");
      if (!id || id === "undefined") throw new Error("Missing hotel ID");

      return userService.toggleFavorite(userId, id);
    },
    onMutate: async () => {
      setFavorited((prev) => !prev);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user-favorites", user?.id || user?._id],
      });

      if (data.isFavorite) {
        toast.success(`Added ${title} to your luxury wishlist! ❤️`);
      } else {
        toast.info(`Removed ${title} from your wishlist.`);
      }
    },
    onError: (err: any) => {
      setFavorited((prev) => !prev);
      if (err.message === "Authentication required") {
        toast.error("Please log in to save properties.");
      } else {
        toast.error("Failed to update wishlist.");
      }
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favoriteMutation.mutate();
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-card-bg text-left shadow-xs transition-all hover:-translate-y-1 hover:shadow-md w-full duration-300">
      <div className="relative h-56 w-full overflow-hidden bg-neutral-bg">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
        />

        <button
          type="button"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavoriteClick}
          disabled={favoriteMutation.isPending}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-card-bg/95 shadow-sm backdrop-blur-xs transition hover:scale-105 cursor-pointer z-10 border-none outline-none"
        >
          <Heart
            className={
              "h-4 w-4 transition-colors " +
              (favorited ? "fill-red-500 text-red-500" : "text-text-muted")
            }
          />
        </button>

        {features.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 z-10">
            {features.map((f) => (
              <span
                key={f}
                className="rounded-lg border border-border-subtle bg-card-bg/95 px-2.5 py-1 text-[10px] font-bold text-text-muted shadow-2xs backdrop-blur-xs"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate font-headline text-lg font-bold text-primary tracking-tight">
              {title}
            </h3>
            <p className="flex items-center gap-1 text-xs font-semibold text-text-muted">
              <MapPin className="h-3.5 w-3.5 text-text-muted opacity-80" />
              {location}
            </p>
          </div>

          <div className="shrink-0 text-right space-y-0.5">
            <div className="flex items-center justify-end gap-1 text-xs font-bold text-primary">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              {rating.toFixed(2)}
            </div>
            <p className="text-[10px] font-medium text-text-muted">
              {reviews} reviews
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border-subtle pt-4">
          <div className="space-y-0.5">
            <p>
              <span className="font-headline text-xl font-bold text-primary">
                ${price.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-text-muted">
                {" "}
                / night
              </span>
            </p>
            <p className="text-[10px] font-medium text-text-muted">
              {priceNote}
            </p>
          </div>

          <Link
            href={`/explore/${id}`}
            className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold text-primary transition hover:bg-secondary/20 cursor-pointer tracking-wide flex items-center justify-center dark:bg-secondary dark:text-neutral-bg dark:hover:bg-secondary/90 decoration-none"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
