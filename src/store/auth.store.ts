// store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { storeTokens, clearStoredTokens, getStoredTokens, setTokenRefreshCallback } from '@/services/api.config';

interface AuthStore {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setUser: (user: User | null) => void;
    setTokens: (tokens: AuthTokens | null) => void;
    login: (tokens: AuthTokens, user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setTokens: (tokens) => {
                if (tokens) {
                    storeTokens(tokens);
                } else {
                    clearStoredTokens();
                }
                set({ tokens });
            },

            login: (tokens, user) => {
                storeTokens(tokens);
                set({
                    user,
                    tokens,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                clearStoredTokens();
                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                });
            },

            initialize: () => {
                // Sync tokens from localStorage on app start
                const storedTokens = getStoredTokens();
                if (storedTokens) {
                    set({ tokens: storedTokens });
                }

                // Set up callback for token refresh
                setTokenRefreshCallback((newTokens: AuthTokens) => {
                    set({ tokens: newTokens });
                });
            },

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    // Check if we have stored tokens
                    const storedTokens = get().tokens;
                    if (!storedTokens?.accessToken) {
                        set({ isAuthenticated: false, user: null, isLoading: false });
                        return;
                    }

                    // Try to fetch current user
                    const user = await authService.getCurrentUser();
                    set({
                        user,
                        tokens: storedTokens,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error) {
                    // If token expired, tokens will be cleared by interceptor
                    set({
                        user: null,
                        tokens: null,
                        isAuthenticated: false,
                        isLoading: false
                    });
                    clearStoredTokens();
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                tokens: state.tokens,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
