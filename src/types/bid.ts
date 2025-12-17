// types/bid.ts
export interface Bid {
    id: string;
    itemId: string;
    bidderId: string;
    price: number;
    createdAt: string;
}

export interface BidHistoryItem {
    id: string;
    price: string | number;
    createdAt: string;
    userId: string;
    userName: string;
}

export interface PlaceBidForm {
    itemId: string;
    price: number;
}

export interface PlaceBidOnItemRequestDto {
    itemId: string;
    price: number;
}

export interface BidResponseDto {
    id: string;
    message: string;
}
