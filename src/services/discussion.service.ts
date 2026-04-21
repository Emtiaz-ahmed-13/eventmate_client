import api from "@/lib/api";

export const DiscussionServices = {
  createQuestion: async (eventId: string, question: string) => {
    const response = await api.post(`/discussions/${eventId}`, { question });
    return response.data.data;
  },
  answerQuestion: async (discussionId: string, answer: string) => {
    const response = await api.patch(`/discussions/${discussionId}/answer`, { answer });
    return response.data.data;
  },
  getEventDiscussions: async (eventId: string) => {
    const response = await api.get(`/discussions/${eventId}`);
    return response.data.data;
  },
};
