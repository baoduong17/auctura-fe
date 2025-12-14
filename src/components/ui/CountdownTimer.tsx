// components/ui/CountdownTimer.tsx
import { Clock } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';

export interface CountdownTimerProps {
  endTime: string;
  showIcon?: boolean;
  className?: string;
}

export function CountdownTimer({ endTime, showIcon = true, className }: CountdownTimerProps) {
  const { timeLeft, isEnded } = useCountdown(endTime);

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {showIcon && <Clock className="h-4 w-4 text-gray-400" />}
      <span className={cn('text-sm', isEnded && 'text-red-500')}>
        {timeLeft}
      </span>
    </div>
  );
}
