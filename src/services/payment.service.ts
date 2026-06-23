import api from "@/lib/api";

export const PaymentServices = {
  createPaymentIntent: async (eventId: string, promoCode?: string) => {
    const response = await api.post("/payments/create-intent", {
      eventId,
      promoCode: promoCode || undefined,
    });
    return response.data.data;
  },

  confirmPayment: async (paymentIntentId: string) => {
    const response = await api.post("/payments/confirm", {
      paymentIntentId,
    });
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get("/payments/me");
    return response.data.data;
  },

  getEventPayments: async (eventId: string) => {
    const response = await api.get(`/payments/event/${eventId}`);
    return response.data.data;
  },
};
