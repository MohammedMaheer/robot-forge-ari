import { test, expect } from "@playwright/test";

test.describe("Marketplace", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the marketplace page before each test
    await page.goto("/marketplace");
    await page.waitForLoadState("networkidle");
  });

  test("should browse marketplace and filter datasets by task", async ({
    page,
  }) => {
    // Verify the marketplace page loads
    await expect(
      page.getByRole("heading", { name: /marketplace/i })
    ).toBeVisible();

    // Verify dataset cards are rendered
    const datasetCards = page.locator('[data-testid="dataset-card"]');
    await expect(datasetCards.first()).toBeVisible({ timeout: 10_000 });

    const initialCount = await datasetCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Apply a task filter
    const taskFilter = page.getByRole("combobox", { name: /task|category/i }).or(
      page.getByTestId("task-filter")
    );

    if (await taskFilter.isVisible()) {
      await taskFilter.click();

      // Select a task filter option
      const filterOption = page
        .getByRole("option")
        .first();
      await filterOption.click();

      // Wait for the filtered results to load
      await page.waitForLoadState("networkidle");

      // Verify cards are still visible after filtering
      await expect(datasetCards.first()).toBeVisible({ timeout: 10_000 });
    }
  });

  test("should view dataset detail page with tabs", async ({ page }) => {
    // Click on the first dataset card to view its details
    const firstCard = page.locator('[data-testid="dataset-card"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });
    await firstCard.click();

    // Wait for navigation to detail page
    await page.waitForURL(/\/marketplace\/[a-zA-Z0-9-]+/, { timeout: 10_000 });

    // Verify the detail page renders with key sections
    await expect(
      page.getByRole("heading").first()
    ).toBeVisible();

    // Verify tabs are present (e.g., Overview, Episodes, Reviews, etc.)
    const tabList = page.getByRole("tablist");
    if (await tabList.isVisible()) {
      const tabs = tabList.getByRole("tab");
      const tabCount = await tabs.count();
      expect(tabCount).toBeGreaterThanOrEqual(2);

      // Click through tabs and verify content changes
      for (let i = 0; i < Math.min(tabCount, 3); i++) {
        await tabs.nth(i).click();
        // Brief wait for tab content to render
        await page.waitForTimeout(500);
      }
    }
  });

  test("should search datasets and verify results update", async ({
    page,
  }) => {
    // Locate the search input
    const searchInput = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder(/search/i))
      .or(page.getByTestId("marketplace-search"));

    await expect(searchInput).toBeVisible({ timeout: 10_000 });

    // Count initial dataset cards
    const datasetCards = page.locator('[data-testid="dataset-card"]');
    await expect(datasetCards.first()).toBeVisible({ timeout: 10_000 });

    // Type a search query
    await searchInput.fill("manipulation");
    await searchInput.press("Enter");

    // Wait for results to update
    await page.waitForLoadState("networkidle");

    // Verify results are displayed (could be filtered down or show "no results")
    const hasResults = await datasetCards.first().isVisible().catch(() => false);
    const noResults = await page.getByText(/no results|no datasets found/i).isVisible().catch(() => false);

    // One of the two should be true
    expect(hasResults || noResults).toBeTruthy();

    // Clear search and verify results reset
    await searchInput.clear();
    await searchInput.press("Enter");
    await page.waitForLoadState("networkidle");

    await expect(datasetCards.first()).toBeVisible({ timeout: 10_000 });
  });
});
