"use client";

import CreateTripModal from "@/components/CreateTripModal";
import { tripService } from "@/services/tripService";
import { Calendar, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlannerRootRedirect() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const redirectToActiveTrip = async () => {
      try {
        const trips = await tripService.getAll();

        if (trips && trips.length > 0) {
          router.replace(`/planner/${trips[0]._id}`);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to redirect to active trip:", err);
        setIsLoading(false);
      }
    };

    redirectToActiveTrip();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-[calc(100vh-4rem)] gap-2 transition-colors duration-300">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-text-muted font-medium tracking-wide">
          Opening Premium Workspace...
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-5 h-[calc(100vh-4rem)]">
      <div className="w-16 h-16 rounded-2xl bg-card-bg border border-border-subtle flex items-center justify-center text-text-muted shadow-3xs">
        <Calendar className="w-6 h-6 stroke-[1.5] text-text-muted opacity-90" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h2 className="font-headline text-base font-bold text-primary">
          No travel blueprint found
        </h2>
        <p className="text-xs text-text-muted font-medium">
          Your travel timeline is currently empty. Design your first sanctuary
          itinerary to activate the workspace planner.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="px-5 py-2.5 bg-primary hover:bg-primary/95 dark:bg-secondary dark:hover:bg-secondary/90 text-white dark:text-neutral-bg text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.98] border-none"
      >
        <Plus className="w-4 h-4 text-secondary dark:text-neutral-bg stroke-[2.5]" />
        <span>Plan a new trip</span>
      </button>

      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
