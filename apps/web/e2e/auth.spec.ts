import { test, expect, type Page } from "@playwright/test";
import { mockApi } from "./fixtures";

// ─── Page Object Helpers ────────────────────────────────────────────────────

class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async fillEmail(email: string) {
    await this.page.getByLabel(/email/i).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel(/password/i).fill(password);
  }

  async submit() {
    await this.page.getByRole("button", { name: /sign in|log in/i }).click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}

class RegisterPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/register");
  }

  async fillName(name: string) {
    await this.page.getByLabel(/full name/i).fill(name);
  }

  async fillEmail(email: string) {
    await this.page.getByLabel(/email/i).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel("Password", { exact: true }).fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.page.getByLabel(/confirm password/i).fill(password);
  }

  async submit() {
    await this.page.getByRole("button", { name: /sign up|register|create account/i }).click();
  }

  async register(name: string, email: string, password: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
    await this.submit();
  }
}

// ─── Tests ──────────────────────────────────────────────────────────────────

test.describe("Authentication", () => {
  test("should log in and redirect to dashboard", async ({ page }) => {
    await mockApi(page);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await expect(page).toHaveURL(/\/login/);

    await loginPage.login("testuser@robotforge.io", "TestPassword123!");

    // After successful login, user should be redirected to the dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify dashboard content is visible
    await expect(
      page.getByText(/welcome back/i)
    ).toBeVisible();
  });

  test("should register a new user and redirect to dashboard", async ({
    page,
  }) => {
    await mockApi(page);
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await expect(page).toHaveURL(/\/register/);

    const uniqueEmail = `e2e-${Date.now()}@robotforge.io`;
    await registerPage.register("E2E Test User", uniqueEmail, "SecurePass456!");

    // After successful registration, user should be redirected to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should log out and redirect to login page", async ({ page }) => {
    await mockApi(page);

    // Make /api/auth/me return 401 AFTER logout so the app doesn't re-auth
    let loggedOut = false;
    await page.route("**/api/auth/me", async (route) => {
      if (loggedOut) {
        await route.fulfill({ status: 401, contentType: "application/json", body: '{"error":"Unauthorized"}' });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { id: "usr-test-001", email: "testuser@robotforge.io", name: "Test User", role: "operator", tier: "professional" } }) });
      }
    });

    const loginPage = new LoginPage(page);

    // Log in first
    await loginPage.goto();
    await loginPage.login("testuser@robotforge.io", "TestPassword123!");
    await page.waitForURL(/\/dashboard/, { timeout: 10_000 });

    // Mark as logged out before clicking
    loggedOut = true;

    // Click logout button (has title="Logout")
    const logoutButton = page.locator('button[title="Logout"]');
    await logoutButton.click();

    // Should be redirected to the login page
    await page.waitForURL(/\/login/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
