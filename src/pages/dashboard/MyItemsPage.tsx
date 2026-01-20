import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useMyItems, useLockItem } from "@/hooks/useItems";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TableSkeleton } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { SmallStatCard } from "@/components/stats/SmallStatCard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Lock,
  MoreVertical,
  Plus,
  Package,
  Activity,
  Gavel,
  Target,
} from "lucide-react";
import { formatDateTime, parseDate } from "@/utils/formatters";

export function MyItemsPage() {
  const { user } = useAuthStore();
  const { data, isLoading, error, refetch } = useMyItems(user?.id);
  const { mutate: lockItem, isPending: isLocking } = useLockItem();

  const handleLockItem = (itemId: string) => {
    lockItem(itemId);
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
        title="Failed to load items"
        message="Could not fetch your items. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link to="/items/create">
          <Button className="bg-card text-primary hover:bg-card-foreground hover:text-primary-foreground border">
            <Plus className="h-4 w-4 mr-2" />
            Create Item
          </Button>
        </Link>
      </div>

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SmallStatCard
            title="Total Items"
            value={data.length}
            icon={Package}
            iconClassName="h-8 w-8 text-primary"
          />
          <SmallStatCard
            title="Active Auctions"
            value={
              data.filter((item) => {
                const now = new Date();
                const startTime = parseDate(item.startTime);
                const endTime = parseDate(item.endTime);
                return startTime <= now && endTime > now;
              }).length
            }
            icon={Activity}
            iconClassName="h-8 w-8 text-green-500"
          />
          <SmallStatCard
            title="Total Bids"
            value={data.reduce((sum, item) => sum + item.bidsCount, 0)}
            icon={Gavel}
            iconClassName="h-8 w-8 text-purple-500"
          />
          <SmallStatCard
            title="Items with Bids"
            value={data.filter((item) => item.bidsCount > 0).length}
            icon={Target}
            iconClassName="h-8 w-8 text-yellow-500"
          />
        </div>
      )}

      {data && data.length > 0 ? (
        <div className="bg-background rounded-lg border">
          <Table>
            <TableHeader className="bg-[#1e2330]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-primary-foreground bg-foreground">
                  Item Name
                </TableHead>
                <TableHead className="text-primary-foreground bg-foreground">
                  Current Price
                </TableHead>
                <TableHead className="text-primary-foreground bg-foreground">
                  Bids
                </TableHead>
                <TableHead className="text-primary-foreground bg-foreground">
                  Status
                </TableHead>
                <TableHead className="text-primary-foreground bg-foreground">
                  Start Time
                </TableHead>
                <TableHead className="text-primary-foreground bg-foreground">
                  End Time
                </TableHead>
                <TableHead className="text-primary-foreground bg-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                const canEdit = item.bidsCount === 0;

                return (
                  <TableRow key={item.id} className="hover:bg-gray-800/50">
                    <TableCell className="font-medium text-primary">
                      {item.name}
                    </TableCell>
                    <TableCell>
                      <PriceDisplay
                        amount={item.currentPrice}
                        showIcon={true}
                        showCurrency={false}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.bidsCount}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        startTime={item.startTime}
                        endTime={item.endTime}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(item.startTime)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(item.endTime)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#2a2a2a] border-gray-700"
                        >
                          <DropdownMenuItem
                            asChild
                            className="cursor-pointer hover:bg-primary"
                          >
                            <Link to={`/items/${item.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {canEdit && (
                            <>
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer hover:bg-primary"
                              >
                                <Link to={`/items/${item.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleLockItem(item.id)}
                                disabled={isLocking}
                                className="cursor-pointer text-red-400 hover:bg-primary hover:text-red-300"
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
                );
              })}
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
    </div>
  );
}
