import { test, expect, type Page } from "@playwright/test";

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
    await this.page.getByLabel(/name/i).first().fill(name);
  }

  async fillEmail(email: string) {
    await this.page.getByLabel(/email/i).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel(/^password$/i).fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.page.getByLabel(/confirm password/i).fill(password);
  }

  async submit() {
    await this.page.getByRole("button", { name: /sign up|register/i }).click();
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
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await expect(page).toHaveURL(/\/login/);

    await loginPage.login("testuser@robotforge.io", "TestPassword123!");

    // After successful login, user should be redirected to the dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify dashboard content is visible
    await expect(
      page.getByRole("heading", { name: /dashboard/i })
    ).toBeVisible();
  });

  test("should register a new user and redirect to dashboard", async ({
    page,
  }) => {
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
    const loginPage = new LoginPage(page);

    // Log in first
    await loginPage.goto();
    await loginPage.login("testuser@robotforge.io", "TestPassword123!");
    await page.waitForURL(/\/dashboard/, { timeout: 10_000 });

    // Perform logout
    const userMenu = page.getByRole("button", { name: /user|profile|avatar/i });
    if (await userMenu.isVisible()) {
      await userMenu.click();
    }

    await page.getByRole("menuitem", { name: /log out|sign out/i }).click();

    // Should be redirected to the login page
    await page.waitForURL(/\/login/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
