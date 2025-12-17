// pages/dashboard/MyBidsPage.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useItems } from '@/hooks/useItems';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Trophy, Gavel, DollarSign } from 'lucide-react';
import { formatDateTime, parseDate } from '@/utils/formatters';

export function MyBidsPage() {
  const { user } = useAuthStore();
  // Get all items where user is the highest bidder
  const { data, isLoading, error, refetch } = useItems({});

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Bids</h1>
          <p className="text-gray-400">Track your active bids and see which auctions you're winning</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#242424] p-6 rounded-lg border border-gray-800 space-y-3">
              <Skeleton className="h-5 w-32 bg-gray-700" />
              <Skeleton className="h-10 w-20 bg-gray-700" />
            </div>
          ))}
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load bids"
        message="Could not fetch your bids. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  // Filter items where user is the highest bidder
  const myBids = data?.filter(
    (item) => item.highestBidderId === user?.id && (item.totalBids ?? 0) > 0
  ) || [];

  const totalActiveBids = myBids.length;
  const currentlyWinning = myBids.filter(
    (item) => parseDate(item.endTime) > new Date()
  ).length;
  const totalBidAmount = myBids.reduce((sum, item) => {
    const currentBid = typeof item.currentBid === 'string' 
      ? parseFloat(item.currentBid) 
      : (item.currentBid || 0);
    const startingPrice = typeof item.startingPrice === 'string' 
      ? parseFloat(item.startingPrice) 
      : item.startingPrice;
    const price = currentBid || startingPrice;
    return sum + price;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Bids</h1>
        <p className="text-gray-400">Track your active bids and see which auctions you're winning</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#242424] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Gavel className="h-5 w-5 text-[#256af4]" />
            <h3 className="text-gray-400 text-sm">Total Active Bids</h3>
          </div>
          <p className="text-3xl font-bold">{totalActiveBids}</p>
        </div>

        <div className="bg-[#242424] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-green-500" />
            <h3 className="text-gray-400 text-sm">Currently Winning</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">{currentlyWinning}</p>
        </div>

        <div className="bg-[#242424] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <h3 className="text-gray-400 text-sm">Total Bid Amount</h3>
          </div>
          <PriceDisplay amount={totalBidAmount} size="lg" showIcon={false} />
        </div>
      </div>

      {/* Bids Table */}
      {myBids.length > 0 ? (
        <div className="bg-[#242424] rounded-lg border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Item Name</TableHead>
                <TableHead className="text-gray-400">Your Bid</TableHead>
                <TableHead className="text-gray-400">Current Price</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Time Left</TableHead>
                <TableHead className="text-gray-400">Bid Time</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myBids.map((item) => {
                const isWinning = item.highestBidderId === user?.id;
                const isEnded = parseDate(item.endTime) < new Date();

                return (
                  <TableRow key={item.id} className="border-gray-800">\n                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PriceDisplay amount={item.currentBid || item.startingPrice} showIcon={false} />
                        {isWinning && !isEnded && (
                          <Badge className="bg-green-600">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winning
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <PriceDisplay amount={item.currentBid || item.startingPrice} showIcon={false} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        startTime={item.startTime}
                        endTime={item.endTime}
                        isLocked={item.isLocked}
                      />
                    </TableCell>
                    <TableCell>
                      <CountdownTimer endTime={item.endTime} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {item.updatedAt ? formatDateTime(item.updatedAt) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/items/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={Gavel}
          title="You haven't placed any bids yet"
          description="Browse the marketplace to find items and start bidding"
          actionLabel="Browse Marketplace"
          actionLink="/marketplace"
        />
      )}
    </div>
  );
}
