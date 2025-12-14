// components/ui/StatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { Clock, Lock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isItemActive, isAuctionEnded, isAuctionUpcoming } from '@/utils/validators';

export interface StatusBadgeProps {
  startTime: string;
  endTime: string;
  isLocked?: boolean;
  className?: string;
}

export function StatusBadge({ startTime, endTime, isLocked, className }: StatusBadgeProps) {
  if (isLocked) {
    return (
      <Badge variant="secondary" className={cn('gap-1', className)}>
        <Lock className="h-3 w-3" />
        Locked
      </Badge>
    );
  }

  if (isAuctionUpcoming(startTime)) {
    return (
      <Badge variant="outline" className={cn('gap-1', className)}>
        <Clock className="h-3 w-3" />
        Upcoming
      </Badge>
    );
  }

  if (isItemActive(startTime, endTime)) {
    return (
      <Badge className={cn('gap-1 bg-green-600 hover:bg-green-700', className)}>
        <CheckCircle className="h-3 w-3" />
        Live
      </Badge>
    );
  }

  if (isAuctionEnded(endTime)) {
    return (
      <Badge variant="destructive" className={cn('gap-1', className)}>
        <XCircle className="h-3 w-3" />
        Ended
      </Badge>
    );
  }

  return null;
}
