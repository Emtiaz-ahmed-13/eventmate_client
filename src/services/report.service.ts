import api from "@/lib/api";

export const ReportServices = {
  createReport: async (data: {
    targetType: "EVENT" | "USER" | "REVIEW";
    targetId: string;
    reason: string;
    description?: string;
  }) => {
    const response = await api.post("/reports", data);
    return response.data.data;
  },

  getAllReports: async (status?: string) => {
    const response = await api.get("/Admin/reports", { params: status ? { status } : {} });
    return response.data.data;
  },

  updateReportStatus: async (id: string, status: string) => {
    const response = await api.patch(`/Admin/reports/${id}/status`, { status });
    return response.data.data;
  },
};
