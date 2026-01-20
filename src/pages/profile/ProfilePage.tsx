import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  Gavel,
  Trophy,
} from "lucide-react";
import { formatDate, parseDate } from "@/utils/formatters";
import { useItems, useWinningBids } from "@/hooks/useItems";

export function ProfilePage() {
  const { user } = useAuthStore();
  const { data: myItems } = useItems({ name: user?.id });
  const { data: winningBids } = useWinningBids(user?.id || "");

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary">Please login to view your profile</p>
      </div>
    );
  }

  const getInitials = () => {
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  const totalBids =
    myItems?.reduce((sum, item) => sum + (item.totalBids || 0), 0) || 0;
  const activeItems =
    myItems?.filter(
      (item) => !item.isLocked && parseDate(item.endTime) > new Date(),
    ).length || 0;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-background border-gray-800">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.picture} />
                  <AvatarFallback className="bg-gray-800 text-white text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <Badge variant="outline" className="mt-2 w-fit mx-auto">
                {user.role}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator className="bg-card" />

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-primary">{user.email}</span>
                </div>

                {user.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-primary">{user.phoneNumber}</span>
                  </div>
                )}

                {user.gender && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-primary">{user.gender}</span>
                  </div>
                )}

                {user.birthday && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-primary">
                      {formatDate(user.birthday)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-primary">
                    {user.createdAt
                      ? `Joined ${formatDate(user.createdAt)}`
                      : "Member"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary text-sm">Total Items</p>
                    <p className="text-3xl font-bold mt-2">
                      {myItems?.length || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary text-sm">Total Bids Received</p>
                    <p className="text-3xl font-bold mt-2">{totalBids}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                    <Gavel className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary text-sm">Items Won</p>
                    <p className="text-3xl font-bold mt-2">
                      {winningBids?.length || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-background border">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <p className="font-medium">Active Auctions</p>
                  <p className="text-sm text-primary">Currently running</p>
                </div>
                <Badge className="bg-green-600 text-white">{activeItems}</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <p className="font-medium">Locked Items</p>
                  <p className="text-sm text-primary">Cannot receive bids</p>
                </div>
                <Badge variant="outline">
                  {myItems?.filter((item) => item.isLocked).length || 0}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <p className="font-medium">Completed Auctions</p>
                  <p className="text-sm text-primary">Ended auctions</p>
                </div>
                <Badge variant="outline">
                  {myItems?.filter(
                    (item) => parseDate(item.endTime) < new Date(),
                  ).length || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
