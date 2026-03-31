// ============================================================================
// ROBOTFORGE — Shared Utility Functions
// ============================================================================

/**
 * Format a byte count into a human-readable string.
 *
 * @example formatBytes(1536) → "1.5 KB"
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes < 0 || !Number.isFinite(bytes)) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / k ** i;
  // Drop trailing zeros for clean output (e.g. "1 KB" not "1.0 KB")
  const formatted = parseFloat(value.toFixed(dm)).toString();
  return `${formatted} ${sizes[i]}`;
}

/**
 * Format milliseconds into a human-readable duration string.
 *
 * @example formatDuration(5025000) → "1h 23m 45s"
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(' ');
}

/**
 * Format a date as a relative time string (e.g. "3 minutes ago").
 */
export function formatRelativeTime(date: Date | string): string {
  const then = typeof date === 'string' ? new Date(date) : date;
  const now = Date.now();
  const diffMs = now - then.getTime();

  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return seconds <= 1 ? 'just now' : `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? '1 day ago' : `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`;

  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

/**
 * Clamp a value between a minimum and maximum.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Async sleep utility.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random alphanumeric ID (nanoid-style, 21 chars).
 */
export function generateId(length = 21): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let id = '';
  for (let i = 0; i < length; i++) {
    id += alphabet[bytes[i] & 63];
  }
  return id;
}

/**
 * Debounce a function — delays invocation until `ms` after the last call.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number,
): T & { cancel(): void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (this: unknown, ...args: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  } as T & { cancel(): void };

  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

/**
 * Throttle a function — invokes at most once per `ms` milliseconds.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number,
): T & { cancel(): void } {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const throttled = function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    const remaining = ms - (now - lastCall);

    if (remaining <= 0) {
      clearTimeout(timer);
      lastCall = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = undefined;
        fn.apply(this, args);
      }, remaining);
    }
  } as T & { cancel(): void };

  throttled.cancel = () => clearTimeout(timer);
  return throttled;
}

/**
 * Detect whether the app is running inside Electron.
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && 'electronAPI' in window;
}

/**
 * Parse an unknown error (catch block) into a structured object.
 */
export function parseApiError(error: unknown): { message: string; code?: string } {
  if (error instanceof Error) {
    return { message: error.message };
  }

  if (typeof error === 'object' && error !== null) {
    const obj = error as Record<string, unknown>;

    // Axios-style error
    if (obj.response && typeof obj.response === 'object') {
      const resp = obj.response as Record<string, unknown>;
      const data = resp.data as Record<string, unknown> | undefined;
      return {
        message:
          (typeof data?.message === 'string' ? data.message : null) ??
          (typeof resp.statusText === 'string' ? resp.statusText : 'Request failed'),
        code: typeof data?.code === 'string' ? data.code : String(resp.status ?? ''),
      };
    }

    if (typeof obj.message === 'string') {
      return { message: obj.message, code: typeof obj.code === 'string' ? obj.code : undefined };
    }
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: 'An unknown error occurred' };
}
