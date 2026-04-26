/**
 * Mock data returned when the real backend is unreachable.
 * Mirrors the shapes returned by the actual API so every page renders.
 */

export const MOCK_USER = {
  id: 'usr-demo-001',
  email: 'demo@robotforge.io',
  name: 'Demo User',
  role: 'operator',
  tier: 'professional',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-06-01T00:00:00Z',
};

export const MOCK_TOKENS = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 900,
};

export const MOCK_FLEET_STATUS = {
  healthy: true,
  robots: [
    {
      robotId: 'franka-01',
      name: 'Franka Emika Panda #1',
      embodiment: 'franka_panda',
      namespace: '/robot/franka01',
      connectionType: 'ros2',
      status: 'connected',
      topicsDiscovered: [
        { name: '/joint_states', messageType: 'sensor_msgs/JointState', hz: 500 },
        { name: '/ee_pose', messageType: 'geometry_msgs/PoseStamped', hz: 100 },
      ],
      ros2Status: { nodeActive: true, controllerState: 'active', ddsConnected: true },
    },
    {
      robotId: 'ur5e-01',
      name: 'UR5e Arm',
      embodiment: 'ur5',
      namespace: '/robot/ur5e',
      connectionType: 'ros2',
      status: 'connected',
      topicsDiscovered: [
        { name: '/joint_states', messageType: 'sensor_msgs/JointState', hz: 125 },
      ],
      ros2Status: { nodeActive: true, controllerState: 'active', ddsConnected: true },
    },
  ],
  namespaces: ['/robot/franka01', '/robot/ur5e'],
  totalRobots: 2,
  activeRobots: 2,
  ddsStatus: 'healthy',
};

export const MOCK_ROBOTS = [
  {
    id: 'franka-01',
    name: 'Franka Emika Panda #1',
    embodiment: 'franka_panda',
    connectionType: 'ros2',
    ipAddress: '192.168.1.10',
    status: 'connected',
    battery_level: 95,
    cameras: [
      { id: 'franka-01_head', name: 'head', fps: 30 },
      { id: 'franka-01_wrist', name: 'wrist', fps: 30 },
    ],
  },
];

export const MOCK_POLICY_STATUS = {
  connected: false,
  protocol: 'grpc',
  address: '',
  modelName: '',
  boundRobotId: null,
  lastLatencyMs: null,
  inferenceCount: 0,
};

