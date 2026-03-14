export type {
  PlatformAdapter,
  StorageAdapter,
  RobotAdapter,
  CollectionAdapter,
  NotificationAdapter,
  EpisodeFilterParams,
  StorageStats,
  DiscoveredRobot,
  RobotConnectionParams,
  ConnectedRobotInfo,
  RobotCommand,
  SessionConfig,
} from './PlatformAdapter';

export { getPlatformAdapter, setPlatformAdapter } from './PlatformAdapter';
export { createWebPlatformAdapter } from './WebPlatformAdapter';
export { createElectronPlatformAdapter } from './ElectronPlatformAdapter';
