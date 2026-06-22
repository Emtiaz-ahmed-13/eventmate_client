import { expect, test } from "@playwright/test";

test.describe("public app smoke", () => {
  test("loads the home page and exposes primary navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/EventMate/i);
    await expect(page.getByText("EventMate").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /explore/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /become host/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /find events near you/i })
    ).toBeVisible();
  });

  test("opens the events page from home", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /explore/i }).click();

    await expect(page).toHaveURL(/\/events$/);
    await expect(page.getByPlaceholder(/search for events/i)).toBeVisible();
  });
});
