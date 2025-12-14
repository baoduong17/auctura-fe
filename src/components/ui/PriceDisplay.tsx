// components/ui/PriceDisplay.tsx
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export interface PriceDisplayProps {
  amount: number;
  currency?: string;
  showIcon?: boolean;
  showCurrency?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({
  amount,
  currency = 'USD',
  showIcon = true,
  showCurrency = true,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-bold',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {showIcon && <DollarSign className="h-4 w-4 text-green-500" />}
      <span className={sizeClasses[size]}>
        {formatCurrency(amount, currency, showCurrency)}
      </span>
    </div>
  );
}
