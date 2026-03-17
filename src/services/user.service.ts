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
  updateProfile: async (data: any) => {
    const response = await api.patch(`/users/update-profile`, data);
    return response.data;
  },
  updateProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.patch(`/users/update-profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getAllHosts: async (params?: any) => {
    const response = await api.get("/users/hosts", { params });
    return response.data.data;
  },
};