export const MOCK_DATASETS = [
  {
    id: 'ds-001',
    name: 'Franka Manipulation',
    description: '10k episodes of table-top manipulation with Franka Emika Panda',
    task: 'manipulation',
    embodiments: ['franka_panda'],
    episodeCount: 10000,
    totalDurationHours: 278,
    sizeGb: 45.2,
    qualityScore: 92,
    format: 'lerobot_v3',
    pricingTier: 'starter',
    pricePerEpisode: 5,
    tags: ['manipulation', 'pick-and-place'],
    downloads: 1520,
    rating: 4.7,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by',
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'ds-002',
    name: 'UR5 Assembly',
    description: 'Assembly tasks with UR5 robot in a structured production line',
    task: 'assembly',
    embodiments: ['ur5'],
    episodeCount: 5000,
    totalDurationHours: 139,
    sizeGb: 22.1,
    qualityScore: 87,
    format: 'lerobot_v3',
    pricingTier: 'free',
    tags: ['assembly', 'industrial'],
    downloads: 850,
    rating: 4.3,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by',
    createdAt: '2025-08-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'ds-003',
    name: 'Unitree H1 Navigation',
    description: 'Indoor navigation episodes with Unitree H1 humanoid',
    task: 'navigation',
    embodiments: ['unitree_h1'],
    episodeCount: 3200,
    totalDurationHours: 89,
    sizeGb: 18.7,
    qualityScore: 79,
    format: 'lerobot_v3',
    pricingTier: 'free',
    tags: ['navigation', 'humanoid', 'indoor'],
    downloads: 420,
    rating: 4.1,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by',
    createdAt: '2025-10-15T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
];

export const MOCK_DASHBOARD_KPIS = {
  totalEpisodes: 18200,
  storageUsedGb: 86.0,
  storageQuotaGb: 500,
  activeRobots: 2,
  avgQuality: 86,
  weeklyGrowth: '+12%',
};

export const MOCK_DASHBOARD_ACTIVITY = [
  { id: 'act-001', type: 'episode', title: 'Episode recorded - Manipulation', time: '5m ago' },
  { id: 'act-002', type: 'session', title: 'Session recording - Assembly', time: '18m ago' },
];

export const MOCK_DASHBOARD_EFFICIENCY = [
  { date: '2026-04-08', efficiency: 78 },
  { date: '2026-04-09', efficiency: 82 },
  { date: '2026-04-10', efficiency: 80 },
  { date: '2026-04-11', efficiency: 87 },
  { date: '2026-04-12', efficiency: 75 },
  { date: '2026-04-13', efficiency: 84 },
  { date: '2026-04-14', efficiency: 79 },
];

// ---------------------------------------------------------------------------
// Route matcher → response map
// ---------------------------------------------------------------------------

interface MockRoute {
  method?: string;
  pattern: RegExp;
  response: (url: string) => unknown;
}

const routes: MockRoute[] = [
  // Auth
  { method: 'POST', pattern: /\/auth\/login$/, response: () => ({ data: { user: MOCK_USER, tokens: MOCK_TOKENS } }) },
  { method: 'POST', pattern: /\/auth\/register$/, response: () => ({ data: { user: MOCK_USER, tokens: MOCK_TOKENS } }) },
  { method: 'POST', pattern: /\/auth\/refresh$/, response: () => ({ data: { tokens: MOCK_TOKENS } }) },
  { method: 'DELETE', pattern: /\/auth\/logout$/, response: () => ({ data: {} }) },
  { pattern: /\/auth\/me$/, response: () => ({ data: MOCK_USER }) },

  // Dashboard
  { pattern: /\/collection\/dashboard\/kpis/, response: () => ({ data: MOCK_DASHBOARD_KPIS }) },
  { pattern: /\/collection\/dashboard\/activity/, response: () => ({ data: MOCK_DASHBOARD_ACTIVITY }) },
  { pattern: /\/collection\/dashboard\/efficiency/, response: () => ({ data: MOCK_DASHBOARD_EFFICIENCY }) },

  // Fleet
  { pattern: /\/collection\/fleet\/status/, response: () => ({ data: MOCK_FLEET_STATUS }) },
  { pattern: /\/collection\/fleet\/robots/, response: () => ({ data: MOCK_FLEET_STATUS.robots }) },

  // Collection
  { pattern: /\/collection\/robots\/connect/, response: () => ({ data: MOCK_ROBOTS[0] }) },
  { pattern: /\/collection\/robots/, response: () => ({ data: MOCK_ROBOTS }) },

  // Policy
  { method: 'POST', pattern: /\/collection\/policy\/connect/, response: () => ({ data: { ...MOCK_POLICY_STATUS, connected: true, modelName: 'ACT', address: 'localhost:50051' } }) },
  { method: 'POST', pattern: /\/collection\/policy\/disconnect/, response: () => ({ data: MOCK_POLICY_STATUS }) },
  { pattern: /\/collection\/policy\/status/, response: () => ({ data: MOCK_POLICY_STATUS }) },

  // Marketplace
  { pattern: /\/marketplace\/datasets\/[^/]+/, response: () => ({ data: MOCK_DATASETS[0] }) },
  { pattern: /\/marketplace\/datasets/, response: () => ({ data: MOCK_DATASETS, meta: { total: MOCK_DATASETS.length, page: 1, limit: 50 } }) },

  // Sessions / Episodes
  { pattern: /\/collection\/sessions/, response: () => ({ data: [] }) },
  { pattern: /\/collection\/episodes/, response: () => ({ data: [], meta: { total: 0 } }) },
];

/**
 * Try to match a request URL + method to a mock route.
 * Returns the mock response body or `null` if no match.
 */
export function matchMockRoute(url: string, method?: string): unknown | null {
  for (const route of routes) {
    if (route.method && method && route.method !== method.toUpperCase()) continue;
    if (route.pattern.test(url)) return route.response(url);
  }
  return null;
}
