import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TicketDisplay } from "@/components/TicketDisplay";

describe("TicketDisplay", () => {
  it("renders ticket details", () => {
    render(
      <TicketDisplay
        eventName="React Meetup"
        userName="Emtiaz Ahmed"
        date="2026-06-06T10:00:00.000Z"
        location="Dhaka"
        ticketId="ticket-123"
      />
    );

    expect(screen.getByText("Event Ticket")).toBeInTheDocument();
    expect(screen.getByText("React Meetup")).toBeInTheDocument();
    expect(screen.getByText("Emtiaz Ahmed")).toBeInTheDocument();
    expect(screen.getByText("Dhaka")).toBeInTheDocument();
    expect(screen.getByText(/ticket id: ticket-123/i)).toBeInTheDocument();
    expect(
      screen.getByText(/show this qr code at the entrance/i)
    ).toBeInTheDocument();
  });
});
