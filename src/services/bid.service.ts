// services/bid.service.ts
import { apiClient } from './api.config';
import type { PlaceBidOnItemRequestDto, BidResponseDto } from '@/types/bid';

export const bidService = {
    async placeBid(data: PlaceBidOnItemRequestDto): Promise<BidResponseDto> {
        const response = await apiClient.post('/bids', data);
        return response.data;
    },
};
