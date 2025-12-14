// hooks/useBids.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
            toast.success('Bid placed successfully!');
        },
        onError: (error) => {
            handleApiError(error);
        },
    });
};
