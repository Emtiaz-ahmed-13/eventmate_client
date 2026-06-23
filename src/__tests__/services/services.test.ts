import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminServices } from "@/services/admin.service";
import { AnalyticsServices } from "@/services/analytics.service";
import { AuthService } from "@/services/auth.service";
import { ChatServices } from "@/services/chat.service";
import { DiscussionServices } from "@/services/discussion.service";
import { EventServices } from "@/services/event.service";
import { FollowServices } from "@/services/follow.service";
import { PaymentServices } from "@/services/payment.service";
import { ReviewServices } from "@/services/review.service";
import { UserServices } from "@/services/user.service";
import api from "@/lib/api";

vi.mock("@/lib/api", () => ({
  default: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

describe("API services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.get.mockResolvedValue({ data: { data: "payload" } });
    mockApi.post.mockResolvedValue({ data: { data: "payload", success: true } });
    mockApi.patch.mockResolvedValue({ data: { data: "payload", success: true } });
    mockApi.delete.mockResolvedValue({ data: { success: true } });
  });

  it("calls auth endpoints", async () => {
    await AuthService.login({ email: "user@test.com", password: "secret" });
    expect(mockApi.post).toHaveBeenCalledWith(
      "/auth/login",
      { email: "user@test.com", password: "secret" },
      { timeout: 60000 }
    );

    await AuthService.register({ name: "User" });
    expect(mockApi.post).toHaveBeenCalledWith(
      "/auth/register",
      { name: "User" },
      { timeout: 60000 }
    );

    await AuthService.getMe();
    expect(mockApi.get).toHaveBeenCalledWith("/auth/me", { timeout: 10000 });

    await AuthService.logout();
    expect(mockApi.post).toHaveBeenCalledWith(
      "/auth/logout",
      {},
      { timeout: 10000 }
    );

    await AuthService.forgotPassword("user@test.com");
    expect(mockApi.post).toHaveBeenCalledWith(
      "/auth/forgot-password",
      { email: "user@test.com" },
      { timeout: 10000 }
    );

    await AuthService.resetPassword("token-1", "new-secret");
    expect(mockApi.post).toHaveBeenCalledWith(
      "/auth/reset-password?token=token-1",
      { newPassword: "new-secret" },
      { timeout: 10000 }
    );
  });

  it("calls event endpoints", async () => {
    await EventServices.getAllEvents({ page: 1 });
    expect(mockApi.get).toHaveBeenCalledWith("/events", { params: { page: 1 } });

    await EventServices.getEventById("event-1");
    expect(mockApi.get).toHaveBeenCalledWith("/events/event-1");

    await EventServices.createEvent("form-data");
    expect(mockApi.post).toHaveBeenCalledWith("/events", "form-data", {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await EventServices.approveParticipant("event-1", "user-1");
    expect(mockApi.patch).toHaveBeenCalledWith(
      "/events/event-1/participants/user-1/approve"
    );

    await EventServices.verifyTicket("event-1", "ticket-1");
    expect(mockApi.patch).toHaveBeenCalledWith(
      "/events/event-1/participants/verify/ticket-1"
    );
  });

  it("calls user endpoints", async () => {
    await UserServices.getUserProfile("user-1");
    expect(mockApi.get).toHaveBeenCalledWith("/users/user-1");

    await UserServices.updateProfile({ bio: "Hello" });
    expect(mockApi.patch).toHaveBeenCalledWith("/users/update-profile", {
      bio: "Hello",
    });

    await UserServices.getAllHosts({ page: 1 });
    expect(mockApi.get).toHaveBeenCalledWith("/users/hosts", {
      params: { page: 1 },
    });
  });

  it("calls payment, review, chat, discussion, follow, analytics, and admin endpoints", async () => {
    await PaymentServices.createPaymentIntent("event-1");
    expect(mockApi.post).toHaveBeenCalledWith("/payments/create-intent", {
      eventId: "event-1",
      promoCode: undefined,
    });

    await PaymentServices.createPaymentIntent("event-1", "SAVE20");
    expect(mockApi.post).toHaveBeenCalledWith("/payments/create-intent", {
      eventId: "event-1",
      promoCode: "SAVE20",
    });

    await PaymentServices.confirmPayment("pi_123");
    expect(mockApi.post).toHaveBeenCalledWith("/payments/confirm", {
      paymentIntentId: "pi_123",
    });

    await ReviewServices.getAllReviews(10);
    expect(mockApi.get).toHaveBeenCalledWith("/reviews?limit=10");

    await ChatServices.sendMessage("event-1", "Hello");
    expect(mockApi.post).toHaveBeenCalledWith("/chats/event-1", {
      message: "Hello",
    });

    await DiscussionServices.answerQuestion("discussion-1", "Answer");
    expect(mockApi.patch).toHaveBeenCalledWith(
      "/discussions/discussion-1/answer",
      { answer: "Answer" }
    );

    await FollowServices.followHost("host-1");
    expect(mockApi.post).toHaveBeenCalledWith("/follows/host-1/follow");

    await AnalyticsServices.getOverview();
    expect(mockApi.get).toHaveBeenCalledWith("/analytics/overview");

    await AdminServices.changeUserRole("user-1", "HOST");
    expect(mockApi.patch).toHaveBeenCalledWith("/Admin/users/user-1/role", {
      role: "HOST",
    });
  });
});
