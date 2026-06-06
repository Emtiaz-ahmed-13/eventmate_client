import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentServices } from "@/services/payment.service";
import PaymentForm from "@/components/PaymentForm";

vi.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: ({ onReady }: { onReady?: () => void }) => {
    useEffect(() => {
      onReady?.();
    }, [onReady]);

    return <div data-testid="payment-element" />;
  },
  useElements: vi.fn(),
  useStripe: vi.fn(),
}));

vi.mock("@/services/payment.service", () => ({
  PaymentServices: {
    confirmPayment: vi.fn(),
  },
}));

const mockUseStripe = vi.mocked(useStripe);
const mockUseElements = vi.mocked(useElements);
const mockPaymentServices = vi.mocked(PaymentServices);

describe("PaymentForm", () => {
  const confirmPayment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStripe.mockReturnValue({ confirmPayment } as any);
    mockUseElements.mockReturnValue({} as any);
    mockPaymentServices.confirmPayment.mockResolvedValue({});
  });

  it("renders Stripe payment element and amount", async () => {
    render(
      <PaymentForm
        amount={25}
        eventName="React Meetup"
        onError={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /pay \$25/i })
    ).toBeEnabled();
  });

  it("confirms payment and calls success callback", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    confirmPayment.mockResolvedValue({
      paymentIntent: { id: "pi_123", status: "succeeded" },
    });

    render(
      <PaymentForm
        amount={25}
        eventName="React Meetup"
        onError={onError}
        onSuccess={onSuccess}
      />
    );

    await userEvent.click(await screen.findByRole("button", { name: /pay \$25/i }));

    await waitFor(() => {
      expect(confirmPayment).toHaveBeenCalledWith({
        elements: {},
        confirmParams: { return_url: "http://localhost:3000/events" },
        redirect: "if_required",
      });
    });
    expect(mockPaymentServices.confirmPayment).toHaveBeenCalledWith("pi_123");
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it("calls error callback when Stripe returns an error", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    confirmPayment.mockResolvedValue({
      error: { message: "Card declined" },
    });

    render(
      <PaymentForm
        amount={25}
        eventName="React Meetup"
        onError={onError}
        onSuccess={onSuccess}
      />
    );

    await userEvent.click(await screen.findByRole("button", { name: /pay \$25/i }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith("Card declined");
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
