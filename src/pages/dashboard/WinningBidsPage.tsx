// pages/dashboard/WinningBidsPage.tsx
import { useAuthStore } from '@/store/auth.store';
import { useWinningBids } from '@/hooks/useItems';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Trophy, Calendar } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';
import { itemService } from '@/services/item.service';
import { toast } from 'sonner';

export function WinningBidsPage() {
  const { user } = useAuthStore();
  const { data, isLoading, error, refetch } = useWinningBids(user?.id || '');

  const handleDownloadPDF = async () => {
    if (!user?.id) return;

    try {
      const blob = await itemService.downloadWinningBidsPdf(user.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `winning-bids-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  if (isLoading) return <LoadingCard />;

  if (error) {
    return (
      <ErrorState
        title="Failed to load winning bids"
        message="Could not fetch your winning items. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const winningItems = data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Winning Bids
          </h1>
          <p className="text-gray-400 mt-1">Items you've won in auctions</p>
        </div>
        {winningItems.length > 0 && (
          <Button
            onClick={handleDownloadPDF}
            className="bg-[#256af4] hover:bg-[#1e5dd9]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        )}
      </div>

      {/* Winning Items Table */}
      {winningItems.length > 0 ? (
        <div className="bg-[#242424] rounded-lg border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Item Name</TableHead>
                <TableHead className="text-gray-400">Winning Bid</TableHead>
                <TableHead className="text-gray-400">Bid Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {winningItems.map((item) => (
                <TableRow key={item.itemId} className="border-gray-800">
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PriceDisplay amount={item.winningBid} size="md" />
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDateTime(item.bidTime)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No winning bids yet"
          description="Keep bidding on items to build your collection"
          actionLabel="Browse Marketplace"
          actionLink="/marketplace"
        />
      )}

      {/* Summary Stats */}
      {winningItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Items Won</p>
            <p className="text-2xl font-bold mt-1">{winningItems.length}</p>
          </div>
          <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Spent</p>
            <p className="text-2xl font-bold mt-1">
              <PriceDisplay
                amount={winningItems.reduce((sum, item) => sum + item.winningBid, 0)}
                showIcon={false}
                size="lg"
              />
            </p>
          </div>
          <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Average Win Price</p>
            <p className="text-2xl font-bold mt-1">
              <PriceDisplay
                amount={winningItems.reduce((sum, item) => sum + item.winningBid, 0) / winningItems.length}
                showIcon={false}
                size="lg"
              />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
