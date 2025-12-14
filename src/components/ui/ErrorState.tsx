// components/ui/ErrorState.tsx
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again.',
  onRetry,
  showHomeButton = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Link to="/">
            <Button className="bg-[#256af4] hover:bg-[#1e5dd9]">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export function ErrorPage({
  title,
  message,
  onRetry,
}: Omit<ErrorStateProps, 'showHomeButton'>) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <ErrorState title={title} message={message} onRetry={onRetry} showHomeButton />
    </div>
  );
}
