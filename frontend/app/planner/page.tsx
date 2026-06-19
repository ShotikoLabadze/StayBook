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
import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { BudgetView } from "./components/budget-view";
import { DaySchedule } from "./components/day-schedule";
import { MapView } from "./components/map-view";
import { PlanItem } from "./components/plan-item";
import { TimelineView } from "./components/timeline-view";

const TRIP_ID = "6a35bf247b891f664afaf1ff";

export default function PlannerPage() {
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "board" | "timeline" | "calendar" | "map" | "budget"
  >("board");

  useEffect(() => {
    setMounted(true);

    const loadTripData = async () => {
      try {
        const data = await tripService.getById(TRIP_ID);

        const formattedItinerary = data.itinerary.map((day) => ({
          ...day,
          title: (day as any).title || `Day ${day.dayNumber} Schedule`,
          activities: (day.activities || []).map((act: any) => ({
            ...act,
            id: act.id || act._id,
            category: act.category || "activity",
            cost: Number(act.cost) || 0,
            location: act.location || { name: "Unknown", lat: 0, lng: 0 },
          })),
        }));

        setItinerary(formattedItinerary);
      } catch (error) {
        console.error("Failed to fetch trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  async function handleDeleteActivity(dayIndex: number, activityId: string) {
    const previousItinerary = [...itinerary];
    const nextItinerary = itinerary.map((day, idx) => {
      if (idx === dayIndex) {
        return {
          ...day,
          activities: day.activities.filter(
            (act: any) => act.id !== activityId,
          ),
        };
      }
      return day;
    });
    setItinerary(nextItinerary);

    try {
      await tripService.deleteActivity(TRIP_ID, dayIndex, activityId);
    } catch (err) {
      console.error("Failed to delete activity from server:", err);
      setItinerary(previousItinerary);
    }
  }

  async function handleAddActivity(dayIndex: number, newActivity: any) {
    const previousItinerary = [...itinerary];

    const verifiedActivity = {
      ...newActivity,
      category: newActivity.category || "activity",
      cost: Number(newActivity.cost) || 0,
      location: newActivity.location || { name: "Unknown", lat: 0, lng: 0 },
    };

    const nextItinerary = itinerary.map((day, idx) => {
      if (idx === dayIndex) {
        return {
          ...day,
          activities: [...day.activities, verifiedActivity],
        };
      }
      return day;
    });
    setItinerary(nextItinerary);

    try {
      await tripService.addActivity(TRIP_ID, dayIndex, verifiedActivity);
    } catch (err) {
      console.error("Failed to add activity to server:", err);
      setItinerary(previousItinerary);
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    let fromDayIdx = -1;
    let toDayIdx = -1;
    let activeItemIdx = -1;

    itinerary.forEach((day, dIdx) => {
      const aIdx = day.activities.findIndex((a: any) => a.id === activeIdStr);
      if (aIdx !== -1) {
        fromDayIdx = dIdx;
        activeItemIdx = aIdx;
      }
      if (
        overIdStr === `day-${dIdx}` ||
        day.activities.some((a: any) => a.id === overIdStr)
      ) {
        toDayIdx = dIdx;
      }
    });

    if (fromDayIdx === -1 || toDayIdx === -1) return;

    const nextItinerary = itinerary.map((day) => ({
      ...day,
      activities: day.activities.map((act: any) => ({ ...act })),
    }));

    const [movedItem] = nextItinerary[fromDayIdx].activities.splice(
      activeItemIdx,
      1,
    );

    if (overIdStr.startsWith("day-")) {
      nextItinerary[toDayIdx].activities.push(movedItem);
    } else {
      const overItemIdx = nextItinerary[toDayIdx].activities.findIndex(
        (a: any) => a.id === overIdStr,
      );
      nextItinerary[toDayIdx].activities.splice(overItemIdx, 0, movedItem);
    }

    setItinerary(nextItinerary);

    const cleanedItineraryForBackend = nextItinerary.map((day) => ({
      dayNumber: day.dayNumber,
      date: day.date,
      activities: day.activities.map((act: any) => ({
        id: act.id,
        title: act.title,
        note: act.note || "",
        time: act.time || "",
        cost: Number(act.cost) || 0,
        category: act.category || "activity",
        location:
          act.location && act.location.name
            ? {
                name: act.location.name,
                lat: Number(act.location.lat) || 0,
                lng: Number(act.location.lng) || 0,
              }
            : { name: "Unknown", lat: 0, lng: 0 },
      })),
    }));

    try {
      await tripService.updateItinerary(TRIP_ID, cleanedItineraryForBackend);
    } catch (err) {
      console.error("Failed to sync drag and drop to backend:", err);
    }
  };

  const activeItem = itinerary
    .flatMap((d) => d.activities)
    .find((a: any) => a.id === activeId);

  const totalDays = itinerary.length;
  const totalEvents = itinerary.reduce(
    (acc, day) => acc + day.activities.length,
    0,
  );
  const activeDaysCount = itinerary.filter(
    (day) => day.activities.length > 0,
  ).length;
  const tripProgress =
    totalDays > 0 ? Math.round((activeDaysCount / totalDays) * 100) : 0;

  if (!mounted || loading) {
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
        <div className="p-10 space-y-6 max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <header className="text-left">
            <p className="text-sm font-medium text-primary">StayBook</p>
            <h1 className="mt-2 text-3xl font-bold text-primary md:text-4xl tracking-tight font-headline">
              Premium Planner Workspace
            </h1>
          </header>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 border border-slate-100 rounded-2xl shadow-xs">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {(
                ["board", "timeline", "calendar", "map", "budget"] as const
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-500 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6 text-right px-2 self-end lg:self-center">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Activities Count
                </p>
                <p className="text-xs font-extrabold text-slate-700">
                  {totalEvents} Items{" "}
                  <span className="text-slate-400 font-normal">
                    in {totalDays} Days
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
                  Planning {tripProgress}%
                </p>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary transition-all duration-500"
                    style={{ width: `${tripProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {activeTab === "board" && (
              <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl shadow-slate-100/50 flex-1 flex flex-col">
                <div className="mb-6 text-left border-b border-slate-100 pb-4">
                  <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
                    Trip Itinerary Board
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage your daily schedule and drag activities to
                    reorganize.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start flex-1">
                  {itinerary.map((dayContext, idx) => (
                    <DaySchedule
                      key={dayContext.dayNumber}
                      dayNumber={dayContext.dayNumber}
                      title={dayContext.title}
                      date={dayContext.date}
                      activities={dayContext.activities}
                      dayIndex={idx}
                      onAddActivity={handleAddActivity}
                      onDeleteActivity={handleDeleteActivity}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "timeline" && <TimelineView itinerary={itinerary} />}

            {activeTab === "map" && <MapView itinerary={itinerary} />}

            <DragOverlay dropAnimation={null}>
              {activeItem ? (
                <div className="shadow-2xl opacity-90 scale-102 rotate-1 transition-transform">
                  <PlanItem item={activeItem} dayIndex={-1} isClone />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {activeTab !== "board" &&
            activeTab !== "timeline" &&
            activeTab !== "map" && (
              <div className="bg-white border border-slate-100 border-dashed rounded-3xl p-12 text-center min-h-[300px] flex flex-col items-center justify-center flex-1">
                <p className="text-sm font-bold text-slate-700 capitalize">
                  {activeTab} View Workspace
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  This workspace view is currently empty and ready for
                  development.
                </p>
              </div>
            )}

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
