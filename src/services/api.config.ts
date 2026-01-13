// services/api.config.ts
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { AuthTokens } from '@/types/auth';

// Service base URLs
const AUCTION_SERVICE_URL = import.meta.env.VITE_AUCTION_SERVICE_URL || 'http://localhost:3000';
const MEDIA_SERVICE_URL = import.meta.env.VITE_MEDIA_SERVICE_URL || 'http://localhost:4000';
const NOTIFICATION_SERVICE_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:5000';

// Service prefixes
const AUCTION_SERVICE_PREFIX = '/auction-service/api/v1';
const MEDIA_SERVICE_PREFIX = '/media-service/api/v1';
const NOTIFICATION_SERVICE_PREFIX = '/notification-service/api/v1';

let onTokensRefreshed: ((tokens: AuthTokens) => void) | null = null;

export function setTokenRefreshCallback(callback: (tokens: AuthTokens) => void) {
    onTokensRefreshed = callback;
}

// Auction Service API Client (auths, users, items, bids)
export const apiClient = axios.create({
    baseURL: `${AUCTION_SERVICE_URL}${AUCTION_SERVICE_PREFIX}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Media Service API Client
export const mediaApiClient = axios.create({
    baseURL: `${MEDIA_SERVICE_URL}${MEDIA_SERVICE_PREFIX}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Notification Service API Client
export const notificationApiClient = axios.create({
    baseURL: `${NOTIFICATION_SERVICE_URL}${NOTIFICATION_SERVICE_PREFIX}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to add auth token to request
const addAuthToken = (config: InternalAxiosRequestConfig) => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
};

// Add request interceptor for both clients
apiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
mediaApiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
notificationApiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

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

// Create response interceptor handler for 401 errors
const createResponseInterceptor = (client: AxiosInstance) => {
    client.interceptors.response.use(
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
                            return client(originalRequest);
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
                        `${AUCTION_SERVICE_URL}${AUCTION_SERVICE_PREFIX}/auths/refresh-token`,
                        { refreshToken: tokens.refreshToken }
                    );

                    const newTokens: AuthTokens = response.data.token || response.data;

                    storeTokens(newTokens);

                    if (onTokensRefreshed) {
                        onTokensRefreshed(newTokens);
                    }

                    processQueue(null, newTokens.accessToken);

                    originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                    return client(originalRequest);
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
};

// Add response interceptors for both clients
createResponseInterceptor(apiClient);
createResponseInterceptor(mediaApiClient);
createResponseInterceptor(notificationApiClient);

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
