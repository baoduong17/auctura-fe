import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Trophy, User } from 'lucide-react';

interface WinnerSectionProps {
  winnerName: string;
  finalPrice: number;
}

export function WinnerSection({ winnerName, finalPrice }: WinnerSectionProps) {
  const initials = winnerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Trophy className="h-5 w-5" />
          Auction Winner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-yellow-400">
            <AvatarFallback className="bg-yellow-900 text-yellow-200">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-gray-400" />
              <p className="font-semibold">{winnerName}</p>
              <Badge className="bg-yellow-600 hover:bg-yellow-600">Winner</Badge>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">Winning Bid:</p>
              <PriceDisplay amount={finalPrice} size="lg" className="text-yellow-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
