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
      { data: { dayIndex } },
    );
    return response.data as TripData;
  },

  updateItinerary: async (tripId: string, itinerary: TripItineraryDay[]) => {
    const response = await api.patch(`/trips/${tripId}/itinerary/reorder`, {
      itinerary,
    });
    return response.data as TripData;
  },
};
