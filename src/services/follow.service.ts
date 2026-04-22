import api from "@/lib/api";

export const FollowServices = {
  followHost: async (hostId: string) => {
    const response = await api.post(`/follows/${hostId}/follow`);
    return response.data.data;
  },
  unfollowHost: async (hostId: string) => {
    const response = await api.delete(`/follows/${hostId}/unfollow`);
    return response.data;
  },
  getHostFollowers: async (hostId: string) => {
    const response = await api.get(`/follows/${hostId}/followers`);
    return response.data.data;
  },
  getFollowingHosts: async () => {
    const response = await api.get("/follows/following");
    return response.data.data;
  },
};
