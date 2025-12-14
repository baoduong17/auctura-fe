// types/revenue.ts
export interface RevenueData {
    totalRevenue: number;
    itemsSold: number;
    startDate: string;
    endDate: string;
}

export interface GetRevenueByOwnerIdResponseDto extends RevenueData { }

export interface WinningBidItem {
    itemId: string;
    itemName: string;
    winningBid: number;
    bidTime: string;
}

export type GetWinningBidsByUserIdResponseDto = WinningBidItem[];
