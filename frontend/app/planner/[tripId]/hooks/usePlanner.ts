"use client";

import { tripService } from "@/services/tripService";
import {
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function usePlanner() {
  const { tripId } = useParams();
  const TRIP_ID = String(tripId);

  const [itinerary, setItinerary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!TRIP_ID || TRIP_ID === "undefined") return;

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
  }, [TRIP_ID]);

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
      console.error("Failed to delete activity:", err);
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
        return { ...day, activities: [...day.activities, verifiedActivity] };
      }
      return day;
    });
    setItinerary(nextItinerary);

    try {
      await tripService.addActivity(TRIP_ID, dayIndex, verifiedActivity);
    } catch (err) {
      console.error("Failed to add activity:", err);
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

  return {
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
  };
}
