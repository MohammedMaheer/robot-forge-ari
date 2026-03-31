/**
 * Shared Playwright fixtures for API mocking.
 *
 * Since e2e tests run against the Vite dev server without a live backend,
 * we intercept API calls and return mock data, enabling tests to validate
 * page rendering, navigation, and user interactions independently.
 */

import { type Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_USER = {
  id: "usr-test-001",
  email: "testuser@robotforge.io",
  name: "Test User",
  role: "operator",
  tier: "professional",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-06-01T00:00:00Z",
};

const MOCK_TOKENS = {
  accessToken: "mock-at-" + Date.now(),
  refreshToken: "mock-rt-" + Date.now(),
  expiresIn: 900,
};

const MOCK_FLEET_STATUS = {
  data: {
    healthy: true,
    robots: [
      {
        robotId: "franka-01",
        name: "Franka Emika Panda #1",
        embodiment: "franka_panda",
        namespace: "/robot/franka01",
        connectionType: "ros2",
        status: "connected",
        topicsDiscovered: [
          { name: "/joint_states", messageType: "sensor_msgs/JointState", hz: 500 },
          { name: "/ee_pose", messageType: "geometry_msgs/PoseStamped", hz: 100 },
        ],
        ros2Status: {
          nodeActive: true,
          controllerState: "active",
          ddsConnected: true,
        },
      },
      {
        robotId: "ur5e-01",
        name: "UR5e Arm",
        embodiment: "ur5",
        namespace: "/robot/ur5e",
        connectionType: "ros2",
        status: "connected",
        topicsDiscovered: [
          { name: "/joint_states", messageType: "sensor_msgs/JointState", hz: 125 },
        ],
        ros2Status: {
          nodeActive: true,
          controllerState: "active",
          ddsConnected: true,
        },
      },
    ],
    namespaces: ["/robot/franka01", "/robot/ur5e"],
    totalRobots: 2,
    activeRobots: 2,
    ddsStatus: "healthy",
  },
};

const MOCK_ROBOTS = {
  data: [
    {
      id: "franka-01",
      name: "Franka Emika Panda #1",
      embodiment: "franka_panda",
      connectionType: "ros2",
      ipAddress: "192.168.1.10",
      status: "connected",
      battery_level: 95,
      cameras: [
        { id: "franka-01_head", name: "head", fps: 30 },
        { id: "franka-01_wrist", name: "wrist", fps: 30 },
      ],
    },
  ],
};

const MOCK_POLICY_STATUS = {
  data: {
    connected: false,
    protocol: "grpc",
    address: "",
    modelName: "",
    boundRobotId: null,
    lastLatencyMs: null,
    inferenceCount: 0,
  },
};

const MOCK_DATASETS = {
  data: [
    {
      id: "ds-001",
      name: "Franka Manipulation",
      description: "10k episodes of table-top manipulation",
      task: "manipulation",
      embodiments: ["franka_panda"],
      episodeCount: 10000,
      totalDurationHours: 278,
      sizeGb: 45.2,
      qualityScore: 92,
      format: "lerobot_v3",
      pricingTier: "starter",
      pricePerEpisode: 5,
      tags: ["manipulation", "pick-and-place"],
      downloads: 1520,
      rating: 4.7,
      sampleEpisodes: [],
      accessLevel: "public",
      licenseType: "cc_by",
      createdAt: "2025-06-01T00:00:00Z",
      updatedAt: "2025-12-01T00:00:00Z",
    },
    {
      id: "ds-002",
      name: "UR5 Assembly",
      description: "Assembly tasks with UR5 robot",
      task: "assembly",
      embodiments: ["ur5"],
      episodeCount: 5000,
      totalDurationHours: 139,
      sizeGb: 22.1,
      qualityScore: 87,
      format: "lerobot_v3",
      pricingTier: "free",
      tags: ["assembly", "industrial"],
      downloads: 850,
      rating: 4.3,
      sampleEpisodes: [],
      accessLevel: "public",
      licenseType: "cc_by",
      createdAt: "2025-08-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ],
  meta: { total: 2, page: 1, limit: 20 },
};

const MOCK_DASHBOARD = {
  data: {
    totalEpisodes: 15000,
    totalDurationHours: 417,
    totalSizeGb: 67.3,
    activeRobots: 2,
    recentSessions: [],
  },
};

// ---------------------------------------------------------------------------
// API mock setup
// ---------------------------------------------------------------------------

async function mockApi(page: Page) {
  // Auth endpoints
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: { user: MOCK_USER, tokens: MOCK_TOKENS } }),
    });
  });

  await page.route("**/api/auth/register", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: { user: MOCK_USER, tokens: MOCK_TOKENS } }),
    });
  });

  await page.route("**/api/auth/refresh", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: { tokens: MOCK_TOKENS } }),
    });
  });

  await page.route("**/api/auth/logout", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"data":{}}' });
  });

  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: MOCK_USER }),
    });
  });

  // Collection endpoints
  await page.route("**/api/collection/robots", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_ROBOTS),
    });
  });

  await page.route("**/api/collection/robots/connect", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: MOCK_ROBOTS.data[0] }),
    });
  });

  await page.route("**/api/collection/fleet/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_FLEET_STATUS),
    });
  });

  await page.route("**/api/collection/fleet/robots", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: MOCK_FLEET_STATUS.data.robots }),
    });
  });

  await page.route("**/api/collection/policy/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_POLICY_STATUS),
    });
  });

  await page.route("**/api/collection/policy/connect", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: { ...MOCK_POLICY_STATUS.data, connected: true } }),
    });
  });

  await page.route("**/api/collection/policy/disconnect", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: MOCK_POLICY_STATUS.data }),
    });
  });

  // Dashboard
  await page.route("**/api/collection/dashboard/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_DASHBOARD),
    });
  });

  // Marketplace
  await page.route("**/api/marketplace/datasets*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_DATASETS),
    });
  });

  await page.route("**/api/marketplace/datasets/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: MOCK_DATASETS.data[0] }),
    });
  });

  // Sessions
  await page.route("**/api/collection/sessions*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    });
  });

  // Episodes
  await page.route("**/api/collection/episodes*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [], meta: { total: 0 } }),
    });
  });
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

export { mockApi };

/**
 * Helper: set up mocks, then log in via the UI.
 * Navigates to /login, fills form, and waits for redirect to /dashboard.
 */
export async function loginAs(page: Page) {
  await mockApi(page);
  await page.goto("/login");
  await page.getByLabel(/email/i).fill("testuser@robotforge.io");
  await page.getByLabel(/password/i).fill("TestPassword123!");
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
}
