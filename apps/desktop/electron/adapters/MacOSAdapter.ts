/**
 * ROBOTFORGE Desktop — macOS Platform Adapter
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

export class MacOSAdapter implements IPlatformAdapter {
  readonly platform = 'darwin' as const;
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
        'system_profiler SPUSBDataType -json 2>/dev/null',
      );
      const parsed = JSON.parse(stdout);
      const items = parsed?.SPUSBDataType ?? [];
      const devices: UsbDevice[] = [];
      const walk = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.vendor_id) {
            devices.push({
              vendorId: parseInt(node.vendor_id, 16) || 0,
              productId: parseInt(node.product_id ?? '0', 16) || 0,
              manufacturer: node.manufacturer ?? 'Unknown',
              product: node._name ?? 'Unknown',
              serialNumber: node.serial_num,
              path: node.location_id ?? '',
            });
          }
          if (node._items) walk(node._items);
        }
      };
      walk(items);
      return devices;
    } catch {
      return [];
    }
  }

  async detectGpus(): Promise<GpuInfo[]> {
    try {
      const { stdout } = await execAsync(
        'system_profiler SPDisplaysDataType -json 2>/dev/null',
      );
      const parsed = JSON.parse(stdout);
      const displays = parsed?.SPDisplaysDataType ?? [];
      return displays.map((d: any) => ({
        name: d._name ?? 'Apple GPU',
        vendor: d.sppci_vendor ?? 'Apple',
        vramMb: parseInt(d.sppci_vram ?? '0', 10) || 0,
        driverVersion: d.sppci_device_type ?? '',
      }));
    } catch {
      return [];
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
    // macOS-specific: check Metal support (for CoreML/ONNX acceleration)
  }
}
