// components/ui/ErrorState.tsx
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this content. Please try again.",
  onRetry,
  showHomeButton = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Alert variant="destructive" className="max-w-2xl bg-card border-red-900">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg mb-2">{title}</AlertTitle>
        <AlertDescription className="mb-4">{message}</AlertDescription>
        {(onRetry || showHomeButton) && (
          <div className="flex gap-3 mt-4 col-span-2">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Link to="/">
                <Button className="bg-red-500 hover:bg-red-600">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            )}
          </div>
        )}
      </Alert>
    </div>
  );
}

export function ErrorPage({
  title,
  message,
  onRetry,
}: Omit<ErrorStateProps, "showHomeButton">) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ErrorState
        title={title}
        message={message}
        onRetry={onRetry}
        showHomeButton
      />
    </div>
  );
}
