import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Calendar, Gavel, User, DollarSign } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";
import type { Item } from "@/types/item";
import { ItemImageGallery } from "./ItemImageGallery";

interface ItemInfoSectionProps {
  item: Item;
  currentPrice: number;
  minimumBid: number;
}

export function ItemInfoSection({
  item,
  currentPrice,
  minimumBid,
}: ItemInfoSectionProps) {
  return (
    <Card className="bg-background border">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <div className="flex items-center gap-3">
              <StatusBadge
                startTime={item.startTime}
                endTime={item.endTime}
                isLocked={item.isLocked}
              />
              <CountdownTimer endTime={item.endTime} showIcon={false} />
            </div>
          </div>
        </div>

        <ItemImageGallery images={item.medias || []} itemName={item.name} />

        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-primary leading-relaxed">{item.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-primary">Owner</p>
              <p className="font-medium">{item.ownerName || "Unknown"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gavel className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-primary">Total Bids</p>
              <p className="font-medium">{item.bidHistory?.length || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-primary">Start Time</p>
              <p className="text-sm">{formatDateTime(item.startTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-primary">End Time</p>
              <p className="text-sm">{formatDateTime(item.endTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-primary">Starting Price</p>
              <PriceDisplay
                amount={item.startingPrice}
                showIcon={false}
                showCurrency={false}
                size="md"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-primary">Current Price</p>
              <PriceDisplay
                amount={currentPrice}
                showIcon={false}
                showCurrency={false}
                size="lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <Gavel className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-primary">Minimum Next Bid</p>
              <PriceDisplay
                amount={minimumBid}
                showIcon={false}
                showCurrency={false}
                size="lg"
                className="text-blue-400"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
