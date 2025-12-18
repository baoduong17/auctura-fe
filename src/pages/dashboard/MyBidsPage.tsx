// pages/dashboard/MyBidsPage.tsx
import { Link } from 'react-router-dom';
import { useMyBids } from '@/hooks/useBids';
import type { MyBidItem } from '@/types/bid';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/layout';
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
import { Eye, Trophy, Gavel, DollarSign, Clock } from 'lucide-react';
import { formatDateTime, parseDate } from '@/utils/formatters';

export function MyBidsPage() {
  const { data, isLoading, error, refetch } = useMyBids();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          description="Track your active bids and see which auctions you're winning"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard/my-items' },
            { label: 'My Bids' },
          ]}
        />
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

  if (!data) {
    return null;
  }

  const { activeBidsCount, activeWinningBidsCount, activeWinningBidsSum, bids } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        description="Track your active bids and see which auctions you're winning"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/my-items' },
          { label: 'My Bids' },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#242424] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Gavel className="h-5 w-5 text-[#256af4]" />
            <h3 className="text-gray-400 text-sm">Total Active Bids</h3>
          </div>
          <p className="text-3xl font-bold">{activeBidsCount}</p>
        </div>

        <div className="bg-[#242424] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-green-500" />
            <h3 className="text-gray-400 text-sm">Currently Winning</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">{activeWinningBidsCount}</p>
        </div>

        <div className="bg-[#242424] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <h3 className="text-gray-400 text-sm">Total Bid Amount</h3>
          </div>
          <PriceDisplay amount={activeWinningBidsSum} size="lg" showIcon={false} />
        </div>
      </div>

      {/* Bids Table */}
      {bids.length > 0 ? (
        <div className="bg-[#242424] rounded-lg border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Item Name</TableHead>
                <TableHead className="text-gray-400">Bid Amount</TableHead>
                <TableHead className="text-gray-400">Auction Ends</TableHead>
                <TableHead className="text-gray-400">Time Left</TableHead>
                <TableHead className="text-gray-400">Bid Time</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid: MyBidItem) => {
                const isEnded = parseDate(bid.itemEndTime) < new Date();
                const bidPrice = typeof bid.price === 'string' ? parseFloat(bid.price) : bid.price;

                return (
                  <TableRow key={bid.id} className="border-gray-800 hover:bg-[#2a2a2a]">
                    <TableCell className="font-medium">
                      <Link 
                        to={`/items/${bid.itemId}`}
                        className="hover:text-[#256af4] transition-colors"
                      >
                        {bid.itemName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <PriceDisplay amount={bidPrice} showIcon={true} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {formatDateTime(bid.itemEndTime)}
                    </TableCell>
                    <TableCell>
                      {isEnded ? (
                        <Badge variant="outline" className="border-red-600 text-red-500">
                          Ended
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          <CountdownTimer endTime={bid.itemEndTime} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {formatDateTime(bid.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/items/${bid.itemId}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-[#256af4] hover:text-white">
                          <Eye className="h-4 w-4 mr-2" />
                          View Item
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
