// components/items/ItemCard.tsx
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ItemInfoRow } from "@/components/items/ItemInfoRow";
import type { Item } from "@/types/item";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDisplayName } from "@/utils/user";
import { COLORS } from "@/constants/theme";

export interface ItemCardProps {
  item: Item;
  className?: string;
}

export function ItemCard({ item, className }: ItemCardProps) {
  const navigate = useNavigate();

  const ownerDisplayName = getDisplayName(
    item.ownerName,
    item.ownerFirstName,
    item.ownerLastName
  );

  const handleCardClick = () => {
    navigate(`/items/${item.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "border-gray-800 transition-colors flex flex-col cursor-pointer",
        className
      )}
      style={{ backgroundColor: COLORS.card }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-white line-clamp-2">
            {item.name}
          </h3>
          <StatusBadge
            startTime={item.startTime}
            endTime={item.endTime}
            isLocked={item.isLocked}
          />
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {item.description}
        </p>

        <div className="space-y-2">
          <ItemInfoRow
            label="Owner"
            value={ownerDisplayName}
            icon={<User className="h-4 w-4 text-gray-400" />}
          />

          <ItemInfoRow
            label="Starting Price"
            value={
              <PriceDisplay
                amount={item.startingPrice}
                size="sm"
                showIcon={true}
                showCurrency={false}
              />
            }
          />

          <ItemInfoRow
            label="Current Price"
            value={
              <PriceDisplay
                amount={item.finalPrice}
                size="md"
                showIcon={true}
                showCurrency={false}
              />
            }
          />

          {(item.totalBids ?? 0) > 0 && (
            <ItemInfoRow label="Bids" value={item.totalBids} />
          )}

          <ItemInfoRow
            label="Time Left"
            value={<CountdownTimer endTime={item.endTime} />}
          />
        </div>
      </CardContent>
    </Card>
  );
}
