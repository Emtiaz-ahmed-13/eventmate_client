import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FollowServices } from "@/services/follow.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { FollowButton } from "@/components/FollowButton";

vi.mock("@/services/follow.service", () => ({
  FollowServices: {
    followHost: vi.fn(),
    unfollowHost: vi.fn(),
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

const mockUseAuthStore = vi.mocked(useAuthStore);
const mockFollowServices = vi.mocked(FollowServices);
const mockToast = vi.mocked(toast);

describe("FollowButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: "user-1", email: "user@test.com", name: "User", role: "USER" },
      accessToken: "token",
      setAuth: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("asks unauthenticated users to login", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      setAuth: vi.fn(),
      logout: vi.fn(),
    });

    render(<FollowButton hostId="host-1" />);

    await userEvent.click(screen.getByRole("button", { name: /follow host/i }));

    expect(mockToast.error).toHaveBeenCalledWith("Please login to follow hosts");
    expect(mockFollowServices.followHost).not.toHaveBeenCalled();
  });

  it("does not render for the host's own profile", () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: "host-1", email: "host@test.com", name: "Host", role: "HOST" },
      accessToken: "token",
      setAuth: vi.fn(),
      logout: vi.fn(),
    });

    render(<FollowButton hostId="host-1" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("follows a host", async () => {
    mockFollowServices.followHost.mockResolvedValue({});

    render(<FollowButton hostId="host-1" />);

    await userEvent.click(screen.getByRole("button", { name: /follow host/i }));

    await waitFor(() => {
      expect(mockFollowServices.followHost).toHaveBeenCalledWith("host-1");
    });
    expect(mockToast.success).toHaveBeenCalledWith("Following host");
    expect(screen.getByRole("button", { name: /following/i })).toBeInTheDocument();
  });

  it("unfollows a host", async () => {
    mockFollowServices.unfollowHost.mockResolvedValue({});

    render(<FollowButton hostId="host-1" initialIsFollowing />);

    await userEvent.click(screen.getByRole("button", { name: /following/i }));

    await waitFor(() => {
      expect(mockFollowServices.unfollowHost).toHaveBeenCalledWith("host-1");
    });
    expect(mockToast.success).toHaveBeenCalledWith("Unfollowed host");
    expect(screen.getByRole("button", { name: /follow host/i })).toBeInTheDocument();
  });
});
