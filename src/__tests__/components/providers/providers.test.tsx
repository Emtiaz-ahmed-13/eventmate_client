import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { loadStripe } from "@stripe/stripe-js";
import QueryProvider from "@/components/providers/QueryProvider";
import StripeProvider from "@/components/providers/StripeProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: ({ initialIsOpen }: { initialIsOpen: boolean }) => (
    <div
      data-testid="react-query-devtools"
      data-initial-open={String(initialIsOpen)}
    />
  ),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({
    children,
    options,
  }: {
    children: ReactNode;
    options?: { clientSecret?: string };
  }) => (
    <div
      data-testid="stripe-elements"
      data-client-secret={options?.clientSecret || ""}
    >
      {children}
    </div>
  ),
}));

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() => Promise.resolve({})),
}));

vi.mock("next-themes", () => ({
  ThemeProvider: ({
    children,
    attribute,
    defaultTheme,
    enableSystem,
  }: {
    children: ReactNode;
    attribute: string;
    defaultTheme: string;
    enableSystem: boolean;
  }) => (
    <div
      data-testid="theme-provider"
      data-attribute={attribute}
      data-default-theme={defaultTheme}
      data-enable-system={String(enableSystem)}
    >
      {children}
    </div>
  ),
}));

describe("QueryProvider", () => {
  it("renders children and React Query devtools", () => {
    render(
      <QueryProvider>
        <p>Query child</p>
      </QueryProvider>
    );

    expect(screen.getByText("Query child")).toBeInTheDocument();
    expect(screen.getByTestId("react-query-devtools")).toHaveAttribute(
      "data-initial-open",
      "false"
    );
  });
});

describe("StripeProvider", () => {
  it("renders children inside Stripe Elements", () => {
    render(
      <StripeProvider clientSecret="client_secret_123">
        <p>Stripe child</p>
      </StripeProvider>
    );

    expect(loadStripe).toHaveBeenCalled();
    expect(screen.getByTestId("stripe-elements")).toHaveAttribute(
      "data-client-secret",
      "client_secret_123"
    );
    expect(screen.getByText("Stripe child")).toBeInTheDocument();
  });
});

describe("ThemeProvider", () => {
  it("uses dark theme configuration", () => {
    render(
      <ThemeProvider>
        <p>Theme child</p>
      </ThemeProvider>
    );

    expect(screen.getByText("Theme child")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toHaveAttribute(
      "data-attribute",
      "class"
    );
    expect(screen.getByTestId("theme-provider")).toHaveAttribute(
      "data-default-theme",
      "dark"
    );
    expect(screen.getByTestId("theme-provider")).toHaveAttribute(
      "data-enable-system",
      "false"
    );
  });
});
