import api from "./api";

export interface UpdateProfileDto {
  name?: string;
  avatar?: string;
  password?: string;
}

export const userService = {
  updateProfile: async (data: UpdateProfileDto) => {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  toggleFavorite: async (userId: string, hotelId: string) => {
    const response = await api.post(`/users/favorites/${hotelId}`, { userId });
    return response.data;
  },

  getFavorites: async (userId: string) => {
    const response = await api.post("/users/get-favorites", { userId });
    return response.data;
  },
};
