import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({
  title,
  description,
  children,
  className,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card
        className={cn("w-full max-w-md border-gray-800 bg-card", className)}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
