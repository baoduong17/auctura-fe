import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface SmallStatCardProps {
  title: string;
  value: string | number | ReactNode;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
}

export function SmallStatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconClassName = 'h-8 w-8',
  valueClassName = 'text-2xl font-bold mt-1 text-white'
}: SmallStatCardProps) {
  return (
    <div className="bg-[#242424] rounded-lg p-4 border border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={valueClassName}>{value}</p>
        </div>
        <Icon className={iconClassName} />
      </div>
    </div>
  );
}
