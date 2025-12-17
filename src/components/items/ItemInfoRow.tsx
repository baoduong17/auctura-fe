// components/items/ItemInfoRow.tsx
import { cn } from '@/lib/utils';

export interface ItemInfoRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function ItemInfoRow({ label, value, icon, className }: ItemInfoRowProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span className="text-gray-400">{label}:</span>
      </div>
      <div className="text-sm text-white font-medium">{value}</div>
    </div>
  );
}
