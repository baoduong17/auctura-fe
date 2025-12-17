// services/item.service.ts
import { apiClient } from './api.config';
import type {
    CreateItemRequestDto,
    UpdateItemRequestDto,
    ItemResponseDto,
    GetNonBiddedItemsResponseDto,
    GetItemByIdResponseDto,
    GetItemsByOwnerIdResponseDto,
    ItemFilters,
} from '@/types/item';
import type { GetRevenueByOwnerIdResponseDto, GetWinningBidsByUserIdResponseDto } from '@/types/revenue';

export const itemService = {
    async createItem(data: CreateItemRequestDto): Promise<ItemResponseDto> {
        const response = await apiClient.post('/items', data);
        return response.data;
    },

    async getNonBiddedItems(filters?: ItemFilters): Promise<GetNonBiddedItemsResponseDto> {
        const response = await apiClient.get('/items/filters', { params: filters });
        return response.data;
    },

    async getById(id: string): Promise<GetItemByIdResponseDto> {
        const response = await apiClient.get(`/items/${id}`);
        return response.data;
    },

    async getByOwnerId(ownerId: string): Promise<GetItemsByOwnerIdResponseDto> {
        const response = await apiClient.get(`/items/${ownerId}/owner`);
        return response.data;
    },

    async updateItem(id: string, data: UpdateItemRequestDto): Promise<ItemResponseDto> {
        const response = await apiClient.put(`/items/${id}`, data);
        return response.data;
    },

    async lockItem(id: string): Promise<ItemResponseDto> {
        const response = await apiClient.put(`/items/${id}/lock`);
        return response.data;
    },

    async getWinningBids(userId: string): Promise<GetWinningBidsByUserIdResponseDto> {
        const response = await apiClient.get(`/items/${userId}/winning-bids`);
        return response.data;
    },

    async getRevenue(
        userId: string,
        startDate: string,
        endDate: string
    ): Promise<GetRevenueByOwnerIdResponseDto> {
        const response = await apiClient.get(`/items/${userId}/revenue`, {
            params: { startDate, endDate },
        });
        return response.data;
    },

    async downloadItemPdf(itemId: string): Promise<Blob> {
        const response = await apiClient.get(`/items/pdf/${itemId}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    async downloadWinningBidsPdf(userId: string): Promise<Blob> {
        const response = await apiClient.get(`/items/${userId}/winning-bids/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
