"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PaymentServices } from "@/services/payment.service";

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
  eventName: string;
  isLoading?: boolean;
}

export default function PaymentForm({ onSuccess, onError, amount, isLoading = false }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !isElementReady) return;

    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/events` },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        await PaymentServices.confirmPayment(paymentIntent.id);
        onSuccess();
      } else {
        onError("Payment was not completed");
      }
    } catch (err: any) {
      onError(err.response?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = !stripe || !isElementReady || isProcessing || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
        <PaymentElement
          options={{ layout: "tabs" }}
          onReady={() => setIsElementReady(true)}
        />
      </div>
      <Button
        type="submit"
        disabled={isDisabled}
        variant="glow"
        className="w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs"
      >
        {!isElementReady || isLoading ? (
          <>
            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
            Loading...
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount}`
        )}
      </Button>
    </form>
  );
}
