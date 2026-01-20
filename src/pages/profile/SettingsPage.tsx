import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab, SecurityTab, NotificationsTab } from "./components";
import { User, Lock, Bell } from "lucide-react";

export function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">Please login to access settings</p>
      </div>
    );
  }

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-background border">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-foreground data-[state=active]:text-primary-foreground data-[state=active]:border"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-foreground data-[state=active]:text-primary-foreground data-[state=active]:border"
          >
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-foreground data-[state=active]:text-primary-foreground data-[state=active]:border"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
