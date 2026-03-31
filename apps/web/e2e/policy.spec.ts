import { test, expect } from "@playwright/test";
import { loginAs } from "./fixtures";

test.describe("Policy Server", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test("should navigate to policy page and display header", async ({
    page,
  }) => {
    await page.goto("/policy");
    await page.waitForLoadState("networkidle");

    // Verify the policy page loads with a heading
    await expect(
      page.getByRole("heading", { name: /policy server/i })
    ).toBeVisible();
  });

  test("should display protocol toggle buttons", async ({ page }) => {
    await page.goto("/policy");
    await page.waitForLoadState("networkidle");

    // Protocol toggle (gRPC / ZMQ) should be visible
    await expect(page.getByRole("button", { name: /grpc/i })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("button", { name: /zmq/i })).toBeVisible();

    // Click ZMQ to toggle protocol
    await page.getByRole("button", { name: /zmq/i }).click();
    // Click back to gRPC
    await page.getByRole("button", { name: /grpc/i }).click();
  });

  test("should display model selection options", async ({ page }) => {
    await page.goto("/policy");
    await page.waitForLoadState("networkidle");

    // Model selection radio labels should be visible
    const models = ["ACT", "SmolVLA", "Pi-Zero", "Diffusion Policy", "Custom"];
    for (const model of models) {
      await expect(
        page.getByText(new RegExp(model, "i")).first()
      ).toBeVisible({ timeout: 10_000 });
    }
  });

  test("should allow selecting a model", async ({ page }) => {
    await page.goto("/policy");
    await page.waitForLoadState("networkidle");

    // Click on ACT model radio to select it
    const actLabel = page.getByText("ACT").first();
    await expect(actLabel).toBeVisible({ timeout: 10_000 });
    await actLabel.click();

    // Click on a different model
    const piZeroLabel = page.getByText(/Pi-Zero/i).first();
    await piZeroLabel.click();
  });

  test("should display server address input", async ({ page }) => {
    await page.goto("/policy");
    await page.waitForLoadState("networkidle");

    // Server address input should be visible
    const addressInput = page
      .getByPlaceholder(/address|host|server/i)
      .or(page.getByLabel(/address|host|server/i));

    await expect(addressInput).toBeVisible({ timeout: 10_000 });

    // Should be able to type a server address
    await addressInput.clear();
    await addressInput.fill("localhost:50051");
    await expect(addressInput).toHaveValue("localhost:50051");
  });

  test("should show connect button", async ({ page }) => {
    await page.goto("/policy");
    await page.waitForLoadState("networkidle");

    // Connect button should be visible
    const connectButton = page.getByRole("button", {
      name: /connect/i,
    });
    await expect(connectButton.first()).toBeVisible({ timeout: 10_000 });
  });

  test("should display quick start guide section", async ({ page }) => {
    await page.goto("/policy");
    await page.waitForLoadState("networkidle");

    // Quick start guide section should be visible
    await expect(page.getByText(/quick start/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("should show status panel", async ({ page }) => {
    await page.goto("/policy");
    await page.waitForLoadState("networkidle");

    // Status section should be visible (either connected or disconnected)
    await expect(
      page.getByText(/status|connection/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
