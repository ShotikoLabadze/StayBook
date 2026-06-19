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
  getById: async (id: string) => {
    const response = await api.get(`/trips/${id}`);
    return response.data as TripData;
  },
};
