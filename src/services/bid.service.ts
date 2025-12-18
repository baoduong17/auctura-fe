// services/bid.service.ts
import { apiClient } from './api.config';
import type { PlaceBidOnItemRequestDto, BidResponseDto, MyBidsResponse } from '@/types/bid';

export const bidService = {
    async placeBid(data: PlaceBidOnItemRequestDto): Promise<BidResponseDto> {
        const response = await apiClient.post('/bids', data);
        return response.data;
    },

    async getMyBids(): Promise<MyBidsResponse> {
        const response = await apiClient.get('/bids/my-bids');
        return response.data;
    },
};
