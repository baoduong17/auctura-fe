import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { notificationService } from "@/services/notification.service";
import { formatDistanceToNow } from "date-fns";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NotificationsSidebarItem() {
  const { user } = useAuthStore();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => notificationService.getNotifications(user!.id),
    enabled: !!user?.id,
  });

  const sortedNotifications = notifications?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <SidebarMenuItem>
      <Popover>
        <PopoverTrigger asChild>
          <SidebarMenuButton tooltip="Notifications">
            <Bell />
            <span>Notifications</span>
            {notifications && notifications.some((n) => !n.isRead) && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            )}
          </SidebarMenuButton>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          side="right"
          align="start"
          sideOffset={20}
        >
          <div className="p-4">
            <h4 className="font-semibold leading-none">Notifications</h4>
          </div>
          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-20 text-sm text-primary">
                Loading...
              </div>
            ) : !sortedNotifications?.length ? (
              <div className="flex items-center justify-center h-20 text-sm text-primary">
                No notifications
              </div>
            ) : (
              <div className="flex flex-col">
                {sortedNotifications.map((unit) => (
                  <div
                    key={unit.id}
                    className={`p-4 hover:bg-background/50 bg-background cursor-pointer${
                      !unit.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                    onClick={() =>
                      unit.message.actionUrl &&
                      (window.location.href = unit.message.actionUrl)
                    }
                  >
                    <div className="text-sm text-primary mb-2">
                      {unit.message.content}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(unit.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  );
}
