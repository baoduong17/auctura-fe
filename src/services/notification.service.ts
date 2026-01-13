import { notificationApiClient } from './api.config';
import type { Notification } from '@/types/notification';

export const notificationService = {
    getNotifications: async (userId: string, channels: string[] = ['web', 'mobile']): Promise<Notification[]> => {
        const response = await notificationApiClient.get<Notification[]>(`/notifications/${userId}`, {
            params: {
                channels
            },
            paramsSerializer: {
                indexes: null
            }
        });
        return response.data;
    },

    markAsRead: async (notificationId: string): Promise<void> => {
        await notificationApiClient.patch(`/notifications/${notificationId}/read`);
    },

    markAllAsRead: async (userId: string): Promise<void> => {
        await notificationApiClient.patch(`/notifications/user/${userId}/read-all`);
    }
};
