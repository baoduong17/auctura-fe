export interface NotificationMessage {
    title: string;
    content: string;
    actionUrl?: string;
    imageUrl?: string;
}

export interface Notification {
    id: string;
    isRead: boolean;
    message: NotificationMessage;
    createdAt: string;
    updatedAt: string;
}
