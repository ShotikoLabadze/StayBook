import api from "./api";

export interface Destination {
  _id: string;
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  image: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
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

  getHotelsByDestination: async (slug: string) => {
    const response = await api.get(`/destinations/${slug}/hotels`);
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
};
