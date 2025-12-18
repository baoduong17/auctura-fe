// pages/dashboard/WinningBidsPage.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useWinningBids } from '@/hooks/useItems';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Trophy, Calendar, Eye } from 'lucide-react';
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
        <PageHeader
          description="Items you've won in auctions"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard/my-items' },
            { label: 'Winning Bids' },
          ]}
        />
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
      {/* Header */}
      <PageHeader
        description="Items you've won in auctions"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/my-items' },
          { label: 'Winning Bids' },
        ]}
        actions={
          winningItems.length > 0 && (
            <Button
              onClick={handleDownloadPDF}
              className="bg-[#256af4] hover:bg-[#1e5dd9]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          )
        }
      />

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
                amount={winningItems.reduce((sum, item) => {
                  const price = typeof item.finalPrice === 'string' 
                    ? parseFloat(item.finalPrice) 
                    : item.finalPrice;
                  return sum + price;
                }, 0)}
                showIcon={false}
                size="lg"
              />
            </p>
          </div>
          <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Average Win Price</p>
            <p className="text-2xl font-bold mt-1">
              <PriceDisplay
                amount={winningItems.reduce((sum, item) => {
                  const price = typeof item.finalPrice === 'string' 
                    ? parseFloat(item.finalPrice) 
                    : item.finalPrice;
                  return sum + price;
                }, 0) / winningItems.length}
                showIcon={false}
                size="lg"
              />
            </p>
          </div>
        </div>
      )}

      {/* Winning Items Table */}
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
                      <PriceDisplay amount={startingPrice} showIcon={true} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PriceDisplay amount={finalPrice} showIcon={true} size="md" />
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
