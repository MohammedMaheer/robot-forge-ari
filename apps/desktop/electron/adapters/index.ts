/**
 * ROBOTFORGE Desktop — Platform Adapter Factory
 *
 * Returns the correct adapter for the current OS.
 */

import type { IPlatformAdapter } from './PlatformAdapter';
import { WindowsAdapter } from './WindowsAdapter';
import { MacOSAdapter } from './MacOSAdapter';
import { LinuxAdapter } from './LinuxAdapter';

export type { IPlatformAdapter } from './PlatformAdapter';
export { WindowsAdapter } from './WindowsAdapter';
export { MacOSAdapter } from './MacOSAdapter';
export { LinuxAdapter } from './LinuxAdapter';

let _adapter: IPlatformAdapter | null = null;

export function getPlatformAdapter(): IPlatformAdapter {
  if (_adapter) return _adapter;

  switch (process.platform) {
    case 'win32':
      _adapter = new WindowsAdapter();
      break;
    case 'darwin':
      _adapter = new MacOSAdapter();
      break;
    case 'linux':
      _adapter = new LinuxAdapter();
      break;
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }

  return _adapter;
}
