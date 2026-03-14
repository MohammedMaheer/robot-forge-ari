import { describe, it, expect } from 'vitest';
import { formatBytes, formatDuration, clamp, generateId } from '../index';

describe('formatBytes', () => {
  it('formats 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });
  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });
  it('formats megabytes', () => {
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
  });
  it('formats gigabytes', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });
});

describe('formatDuration', () => {
  it('formats seconds', () => {
    expect(formatDuration(5000)).toBe('5s');
  });
  it('formats minutes and seconds', () => {
    expect(formatDuration(125000)).toBe('2m 5s');
  });
  it('formats hours', () => {
    expect(formatDuration(3665000)).toBe('1h 1m 5s');
  });
});

describe('clamp', () => {
  it('clamps below min', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });
  it('clamps above max', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });
  it('keeps value in range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });
});

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });
  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});
