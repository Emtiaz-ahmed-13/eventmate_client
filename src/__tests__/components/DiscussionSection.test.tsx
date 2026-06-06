import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DiscussionServices } from "@/services/discussion.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { DiscussionSection } from "@/components/DiscussionSection";

vi.mock("@/services/discussion.service", () => ({
  DiscussionServices: {
    answerQuestion: vi.fn(),
    createQuestion: vi.fn(),
    getEventDiscussions: vi.fn(),
  },
}));

vi.mock("@/store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockDiscussionServices = vi.mocked(DiscussionServices);
const mockUseAuthStore = vi.mocked(useAuthStore);
const mockToast = vi.mocked(toast);

describe("DiscussionSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      user: { id: "user-1", email: "user@test.com", name: "User", role: "USER" },
      accessToken: "token",
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("shows empty discussion state", async () => {
    mockDiscussionServices.getEventDiscussions.mockResolvedValue([]);

    render(<DiscussionSection eventId="event-1" isHost={false} />);

    expect(await screen.findByText(/no discussions yet/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/ask a question about this event/i)
    ).toBeInTheDocument();
  });

  it("lets a participant post a question", async () => {
    mockDiscussionServices.getEventDiscussions.mockResolvedValue([]);
    mockDiscussionServices.createQuestion.mockResolvedValue({
      id: "discussion-1",
      question: "Is parking available?",
      userId: "user-1",
      user: { name: "User" },
      createdAt: "2026-06-06T10:00:00.000Z",
    });

    render(<DiscussionSection eventId="event-1" isHost={false} />);

    await userEvent.type(
      await screen.findByPlaceholderText(/ask a question about this event/i),
      "Is parking available?"
    );
    await userEvent.click(screen.getByRole("button", { name: /post question/i }));

    await waitFor(() => {
      expect(mockDiscussionServices.createQuestion).toHaveBeenCalledWith(
        "event-1",
        "Is parking available?"
      );
    });
    expect(mockToast.success).toHaveBeenCalledWith("Question posted!");
    expect(screen.getByText("Is parking available?")).toBeInTheDocument();
  });

  it("lets a host answer a question", async () => {
    mockDiscussionServices.getEventDiscussions.mockResolvedValue([
      {
        id: "discussion-1",
        question: "Is parking available?",
        userId: "user-2",
        user: { name: "Alice" },
        createdAt: "2026-06-06T10:00:00.000Z",
      },
    ]);
    mockDiscussionServices.answerQuestion.mockResolvedValue({});

    render(<DiscussionSection eventId="event-1" isHost />);

    expect(
      screen.queryByPlaceholderText(/ask a question about this event/i)
    ).not.toBeInTheDocument();

    await userEvent.type(
      await screen.findByPlaceholderText(/type your answer/i),
      "Yes, parking is available."
    );
    await userEvent.click(screen.getByRole("button", { name: /reply/i }));

    await waitFor(() => {
      expect(mockDiscussionServices.answerQuestion).toHaveBeenCalledWith(
        "discussion-1",
        "Yes, parking is available."
      );
    });
    expect(mockToast.success).toHaveBeenCalledWith("Answer posted!");
    expect(screen.getByText("Yes, parking is available.")).toBeInTheDocument();
  });
});
