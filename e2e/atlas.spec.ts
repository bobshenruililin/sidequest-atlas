import { test, expect } from "@playwright/test";

test.describe("Sidequest Atlas", () => {
  test("home is the family Where is Shen calendar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Where is Shen/i })).toBeVisible();
    await expect(page.getByText(/Shen Ruililin/i).first()).toBeVisible();
    await expect(page.getByText(/Radisson RED Oslo/i).first()).toBeVisible();
    await expect(page.getByText(/Scandic Wallin/i).first()).toBeVisible();
    await expect(page.getByText(/Bob W Helsinki Kaarti/i).first()).toBeVisible();
    await expect(page.getByText(/Silja Symphony/i).first()).toBeVisible();
    await expect(page.getByText(/Finnair/i).first()).toBeVisible();
  });

  test("calendar alias still shows the family page", async ({ page }) => {
    await page.goto("/calendar/");
    await expect(page.getByRole("heading", { name: /Where is Shen/i })).toBeVisible();
    await expect(page.getByText(/Radisson RED Oslo/i).first()).toBeVisible();
  });

  test("full itinerary still available", async ({ page }) => {
    await page.goto("/trips/nordics-2026/");
    await expect(page.getByText(/Nordic|Fieldwork|Oslo|Stockholm|Helsinki/i).first()).toBeVisible();
  });
});
