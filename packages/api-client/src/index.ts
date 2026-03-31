// ============================================================================
// ROBOTFORGE — Typed API Client
// ============================================================================

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type {
  ApiResponse,
  AuthTokens,
  User,
  Dataset,
  Episode,
  CollectionSession,
  SessionConfig,
  EpisodeFilter,
  ConnectedRobot,
  RobotConnectionConfig,
  FleetStatus,
  FleetRobot,
  RosbagRecording,
  PolicyServerConfig,
  PolicyServerStatus,
} from '@robotforge/types';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export interface ApiClientConfig {
  baseUrl: string;
  token?: string;
  refreshToken?: string;
  onTokenRefreshed?: (tokens: AuthTokens) => void;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class RobotForgeApiClient {
  private client: AxiosInstance;
  private accessToken: string | null;
  private refreshTokenValue: string | null;
  private readonly onTokenRefreshed?: (tokens: AuthTokens) => void;

  constructor(config: ApiClientConfig) {
    this.accessToken = config.token ?? null;
    this.refreshTokenValue = config.refreshToken ?? null;
    this.onTokenRefreshed = config.onTokenRefreshed;

    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: 15_000,
      headers: { 'Content-Type': 'application/json' },
    });

    // ── Request interceptor: attach Authorization header ──
    this.client.interceptors.request.use((req: InternalAxiosRequestConfig) => {
      if (this.accessToken) {
        req.headers.set('Authorization', `Bearer ${this.accessToken}`);
      }
      return req;
    });

    // ── Response interceptor: auto-refresh on 401 ──
    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
        if (
          original &&
          error.response?.status === 401 &&
          !original._retry &&
          this.refreshTokenValue
        ) {
          original._retry = true;
          try {
            const tokens = await this.refreshToken();
            this.setTokens(tokens);
            original.headers = {
              ...original.headers,
              Authorization: `Bearer ${tokens.accessToken}`,
            };
            return this.client.request(original);
          } catch {
            this.clearTokens();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // ─── Token management ─────────────────────────────────────────

  setTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshTokenValue = tokens.refreshToken;
    this.onTokenRefreshed?.(tokens);
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshTokenValue = null;
  }

  // ─── Auth ─────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<ApiResponse<AuthTokens>> {
    const { data } = await this.client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', {
      email,
      password,
    });
    this.setTokens(data.data.tokens);
    return data as unknown as ApiResponse<AuthTokens>;
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthTokens>> {
    const { data } = await this.client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', {
      name,
      email,
      password,
    });
    this.setTokens(data.data.tokens);
    return data as unknown as ApiResponse<AuthTokens>;
  }

  async getMe(): Promise<ApiResponse<User>> {
    const { data } = await this.client.get<ApiResponse<User>>('/auth/me');
    return data;
  }

  async refreshToken(): Promise<AuthTokens> {
    const body = this.refreshTokenValue ? { refreshToken: this.refreshTokenValue } : {};
    const { data } = await this.client.post<ApiResponse<{ tokens: AuthTokens }>>('/auth/refresh', body, {
      withCredentials: true,
      _skipAuth: true,
    } as any);
    return data.data.tokens;
  }

  // ─── Datasets ─────────────────────────────────────────────────

  async listDatasets(params?: {
    page?: number;
    limit?: number;
    task?: string;
    search?: string;
  }): Promise<ApiResponse<Dataset[]>> {
    const { data } = await this.client.get<ApiResponse<Dataset[]>>('/datasets', { params });
    return data;
  }

  async getDataset(id: string): Promise<ApiResponse<Dataset>> {
    const { data } = await this.client.get<ApiResponse<Dataset>>(`/datasets/${id}`);
    return data;
  }

  async createDataset(payload: {
    name: string;
    description: string;
    task: string;
    format: string;
    pricingTier: string;
    tags: string[];
  }): Promise<ApiResponse<Dataset>> {
    const { data } = await this.client.post<ApiResponse<Dataset>>('/datasets', payload);
    return data;
  }

  async purchaseDataset(datasetId: string): Promise<ApiResponse<{ purchaseId: string }>> {
    const { data } = await this.client.post<ApiResponse<{ purchaseId: string }>>(
      `/datasets/${datasetId}/purchase`,
    );
    return data;
  }

  // ─── Episodes ─────────────────────────────────────────────────

  async listEpisodes(
    filter?: Partial<EpisodeFilter>,
  ): Promise<ApiResponse<Episode[]>> {
    const { data } = await this.client.get<ApiResponse<Episode[]>>('/episodes', {
      params: filter,
    });
    return data;
  }

  async getEpisode(id: string): Promise<ApiResponse<Episode>> {
    const { data } = await this.client.get<ApiResponse<Episode>>(`/episodes/${id}`);
    return data;
  }

  // ─── Collection Sessions ──────────────────────────────────────

  async createCollectionSession(
    config: SessionConfig,
  ): Promise<ApiResponse<CollectionSession>> {
    const { data } = await this.client.post<ApiResponse<CollectionSession>>(
      '/sessions',
      config,
    );
    return data;
  }

  async getSession(id: string): Promise<ApiResponse<CollectionSession>> {
    const { data } = await this.client.get<ApiResponse<CollectionSession>>(
      `/sessions/${id}`,
    );
    return data;
  }

  async startSession(id: string): Promise<ApiResponse<CollectionSession>> {
    const { data } = await this.client.post<ApiResponse<CollectionSession>>(
      `/sessions/${id}/start`,
    );
    return data;
  }

  async stopSession(id: string): Promise<ApiResponse<CollectionSession>> {
    const { data } = await this.client.post<ApiResponse<CollectionSession>>(
      `/sessions/${id}/stop`,
    );
    return data;
  }

  // ─── Robots ───────────────────────────────────────────────────

  async listRobots(): Promise<ApiResponse<ConnectedRobot[]>> {
    const { data } = await this.client.get<ApiResponse<ConnectedRobot[]>>('/collection/robots');
    return data;
  }

  async connectRobot(config: RobotConnectionConfig): Promise<ApiResponse<ConnectedRobot>> {
    const { data } = await this.client.post<ApiResponse<ConnectedRobot>>('/collection/robots/connect', config);
    return data;
  }

  async disconnectRobot(robotId: string): Promise<ApiResponse<void>> {
    const { data } = await this.client.post<ApiResponse<void>>(`/collection/robots/${robotId}/disconnect`);
    return data;
  }

  // ─── Dashboard ────────────────────────────────────────────────

  async getDashboardKpis(): Promise<ApiResponse<Record<string, unknown>>> {
    const { data } = await this.client.get<ApiResponse<Record<string, unknown>>>('/collection/dashboard/kpis');
    return data;
  }

  async getDashboardActivity(): Promise<ApiResponse<unknown[]>> {
    const { data } = await this.client.get<ApiResponse<unknown[]>>('/collection/dashboard/activity');
    return data;
  }

  async getDashboardEfficiency(): Promise<ApiResponse<unknown[]>> {
    const { data } = await this.client.get<ApiResponse<unknown[]>>('/collection/dashboard/efficiency');
    return data;
  }

  // ─── Fleet Management (ROS 2) ────────────────────────────────

  async getFleetStatus(): Promise<ApiResponse<FleetStatus>> {
    const { data } = await this.client.get<ApiResponse<FleetStatus>>('/collection/fleet/status');
    return data;
  }

  async listFleetRobots(): Promise<ApiResponse<FleetRobot[]>> {
    const { data } = await this.client.get<ApiResponse<FleetRobot[]>>('/collection/fleet/robots');
    return data;
  }

  async getFleetNamespaces(): Promise<ApiResponse<string[]>> {
    const { data } = await this.client.get<ApiResponse<string[]>>('/collection/fleet/namespaces');
    return data;
  }

  // ─── Recording (ROS 2 Rosbag2) ───────────────────────────────

  async startRecording(params: {
    sessionId: string;
    topicFilters?: string[];
    storageFormat?: 'mcap' | 'sqlite3';
  }): Promise<ApiResponse<RosbagRecording>> {
    const { data } = await this.client.post<ApiResponse<RosbagRecording>>('/collection/recording/start', params);
    return data;
  }

  async stopRecording(recordingId: string): Promise<ApiResponse<RosbagRecording>> {
    const { data } = await this.client.post<ApiResponse<RosbagRecording>>(`/collection/recording/${recordingId}/stop`);
    return data;
  }

  async getRecordingStatus(recordingId: string): Promise<ApiResponse<RosbagRecording>> {
    const { data } = await this.client.get<ApiResponse<RosbagRecording>>(`/collection/recording/${recordingId}`);
    return data;
  }

  async convertRecording(recordingId: string, targetFormat: 'mcap' | 'sqlite3'): Promise<ApiResponse<RosbagRecording>> {
    const { data } = await this.client.post<ApiResponse<RosbagRecording>>(`/collection/recording/${recordingId}/convert`, { targetFormat });
    return data;
  }

  // ─── Policy Server (ROS 2) ───────────────────────────────────

  async connectPolicyServer(config: PolicyServerConfig): Promise<ApiResponse<PolicyServerStatus>> {
    const { data } = await this.client.post<ApiResponse<PolicyServerStatus>>('/collection/policy/connect', config);
    return data;
  }

  async disconnectPolicyServer(): Promise<ApiResponse<void>> {
    const { data } = await this.client.post<ApiResponse<void>>('/collection/policy/disconnect');
    return data;
  }

  async getPolicyStatus(): Promise<ApiResponse<PolicyServerStatus>> {
    const { data } = await this.client.get<ApiResponse<PolicyServerStatus>>('/collection/policy/status');
    return data;
  }

  async runPolicyInference(payload: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> {
    const { data } = await this.client.post<ApiResponse<Record<string, unknown>>>('/collection/policy/infer', payload);
    return data;
  }
}

// ─── Factory ──────────────────────────────────────────────────────

export function createApiClient(config: ApiClientConfig): RobotForgeApiClient {
  return new RobotForgeApiClient(config);
}
