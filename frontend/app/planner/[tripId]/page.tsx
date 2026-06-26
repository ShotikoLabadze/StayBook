"use client";

import { tripService } from "@/services/tripService";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlanner } from "./hooks/usePlanner";

import Footer from "@/components/Footer";
import { AiFillButton } from "./components/ai-fill-button";
import { BoardView } from "./components/board-view";
import { BudgetView } from "./components/budget-view";
import { MapView } from "./components/map-view";
import { TimelineView } from "./components/timeline-view";
import { TripsView } from "./components/trips-view";

const WORKSPACE_TABS = [
  { id: "trips", label: "Trips" },
  { id: "board", label: "Board" },
  { id: "timeline", label: "Timeline" },
  { id: "map", label: "Map" },
  { id: "budget", label: "Budget" },
] as const;

export default function PlannerPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentTripId = params?.tripId;
  const activeTabFromUrl = searchParams.get("tab") as any;

  const [activeTab, setActiveTab] = useState<
    "trips" | "board" | "timeline" | "map" | "budget"
  >(activeTabFromUrl || "board");
  const [allWorkspaceTrips, setAllWorkspaceTrips] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [, setLoading] = useState(true);

  const { itinerary, handleAddActivity, handleDeleteActivity, triggerRefresh } =
    usePlanner();

  const fetchGlobalWorkspace = () => {
    tripService
      .getAll()
      .then((data) => setAllWorkspaceTrips(data))
      .catch((err) => console.error("Workspace Board fetch failed:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeTabFromUrl) setActiveTab(activeTabFromUrl);
  }, [activeTabFromUrl]);

  useEffect(() => {
    setMounted(true);
    fetchGlobalWorkspace();
  }, [currentTripId, activeTab]);

  const targetTripData = allWorkspaceTrips.find((t) => t._id === currentTripId);

  const handleTripSwitch = (tripId: string) => {
    setActiveTab("board");
    router.push(`/planner/${tripId}`);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center flex-1 h-[calc(100vh-4rem)] text-text-muted font-medium text-sm transition-colors duration-300">
        <div className="animate-pulse">Loading Planner Workspace...</div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-5 max-w-7xl w-full mx-auto flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="text-left">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest font-headline block mb-1">
            StayBook
          </span>
          <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
            Premium Planner Workspace
          </h1>
          <p className="mt-1 text-xs font-medium text-text-muted">
            Manage hand-picked luxury itineraries and dynamically sync travel
            steps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
          {currentTripId && (
            <AiFillButton
              currentTripId={String(currentTripId)}
              currentTripData={targetTripData}
              onGenerationSuccess={() => {
                fetchGlobalWorkspace();
                triggerRefresh();
              }}
            />
          )}

          <div className="flex items-center bg-neutral-bg p-1 rounded-xl text-xs font-bold text-text-muted border border-border-subtle shadow-2xs">
            {WORKSPACE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (searchParams.has("tab"))
                    router.replace(window.location.pathname);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center px-4 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === tab.id ? "bg-card-bg text-primary shadow-2xs font-semibold" : "text-text-muted hover:text-primary"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "trips" && <TripsView onTripSelect={handleTripSwitch} />}

      {activeTab === "board" && (
        <BoardView
          allWorkspaceTrips={allWorkspaceTrips}
          currentTripId={currentTripId ? String(currentTripId) : undefined}
          itinerary={itinerary}
          handleAddActivity={handleAddActivity}
          handleDeleteActivity={handleDeleteActivity}
          onRefresh={() => {
            fetchGlobalWorkspace();
            triggerRefresh();
          }}
          setAllWorkspaceTrips={setAllWorkspaceTrips}
        />
      )}

      {activeTab === "map" && <MapView trips={allWorkspaceTrips} />}
      {activeTab === "budget" && (
        <BudgetView
          tripId={String(currentTripId)}
          itinerary={itinerary}
          budgetLimit={4000}
          currency="USD"
          onTripRefresh={() => {
            fetchGlobalWorkspace();
            triggerRefresh();
          }}
          allWorkspaceTrips={allWorkspaceTrips}
        />
      )}
      {activeTab === "timeline" && <TimelineView trips={allWorkspaceTrips} />}

      <Footer variant="dashboard" />
    </div>
  );
}
