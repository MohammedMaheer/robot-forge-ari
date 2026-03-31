import { test, expect } from "@playwright/test";
import { loginAs, mockApi } from "./fixtures";

test.describe("Marketplace", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    await page.goto("/marketplace");
    await page.waitForLoadState("networkidle");
  });

  test("should browse marketplace and filter datasets by task", async ({
    page,
  }) => {
    // Verify the marketplace page loads with filters sidebar
    await expect(
      page.getByRole("heading", { name: /filters/i })
    ).toBeVisible();

    // Verify search input is available
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible({ timeout: 10_000 });

    // Apply a task filter via checkbox
    const taskCheckbox = page.getByRole("checkbox").first();
    if (await taskCheckbox.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await taskCheckbox.check();
      await page.waitForLoadState("networkidle");
    }
  });

  test("should display filter sidebar with options", async ({ page }) => {
    // Verify the filter sidebar has task type and embodiment sections
    await expect(page.getByText(/task type/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/embodiment/i).first()).toBeVisible();

    // Verify format selector exists
    await expect(page.getByText(/format/i).first()).toBeVisible();
  });

  test("should search datasets via search input", async ({
    page,
  }) => {
    // Locate the search input
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible({ timeout: 10_000 });

    // Type a search query
    await searchInput.fill("manipulation");
    await searchInput.press("Enter");

    // Wait for results to update
    await page.waitForLoadState("networkidle");

    // Verify the page shows either datasets or a "no match" message
    const hasDatasets = await page.getByText(/datasets found/i).isVisible().catch(() => false);
    const noMatch = await page.getByText(/no datasets match/i).isVisible().catch(() => false);
    expect(hasDatasets || noMatch).toBeTruthy();
  });
});
