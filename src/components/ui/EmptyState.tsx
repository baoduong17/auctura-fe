// components/ui/EmptyState.tsx
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && <Icon className="h-16 w-16 text-gray-600 mb-4" />}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-6 max-w-md">{description}</p>}
      {(actionLabel && (actionLink || onAction)) && (
        <>
          {actionLink ? (
            <Link to={actionLink}>
              <Button className="bg-[#256af4] hover:bg-[#1e5dd9]">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button onClick={onAction} className="bg-[#256af4] hover:bg-[#1e5dd9]">
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
