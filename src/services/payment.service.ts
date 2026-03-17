import api from "@/lib/api";

export const PaymentServices = {
  createPaymentIntent: async (eventId: string, amount: number) => {
    const response = await api.post("/payments/create-intent", {
      eventId,
    });
    return response.data.data;
  },
  
  confirmPayment: async (paymentIntentId: string) => {
    const response = await api.post("/payments/confirm", {
      paymentIntentId,
    });
    return response.data;
  },
};