import api from "./api";

export interface ReviewData {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  targetId: string;
  targetType: "hotel" | "destination";
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewService = {
  getByTarget: async (targetId: string): Promise<ReviewData[]> => {
    const response = await api.get(`/reviews/${targetId}`);
    return response.data;
  },

  create: async (
    targetType: "hotel" | "destination",
    targetId: string,
    data: { rating: number; comment: string },
  ): Promise<ReviewData> => {
    const response = await api.post(`/reviews/${targetType}/${targetId}`, data);
    return response.data;
  },
};
