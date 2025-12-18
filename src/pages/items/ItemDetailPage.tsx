// pages/items/ItemDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useItem } from '@/hooks/useItems';
import { usePlaceBid } from '@/hooks/useBids';
import { useLockItem } from '@/hooks/useItems';
import { BidHistoryTable } from '@/components/bids';
import { ItemInfoSection } from '@/components/items/ItemInfoSection';
import { BidFormSection } from '@/components/items/BidFormSection';
import { WinnerSection } from '@/components/items/WinnerSection';
import { ItemDetailSkeleton } from '@/components/ui/LoadingSpinner';
import { ErrorPage } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, Lock, Package } from 'lucide-react';
import { placeBidSchema } from '@/schemas/bid.schemas';
import type { PlaceBidForm } from '@/types/bid';
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

  if (isLoading) return <ItemDetailSkeleton />;

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
  const startingPrice = typeof item.startingPrice === 'string' 
    ? parseFloat(item.startingPrice) 
    : item.startingPrice;
  
  const currentPrice = item.finalPrice 
    ? (typeof item.finalPrice === 'string' ? parseFloat(item.finalPrice) : item.finalPrice)
    : startingPrice;
  
  const minimumBid = currentPrice + 0.01;
  const isActive = !item.isLocked && new Date(item.endTime) > new Date();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header with Breadcrumb */}
        <PageHeader
          title={item.name}
          description={`Starting price: $${startingPrice.toFixed(2)}${item.totalBids ? ` | Current: $${currentPrice.toFixed(2)}` : ''}`}
          breadcrumbs={
            isOwner
              ? [
                  { label: 'Dashboard', href: '/dashboard/my-items' },
                  { label: 'My Items', href: '/dashboard/my-items' },
                  { label: item.name },
                ]
              : [
                  { label: 'Marketplace', href: '/marketplace' },
                  { label: item.name },
                ]
          }
          icon={Package}
          iconColor="text-[#256af4]"
          actions={
            <Link to={isOwner ? '/dashboard/my-items' : '/marketplace'}>
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isOwner ? 'Back to My Items' : 'Back to Marketplace'}
              </Button>
            </Link>
          }
          className="mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ItemInfoSection item={item} currentPrice={currentPrice} minimumBid={minimumBid} />

            {item.winnerId && item.winnerName && item.finalPrice && (
              <WinnerSection winnerName={item.winnerName} finalPrice={currentPrice} />
            )}

            {item.bidHistory && item.bidHistory.length > 0 && (
              <Card className="bg-[#242424] border-gray-800">
                <CardHeader>
                  <CardTitle>Bid History</CardTitle>
                </CardHeader>
                <CardContent>
                  <BidHistoryTable bidHistory={item.bidHistory} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BidFormSection
              register={register}
              errors={errors}
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isPlacingBid}
              minimumBid={minimumBid}
              isActive={isActive}
              isOwner={isOwner}
            />

            {isOwner && isActive && (
              <Card className="bg-[#242424] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Owner Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowLockDialog(true)}
                    disabled={isLocking}
                  >
                    {isLocking ? 'Locking...' : 'Lock Item'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
          <AlertDialogContent className="bg-[#242424] border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle>Lock this item?</AlertDialogTitle>
              <AlertDialogDescription>
                This will prevent further bidding on this item. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLockItem} className="bg-red-600 hover:bg-red-700">
                Lock Item
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
