import { Button } from '@/components/ui/button';

export function NotificationSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
        <div>
          <p className="font-medium">Bid Notifications</p>
          <p className="text-sm text-gray-400">
            Get notified when someone bids on your items
          </p>
        </div>
        <Button variant="outline" size="sm">
          Enable
        </Button>
      </div>

      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
        <div>
          <p className="font-medium">Auction Ending Soon</p>
          <p className="text-sm text-gray-400">
            Get alerts when your auctions are about to end
          </p>
        </div>
        <Button variant="outline" size="sm">
          Enable
        </Button>
      </div>

      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
        <div>
          <p className="font-medium">Outbid Alerts</p>
          <p className="text-sm text-gray-400">
            Get notified when someone outbids you
          </p>
        </div>
        <Button variant="outline" size="sm">
          Enable
        </Button>
      </div>

      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
        <div>
          <p className="font-medium">Email Newsletter</p>
          <p className="text-sm text-gray-400">
            Receive updates and promotions via email
          </p>
        </div>
        <Button variant="outline" size="sm">
          Enable
        </Button>
      </div>
    </div>
  );
}
