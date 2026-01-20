import { Link } from "react-router-dom";
import { useMyBids } from "@/hooks/useBids";
import type { MyBidItem } from "@/types/bid";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { TableSkeleton } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { SmallStatCard } from "@/components/stats/SmallStatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trophy, Gavel, DollarSign } from "lucide-react";
import { formatDateTime, parseDate } from "@/utils/formatters";

export function MyBidsPage() {
  const { data, isLoading, error, refetch } = useMyBids();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-background p-6 rounded-lg border border-gray-800 space-y-3"
            >
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

  const {
    activeBidsCount,
    activeWinningBidsCount,
    activeWinningBidsSum,
    bids,
  } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SmallStatCard
          title="Total Active Bids"
          value={activeBidsCount}
          icon={Gavel}
          iconClassName="h-8 w-8 text-purple-500"
        />

        <SmallStatCard
          title="Currently Winning"
          value={activeWinningBidsCount}
          icon={Trophy}
          iconClassName="h-8 w-8 text-yellow-500"
          valueClassName="text-2xl font-bold mt-1 text-green-500"
        />

        <SmallStatCard
          title="Total Bid Amount"
          value={
            <PriceDisplay
              amount={activeWinningBidsSum}
              size="lg"
              showIcon={false}
              showCurrency={false}
            />
          }
          icon={DollarSign}
          iconClassName="h-8 w-8 text-green-500"
        />
      </div>

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
                <TableHead className="text-gray-400 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid: MyBidItem) => {
                const isEnded = parseDate(bid.itemEndTime) < new Date();
                const bidPrice =
                  typeof bid.price === "string"
                    ? parseFloat(bid.price)
                    : bid.price;

                return (
                  <TableRow
                    key={bid.id}
                    className="border-gray-800 hover:bg-[#2a2a2a]"
                  >
                    <TableCell className="font-medium">
                      <Link
                        to={`/items/${bid.itemId}`}
                        className="hover:text-[#256af4] transition-colors"
                      >
                        {bid.itemName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <PriceDisplay
                        amount={bidPrice}
                        showIcon={true}
                        showCurrency={false}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {formatDateTime(bid.itemEndTime)}
                    </TableCell>
                    <TableCell>
                      {isEnded ? (
                        <Badge
                          variant="outline"
                          className="border-red-600 text-red-500"
                        >
                          Ended
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CountdownTimer endTime={bid.itemEndTime} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {formatDateTime(bid.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/items/${bid.itemId}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-[#256af4] hover:text-white"
                        >
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
