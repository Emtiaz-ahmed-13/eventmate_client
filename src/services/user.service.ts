import api from "@/lib/api";

export const UserServices = {
  getUserProfile: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },
  getUserEvents: async (id: string) => {
    const response = await api.get(`/users/${id}/events`);
    return response.data.data;
  },
  updateProfile: async (id: string, data: any) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
};
