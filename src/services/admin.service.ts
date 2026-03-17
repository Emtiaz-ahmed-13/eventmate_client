import api from "@/lib/api";

export const AdminServices = {
  // User Management
  getAllUsers: async (params?: any) => {
    const response = await api.get("/Admin/users", { params });
    return response.data.data;
  },
  
  getAllHosts: async (params?: any) => {
    const response = await api.get("/Admin/hosts", { params });
    return response.data.data;
  },
  
  changeUserRole: async (userId: string, role: string) => {
    const response = await api.patch(`/Admin/users/${userId}/role`, { role });
    return response.data;
  },
  
  toggleUserBan: async (userId: string) => {
    const response = await api.patch(`/Admin/users/${userId}/ban`);
    return response.data;
  },
  
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/Admin/users/${userId}`);
    return response.data;
  },
  
  // Event Management
  getAllEvents: async (params?: any) => {
    const response = await api.get("/Admin/events", { params });
    return response.data.data;
  },
  
  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/Admin/events/${eventId}`);
    return response.data;
  },
  
  // Statistics
  getAdminStats: async () => {
    const response = await api.get("/Admin/stats");
    return response.data.data;
  },
};