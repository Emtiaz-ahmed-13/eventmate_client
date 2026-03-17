import api from "@/lib/api";

export const AnalyticsServices = {
  getOverview: async () => {
    const response = await api.get("/analytics/overview");
    return response.data.data;
  },
};
