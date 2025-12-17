// pages/profile/ProfilePage.tsx
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, Settings, Package, Gavel, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, parseDate } from '@/utils/formatters';
import { useItems, useWinningBids } from '@/hooks/useItems';

export function ProfilePage() {
  const { user } = useAuthStore();
  const { data: myItems } = useItems({ name: user?.id });
  const { data: winningBids } = useWinningBids(user?.id || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-gray-400">Please login to view your profile</p>
      </div>
    );
  }

  const getInitials = () => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const totalBids = myItems?.reduce((sum, item) => sum + (item.totalBids || 0), 0) || 0;
  const activeItems = myItems?.filter(
    (item) => !item.isLocked && parseDate(item.endTime) > new Date()
  ).length || 0;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link to="/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-[#256af4] text-white text-2xl">
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
                <Separator className="bg-gray-800" />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{user.email}</span>
                  </div>

                  {user.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{user.phoneNumber}</span>
                    </div>
                  )}

                  {user.gender && (
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{user.gender}</span>
                    </div>
                  )}

                  {user.birthday && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{formatDate(user.birthday)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">
                      {user.createdAt ? `Joined ${formatDate(user.createdAt)}` : 'Member'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#242424] border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Items</p>
                      <p className="text-3xl font-bold mt-2">
                        {myItems?.length || 0}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#242424] border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Bids Received</p>
                      <p className="text-3xl font-bold mt-2">{totalBids}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Gavel className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#242424] border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Items Won</p>
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

            {/* Activity Summary */}
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="font-medium">Active Auctions</p>
                    <p className="text-sm text-gray-400">Currently running</p>
                  </div>
                  <Badge className="bg-green-600 text-white">{activeItems}</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="font-medium">Locked Items</p>
                    <p className="text-sm text-gray-400">Cannot receive bids</p>
                  </div>
                  <Badge variant="outline">
                    {myItems?.filter((item) => item.isLocked).length || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="font-medium">Completed Auctions</p>
                    <p className="text-sm text-gray-400">Ended auctions</p>
                  </div>
                  <Badge variant="outline">
                    {myItems?.filter(
                      (item) => parseDate(item.endTime) < new Date()
                    ).length || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/items/create">
                    <Button variant="outline" className="w-full">
                      Create Item
                    </Button>
                  </Link>
                  <Link to="/dashboard/my-items">
                    <Button variant="outline" className="w-full">
                      My Items
                    </Button>
                  </Link>
                  <Link to="/dashboard/my-bids">
                    <Button variant="outline" className="w-full">
                      My Bids
                    </Button>
                  </Link>
                  <Link to="/marketplace">
                    <Button variant="outline" className="w-full">
                      Browse Market
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
