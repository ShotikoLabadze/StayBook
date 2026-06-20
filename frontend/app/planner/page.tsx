"use client";

import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { usePlanner } from "./hooks/usePlanner";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { BudgetView } from "./components/budget-view";
import { DaySchedule } from "./components/day-schedule";
import { MapView } from "./components/map-view";
import { PlanItem } from "./components/plan-item";
import { TimelineView } from "./components/timeline-view";

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<
    "board" | "timeline" | "map" | "budget"
  >("board");

  const {
    itinerary,
    loading,
    mounted,
    sensors,
    activeItem,
    totalDays,
    totalEvents,
    tripProgress,
    handleDeleteActivity,
    handleAddActivity,
    handleDragStart,
    handleDragEnd,
  } = usePlanner();

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
              {(["board", "timeline", "map", "budget"] as const).map((tab) => (
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
