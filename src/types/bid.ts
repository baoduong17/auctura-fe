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
    userPicture?: string;
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

export interface MyBidItem {
    id: string;
    itemId: string;
    itemName: string;
    itemEndTime: string;
    userId: string;
    price: string;
    createdAt: string;
}

export interface MyBidsResponse {
    activeBidsCount: number;
    activeWinningBidsCount: number;
    activeWinningBidsSum: number;
    bids: MyBidItem[];
}
