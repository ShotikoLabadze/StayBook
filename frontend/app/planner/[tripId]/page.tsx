"use client";

import { tripService } from "@/services/tripService";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlanner } from "./hooks/usePlanner";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { BudgetView } from "./components/budget-view";
import { DaySchedule } from "./components/day-schedule";
import { MapView } from "./components/map-view";
import { PlanItem } from "./components/plan-item";
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
  const currentTripId = params?.tripId;

  const [activeTab, setActiveTab] = useState<
    "trips" | "board" | "timeline" | "map" | "budget"
  >("board");

  const [allWorkspaceTrips, setAllWorkspaceTrips] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    itinerary,
    loading: plannerLoading,
    mounted: plannerMounted,
    sensors: plannerSensors,
    activeItem: plannerActiveItem,
    totalDays,
    totalEvents,
    tripProgress,
    handleDeleteActivity,
    handleAddActivity,
    handleDragStart: defaultDragStart,
    handleDragEnd: defaultDragEnd,
  } = usePlanner();

  const fetchGlobalWorkspace = () => {
    tripService
      .getAll()
      .then((data) => setAllWorkspaceTrips(data))
      .catch((err) => console.error("Workspace Board fetch failed:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setMounted(true);
    fetchGlobalWorkspace();
  }, [currentTripId, activeTab]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleGlobalDragStart = (event: DragStartEvent) => {
    const activeIdStr = String(event.active.id);
    let foundAct: any = null;

    allWorkspaceTrips.forEach((trip) => {
      trip.itinerary?.forEach((day: any) => {
        day.activities?.forEach((act: any) => {
          if (String(act.id || act._id) === activeIdStr) {
            foundAct = act;
          }
        });
      });
    });
    setActiveItem(foundAct);
  };

  const handleGlobalDragEnd = async (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    let fromTripIdx = -1;
    let fromDayIdx = -1;
    let fromActIdx = -1;
    let targetAct: any = null;

    allWorkspaceTrips.forEach((trip, tIdx) => {
      trip.itinerary?.forEach((day: any, dIdx: number) => {
        day.activities?.forEach((act: any, aIdx: number) => {
          if (String(act.id || act._id) === activeIdStr) {
            fromTripIdx = tIdx;
            fromDayIdx = dIdx;
            fromActIdx = aIdx;
            targetAct = { ...act };
          }
        });
      });
    });

    let toTripIdx = allWorkspaceTrips.findIndex(
      (t) => `trip-${t._id}` === overIdStr,
    );

    if (toTripIdx === -1) {
      allWorkspaceTrips.forEach((trip, tIdx) => {
        trip.itinerary?.forEach((day: any) => {
          if (
            day.activities?.some(
              (a: any) => String(a.id || a._id) === overIdStr,
            )
          ) {
            toTripIdx = tIdx;
          }
        });
      });
    }

    if (fromTripIdx === -1 || toTripIdx === -1 || !targetAct) return;
    if (fromTripIdx === toTripIdx) return;

    const updatedTrips = [...allWorkspaceTrips];
    updatedTrips[fromTripIdx].itinerary[fromDayIdx].activities.splice(
      fromActIdx,
      1,
    );

    if (!updatedTrips[toTripIdx].itinerary[0]) {
      updatedTrips[toTripIdx].itinerary[0] = {
        dayNumber: 1,
        date: new Date().toISOString(),
        activities: [],
      };
    }
    updatedTrips[toTripIdx].itinerary[0].activities.push(targetAct);
    setAllWorkspaceTrips(updatedTrips);

    try {
      await tripService.updateItinerary(
        updatedTrips[fromTripIdx]._id,
        updatedTrips[fromTripIdx].itinerary,
      );
      await tripService.updateItinerary(
        updatedTrips[toTripIdx]._id,
        updatedTrips[toTripIdx].itinerary,
      );
    } catch (err) {
      console.error("Cross-trip sync failed:", err);
      fetchGlobalWorkspace();
    }
  };

  const handleTripSwitch = (tripId: string) => {
    setActiveTab("board");
    router.push(`/planner/${tripId}`);
  };

  if (!mounted || !plannerMounted || loading) {
    return (
      <div className="min-h-screen bg-neutral-bg font-body flex items-center justify-center text-slate-500 font-medium text-sm">
        <div className="animate-pulse">Loading Planner Workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg font-body flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-10 space-y-5 max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="text-left">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest font-headline block mb-1">
                StayBook
              </span>
              <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
                Premium Planner Workspace
              </h1>
              <p className="mt-1 text-xs font-medium text-slate-400">
                Manage hand-picked luxury itineraries and dynamically sync
                travel steps.
              </p>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-500 border border-slate-200/20 shadow-2xs self-start sm:self-center">
              {WORKSPACE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-primary shadow-2xs font-semibold"
                      : "text-slate-400 hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "trips" && (
            <TripsView onTripSelect={handleTripSwitch} />
          )}

          {activeTab === "board" || activeTab === "timeline" ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleGlobalDragStart}
              onDragEnd={handleGlobalDragEnd}
            >
              {activeTab === "board" && (
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl shadow-slate-100/50 flex-1 flex flex-col">
                  <div className="mb-6 text-left border-b border-slate-100 pb-4">
                    <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
                      Global Trip Master Board
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Drag and drop activities across your different travel
                      packages smoothly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start flex-1 overflow-x-auto pb-2">
                    {allWorkspaceTrips.map((trip, idx) => {
                      const flatActivities =
                        trip.itinerary?.flatMap(
                          (d: any) => d.activities || [],
                        ) || [];
                      return (
                        <DaySchedule
                          key={trip._id}
                          dayNumber={idx + 1}
                          title={trip.title || "Curated Sanctuary Package"}
                          date={`${trip.itinerary?.length || 0} Days Plan`}
                          activities={flatActivities}
                          dayIndex={idx}
                          id={`trip-${trip._id}`}
                          onAddActivity={() => {}}
                          onDeleteActivity={() => {}}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <TimelineView trips={allWorkspaceTrips} />
              )}

              <DragOverlay dropAnimation={null}>
                {activeItem ? (
                  <div className="shadow-2xl opacity-95 scale-102 rotate-1 transition-transform w-[300px] pointer-events-none z-50">
                    <PlanItem item={activeItem} dayIndex={-1} isClone />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : null}

          {activeTab === "map" && <MapView trips={allWorkspaceTrips} />}

          {activeTab === "budget" && (
            <BudgetView
              itinerary={itinerary}
              budgetLimit={12450}
              currency="USD"
              onDeleteExpense={handleDeleteActivity}
            />
          )}

          <Footer variant="dashboard" />
        </div>
      </main>
    </div>
  );
}
