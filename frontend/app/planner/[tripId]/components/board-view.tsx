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
import { useState } from "react";
import { DaySchedule } from "./day-schedule";
import { PlanItem } from "./plan-item";

interface BoardViewProps {
  allWorkspaceTrips: any[];
  currentTripId?: string;
  itinerary: any[];
  handleAddActivity: any;
  handleDeleteActivity: any;
  onRefresh: () => void;
  setAllWorkspaceTrips: (trips: any[]) => void;
}

export function BoardView({
  allWorkspaceTrips,
  currentTripId,
  itinerary,
  handleAddActivity,
  handleDeleteActivity,
  onRefresh,
  setAllWorkspaceTrips,
}: BoardViewProps) {
  const [activeItem, setActiveItem] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const targetTripData = allWorkspaceTrips.find((t) => t._id === currentTripId);

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
      onRefresh();
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleGlobalDragStart}
      onDragEnd={handleGlobalDragEnd}
    >
      <div className="bg-card-bg/70 backdrop-blur-xl border border-border-subtle rounded-3xl p-8 shadow-xl flex-1 flex flex-col">
        <div className="mb-6 text-left border-b border-border-subtle pb-4">
          <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
            {targetTripData
              ? `${targetTripData.title} - Daily Timeline`
              : "Global Trip Master Board"}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {targetTripData
              ? `Organized roadmap for ${targetTripData.destination}. Drag and drop items to reschedule.`
              : "Select a trip to view its direct daily blueprint."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start flex-1 overflow-x-auto pb-2">
          {targetTripData && itinerary && itinerary.length > 0
            ? itinerary.map((day: any, idx: number) => (
                <DaySchedule
                  key={day._id || `day-${idx}`}
                  dayNumber={day.dayNumber || idx + 1}
                  title={day.title || `Day ${idx + 1} Schedule`}
                  date={
                    day.date
                      ? new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : `Day ${idx + 1}`
                  }
                  activities={day.activities || []}
                  dayIndex={idx}
                  id={`day-${idx}`}
                  onAddActivity={handleAddActivity}
                  onDeleteActivity={handleDeleteActivity}
                />
              ))
            : allWorkspaceTrips.map((trip, idx) => {
                const flatActivities =
                  trip.itinerary?.flatMap((d: any) => d.activities || []) || [];
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

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div className="shadow-2xl opacity-95 scale-102 rotate-1 transition-transform w-[300px] pointer-events-none z-50">
            <PlanItem item={activeItem} dayIndex={-1} isClone />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
