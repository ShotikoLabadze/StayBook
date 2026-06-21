"use client";

import { tripService } from "@/services/tripService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PlannerRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectToActiveTrip = async () => {
      try {
        const trips = await tripService.getAll();

        if (trips && trips.length > 0) {
          router.replace(`/planner/${trips[0]._id}`);
        } else {
          router.replace("/explore");
        }
      } catch (err) {
        console.error("Failed to redirect to active trip:", err);
        router.replace("/explore");
      }
    };

    redirectToActiveTrip();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          Opening Premium Workspace...
        </p>
      </div>
    </div>
  );
}
