import api from "./api";

export const aiService = {
  async generateItinerary(
    destination: string,
    durationDays: number,
    budget: string,
  ) {
    const response = await api.post("/ai/generate", {
      destination,
      durationDays,
      budget,
    });
    return response.data;
  },

  async chatReply(message: string) {
    const response = await api.post("/ai/chat", { message });
    return response.data;
  },
};
