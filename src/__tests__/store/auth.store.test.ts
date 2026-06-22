import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/store/auth.store";

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      user: null,
    });
  });

  it("stores auth state and access token", () => {
    const user = {
      email: "user@test.com",
      id: "user-1",
      name: "User",
      role: "USER",
    };

    useAuthStore.getState().setAuth(user, "token-123");

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().accessToken).toBe("token-123");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("token-123");
  });

  it("clears auth state on logout", () => {
    useAuthStore.getState().setAuth(
      { email: "user@test.com", id: "user-1", role: "USER" },
      "token-123"
    );

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});
