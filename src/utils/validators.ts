import type { Item } from '@/types/item';

export function isItemActive(startTime: string, endTime: string): boolean {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
}

export function canPlaceBid(
    item: Item,
    userId: string,
    bidAmount: number
): { canBid: boolean; reason?: string } {
    if (!isItemActive(item.startTime, item.endTime)) {
        const now = new Date();
        if (now < new Date(item.startTime)) {
            return { canBid: false, reason: 'Auction has not started yet' };
        }
        return { canBid: false, reason: 'Auction has ended' };
    }

    if (item.isLocked) {
        return { canBid: false, reason: 'This item is locked' };
    }

    if (item.ownerId === userId) {
        return { canBid: false, reason: 'You cannot bid on your own item' };
    }

    if (bidAmount <= (item.currentBid || item.startingPrice)) {
        return {
            canBid: false,
            reason: `Bid must be higher than current price (${item.currentBid || item.startingPrice})`,
        };
    }

    return { canBid: true };
}

export function isAuctionEnded(endTime: string): boolean {
    return new Date() > new Date(endTime);
}

export function isAuctionUpcoming(startTime: string): boolean {
    return new Date() < new Date(startTime);
}
