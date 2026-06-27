import api from "./api";

export interface TripActivity {
  id: string;
  title: string;
  note?: string;
  time?: string;
  cost?: number;
  category: "flight" | "hotel" | "food" | "activity" | "transport";
  image?: string;
}

export interface TripItineraryDay {
  dayNumber: number;
  date: string;
  activities: TripActivity[];
}

export interface TripData {
  _id: string;
  title?: string;
  startDate: string;
  destination: string;
  endDate: string;
  owner: string;
  itinerary: TripItineraryDay[];
  budget?: {
    totalLimit: number;
    currency: string;
  };
}

export const tripService = {
  getAll: async () => {
    const response = await api.get("/trips");
    return response.data as TripData[];
  },

  getById: async (id: string) => {
    const response = await api.get(`/trips/${id}`);
    return response.data as TripData;
  },

  create: async (tripData: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: { totalLimit: number; currency: string };
  }) => {
    const response = await api.post("/trips", tripData);
    return response.data as TripData;
  },

  addActivity: async (tripId: string, dayIndex: number, activity: any) => {
    const response = await api.post(`/trips/${tripId}/activities`, {
      dayIndex,
      activity,
    });
    return response.data as TripData;
  },

  deleteActivity: async (
    tripId: string,
    dayIndex: number,
    activityId: string,
  ) => {
    const response = await api.delete(
      `/trips/${tripId}/activities/${activityId}`,
      {
        data: { dayIndex },
      },
    );
    return response.data as TripData;
  },

  updateItinerary: async (tripId: string, itinerary: TripItineraryDay[]) => {
    const response = await api.patch(`/trips/${tripId}/itinerary/reorder`, {
      itinerary,
    });
    return response.data as TripData;
  },

  generateAiItinerary: async (
    tripId: string,
    payload: { destination: string; durationDays: number; budget: string },
  ) => {
    const currentTrip = await tripService.getById(tripId);
    const tripStart = currentTrip.startDate
      ? new Date(currentTrip.startDate)
      : new Date();

    const aiResponse = await api.post("/ai/generate", payload);
    const generatedItinerary = aiResponse.data.itinerary;

    const formattedItinerary = Array.isArray(generatedItinerary)
      ? generatedItinerary.map((day, index) => {
          const currentDate = new Date(tripStart);
          currentDate.setDate(tripStart.getDate() + index);

          return {
            dayNumber: day.dayNumber || index + 1,
            title: day.title || `Day ${index + 1}: ${payload.destination}`,
            date: currentDate.toISOString(),
            activities: Array.isArray(day.activities)
              ? day.activities.map((act: any, actIdx: number) => {
                  const uniqueId =
                    act.id ||
                    `ai-act-${index}-${actIdx}-${Math.random().toString(36).substring(2, 5)}`;

                  return {
                    title: act.title,
                    note: act.note || "",
                    time: act.time || "10:00 AM",
                    cost: Number(act.cost) || 0,
                    category: act.category || "activity",
                    location: act.location || {
                      name: payload.destination,
                      lat: 41.8902,
                      lng: 12.4964,
                    },
                    id: uniqueId,
                  };
                })
              : [],
          };
        })
      : [];

    const response = await api.patch(`/trips/${tripId}/itinerary/reorder`, {
      itinerary: formattedItinerary,
    });
    return response.data as TripData;
  },

  shareTrip: async (tripId: string, email: string) => {
    const response = await api.post(`/trips/${tripId}/share`, { email });
    return response.data;
  },

  acceptInvitation: async (tripId: string) => {
    const response = await api.patch(`/trips/${tripId}/accept`);
    return response.data;
  },
};
