import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders a clickable button with text", () => {
    render(<Button>Save Event</Button>);

    const button = screen.getByRole("button", { name: /save event/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("supports disabled state", () => {
    render(<Button disabled>Loading</Button>);

    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
  });
});

describe("Badge", () => {
  it("renders badge content", () => {
    render(<Badge>Open</Badge>);

    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Badge variant="blue">Paid</Badge>);

    expect(screen.getByText("Paid")).toHaveClass("text-blue-400");
  });
});

describe("Card", () => {
  it("renders all card sections", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>React Meetup</CardTitle>
          <CardDescription>Community event</CardDescription>
        </CardHeader>
        <CardContent>Event details</CardContent>
        <CardFooter>Join now</CardFooter>
      </Card>
    );

    expect(screen.getByText("React Meetup")).toBeInTheDocument();
    expect(screen.getByText("Community event")).toBeInTheDocument();
    expect(screen.getByText("Event details")).toBeInTheDocument();
    expect(screen.getByText("Join now")).toBeInTheDocument();
  });
});
