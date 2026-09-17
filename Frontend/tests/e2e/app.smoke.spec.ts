import { expect, test } from "@playwright/test";

test("guest can reach the login screen", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page).toHaveURL(/auth\/login/);
  await expect(page.locator("body")).toBeVisible();
});

test("offline fallback route renders", async ({ page }) => {
  await page.goto("/offline");
  await expect(page.getByRole("heading", { name: "You are offline" })).toBeVisible();
});
