// pages/dashboard/MyItemsPage.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useMyItems, useLockItem } from '@/hooks/useItems';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, Lock, MoreVertical, Plus, Package } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

export function MyItemsPage() {
  const { user } = useAuthStore();
  const { data, isLoading, error, refetch } = useMyItems(user?.id);
  const { mutate: lockItem, isPending: isLocking } = useLockItem();

  const handleLockItem = (itemId: string) => {
    lockItem(itemId);
  };

  if (isLoading) return <LoadingCard />;

  if (error) {
    return (
      <ErrorState
        title="Failed to load items"
        message="Could not fetch your items. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Items</h1>
          <p className="text-gray-400 mt-1">Manage your auction items</p>
        </div>
        <Link to="/items/create">
          <Button className="bg-[#256af4] hover:bg-[#1e5dd9]">
            <Plus className="h-4 w-4 mr-2" />
            Create Item
          </Button>
        </Link>
      </div>

      {/* Items Table */}
      {data && data.length > 0 ? (
        <div className="bg-[#242424] rounded-lg border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Item Name</TableHead>
                <TableHead className="text-gray-400">Current Price</TableHead>
                <TableHead className="text-gray-400">Bids</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Start Time</TableHead>
                <TableHead className="text-gray-400">End Time</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} className="border-gray-800">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <PriceDisplay amount={item.currentPrice} showIcon={false} />
                  </TableCell>
                  <TableCell>{item.bidCount}</TableCell>
                  <TableCell>
                    <StatusBadge item={item} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {formatDateTime(item.startTime)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {formatDateTime(item.endTime)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#242424] border-gray-800">
                        <DropdownMenuItem asChild>
                          <Link to={`/items/${item.id}`} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {!item.isLocked && item.bidCount === 0 && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to={`/items/${item.id}/edit`} className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleLockItem(item.id)}
                              disabled={isLocking}
                              className="cursor-pointer text-red-500"
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              Lock Item
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="You haven't created any items yet"
          description="Start creating items to list them for auction"
          actionLabel="Create Your First Item"
          actionLink="/items/create"
        />
      )}

      {/* Stats */}
      {data?.items && data.items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Items</p>
            <p className="text-2xl font-bold mt-1">{data.items.length}</p>
          </div>
          <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Active Auctions</p>
            <p className="text-2xl font-bold mt-1">
              {data.items.filter((item) => !item.isLocked && new Date(item.startTime) <= new Date() && new Date(item.endTime) > new Date()).length}
            </p>
          </div>
          <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Bids</p>
            <p className="text-2xl font-bold mt-1">
              {data.items.reduce((sum, item) => sum + item.bidCount, 0)}
            </p>
          </div>
          <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Locked Items</p>
            <p className="text-2xl font-bold mt-1">
              {data.items.filter((item) => item.isLocked).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
