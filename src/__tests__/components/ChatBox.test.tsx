import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatServices } from "@/services/chat.service";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";
import { ChatBox } from "@/components/ChatBox";

vi.mock("@/services/chat.service", () => ({
  ChatServices: {
    getEventMessages: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

vi.mock("@/store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/lib/socket", () => ({
  getSocket: vi.fn(),
}));

const mockChatServices = vi.mocked(ChatServices);
const mockUseAuthStore = vi.mocked(useAuthStore);
const mockGetSocket = vi.mocked(getSocket);

describe("ChatBox", () => {
  const socketHandlers: Record<string, (payload: any) => void> = {};
  const socket = {
    connected: false,
    connect: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    on: vi.fn((event: string, callback: (payload: any) => void) => {
      socketHandlers[event] = callback;
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(socketHandlers).forEach((key) => delete socketHandlers[key]);
    mockGetSocket.mockReturnValue(socket as any);
    mockUseAuthStore.mockReturnValue({
      user: { id: "user-1", email: "user@test.com", name: "User", role: "USER" },
      accessToken: "token",
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("shows an empty message when there are no messages", async () => {
    mockChatServices.getEventMessages.mockResolvedValue([]);

    render(<ChatBox eventId="event-1" />);

    expect(
      await screen.findByText(/no messages yet/i)
    ).toBeInTheDocument();
    expect(socket.connect).toHaveBeenCalled();
    expect(socket.emit).toHaveBeenCalledWith("join-chat", "event-1");
  });

  it("renders fetched messages", async () => {
    mockChatServices.getEventMessages.mockResolvedValue([
      {
        id: "message-1",
        message: "Hello everyone",
        userId: "user-2",
        user: { name: "Alice" },
        createdAt: "2026-06-06T10:00:00.000Z",
      },
    ]);

    render(<ChatBox eventId="event-1" />);

    expect(await screen.findByText("Hello everyone")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("sends a new message", async () => {
    mockChatServices.getEventMessages.mockResolvedValue([]);
    mockChatServices.sendMessage.mockResolvedValue({});

    render(<ChatBox eventId="event-1" />);

    const input = await screen.findByPlaceholderText(/type your message/i);
    await userEvent.type(input, "Hi team{enter}");

    await waitFor(() => {
      expect(mockChatServices.sendMessage).toHaveBeenCalledWith(
        "event-1",
        "Hi team"
      );
    });
    expect(input).toHaveValue("");
  });

  it("appends messages received from socket", async () => {
    mockChatServices.getEventMessages.mockResolvedValue([]);

    render(<ChatBox eventId="event-1" />);

    await screen.findByText(/no messages yet/i);

    act(() => {
      socketHandlers["new-message"]({
        id: "message-2",
        message: "Socket message",
        userId: "user-2",
        user: { name: "Bob" },
        createdAt: "2026-06-06T10:00:00.000Z",
      });
    });

    expect(screen.getByText("Socket message")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
