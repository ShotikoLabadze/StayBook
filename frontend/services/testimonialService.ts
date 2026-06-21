import api from "./api";

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  destinationTitle?: string;
  createdAt?: string;
}

export const testimonialService = {
  getAll: async (): Promise<Testimonial[]> => {
    const response = await api.get("/testimonials");
    return response.data;
  },

  create: async (data: Omit<Testimonial, "_id">): Promise<Testimonial> => {
    const response = await api.get("/testimonials");
    return response.data;
  },
};
