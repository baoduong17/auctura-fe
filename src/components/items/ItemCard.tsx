// components/items/ItemCard.tsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import type { Item } from '@/types/item';
import { Eye, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ItemCardProps {
  item: Item;
  showActions?: boolean;
  className?: string;
}

export function ItemCard({ item, showActions = true, className }: ItemCardProps) {
  return (
    <Card className={cn('bg-[#242424] border-gray-800 hover:border-[#256af4] transition-colors', className)}>
      <CardHeader className="pb-4">
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

      <CardContent className="pb-4">
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {item.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Price:</span>
            <PriceDisplay amount={item.currentBid || item.startingPrice} size="md" />
          </div>

          {(item.totalBids ?? 0) > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Bids:</span>
              <span className="text-sm text-white">{item.totalBids}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Time Left:</span>
            <CountdownTimer endTime={item.endTime} />
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-4 border-t border-gray-800">
          <div className="flex gap-2 w-full">
            <Link to={`/items/${item.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            <Link to={`/items/${item.id}`} className="flex-1">
              <Button className="w-full bg-[#256af4] hover:bg-[#1e5dd9]">
                <Gavel className="h-4 w-4 mr-2" />
                Place Bid
              </Button>
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
