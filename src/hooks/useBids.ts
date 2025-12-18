// hooks/useBids.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bidService } from '@/services/bid.service';
import type { PlaceBidOnItemRequestDto } from '@/types/bid';
import { handleApiError } from '@/utils/error-handler';
import { toast } from 'sonner';

export const usePlaceBid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PlaceBidOnItemRequestDto) => bidService.placeBid(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            queryClient.invalidateQueries({ queryKey: ['my-bids'] });
            toast.success('Bid placed successfully!');
        },
        onError: (error) => {
            handleApiError(error);
        },
    });
};

export const useMyBids = () => {
    return useQuery({
        queryKey: ['my-bids'],
        queryFn: () => bidService.getMyBids(),
        staleTime: 30000, // 30 seconds
    });
};
