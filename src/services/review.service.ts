import api from "@/lib/api";

export const ReviewServices = {
  createReview: async (data: { hostId: string; eventId: string; rating: number; comment: string }) => {
    const response = await api.post("/reviews", data);
    return response.data.data;
  },
  getHostReviews: async (hostId: string) => {
    const response = await api.get(`/reviews/host/${hostId}`);
    return response.data.data;
  },
};
