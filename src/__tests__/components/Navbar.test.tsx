import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "next-themes";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/auth.store";
import { Navbar } from "@/components/Navbar";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

vi.mock("@/hooks/useNotifications", () => ({
  useNotifications: vi.fn(),
}));

const mockUseAuthStore = vi.mocked(useAuthStore);
const mockUseTheme = vi.mocked(useTheme);
const mockUseNotifications = vi.mocked(useNotifications);

describe("Navbar", () => {
  const logout = vi.fn();
  const setTheme = vi.fn();
  const markAllRead = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme,
    } as any);
    mockUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      markAllRead,
    });
  });

  it("renders public navigation for guests", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      setAuth: vi.fn(),
      logout,
    });

    render(<Navbar />);

    expect(screen.getByText("Event")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Become Host")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join now/i })).toBeInTheDocument();
    expect(await screen.findByTitle("Toggle theme")).toBeInTheDocument();
  });

  it("renders host navigation when a host is logged in", () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: "host-1", email: "host@test.com", name: "Jane Host", role: "HOST" },
      accessToken: "token",
      setAuth: vi.fn(),
      logout,
    });

    render(<Navbar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("renders admin link for admins", () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: "admin-1", email: "admin@test.com", name: "Admin", role: "ADMIN" },
      accessToken: "token",
      setAuth: vi.fn(),
      logout,
    });

    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute(
      "href",
      "/admin"
    );
  });

  it("opens notifications and marks them as read", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: "user-1", email: "user@test.com", name: "User", role: "USER" },
      accessToken: "token",
      setAuth: vi.fn(),
      logout,
    });
    mockUseNotifications.mockReturnValue({
      notifications: [
        {
          id: "notification-1",
          message: "New event update",
          isRead: false,
          createdAt: "2026-06-06T10:00:00.000Z",
        },
      ],
      unreadCount: 2,
      markAllRead,
    });

    render(<Navbar />);

    await userEvent.click(screen.getByText("2").closest("button")!);

    expect(markAllRead).toHaveBeenCalled();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("New event update")).toBeInTheDocument();
  });

  it("toggles the theme", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      setAuth: vi.fn(),
      logout,
    });

    render(<Navbar />);

    await userEvent.click(await screen.findByTitle("Toggle theme"));

    await waitFor(() => {
      expect(setTheme).toHaveBeenCalledWith("light");
    });
  });
});
