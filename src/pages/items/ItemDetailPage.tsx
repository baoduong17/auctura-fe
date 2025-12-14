// pages/items/ItemDetailPage.tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useItem } from '@/hooks/useItems';
import { usePlaceBid } from '@/hooks/useBids';
import { useLockItem } from '@/hooks/useItems';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { LoadingPage, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorPage } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lock, User, Calendar, Gavel, DollarSign } from 'lucide-react';
import { placeBidSchema } from '@/schemas/bid.schemas';
import type { PlaceBidForm } from '@/types/bid';
import { formatDateTime } from '@/utils/formatters';
import { canPlaceBid } from '@/utils/validators';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: item, isLoading, error } = useItem(id!);
  const { mutate: placeBid, isPending: isPlacingBid } = usePlaceBid();
  const { mutate: lockItem, isPending: isLocking } = useLockItem();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlaceBidForm>({
    resolver: zodResolver(placeBidSchema),
    defaultValues: {
      itemId: id,
    },
  });

  const onSubmit = (data: PlaceBidForm) => {
    if (!item || !user?.id) return;

    const validation = canPlaceBid(item, user.id, data.price);
    if (!validation.canBid) {
      toast.error(validation.reason || 'Cannot place bid');
      return;
    }

    placeBid(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleLockItem = () => {
    if (!id) return;
    lockItem(id);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !item) {
    return (
      <ErrorPage
        title="Item not found"
        message="The item you're looking for doesn't exist or has been removed."
        onRetry={() => navigate('/marketplace')}
      />
    );
  }

  const isOwner = user?.id === item.ownerId;
  const validation = user?.id 
    ? canPlaceBid(item, user.id, (item.currentBid || item.startingPrice) + 1)
    : { canBid: false, reason: 'Please login to bid' };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Link to="/marketplace">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Info Card */}
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{item.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      Item ID: {item.id}
                    </CardDescription>
                  </div>
                  <StatusBadge 
                    startTime={item.startTime}
                    endTime={item.endTime}
                    isLocked={item.isLocked}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Current Price</p>
                    <PriceDisplay amount={(item.currentBid || item.startingPrice)} size="lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Starting Price</p>
                    <PriceDisplay amount={item.startingPrice} showIcon={false} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Bids</p>
                    <div className="flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-[#256af4]" />
                      <span className="font-bold">{item.totalBids}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Time Left</p>
                    <CountdownTimer endTime={item.endTime} />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>

                  <Separator className="bg-gray-800" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Owner:</span>
                      <span className="font-medium">{item.ownerFirstName} {item.ownerLastName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Start Time:</span>
                      <span>{formatDateTime(item.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">End Time:</span>
                      <span>{formatDateTime(item.endTime)}</span>
                    </div>
                    {item.highestBidderId && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-500" />
                        <span className="text-gray-400">Highest Bidder:</span>
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          {item.highestBidderFirstName} {item.highestBidderLastName}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Owner Actions */}
                  {isOwner && !item.isLocked && (item.totalBids ?? 0) === 0 && (
                    <div className="pt-4">
                      <Button
                        variant="destructive"
                        onClick={handleLockItem}
                        disabled={isLocking}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {isLocking ? 'Locking...' : 'Lock Item'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bid History - Coming soon */}
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
                <CardDescription>
                  {item.totalBids} {item.totalBids === 1 ? 'bid' : 'bids'} placed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Bid history details coming soon...
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Bid Form */}
          <div className="lg:col-span-1">
            <Card className="bg-[#242424] border-gray-800 sticky top-8">
              <CardHeader>
                <CardTitle>Place Your Bid</CardTitle>
                <CardDescription>
                  {validation.canBid
                    ? 'Enter your bid amount below'
                    : validation.reason}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isOwner && validation.canBid ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Your Bid Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min={(item.currentBid || item.startingPrice) + 1}
                          placeholder={`Minimum: ${(item.currentBid || item.startingPrice) + 1}`}
                          {...register('price', { valueAsNumber: true })}
                          className="pl-10 bg-[#1a1a1a] border-gray-700"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="bg-[#1a1a1a] p-3 rounded-lg text-sm space-y-1">
                      <p className="text-gray-400">Current highest bid:</p>
                      <PriceDisplay amount={(item.currentBid || item.startingPrice)} size="md" />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#256af4] hover:bg-[#1e5dd9]"
                      disabled={isPlacingBid}
                    >
                      {isPlacingBid ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Placing Bid...
                        </>
                      ) : (
                        <>
                          <Gavel className="h-4 w-4 mr-2" />
                          Place Bid
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400">
                      {isOwner
                        ? "You can't bid on your own item"
                        : validation.reason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


