import api from "@/lib/api";

export const AuthServices = {
  login: async (data: any) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
};
