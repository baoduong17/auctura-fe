import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gavel } from 'lucide-react';
import type { PlaceBidForm } from '@/types/bid';

interface BidFormSectionProps {
  register: UseFormRegister<PlaceBidForm>;
  errors: FieldErrors<PlaceBidForm>;
  onSubmit: () => void;
  isSubmitting: boolean;
  minimumBid: number;
  isActive: boolean;
  isOwner: boolean;
}

export function BidFormSection({
  register,
  errors,
  onSubmit,
  isSubmitting,
  minimumBid,
  isActive,
  isOwner,
}: BidFormSectionProps) {
  if (!isActive) {
    return (
      <Card className="bg-[#242424] border-gray-800">
        <CardContent className="p-6">
          <Alert className="bg-gray-800 border-gray-700">
            <AlertDescription>
              This auction has ended. Bidding is no longer available.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isOwner) {
    return (
      <Card className="bg-[#242424] border-gray-800">
        <CardContent className="p-6">
          <Alert className="bg-gray-800 border-gray-700">
            <AlertDescription>
              You cannot bid on your own item.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#242424] border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5" />
          Place Your Bid
        </CardTitle>
        <CardDescription>
          Enter your bid amount (minimum: ${minimumBid.toFixed(2)})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-gray-200">
              Bid Amount (USD) *
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min={minimumBid}
              placeholder={minimumBid.toFixed(2)}
              {...register('price', { valueAsNumber: true })}
              className="bg-[#1a1a1a] border-gray-700 text-white"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#256af4] hover:bg-[#1e5dd9]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
