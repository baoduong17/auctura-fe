// hooks/useItems.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '@/services/item.service';
import type { ItemFilters, CreateItemRequestDto, UpdateItemRequestDto } from '@/types/item';
import { handleApiError } from '@/utils/error-handler';
import { toast } from 'sonner';

export const useItems = (filters?: ItemFilters) => {
    return useQuery({
        queryKey: ['items', 'non-bidded', filters],
        queryFn: () => itemService.getNonBiddedItems(filters),
    });
};

export const useItem = (id: string) => {
    return useQuery({
        queryKey: ['items', id],
        queryFn: () => itemService.getById(id),
        enabled: !!id,
    });
};

export const useMyItems = (ownerId: string) => {
    return useQuery({
        queryKey: ['items', 'owner', ownerId],
        queryFn: () => itemService.getByOwnerId(ownerId),
        enabled: !!ownerId,
    });
};

export const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateItemRequestDto) => itemService.createItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            toast.success('Item created successfully!');
        },
        onError: (error) => {
            handleApiError(error);
        },
    });
};

export const useUpdateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateItemRequestDto }) =>
            itemService.updateItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            toast.success('Item updated successfully!');
        },
        onError: (error) => {
            handleApiError(error);
        },
    });
};

export const useLockItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => itemService.lockItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            toast.success('Item locked successfully!');
        },
        onError: (error) => {
            handleApiError(error);
        },
    });
};

export const useWinningBids = (userId: string) => {
    return useQuery({
        queryKey: ['items', 'winning-bids', userId],
        queryFn: () => itemService.getWinningBids(userId),
        enabled: !!userId,
    });
};

export const useRevenue = (userId: string, startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['items', 'revenue', userId, startDate, endDate],
        queryFn: () => itemService.getRevenue(userId, startDate, endDate),
        enabled: !!userId && !!startDate && !!endDate,
    });
};
