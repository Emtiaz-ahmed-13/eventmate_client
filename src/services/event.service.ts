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
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },
  updateEvent: async (id: string, data: any) => {
    const response = await api.patch(`/events/${id}`, data);
    return response.data.data;
  },
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
  cancelEvent: async (id: string) => {
    const response = await api.patch(`/events/${id}/cancel`);
    return response.data;
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
  getSavedEvents: async () => {
    const response = await api.get("/events/saved");
    return response.data.data;
  },
  getEventWaitlist: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/waitlist`);
    return response.data.data;
  },
  approveParticipant: async (eventId: string, userId: string) => {
    const response = await api.patch(`/events/${eventId}/participants/${userId}/approve`);
    return response.data;
  },
  rejectParticipant: async (eventId: string, userId: string) => {
    const response = await api.patch(`/events/${eventId}/participants/${userId}/reject`);
    return response.data;
  },
  getEventAnalytics: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/analytics`);
    return response.data.data;
  },
  duplicateEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/duplicate`);
    return response.data.data;
  },
  checkInParticipant: async (eventId: string, userId: string) => {
    const response = await api.patch(`/events/${eventId}/participants/${userId}/checkin`);
    return response.data.data;
  },
  undoCheckIn: async (eventId: string, userId: string) => {
    const response = await api.patch(`/events/${eventId}/participants/${userId}/undo-checkin`);
    return response.data.data;
  },
};
