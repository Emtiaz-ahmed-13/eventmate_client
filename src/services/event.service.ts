import api from "@/lib/api";

export const EventServices = {
  getAllEvents: async (params?: any) => {
    const response = await api.get("/events", { params });
    return response.data.data;
  },
  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },
  createEvent: async (data: any) => {
    const response = await api.post("/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
  joinEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/join`);
    return response.data;
  },
  leaveEvent: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}/leave`);
    return response.data;
  },
  saveEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/save`);
    return response.data;
  },
  unsaveEvent: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}/unsave`);
    return response.data;
  },
};
