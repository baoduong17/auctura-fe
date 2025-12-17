// components/bids/BidHistoryTable.tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { formatDistanceToNow } from '@/utils/formatters';
import type { BidHistoryItem } from '@/types/bid';
import { User } from 'lucide-react';

interface BidHistoryTableProps {
  bidHistory: BidHistoryItem[];
  totalBids?: number;
}

export function BidHistoryTable({ bidHistory, totalBids }: BidHistoryTableProps) {
  if (!bidHistory || bidHistory.length === 0) {
    return (
      <Card className="bg-[#242424] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Bid History</CardTitle>
          <CardDescription className="text-gray-400">No bids placed yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Be the first to place a bid!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#242424] border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Bid History</CardTitle>
            <CardDescription className="text-gray-400">
              {totalBids || bidHistory.length} {(totalBids || bidHistory.length) === 1 ? 'bid' : 'bids'} placed
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-slate-800 text-slate-400 hover:bg-slate-700">
            {bidHistory.length} {bidHistory.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-[#1e2330] sticky top-0">
            <TableRow className="border-b border-gray-800 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Bidder
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Time
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bidHistory.map((bid, index) => {
              const initials = bid.userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              const isHighest = index === 0;

              return (
                <TableRow
                  key={bid.id}
                  className="border-b border-gray-800 hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback 
                          className={isHighest ? "bg-green-500 text-white" : "bg-[#256af4] text-white"}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {bid.userName}
                        </span>
                        {isHighest && (
                          <span className="text-xs text-green-400 font-medium">Highest Bid</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-slate-400">
                      {formatDistanceToNow(bid.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <PriceDisplay
                      amount={typeof bid.price === 'string' ? parseFloat(bid.price) : bid.price}
                      size={isHighest ? "md" : "sm"}
                      className={isHighest ? "font-bold text-white justify-end" : "text-slate-300 justify-end"}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
