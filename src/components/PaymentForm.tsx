"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { PaymentServices } from "@/services/payment.service";

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
  eventName: string;
  isLoading?: boolean;
}

export default function PaymentForm({ 
  onSuccess, 
  onError, 
  amount, 
  eventName,
  isLoading = false 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/events`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment on backend
        await PaymentServices.confirmPayment(paymentIntent.id);
        onSuccess();
        setIsProcessing(false);
      } else {
        onError("Payment was not completed");
        setIsProcessing(false);
      }
    } catch (err: any) {
      onError(err.response?.data?.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Event Fee</span>
          <span className="text-xl font-black text-white">${amount}</span>
        </div>
        <p className="text-xs text-slate-500 truncate">{eventName}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-xl border border-white/5">
          <CreditCard className="w-4 h-4 text-primary" />
          <span className="text-white text-sm font-medium">Payment Details</span>
        </div>
        
        <div className="p-3 bg-slate-800/30 rounded-xl border border-white/5">
          <PaymentElement 
            options={{
              layout: "tabs"
            }}
          />
        </div>
      </div>

      <Button 
        type="submit"
        disabled={!stripe || isProcessing || isLoading}
        variant="glow"
        className="w-full h-10 rounded-xl font-black uppercase tracking-[0.2em] text-xs"
      >
        {isProcessing ? (
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