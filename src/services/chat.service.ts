import api from "@/lib/api";

export const ChatServices = {
  sendMessage: async (eventId: string, message: string) => {
    const response = await api.post(`/chats/${eventId}`, { message });
    return response.data.data;
  },
  getEventMessages: async (eventId: string) => {
    const response = await api.get(`/chats/${eventId}`);
    return response.data.data;
  },
};
