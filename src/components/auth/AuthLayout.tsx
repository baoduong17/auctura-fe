// components/auth/AuthLayout.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { COLORS } from '@/constants/theme';

export interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ title, description, children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.background }}>
      <Card className={cn('w-full max-w-md border-gray-800', className)} style={{ backgroundColor: COLORS.card }}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white">{title}</CardTitle>
          <CardDescription className="text-gray-400">{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
