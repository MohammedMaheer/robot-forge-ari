// ============================================================================
// ROBOTFORGE — Shared TypeScript Interfaces
// Author: Mohammed Maheer, Acceleration Robotics
// ============================================================================

// ---------------------------------------------------------------------------
// User & Authentication
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  apiKeys: ApiKey[];
  tier: UserTier;
  createdAt: Date;
}

export type UserRole = 'operator' | 'developer' | 'enterprise' | 'admin';
export type UserTier = 'starter' | 'professional' | 'enterprise';

export interface ApiKey {
  id: string;
  name: string;
  prefix: string; // show only first 8 chars
  scopes: ApiScope[];
  rateLimit: number; // requests per hour
  ipAllowlist: string[];
  lastUsedAt?: Date;
  expiresAt?: Date;
}

export type ApiScope =
  | 'read:datasets'
  | 'write:episodes'
  | 'stream:teleoperation'
  | 'admin:platform';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface JwtPayload {
  sub: string;       // user id
  email: string;
  name: string;
  role: UserRole;
  tier: UserTier;
  iat: number;
  exp: number;
}

// ---------------------------------------------------------------------------
// Robot Episode
// ---------------------------------------------------------------------------

export interface Episode {
  id: string;
  sessionId: string;
  robotId: string;
  embodiment: RobotEmbodiment;
  task: RobotTask;
  durationMs: number;
  frameCount: number;
  qualityScore: number; // 0-100, AI-assigned
  status: EpisodeStatus;
  sensorModalities: SensorModality[];
  storageUrl?: string;
  thumbnailUrl?: string;
  metadata: EpisodeMetadata;
  createdAt: Date;
}

export type EpisodeStatus =
  | 'recording'
  | 'processing'
  | 'packaged'
  | 'listed'
  | 'failed';

export type RobotEmbodiment =
  | 'ur5'
  | 'ur10'
  | 'franka_panda'
  | 'xarm6'
  | 'xarm7'
  | 'unitree_h1'
  | 'unitree_g1'
  | 'figure01'
  | 'agility_digit'
  | 'boston_dynamics_spot'
  | 'clearpath_husky'
  | 'custom';

export type RobotTask =
  | 'bin_picking'
  | 'assembly'
  | 'packing'
  | 'palletizing'
  | 'navigation'
  | 'inspection'
  | 'surgical'
  | 'manipulation'
  | 'whole_body_loco'
  | 'custom';

export type SensorModality =
  | 'rgb_camera'
  | 'depth_camera'
  | 'wrist_camera'
  | 'joint_positions'
  | 'joint_velocities'
  | 'joint_torques'
  | 'end_effector_pose'
  | 'gripper_state'
  | 'force_torque'
  | 'lidar'
  | 'imu'
  | 'tactile';

export interface EpisodeMetadata {
  environment: string;
  lighting: 'bright' | 'dim' | 'mixed';
  objectVariety: number; // count of distinct objects
  successLabel: boolean | null; // null = not yet labeled
  operatorId: string;
  aiAssisted: boolean;
  compressionRatio: number;
  rawSizeBytes: number;
  compressedSizeBytes: number;
}

// ---------------------------------------------------------------------------
// Collection Session
// ---------------------------------------------------------------------------

export interface CollectionSession {
  id: string;
  operatorId: string;
  robots: ConnectedRobot[];
  status: SessionStatus;
  mode: SessionMode;
  episodeCount: number;
  startedAt: Date;
  targetEpisodes?: number;
}

export type SessionStatus = 'idle' | 'recording' | 'paused' | 'processing';
export type SessionMode = 'manual' | 'ai_assisted';

export interface ConnectedRobot {
  id: string;
  name: string;
  embodiment: RobotEmbodiment;
  connectionType: RobotConnectionType;
  ipAddress: string;
  status: RobotStatus;
  batteryLevel?: number;
  cameras: CameraStream[];
}

export type RobotConnectionType = 'ros2' | 'grpc' | 'websocket' | 'usb';
export type RobotStatus = 'connected' | 'disconnected' | 'error' | 'recording';

