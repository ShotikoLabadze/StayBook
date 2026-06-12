import api from "./api";

export interface Destination {
  _id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  destinationTitle?: string;
}

export const destinationService = {
  getAll: async (): Promise<Destination[]> => {
    const response = await api.get<Destination[]>("/destinations");
    return response.data;
  },

  getTestimonials: async (): Promise<Testimonial[]> => {
    const response = await api.get<Testimonial[]>("/destinations/testimonials");
    return response.data;
  },
};
