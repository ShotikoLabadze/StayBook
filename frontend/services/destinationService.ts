import api from "./api";

export interface Destination {
  _id: string;
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  activities: string[];
  duration: string;
  weather: {
    temp: number;
    unit: string;
    condition: string;
  };
  flightTime?: string;
  bestSeason?: string;
  highlights?: string[];
  featured?: boolean;
  tips?: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  destinationTitle?: string;
}

export interface Hotel {
  _id: string;
  id: string;
  destinationId: string;
  name: string;
  neighborhood: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  propertyType: string;
  tags: string[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  highlights: string[];
}

export const destinationService = {
  getAll: async () => {
    const response = await api.get("/destinations");
    return response.data as Destination[];
  },

  getTestimonials: async () => {
    const response = await api.get("/destinations/testimonials");
    return response.data as Testimonial[];
  },

  getHotelsByDestination: async (slug: string, params?: any) => {
    const response = await api.get(`/destinations/${slug}/hotels`, { params });
    return response.data as Hotel[];
  },

  getPropertyTypes: async () => {
    const response = await api.get("/destinations/property-types");
    return response.data as string[];
  },

  getCategories: async () => {
    const response = await api.get("/destinations/categories");
    return response.data as string[];
  },

  getWeatherConditions: async () => {
    const response = await api.get("/destinations/weather-conditions");
    return response.data as string[];
  },

  getDurations: async () => {
    const response = await api.get("/destinations/durations");
    return response.data as string[];
  },

  getActivities: async () => {
    const response = await api.get("/destinations/activities");
    return response.data as string[];
  },

  createHotel: async (data: Partial<Hotel>) => {
    const response = await api.post("/destinations/hotels", data);
    return response.data as Hotel;
  },
};
