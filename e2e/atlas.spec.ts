import { test, expect } from "@playwright/test";

test.describe("Sidequest Atlas", () => {
  test("home introduces the life atlas", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Sidequest Atlas/i })).toBeVisible();
    await expect(page.getByText(/Shen Ruililin/i).first()).toBeVisible();
  });

  test("family calendar shows where Shen is", async ({ page }) => {
    await page.goto("/calendar/");
    await expect(page.getByRole("heading", { name: /Where is Shen/i })).toBeVisible();
    await expect(page.getByText(/Radisson RED Oslo/i).first()).toBeVisible();
    await expect(page.getByText(/Scandic Wallin/i).first()).toBeVisible();
    await expect(page.getByText(/Bob W Helsinki Kaarti/i).first()).toBeVisible();
    await expect(page.getByText(/Silja Symphony/i).first()).toBeVisible();
    await expect(page.getByText(/Finnair/i).first()).toBeVisible();
  });

  test("Nordic trip renders", async ({ page }) => {
    await page.goto("/trips/nordics-2026/");
    await expect(page.getByText(/Nordic|Fieldwork|Oslo|Stockholm|Helsinki/i).first()).toBeVisible();
  });

  test("day page shows theme and coherence", async ({ page }) => {
    await page.goto("/trips/nordics-2026/days/2026-08-10/");
    await expect(page.getByText(/AG|splurge|Stockholm|theme|question/i).first()).toBeVisible();
  });

  test("sources page is inspectable", async ({ page }) => {
    await page.goto("/sources/");
    await expect(page.getByText(/source|claim|verif/i).first()).toBeVisible();
  });

  test("budget page loads", async ({ page }) => {
    await page.goto("/budget/");
    await expect(page.getByText(/budget|student|balanced|splurge|NOK|SEK|EUR/i).first()).toBeVisible();
  });
});
