// components/ui/PriceDisplay.tsx
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export interface PriceDisplayProps {
  amount: number | string | undefined | null;
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

  // Parse amount to number, handle string, null, undefined
  let numericAmount = 0;
  if (typeof amount === 'string') {
    numericAmount = parseFloat(amount);
  } else if (typeof amount === 'number') {
    numericAmount = amount;
  }

  // If still NaN or invalid, show placeholder
  if (isNaN(numericAmount)) {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        {showIcon && <DollarSign className="h-4 w-4 text-gray-500" />}
        <span className={cn(sizeClasses[size], 'text-gray-500')}>
          --
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {showIcon && <DollarSign className="h-4 w-4 text-green-500" />}
      <span className={sizeClasses[size]}>
        {formatCurrency(numericAmount, currency, showCurrency)}
      </span>
    </div>
  );
}
