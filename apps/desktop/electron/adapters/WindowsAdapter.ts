/**
 * ROBOTFORGE Desktop — Windows Platform Adapter
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

export class WindowsAdapter implements IPlatformAdapter {
  readonly platform = 'win32' as const;
  readonly capabilities: PlatformCapabilities = {
    canEnumerateUsb: true,
    canDetectGpu: true,
    supportsAutoUpdate: true,
    supportsTray: true,
  };

  getStoragePaths(): StoragePaths {
    const base = path.join(app.getPath('userData'), 'robotforge');
    return {
      episodes: path.join(base, 'episodes'),
      models: path.join(base, 'models'),
      cache: path.join(base, 'cache'),
      logs: path.join(base, 'logs'),
      config: path.join(base, 'config'),
    };
  }

  async enumerateUsbDevices(): Promise<UsbDevice[]> {
    try {
      const { stdout } = await execAsync(
        'powershell -Command "Get-PnpDevice -PresentOnly -Class USB | Select-Object InstanceId, FriendlyName, Manufacturer, Status | ConvertTo-Json"',
      );
      const raw = JSON.parse(stdout || '[]');
      const devices: UsbDevice[] = (Array.isArray(raw) ? raw : [raw]).map((d: any) => ({
        vendorId: 0,
        productId: 0,
        manufacturer: d.Manufacturer ?? 'Unknown',
        product: d.FriendlyName ?? 'Unknown',
        path: d.InstanceId ?? '',
      }));
      return devices;
    } catch {
      return [];
    }
  }

  async detectGpus(): Promise<GpuInfo[]> {
    try {
      const { stdout } = await execAsync(
        'powershell -Command "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterCompatibility, AdapterRAM, DriverVersion | ConvertTo-Json"',
      );
      const raw = JSON.parse(stdout || '[]');
      return (Array.isArray(raw) ? raw : [raw]).map((g: any) => ({
        name: g.Name ?? 'Unknown GPU',
        vendor: g.AdapterCompatibility ?? 'Unknown',
        vramMb: Math.round((g.AdapterRAM ?? 0) / (1024 * 1024)),
        driverVersion: g.DriverVersion ?? '',
      }));
    } catch {
      return [];
    }
  }

  async openInFileManager(filePath: string): Promise<void> {
    await shell.openPath(path.dirname(filePath));
  }

  async getAvailableDiskSpace(targetPath: string): Promise<number> {
    try {
      const drive = path.parse(targetPath).root.replace('\\', '');
      const { stdout } = await execAsync(
        `powershell -Command "(Get-PSDrive ${drive.replace(':', '')}).Free"`,
      );
      return parseInt(stdout.trim(), 10) || 0;
    } catch {
      return 0;
    }
  }

  async initialize(): Promise<void> {
    // Windows-specific init: check for CUDA toolkit
    try {
      await execAsync('nvidia-smi --query-gpu=name --format=csv,noheader');
    } catch {
      // No NVIDIA GPU or drivers — not fatal
    }
  }
}
