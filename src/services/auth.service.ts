import api from "@/lib/api";

export const AuthService = {
  login: async (data: any) => {
    const response = await api.post("/auth/login", data, {
      timeout: 60000, // Render free tier cold start can take up to 60s
    });
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post("/auth/register", data, {
      timeout: 60000, // Render free tier cold start can take up to 60s
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me", {
      timeout: 10000,
    });
    return response.data.data;
  },
  logout: async () => {
    const response = await api.post("/auth/logout", {}, {
      timeout: 10000,
    });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email }, {
      timeout: 10000,
    });
    return response.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post(`/auth/reset-password?token=${token}`, { newPassword }, {
      timeout: 10000,
    });
    return response.data;
  },
};

export const AuthServices = AuthService;