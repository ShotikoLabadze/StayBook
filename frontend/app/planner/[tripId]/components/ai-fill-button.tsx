"use client";

import { tripService } from "@/services/tripService";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface AiFillButtonProps {
  currentTripId: string;
  currentTripData: any;
  onGenerationSuccess: () => void;
}

export function AiFillButton({
  currentTripId,
  currentTripData,
  onGenerationSuccess,
}: AiFillButtonProps) {
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const queryClient = useQueryClient();

  const handleAiFill = async () => {
    if (!currentTripData) return;

    try {
      setIsAiGenerating(true);

      await tripService.generateAiItinerary(currentTripId, {
        destination:
          currentTripData.destination ||
          currentTripData.title ||
          "Luxury Destination",
        durationDays: currentTripData.itinerary?.length || 3,
        budget: currentTripData.budget?.totalLimit > 7000 ? "luxury" : "medium",
      });

      await queryClient.invalidateQueries({ queryKey: ["trips"] });
      await queryClient.invalidateQueries({
        queryKey: ["trip", currentTripId],
      });

      onGenerationSuccess();
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isAiGenerating}
      onClick={handleAiFill}
      className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs border-none outline-none cursor-pointer disabled:cursor-not-allowed select-none"
    >
      {isAiGenerating ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Generating Luxury Vibe...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>AI fill itinerary</span>
        </>
      )}
    </button>
  );
}
