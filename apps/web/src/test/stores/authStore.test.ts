import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('starts with no user authenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('setUser marks the user as authenticated', () => {
    const mockUser = {
      id: 'u-1',
      email: 'test@robotforge.ai',
      name: 'Test User',
      role: 'developer' as const,
      tier: 'starter' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('test@robotforge.ai');
  });

  it('setTokens updates tokens', () => {
    useAuthStore.getState().setTokens({
      accessToken: 'at-123',
      refreshToken: 'rt-456',
      expiresIn: 900,
    });
    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('at-123');
    expect(state.refreshToken).toBe('rt-456');
  });
});
