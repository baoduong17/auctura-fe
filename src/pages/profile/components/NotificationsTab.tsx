import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "@/components/forms/NotificationSettings";

export function NotificationsTab() {
  return (
    <Card className="bg-background border">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NotificationSettings />
        <Separator className="bg-background" />
        <p className="text-xs text-muted-foreground">
          Note: Notification settings are currently in development and will be
          available soon.
        </p>
      </CardContent>
    </Card>
  );
}
