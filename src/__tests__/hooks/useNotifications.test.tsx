import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/lib/socket";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

vi.mock("@/lib/socket", () => ({
  connectSocket: vi.fn(),
  disconnectSocket: vi.fn(),
  getSocket: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

const mockConnectSocket = vi.mocked(connectSocket);
const mockDisconnectSocket = vi.mocked(disconnectSocket);
const mockGetSocket = vi.mocked(getSocket);
const mockToast = vi.mocked(toast);

describe("useNotifications", () => {
  const handlers: Record<string, (payload: any) => void> = {};
  const socket = {
    off: vi.fn((event: string) => {
      delete handlers[event];
    }),
    on: vi.fn((event: string, callback: (payload: any) => void) => {
      handlers[event] = callback;
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(handlers).forEach((key) => delete handlers[key]);
    mockGetSocket.mockReturnValue(socket as any);
  });

  it("does not connect without a user id", () => {
    renderHook(() => useNotifications(undefined));

    expect(mockConnectSocket).not.toHaveBeenCalled();
    expect(mockGetSocket).not.toHaveBeenCalled();
  });

  it("connects, receives notifications, marks all read, and cleans up", () => {
    const { result, unmount } = renderHook(() => useNotifications("user-1"));

    expect(mockConnectSocket).toHaveBeenCalledWith("user-1");
    expect(socket.on).toHaveBeenCalledWith(
      "new-notification",
      expect.any(Function)
    );

    act(() => {
      handlers["new-notification"]({
        createdAt: "2026-06-06T10:00:00.000Z",
        id: "notification-1",
        isRead: false,
        message: "New event",
        type: "EVENT",
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.unreadCount).toBe(1);
    expect(mockToast).toHaveBeenCalledWith("New event", {
      description: expect.any(String),
    });

    act(() => result.current.markAllRead());
    expect(result.current.unreadCount).toBe(0);

    unmount();
    expect(socket.off).toHaveBeenCalledWith("new-notification");
    expect(mockDisconnectSocket).toHaveBeenCalled();
  });
});
