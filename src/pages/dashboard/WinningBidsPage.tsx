import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useWinningBids } from '@/hooks/useItems';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { SmallStatCard } from '@/components/stats/SmallStatCard';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Trophy, Calendar, Eye, DollarSign, Target } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TableSkeleton rows={5} />
      </div>
    );
  }

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
      {winningItems.length > 0 && (
        <div className="flex items-center justify-end mb-4">
          <Button 
            onClick={handleDownloadPDF}
            className="bg-[#256af4] hover:bg-[#1e5dd9]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      )}

      {winningItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SmallStatCard
            title="Total Items Won"
            value={winningItems.length}
            icon={Trophy}
            iconClassName="h-8 w-8 text-yellow-500"
          />
          <SmallStatCard
            title="Total Spent"
            value={
              <PriceDisplay
                amount={winningItems.reduce((sum, item) => {
                  const price = typeof item.finalPrice === 'string' 
                    ? parseFloat(item.finalPrice) 
                    : item.finalPrice;
                  return sum + price;
                }, 0)}
                showIcon={false}
                showCurrency={false}
                size="lg"
              />
            }
            icon={DollarSign}
            iconClassName="h-8 w-8 text-green-500"
          />
          <SmallStatCard
            title="Average Win Price"
            value={
              <PriceDisplay
                amount={winningItems.reduce((sum, item) => {
                  const price = typeof item.finalPrice === 'string' 
                    ? parseFloat(item.finalPrice) 
                    : item.finalPrice;
                  return sum + price;
                }, 0) / winningItems.length}
                showIcon={false}
                showCurrency={false}
                size="lg"
              />
            }
            icon={Target}
            iconClassName="h-8 w-8 text-blue-500"
          />
        </div>
      )}

      {winningItems.length > 0 ? (
        <div className="bg-[#242424] rounded-lg border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Item Name</TableHead>
                <TableHead className="text-gray-400">Owner</TableHead>
                <TableHead className="text-gray-400">Starting Price</TableHead>
                <TableHead className="text-gray-400">Final Price</TableHead>
                <TableHead className="text-gray-400">Auction End</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {winningItems.map((item) => {
                const startingPrice = typeof item.startingPrice === 'string' 
                  ? parseFloat(item.startingPrice) 
                  : item.startingPrice;
                const finalPrice = typeof item.finalPrice === 'string' 
                  ? parseFloat(item.finalPrice) 
                  : item.finalPrice;

                return (
                  <TableRow key={item.id} className="border-gray-800 hover:bg-[#2a2a2a]">
                    <TableCell className="font-medium">
                      <Link 
                        to={`/items/${item.id}`}
                        className="hover:text-[#256af4] transition-colors flex items-center gap-2"
                      >
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {item.ownerName}
                    </TableCell>
                    <TableCell>
                      <PriceDisplay amount={startingPrice} showIcon={true} showCurrency={false} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PriceDisplay amount={finalPrice} showIcon={true} showCurrency={false} size="md" />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(item.endTime)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/items/${item.id}`}>
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
          icon={Trophy}
          title="No winning bids yet"
          description="Keep bidding on items to build your collection"
          actionLabel="Browse Marketplace"
          actionLink="/marketplace"
        />
      )}
    </div>
  );
}
