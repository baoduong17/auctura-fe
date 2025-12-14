// components/ui/LoadingSpinner.tsx
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-b-[#256af4] border-t-transparent border-l-transparent border-r-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="flex justify-center items-center py-20">
      <LoadingSpinner size="lg" />
    </div>
  );
}
