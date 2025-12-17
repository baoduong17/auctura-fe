// components/items/ItemCard.tsx
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { ItemInfoRow } from '@/components/items/ItemInfoRow';
import type { Item } from '@/types/item';
import { Gavel, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDisplayName } from '@/utils/user';
import { COLORS } from '@/constants/theme';

export interface ItemCardProps {
  item: Item;
  showActions?: boolean;
  className?: string;
}

export function ItemCard({ item, showActions = true, className }: ItemCardProps) {
  const navigate = useNavigate();
  
  const ownerDisplayName = getDisplayName(
    item.ownerName,
    item.ownerFirstName,
    item.ownerLastName
  );

  const handleCardClick = () => {
    navigate(`/items/${item.id}`);
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={cn('border-gray-800 transition-colors flex flex-col cursor-pointer', className)}
      style={{ backgroundColor: COLORS.card }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-white line-clamp-2">
            {item.name}
          </h3>
          <StatusBadge
            startTime={item.startTime}
            endTime={item.endTime}
            isLocked={item.isLocked}
          />
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {item.description}
        </p>

        <div className="space-y-2">
          {/* Owner Information */}
          <ItemInfoRow
            label="Owner"
            value={ownerDisplayName}
            icon={<User className="h-4 w-4 text-gray-400" />}
          />

          {/* Starting Price */}
          <ItemInfoRow
            label="Starting Price"
            value={<PriceDisplay amount={item.startingPrice} size="sm" />}
          />

          {/* Current Price */}
          <ItemInfoRow
            label="Current Price"
            value={<PriceDisplay amount={item.currentBid || item.startingPrice} size="md" />}
          />

          {/* Total Bids */}
          {(item.totalBids ?? 0) > 0 && (
            <ItemInfoRow label="Bids" value={item.totalBids} />
          )}

          {/* Time Left */}
          <ItemInfoRow
            label="Time Left"
            value={<CountdownTimer endTime={item.endTime} />}
          />
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-3 border-t border-gray-800">
          <Button 
            onClick={(e) => e.stopPropagation()}
            className="w-full text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Gavel className="h-4 w-4" />
            Place Bid
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
