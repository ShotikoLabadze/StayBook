"use client";

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
import { DaySchedule } from "./components/day-schedule";
import { PlanItem } from "./components/plan-item";
import { TimelineView } from "./components/timeline-view";

export default function PlannerPage() {
  const [itinerary, setItinerary] = useState([
    {
      dayNumber: 1,
      title: "Arrival & Settling In",
      date: "2026-06-12",
      activities: [
        {
          id: "1",
          title: "Flight LX1204 - Zurich to Naples",
          time: "14:00",
          note: "Terminal 1.",
          category: "flight",
        },
        {
          id: "2",
          title: "Check-in at Hotel Le Sirenuse",
          time: "15:30",
          note: "Sea View Junior Suite.",
          category: "hotel",
        },
      ],
    },
    {
      dayNumber: 2,
      title: "Exploration & Sunset",
      date: "2026-06-13",
      activities: [
        {
          id: "3",
          title: "Oia Sunset Walk & Luxury Dinner",
          time: "19:00",
          note: "Balcony table reserved.",
          category: "activity",
        },
      ],
    },
    {
      dayNumber: 3,
      title: "Free Day in Positano",
      date: "2026-06-14",
      activities: [],
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "board" | "timeline" | "calendar" | "map" | "budget"
  >("board");

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDeleteActivity(dayIndex: number, activityId: string) {
    const nextItinerary = itinerary.map((day, idx) => {
      if (idx === dayIndex) {
        return {
          ...day,
          activities: day.activities.filter((act) => act.id !== activityId),
        };
      }
      return day;
    });
    setItinerary(nextItinerary);
  }

  function handleAddActivity(dayIndex: number, newActivity: any) {
    const nextItinerary = itinerary.map((day, idx) => {
      if (idx === dayIndex) {
        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      }
      return day;
    });
    setItinerary(nextItinerary);
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    let fromDayIdx = -1;
    let toDayIdx = -1;
    let activeItemIdx = -1;

    itinerary.forEach((day, dIdx) => {
      const aIdx = day.activities.findIndex((a) => a.id === activeIdStr);
      if (aIdx !== -1) {
        fromDayIdx = dIdx;
        activeItemIdx = aIdx;
      }
      if (
        overIdStr === `day-${dIdx}` ||
        day.activities.some((a) => a.id === overIdStr)
      ) {
        toDayIdx = dIdx;
      }
    });

    if (fromDayIdx === -1 || toDayIdx === -1) return;

    const nextItinerary = itinerary.map((day) => ({
      ...day,
      activities: [...day.activities],
    }));

    const [movedItem] = nextItinerary[fromDayIdx].activities.splice(
      activeItemIdx,
      1,
    );

    if (overIdStr.startsWith("day-")) {
      nextItinerary[toDayIdx].activities.push(movedItem);
    } else {
      const overItemIdx = nextItinerary[toDayIdx].activities.findIndex(
        (a) => a.id === overIdStr,
      );
      nextItinerary[toDayIdx].activities.splice(overItemIdx, 0, movedItem);
    }

    setItinerary(nextItinerary);
  };

  const activeItem = itinerary
    .flatMap((d) => d.activities)
    .find((a) => a.id === activeId);

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-bg font-body flex">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="p-10 space-y-8 max-w-7xl w-full mx-auto flex-1 flex flex-col">
            <header className="text-left">
              <p className="text-sm font-medium text-primary">StayBook</p>
              <h1 className="mt-2 text-3xl font-bold text-primary md:text-4xl tracking-tight font-headline">
                Premium Planner Workspace
              </h1>
            </header>
          </div>
        </main>
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

            <DragOverlay dropAnimation={null}>
              {activeItem ? (
                <div className="shadow-2xl opacity-90 scale-102 rotate-1 transition-transform">
                  <PlanItem item={activeItem} dayIndex={-1} isClone />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {activeTab !== "board" && activeTab !== "timeline" && (
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

          <Footer variant="dashboard" />
        </div>
      </main>
    </div>
  );
}
