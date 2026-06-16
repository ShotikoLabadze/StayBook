"use client";

import api from "@/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItineraryPlannerPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        setTrip(response.data);
      } catch (error) {
        console.error("Failed to fetch trip itinerary:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTripDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0c111d] text-white">
        <p className="text-lg animate-pulse">
          Loading your custom itinerary...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c111d] p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Trip Planner Center 🗺️</h1>
      <p className="text-gray-400">
        Trip ID from MongoDB:{" "}
        <span className="text-indigo-400 font-mono">{id}</span>
      </p>

      <div className="mt-8 p-6 bg-[#161b26] rounded-xl border border-gray-800">
        <p className="text-gray-300">
          Ready to build Drag & Drop Calendar structure here!
        </p>
      </div>
    </div>
  );
}
