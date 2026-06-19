"use client";

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { DaySchedule } from "./components/day-schedule";

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    let fromDayIdx = -1;
    let toDayIdx = -1;
    let activeItemIdx = -1;

    itinerary.forEach((day, dIdx) => {
      const aIdx = day.activities.findIndex((a) => a.id === activeId);
      if (aIdx !== -1) {
        fromDayIdx = dIdx;
        activeItemIdx = aIdx;
      }
      if (overId.startsWith("day-") && overId === `day-${dIdx}`) {
        toDayIdx = dIdx;
      } else if (day.activities.some((a) => a.id === overId)) {
        toDayIdx = dIdx;
      }
    });

    if (fromDayIdx === -1 || toDayIdx === -1) return;

    const nextItinerary = [...itinerary];
    const [movedItem] = nextItinerary[fromDayIdx].activities.splice(
      activeItemIdx,
      1,
    );

    if (overId.startsWith("day-")) {
      nextItinerary[toDayIdx].activities.push(movedItem);
    } else {
      const overItemIdx = nextItinerary[toDayIdx].activities.findIndex(
        (a) => a.id === overId,
      );
      nextItinerary[toDayIdx].activities.splice(overItemIdx, 0, movedItem);
    }

    setItinerary(nextItinerary);
  }

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

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl shadow-slate-100/50 flex-1 flex flex-col">
              <div className="mb-6 text-left border-b border-slate-100 pb-4">
                <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
                  Trip Itinerary Board
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage your daily schedule and drag activities to reorganize.
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
                  />
                ))}
              </div>
            </div>
          </DndContext>

          <Footer variant="dashboard" />
        </div>
      </main>
    </div>
  );
}
