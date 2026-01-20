// components/ui/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Alert className="max-w-2xl bg-white border-gray-800 text-center">
        {Icon && (
          <div className="flex justify-center mb-3">
            <Icon className="h-12 w-12 text-gray-600" />
          </div>
        )}
        <AlertTitle className="text-lg mb-2 col-span-2">{title}</AlertTitle>
        {description && (
          <AlertDescription className="mb-4 col-span-2 text-center">
            {description}
          </AlertDescription>
        )}
        {actionLabel && (actionLink || onAction) && (
          <div className="flex justify-center mt-4 col-span-2">
            {actionLink ? (
              <Link to={actionLink}>
                <Button className="bg-card hover:bg-card-foreground border text-primary hover:text-primary-foreground">
                  {actionLabel}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={onAction}
                className="bg-card hover:bg-card-foreground border text-primary hover:text-primary-foreground"
              >
                {actionLabel}
              </Button>
            )}
          </div>
        )}
      </Alert>
    </div>
  );
}
