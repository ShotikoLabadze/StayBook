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
};
