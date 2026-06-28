"use client";

import { useAuth } from "@/context/AuthContext";
import { destinationService, Hotel } from "@/services/destinationService";
import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export function useExploreHotels() {
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
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchTerm, setSearchTerm] = useState<string>(
    () => searchParams?.get("search") || "",
  );

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

  return {
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
    currentFilters,
    setCurrentFilters,
    favoriteHotels,
  };
}
