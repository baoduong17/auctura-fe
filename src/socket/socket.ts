import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import type { NotificationMessage } from "@/types/notification";

interface UserAuthData {
    userId: string;
    email: string;
}

export class SocketConnection {
    private static socket: Socket | undefined;

    private constructor() { }

    public static getInstance(): Socket | undefined {
        return SocketConnection.socket;
    }

    public static connect(authData: UserAuthData): Socket {
        if (SocketConnection.socket?.connected) {
            SocketConnection.socket.disconnect();
        }

        SocketConnection.socket = io("http://localhost:5000", {
            transports: ["websocket"],
            auth: {
                userId: authData.userId,
                email: authData.email,
                platform: 'web',
                project: 'AUCTION'
            },
        });

        SocketConnection.socket.on("connect", () => {
            console.log("Socket connected with userId:", authData.userId);
        });

        SocketConnection.socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        SocketConnection.socket.on("notification", (data: NotificationMessage) => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });

            toast.info(data.title, {
                description: data.content,
                duration: 5000,
                className: data.actionUrl ? "cursor-pointer" : "",
                onClick: () => {
                    if (data.actionUrl) {
                        window.location.href = data.actionUrl;
                    }
                },
            } as any);
        });

        return SocketConnection.socket;
    }

    public static emit<T>(event: string, data: T) {
        if (SocketConnection.socket?.connected) {
            SocketConnection.socket.emit(event, data);
        } else {
            console.warn("Socket not connected. Cannot emit event:", event);
        }
    }

    public static on<T>(event: string, callback: (data: T) => void) {
        if (SocketConnection.socket) {
            SocketConnection.socket.on(event, callback);
        }
    }

    public static off(event: string) {
        if (SocketConnection.socket) {
            SocketConnection.socket.off(event);
        }
    }

    public static disconnect() {
        if (SocketConnection.socket) {
            SocketConnection.socket.disconnect();
            SocketConnection.socket = undefined;
            console.log("Socket disconnected and cleared");
        }
    }

    public static isConnected(): boolean {
        return SocketConnection.socket?.connected ?? false;
    }
}
