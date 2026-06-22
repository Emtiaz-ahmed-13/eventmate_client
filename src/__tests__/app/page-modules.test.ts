import { describe, expect, it } from "vitest";

const pages = [
  { route: "/", load: () => import("@/app/page") },
  { route: "/admin", load: () => import("@/app/admin/page") },
  { route: "/admin/event-shield", load: () => import("@/app/admin/event-shield/page") },
  { route: "/admin/events", load: () => import("@/app/admin/events/page") },
  { route: "/admin/host-verifications", load: () => import("@/app/admin/host-verifications/page") },
  { route: "/admin/hosts", load: () => import("@/app/admin/hosts/page") },
  { route: "/admin/system-logs", load: () => import("@/app/admin/system-logs/page") },
  { route: "/admin/users", load: () => import("@/app/admin/users/page") },
  { route: "/dashboard", load: () => import("@/app/dashboard/page") },
  { route: "/dashboard/scan", load: () => import("@/app/dashboard/scan/page") },
  { route: "/events", load: () => import("@/app/events/page") },
  { route: "/events/[id]", load: () => import("@/app/events/[id]/page") },
  { route: "/events/[id]/analytics", load: () => import("@/app/events/[id]/analytics/page") },
  { route: "/events/[id]/edit", load: () => import("@/app/events/[id]/edit/page") },
  { route: "/events/create", load: () => import("@/app/events/create/page") },
  { route: "/forgot-password", load: () => import("@/app/forgot-password/page") },
  { route: "/hosts", load: () => import("@/app/hosts/page") },
  { route: "/login", load: () => import("@/app/login/page") },
  { route: "/profile/[id]", load: () => import("@/app/profile/[id]/page") },
  { route: "/register", load: () => import("@/app/register/page") },
  { route: "/reset-password", load: () => import("@/app/reset-password/page") },
  { route: "/reviews", load: () => import("@/app/reviews/page") },
  { route: "/saved", load: () => import("@/app/saved/page") },
];

describe("app page modules", () => {
  it.each(pages)("$route exports a page component", async ({ load }) => {
    const pageModule = await load();

    expect(pageModule.default).toEqual(expect.any(Function));
  });
});
