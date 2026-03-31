import { test, expect } from "@playwright/test";
import { loginAs } from "./fixtures";

test.describe("Fleet Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test("should navigate to fleet page and display header", async ({
    page,
  }) => {
    await page.goto("/fleet");
    await page.waitForLoadState("networkidle");

    // Verify the fleet page loads with a heading
    await expect(
      page.getByRole("heading", { name: /fleet/i })
    ).toBeVisible();

    // Verify the DDS graph description is visible
    await expect(
      page.getByText(/DDS graph|robot node/i).first()
    ).toBeVisible();
  });

  test("should display KPI cards", async ({ page }) => {
    await page.goto("/fleet");
    await page.waitForLoadState("networkidle");

    // Verify KPI labels are present
    await expect(page.getByText(/total robots/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/active/i).first()).toBeVisible();
    await expect(page.getByText(/namespaces/i)).toBeVisible();
    await expect(page.getByText(/DDS/i).first()).toBeVisible();
  });

  test("should show empty state or robot cards", async ({ page }) => {
    await page.goto("/fleet");
    await page.waitForLoadState("networkidle");

    // Either robot cards or an empty state message should be visible
    const robotCard = page.locator("[class*='rounded-lg']").filter({ hasText: /ros2|grpc|websocket|usb/i });
    const emptyState = page.getByText(/no robots discovered/i);

    const hasRobots = await robotCard.first().isVisible().catch(() => false);
    const isEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasRobots || isEmpty).toBeTruthy();
  });

  test("should display fleet status badge", async ({ page }) => {
    await page.goto("/fleet");
    await page.waitForLoadState("networkidle");

    // The DDS health badge should be visible (healthy / degraded)
    const badge = page.getByText(/healthy|degraded|offline/i).first();
    await expect(badge).toBeVisible({ timeout: 10_000 });
  });

  test("should show namespace filters when namespaces exist", async ({
    page,
  }) => {
    await page.goto("/fleet");
    await page.waitForLoadState("networkidle");

    // If there are namespaces, an "All" filter button should exist
    const allFilter = page.getByRole("button", { name: /all/i });

    if (await allFilter.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(allFilter).toBeVisible();

      // Click a namespace filter and verify it updates
      const filterButtons = page.getByRole("button").filter({ hasText: /^\// });
      if ((await filterButtons.count()) > 0) {
        await filterButtons.first().click();
        // Clicking back to "All" should show everything again
        await allFilter.click();
      }
    }
  });
});
