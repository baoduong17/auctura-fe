// services/api.config.ts
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { AuthTokens } from '@/types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

// Token update callback - will be set by auth store
let onTokensRefreshed: ((tokens: AuthTokens) => void) | null = null;

export function setTokenRefreshCallback(callback: (tokens: AuthTokens) => void) {
    onTokensRefreshed = callback;
}

export const apiClient = axios.create({
    baseURL: `${API_BASE_URL}${API_PREFIX}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const tokens = getStoredTokens();
        if (tokens?.accessToken) {
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const tokens = getStoredTokens();
            if (!tokens?.refreshToken) {
                clearStoredTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${API_BASE_URL}${API_PREFIX}/auths/refresh-token`,
                    { refreshToken: tokens.refreshToken }
                );

                const newTokens: AuthTokens = response.data.token || response.data;

                storeTokens(newTokens);

                // Update zustand store if callback is set
                if (onTokensRefreshed) {
                    onTokensRefreshed(newTokens);
                }

                processQueue(null, newTokens.accessToken);

                originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as Error, null);
                clearStoredTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Token storage helpers
export function getStoredTokens(): AuthTokens | null {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored) : null;
}

export function storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

export function clearStoredTokens(): void {
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('user');
}
