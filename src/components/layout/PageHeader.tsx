// components/layout/PageHeader.tsx
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  description?: string;
  breadcrumbs?: BreadcrumbSegment[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  description,
  breadcrumbs = [],
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home Link */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/marketplace" className="flex items-center gap-1.5">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {breadcrumbs.map((segment, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <div key={index} className="flex items-center gap-1.5">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-white font-medium">
                        {segment.label}
                      </BreadcrumbPage>
                    ) : segment.href ? (
                      <BreadcrumbLink asChild>
                        <Link to={segment.href}>{segment.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-gray-400">{segment.label}</span>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Title & Description */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {description && (
            <p className="text-gray-400 mt-2">{description}</p>
          )}
        </div>
        
        {/* Action Buttons */}
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
