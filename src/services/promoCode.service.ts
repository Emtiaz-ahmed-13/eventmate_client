import api from "@/lib/api";

export const PromoCodeServices = {
  validatePromoCode: async (code: string, eventId: string) => {
    const response = await api.post("/promo-codes/validate", { code, eventId });
    return response.data.data;
  },

  createPromoCode: async (data: {
    code: string;
    eventId?: string;
    discountType: "PERCENT" | "FIXED";
    discountValue: number;
    maxUses?: number;
    expiresAt?: string;
  }) => {
    const response = await api.post("/promo-codes", data);
    return response.data.data;
  },

  getEventPromoCodes: async (eventId: string) => {
    const response = await api.get(`/promo-codes/event/${eventId}`);
    return response.data.data;
  },

  deletePromoCode: async (id: string) => {
    const response = await api.delete(`/promo-codes/${id}`);
    return response.data;
  },
};
