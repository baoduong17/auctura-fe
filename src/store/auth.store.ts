import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types/auth';
import { storeTokens, clearStoredTokens, getStoredTokens, setTokenRefreshCallback } from '@/services/api.config';
import { SocketConnection } from '@/socket/socket';

interface AuthStore {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setUser: (user: User | null) => void;
    setTokens: (tokens: AuthTokens | null) => void;
    updateUser: (user: User) => void;
    login: (tokens: AuthTokens, user: User) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, _) => ({
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

            updateUser: (user) => {
                set({ user, isAuthenticated: true });
            },

            login: (tokens, user) => {
                storeTokens(tokens);
                set({
                    user,
                    tokens,
                    isAuthenticated: true,
                });
                SocketConnection.connect({
                    userId: user.id,
                    email: user.email,
                });
            },

            logout: () => {
                clearStoredTokens();
                SocketConnection.disconnect();
                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                });
            },

            initialize: () => {
                const storedTokens = getStoredTokens();
                if (storedTokens) {
                    set({ tokens: storedTokens });
                }

                setTokenRefreshCallback((newTokens: AuthTokens) => {
                    set({ tokens: newTokens });
                });
            }
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