export interface CameraStream {
  id: string;
  name: string; // e.g. "wrist_left", "head", "overview"
  resolution: { width: number; height: number };
  fps: number;
  livekitTrackId?: string;
}

export interface RobotConnectionConfig {
  name: string;
  embodiment: RobotEmbodiment;
  connectionType: RobotConnectionType;
  ipAddress: string;
  port?: number;
}

export interface SessionConfig {
  task: RobotTask;
  mode: SessionMode;
  robotIds: string[];
  targetEpisodes?: number;
}

// ---------------------------------------------------------------------------
// Dataset (Marketplace)
// ---------------------------------------------------------------------------

export interface Dataset {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  task: RobotTask;
  embodiments: RobotEmbodiment[];
  episodeCount: number;
  totalDurationHours: number;
  sizeGb: number;
  qualityScore: number;
  format: DatasetFormat;
  pricingTier: DatasetPricingTier;
  pricePerEpisode?: number; // cents
  tags: string[];
  downloads: number;
  rating: number; // 1-5
  sampleEpisodes: Episode[];
  accessLevel: DatasetAccessLevel;
  licenseType: DatasetLicense;
  createdAt: Date;
  updatedAt: Date;
}

export type DatasetFormat = 'lerobot_hdf5' | 'open_x_embodiment' | 'robotforge_native';
export type DatasetPricingTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type DatasetAccessLevel = 'public' | 'private' | 'organization';
export type DatasetLicense = 'cc_by' | 'cc_by_nc' | 'proprietary' | 'research_only';

export interface DatasetReview {
  id: string;
  datasetId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Telemetry (Real-time)
// ---------------------------------------------------------------------------

export interface RobotTelemetry {
  robotId: string;
  timestamp: number; // unix ms
  jointPositions: number[];   // radians
  jointVelocities: number[];  // rad/s
  jointTorques: number[];     // Nm
  endEffectorPose: Pose6D;
  gripperPosition: number;    // 0-1
  forceTorque?: ForceTorque;
}

export interface Pose6D {
  x: number;
  y: number;
  z: number;   // meters
  rx: number;
  ry: number;
  rz: number;  // radians (euler)
}

export interface ForceTorque {
  fx: number;
  fy: number;
  fz: number;  // N
  tx: number;
  ty: number;
  tz: number;  // Nm
}

// ---------------------------------------------------------------------------
// Processing
// ---------------------------------------------------------------------------

export interface ProcessingJob {
  id: string;
  episodeId: string;
  status: ProcessingJobStatus;
  progress: number; // 0-100
  steps: ProcessingStep[];
  qualityScore?: number;
  bandwidthReductionPercent?: number;
  errorMessage?: string;
}

export type ProcessingJobStatus = 'queued' | 'running' | 'complete' | 'failed';

export interface ProcessingStep {
  name: ProcessingStepName;
  status: ProcessingStepStatus;
  durationMs?: number;
}

export type ProcessingStepName =
  | 'frame_filtering'
  | 'compression'
  | 'annotation'
  | 'quality_scoring'
  | 'packaging';

export type ProcessingStepStatus = 'pending' | 'running' | 'complete' | 'failed';

// ---------------------------------------------------------------------------
// API Response Wrappers
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ---------------------------------------------------------------------------
// Platform Adapter (Web vs Desktop)
// ---------------------------------------------------------------------------

export interface EpisodeFilter {
  task?: RobotTask;
  embodiment?: RobotEmbodiment;
  status?: EpisodeStatus;
  minQuality?: number;
  maxQuality?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface SyncResult {
  syncedCount: number;
  failedCount: number;
  errors: string[];
}

export interface SyncStatus {
  pendingCount: number;
  lastSyncedAt?: Date;
  isSyncing: boolean;
}

// ---------------------------------------------------------------------------
// Notifications & UI
// ---------------------------------------------------------------------------

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// ---------------------------------------------------------------------------
// Cart & Purchases (Marketplace)
// ---------------------------------------------------------------------------

export interface CartItem {
  datasetId: string;
  dataset: Dataset;
  addedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  datasetId: string;
  amount: number; // cents
  currency: string;
  stripePaymentId: string;
  status: 'pending' | 'completed' | 'refunded';
  createdAt: Date;
}
