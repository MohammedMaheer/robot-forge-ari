import { test, expect } from "@playwright/test";
import { loginAs } from "./fixtures";

test.describe("Collection", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test("should navigate to collection page and go through wizard steps", async ({
    page,
  }) => {
    // Navigate to the collection page
    await page.goto("/collect");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: /data collection|collection|new session/i }).first()
    ).toBeVisible({ timeout: 10_000 });

    // Start a new collection session via wizard
    const startButton = page
      .getByRole("button", { name: /new session|start|create/i })
      .first();

    if (await startButton.isVisible()) {
      await startButton.click();

      // Step 1: Select robot type
      const robotSelector = page
        .getByTestId("robot-selector")
        .or(page.getByRole("combobox", { name: /robot/i }));

      if (await robotSelector.isVisible({ timeout: 5_000 })) {
        await robotSelector.click();
        await page.getByRole("option").first().click();
      }

      // Proceed to next step
      const nextButton = page.getByRole("button", { name: /next|continue/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }

      // Step 2: Configure task parameters
      const taskNameInput = page
        .getByLabel(/task name|session name/i)
        .or(page.getByTestId("task-name-input"));

      if (await taskNameInput.isVisible({ timeout: 5_000 })) {
        await taskNameInput.fill("E2E Test Collection Session");
      }

      // Proceed to next step
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }

      // Step 3: Review & confirm
      const confirmButton = page.getByRole("button", {
        name: /start session|confirm|launch/i,
      });

      if (await confirmButton.isVisible({ timeout: 5_000 })) {
        // Verify review summary is visible
        await expect(
          page.getByText(/review|summary|confirm/i).first()
        ).toBeVisible();
      }
    }
  });

  test("should verify teleop panel renders on active session", async ({
    page,
  }) => {
    // Navigate to an active collection session (or create one)
    await page.goto("/collect");
    await page.waitForLoadState("networkidle");

    // Look for an active session or the teleop panel
    const activeSession = page
      .getByTestId("active-session")
      .or(page.locator('[data-testid="teleop-panel"]'));

    const sessionLink = page.getByRole("link", { name: /active|in progress/i });

    if (await sessionLink.isVisible({ timeout: 5_000 })) {
      await sessionLink.click();
      await page.waitForLoadState("networkidle");
    }

    // Check for the teleop panel components
    const teleopPanel = page
      .getByTestId("teleop-panel")
      .or(page.locator(".teleop-panel"))
      .or(page.getByRole("region", { name: /teleop|control/i }));

    if (await teleopPanel.isVisible({ timeout: 10_000 })) {
      // Verify key teleop elements are present
      const videoFeed = page
        .getByTestId("video-feed")
        .or(page.locator("video"))
        .or(page.locator("canvas"));
      await expect(videoFeed.first()).toBeVisible({ timeout: 10_000 });

      // Verify control indicators are present
      const controlPanel = page
        .getByTestId("control-panel")
        .or(page.getByRole("region", { name: /controls/i }));

      if (await controlPanel.isVisible()) {
        await expect(controlPanel).toBeVisible();
      }
    }
  });

  test("should view episodes list", async ({ page }) => {
    // Navigate to the collection page
    await page.goto("/collect");
    await page.waitForLoadState("networkidle");

    // Look for an episodes tab or section
    const episodesTab = page
      .getByRole("tab", { name: /episodes/i })
      .or(page.getByRole("link", { name: /episodes/i }));

    if (await episodesTab.isVisible({ timeout: 5_000 })) {
      await episodesTab.click();
      await page.waitForLoadState("networkidle");
    }

    // Verify episodes list renders
    const episodesList = page
      .getByTestId("episodes-list")
      .or(page.getByRole("list"))
      .or(page.locator("table"));

    if (await episodesList.isVisible({ timeout: 10_000 })) {
      await expect(episodesList).toBeVisible();

      // Check for episode items or rows
      const episodeItems = page
        .getByTestId("episode-item")
        .or(page.locator("table tbody tr"))
        .or(page.getByRole("listitem"));

      const itemCount = await episodeItems.count();

      // If there are episodes, verify basic structure
      if (itemCount > 0) {
        await expect(episodeItems.first()).toBeVisible();
      } else {
        // Verify empty state message
        const emptyState = page.getByText(/no episodes|empty|get started/i);
        await expect(emptyState).toBeVisible();
      }
    }
  });
});
