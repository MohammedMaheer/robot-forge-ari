/**
 * ROBOTFORGE Desktop — Linux Platform Adapter
 */

import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { app, shell } from 'electron';
import type {
  IPlatformAdapter,
  PlatformCapabilities,
  StoragePaths,
  UsbDevice,
  GpuInfo,
} from './PlatformAdapter';

const execAsync = promisify(exec);

export class LinuxAdapter implements IPlatformAdapter {
  readonly platform = 'linux' as const;
  readonly capabilities: PlatformCapabilities = {
    canEnumerateUsb: true,
    canDetectGpu: true,
    supportsAutoUpdate: true,
    supportsTray: false, // AppIndicator may not be available
  };

  getStoragePaths(): StoragePaths {
    const base = path.join(
      process.env.XDG_DATA_HOME ?? path.join(app.getPath('home'), '.local', 'share'),
      'robotforge',
    );
    return {
      episodes: path.join(base, 'episodes'),
      models: path.join(base, 'models'),
      cache: path.join(
        process.env.XDG_CACHE_HOME ?? path.join(app.getPath('home'), '.cache'),
        'robotforge',
      ),
      logs: path.join(base, 'logs'),
      config: path.join(
        process.env.XDG_CONFIG_HOME ?? path.join(app.getPath('home'), '.config'),
        'robotforge',
      ),
    };
  }

  async enumerateUsbDevices(): Promise<UsbDevice[]> {
    try {
      const { stdout } = await execAsync('lsusb 2>/dev/null');
      return stdout
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const match = line.match(/ID\s+([0-9a-f]{4}):([0-9a-f]{4})\s+(.*)/i);
          return {
            vendorId: parseInt(match?.[1] ?? '0', 16),
            productId: parseInt(match?.[2] ?? '0', 16),
            manufacturer: '',
            product: match?.[3] ?? line,
            path: '',
          };
        });
    } catch {
      return [];
    }
  }

  async detectGpus(): Promise<GpuInfo[]> {
    try {
      const { stdout } = await execAsync(
        'nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader,nounits 2>/dev/null',
      );
      return stdout
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [name, vram, driver] = line.split(',').map((s) => s.trim());
          return {
            name: name ?? 'Unknown',
            vendor: 'NVIDIA',
            vramMb: parseInt(vram ?? '0', 10),
            driverVersion: driver ?? '',
          };
        });
    } catch {
      // Try lspci as fallback
      try {
        const { stdout } = await execAsync("lspci | grep -i 'vga\\|3d\\|display'");
        return stdout
          .split('\n')
          .filter(Boolean)
          .map((line) => ({
            name: line.split(':').pop()?.trim() ?? 'Unknown GPU',
            vendor: 'Unknown',
            vramMb: 0,
            driverVersion: '',
          }));
      } catch {
        return [];
      }
    }
  }

  async openInFileManager(filePath: string): Promise<void> {
    await shell.showItemInFolder(filePath);
  }

  async getAvailableDiskSpace(targetPath: string): Promise<number> {
    try {
      const { stdout } = await execAsync(`df -k "${targetPath}" | tail -1 | awk '{print $4}'`);
      return parseInt(stdout.trim(), 10) * 1024 || 0;
    } catch {
      return 0;
    }
  }

  async initialize(): Promise<void> {
    // Linux-specific: check udev rules for USB robot access
    // Users may need to add themselves to the 'dialout' group for serial devices
  }
}
