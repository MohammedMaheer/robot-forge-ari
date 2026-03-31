import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, UserRole, UserTier } from '@robotforge/types';
import { apiClient } from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post('/auth/login', { email, password });
          const { user, tokens } = response.data.data;
          set({
            user,
            accessToken: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post('/auth/register', { name, email, password });
          const { user, tokens } = response.data.data;
          set({
            user,
            accessToken: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Server clears the HttpOnly refresh-token cookie
          await apiClient.delete('/auth/logout');
        } catch {
          // Ignore errors during logout
        }
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      refreshAccessToken: async () => {
        // Refresh token is sent automatically via HttpOnly cookie
        const response = await apiClient.post('/auth/refresh');
        const { tokens } = response.data.data;
        set({
          accessToken: tokens.accessToken,
        });
      },

      setTokens: (tokens: AuthTokens) => {
        // Only store accessToken in memory/localStorage; refresh token stays in HttpOnly cookie
        set({
          accessToken: tokens.accessToken,
          isAuthenticated: true,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'robotforge-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Dates are serialized as ISO strings by JSON.stringify.
      // Restore them to Date objects when the store is re-hydrated.
      onRehydrateStorage: () => (state) => {
        if (!state?.user) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = state.user as any;
        if (raw.createdAt) {
          state.user.createdAt = new Date(raw.createdAt);
        }
        if (Array.isArray(raw.apiKeys)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          state.user.apiKeys = raw.apiKeys.map((key: any) => ({
            ...key,
            lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt) : undefined,
            expiresAt: key.expiresAt ? new Date(key.expiresAt) : undefined,
          }));
        }
      },
    }
  )
);
