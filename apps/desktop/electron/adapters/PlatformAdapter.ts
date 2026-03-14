/**
 * ROBOTFORGE Desktop — Platform Adapter (Spec §5 Step 2.1)
 *
 * Abstracts platform-specific behaviour (file system paths, GPU detection,
 * USB device enumeration, process management) behind a common interface.
 * Concrete adapters are selected at startup based on process.platform.
 */

export interface GpuInfo {
  name: string;
  vendor: string;
  vramMb: number;
  driverVersion: string;
}

export interface UsbDevice {
  vendorId: number;
  productId: number;
  manufacturer: string;
  product: string;
  serialNumber?: string;
  path: string;
}

export interface StoragePaths {
  episodes: string;
  models: string;
  cache: string;
  logs: string;
  config: string;
}

export interface PlatformCapabilities {
  canEnumerateUsb: boolean;
  canDetectGpu: boolean;
  supportsAutoUpdate: boolean;
  supportsTray: boolean;
}

/**
 * Platform adapter interface — each OS implements this.
 */
export interface IPlatformAdapter {
  readonly platform: NodeJS.Platform;
  readonly capabilities: PlatformCapabilities;

  /** Return default storage directories for this OS. */
  getStoragePaths(): StoragePaths;

  /** Enumerate connected USB devices (for robot discovery). */
  enumerateUsbDevices(): Promise<UsbDevice[]>;

  /** Detect available GPUs for local ONNX inference. */
  detectGpus(): Promise<GpuInfo[]>;

  /** Open a path in the native file manager. */
  openInFileManager(path: string): Promise<void>;

  /** Get available disk space (bytes) at the given path. */
  getAvailableDiskSpace(path: string): Promise<number>;

  /** Platform-specific init (udev rules on Linux, driver checks on Windows). */
  initialize(): Promise<void>;
}
