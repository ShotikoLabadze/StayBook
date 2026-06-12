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

export const destinationService = {
  getAll: async (): Promise<Destination[]> => {
    const response = await api.get<Destination[]>("/destinations");
    return response.data;
  },
};
