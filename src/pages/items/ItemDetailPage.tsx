// pages/items/ItemDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useItem } from '@/hooks/useItems';
import { usePlaceBid } from '@/hooks/useBids';
import { useLockItem } from '@/hooks/useItems';
import { BidHistoryTable } from '@/components/bids';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { ItemDetailSkeleton, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorPage } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Lock, User, Calendar, Gavel, DollarSign, Trophy } from 'lucide-react';
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
  const [showLockDialog, setShowLockDialog] = useState(false);

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
    return <ItemDetailSkeleton />;
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
  
  // Parse prices from string to number if needed
  const startingPrice = typeof item.startingPrice === 'string' 
    ? parseFloat(item.startingPrice) 
    : item.startingPrice;
  
  const currentPrice = item.finalPrice 
    ? (typeof item.finalPrice === 'string' ? parseFloat(item.finalPrice) : item.finalPrice)
    : startingPrice;
  
  const minimumBid = currentPrice + 0.01;
  
  const validation = user?.id 
    ? canPlaceBid(item, user.id, minimumBid)
    : { canBid: false, reason: 'Please login to bid' };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Link to="/marketplace" className="text-[#256af4] hover:text-[#1e5dd9] transition-colors">
          <Button variant="ghost" className="mb-6 hover:bg-[#242424]">
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
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                        {item.name}
                      </h1>
                      <StatusBadge 
                        startTime={item.startTime}
                        endTime={item.endTime}
                        isLocked={item.isLocked}
                      />
                    </div>
                    <CardDescription className="text-gray-400 text-sm">
                      Item ID: {item.id}
                    </CardDescription>
                  </div>
                </div>

                {/* Price Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 bg-[#1e2330] p-5 rounded-xl">
                  <div>
                    <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wide">
                      Current Price
                    </p>
                    <PriceDisplay 
                      amount={currentPrice} 
                      size="lg" 
                      className="text-white font-extrabold"
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wide">
                      Starting Price
                    </p>
                    <PriceDisplay 
                      amount={startingPrice} 
                      showIcon={false}
                      className="text-gray-300"
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wide">
                      Total Bids
                    </p>
                    <div className="flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-[#256af4]" />
                      <span className="font-bold text-lg text-white">
                        {item.bidHistory?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wide">
                      Time Left
                    </p>
                    <CountdownTimer endTime={item.endTime} />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Winner Info (if auction ended) */}
                  {item.winnerId && item.winnerName && (
                    <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-amber-500" />
                        <div>
                          <p className="text-sm text-gray-400 font-medium">Winner</p>
                          <p className="text-lg font-bold text-amber-500">{item.winnerName}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-sm text-gray-400">Final Price</p>
                          <PriceDisplay 
                            amount={currentPrice} 
                            size="md" 
                            className="text-amber-500 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>

                  <Separator className="bg-gray-800" />

                  {/* Item Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Owner:</span>
                      <span className="font-medium text-white">
                        {item.ownerName || `${item.ownerFirstName || ''} ${item.ownerLastName || ''}`.trim() || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Start Time:</span>
                      <span className="text-white">{formatDateTime(item.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">End Time:</span>
                      <span className="text-white">{formatDateTime(item.endTime)}</span>
                    </div>
                    {item.bidHistory && item.bidHistory.length > 0 && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-500" />
                        <span className="text-gray-400">Highest Bidder:</span>
                        <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/10">
                          {item.bidHistory[0].userName}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Owner Actions */}
                  {isOwner && !item.isLocked && (item.bidHistory?.length || 0) === 0 && (
                    <div className="pt-4">
                      <Button
                        variant="destructive"
                        onClick={() => setShowLockDialog(true)}
                        disabled={isLocking}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {isLocking ? 'Locking...' : 'Lock Item'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bid History Table */}
            <BidHistoryTable 
              bidHistory={item.bidHistory || []} 
              totalBids={item.bidHistory?.length}
            />
          </div>

          {/* Sidebar - Bid Form */}
          <div className="lg:col-span-1">
            <Card className="bg-[#242424] border-gray-800 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Place Your Bid</CardTitle>
                <CardDescription className="text-gray-400">
                  {validation.canBid
                    ? 'Enter your bid amount below'
                    : validation.reason}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isOwner && validation.canBid ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">Your Bid Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min={minimumBid}
                          placeholder={`Minimum: ${minimumBid.toFixed(2)}`}
                          {...register('price', { valueAsNumber: true })}
                          className="pl-10 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="bg-[#1e2330] p-4 rounded-lg border border-gray-800 space-y-2">
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                        Current highest bid:
                      </p>
                      <PriceDisplay 
                        amount={currentPrice} 
                        size="md" 
                        className="text-white font-bold"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#256af4] hover:bg-[#1e5dd9] text-white shadow-lg shadow-[#256af4]/20 transition-all"
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

                    <p className="text-center text-xs text-gray-500">
                      By placing a bid, you agree to the{' '}
                      <a href="#" className="underline hover:text-[#256af4] transition-colors">
                        Terms of Service
                      </a>
                      .
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-[#1e2330] p-6 rounded-xl border border-gray-800">
                      <p className="text-gray-400 text-sm">
                        {isOwner
                          ? "You can't bid on your own item"
                          : validation.reason}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lock Item Confirmation Dialog */}
        <AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
          <AlertDialogContent className="bg-[#242424] border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Lock this item?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Locking this item will permanently remove it from the marketplace. This action cannot be undone.
                You can only lock items with no bids.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2a2a2a] border-gray-700 text-white hover:bg-[#333333]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleLockItem();
                  setShowLockDialog(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Lock Item
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}


