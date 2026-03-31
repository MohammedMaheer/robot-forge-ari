/**
 * ROBOTFORGE Desktop — Linux Platform Adapter
 */

import path from 'node:path';
import { exec, execFile } from 'node:child_process';
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
const execFileAsync = promisify(execFile);

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
      const regex = /ID\s+([0-9a-f]{4}):([0-9a-f]{4})\s+(.*)/i;
      const devices: UsbDevice[] = [];
      for (const line of stdout.split('\n').filter(Boolean)) {
        const match = line.match(regex);
        if (!match) continue; // skip malformed lines
        devices.push({
          vendorId: parseInt(match[1], 16),
          productId: parseInt(match[2], 16),
          manufacturer: '',
          product: match[3],
          path: '',
        });
      }
      return devices;
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
      // Use execFile to avoid shell injection — df accepts path as a direct argument
      const { stdout } = await execFileAsync('df', ['-k', targetPath]);
      const lines = stdout.trim().split('\n');
      const dataLine = lines[lines.length - 1];
      const available = parseInt(dataLine.split(/\s+/)[3] ?? '0', 10);
      return (available || 0) * 1024;
    } catch {
      return 0;
    }
  }

  async initialize(): Promise<void> {
    // Linux-specific: check udev rules for USB robot access
    // Users may need to add themselves to the 'dialout' group for serial devices
  }
}
